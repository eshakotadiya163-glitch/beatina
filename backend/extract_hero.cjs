const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('beautina_real_unlocked.html', 'utf8');
const $ = cheerio.load(html);

const slides = [];
$('.slideshow__slide').each((i, el) => {
  slides.push({
    title: $(el).find('.slideshow__title').text().trim(),
    subtitle: $(el).find('.slideshow__subtitle').text().trim(),
    toptitle: $(el).find('.slideshow__toptitle').text().trim(),
    buttonText: $(el).find('.slideshow__btn').text().trim()
  });
});

console.log(slides);
