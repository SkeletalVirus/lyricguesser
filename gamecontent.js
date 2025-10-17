const baseURL = 'https://lyricguesser.pages.dev/'
// const albumList = document.getElementById("albumList")
let gameData = {artists: []}
let savedContent = JSON.parse(localStorage.getItem('savedContent'))
// let savedContent = ["0", "2"]
let currentArtist = null
let currentScore = 0
let highScore = 0
let currentSong = null
let correction = null
const testFiles = ["0", "1", "2", "3", "_content"];


getData()
// testJSONFiles()

async function testJSONFiles() {
    for (const file of testFiles) {
        try {
            const response = await fetch(`${baseURL}data/${file}.json`);
            if (!response.ok) {
                console.warn(`❌ File ${file}.json NOT found (status ${response.status})`);
            } else {
                const data = await response.json();
                console.log(`✅ File ${file}.json loaded successfully`, data);
            }
        } catch (err) {
            console.error(`Error fetching ${file}.json:`, err);
        }
    }
}

testJSONFiles();

async function getData() {
    await Promise.all(
        savedContent.map(async file => {
            try {
                const res = await fetch(`${baseURL}data/${file}.json`)
                if (!res.ok) {
                    console.warn(`Installed file ${file}.json not found:`, res.status);
                    return; // skip missing file
                }
                const data = await res.json()
    
                gameData.artists.push(data)
    
                console.log('pushed data to gameData')
            } catch {
                console.error(`Error fetching ${file}.json:`, err);
            }
        })
    )
    console.log(gameData.artists)
    gameData.artists.sort(({id:a}, {id: b}) => a-b)
    console.log(gameData.artists)
    loadData()
}

function loadData() {
    gameData.artists.forEach(artist => {
        // console.log(artist.displayedName)
        let artistSelectOption = document.createElement("option")
        artistSelectOption.value = artist.systemName
        artistSelectOption.innerHTML = artist.displayedName
        document.getElementById("artistSelect").appendChild(artistSelectOption)
    
        artist.albums.forEach(album => {
            // console.log(album)
            let albumObj = document.createElement("div")
            let albumCover = document.createElement("img")
            let albumTrackList = document.createElement("div")
            let i = 1
            albumTrackList.classList.add("songList")
    
            albumObj.appendChild(albumTrackList)
            albumCover.src = album.cover
            albumObj.appendChild(albumCover)
    
            album.trackList.forEach(track => {
                let trackBtn = document.createElement("button")
                trackBtn.innerHTML = `${i}. ${track.title}`
                trackBtn.addEventListener("click", function(){
                    if (currentSong == track.title) {
                        currentScore = currentScore + 1
                        console.log('Correct')
                    } else {
                        if (currentScore > highScore) {
                            highScore = currentScore
                            localStorage.setItem("highscore", highScore)
                            document.getElementById("highscore").innerHTML = `Highscore: ${highScore}`
                        }
                        correction = currentSong
                        currentScore = 0
                        document.getElementById("toast").style.left = "-550px"
                        document.getElementById("toast").style.left = 0
                        setTimeout(hideToast, 5000)
                        console.log(`Steak Lost, correct answer was ${currentSong}`)
                    }
                    if(highScore != null) {
                        document.getElementById("score").innerHTML = `Score: ${currentScore}`
                    } else {
                        highScore = 0
                    }
                    generateRandomLyric()
                })
                albumTrackList.appendChild(trackBtn)
                i = ++i
            })
    
            albumObj.classList.add("album")
            albumObj.classList.add(`${artist.systemName}_${artist.id}`)
            document.getElementById("albumList").appendChild(albumObj)
        })
    });
    currentArtist = gameData.artists[0]
    resetPageData()
    Array.from(document.getElementsByClassName(`${currentArtist.systemName}_${currentArtist.id}`)).forEach(album => {
        album.style.display = "flex"
        console.log(album)
    })
    document.getElementById("artistSelect").value = currentArtist.systemName
    highScore = localStorage.getItem("highscore")
    document.getElementById("highscore").innerHTML = `Highscore: ${highScore}`
    generateRandomLyric()
}

    async function resetPageData() {
        // console.log(gameData)
        gameData.artists.forEach(artist => {
            console.log(artist.systemName)
            console.log(document.getElementsByClassName(`${artist.systemName}_${artist.id}`))
            Array.from(document.getElementsByClassName(`${artist.systemName}_${artist.id}`)).forEach(album => {
                album.style.display = "none"
            })
        })
    }

    function changeArtist() {
        console.log(document.getElementById("albumList").children)
        gameData.artists.forEach(artist => {
            if (artist.systemName == document.getElementById("artistSelect").value) {
                currentArtist = artist
                console.log(`current artist internally set to ${currentArtist.displayedName}`)
            }
        })
        console.log(Array.from(document.getElementsByClassName(`${document.getElementById("artistSelect").value}`)))
        console.log(`${document.getElementById('artistSelect').value}_${currentArtist.id}`)
        Array.from(document.getElementById("albumList").children).forEach(child => {
            if (child.classList.contains(`${document.getElementById("artistSelect").value}_${currentArtist.id}`)) {
                child.style.display = "flex"
                console.log(`${child} display set to flex`)
            } else {
                child.style.display = "none"
                console.log(`${child} display set to flex`)
            }
        })
        currentScore = 0
        document.getElementById('score').innerHTML = `Score: ${currentScore}`
        generateRandomLyric()
        console.log(`Current artist is set to ${currentArtist.displayedName}`)
    }

    async function generateRandomLyric() {
        let selectedAlbum = Math.round(Math.random() * (currentArtist.albums.length - 1))
        // console.log(selectedAlbum)
        // console.log(currentArtist.albums[selectedAlbum])
        let selectedTrackNum = Math.round(Math.random() * (currentArtist.albums[selectedAlbum].trackList.length - 1))
        let selectedTrack = currentArtist.albums[selectedAlbum].trackList[selectedTrackNum].title
        console.log(`Randomly selected "${selectedTrack}" from ${currentArtist.albums[selectedAlbum].title}`)
        // console.log(`selectedAlbumNum = ${selectedAlbum}; selectedAlbum = ${currentArtist.albums[selectedAlbum].title}; selectedTrackNum = ${selectedTrackNum}; selectedTrack = ${selectedTrack}`)
        if (currentArtist.albums[selectedAlbum].trackList[selectedTrackNum].lyrics[0] != undefined) {
            let selectedLine = currentArtist.albums[selectedAlbum].trackList[selectedTrackNum].lyrics[Math.round(Math.random() * ((currentArtist.albums[selectedAlbum].trackList[selectedTrackNum].lyrics.length) - 1))]
            document.getElementById("lyricOutput").innerHTML = selectedLine
            currentSong = selectedTrack
            document.getElementById("correctAnswer").innerHTML = `<strong>${correction}</strong>`
        } else {
            console.log("Track has no lyrics, skipping")
            generateRandomLyric()
        }
    }

    function hideToast() {
        document.getElementById("toast").style.left = "-550px"        
    }

    function countDiscography() {
        let total = 0

        currentArtist.albums.forEach(album => {
            album.trackList.forEach(track => {
                total = total + 1
            })
        })

        console.log(total)
    }
