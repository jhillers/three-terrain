/**
 * Created by jose.hillers on 06/06/2016.
 */
import * as THREE from "three"
const Controls = require("three-orbit-controls")(THREE);

export default class App {

    constructor() {

        // Setting up the main bits..
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 200, 20000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls = new Controls(this.camera);

        this.init();
    }

    init() {

        // Add our rendering to the DOM.
        document.body.appendChild(this.renderer.domElement);

        // Resize event so that our scene responds to window size change.
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // Set colour of background.
        this.renderer.setClearColor(0x09c9f2);


        // Create a terrain.
        this.camera.position.set(10, 8810, 4780);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // Begin rendering!
        this.render();
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}