

/*
 *   Welcome Title
 */

let welcomeTitle = document.querySelector("#welcome-title");
let holoSphere = document.querySelector("#holo-sphere");
let presentationSection = document.querySelector("#presentation");

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
        updatePerspectiveMousePosition(welcomeTitle, 0, 5, 3);
    } if (1100 <= window.scrollY && window.scrollY <= 1500) {
        updatePerspectiveMousePosition(document.querySelector("#presentation-text"), 0, 0, 2);
    }

})

function updatePerspectiveMousePosition(element, alphaLeft, alphaTop, opacityStrength) {
    const widthCenter = window.innerWidth / 2;
    const heightCenter = window.innerHeight / 2;

    const dist = Math.min(Math.sqrt(Math.pow((clientX - widthCenter), 2) + Math.pow((clientY - heightCenter), 2)), Math.sqrt(Math.pow(widthCenter, 2) + Math.pow(heightCenter, 2)));
    const speed = 0.003;

    element.style.left = alphaLeft + dist * speed * Math.cos(Math.acos((widthCenter - clientX) / dist)) + "rem";
    element.style.top = alphaTop + dist * speed * 1.5 * Math.sin(Math.asin((heightCenter - clientY) / dist)) + "rem";
    element.style.opacity = Math.min(1,heightCenter * 2 / (opacityStrength * dist));
}

addEventListener('scroll', (e) => holoSphereScroll(e));
welcomeTitle.addEventListener('click', (e) => {
    scrollTo({
        top: 300,
        left: 0,
        behavior: "smooth",
    })
    setTimeout(() => scrollTo({
        top: 500,
        left: 0,
        behavior: "smooth",
    }), 200)
    setTimeout(() => scrollTo({
        top: 750,
        left: 0,
        behavior: "smooth",
    }), 350)
    setTimeout(() => scrollTo({
        top: 1200,
        left: 0,
        behavior: "smooth",
    }), 400)

})


function holoSphereScroll(e) {
    const scrollBegin = 350;
    const scrollEnding = 500;

    let speed = 0.001;
    if ( scrollBegin <= window.scrollY <= scrollEnding) {
        speed = 0.01;
        const scrollHiddenTitle = 410;
        welcomeTitle.style.opacity = Math.max(0, 1 - (window.scrollY)/scrollHiddenTitle);
    } else if (window.scrollY < scrollBegin) {
        updatePerspectiveMousePosition();
    }

    if (scrollEnding < window.scrollY) {
        welcomeTitle.style.visibility = "hidden";
    } else {
        welcomeTitle.style.visibility = "visible";
    }
    holoSphere.style.top = (100 - Math.min(100, window.scrollY)) + "px";
    welcomeTitle.style.transform = "perspective(0px) translateZ(" + (-Math.max(0,window.scrollY-scrollBegin) * speed) + "px";
}

/*
 * Presentation Section
 */
addEventListener('scroll', (e) => enterInMyUniverseDoorsScroll(e))
function enterInMyUniverseDoorsScroll(e) {
    if (800 <= window.scrollY && window.scrollY <= 2100) {
        presentationSection.style.visibility = "visible";
        if (window.scrollY <= 1500) {
            presentationSection.style.opacity = Math.min(1, (window.scrollY-800)/300);
        } else {
            presentationSection.style.opacity = Math.max(0, (2100 - window.scrollY)/300);
        }

    } else {
        presentationSection.style.visibility = "hidden";
    }
}

document.querySelector("#enter-universe").addEventListener('click', (e) => {
    scrollTo({
        top: 1800,
        left: 0,
        behavior: "smooth",
    })
    setTimeout(() => scrollTo({
        top: 2100,
        left: 0,
        behavior: "smooth",
    }), 175)
    setTimeout(() => scrollTo({
        top: 2300,
        left: 0,
        behavior: "smooth",
    }), 290)

    setTimeout(() => scrollTo({
        top: 2600,
        left: 0,
        behavior: "smooth",
    }), 375)

})