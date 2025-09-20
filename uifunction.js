console.log("Dark Mode is " + localStorage.getItem("darkmode"))
console.log("Force Settings is " + localStorage.getItem("forceSettings"))

function initializePage() {
    console.log("Dark Mode is " + localStorage.getItem("darkmode"))
    if (localStorage.getItem("darkmode") != "on") {
        console.log('Changing to Light Mode');
        document.getElementById("body").classList.remove("dark");
        document.getElementById("body").classList.add("light")
        document.getElementById("darkModeCheck").checked = false
        localStorage.setItem("darkmode", "off")
    } else {
        localStorage.setItem("darkmode", "on")
    }

    if (localStorage.getItem("forceSettings") == "on") {
        document.getElementById("settingsMenu").classList.add("active");
        document.getElementById("forceSettingsCheck").checked = true;
    }
}

function openSettings() {
    document.getElementById("settingsMenu").classList.toggle("active");
    document.getElementById("settingsBtn").classList.toggle("active");
    // console.log("button clicked")
}

function darkMode() {
    if (document.getElementById("body").classList.contains("dark")) {
        console.log('Changing to Light Mode');
        document.getElementById("body").classList.remove("dark");
        document.getElementById("body").classList.add("light")
        document.getElementById("darkModeCheck").checked = false
        localStorage.setItem("darkmode", "off")
    } else {
        console.log('Changing to Dark Mode');
        document.getElementById("body").classList.remove("light");
        document.getElementById("body").classList.add("dark")
        localStorage.setItem("darkmode", "on")
    }
}

function clearBrowserData() {
    localStorage.clear
    console.log("Data Cleared")
}

function enableForceOpenSettings() {
    if (localStorage.getItem("forceSettings") != "on") {
        localStorage.setItem("forceSettings", "on");
    } else {
        localStorage.setItem("forceSettings", "off");
    }
}