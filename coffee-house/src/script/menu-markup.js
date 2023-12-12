function getProductMarkup(category, item, index) {
  return (
    `
  <div class="menu__item product" data-item-index="${index}">
    <div class="product__image-wrapper">
      <div class="spinner">
        <svg class="icon icon_spinner"></svg>
      </div>
      <img
        class = "product__image"
        style = "display: none"
        src="src/img/menu/${category}/${category}-${index + 1}.jpg"
        alt="${item.name} photo"
      />
    </div>
    <div class="product__description">
      <h3 class="product__name">${item.name}</h3>
      <p class="product__text">
      ${item.description}
      </p>
      <p class="product__price">$${item.price}</p>
    </div>
  </div>
</div>
  `
  )
}

export default getProductMarkup;