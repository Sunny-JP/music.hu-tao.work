const playlistContainer = document.getElementById('playlist-container');
const player = document.getElementById('youtube-player');
let currentAlbumIndex = 0;
let currentVideoIndex = 0;

// Fetch album data from JSON file
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => createAlbums(albumsData))
    .catch(error => console.error('Error fetching albums:', error));

// Function to create albums with swiper
function createAlbums(albumsData) {
    const swiperContainer = document.getElementById('swiper-container');
    const albumsWrapper = document.createElement('div');
    albumsWrapper.className = 'swiper-wrapper';

    albumsData.forEach((album, albumIndex) => {
        const albumElement = document.createElement('div');
        albumElement.className = 'album swiper-slide';

        // Left Pane: Album Image and Name
        const leftPane = document.createElement('div');
        leftPane.className = 'left-pane';

        // Add album image
        const albumImage = document.createElement('img');
        albumImage.src = album.image;
        leftPane.appendChild(albumImage);

        // Add album name
        const albumName = document.createElement('h3');
        albumName.textContent = album.title;
        leftPane.appendChild(albumName);

        albumElement.appendChild(leftPane);

        // Right Pane: Songs List
        const rightPane = document.createElement('div');
        rightPane.className = 'right-pane';

        const songsContainer = document.createElement('div');
        songsContainer.className = 'songs-container';
        album.songs.forEach((song, songIndex) => {
            const listItem = document.createElement('div');
            listItem.className = 'playlist-item';
            const title = song.titles['ja'];
            listItem.textContent = `${songIndex + 1}. ${title}`;
            listItem.addEventListener('click', () => playVideo(albumIndex, songIndex, song.videoId));
            songsContainer.appendChild(listItem);
        });

        rightPane.appendChild(songsContainer);
        albumElement.appendChild(rightPane);

        albumsWrapper.appendChild(albumElement);
    });

    swiperContainer.appendChild(albumsWrapper);

    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
    });
}

// Function to play video
function playVideo(albumIndex, songIndex, videoId) {
    currentAlbumIndex = albumIndex;
    currentVideoIndex = songIndex;
    const newSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
    player.src = newSrc;
    player.load();
    player.addEventListener('ended', playNextVideo);
}

// Function to play the next video
function playNextVideo() {
    const albums = document.getElementsByClassName('album');
    const currentAlbum = albums[currentAlbumIndex];
    const playlistItems = currentAlbum.getElementsByClassName('playlist-item');
    currentVideoIndex++;
    if (currentVideoIndex < playlistItems.length) {
        const nextItem = playlistItems[currentVideoIndex];
        const videoId = getVideoIdFromItem(nextItem.textContent);
        playVideo(currentAlbumIndex, currentVideoIndex, videoId);
    } else {
        // Playlist ended, move to the next album
        currentVideoIndex = 0;
        currentAlbumIndex++;
        if (currentAlbumIndex < albums.length) {
            const nextAlbum = albums[currentAlbumIndex];
            const firstItem = nextAlbum.getElementsByClassName('playlist-item')[0];
            const videoId = getVideoIdFromItem(firstItem.textContent);
            playVideo(currentAlbumIndex, 0, videoId);
        } else {
            // All albums ended, reset to the first album and first song
            currentAlbumIndex = 0;
            currentVideoIndex = 0;
        }
    }
}

// Function to extract videoId from playlist item text
function getVideoIdFromItem(itemText) {
    const match = itemText.match(/\. (.*)/);
    return match ? match[1] : null;
}
