/* eslint-disable camelcase */

// Define API default variables
const defaultId = '383187323963047936'

const fetchResponse: FetchUserFunction = async (userId) => {
  if (userId.length !== 18 || /[a-zA-Z]/.test(userId)) {
    userId = defaultId
  }
  try {
    return await fetch('https://api.lanyard.rest/v1/users/' + userId).then((res) =>
      res.json()
    )
  } catch (err) {
    console.error(err)
  }
}

const colorThief = new ColorThief()
const imagePlaceholder = new Image()

const root = document.querySelector(':root') as HTMLElement
const activityStatus = document.getElementById('activity-status') as HTMLElement
const trackTitle = document.getElementById('track-title') as HTMLElement
const trackArtist = document.getElementById('track-artist') as HTMLElement
const userSelect = document.getElementById('user-select') as HTMLButtonElement
const overlayContainer = document.querySelector('.overlayContainer') as HTMLElement

const initialTitle = document.title

let currentTrack = ''
let currentUser = ''

const getActivity = async () => {
  const { data: { listening_to_spotify, spotify } } = await fetchResponse(currentUser)

  if (!listening_to_spotify || spotify.track_id === currentTrack) return

  currentTrack = spotify.track_id

  imagePlaceholder.addEventListener('load', () => {
    root?.style.setProperty(
      '--dominant-color',
      `rgb(${colorThief.getColor(imagePlaceholder).join(',')})`
    )
  })

  imagePlaceholder.crossOrigin = 'Anonymous'
  imagePlaceholder.src = spotify.album_art_url

  const coverImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('img')

  for (const image of coverImages) {
    image.src = spotify.album_art_url
  }

  trackTitle.textContent = spotify.song

  const artists = spotify.artist.split('; ')
  if (artists.length > 1) {
    trackArtist.textContent = artists.join(', ').replace(/, ([^,]*)$/, ' & $1')
  } else {
    trackArtist.textContent = artists[0]
  }

  document.title = `${initialTitle} - ${trackTitle.textContent} by ${trackArtist.textContent}`
}

const getUser = async () => {
  const { data: { discord_user: { display_name: userDisplayName } } } = await fetchResponse(currentUser)

  if (currentUser !== userDisplayName) {
    userSelect.textContent = userDisplayName
    activityStatus.innerHTML = '• Listening to Spotify'
  }
}

const showEditModal = () => {
  const form = document.createElement('form')
  const label = document.createElement('label')
  label.htmlFor = 'user-id-input'
  label.textContent = 'User\'s Discord ID'
  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'user-id-input'
  input.placeholder = '383187323963047936'
  input.minLength = 18
  input.maxLength = 18
  input.required = true
  input.value = currentUser
  const span = document.createElement('span')
  const cancel = document.createElement('button')
  cancel.type = 'reset'
  cancel.textContent = 'Cancel'
  cancel.addEventListener('click', () => overlayContainer.removeChild(form))
  const confirm = document.createElement('button')
  confirm.type = 'submit'
  confirm.textContent = 'Confirm'
  confirm.addEventListener('click', (e) => {
    e.preventDefault()
    currentUser = input.value
    getUser()
    overlayContainer.removeChild(form)
  })
  span.append(cancel, confirm)
  form.append(label, input, span)
  overlayContainer.appendChild(form)
}

userSelect.addEventListener('click', showEditModal)

getUser()
getActivity()
setInterval(getActivity, 1000)
