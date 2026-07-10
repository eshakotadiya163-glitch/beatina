const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://beautina-cosmetic.myshopify.com/blogs/news');
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await page.type('input[type="password"]', '1');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }
  const posts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.article-card')).map(card => {
      const titleEl = card.querySelector('.article-card__title');
      const imgEl = card.querySelector('img');
      const excerptEl = card.querySelector('.article-card__excerpt');
      const dateEl = card.querySelector('.circle-divider');
      return {
        title: titleEl ? titleEl.innerText : '',
        url: titleEl && titleEl.querySelector('a') ? titleEl.querySelector('a').href : '',
        img: imgEl ? imgEl.src : '',
        excerpt: excerptEl ? excerptEl.innerText : '',
        date: dateEl ? dateEl.innerText : ''
      }
    });
  });
  console.log(JSON.stringify(posts, null, 2));
  await browser.close();
})();
