const baseURL = 'https://skeletalvirus.github.io/lyricguesser/'
let searchData = []
// let foundSearchData = []
if (!localStorage.getItem("savedContent")) {
    localStorage.setItem("savedContent", JSON.stringify([]));
}

let savedContent = JSON.parse(localStorage.getItem("savedContent")) || []
loadInstalledContent()
loadAllContent()
setTimeout(() => {
    closeInfoPanel
})

function openDropdown(dropdown) {
    if (document.getElementById(`dropdown_${dropdown}`).style.height != '0px') {
        document.getElementById(`dropdown_${dropdown}`).style.height = '0px'
        document.getElementById(`dropdownBtn_${dropdown}`).children[0].style.transform = 'rotateZ(0deg)'
        // document.getElementById(`dropdown_${dropdown}`).style.paddingTop = '0'
    } else {
        document.getElementById(`dropdown_${dropdown}`).style.height = 'auto'
        document.getElementById(`dropdownBtn_${dropdown}`).children[0].style.transform = 'rotateZ(180deg)'
        // document.getElementById(`dropdown_${dropdown}`).style.paddingTop = '50px'
    }
}

function closeInfoPanel() {
    let infoPanel = document.querySelector('.infoPanel')
    let exitModal = document.querySelector('.exitModal')
    let body = document.querySelector('.browseContentPage')

    body.style.filter = 'blur(0px)'
    infoPanel.style.transform = 'translateY(-125%)'
    exitModal.style.backgroundColor = 'rgba(0, 0, 0, 0)'

    setTimeout(() => {
        exitModal.style.display = 'none'
    }, 1000)
}

async function openInfoPanel(file) {
    let infoPanel = document.querySelector('.infoPanel')
    let exitModal = document.querySelector('.exitModal')
    let body = document.querySelector('.browseContentPage')
    let artistNameInfo = document.getElementById('artistNameInfo')
    let posterName = infoPanel.querySelector('.posterName')
    let artistCoverDisplay = infoPanel.querySelector('.artistCoverDisplay').querySelector('img')
    let albumInfoDisplay = infoPanel.querySelector('.albumInfoDisplay')

    fetch(`${baseURL}data/${file}.json`)
    .then(response => response.json())
    .then(data => {
        if (!data) return;
        artistNameInfo.innerHTML = data.displayedName
        posterName.innerHTML = data.posterName
        artistCoverDisplay.src = data.artistCover
        albumInfoDisplay.innerHTML = ''

        data.albums.forEach(album => {
            let albumObj = document.createElement('img')
            albumObj.src = album.cover
            albumObj.alt = `${data.displayedName} - ${album.title}`
            albumInfoDisplay.appendChild(albumObj)
        })
    })
    .catch(err => console.error(`Error fetching ${file}.json`, err))


    exitModal.style.display = 'block'
    setTimeout(() => {
        body.style.filter = 'blur(5px)'
        infoPanel.style.transform = 'translateY(10%)'
        exitModal.style.backgroundColor = 'rgba(29, 29, 29, 0.4)'
    })
}

async function loadInstalledContent() {
    await Promise.all(
        savedContent.map(async file => {
            const response = await fetch(`${baseURL}data/${file}.json`)
            if (!response.ok) {
                console.warn(`Installed file ${file}.json not found:`, response.status);
                return; // skip missing file
            }
            const data = await response.json()

            let contentArea = document.getElementById('dropdown_1')
            let contentModule = document.createElement('div')
            let artistName = document.createElement('p')
            let artistCover = document.createElement('img')
            let posterName = document.createElement('p')
            let btnTray = document.createElement('div')
            let dlBtn = document.createElement('div')
            let dlBtnIMG = document.createElement('img')
            let delBtn = document.createElement('div')
            let delBtnIMG = document.createElement('img')
            let infoBtn = document.createElement('div')
            let infoBtnIMG = document.createElement('img')
        
            contentModule.classList.add('outlined')
            contentModule.classList.add('contentModule')
        
            artistName.classList.add('artistName')
            artistName.innerHTML = data.displayedName

            artistCover.classList.add('artistCover')
            artistCover.src = data.artistCover

            posterName.classList.add('posterName')
            posterName.innerHTML = data.posterName

            btnTray.classList.add('btnTray')

            dlBtn.classList.add('roundedBtn')
            dlBtn.classList.add('dlBtn')
            dlBtnIMG.src = 'assets/download.svg'

            delBtn.classList.add('roundedBtn')
            delBtn.classList.add('delBtn')
            delBtn.setAttribute('onclick', `removeContent(${file})`)
            delBtnIMG.src = 'assets/trash3.svg'

            infoBtn.classList.add('roundedBtn')
            infoBtn.classList.add('infoBtn')
            infoBtn.setAttribute('onclick', `openInfoPanel(${file})`)
            infoBtnIMG.src = 'assets/info-square.svg'

            infoBtn.appendChild(infoBtnIMG)
            dlBtn.appendChild(dlBtnIMG)
            delBtn.appendChild(delBtnIMG)
            btnTray.appendChild(delBtn)
            btnTray.appendChild(infoBtn)
            contentModule.appendChild(artistName)
            contentModule.appendChild(artistCover)
            contentModule.appendChild(posterName)
            contentModule.appendChild(btnTray)
            contentArea.appendChild(contentModule)
        })
    )
}

async function loadAllContent() {
    let contentList = []

    fetch(`${baseURL}data/_content.json`)
    .then(response => response.json())
    .then(data => {
        contentList = data.content
    })
    .then(wait => {
        Promise.all(
            contentList.map(async file => {
                const response = await fetch(`${baseURL}data/${file}.json`)
                if (!response.ok) {
                    console.warn(`Installed file ${file}.json not found:`, response.status);
                    return; // skip missing file
                }
                const data = await response.json()
    
                let contentArea = document.getElementById('dropdown_2')
                let contentModule = document.createElement('div')
                let artistName = document.createElement('p')
                let artistCover = document.createElement('img')
                let posterName = document.createElement('p')
                let btnTray = document.createElement('div')
                let dlBtn = document.createElement('div')
                let dlBtnIMG = document.createElement('img')
                let delBtn = document.createElement('div')
                let delBtnIMG = document.createElement('img')
                let infoBtn = document.createElement('div')
                let infoBtnIMG = document.createElement('img')
            
                contentModule.classList.add('outlined')
                contentModule.classList.add('contentModule')
            
                artistName.classList.add('artistName')
                artistName.innerHTML = data.displayedName
    
                artistCover.classList.add('artistCover')
                artistCover.src = data.artistCover
    
                posterName.classList.add('posterName')
                posterName.innerHTML = data.posterName
    
                btnTray.classList.add('btnTray')
    
                dlBtn.classList.add('roundedBtn')
                dlBtn.classList.add('dlBtn')
                dlBtn.setAttribute('onclick', `installContent(${file})`)
                dlBtnIMG.src = 'assets/download.svg'

                delBtn.classList.add('roundedBtn')
                delBtn.classList.add('delBtn')
                delBtn.setAttribute('onclick', `removeContent(${file})`)
                delBtnIMG.src = 'assets/trash3.svg'
    
                infoBtn.classList.add('roundedBtn')
                infoBtn.classList.add('infoBtn')
                infoBtn.setAttribute('onclick', `openInfoPanel(${file})`)
                infoBtnIMG.src = 'assets/info-square.svg'
    
                infoBtn.appendChild(infoBtnIMG)
                dlBtn.appendChild(dlBtnIMG)
                delBtn.appendChild(delBtnIMG)
                btnTray.appendChild(dlBtn)
                btnTray.appendChild(delBtn)
                btnTray.appendChild(infoBtn)
                contentModule.appendChild(artistName)
                contentModule.appendChild(artistCover)
                contentModule.appendChild(posterName)
                contentModule.appendChild(btnTray)

                if (data.unlisted != true) {
                    contentArea.appendChild(contentModule)
                }

                let found = savedContent.find((x) => x === file)
                if (found != undefined) {
                    dlBtn.style.display = 'none'
                    console.log(`File_${file} is already installed`)
                } else {
                    delBtn.style.display = 'none'
                    console.log(`File_${file} is not already installed`)
                }
            })
        )
    })
}

async function searchBrowse() {
    try {
        // Clear previous data
        contentList = [];

        // Get the list of content files
        const contentResponse = await fetch(`${baseURL}/data/_content.json`);
        const contentJson = await contentResponse.json();
        contentList = contentJson.content; // assuming this is an array of file names

        // Fetch all content files in parallel and populate searchData
        if (searchData.length == 0) {
            console.log('searchData undefined, populating searchData')
            await Promise.all(
                contentList.map(async file => {
                    const response = await fetch(`${baseURL}data/${file}.json`);
                    const data = await response.json();
                    searchData.push(data);
                })
            );
        } else {
            console.log('searchData defined')
        }

        // Get search input and trim whitespace
        const search = document.querySelector('.searchBar').value.trim();
        const searchNum = Number(search); // for exact ID match
        const browseSearch = document.querySelector('.browseSearch')
        const browseNormal = document.getElementById('mainBrowseArea')

        console.log("Search input:", search);
        console.log("searchData loaded:", searchData);
        console.log("First item:", searchData[0]);

        // Filter searchData
        const foundSearchData = searchData.filter(a =>
            (
                a &&
                typeof a.posterName === "string" &&
                typeof a.displayedName === "string" &&
                (
                    a.posterName.toLowerCase().includes(search.toLowerCase()) ||
                    a.displayedName.toLowerCase().includes(search.toLowerCase())
                ) &&
                a.unlisted !== true
            ) ||
            (
                a &&
                typeof a.id === "number" &&
                !isNaN(searchNum) &&
                a.id === searchNum
            )
        );

        console.log("Filtered results:", foundSearchData);
        console.log(foundSearchData[0])

        if (search !== '' && foundSearchData.length > 0) {
            browseNormal.style.display = 'none';
            browseSearch.style.display = 'flex';
            browseSearch.innerHTML = ''
        
            foundSearchData.forEach(searchedFile => {
                // searchedFile is already the data object
                let data = searchedFile;
        
                let contentModule = document.createElement('div');
                let artistName = document.createElement('p');
                let artistCover = document.createElement('img');
                let posterName = document.createElement('p');
                let btnTray = document.createElement('div');
                let dlBtn = document.createElement('div');
                let dlBtnIMG = document.createElement('img');
                let delBtn = document.createElement('div');
                let delBtnIMG = document.createElement('img');
                let infoBtn = document.createElement('div');
                let infoBtnIMG = document.createElement('img');
        
                contentModule.classList.add('outlined', 'contentModule');
        
                artistName.classList.add('artistName');
                artistName.innerHTML = data.displayedName;
        
                artistCover.classList.add('artistCover');
                artistCover.src = data.artistCover;
        
                posterName.classList.add('posterName');
                posterName.innerHTML = data.posterName;
        
                btnTray.classList.add('btnTray');
        
                // Use the numeric ID here instead of the object
                dlBtn.classList.add('roundedBtn', 'dlBtn');
                dlBtn.setAttribute('onclick', `installContent(${data.id})`);
                dlBtnIMG.src = 'assets/download.svg';
        
                delBtn.classList.add('roundedBtn', 'delBtn');
                delBtn.setAttribute('onclick', `removeContent(${data.id})`);
                delBtnIMG.src = 'assets/trash3.svg';
        
                infoBtn.classList.add('roundedBtn', 'infoBtn');
                infoBtn.setAttribute('onclick', `openInfoPanel(${data.id})`);
                infoBtnIMG.src = 'assets/info-square.svg';
        
                infoBtn.appendChild(infoBtnIMG);
                dlBtn.appendChild(dlBtnIMG);
                delBtn.appendChild(delBtnIMG);
                btnTray.appendChild(dlBtn);
                btnTray.appendChild(delBtn);
                btnTray.appendChild(infoBtn);
                contentModule.appendChild(artistName);
                contentModule.appendChild(artistCover);
                contentModule.appendChild(posterName);
                contentModule.appendChild(btnTray);
        
                browseSearch.appendChild(contentModule);
        
                let found = savedContent.find((x) => x === data.id.toString());
                if (found !== undefined) {
                    dlBtn.style.display = 'none';
                    console.log(`File_${data.id} is already installed`);
                } else {
                    delBtn.style.display = 'none';
                    console.log(`File_${data.id} is not already installed`);
                }
            });
        } else if(search !== '' && foundSearchData.length === 0) {
            browseSearch.innerHTML = ''
            let errMsg = document.createElement('p')
            errMsg.innerHTML = 'Could not find any content that matches your search'
            browseSearch.appendChild(errMsg)
        } else {
            browseNormal.style.display = 'block';
            browseSearch.style.display = 'none';
        }
           

    } catch (err) {
        console.error("Error in searchBrowse:", err);
    }
}

function installContent(id) {
    savedContent.push(`${id}`)
    localStorage.setItem("savedContent", JSON.stringify(savedContent))
    document.getElementById('dropdown_1').innerHTML = ''
    document.getElementById('dropdown_2').innerHTML = ''
    loadInstalledContent()
    loadAllContent()
    searchBrowse()
}

function removeContent(id) {
    let index = savedContent.indexOf(`${id}`)
    savedContent.splice(index, 1)
    localStorage.setItem("savedContent", JSON.stringify(savedContent))
    document.getElementById('dropdown_1').innerHTML = ''
    document.getElementById('dropdown_2').innerHTML = ''
    loadInstalledContent()
    loadAllContent()
    searchBrowse()
}