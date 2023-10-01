let url = new URL ("https://api.unsplash.com/search/photos")
let params = new URLSearchParams(url.search); //api request parameters
let request = 'null';
const apiKey = 'WsxvXatvQCJuWcNE8EtNMRIKN8Ym6IB_zau0qKUDAN8'
params.set("client_id", apiKey);
url.search = params.toString(); 

async function apiRequest(request) {
	params.set("query", request);
	url.search = params.toString(); 
	const res = await fetch(url);
	const data = await res.json();
	if (data.results) {
		showImages(data.results)
	} else {
		showImages(data);
	}
}
apiRequest();

const searchInput = document.querySelector('.search');

searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		console.log('Enter')
		request = searchInput.value;
		apiRequest(request)
	}
})

//generate DOMelements
const gallery = document.querySelector('.gallery');

function showImages(images) {
	gallery.innerHTML = ""; //remove previous result
	images.map((imageObj) => {
		const img = document.createElement('img');
		img.classList.add('gallery-img')
		img.src = imageObj.urls.regular;
		img.alt = `image`;
		gallery.append(img);
	})
}

document.addEventListener("DOMContentLoaded", () => searchInput.focus());