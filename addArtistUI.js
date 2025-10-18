const baseURL = 'https://lyricguesser.pages.dev/'

let artistName = ''
let lyricData = {
    "aID_1": {
        "tID_1": []
    }
}
let nextID = null

fetch(`${baseURL}data/_content.json`)
    .then(response => response.json())
    .then(data => {
        if (!data) return;
        nextID = data.nextID
    })
    .catch(err => console.error(`Error fetching ${file}.json`, err))

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

async function saveArtistData() {
  const artistName = document.getElementById('artistName').value;
  if (!artistName) {
    alert("Artist name is required");
    return;
  }

  const artistSysName = artistName.replaceAll(" ", "").toLowerCase();
  const albums = [];

  // Build artist object
  const artistData = {
    displayedName: artistName,
    systemName: artistSysName,
    id: nextID,
    unlisted: document.getElementById('unlistedCheckToggle').checked,
    posterName: document.getElementById('posterName').value,
    artistCover: document.getElementById("artistCoverInput").value,
    albums: albums
  };

  // Build albums and tracks
  let albumID = 1;
  Array.from(document.getElementsByClassName('albumEditDetail')).forEach(album => {
    const albumObj = {
      title: album.querySelector('.albumTitle').value || `Album ${albumID}`,
      cover: album.querySelector('.albumCoverInput').value || '',
      trackList: []
    };

    let trackID = 1;
    Array.from(album.querySelector('.trackDetail').querySelectorAll('.trackInput')).forEach(track => {
      const trackObj = {
        title: track.querySelector('.trackNameField').value || `Track ${trackID}`,
        lyrics: lyricData['aID_' + albumID]?.['tID_' + trackID] || []
      };
      albumObj.trackList.push(trackObj);
      trackID++;
    });

    artistData.albums.push(albumObj);
    albumID++;
  });

  const json = JSON.stringify(artistData, null, 4);

  // 1️⃣ Upload artist file
  const artistUpload = await writeGitFile(json, nextID);
  if (!artistUpload) return;

  // 2️⃣ Update _content.json
  try {
    // Fetch current _content.json
    const contentResponse = await fetch("/data/_content.json");
    const contentData = await contentResponse.json();

    contentData.nextID = nextID + 1;  // increment nextID
    if (!contentData.content.includes(nextID.toString())) {
      contentData.content.push(nextID.toString());
    }

    // Upload updated _content.json
    await writeGitFile(JSON.stringify(contentData, null, 4), "_content");
    
    // Increment local nextID after success
    nextID++;
    alert(`✅ Artist "${artistName}" added successfully!`);
  } catch (err) {
    console.error("Error updating _content.json:", err);
    alert("❌ Failed to update _content.json. Check console.");
  }
}


async function writeGitFile(fileContent, fileID) {
  try {
    const response = await fetch("/api/writeFile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileContent, fileID })
    });

    const text = await response.text();

    try {
        const data = JSON.parse(text);
        if (!response.ok) {
            console.error(`GitHub write failed for ${fileID}:`, data);
            return false;
        }
        console.log(`✅ File ${fileID}.json uploaded successfully:`, data);
        return data;
    } catch (err) {
        console.error("Failed to parse JSON response:", text);
        return false;
    }
  } catch (err) {
    console.error("Network error while writing file:", err);
    return false;
  }
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
