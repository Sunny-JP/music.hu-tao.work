const albumSelect = document.getElementById('album-select');
const albumImageContainer = document.getElementById('album-image');
const songsListContainer = document.getElementById('songs-list-container');
const player = document.getElementById('youtube-player');

// 現在のアルバムと曲のインデックス
let currentAlbumIndex = 0;
let currentVideoIndex = 0;

// アルバムデータをフェッチ
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => populateAlbumSelect(albumsData))
    .catch(error => console.error('Error fetching albums:', error));

// プルダウンメニューにアルバム名を設定
function populateAlbumSelect(albumsData) {
    albumsData.forEach((album, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = album.title;
        albumSelect.appendChild(option);
    });

    // アルバム選択時にジャケットと曲リストを表示
    albumSelect.addEventListener('change', () => {
        const selectedAlbumIndex = albumSelect.value;
        if (selectedAlbumIndex !== '') {
            showAlbumInfo(albumsData[selectedAlbumIndex], selectedAlbumIndex);
        } else {
            clearAlbumInfo();
        }
    });
}

// アルバムのジャケットと曲リストを表示
function showAlbumInfo(album, albumIndex) {
    // アルバムのジャケットを表示
    albumImageContainer.innerHTML = '';
    const albumImage = document.createElement('img');
    albumImage.src = album.image;
    albumImageContainer.appendChild(albumImage);

    // 曲リストを表示
    songsListContainer.innerHTML = ''; // songsListContainerをクリア

    // 曲リストコンテナを作成し、SimpleBarを適用
    const songsContainer = document.createElement('div');
    songsContainer.className = 'songs-container'; // CSSでスクロール設定を適用
    songsContainer.setAttribute('data-simplebar', ''); // SimpleBarを適用するための属性を追加
    songsContainer.style.width = '55vw'; // 幅を100%に設定

    // 曲リストを生成
    album.songs.forEach((song, songIndex) => {
        const listItem = document.createElement('div');
        listItem.className = 'playlist-item';
        listItem.textContent = `${songIndex + 1}. ${song.titles['ja']}`;
        listItem.addEventListener('click', () => playVideo(albumIndex, songIndex, song.videoId));
        songsContainer.appendChild(listItem);
    });

    // songsListContainerにsongsContainerを追加し、SimpleBarを適用
    songsListContainer.appendChild(songsContainer);
    
    // SimpleBarの初期化を実行
    new SimpleBar(songsContainer, { autoHide: false });
}

// 曲を再生
function playVideo(albumIndex, songIndex, videoId) {
    currentAlbumIndex = albumIndex;
    currentVideoIndex = songIndex;
    const newSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
    player.src = newSrc;
}

// アルバム情報をクリア
function clearAlbumInfo() {
    albumImageContainer.innerHTML = '';
    songsListContainer.innerHTML = '';
}
