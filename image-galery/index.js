let url = new URL("https://api.unsplash.com")
let params = new URLSearchParams(url.search); //api request parameters
let request
const apiKey = 'WsxvXatvQCJuWcNE8EtNMRIKN8Ym6IB_zau0qKUDAN8'
params.set("client_id", apiKey);
url.search = params.toString();

async function apiRequest(request) {
	//if there are no request, show random photos
	if (request !== undefined) {
		params.set("query", request);
		url.search = params.toString();
		url.pathname = "/search/photos";
	} else {
		url.pathname = "/photos";
	}
	try {
		const res = await fetch(url);
		const data = await res.json();
		if (data.results) {
			showImages(data.results)
		} else {
			showImages(data);
		}
		console.log(data, url)
	} catch (error) {
		alert("Server is not response");
	}
}
apiRequest();

const searchInput = document.querySelector('.search');

searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
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