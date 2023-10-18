import { getRandomFloat, getRandomInt } from "./calculations.js";

let priceIntervals = [];
const MIX_PRICE = 0.30
const MAX_PRICE = 1.40

// get random oil price
function changePrice(startPrice, changeCallback) {
  let price = startPrice;
  let targetPrice = getRandomFloat(MIX_PRICE, MAX_PRICE);
  let duration = getRandomInt(15000, 80000); //change duration between 15 and 80 seconds
  let interval = 2000; //set intermediate price every 2 second 
  let change = (targetPrice - price) / (duration / interval);

  let intervalID = setInterval(function () {
    price += change;
    changeCallback(price);

    if (Math.abs(price - targetPrice) <= Math.abs(change)) {
      clearInterval(intervalID);
      priceIntervals = priceIntervals.filter(id => id !== intervalID);
      changeCallback(targetPrice);
      //start new price change
      changePrice(targetPrice, changeCallback);
    }
  }, interval);
  priceIntervals.push(intervalID);
}

function updateMoneyBox(money) {
  const moneyBox = document.getElementById('money');
  const moneyToShow = Math.floor(money);
  moneyBox.innerText = `$ ${moneyToShow}`

  const rigPrice = document.getElementById('rig-price');
  const wagonPrice = document.getElementById('wagon-price');

  if (money < 350) {
    rigPrice.classList.add('menu-price_red')
  } else {
    rigPrice.classList.remove('menu-price_red')
  }

  if (money < 200) {
    wagonPrice.classList.add('menu-price_red')
  } else {
    wagonPrice.classList.remove('menu-price_red')
  }
}

export {
  changePrice,
  updateMoneyBox,
  priceIntervals,
}