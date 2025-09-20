const colorThief = new ColorThief();
const img = document.querySelector('.cover');

const getRandomImage = (arLength) => {
	const num = Math.floor(Math.random() * arLength + 1);
	const beauty = document.querySelectorAll('.container > img');
	img.setAttribute('src', `pics/pic-${num}.jpg`);
	for (let i = 0; i < beauty.length; i++) {
		beauty[i].setAttribute('src', `pics/pic-${num}.jpg`);
	}
}

// Make sure image is finished loading
getRandomImage(8);
setTimeout(() => {
	if (img.complete) {
	colorThief.getColor(img);
	console.log('ready');
	document.querySelector('.sidebar').style.backgroundColor = `rgb(
	${colorThief.getColor(img)[0]},
	${colorThief.getColor(img)[1]},
	${colorThief.getColor(img)[2]}
)`;
} else {
	img.addEventListener('load', function() {
		colorThief.getColor(img);
	});
}
}, 20);
