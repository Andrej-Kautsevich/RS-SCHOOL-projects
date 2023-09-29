const url = 'https://api.unsplash.com/photos/?client_id=WsxvXatvQCJuWcNE8EtNMRIKN8Ym6IB_zau0qKUDAN8'




async function getData() {
	const res = await fetch(url);
	const data = await res.json();
	console.log(data);
	showImages(data);
}
getData();

function showData(data) {

}


//generate DOMelements
const gallery = document.querySelector('.gallery');

function showImages(images) {
	images.map((imageObj) => {
		const img = document.createElement('img');
		img.classList.add('gallery-img')
		img.src = imageObj.urls.regular;
		img.alt = `image`;
		gallery.append(img);
	})
}