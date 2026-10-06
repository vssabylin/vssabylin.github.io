export function calculateQuote(config, index) {
  if (!Number.isInteger(index) || index < 0 || index >= config.packs.length) throw new RangeError('Unknown credit pack');
  const pack = config.packs[index];
  const seatPrice = config.creators * config.roles[0].price + config.contributors * config.roles[1].price;
  const seatCredits = config.creators * config.roles[0].credits + config.contributors * config.roles[1].credits;
  return {pack, seatPrice, monthly:seatPrice + pack.price, annual:(seatPrice + pack.price)*12, credits:seatCredits + pack.credits};
}

if (typeof document !== 'undefined') {
  const data = document.getElementById('agency-pricing-data');
  if (data) {
    const config = JSON.parse(data.textContent);
    const slider = document.getElementById('credit-pack-slider');
    const buttons = [...document.querySelectorAll('.credit-stops button')];
    const count = n => n.toLocaleString('en-US');
    const money = n => '$' + count(n);
    const elements = Object.fromEntries(['credit-amount','credit-unit-price','credit-pack-price','quote-pack-label','quote-pack-price','agency-monthly','agency-annual','agency-credit-pool'].map(id=>[id,document.getElementById(id)]));
    function update(index) {
      const q = calculateQuote(config, index);
      slider.value = index;
      slider.setAttribute('aria-valuetext',`${count(q.pack.credits)} credits per month; ${money(q.pack.price)} per month`);
      slider.style.setProperty('--position',`${index/(config.packs.length-1)*100}%`);
      const values = {'credit-amount':count(q.pack.credits),'credit-unit-price':q.pack.rateLabel,'credit-pack-price':money(q.pack.price),'quote-pack-label':q.pack.label,'quote-pack-price':money(q.pack.price),'agency-monthly':money(q.monthly),'agency-annual':money(q.annual),'agency-credit-pool':count(q.credits)};
      for (const [id,value] of Object.entries(values)) elements[id].textContent = value;
      buttons.forEach((b,i)=>b.setAttribute('aria-pressed',i===index));
    }
    slider.addEventListener('input',()=>update(Number(slider.value)));
    buttons.forEach(button=>button.addEventListener('click',()=>update(Number(button.dataset.pack))));
    update(config.defaultPack);
  }
}
