function getProductMarkup(category, item, index) {
  return (
    `
  <div class="menu__item product" data-item-index="${index}">
    <div class="product__image">
      <img
        src="src/img/menu/${category}/${category}-${index + 1}.jpg"
        alt="${item.name} photo"
      />
    </div>
    <div class="product__description">
      <h3 class="product__name">${item.name}</h3>
      <p class="product__text">
      ${item.description}
      </p>
      <p class="product__price">${item.price}</p>
    </div>
  </div>
</div>
  `
  )
}

export default getProductMarkup;