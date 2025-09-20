// const fs = require('fs')
// const artistCover = document.getElementsByClassName("artistCover")[0]
// const artistCoverFallback = document.getElementById("artistCoverFallback")
// var artistCoverInput = document.getElementById("artistCoverInput")
// const artistNameInput = document.getElementById("artistName")

let artistName = ''
let lyricData = {
    "aID_1": {
        "tID_1": []
    }
}
let nextID = null

fetch('./data/_content.json')
    .then(response => response.json())
    .then(data => {
        nextID = data.nextID
    })

function updateArtistCover() {
    if (document.getElementById("artistCoverInput").value != '') {
        document.getElementsByClassName("artistCover")[0].src = document.getElementById("artistCoverInput").value
        document.getElementsByClassName("artistCover")[0].style.display = 'block'
        artistCoverFallback = document.getElementById("artistCoverFallback").style.display = 'none'
    } else {
        document.getElementsByClassName("artistCover")[0].style.display = 'none'
        artistCoverFallback = document.getElementById("artistCoverFallback").style.display = 'block'
    }
    
    // console.log()
}

function saveArtistData() {
    let artistName = document.getElementById('artistName').value
    let artistSysName = artistName.replaceAll(" ", "").toLowerCase()
    let albums = []

    let artistData = {
        "displayedName": artistName,
        "systemName": artistSysName,
        "id": nextID,
        "unlisted": document.getElementById('unlistedCheckToggle').checked,
        "posterName": document.getElementById('posterName').value,
        "artistCover": document.getElementById("artistCoverInput").value,
        "albums": albums
    }
    if (document.getElementById("artistName").value != '') {
        artistName = document.getElementById("artistName").value
    }
    let albumID = 1
    Array.from(document.getElementsByClassName('albumEditDetail')).forEach(album => {
        console.log('looping through album')
        let albumObj = {
            "title": '',
            "cover": '',
            "trackList": []
        }
        
        albumObj.cover = album.querySelector('.albumCoverInput').value
        albumObj.title = album.querySelector('.albumTitle').value
        
        let trackID = 1
        Array.from(album.querySelector('.trackDetail').querySelectorAll('.trackInput')).forEach(track => {
            console.log('looping through track')
            let trackObj = {
                "title": '',
                "lyrics": []
            }
            
            // console.log(track.querySelector('.trackNameField'))
            trackObj.title = track.querySelector('.trackNameField').value
            trackObj.lyrics = lyricData['aID_' + albumID]['tID_' + trackID]
            albumObj.trackList.push(trackObj)

            trackID = trackID + 1
        })

        albumID = albumID + 1
        artistData.albums.push(albumObj)
    })    

        const json = JSON.stringify(artistData, null, 4)
        const blob = new Blob([json], {type: 'application/json'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = `${artistData.id}.json`
        a.click()

        URL.revokeObjectURL(url)

        console.log(artistData)
}
    
function openDropdown(dropdownID) {
    let dropdown = document.getElementById(`albumEditMenu_${dropdownID}`)
    let btn = document.getElementById(`dropdownBtn_${dropdownID}`)

    if (dropdown.style.height == '0px') {
        dropdown.style.height = 'fit-content'
        btn.children[0].style.transform = 'rotateZ(180deg)'
        // console.log('menu opened')
    } else {
        dropdown.style.height = '0px'
        btn.children[0].style.transform = 'rotateZ(0deg)'
        // console.log('menu closed')
    }
}

function updateAlbumDisplayData(albumID) {
    if (document.getElementById(`albumTitle_${albumID}`).value != '') {
        document.getElementById(`albumTitleDisplay_${albumID}`).innerHTML = `${albumID}. ${document.getElementById(`albumTitle_${albumID}`).value}`
    } else {
        document.getElementById(`albumTitleDisplay_${albumID}`).innerHTML = `${albumID}. New Album`
    }
}

function updateAlbumCover(albumID) {
    if (document.getElementById(`albumCoverInput_${albumID}`).value != '') {
        document.getElementById(`albumCoverDisplay_${albumID}`).src = document.getElementById(`albumCoverInput_${albumID}`).value
    } else {
        document.getElementById(`albumCoverDisplay_${albumID}`).src = "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"
    }
}

function addTrack(albumID) {
    let trackInput = document.createElement('div')
    let trackNameField = document.createElement('input')
    let btnTray = document.createElement('div')
    let editLyricsBtn = document.createElement('div')
    let delTrackBtn = document.createElement('div')
    let editLyricsBtnIMG = document.createElement('img')
    let delTrackBtnIMG = document.createElement('img')

    let newTrackBtn = document.createElement('button')
    let newTrackBtnIMG = document.createElement('img')
    let newTrackBtnTXT = document.createElement('p')

    let trackID = document.getElementById(`trackDetail_${albumID}`).children.length

    trackInput.classList.add('trackInput')
    trackInput.id = `trackInput_${albumID}_${trackID}`

    trackNameField.classList.add('trackNameField')
    trackNameField.type = 'text'
    trackNameField.id = `trackName_${albumID}_${trackID}`
    trackNameField.placeholder = 'Track Title...'

    btnTray.classList.add('btnTray')

    editLyricsBtn.classList.add('editLyricsBtn')
    editLyricsBtn.setAttribute('onclick', `changeTrackEdit(${albumID}, ${trackID})`)
    editLyricsBtnIMG.src = 'assets/pencil-square.svg'

    delTrackBtn.classList.add('delTrackBtn')
    delTrackBtn.setAttribute('onclick', `deleteTrack(${albumID}, ${trackID})`)
    delTrackBtnIMG.src = 'assets/trash3.svg'

    editLyricsBtn.appendChild(editLyricsBtnIMG)
    delTrackBtn.appendChild(delTrackBtnIMG)
    btnTray.appendChild(editLyricsBtn)
    btnTray.appendChild(delTrackBtn)
    trackInput.appendChild(trackNameField)
    trackInput.appendChild(btnTray)
    document.getElementById(`trackDetail_${albumID}`).appendChild(trackInput)
    
    // console.log('added new track slot')
    
    document.getElementById(`trackDetail_${albumID}`).removeChild(document.getElementById(`newTrackBtn_${albumID}`))

    // console.log('removed old track btn')

    newTrackBtn.classList.add('newTrackBtn')
    newTrackBtn.id = `newTrackBtn_${albumID}`
    newTrackBtn.setAttribute('onclick', `addTrack(${albumID})`)
    newTrackBtnIMG.src = 'assets/plus-lg.svg'
    newTrackBtnTXT.innerHTML = 'Add New Track'

    newTrackBtn.appendChild(newTrackBtnIMG)
    newTrackBtn.appendChild(newTrackBtnTXT)
    document.getElementById(`trackDetail_${albumID}`).appendChild(newTrackBtn)

    console.log('replaced track btn')
}

function addAlbum() {
    let albumID = document.querySelector('.albumListing').children.length

    let albumEditDropdown = document.createElement('div')

    let albumDisplayDetail = document.createElement('div')
    let albumTitleDisplay = document.createElement('p')
    let btnTray = document.createElement('div')
    let delBtn = document.createElement('div')
    let delBtnIMG = document.createElement('img')
    let dropdownBtn = document.createElement('div')
    let dropdownBtnIMG = document.createElement('img')

    let albumEditDetail = document.createElement('div')

    let albumCoverDiv = document.createElement('div')
    let albumCoverDisplay = document.createElement('img')
    let albumCoverInputDiv = document.createElement('div')
    let albumCoverInput = document.createElement('input')

    let textDetail = document.createElement('div')
    let albumTitleInput = document.createElement('input')
    let trackListDetail = document.createElement('div')

    let trackDetail = document.createElement('div')
    let newTrackBtn = document.createElement('button')
    let newTrackBtnIMG = document.createElement('img')
    let newTrackBtnTXT = document.createElement('p') 

    let lyricDetail = document.createElement('div')
    let lyricInput = document.createElement('textarea')

    let newAlbumBtn = document.createElement('button')
    let newAlbumBtnIMG = document.createElement('img')
    let newAlbumBtnTXT = document.createElement('p')

    albumEditDropdown.classList.add('albumEditMenu')
    albumEditDropdown.id = `albumDropdown_${albumID}`

    albumDisplayDetail.classList.add('albumDisplayDetail')
    albumDisplayDetail.setAttribute('onclick', `openDropdown(${albumID})`)

    albumTitleDisplay.innerHTML = `${albumID}. New Album`
    btnTray.classList.add('btnTray')
    delBtn.classList.add('delTrackBtn')
    delBtn.setAttribute('onclick', `deleteAlbum(${albumID})`)
    delBtnIMG.src = 'assets/trash3.svg'
    dropdownBtn.classList.add('dropdownBtn')
    dropdownBtn.id = `dropdownBtn_${albumID}`
    dropdownBtnIMG.src = 'assets/caret-down-fill.svg'

    albumEditDetail.classList.add('albumEditDetail')
    albumEditDetail.id = `albumEditMenu_${albumID}`
    albumEditDetail.style.height = '0px'
    
    albumCoverDisplay.src = 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg'
    albumCoverDisplay.classList.add('editAlbumCover')
    albumCoverDisplay.id = `albumCoverDisplay_${albumID}`

    albumCoverInput.setAttribute('type', 'text')
    albumCoverInput.classList.add('albumCoverInput')
    albumCoverInput.id = `albumCoverInput_${albumID}`
    albumCoverInput.placeholder = 'Paste Image Link Here...'
    albumCoverInput.setAttribute('oninput', `updateAlbumCover(${albumID})`)

    textDetail.classList.add('textDetail')
    albumTitleInput.setAttribute('type', 'text')
    albumTitleInput.classList.add('albumTitle')
    albumTitleInput.id = `albumTitle_${albumID}`
    albumTitleInput.placeholder = 'Album Title...'
    albumTitleInput.setAttribute('oninput', `updateAlbumDisplayData(${albumID})`)

    trackListDetail.classList.add('trackListDetail')

    trackDetail.classList.add('trackDetail')
    trackDetail.id = `trackDetail_${albumID}`
    
    newTrackBtn.classList.add('newTrackBtn')
    newTrackBtn.id = `newTrackBtn_${albumID}`
    newTrackBtn.setAttribute('onclick', `addTrack(${albumID})`)
    newTrackBtnIMG.src = 'assets/plus-lg.svg'
    newTrackBtnTXT.innerHTML = 'Add New Album'

    lyricDetail.classList.add('lyricDetail')
    lyricInput.classList.add('lyricInput')
    lyricInput.id = `lyricInput_${albumID}`


    lyricDetail.appendChild(lyricInput)
    
    newTrackBtn.appendChild(newTrackBtnIMG)
    newTrackBtn.appendChild(newTrackBtnTXT)
    
    trackDetail.appendChild(newTrackBtn)

    trackListDetail.appendChild(trackDetail)
    trackListDetail.appendChild(lyricDetail)

    textDetail.appendChild(albumTitleInput)
    textDetail.appendChild(trackListDetail)

    albumCoverInputDiv.appendChild(albumCoverInput)
    albumCoverDiv.appendChild(albumCoverDisplay)
    albumCoverDiv.appendChild(albumCoverInputDiv)

    albumEditDetail.appendChild(albumCoverDiv)
    albumEditDetail.appendChild(textDetail)

    dropdownBtn.appendChild(dropdownBtnIMG)
    delBtn.appendChild(delBtnIMG)
    btnTray.appendChild(delBtn)
    albumDisplayDetail.appendChild(albumTitleDisplay)
    albumDisplayDetail.appendChild(btnTray)
    albumDisplayDetail.appendChild(dropdownBtn)

    albumEditDropdown.appendChild(albumDisplayDetail)
    albumEditDropdown.appendChild(albumEditDetail)
    
    document.querySelector('.albumListing').appendChild(albumEditDropdown)
    addTrack(albumID)

    document.querySelector('.albumListing').removeChild(document.getElementById('addNewAlbumBtn'))

    newAlbumBtn.id = 'addNewAlbumBtn'
    newAlbumBtnIMG.src = 'assets/plus-lg.svg'
    newAlbumBtnTXT.innerHTML = 'Add New Album'
    newAlbumBtn.setAttribute('onclick', 'addAlbum()')

    newAlbumBtn.appendChild(newAlbumBtnIMG)
    newAlbumBtn.appendChild(newAlbumBtnTXT)
    document.querySelector('.albumListing').appendChild(newAlbumBtn)
}

function deleteTrack(albumID, trackID) {
    document.getElementById(`trackDetail_${albumID}`).removeChild(document.getElementById(`trackInput_${albumID}_${trackID}`))
}

function deleteAlbum(albumID) {
    document.querySelector(`.albumListing`).removeChild(document.getElementById(`albumDropdown_${albumID}`))
}

function changeTrackEdit(albumID, trackID) {
    let albumName = document.getElementById(`albumTitle_${albumID}`).value
    let trackName = document.getElementById(`trackName_${albumID}_${trackID}`).value

    document.getElementById(`lyricInput_${albumID}`).setAttribute('oninput', `editLyrics(${albumID}, ${trackID})`)
    document.getElementById(`lyricInput_${albumID}`).placeholder = `Currently editing Album ${albumID}, Track ${trackID}`

    if (albumName != '') {
        if (trackName != '') {
            document.getElementById(`lyricInput_${albumID}`).placeholder = `Currently editing Album ${albumName}, Track ${trackName}`
        } else {
            document.getElementById(`lyricInput_${albumID}`).placeholder = `Currently editing Album ${albumName}, Track ${trackID}`
        }
    } else {
        if (trackName != '') {
            document.getElementById(`lyricInput_${albumID}`).placeholder = `Currently editing Album ${albumID}, Track ${trackName}`
        } else {
            document.getElementById(`lyricInput_${albumID}`).placeholder = `Currently editing Album ${albumID}, Track ${trackID}`
        }
    }

    console.log(`now editing lyrics of Track ${trackID} of Album ${albumID}`)
    
    if(lyricData['aID_' + albumID] == undefined) {
        lyricData['aID_' + albumID] = {}
        // console.log(lyricData['aID_' + albumID])
    }

    if(lyricData['aID_' + albumID]['tID_' + trackID] != [] && lyricData['aID_' + albumID]['tID_' + trackID] != undefined) {
        let lyrics = ''
        lyricData['aID_' + albumID]['tID_' + trackID].forEach(line => {
            lyrics = lyrics + line + '\n'
        })
        lyrics = lyrics.trimEnd()
        document.getElementById(`lyricInput_${albumID}`).value = lyrics
    } else {
        document.getElementById(`lyricInput_${albumID}`).value = ''
    }

}

function editLyrics(albumID, trackID) {
    let lyricArray = []

    textInput = document.getElementById(`lyricInput_${albumID}`).value
    lyricArray = textInput.split('\n')
    eval('lyricData.aID_' + albumID + ".tID_" + trackID + ' = []')
    lyricArray.forEach(line => {
        if (line != '') {
            lyricData['aID_' + albumID]['tID_' + trackID].push(line)
        } else {
            return
        }
    })
    // console.log(textInput)
    // console.log(lyricArray)
    // console.log(aID)
    // console.log(lyricData)
}