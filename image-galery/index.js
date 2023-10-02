const apiKey = 'WsxvXatvQCJuWcNE8EtNMRIKN8Ym6IB_zau0qKUDAN8'
const overlay = document.querySelector('.overlay');
const card = document.querySelector('.card');

let request;
let colorFilter;
let perPage

async function apiRequest(request) {
  let baseUrl = 'https://api.unsplash.com/';
  let photosUrl = 'photos?';
  let searchUrl = 'search/photos?query=';
  let clientId = `client_id=${apiKey}`;
  let url = `${baseUrl}${request ? searchUrl + request + '&' + clientId : photosUrl + clientId}${colorFilter ? '&color=' + colorFilter : ''}&per_page=${perPage}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results) {
      if (data.total === 0) {
        //show error message
        const span = document.createElement('span');
        span.classList.add('search-error');
        span.textContent = "Your search did not match any images.";
        searchInput.parentNode.appendChild(span);
        setTimeout(() => {
          span.remove()
        }, 2000);
      } else {
        showImages(data.results)
      }
    } else {
      showImages(data);
    }
  } catch (error) {
    alert("Server is not response");
  }
}

async function apiRequestPhoto(id) {
  try {
    const url = `https://api.unsplash.com/photos/${id}?client_id=${apiKey}`;
    const res = await fetch(url);
    const stats = await res.json();

    updateImageCard(stats);
  } catch (error) {
    console.error("Error:", error);
  }
}

function showImageCard() {
  overlay.classList.add('overlay_visible');
  const id = this.dataset.id;
  apiRequestPhoto(id);
}

//close imageCard
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('overlay')) {
    overlay.classList.remove('overlay_visible');
    card.classList.remove('card_visible');
  }
})

function updateImageCard(image) {
  const userLink = document.querySelector('.card__user-link');
  const userAvatar = document.querySelector('.card__user-avatar');
  const userName = document.querySelector('.card__user-name');
  const download = document.querySelector('.card__download');
  const views = document.getElementById('views');
  const downloads = document.getElementById('downloads');
  const likes = document.getElementById('likes');
  const photo = document.querySelector('.card__image');

  userLink.setAttribute('href', image.user.links.html);
  userAvatar.setAttribute('src', image.user.profile_image.medium);
  userName.innerText = image.user.name;
  views.innerText = image.views;
  downloads.innerText = image.downloads;
  likes.innerText = image.likes;
  download.dataset.download = image.urls.full;

  //show card when image is loaded
  //TODO: catch error when image unavailable
  const newImg = new Image();
  newImg.onload = function () {
    photo.setAttribute('src', this.src);
    card.classList.add('card_visible')
  }
  newImg.src = image.urls.regular;
}


function downloadImage(url) {
  fetch(url).then((res) => {
    res.blob().then((img) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(img);
      a.download = 'file';
      a.click();
    });
  }).catch((error) => {
    console.log('Error:', error);
  });
}
document.querySelector(".card__download").addEventListener("click", function (event) {
  const url = this.getAttribute("data-download");
  downloadImage(url);
});

//generate DOMelements
const gallery = document.querySelector('.gallery');

function showImages(images) {
  gallery.innerHTML = ""; //remove previous result
  images.map((imageObj) => {
    const img = document.createElement('img');
    img.classList.add('gallery-img')
    img.src = imageObj.urls.small;
    img.alt = imageObj.alt_description;
    img.dataset.id = imageObj.id;
    img.onclick = showImageCard;
    gallery.append(img);
  })
}

//color filter
let colorElements = document.querySelectorAll('.color');

colorElements.forEach(function (colorElement) {
  colorElement.addEventListener('click', function (e) {
    //remove all checked colors
    colorElements.forEach((el) => {
      el.classList.remove('checked');
    })

    colorFilter = e.target.getAttribute('aria-label');
    e.target.classList.add('checked')
    if (request) {
      apiRequest(request);
    }
  });
});

//per Page filter
let perPageSelect = document.getElementById('per-page');
perPage = perPageSelect.value;

perPageSelect.addEventListener('change', () => {
  perPage = perPageSelect.value;
  apiRequest(request);
});

const searchInput = document.querySelector('.search');
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    request = searchInput.value;
    apiRequest(request)
  }
})

const searchIcon = document.querySelector('.search-icon');
searchIcon.addEventListener('click', (e) => {
  if (searchInput.value) {
    request = searchInput.value;
    apiRequest(request)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  searchInput.focus()
  apiRequest();
});