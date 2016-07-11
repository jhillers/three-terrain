# 3D Terrain with three.js #
 ## Introduction ##
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
  http://localhost:5000/webpack-dev-server/index.html
  