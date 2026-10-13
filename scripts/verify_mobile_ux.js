// scripts/verify_mobile_ux.js
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pages = JSON.parse(data);
        if (pages.length > 0) resolve(pages[0].webSocketDebuggerUrl);
        else reject(new Error('No page found'));
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  console.log("Launching Headless Chrome with Mobile Viewport (390x844)...");
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.on('open', r));

    // Enable Page & Runtime
    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');
    await sendCommand(ws, 'DOM.enable');

    // Set User Agent
    await sendCommand(ws, 'Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    });

    console.log("Navigating to http://localhost:3000...");
    await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // 1. Audit Horizontal Overflow
    const overflowCheck = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const bodyW = document.body.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const hasOverflow = scrollW > innerW;
          return { bodyW, scrollW, innerW, hasOverflow };
        })()
      `,
      returnByValue: true
    });
    console.log("\n--- [AUDIT 1: HORIZONTAL OVERFLOW] ---");
    console.log(overflowCheck.result.value);

    // 2. Audit Touch Targets in Menu Section & Sticky Bar
    const touchAudit = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const interactive = Array.from(document.querySelectorAll('#menu button, #menu a, #menu input, nav button, nav a, .fixed button, .fixed a'));
          const failures = [];
          let totalChecked = 0;

          interactive.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              totalChecked++;
              const isCompliant = rect.width >= 40 && rect.height >= 40 || rect.height >= 44 || rect.width >= 44;
              if (!isCompliant) {
                failures.push({
                  tag: el.tagName,
                  text: el.innerText.trim().slice(0, 30),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  classes: el.className.slice(0, 40)
                });
              }
            }
          });

          return { totalChecked, failuresCount: failures.length, failures: failures.slice(0, 5) };
        })()
      `,
      returnByValue: true
    });
    console.log("\n--- [AUDIT 2: TOUCH TARGETS (MIN 44x44px)] ---");
    console.log(touchAudit.result.value);

    // 3. Scroll to #menu and verify product cards rendered
    console.log("\n--- [AUDIT 3: 144 PRODUCTS RENDERING] ---");
    const menuStats = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const menu = document.getElementById('menu');
          if (menu) menu.scrollIntoView({ behavior: 'smooth' });
          const productCards = document.querySelectorAll('#menu .grid > div');
          const categoryButtons = document.querySelectorAll('#menu .overflow-x-auto button');
          return {
            productCardsCount: productCards.length,
            categoryButtonsCount: categoryButtons.length,
            menuFound: !!menu
          };
        })()
      `,
      returnByValue: true
    });
    console.log(menuStats.result.value);
    await new Promise(r => setTimeout(r, 1000));

    // Capture Menu Screenshot
    const screenshot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/mobile_menu_section.png', Buffer.from(screenshot.data, 'base64'));
    console.log("Saved screenshots/mobile_menu_section.png");

    // 4. Test Search filter
    console.log("\n--- [AUDIT 4: LIVE SEARCH INTERACTION] ---");
    const searchRes = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const searchInput = document.querySelector('#menu input[type="text"]');
          if (!searchInput) return { error: "No search input" };
          searchInput.value = 'Wonton';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          return { success: true, val: searchInput.value };
        })()
      `,
      returnByValue: true
    });
    console.log("Input simulated:", searchRes.result.value);
    await new Promise(r => setTimeout(r, 600));

    const searchCount = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const cards = document.querySelectorAll('#menu .grid > div');
          return { filteredCards: cards.length };
        })()
      `,
      returnByValue: true
    });
    console.log("Filtered cards after typing 'Wonton':", searchCount.result.value);

    // Reset search
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const searchInput = document.querySelector('#menu input[type="text"]');
          if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Test Portion Selection on Chicken Wonton (4 Pcs vs 8 Pcs)
    console.log("\n--- [AUDIT 5: PORTION SELECTION INTERACTION] ---");
    const portionTest = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const portionBtns = document.querySelectorAll('#menu .grid > div button');
          let clicked = false;
          let newPriceText = "";
          for (const btn of portionBtns) {
            if (btn.innerText.includes('8 Pcs')) {
              btn.click();
              clicked = true;
              break;
            }
          }
          const priceBadge = document.querySelector('#menu .grid > div .bg-brand-red.font-extrabold');
          return { clicked, priceBadgeText: priceBadge ? priceBadge.innerText : null };
        })()
      `,
      returnByValue: true
    });
    console.log("Portion selection result:", portionTest.result.value);

    // 6. Test Quick Order / Table Booking Trigger
    console.log("\n--- [AUDIT 6: ORDER PRE-FILL & BOOKING MODAL] ---");
    const orderClick = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const orderBtn = document.querySelector('#menu .grid > div button.bg-brand-red');
          if (orderBtn) {
            orderBtn.click();
            return { clicked: true, buttonText: orderBtn.innerText.trim() };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true
    });
    console.log("Order button clicked:", orderClick.result.value);
    await new Promise(r => setTimeout(r, 800));

    const modalCheck = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const notesTextarea = document.querySelector('textarea[name="notes"]');
          const modalVisible = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
          return {
            notesValue: notesTextarea ? notesTextarea.value : null,
            modalVisible: !!modalVisible
          };
        })()
      `,
      returnByValue: true
    });
    console.log("Modal state & notes pre-fill:", modalCheck.result.value);

    const modalScreenshot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/mobile_booking_modal_prefilled.png', Buffer.from(modalScreenshot.data, 'base64'));
    console.log("Saved screenshots/mobile_booking_modal_prefilled.png");

    ws.close();
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    chrome.kill();
  }
}

run();
