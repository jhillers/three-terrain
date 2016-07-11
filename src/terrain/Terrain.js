/**
 * Created by jose.hillers on 07/06/2016.
 */
import * as THREE from "three"
const SubdivisionModifier = require("../../libs/modifiers/SubdivisionModifier")(THREE);
var Noise = require("../../libs/noisejs/perlin");

export default class Terrain extends THREE.Mesh {

    constructor(geometry, material) {
        super(geometry, material);
        this.noise = new Noise();
        this.height = 6950;
        this.create();
        var subdivisionModifier = new THREE.SubdivisionModifier(3);
        subdivisionModifier.modify(this.geometry);
    }

    create() {
        var noiseMapHeight = 0;
        var increase = 0.01;
        var vertices = this.geometry.vertices;

        this.noise.seed(Math.random());
        vertices.map((item)=> {
            var perlin3 = this.noise.perlin3(item.x, item.y, noiseMapHeight += increase);
            item.z = ((perlin3 + 1) / 2) * this.height;
            return item;
        });
    }
}
