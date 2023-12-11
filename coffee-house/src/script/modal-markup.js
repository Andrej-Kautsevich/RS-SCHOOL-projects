function getModalMarkup(item) {
  return (
    `
  <div class="card">
  <div class="card__image">
    <img src="src/img/menu/coffee/coffee-1.jpg" alt="" />
  </div>
  <div class="card__content">
    <div>
      <h3 class="card__name">Irish coffee</h3>
      <p class="card__description">
        Fragrant black coffee with Jameson Irish whiskey and whipped
        milk
      </p>
    </div>
    <div class="card__select">
      <span>Size</span>
      <div class="card__buttons">
        <button class="button tabs-button" data-size="S">
          <div class="tabs-button__icon">
            <span class="icon">S</span>
          </div>
          200 ml
        </button>
        <button class="button tabs-button" data-size="M">
          <div class="tabs-button__icon">
            <span class="icon">M</span>
          </div>
          300 ml
        </button>
        <button class="button tabs-button" data-size="L">
          <div class="tabs-button__icon">
            <span class="icon">L</span>
          </div>
          400 ml
        </button>
      </div>
    </div>
    <div class="card__select">
      <span>Additives</span>
      <div class="card__buttons">
        <button class="button tabs-button" data-additives="1">
          <div class="tabs-button__icon">
            <span class="icon">1</span>
          </div>
          Sugar
        </button>
        <button class="button tabs-button" data-additives="2">
          <div class="tabs-button__icon">
            <span class="icon">2</span>
          </div>
          Cinnamon
        </button>
        <button class="button tabs-button" data-additives="3">
          <div class="tabs-button__icon">
            <span class="icon">3</span>
          </div>
          Syrup
        </button>
      </div>
    </div>
    <div class="card__total">
      <span>Total:</span>
      <span>$7.00</span>
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