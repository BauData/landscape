var THREE = require('three');
var TWEEN = require('tween.js');
var io = require('socket.io-client');
var atutil = require('atutil');

var socket;
var locationFull = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

//GENERAL SETTINGS
var width = window.innerWidth;
var height = window.innerHeight;
var halfWidth = width / 2;
var halfHeight = height / 2;
//threejs stuff
var renderer, camera, scene;
var mesh;
//preload    
var loadedAssets = 0;
//weather color
var ColorA;
var ColorB;
var lat;
var lon;
var altitude;
//video
var frameLimit;
var currentFrame = 0;

preload();
// preload
function preload() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    socketInit();
    createFragmentShaderScript();
    initWeather();
}
// assetLoaded
function assetLoaded() {
    ++loadedAssets;
    //attenzione perché se il valore max non è giusto, si chiama + volte la funzione start
    if (loadedAssets == 4) {
        allLoaded();
    }
}
// allLoaded
function allLoaded() {
    var spinner = document.getElementById('loading_spinner');
    spinner.style.opacity = 1.0;

    var outTween = new TWEEN.Tween( spinner.style )
        .to( { opacity: 0.1 }, 1500 )
        .easing( TWEEN.Easing.Quadratic.In )
        .onComplete(function () {
            spinner.style.display = "none";
        });
    outTween.start();
    start();
}
//start
function start() {
    setup();
    animate();
}
//createFragmentShaderScript
function createFragmentShaderScript() {
    var script = document.createElement('script');
    script.type = 'x-shader/x-fragment';
    script.id = 'fragmentShader';
    script.text = [
        "#define NUM_MOUNTAINS 15.",
        "#define MAX_OCTAVES 8",
        "uniform vec2    u_resolution;",
        "uniform float   u_time;",
        "uniform vec2    u_coords;",
        "uniform float   u_altitude;",
        "uniform vec3    u_colorA;",
        "uniform vec3    u_colorB;",
        "uniform float   u_randomValue;",
        "float lerp(float value,float min,float max){",
        "    return min+(max-min)*value;",
        "}",
        "float norm(float value,float min,float max){",
        "    return (value-min)/(max-min);",
        "}",
        "float map(float value,float min1,float max1,float min2,float max2){",
        "    return lerp(norm(value,min1,max1),min2,max2);",
        "}",
        "float random(in vec2 st){",
        "    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);",
        "}",
        "// Based on Morgan McGuire @morgan3d",
        "// https://www.shadertoy.com/view/4dS3Wd",
        "float noise(in vec2 st){",
        "    vec2 i=floor(st);",
        "    vec2 f=fract(st);",
        "    float a=random(i);",
        "    float b=random(i+vec2(1.,.0));",
        "    float c=random(i+vec2(.0,1.));",
        "    float d=random(i+vec2(1.,1.));",
        "    vec2 u=f*f*(3.-2.*f);",
        "    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;",
        "}",
        "float fbm(in vec2 n,in int octaves,in float l){",
        "    float v=.0;",
        "    float lacunarity=2.;",
        "    float a=.5;",
        "    n=n*l;",
        "    for(int i=0;i<MAX_OCTAVES;++i){",
        "        if(i>=octaves){break;}",
        "        v+=a*noise(n);",
        "        n*=lacunarity;",
        "        a*=.5;",
        "    }",
        "    return v;",
        "}",
        "float plot(vec2 st,float pct){",
        "  return 1.-smoothstep(pct,pct+.005,st.y);",
        "}",
        "void main(){",
        "    vec2 st=gl_FragCoord.xy/u_resolution.xy;",
        "    st.x *=u_resolution.x/u_resolution.y;",
        "    float m=st.x*.5+.5;",
        "    vec3 color=u_colorB+vec3(0.2,0.2,0.2);",
        "    float y;",
        "    float pct;",
        "    float scaleFactor;",
        "    float breakValue=NUM_MOUNTAINS-u_altitude;",
        "    float i;",
        "    for(float n=NUM_MOUNTAINS;n>0.;n--){",
        "        if(n<=breakValue){break;}",
        "        i=n-breakValue;",
        "        scaleFactor=(u_altitude+i)/i*.15;",
        "        y=scaleFactor*m*(fbm(u_randomValue*m+.001*u_coords+(random(vec2(i))+u_randomValue)*1000.,int(map(i,.0,u_altitude,4.,7.)),.4/scaleFactor)-.5)+(i-1.)*1.75/(u_altitude+i);",
        "        pct=plot(st,y);",
        "        color=mix(color,vec3(map(i,.0,u_altitude,u_colorA.r,u_colorB.r),map(i,.0,u_altitude,u_colorA.g,u_colorB.g),map(i,.0,u_altitude,u_colorA.b,u_colorB.b)),pct);",
        "    }",
        "    gl_FragColor=vec4(color,1.);",
        "}",
        ].join('\n');
    document.body.appendChild(script);
    socket.emit('shader', script.text);
    assetLoaded(); 
}
//initWeather
function initWeather() {
    var weather = require ('openweathermap');
    var Client = require('node-rest-client').Client;
    var elevationApi = require('google-elevation-api');
    var config = require('./../config');
    var client = new Client();
    console.log(locationFull);
    client.get(locationFull + "/getRandomCity", function (data, response) {
        lon = data.cityLon;
        lat = data.cityLat;
        elevationApi({
            key: config.googlemaps.KEY,
            locations: [[lat, lon]]
        }, function(err, locations) {
            if(!err) {
                altitude = atutil.map(locations[0].elevation, 0, 1750, 3, 10);
            }
            if(!altitude) {
                altitude = 5;
            }
            assetLoaded();
        });
        weather.defaults({units: 'metric', lang: 'en', mode: 'json'});
        weather.now({id: data.cityID, APPID: config.openweathermap.APPID}, report);
        function report(err, json) {
            if (!err) {
                var weatherCode = json.weather[0].id;
                var weatherTemp = json.main.temp;
                var colors = weatherMapping.mapWeatherCode(weatherCode, weatherTemp);
                if(colors.colorA && colors.colorB) { 
                    ColorA = new THREE.Color(colors.colorA);
                    ColorB = new THREE.Color(colors.colorB);
                    socket.emit('weather', {    
                        description: json.weather[0].description,
                        temperature: weatherTemp,
                        colors: {
                            colorA: ColorA.r + "," + ColorA.g + "," + ColorA.b,
                            colorB: ColorB.r + "," + ColorB.g + "," + ColorB.b
                        }
                    }); 
                    assetLoaded();  
                }
            }
        }
    });
}
// setup
function setup() {
	var canvas = document.getElementById( "c" );
  	scene = new THREE.Scene();
  	camera = new THREE.OrthographicCamera( -halfWidth, halfWidth, halfHeight, -halfHeight, 0, 1 );
    camera.position.z = 1;

    var geometry = new THREE.PlaneBufferGeometry(2, 2);

    var uniforms = {
        u_colorA: {type: "c", value: ColorA},
        u_colorB: {type: "c", value: ColorB},
        u_coords: {type: "v2", value: new THREE.Vector2()},
        u_altitude: {type: "f", value: Math.floor(altitude)},
        u_randomValue: { type: "f", value: atutil.randomInt(3,7) },
        u_resolution: { type: "v2", value: new THREE.Vector2() }
    };
    uniforms.u_resolution.value.x = width;
    uniforms.u_resolution.value.y = height;
    uniforms.u_coords.value.x = lat;
    uniforms.u_coords.value.y = lon;
    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width , height );

    setTimeout( function(){ currentFrame = 1 }, 100);

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize( event ) {
    width = window.innerWidth;   
    height = window.innerHeight;
    halfWidth = window.innerWidth / 2;
	halfHeight = window.innerHeight / 2;
	camera.left = -halfWidth;
	camera.right = halfWidth;
	camera.top = halfHeight;
	camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    mesh.material.uniforms.u_resolution.value.x = renderer.domElement.width;
    mesh.material.uniforms.u_resolution.value.y = renderer.domElement.height;
    renderer.setSize( width, height );
}

function animate() {
    requestAnimationFrame( animate );
    render();
    TWEEN.update();
}

function render() {
    renderer.render( scene, camera );
    renderFrame();
}

function renderFrame() {
    if( currentFrame >= 1 && currentFrame <= frameLimit ) {
        sendFrame();
        currentFrame++;
    }
}

function sendFrame() {
    var currentFrameString = atutil.pad(currentFrame.toString(), 3);
    socket.emit('renderFrame', {    
        frame: currentFrameString,
        file: document.querySelector('canvas').toDataURL()
    });
    if (currentFrameString == '001') {
        socket.emit('coverFrame',document.querySelector('canvas').toDataURL('image/jpeg', 1.0));
    }
}

function socketInit() {
    socket = io.connect(locationFull);
    socket.on("frameLimit", setFrameLimit);
    socket.emit('bot', 'landscape');
    assetLoaded();
}

function setFrameLimit(data) {
    frameLimit = data;
}
console.log("client is running");