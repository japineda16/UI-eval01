<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';
import { gsap } from "gsap";

let scene, camera, renderer, container;
const pieces = ref([]);
const currentFigure = ref(0);

// Posiciones para las figuras
const figures = [
    // Figura 1 (Pájaro)
    {
        largeTriangle1: { x: -0.7, y: -0.2, z: 0, rotationZ: Math.PI / 2.85 },
        largeTriangle2: { x: 3, y: -2, z: 0, rotationZ: Math.PI / 0.74 },
        mediumTriangle: { x: -4.1, y: 3.2, z: 0, rotationZ: 0 },
        smallTriangle1: { x: -1.5, y: -3, z: 0, rotationZ: Math.PI / 2.2 },
        smallTriangle2: { x: 2, y: -3.6, z: 0, rotationZ: Math.PI / 0.45 },
        square: { x: -3.2, y: 1.25, z: 0, rotationZ: 0 },
        parallelogram: { x: -1.3, y: -0.9, z: 0, rotationZ: Math.PI / 1.4 },
    },

    {
        largeTriangle1: { x: -1.5, y: -1.75, z: 0, rotationZ: Math.PI / 0.74 },
        largeTriangle2: { x: -0.5, y: 0, z: 0, rotationZ: Math.PI / 2.85 },
        mediumTriangle: { x: 0.8, y: 3.4, z: 0, rotationZ: 0 },
        smallTriangle1: { x: -1.8, y: -4.2, z: 0, rotationZ: Math.PI / 2.8 },
        smallTriangle2: { x: -1.4, y: -6.4, z: 0, rotationZ: Math.PI / 0.74 },
        square: { x: 1.7, y: 1.45, z: 0, rotationZ: 0 },
        parallelogram: { x: -2.6, y: -3.7, z: 0, rotationZ: 0 },
    },

    {
        largeTriangle1: { x: -0.7, y: -0.2, z: 0, rotationZ: Math.PI / 2 },
        largeTriangle2: { x: 2.3, y: -1.5, z: 0, rotationZ: Math.PI / 6.8 },
        mediumTriangle: { x: -1.2, y: -1.8, z: 0, rotationZ: Math.PI / 5.3 },
        smallTriangle1: { x: 0.3, y: -3.3, z: 0, rotationZ: Math.PI / 2.1 },
        smallTriangle2: { x: 2.7, y: 0.6, z: 0, rotationZ: Math.PI / 0.55 },
        square: { x: 3.9, y: 0.8, z: 0, rotationZ: 0 },
        parallelogram: { x: 1.3, y: 1.5, z: 0, rotationZ: 0 },
    },

    // Figura 2 (Casa)
];

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    container = document.getElementById('tangram-container');

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    camera.position.z = 10;

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(0, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    createPieces();
    animate();
};

const createPieces = () => {
    const tangramPieces = {
        largeTriangle1: createTriangle(2, 0x2196f3),
        largeTriangle2: createTriangle(2, 0x4caf50),
        mediumTriangle: createTriangle(1.4, 0xf44336),
        smallTriangle1: createTriangle(1, 0xff9800),
        smallTriangle2: createTriangle(1, 0x9c27b0),
        square: new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 0.1),
            new THREE.MeshPhongMaterial({ color: 0xffeb3b })
        ),
        parallelogram: createParallelogram(0x795548),
    };

    // Configurar posiciones iniciales
    const initialFigure = figures[0];
    Object.entries(tangramPieces).forEach(([key, piece]) => {
        const position = initialFigure[key];
        piece.position.set(position.x, position.y, position.z);
        piece.rotation.z = position.rotationZ;
        scene.add(piece);
    });

    pieces.value = tangramPieces;

    // Iniciar transición automática
    setTimeout(transitionToNextFigure, 3000);
};

const createTriangle = (size, color) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        -size,

        -size,

        0,

        size,

        -size,

        0,

        0,

        size,

        0,
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
    );
};

const createParallelogram = (color) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(2, 0);
    shape.lineTo(3, 1);
    shape.lineTo(1, 1);
    shape.lineTo(-1, -1);

    const geometry = new THREE.ShapeGeometry(shape);
    return new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
    );
};

const transitionToNextFigure = () => {
    currentFigure.value = (currentFigure.value + 1) % figures.length;
    const nextFigure = figures[currentFigure.value];

    Object.entries(pieces.value).forEach(([key, piece]) => {
        const newPosition = nextFigure[key];
        gsap.to(piece.position, {
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            duration: 2,
            ease: 'power2.inOut',
        });
        gsap.to(piece.rotation, {
            z: newPosition.rotationZ,
            duration: 2,
            ease: 'power2.inOut',
        });
    });

    // Programar la siguiente transición
    setTimeout(transitionToNextFigure, 5000);
};

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

const handleResize = () => {
    if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
};

onMounted(() => {
    init();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<template>
    <div id="tangram-container" class="tangram-container"></div>
</template>

<style scoped>
.tangram-container {
    width: 100%;
    height: 600px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>