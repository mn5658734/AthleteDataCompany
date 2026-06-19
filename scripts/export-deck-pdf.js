/**
 * Export deck-review.html to ADC-Pitch-Deck-Review.pdf
 * Usage: node scripts/export-deck-pdf.js
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'deck-review.html');
const PDF = path.join(ROOT, 'ADC-Pitch-Deck-Review.pdf');

async function exportWithPlaywright() {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('file://' + HTML, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const slideCount = await page.locator('.slide').count();
  const PDFDocument = require('pdf-lib').PDFDocument;
  const merged = await PDFDocument.create();

  for (let i = 0; i < slideCount; i++) {
    await page.evaluate(function (idx) {
      document.querySelectorAll('.slide').forEach(function (el, j) {
        el.style.display = j === idx ? 'block' : 'none';
      });
    }, i);

    const buf = await page.pdf({
      width: '1280px',
      height: '720px',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    const doc = await PDFDocument.load(buf);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(function (p) { merged.addPage(p); });
  }

  fs.writeFileSync(PDF, await merged.save());
  await browser.close();
  console.log('Slides exported:', slideCount);
}

async function exportWithPuppeteer() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + HTML, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: PDF,
    width: '1280px',
    height: '720px',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true
  });
  await browser.close();
}

async function main() {
  if (!fs.existsSync(HTML)) {
    console.error('Missing deck-review.html');
    process.exit(1);
  }

  try {
    await exportWithPlaywright();
    console.log('PDF exported with Playwright:', PDF);
    return;
  } catch (e) {
    console.log('Playwright unavailable, trying Puppeteer...', e.message);
  }

  try {
    await exportWithPuppeteer();
    console.log('PDF exported with Puppeteer:', PDF);
    return;
  } catch (e) {
    console.error('PDF export failed. Open deck-review.html and use Print → Save as PDF.');
    console.error(e.message);
    process.exit(1);
  }
}

main();
