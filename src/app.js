/**
 * Created by jose.hillers on 06/06/2016.
 */
import * as THREE from "three"
import Terrain from "./terrain/Terrain"
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
        this.createTerrain();

        var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
        this.scene.add(light);

        var ambientLight = new THREE.AmbientLight(0x4c4c4c);
        this.scene.add(ambientLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, -500, this.terrain.height);
        spotLight.castShadow = true;
        spotLight.angle = 5.05;
        spotLight.intensity = 0.5;
        spotLight.penumbra = 1;
        this.scene.add(spotLight);

        this.camera.position.set(10, 8810, 4780);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // Begin rendering!
        this.render();
    }

    createTerrain() {
        var segments = 12;
        var terrainSize = 20200;
        var geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
        var material = new THREE.MeshLambertMaterial({color: 0x7a4e0d});
        this.terrain = new Terrain(geometry, material);
        this.terrain.position.set(0, 1000, 0);
        this.scene.add(this.terrain);
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