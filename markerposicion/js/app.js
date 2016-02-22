video= new THREEx.WebcamTexture();
video.video.width=640;
video.video.height=480;

videoTexture=video.texture;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
var renderer=new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(0xffffff, 1);
renderer.setSize(video.video.width,video.video.height);
document.body.appendChild(renderer.domElement); 

var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(40,video.video.width/video.video.height,.1,1000);
scene.add(camera);

function getProfundidadReal(ancho){
	return (-1*((ancho*100)/640))*100;
}

function createTexture(){
	movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );			
	var movieGeometry =new THREE.PlaneGeometry(1,1,0.0);
	movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	object=new THREE.Object3D();
	object.position.z=-1;
	object.add(movieScreen);		
	return object;
}

texture=createTexture();
scene.add(texture);	

canvas_recipiente=document.createElement("canvas");
canvas_recipiente.width=video.video.width;
canvas_recipiente.height=video.video.height;
canvas_recipiente_context=canvas_recipiente.getContext("2d");

function createModel(marker){
	var canvas_cuadro=document.createElement("canvas");
	canvas_cuadro.width=30;
	canvas_cuadro.height=30;
	var canvas_cuadro_context=canvas_cuadro.getContext("2d");
	canvas_cuadro_context.fillStyle="#FFF000";
	canvas_cuadro_context.fillRect(0,0,30,30);

	var textura_canvas=new THREE.Texture(canvas_cuadro);
	var material=new THREE.MeshBasicMaterial({map:textura_canvas});
	var geometry=(!marker ? new THREE.PlaneGeometry(30,30) : new THREE.PlaneGeometry(1,1));
	var screen_canvas=new THREE.Mesh(geometry,material);
	var object=new THREE.Object3D();
	object.add(screen_canvas);
	return object;
}
function centrar(x,y,z){
	return THREE.Vector3((x - (video.video.width / 2)),((video.video.height / 2) - y),z);
}
objeto_canvas=createModel(true);
objeto_prueba=createModel(false);
objeto_prueba.position.set(0,0,getProfundidadReal(30));
objeto_prueba.children[0].material.map.needsUpdate=true;
scene.add(objeto_prueba);
scene.add(objeto_canvas);

detector=new AR.Detector();
modelSize=35.0;
var posit = new POS.Posit(modelSize, video.video.width);
var markers;
function detectarMarcador(bytes){
	markers=detector.detect(bytes);
	if(markers.length>0){
		centrarMarcador();			
	}
}

function centrarMarcador(){
	 var corners, corner, pose, i;
        corners = markers[0].corners;
        
        for (i = 0; i < corners.length; ++ i){
          corner = corners[i];
          
          corner.x = corner.x - (video.video.width / 2);
          corner.y = (video.video.height / 2) - corner.y;
        }
        
        pose = posit.pose(corners);
        
        updateObject(pose.bestRotation, pose.bestTranslation);     
}


 function updateObject(rotation, translation){
      objeto_canvas.scale.x = modelSize;
      objeto_canvas.scale.y = modelSize;
      objeto_canvas.scale.z = modelSize;
      
      objeto_canvas.rotation.x = -Math.asin(-rotation[1][2]);
      objeto_canvas.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
      objeto_canvas.rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);

      objeto_canvas.position.x = translation[0];
      objeto_canvas.position.y = translation[1];
      objeto_canvas.position.z = -translation[2];
      console.log("lo encontre "+objeto_canvas.position.x+" "+objeto_canvas.position.y+" "+objeto_canvas.position.z);
      objeto_canvas.children[0].material.map.needsUpdate=true;
 };

function obtenerBytesVideo(){
	return canvas_recipiente_context.getImageData(0, 0, video.video.width, video.video.height);
}

function render(){
	renderer.autoClear = false;
    renderer.clear();	
	renderer.render(scene,camera);
}

function loop(){	
	requestAnimationFrame(loop);
    if (video.video.readyState === video.video.HAVE_ENOUGH_DATA){	
		canvas_recipiente_context.drawImage(video.video,0,0,video.video.width,video.video.height);
		detectarMarcador(obtenerBytesVideo());		
		texture.children[0].material.map.needsUpdate = true;
		objeto_canvas.children[0].material.map.needsUpdate = true;
		render();
	}
}

loop();
