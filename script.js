import * as THREE from './three.module.js';
import { OBJLoader } from "./OBJloader.js";


var container, stats;

var camera, scene, renderer;
var directionalLight;

var mouseX = 0, mouseY = 0;

// Initially the example was fullscreen, so mouse positions are
// relative to the center of the screen.
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// I decided to make a smaller example;
var sizeX = 500, sizeY = 500;

var brain;
let brainLoaded = false, loadedChecker = false;

init();
animate();


function init() {
    // We put the container inside a div with id #threejsbrain
    var puthere = document.getElementById("threejsbrain");

    // Uncomment this if your example is full screen.
    // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera = new THREE.PerspectiveCamera( 45, sizeX / sizeY, 1, 2000 );
    camera.position.z = -10;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x111111 );
    scene.add( ambient );

    directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, -1 );
    scene.add( directionalLight );

    // texture

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

	console.log( item, loaded, total );

    };

    // model
    // Load our brain

    var loader = new OBJLoader();
    loader.load( './freesurf.OBJ', function ( object ) {
        brain = object;
        object.position.y = 0;
        scene.add( object );
        brainLoaded = true;
    } );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 500, 500 );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    puthere.appendChild( renderer.domElement );

    document.getElementById("threejsbrain").addEventListener('mousemove', onDocumentMouseMove, false );
    document.getElementById("threejsbrain").addEventListener('ontouchmove', onDocumentMouseMove, false );

    // window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}

//

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;

    var r = 7;
    var s = 0.01;

    // We have the camera orbit in a sphere around the brain, having
    // the light follow so it's well-lit.
    camera.position.x = r * Math.sin( mouseX * s ) * Math.cos(mouseY/2 * s);
    camera.position.z = -r * Math.cos( mouseX * s ) * Math.cos(mouseY/2 * s);
    camera.position.y = r * Math.sin(mouseY/2 * s);

    directionalLight.position.x = r * Math.sin( mouseX * s ) * Math.cos(mouseY/2 * s);
    directionalLight.position.z = -r * Math.cos( mouseX * s ) * Math.cos(mouseY/2 * s);
    directionalLight.position.y = r * Math.sin(mouseY/2 * s);

    if(brainLoaded)brain.rotation.y += 0.01;
    
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
}
