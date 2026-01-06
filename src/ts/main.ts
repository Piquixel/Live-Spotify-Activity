import { DEFAULT_ID, API_BASE, INITIAL_TITLE } from './constants.js'
import { formatArtists, isValid } from './utils.js'

// State Management
const state = {
  currentUser: DEFAULT_ID,
  currentTrack: '',
}

// UI Elements Cache
const UI = {
  root: document.querySelector(':root') as HTMLElement,
  status: document.getElementById('activity-status'),
  trackTitle: document.querySelector('.spotify-track__title'),
  trackArtist: document.querySelector('.spotify-track__artist'),
  userButton: document.getElementById('set-listener-id-btn') as HTMLButtonElement,
  images: document.querySelectorAll<HTMLImageElement>('img')
}

const colorThief = new ColorThief()
const colorSampler = new Image()
colorSampler.crossOrigin = 'Anonymous'

/**
 * Fetch data from Lanyard API
*/
async function fetchLanyard (userId: string): Promise<LanyardFile | null> {
  const id = isValid(userId) ? userId : DEFAULT_ID

  try {
    const response = await fetch(`${API_BASE}${id}`)
    if (!response.ok) throw new Error(response.statusText)
    return await response.json()
  } catch (err) {
    console.error('Failed to fetch Lanyard Data', err)
    return null
  }
}

/**
 * Updates the UI with new Spotify data
 */
function updateSpotifyUI (spotify: SpotifyObject): void {
  if (state.currentTrack === spotify.track_id) return
  state.currentTrack = spotify.track_id

  // 1. Update Text content
  if (UI.trackTitle) UI.trackTitle.textContent = spotify.song
  if (UI.trackArtist) UI.trackArtist.textContent = formatArtists(spotify.artist)

  // 2. Update Document Title
  document.title = `${INITIAL_TITLE} - ${spotify.song}`

  // 3. Update Images
  UI.images.forEach(img => (img.src = spotify.album_art_url))

  // 4. Update Theme Color (Dominant Color)
  colorSampler.src = spotify.album_art_url
}

/**
 * Unloads the Spotify UI
 */
function unloadSpotifyUI (): void {
  if (UI.trackTitle) UI.trackTitle.textContent = ''
  if (UI.trackArtist) UI.trackArtist.textContent = ''
  document.title = INITIAL_TITLE
  colorSampler.src = ''
  UI.images.forEach(img => (img.src = ''))
  UI.root?.style.removeProperty('--dominant-color')
}

// Color processing event
colorSampler.addEventListener('load', () => {
  const [r, g, b] = colorThief.getColor(colorSampler)
  UI.root?.style.setProperty('--dominant-color', `rgb(${r},${g},${b})`)
})

// Main loop logic
async function tick (): Promise<void> {
  const res = await fetchLanyard(state.currentUser)
  if (!res?.success) return

  const { listening_to_spotify: listening, spotify, discord_user: discordUser } = res.data

  // Update User Display Name
  if (UI.userButton) UI.userButton.textContent = discordUser.display_name

  if (listening && spotify) {
    updateSpotifyUI(spotify)
    if (UI.status) UI.status.textContent = '• Listening to Spotify'
  } else {
    unloadSpotifyUI()
    if (UI.status) UI.status.textContent = '• Offline / Not Listening'
  }
}

/**
 * Event Listeners
 */
UI.userButton?.addEventListener('click', () => {
  const newId = prompt('Enter a Discord User ID', state.currentUser) || DEFAULT_ID
  if (newId && isValid(newId)) {
    state.currentUser = newId.trim()
    state.currentTrack = '' // Reset to force UI update
    tick()
  }
})

// Initialize
function init (): void {
  tick()
  setInterval(tick, 2000) // 2s is gentler on the API and sufficient for status
}

init()
