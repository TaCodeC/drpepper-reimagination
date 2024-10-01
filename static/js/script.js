import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container3D = document.getElementById('container3D');
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
renderer.setPixelRatio(window.devicePixelRatio);
container3D.appendChild(renderer.domElement);
const scene = new THREE.Scene();

// Cámara frontal
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 1, 5); // Posición frontal       

// Luz direccional luces horizontales
const horizontalLight1 = new THREE.DirectionalLight(0xffffff, 50);
horizontalLight1.position.set(100, 500, 250); // Luz en la parte superior
horizontalLight1.target.position.set(100, 300, 0); // Hacia donde apunta la luz
horizontalLight1.castShadow = true;
scene.add(horizontalLight1);
scene.add(horizontalLight1.target);

// Luz direccional 2 
const horizontalLight2 = new THREE.DirectionalLight(0xffffff, 20);
horizontalLight2.position.set(300, 500, 300); // Luz desde otra dirección
horizontalLight2.target.position.set(0, 0, 0); // Hacia donde apunta la luz
horizontalLight2.castShadow = true;
scene.add(horizontalLight2);
scene.add(horizontalLight2.target);

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Luz ambiental
scene.add(ambientLight);

// Cargar el modelo GLB
const loader = new GLTFLoader().setPath('models/can/');
let object; 
loader.load('model.glb', (gltf) => {
    console.log('loading model');
    object = gltf.scene;

    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Escalar el objeto
    object.scale.set(0.3, 0.3, 0.3); 
    scene.add(object);
}, (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
    console.error(error);
});

// Manejo del redimensionamiento de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Variables para controlar el estado del mouse
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

// Detectar cuando el mouse está presionado
window.addEventListener('mousedown', (event) => {
    isMouseDown = true;
});

// Detectar cuando se suelta el botón del mouse
window.addEventListener('mouseup', (event) => {
    isMouseDown = false;
});

// Movimiento del modelo basado en la posición del mouse
window.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
});
let maxScrollHeight = window.innerHeight * 2.2; // Configuración del scroll máximo
let maxScale = 1.18; // Configuración del valor máximo de la escala
let initialCameraY = 1.5; // Configuración de la altura inicial de la cámara
let maxCameraY = 3.5; // Configuración de la altura máxima de la cámara
let objectMaxY = -5; // Altura del objeto cuando se ha alcanzado el máximo scroll

// Manejar el evento de scroll
let lastScrollY = 0;

function updateObjectRotationAndPosition() {
    let scrollY = window.scrollY;

    let scrollFactor = Math.min(scrollY / maxScrollHeight, 1);

    if (object) {
        // Rotación del objeto con el scroll
        object.rotation.y = (scrollFactor * 1.3 * (Math.PI*1.6  )) - 2.3; // Rotación de 360 grados

        // Escalar el objeto gradualmente
        let scaleValue = 0.4 + scrollFactor * (maxScale - 0.2);
        object.scale.set(scaleValue, scaleValue, scaleValue);

        // Controlar la posición vertical del objeto
        if (scrollFactor >= 1) {
            if (object.position.y <= 7) object.position.y += 1;
            if (object.position.y >= 8) object.position.y = 8.2;
        } else {
            if (object.position.y > 0) object.position.y -= 1;
            else object.position.y = 0;
        }
    }

    // Desplazar la cámara hacia arriba con el scroll solo si no alcanzamos el máximo
    if (scrollFactor < 1) {
        let cameraY = initialCameraY + scrollFactor * (maxCameraY - initialCameraY);
        camera.position.set(0, cameraY, 10);
    }

    lastScrollY = scrollY;
}
////

// Ajuste del tamaño del renderizado cuando se redimensiona la ventana


// Función de animación
function animate() {
    requestAnimationFrame(animate);
    
    // Actualizar rotación y posición del objeto basados en el scroll
    updateObjectRotationAndPosition();

    // Si el mouse está presionado, ajustar la rotación del objeto
    if (object && isMouseDown) {
        object.rotation.y = -4.5 + (mouseX / window.innerWidth) * 5; // Ajusta la rotación en Y
        object.rotation.x = -1.2 + (mouseY * 2.5 / window.innerHeight); // Ajusta la rotación en X
    }

    renderer.render(scene, camera);
}
///efectos CSS

let stars = document.getElementById('Stars');
let moon = document.getElementById('Moon');
let bhtree = document.getElementById('BHTREE');
let midtree = document.getElementById('MIDTREE');
let frontree = document.getElementById('FRONTTREE');

window.addEventListener('scroll', function(){
    let value = window.scrollY;
    if (value < 1700){
        if (value <1000){
            stars.style.left =value * 0.2 + 'px';
            frontree.style.left = value * 0.2 + 'px';

        }
        else
        stars.style.left = value * 0.05 + 'px';
    moon.style.top = 40+value * 1 + 'px';
    bhtree.style.top = 220+value * 0.7 + 'px';
    midtree.style.top = value * 0.3 + 'px';

    }
    else{
        moon.style.top -=.01 + 'px';
        bhtree.style.top -= .01 + 'px';
    }
})
document.querySelectorAll('.slider-nav a').forEach((navDot, index) => {
    navDot.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del ancla
        const slider = document.querySelector('.slider');
        const slideWidth = slider.clientWidth;
        slider.scrollTo({
            left: slideWidth * index, // Calcular la posición de la imagen correspondiente
            behavior: 'smooth'
        });
    });
});

const slides = document.querySelectorAll('.slide');
const navLinks = document.querySelectorAll('.slider-nav a');

navLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado

        // Remover la clase activa de todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Agregar la clase activa al slide correspondiente
        slides[index].classList.add('active');
    });
});
// Iniciar la animación
animate();