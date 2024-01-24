/*
        Welcome Title Margin-Slide
     */
setTimeout(() => {
    document.querySelector("#welcome-title-line-1").style.marginLeft = "10vw";
    document.querySelector("#welcome-title-line-2").style.marginLeft = "10vw";
    document.querySelector("#welcome-title-line-3").style.marginLeft = "10vw";
}, 10);

addEventListener('mousemove', (e) => {
    const widthCenter = window.innerWidth / 2;
    const heightCenter = window.innerHeight / 2;

    const dist = Math.min(Math.sqrt(Math.pow((e.clientX - widthCenter), 2) + Math.pow((e.clientY - heightCenter), 2)), Math.sqrt(Math.pow(widthCenter, 2) + Math.pow(heightCenter, 2)))
    const speed = 0.0035
    document.querySelector("#welcome-title").style.left = dist * speed * Math.cos(Math.acos((widthCenter-e.clientX)/dist)) + "rem";
    document.querySelector("#welcome-title").style.top = 10 + dist * speed * 1.5 * Math.sin(Math.asin((heightCenter-e.clientY)/dist)) + "rem";
})