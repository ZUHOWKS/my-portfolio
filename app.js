import * as THREE from 'three';

import haloVertex from './public/shaders/glow/haloVertexShader.glsl'
import haloFragment from './public/shaders/glow/haloFragmentShader.glsl'




const scene = new THREE.Scene();
//scene.background = new THREE.Color("rgb(0,0,0)")
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight-100), 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.querySelector("#holo-sphere").appendChild( renderer.domElement );

const MOTION_BLUR_AMOUNT = 0.725

// Lighting
const dirLight = new THREE.DirectionalLight('#fffffff', 0.75)
dirLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight('#fffffff', 0.2)
scene.add(dirLight, ambientLight)

camera.position.set(0,0, 0)
renderer.render( scene, camera );




const halos = [];
initSphere();

function sphereAnimation(e, camera) {

    const widthCenter = window.innerWidth / 2;
    const heightCenter = window.innerHeight / 2;
    const speed = 0.0001;

    camera.rotation.set((heightCenter - e.clientY) * speed, (widthCenter - e.clientX) * speed, 0);
    renderer.render( scene, camera );
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

    const loader = new THREE.TextureLoader();
    const texture = loader.load("public/img/textures/halo_holosphere.jpg");
    const material = new THREE.ShaderMaterial( {
        fragmentShader: haloFragment,
        vertexShader: haloVertex,
    });

    const sphere = new THREE.SphereGeometry( 0.25, 12, 10);

    const rayon = 24;
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

    addHaloCircleMethod(sphere, material, 0, 0, rayon, -Math.PI/2);
    addHaloCircleMethod(sphere, material, 0, 0, rayon, Math.PI/2);

    renderer.render( scene, camera );
}


addEventListener('mousemove', (e) => sphereAnimation(e, camera))