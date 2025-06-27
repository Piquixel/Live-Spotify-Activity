"use strict";
const colorThief = new ColorThief(), root = document.querySelector(':root'), imagePlaceholder = new Image(), trackTitle = document.querySelector('h2'), trackArtist = document.querySelector('p'), API = {
    url: 'https://api.lanyard.rest/v1',
    id: '383187323963047936'
};
let currentTrack = sessionStorage['currentTrack'];
if (!trackArtist || !trackTitle)
    throw new Error('Missing elements');
const fetchResponse = async (userId) => {
    try {
        return await fetch(`${API.url}/users/${userId}`).then((res) => res.json());
    }
    catch (err) {
        console.error(err);
    }
};
const getSpotifyActivity = async () => {
    const { data: { listening_to_spotify, spotify }, } = await fetchResponse(API.id);
    if (!listening_to_spotify || spotify.track_id === currentTrack)
        return;
    currentTrack = spotify.track_id;
    imagePlaceholder.addEventListener('load', () => {
        root?.style.setProperty('--dominant-color', `rgb(${colorThief.getColor(imagePlaceholder).join(',')})`);
    });
    imagePlaceholder.crossOrigin = 'Anonymous';
    imagePlaceholder.src = spotify.album_art_url;
    const coverImages = document.querySelectorAll('img');
    for (const image of coverImages) {
        image.src = spotify.album_art_url;
    }
    trackTitle.textContent = spotify.song;
    trackArtist.textContent = spotify.artist;
};
getSpotifyActivity();
setInterval(getSpotifyActivity, 1000);
//# sourceMappingURL=main.js.map