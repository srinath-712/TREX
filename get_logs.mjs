import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log("Navigation complete or timed out");
  }

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
