var THREE = require('three');
var TWEEN = require('tween.js');
var io = require('socket.io-client');
var ATUtil = require('atutil');

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
var frameLimit = 1;
var currentFrame = 0;

preload();
// preload
function preload() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    socketInit();
    initWeather();
}
// assetLoaded
function assetLoaded() {
    ++loadedAssets;
    //attenzione perché se il valore max non è giusto, si chiama + volte la funzione start
    if (loadedAssets == 3) {
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
//initWeather
function initWeather() {
    var weather = require ('openweathermap');
    var weatherMapping = require ('weatherMapping');
    var Client = require('node-rest-client').Client;
    var elevationApi = require('google-elevation-api');
    var config = require('./../config');
    var client = new Client();
    client.get(locationFull + "/getRandomCity", function (data, response) {
        lon = data.cityLon;
        lat = data.cityLat;
        elevationApi({
            key: config.googlemaps.KEY,
            locations: [[lat, lon]]
        }, function(err, locations) {
            if(!err) {
                altitude = ATUtil.map(locations[0].elevation, 0, 1750, 3, 10);
                altitude = Math.floor(altitude);
            }
            if(!altitude) {
                altitude = 5;
            }
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
                        });
                        createFragmentShaderScript(); 
                        assetLoaded();  
                    }
                }
            }
        });

    });
}
//createFragmentShaderScript
function createFragmentShaderScript() {
    var colorOne = "vec3(" + ColorA.r.toFixed(2) + "," + ColorA.g.toFixed(2) + "," + ColorA.b.toFixed(2) + ")";
    var colorTwo = "vec3(" + ColorB.r.toFixed(2) + "," + ColorB.g.toFixed(2) + "," + ColorB.b.toFixed(2) + ")";
    var skyColor = generateSkyColor();
    var coords =  "vec2(" + Math.abs(lat) + "," + Math.abs(lon) + ")";
    var elevetion =  altitude.toFixed(1);
    var script = document.createElement('script');
    script.type = 'x-shader/x-fragment';
    script.id = 'fragmentShader';
    script.text = [
        "#define MAX_OCTAVES 8",
        "uniform vec2    u_resolution;",
        "float map(float value,float min1,float max1,float min2,float max2){",
        "    return min2+(value-min1)*(max2-min2)/(max1-min1);",
        "}",
        "float random(in vec2 st){",
        "    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);",
        "}",
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
        "    n*=l;",
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
        "    st.x*=u_resolution.x/u_resolution.y;",
        "    float m=st.x*.5+.5;",
        "    vec3 colorA=" + colorOne + ";",
        "    vec3 colorB=" + colorTwo + ";",
        "    vec3 color=" + skyColor + ";",
        "    float y;",
        "    float pct;",
        "    float scaleFact;",
        "    vec2 coords="+coords+";",
        "    float i;",
        "    for(float i=" + elevetion + ";i>0.;i--){",
        "        scaleFact=(" + elevetion + "+i)/i*.25;",
        "        y=scaleFact*m*(fbm(5.*(m+pow(coords.x,random(coords)))+.001*coords,int(map(i,.0," + elevetion + ",5.,7.)),.4/scaleFact)-.5)+(i-1.)*3./(" + elevetion + "+i);",
        "        pct=plot(st,y);",
        "        color=mix(color,vec3(map(i,.0," + elevetion + ",colorA.r,colorB.r),map(i,.0," + elevetion + ",colorA.g,colorB.g),map(i,.0," + elevetion + ",colorA.b,colorB.b)),pct);",
        "    }",
        "    gl_FragColor=vec4(color,1.);",
        "}",
        ].join('\n');
    document.body.appendChild(script);
    socket.emit('shader', script.text);
    assetLoaded(); 
}
//generateSkyColor
function generateSkyColor() {
    var res;
    var factor = ATUtil.randomRange(.0, .2);
    //lighter
    if (factor >= .0 && factor < .1) {
        res = ColorB;
        res.r = ATUtil.clamp((ColorB.r + .2), .0, 1.);
        res.g = ATUtil.clamp((ColorB.g + .2), .0, 1.);
        res.b = ATUtil.clamp((ColorB.b + .2), .0, 1.);
    }
    //another color
    else {
        res = ATUtil.randomInt(0, 360);
        var lightness = ATUtil.randomInt(40, 100);
        res = "hsl(" + res + ", 100%, " + lightness + "%)";
        res = new THREE.Color(res);
    }
    res = "vec3(" + res.r.toFixed(2) + "," + res.g.toFixed(2) + "," + res.b.toFixed(2) + ")";
    return res;
}
// setup
function setup() {
	var canvas = document.getElementById( "c" );
  	scene = new THREE.Scene();
  	camera = new THREE.OrthographicCamera( -halfWidth, halfWidth, halfHeight, -halfHeight, 0, 1 );
    camera.position.z = 1;

    var geometry = new THREE.PlaneBufferGeometry(2, 2);

    var uniforms = {
        u_resolution: { type: "v2", value: new THREE.Vector2() }
    };
    uniforms.u_resolution.value.x = width;
    uniforms.u_resolution.value.y = height;
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

    setTimeout( function(){ currentFrame = 1 }, 3000);

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize( event ) {
    width = window.innerWidth;   
    height = window.innerHeight;
    halfWidth = width / 2;
	halfHeight = height / 2;
	camera.left = -halfWidth;
	camera.right = halfWidth;
	camera.top = halfHeight;
	camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    mesh.material.uniforms.u_resolution.value.x = width;
    mesh.material.uniforms.u_resolution.value.y = height;
    renderer.setSize( width, height );
}

function animate() {
    requestAnimationFrame( animate );
    render();
    TWEEN.update();
}

function render() {
    renderer.render( scene, camera );
    //renderFrame();
}

function renderFrame() {
    if(currentFrame >= 1 && currentFrame < frameLimit + 1) {
        if(currentFrame == 1){
            sendCover(); 
        }
        if(frameLimit != 1){
            sendFrame(); 
        }
        currentFrame++;
    }
}

function sendCover() {
    socket.emit('coverFrame',document.querySelector('canvas').toDataURL('image/jpeg', 1.0));
}

function sendFrame() {
    var currentFrameString = ATUtil.pad(currentFrame.toString(), 3);
    socket.emit('renderFrame', {    
        frame: currentFrameString,
        file: document.querySelector('canvas').toDataURL()
    });
}

function socketInit() {
    socket = io.connect(locationFull);
    socket.emit("frameLimit", frameLimit);
    socket.emit('bot', 'landscape');
    assetLoaded();
}

console.log("client is running");