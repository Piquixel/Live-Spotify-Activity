const colorThief = new ColorThief();
const img = new Image();

const title = document.querySelector('h2');
const artist = document.querySelector('p');

const API_URL = 'https://api.lanyard.rest/v1';
const USER_ID = '383187323963047936';

const fetchResponse = async (userId) => {
	try {
		return await fetch(`${API_URL}/users/${userId}`).then((res) =>
			res.json()
		);
	} catch (err) {
		console.error(err);
	}
};

const getSpotifyActivity = async () => {
	const {
		data: { listening_to_spotify, spotify },
	} = await fetchResponse(USER_ID);

	if (!listening_to_spotify) return;

	img.addEventListener('load', () => {
		document
			.querySelector(':root')
			.style.setProperty(
				'--dominant-color',
				`rgb(${colorThief.getColor(img).join(',')})`
			);

		// for (const color in colorThief.getPalette(img)) {
		// 	const piles = document.querySelectorAll('.palette > span');
		// 	piles[color].style.backgroundColor = `rgb(${colorThief
		// 		.getPalette(img)
		// 		[color].join(',')})`;
		// }
	});

	img.crossOrigin = 'Anonymous';
	img.src = spotify.album_art_url;

	const images = document.querySelectorAll('img');
	for (const image of images) {
		image.src = spotify.album_art_url;
	}

	title.textContent = spotify.song;
	artist.textContent = spotify.artist;
};

getSpotifyActivity();
setInterval(getSpotifyActivity, 1000);
