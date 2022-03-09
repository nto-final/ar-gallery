import * as ZapparThree from '@zappar/zappar-threejs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import target from '../assets/marker.zpt';
import './index.sass';
import TWEEN from '@tweenjs/tween.js';
import doorOneTextureUrl from '../assets/doorFirst.png'
import doorTwoTextureUrl from '../assets/doorTwo.png';
import image1 from '../assets/image1.jpg'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.jpg'
import image4 from '../assets/image4.jpg'
import video1 from "../assets/video1.mp4"
import cube from "../assets/cube.glb"
import mask3d from "../assets/chert.glb"
import previousSvg from "../assets/previous.svg";
import music from "../assets/music.m4a";
if (ZapparThree.browserIncompatible()) {

  ZapparThree.browserIncompatibleUI();

  throw new Error('Unsupported browser');
}

let Gallery : THREE.Object3D[] = [];
let IndexGallery:number  = 0;
const manager = new ZapparThree.LoadingManager();

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new ZapparThree.Camera();


ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

ZapparThree.glContextSet(renderer.getContext());


scene.background = camera.backgroundTexture;

manager.onError = (url) => console.log(`There was an error loading ${url}`);

const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();
audioLoader.load(  music, function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

const imageTracker = new ZapparThree.ImageTrackerLoader(manager).load(target);
const imageTrackerGroup = new ZapparThree.ImageAnchorGroup(camera, imageTracker);

scene.add(imageTrackerGroup);

var textGroup = new THREE.Group()
textGroup.position.set(0, 0.5, 0);
textGroup.setRotationFromEuler(new THREE.Euler(0,90,0))

var fontLoader = new THREE.FontLoader();

fontLoader.load( 'https://raw.githubusercontent.com/shonsirsha/sandbox/master/din_alternate.json', function ( font:any ) {
  var geometry = new THREE.TextGeometry( 'Байкал', {
    font: font,
    size: 0.2,
    height: 0.1,
    curveSegments: 3,
  } );

  geometry.center();
  var material = new THREE.MeshPhongMaterial({color: 0x282D26});
  var mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.y -= Math.PI/2;

  textGroup.add(mesh)
});
fontLoader.load( 'https://raw.githubusercontent.com/shonsirsha/sandbox/master/din_alternate.json', function ( font:any ) {
  var geometry = new THREE.TextGeometry( 'озеро тектонического происхождения', {
    font: font,
    size: 0.12,
    height: 0.1,
    curveSegments: 3,
  } );

  geometry.center();
  var material = new THREE.MeshPhongMaterial({color: 0x282D26});
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(0,-0.3,0)
  mesh.rotation.y -= Math.PI/2;

  textGroup.add(mesh)
});
fontLoader.load( 'https://raw.githubusercontent.com/shonsirsha/sandbox/master/din_alternate.json', function ( font:any ) {
  var geometry = new THREE.TextGeometry( 'в южной части Восточной Сибири', {
    font: font,
    size: 0.12,
    height: 0.1,
    curveSegments: 3,
  } );

  geometry.center();
  var material = new THREE.MeshPhongMaterial({color: 0x282D26});
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(0,-0.6,0)
  mesh.rotation.y -= Math.PI/2;

  textGroup.add(mesh)
});
fontLoader.load( 'https://raw.githubusercontent.com/shonsirsha/sandbox/master/din_alternate.json', function ( font:any ) {
  var geometry = new THREE.TextGeometry( 'самое глубокое озеро на планете', {
    font: font,
    size: 0.12,
    height: 0.1,
    curveSegments: 3,
  } );

  geometry.center();
  var material = new THREE.MeshPhongMaterial({color: 0x282D26});
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(0,-0.9,0)
  mesh.rotation.y -= Math.PI/2;

  textGroup.add(mesh)
});

textGroup.visible = false
imageTrackerGroup.add(textGroup)
Gallery.push(textGroup)

var image1Sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( image1 ), color: 0xffffff } ) );
var image2Sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( image2 ), color: 0xffffff } ) );
var image3Sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( image3 ), color: 0xffffff } ) );
var image4Sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( image4 ), color: 0xffffff } ) );
image1Sprite.position.set(-0.7,0,0)
image3Sprite.position.set(-0.7,0,0)

image2Sprite.position.set(0.7,0,0)
image4Sprite.position.set(0.7,0,0)

var imageSummerGroup = new THREE.Group()
imageSummerGroup.add(image1Sprite, image2Sprite )
imageSummerGroup.visible = false

var imageWinterGroup = new THREE.Group()
imageWinterGroup.add(image3Sprite, image4Sprite )
imageWinterGroup.visible = false

Gallery.push(imageSummerGroup)
Gallery.push(imageWinterGroup)

//imageTrackerGroup.add(imageWinterGroup)


const video = document.getElementById( 'video' ) as any;
video.src = video1
const videoTexture = new THREE.VideoTexture(video);
const videoMaterial =  new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.FrontSide, toneMapped: false} );
const screen = new THREE.PlaneGeometry(2, 2);
const videoScreen = new THREE.Mesh(screen, videoMaterial);
videoScreen.visible = false;
video.play();


//imageTrackerGroup.add(videoScreen)
Gallery.push(videoScreen)

var model3d = new THREE.Group();

const gltfLoader = new GLTFLoader(manager);
gltfLoader.load(cube, (gltf) => {
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(2.1, 2.1, 2.1);
  model3d.add(gltf.scene);
}, undefined, () => {
  console.log('An error ocurred loading the GLTF model');
});

model3d.visible = false;

Gallery.push(model3d)

var mask = new THREE.Group();
var mixer:any;
gltfLoader.load(mask3d, (gltf) => {
  mixer = new THREE.AnimationMixer(gltf.scene) as any
  const animationAction = mixer.clipAction(gltf.animations[0])
  animationAction.play()
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(2.1, 2.1, 2.1);
  mask.add(gltf.scene);
}, undefined, () => {
  console.log('An error ocurred loading the GLTF model');
});

mask.visible = false;

Gallery.push(mask)


function onNextClick(){
  IndexGallery++
  if (IndexGallery == Gallery.length){
    IndexGallery = 0
  }
  imageTrackerGroup.remove(imageTrackerGroup.children[imageTrackerGroup.children[0].name == "doors"? 1:0])
  Gallery[IndexGallery].visible = true;
  imageTrackerGroup.add(Gallery[IndexGallery])

}
const directionalLight = new THREE.DirectionalLight('white',12);
directionalLight.position.set(-2, 1, 0);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

const ambeintLight = new THREE.AmbientLight('white', 0.4);
scene.add(ambeintLight);

const PlayButton = <HTMLButtonElement>document.getElementById('PlayButton');
const NextButton = <HTMLButtonElement>document.getElementById('NextButton') ;
let previousBtn = document.getElementById("previousBtn");
(previousBtn?.children[0] as any).src = previousSvg;

NextButton.onclick = () => onNextClick()
NextButton.style.display = 'none';

let targetSeen = false;
let doorsOpen = false;

const doorOneTexture = new THREE.TextureLoader().load(doorOneTextureUrl);
const doorTwoTexture = new THREE.TextureLoader().load(doorTwoTextureUrl);

const doorOneMesh = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1.6, 2, 0.1),
  new THREE.MeshBasicMaterial({ map: doorOneTexture }),
);
const doorOne = new THREE.Object3D();
doorOne.add(doorOneMesh.clone());
doorOne.children[0].position.set(0.7, 0, 0);
doorOne.position.set(-1.5, 0, 0);

const doorTwoMesh = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1.6, 2, 0.1),
  new THREE.MeshBasicMaterial({ map: doorTwoTexture }),
);

const doorTwo = new THREE.Object3D();
doorTwo.add(doorTwoMesh.clone());
doorTwo.children[0].position.set(-0.7, 0, 0);
doorTwo.position.set(1.5, 0, 0);

const doors = new THREE.Group();
doors.name = "doors"
doors.position.set(0, 0, 0);
doors.add(doorOne, doorTwo);

doors.visible = false;
imageTrackerGroup.add(doors);

const doorRotation = { y: 0 };
const openTarget = { y: -1.6 };

const tweenOpenDoor = new TWEEN.Tween(doorRotation).to(openTarget, 2000)
  .easing(TWEEN.Easing.Bounce.Out).onUpdate(() => {
    doorOne.rotation.y = doorRotation.y;
    doorTwo.rotation.y = -doorRotation.y;
  })
  .onStart(() => {
    doorsOpen = true;
    PlayButton.style.display = 'none';
    console.log(imageTrackerGroup.children)
    imageTrackerGroup.children[imageTrackerGroup.children[0].name == "doors"?1:0].visible = true

  })
  .onComplete(()=>{
    NextButton.style.display = 'block';
    PlayButton.style.display = 'block';
    PlayButton.innerHTML = "закрыть"
  });

const tweenCloseDoor = new TWEEN.Tween(doorRotation).to({ y: 0 }, 2000)
  .easing(TWEEN.Easing.Bounce.Out).onUpdate(() => {
    doorOne.rotation.y = doorRotation.y;
    doorTwo.rotation.y = -doorRotation.y;
  })
  .onStart(()=>{
    PlayButton.style.display = 'none';
    imageTrackerGroup.children[imageTrackerGroup.children[0].name == "doors"?1:0].visible = false
    NextButton.style.display = 'none';

  })
  .onComplete(() => {
    doorsOpen = false;
    PlayButton.style.display = 'block';
    PlayButton.innerHTML = "открыть"
  });

function doorsAnim() {
  PlayButton.innerHTML == "открыть"?   tweenOpenDoor.start() : tweenCloseDoor.start()
}

imageTracker.onVisible.bind(() => {
  doors.visible = true;

  if (!targetSeen) {
    targetSeen = true;
  }

  if (!doorsOpen) {
    PlayButton.style.display = 'block';
  }
});
imageTracker.onNotVisible.bind(() => {
  doors.visible = false;

  if (targetSeen) {
    targetSeen = false;
  }

  PlayButton.style.display = 'none';
});

PlayButton.onclick = () => doorsAnim()
const clock = new THREE.Clock()

function render(): void {

  camera.updateFrame(renderer);

  renderer.render(scene, camera);
  TWEEN.update();

  requestAnimationFrame(render);
  mixer.update(clock.getDelta())

}

render();
