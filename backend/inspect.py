from bs4 import BeautifulSoup

with open('beautina_real.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

product = soup.select_one('.grid__item')
if product:
    print(product.prettify()[:3000])
else:
    print("No .grid__item found")
