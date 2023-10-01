const apiKey = 'WsxvXatvQCJuWcNE8EtNMRIKN8Ym6IB_zau0qKUDAN8'
const overlay = document.querySelector('.overlay');

let request

async function apiRequest(request) {
	let url;
	if (request !== undefined) {
		url = `https://api.unsplash.com/search/photos?query=${request}&client_id=${apiKey}&per_page=20`;
	} else {
		url = `https://api.unsplash.com/photos?client_id=${apiKey}&per_page=20`;
	}

	try {
		const res = await fetch(url);
		const data = await res.json();
		if (data.results) {
			showImages(data.results)
		} else {
			showImages(data);
		}
		console.log(data)
	} catch (error) {
		alert("Server is not response");
	}
}
apiRequest();

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
	const id = this.dataset.id;
	apiRequestPhoto(id);
}

//close imageCard
overlay.addEventListener('click', (e) => {
	if (e.target.classList.contains('overlay')) {
		overlay.classList.remove('overlay_visible');
		const photo = document.querySelector('.card__image');
		photo.setAttribute('src', "");
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
		overlay.classList.add('overlay_visible')
	}
	newImg.src = image.urls.regular;
}

const searchInput = document.querySelector('.search');

searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		request = searchInput.value;
		apiRequest(request)
	}
})

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




document.addEventListener("DOMContentLoaded", () => searchInput.focus());