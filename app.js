import * as THREE from 'three';

import haloVertex from './public/shaders/glow/haloVertexShader.glsl'
import haloFragment from './public/shaders/glow/haloFragmentShader.glsl'
import {EffectComposer, RenderPass, UnrealBloomPass} from "three/addons";
import {MeshBasicMaterial} from "three";


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




const halos = [];
initSphere();

function sphereAnimation(e, camera) {

    if (window.scrollY < 300 || 1100 < window.scrollY) {
        const widthCenter = window.innerWidth / 2;
        const heightCenter = window.innerHeight / 2;
        let speed = 0.000065;
        if (1100 < window.scrollY) {
            speed *= -1;
        }

        camera.rotation.x = (heightCenter - e.clientY) * speed;
        camera.rotation.y = (widthCenter - e.clientX) * speed

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

    const color = new THREE.Color(0xdec0ff);
    const shaderMaterial = new THREE.ShaderMaterial( {
        fragmentShader: haloFragment,
        vertexShader: haloVertex,
    });

    const material = new THREE.MeshBasicMaterial( {
        color: color
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
            addHaloCircleMethod(sphere, material, position, r, rayon, -Math.PI*j/(2*maxCircle));
            addHaloCircleMethod(sphere, material, position, r, rayon, Math.PI*j/(2*maxCircle));
        }

    }
    let maxHalo = minHaloPerCircle + 5 * (maxCircle);
    for (let i=0; i < maxHalo; i++) {
        let position = (i/maxHalo);
        addHaloCircleMethod(sphere, material, position, rayon, -1, Math.PI/2);
    }

    addHaloCircleMethod(sphere, material, 0, 0, rayon, -Math.PI/2);
    addHaloCircleMethod(sphere, material, 0, 0, rayon, Math.PI/2);

    renderer.render( scene, camera );
}


function animate() {
    composer.render();
    requestAnimationFrame(animate);
}

animate();


addEventListener('mousemove', (e) => sphereAnimation(e, camera))

function holoSphereCamera(e) {
    let speed = 0.1
    const holoSphereBeginScroll = 300
    const holoSphereEndingScroll = 1100
    if (100 <= window.scrollY && window.scrollY < 300) {
        camera.position.z = Math.min(3, (window.scrollY)*3/300);
    } else if (holoSphereBeginScroll <= window.scrollY && window.scrollY <= holoSphereEndingScroll) {
        speed = 0.0515
        camera.position.z = Math.min(30, (((window.scrollY-holoSphereBeginScroll)*29/holoSphereEndingScroll) + 3));
        camera.rotation.z = Math.min(Math.PI, Math.max(0, (window.scrollY - holoSphereBeginScroll)*Math.PI/(holoSphereEndingScroll - holoSphereBeginScroll)));

        let colorTime = Math.min(1, Math.max(0, (window.scrollY-300)/200));

        const r = Math.round(37 * colorTime);
        const g = Math.round(colorTime);
        const b = Math.round(87 * colorTime);
        scene.background = new THREE.Color("rgb(" + r + "," + g + "," + b + ")")
    }
}

addEventListener('scroll', (e) => holoSphereCamera(e))