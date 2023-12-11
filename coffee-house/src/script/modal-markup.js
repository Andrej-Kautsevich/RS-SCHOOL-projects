function getModalMarkup(item, index) {
  return (
    `
  <div class="card">
  <div class="card__image">
    <img src="src/img/menu/${item.category}/${item.category}-${index + 1}.jpg" alt="${item.name} photo" />
  </div>
  <div class="card__content">
    <div>
      <h3 class="card__name">${item.name}</h3>
      <p class="card__description">
      ${item.description}
      </p>
    </div>
    <div class="card__select">
      <span>Size</span>
      <div class="card__buttons">
        <button class="button tabs-button tabs-button_active" data-size="${Object.keys(item.sizes)[0]}">
          <div class="tabs-button__icon">
            <span class="icon">${Object.keys(item.sizes)[0].toUpperCase()}</span>
          </div>
          ${Object.values(item.sizes)[0].size}
        </button>
        <button class="button tabs-button" data-size="${Object.keys(item.sizes)[1]}">
          <div class="tabs-button__icon">
            <span class="icon">${Object.keys(item.sizes)[1].toUpperCase()}</span>
          </div>
          ${Object.values(item.sizes)[1].size}
        </button>
        <button class="button tabs-button" data-size="${Object.keys(item.sizes)[2]}">
          <div class="tabs-button__icon">
            <span class="icon">${Object.keys(item.sizes)[2].toUpperCase()}</span>
          </div>
          ${Object.values(item.sizes)[2].size}
        </button>
      </div>
    </div>
    <div class="card__select">
      <span>Additives</span>
      <div class="card__buttons">
        <button class="button tabs-button" data-additives="0">
          <div class="tabs-button__icon">
            <span class="icon">1</span>
          </div>
          ${Object.values(item.additives)[0].name}
        </button>
        <button class="button tabs-button" data-additives="1">
          <div class="tabs-button__icon">
            <span class="icon">2</span>
          </div>
          ${Object.values(item.additives)[1].name}
        </button>
        <button class="button tabs-button" data-additives="2">
          <div class="tabs-button__icon">
            <span class="icon">3</span>
          </div>
          ${Object.values(item.additives)[2].name}
        </button>
      </div>
    </div>
    <div class="card__total">
      <span>Total:</span>
      <span class="card__total-price">$${item.price}</span>
    </div>
    <div class="card__alert">
      <span class="icon icon_info"></span>
      <span class="card__alert-text"
        >The cost is not final. Download our mobile app to see the
        final price and place your order. Earn loyalty points and
        enjoy your favorite coffee with up to 20% discount.</span
      >
    </div>
    <button class="button button_secondary menu__modal-close">Close</button>
  </div>
</div>
`)
}

export default getModalMarkup;