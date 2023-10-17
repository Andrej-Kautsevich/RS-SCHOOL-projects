let priceIntervals = [];
function changePrice(startPrice, changeCallback) {
  let price = startPrice;
  let targetPrice = getRandomFloat(0.40, 1.40);
  let duration = getRandomInt(15000, 80000);
  let interval = 2000;
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

// Генерация случайного вещественного числа в заданном диапазоне
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Генерация случайного целого числа в заданном диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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