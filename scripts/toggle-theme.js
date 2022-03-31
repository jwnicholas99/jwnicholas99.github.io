var lightCodeTheme = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/monokai.min.css"
var darkCodeTheme = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/base16/rebecca.min.css"

function setLightMode(){
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById("code-block-theme").setAttribute("href", lightCodeTheme)
    var toggles = document.getElementsByClassName("toggle-switch");
    for (var i = 0; i < toggles.length; i++) {
        toggles[i].checked = false;
    }
}

function setDarkMode(){
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById("code-block-theme").setAttribute("href", darkCodeTheme);
    var toggles = document.getElementsByClassName("toggle-switch");
    for (var i = 0; i < toggles.length; i++) {
        console.log(toggles[i])
        toggles[i].checked = true;
    }
}

// this checks whether system dark mode is set 
let systemInitiatedDark = window.matchMedia("(prefers-color-scheme: dark)"); 
// this checks for session storage telling to override
// the system preferences 
let theme = sessionStorage.getItem('theme');

if (theme === 'light') {
    setLightMode();
} else if (theme === 'dark') {
    setDarkMode();
} else if (systemInitiatedDark.matches) {
    setDarkMode();
} else {
    setLightMode();
}

function prefersColorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
        setDarkMode()
         // this clears the session storage 
         sessionStorage.setItem('theme', '');
    } else {
        setLightMode()
        sessionStorage.setItem('theme', '');
    }
  }

systemInitiatedDark.addListener(prefersColorTest);

function modeSwitcher() {
    // it’s important to check for overrides again 
    let theme = sessionStorage.getItem('theme');
    // checks if reader selected dark mode 
    if (theme === "dark") {
        setLightMode();
        sessionStorage.setItem('theme', 'light');
        // checks if reader selected light mode 
    }	else if (theme === "light") {
        setDarkMode();
        sessionStorage.setItem('theme', 'dark');
        // checks if system set dark mode 
    } else if (systemInitiatedDark.matches) {	
        setLightMode();
        sessionStorage.setItem('theme', 'light');
        // the only option left is system set light mode
    } else {
        setDarkMode()
        sessionStorage.setItem('theme', 'dark');
    }
}