# 3D Terrain with three.js #
## Setting up the scene ##
 
 Here I'm to show you a quick and fun way generate terrain in three.js. We will start by creating a plane and applying a non-shiny material to it. Next, we will add some outdoor lighting and a blue background for the sky. We will then apply a noise function to each vertex of the plane's geometry in order to elevate it. Finally we'll smooth out our terrain wiht a subdivider tool
Let's get started! 
    
## Setting up the scene ##
 
 I've set up a starting point for this tutorial adapted from a boilerplate I use to experiment with three.js, so that we can start creating straight away! 
  First, download the source files from github: 
  ```bash
   git clone https://github.com/jhillers/three-terrain.git   
  ```
 Next, check out our "start" branch: 
  
  ```bash
  git checkout start  
  ```
  
 Our boilerplate uses npm to manage our dependencies. Gulp and webpack will transpile our shiny es6 code and our node-js modules and serve them on local web server to avoid local file access errors. Sounds like a handful, but the grunt work is all done for us.
 
 To begin, we install our external dependencies: 
 
  ```bash
  npm install  
  ```
   If you haven't got it already, install gulp:
   ```bash
   npm install -g gulp
   ```
  Once that's done, start the local server: 
  
   ```bash
   gulp webpack-dev-server    
   ```
  
  The last thing to set up it's our build job, it'll check for your changes and re-compile on the fly! 
    ```bash
    gulp     
    ```
    
  That's it! now we can open localhost a browser: 
 http://localhost:5000/webpack-dev-server/index.html []()
  
  You should see an empty screen with a blue background. Let's take a quick look at the constructor in src/app.js. 
  ```javascript
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 200, 20000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.init();
  ```                      
           
  Here we create our scene to which we will add our 3D objects. We also need a camera so we can see our stuff! Finally, we make a webGLRenderer and  call init() where the our main work will begin.
  
  ## Adding a Plane ##
  Let's a add a plane mesh to our scene. Any mesh requires a Geometry object and a material before being rendered. We're going to use es6 to extend the Mesh class to better encapsulate our terrain-generating logic. Create a new js file in src/terrain/  and add initialise it by calling super():
   ```javascript
       import * as THREE from "three"
         export default class Terrain extends THREE.Mesh {         
             constructor(geometry, material) {
                 super(geometry, material);
             }
         }
```
 Now, back on app.js, we'll import this new class by adding this line at the top of the file:
  ```javascript
  import Terrain from "./terrain/Terrain"
```
We're now ready to create our Plane object, we create a PlaneGeometry instance in a new createTerrain() function, together with a MeshBasicMaterial, just so we can see it: 
```javascript
     createTerrain() {
            var segments = 12;
            var planeSize = 20200;
            var geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
            var material = new THREE.MeshBasicMaterial({color: 0x7a4e0d});
            this.terrain = new Terrain(geometry, material);
            this.terrain.position.set(0, 1000, 0);
     }
```
Great! Next thing I want to do, is to replace our MeshBasicMaterial for one that non-shiny that responds better to light changes. Change MeshBasicMaterial for MeshLamberMaterial: 

```javascript    
            var material = new THREE.MeshLambertMaterial({color: 0x7a4e0d});         
```
            
If you have a look at our plane now, you'll see it's gone completely dark! This is because LambertMaterial requires a light source to render appropriately. Let's fix this with a Hemisphere light.
Hemisphere light places itself directly above the scene, and it's perfect for our outdoors terrain project.
```javascript
            // Create a terrain.
            this.createTerrain();
            
            var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
            this.scene.add(light);
```
```javascript
            // Create a terrain.
            this.createTerrain();
            
            var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
            this.scene.add(light);
``` 
I'm also adding a soft ambient light to lighten up the scene:

```javascript
 var ambientLight = new THREE.AmbientLight(0x4c4c4c);
        this.scene.add(ambientLight);
```
To finish up, we will get a spotlight, with a very softened spot (via penumbra property) in order to accentuate shadows on the scene:
```javascript
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, -500, this.terrain.height);
        spotLight.castShadow = true;
        spotLight.angle = 5.05;
        spotLight.intensity = 0.5;
        spotLight.penumbra = 1;
        this.scene.add(spotLight);
```
## Make Some Noise! ##
Now it's time we add add hills to our terrain! I've added a noise library by Joseph Gentle and Stefan Gustavson in our libs folder, all we need to do is apply it to each vertex of our plane by passing their x and y values. A third parameter is increased as a counter to add firthre variation.
First, import the noise module at the top of your Terrain class:
```javascript
var Noise = require("../../libs/noisejs/perlin");
```
The next step is to add a create function which will apply noise to each vertex: 
```javascript
        create() {
        var noiseMapHeight = 0;
        var increase = 0.01;
        var vertices = this.geometry.vertices;

        this.noise.seed(Math.random());
        vertices.map((item)=> {
            var perlin3 = this.noise.perlin3(item.x, item.y, noiseMapHeight += increase);
            item.z = perlin3 * this.height;
            return item;
        });
    }
```
Now, our noise function gives values in the range -1 to 1, we need to convert them to 0 to 1 so that they don't get into negative height. We do this by adding 1 and dividing by 2, simple! 
```javascript
        item.z = ((perlin3 + 1) / 2) * this.height;
```
Our last job is to smooth it all out by subdiving our resulting geometry. There is a tool to do just this inside the examples folder in three.js. I've added it to our libs folder for easy access
It takes the number of subdivisions per segment, this will achieve the hilly look we're after:
```javascript
        var subdivisionModifier = new THREE.SubdivisionModifier(3);
        subdivisionModifier.modify(this.geometry);
```
That's it! Here is what the final version of our Terrain class looks like:

```javascript
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
```
