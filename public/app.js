import * as THREE from 'three';

import haloVertex from './shaders/glow/haloVertexShader.glsl'
import haloFragment from './shaders/glow/haloFragmentShader.glsl'
import {EffectComposer, RenderPass, UnrealBloomPass} from "three/addons";


const params = {
    threshold: 0,
    strength: 1,
    radius: 0.5,
    exposure: 1
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight-100), 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.querySelector("#holo-sphere").appendChild( renderer.domElement );

// Lighting
const dirLight = new THREE.DirectionalLight(0xfffffff, 0.75)
dirLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xfffffff, 0.2)
scene.add(dirLight, ambientLight)

//Bloom
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);


const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 0.4, 0.85
)
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;
composer.addPass(renderScene);
composer.addPass(bloomPass)

camera.position.set(0,0, 0)

renderer.render( scene, camera );



/*  */
const purple = new THREE.Color(0xdec0ff);
const white = new THREE.Color(0xffffff);
let cameraRotationX = 0;
let cameraRotationY = 0;

const halos = [];
let screenSphereMesh;

initSphere();
holoSphereAnimation();

function sphereAnimation(e, camera) {

    if (window.scrollY < 300 || (1100 <= window.scrollY && window.scrollY <= 1500)) {
        const widthCenter = window.innerWidth / 2;
        const heightCenter = window.innerHeight / 2;
        let speed = 0.0000583;

        if (1100 < window.scrollY) {
            speed *= -1;
        }
        cameraRotationX = (heightCenter - e.clientY) * speed;
        cameraRotationY = (widthCenter - e.clientX) * speed;

        camera.rotation.x = cameraRotationX;
        camera.rotation.y = cameraRotationY;

        renderer.render( scene, camera );
    }

}

function addHaloCircleMethod(sphere, material, position, rayonCircle, rayon, angle=Math.PI/5) {

    const mesh = new THREE.Mesh(sphere, material);

    const x = Math.cos(Math.PI * 2 * position) * (rayonCircle)
    const y = Math.sin(Math.PI * 2 * position) * (rayonCircle);
    const z = Math.sin(angle) * rayon;

    mesh.position.x = x
    mesh.position.y = y
    mesh.position.z = z

    scene.add(mesh);
    halos.push( mesh )
}

function initSphere() {


    const shaderMaterial = new THREE.ShaderMaterial( {
        fragmentShader: haloFragment,
        vertexShader: haloVertex,
    });

    const material = new THREE.MeshBasicMaterial( {
        color: purple
    });

    const sphere = new THREE.SphereGeometry( 0.25, 12, 10);

    const rayon = 15;
    const minHaloPerCircle = 6;
    const maxCircle = 10;

    for (let j= 1; j <= maxCircle; j++) {
        let maxHalo = minHaloPerCircle + 5 * (maxCircle-1-j);
        let r = (rayon * (maxCircle-j)/maxCircle);
        for (let i=0; i < maxHalo; i++) {
            let position = (i/maxHalo);
            addHaloCircleMethod(sphere, material.clone(), position, r, rayon, -Math.PI*j/(2*maxCircle));
            addHaloCircleMethod(sphere, material.clone(), position, r, rayon, Math.PI*j/(2*maxCircle));
        }

    }
    let maxHalo = minHaloPerCircle + 5 * (maxCircle);
    for (let i=0; i < maxHalo; i++) {
        let position = (i/maxHalo);
        addHaloCircleMethod(sphere, material.clone(), position, rayon, -1, Math.PI/2);
    }

    addHaloCircleMethod(sphere, material.clone(), 0, 0, rayon, -Math.PI/2);
    addHaloCircleMethod(sphere, material.clone(), 0, 0, rayon, Math.PI/2);

    const screenSphere = new THREE.SphereGeometry(rayon + 1, 32, 32);
    const screenMaterial = new THREE.MeshBasicMaterial( {
        color: purple
    });
    screenSphereMesh = new THREE.Mesh(screenSphere, screenMaterial);
    renderer.render( scene, camera );
}


function animate() {
    composer.render();
    requestAnimationFrame(animate);
}

animate();


addEventListener('mousemove', (e) => sphereAnimation(e, camera));

function holoSphereAnimation() {

    /* VARIABLE */
    let speed = 0.1;
    let scrollY = window.scrollY || 0;

    /* FIRST ANIMATION SCROLL KEYS */
    const preventHoloSphereBeginScroll_1 = 100;
    const holoSphereBeginScroll_1 = 300
    const holoSphereEndingScroll_1 = 1100

    /* SECOND ANIMATION SCROLL KEYS */
    const holoSphereBeginScroll_2 = 1600;
    const holoSphereEndingScroll_2 = 2400;

    /* FIRST ANIMATION */
    if (preventHoloSphereBeginScroll_1 <= scrollY && scrollY < holoSphereBeginScroll_1) {
        // impressive camera tracking
        camera.position.z = Math.min(3, scrollY*3/300);

    } else if (holoSphereBeginScroll_1 <= scrollY && scrollY <= holoSphereEndingScroll_1) {
        // camera tracking
        cameraTracking(scrollY-holoSphereBeginScroll_1, holoSphereEndingScroll_1 - holoSphereBeginScroll_1, 3);

        // background purple transition
        backgroundColorTransition(scrollY-holoSphereBeginScroll_1, 200, new THREE.Color(1,1,1), new THREE.Color(37,1,87));


    }

    /* STAY TRANSITION */
    if (holoSphereEndingScroll_1 < scrollY && scrollY < holoSphereBeginScroll_2) {
        // camera tracking
        cameraTracking(scrollY-holoSphereBeginScroll_1, holoSphereEndingScroll_1 - holoSphereBeginScroll_1, 3);

        // background purple transition
        backgroundColorTransition(scrollY-holoSphereBeginScroll_1, 200, new THREE.Color(1,1,1), new THREE.Color(37,1,87));



    }

    /* SECOND ANIMATION */
    if (holoSphereBeginScroll_2 <= scrollY && scrollY <= holoSphereEndingScroll_2 + 200) {
        // camera tracking
        cameraTracking(holoSphereEndingScroll_2 - scrollY,holoSphereEndingScroll_2 - holoSphereBeginScroll_2, 5);

        // background white transition
        backgroundColorTransition(scrollY - holoSphereBeginScroll_2 - 475, 585, new THREE.Color(37,1,87), new THREE.Color(255,255,255));

        // halo white transition
        halos.forEach((element) => {

            if (Math.random() < 0.0373) {
                element.material.color = white;
            }

        })
    } else {

        // halo purple transition
        halos.forEach((element) => {

            if (Math.random() < 0.0473) {
                element.material.color = purple;
            }

        })
    }

    /* STAY TRANSITION */
    if (holoSphereEndingScroll_2 < scrollY) {
        // camera tracking
        cameraTracking(holoSphereEndingScroll_2 - scrollY,holoSphereEndingScroll_2 - holoSphereBeginScroll_2, 5);

        // background white transition
        backgroundColorTransition(scrollY - holoSphereBeginScroll_2 - 475, 585, new THREE.Color(37,1,87), new THREE.Color(255,255,255));

    }
}

function backgroundColorTransition(pos, longPos, colorSrc, colorDist) {
    let colorTime = Math.min(1, Math.max(0, (pos)/longPos));

    let r = Math.round(colorSrc.r + (colorDist.r - colorSrc.r) * colorTime);
    let g = Math.round(colorSrc.g + (colorDist.g - colorSrc.g) * colorTime);
    let b = Math.round(colorSrc.b + (colorDist.b - colorSrc.b) * colorTime);

    scene.background = new THREE.Color("rgb(" + r + "," + g + "," + b + ")");
}

function cameraTracking(pos, longPos, alphaPos) {
    const speed = Math.log(20)
    const rotationSpeed = Math.log(25);

    camera.position.z = Math.min(31, (((Math.log(Math.max(Math.exp(speed), pos)) - speed)*30.5/(Math.log(longPos) - speed)) + alphaPos));
    camera.rotation.z = Math.min(Math.PI, (Math.log(Math.max(Math.exp(rotationSpeed), pos)) - rotationSpeed)*Math.PI/(Math.log(longPos) - rotationSpeed));
}

addEventListener('scroll', (e) => holoSphereAnimation());
