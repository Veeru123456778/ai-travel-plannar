import puppeteer from 'puppeteer';

export async function POST(req) {
  try {
    const { source, destination, date } = await req.json();

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const url = `https://www.railyatri.in/booking/trains-between-stations?from_code=MOZ&from_name=MUZAFFARNAGAR+JN+&journey_date=20-03-2025&src=tbs&to_code=NDLS&to_name=DELHI+JN`;

    await page.goto(url, { waitUntil: 'networkidle2' });

    const trains = await page.evaluate(() => {
      const results = [];
      const trainCards = document.querySelectorAll('div.col-xs-12.TrainSearchSection');

      trainCards.forEach((card) => {
        const name = card.querySelector('.train-name')?.innerText || 'N/A';
        const departure = card.querySelector('.boarding-time')?.innerText || 'N/A';
        const arrival = card.querySelector('.arrival-timje')?.innerText || 'N/A';
        const duration = card.querySelector('.duration')?.innerText || 'N/A';
        const price = 'Check website';

        results.push({ name, departure, arrival, duration, price });
      });
      console.log(results);
      return results;
    });

    await browser.close();

    return new Response(JSON.stringify({ trains }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch train data.' }), { status: 500 });
  }
}
