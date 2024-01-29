

/*
 *   Welcome Title
 */

let welcomeTitle = document.querySelector("#welcome-title");
let holoSphere = document.querySelector("#holo-sphere");

setTimeout(() => {
    document.querySelector("#welcome-title-line-1").style.marginLeft = "10vw";
    document.querySelector("#welcome-title-line-2").style.marginLeft = "10vw";
    document.querySelector("#welcome-title-line-3").style.marginLeft = "10vw";
    document.querySelector("#welcome-title-line-4").style.marginLeft = "10vw";

    document.querySelector("#welcome-title-line-1").style.animationPlayState = "running";
    document.querySelector("#welcome-title-line-2").style.animationPlayState = "running";
    document.querySelector("#welcome-title-line-3").style.animationPlayState = "running";
    document.querySelector("#welcome-title-line-4").style.animationPlayState = "running";
}, 300);

let clientX = 0;
let clientY = 0;
addEventListener('mousemove', (e) => {
    clientX = e.clientX
    clientY = e.clientY



    if (window.scrollY < 300) {
        updateWelcomeTitlePosition();
    }

})

function updateWelcomeTitlePosition() {
    const widthCenter = window.innerWidth / 2;
    const heightCenter = window.innerHeight / 2;

    const dist = Math.min(Math.sqrt(Math.pow((clientX - widthCenter), 2) + Math.pow((clientY - heightCenter), 2)), Math.sqrt(Math.pow(widthCenter, 2) + Math.pow(heightCenter, 2)));
    const speed = 0.003;

    welcomeTitle.style.left = dist * speed * Math.cos(Math.acos((widthCenter - clientX) / dist)) + "rem";
    welcomeTitle.style.top = 5 + dist * speed * 1.5 * Math.sin(Math.asin((heightCenter - clientY) / dist)) + "rem";
    welcomeTitle.style.opacity = heightCenter * 2 / (3 * dist);
}

addEventListener('scroll', (e) => holoSphereScroll(e))
welcomeTitle.addEventListener('click', (e) => {
    scrollTo({
        top: 1200,
        left: 0,
        behavior: "smooth",
    });
})


function holoSphereScroll(e) {
    const scrollBegin = 300;
    const scrollEnding = 500;

    let speed = 0.001;
    if (window.scrollY >= scrollBegin) {
        speed = 0.01
        const scrollHiddenTitle = 500
        welcomeTitle.style.opacity = Math.max(0, 1 - (window.scrollY)/scrollHiddenTitle)
    } else {
        updateWelcomeTitlePosition()
    }
    holoSphere.style.top = (100 - Math.min(100, window.scrollY)) + "px";
    welcomeTitle.style.transform = "perspective(0px) translateZ(" + (-Math.max(0,window.scrollY-300) * speed) + "px";
}

