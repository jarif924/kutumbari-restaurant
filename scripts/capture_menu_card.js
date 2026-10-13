// scripts/capture_menu_card.js
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    '--window-size=390,844',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9224/json/list', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const wsUrl = targets[0].webSocketDebuggerUrl;
      const ws = new WebSocket(wsUrl);

      let msgId = 1;
      const send = (method, params = {}) => new Promise((resolve, reject) => {
        const id = msgId++;
        const onMsg = (data) => {
          const res = JSON.parse(data);
          if (res.id === id) {
            ws.removeListener('message', onMsg);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.on('message', onMsg);
        ws.send(JSON.stringify({ id, method, params }));
      });

      ws.on('open', async () => {
        try {
          await send('Page.enable');
          await send('Runtime.enable');
          await send('Page.navigate', { url: 'http://localhost:3000' });
          await new Promise(r => setTimeout(r, 2000));

          // Scroll to #menu
          await send('Runtime.evaluate', {
            expression: 'document.getElementById("menu").scrollIntoView();'
          });
          await new Promise(r => setTimeout(r, 1200));

          const res = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('screenshots/mobile_menu_scrolled_view.png', Buffer.from(res.data, 'base64'));
          console.log('SUCCESS: Saved screenshots/mobile_menu_scrolled_view.png');

          // Also scroll down a bit into the product cards
          await send('Runtime.evaluate', {
            expression: 'window.scrollBy(0, 480);'
          });
          await new Promise(r => setTimeout(r, 800));

          const res2 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync('screenshots/mobile_menu_cards_view.png', Buffer.from(res2.data, 'base64'));
          console.log('SUCCESS: Saved screenshots/mobile_menu_cards_view.png');

          ws.close();
          chrome.kill();
          process.exit(0);
        } catch (e) {
          console.error("Error:", e);
          ws.close();
          chrome.kill();
          process.exit(1);
        }
      });
    });
  });
}

main();
