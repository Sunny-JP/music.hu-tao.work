const albumSelect = document.getElementById('album-select');
const songsListContainer = document.getElementById('songs-list-container');
const player = document.getElementById('youtube-player');
const languageSelect = document.getElementById('language-select');

// 現在のアルバムと曲のインデックス
let currentAlbumIndex = 0;
let currentVideoIndex = 0;

// 初期言語は日本語
let currentLanguage = 'ja';

// アルバムデータをフェッチ
function fetchAlbums() {
    fetch(`albums/albums-${currentLanguage}.json`)
        .then(response => response.json())
        .then(albumsData => populateAlbumSelect(albumsData))
        .catch(error => console.error('Error fetching albums:', error));
}

// プルダウンメニューにアルバム名を設定
function populateAlbumSelect(albumsData) {
    albumSelect.innerHTML = ''; // 既存のオプションをクリア

    // デフォルトオプションを追加
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select an album --';
    albumSelect.appendChild(defaultOption);

    albumsData.forEach((album, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = album.title;
        albumSelect.appendChild(option);
    });

    // アルバム選択時に曲リストを表示
    albumSelect.addEventListener('change', () => {
        const selectedAlbumIndex = albumSelect.value;
        if (selectedAlbumIndex !== '') {
            showAlbumInfo(albumsData[selectedAlbumIndex], selectedAlbumIndex);
        } else {
            clearAlbumInfo();
        }
    });
}

// 言語切り替えボタンのイベントリスナー
languageSelect.addEventListener('change', (event) => {
  currentLanguage = event.target.value; // 選択された言語を更新
  fetchAlbums(); // 新しい言語のアルバムデータを取得
});

// 初回データ取得
fetchAlbums();

// アルバムの曲リストを表示
function showAlbumInfo(album, albumIndex) {

    // 曲リストを表示
    songsListContainer.innerHTML = ''; // songsListContainerをクリア

    // 曲リストコンテナを作成し、SimpleBarを適用
    const songsContainer = document.createElement('div');
    songsContainer.className = 'songs-container'; // CSSでスクロール設定を適用
    songsContainer.setAttribute('data-simplebar', ''); // SimpleBarを適用するための属性を追加

    // 曲リストを生成
    album.songs.forEach((song, songIndex) => {
        const listItem = document.createElement('div');
        listItem.className = 'playlist-item';
        listItem.textContent = `${songIndex + 1}. ${song.titles}`;
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
