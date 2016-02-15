(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
scene = new THREE.Scene();
var COLOR_ROJO="#f93e3e";
var COLOR_VERDE="#3be55b";
var ColisionObjeto=function(tipo_elemento,width,height,nom){
	var objeto,WIDTH,HEIGHT,context,material,geometria,screen_objeto,textura,tipo_fondo,base_image;
	var ruta_carta,ruta_carta_sin_voltear,estado=false;
	var nombre;
	function init(tipo_elemento,width,height,nom){
		objeto=tipo_elemento;
		WIDTH=width;
		HEIGHT=height;
		objeto.width=width;
		objeto.height=height;
		context=objeto.getContext("2d");
		nombre=nom;
	}

	function getPosicionReal(escenario,posicion){
			return new THREE.Vector3(posicion.x-(escenario.width/2),
				((-1*posicion.y)+(escenario.height/2)),posicion.z)
	}

	function voltear(){
		base_image.src=((!estado) ? ruta_carta : ruta_carta_sin_voltear);
			base_image.onload=function(){
			context.drawImage(base_image,0,0);
			textura.needsUpdate=true;
		}
		estado=((estado==true) ? false : true);
	}	

	function esIgualA(objeto){
		return (getNombre()==objeto.getNombre() && obtenerScreen().id==objeto.obtenerScreen().id);
	}

	function esParDe(objeto){
		return (getNombre()==objeto.getNombre() && obtenerScreen().id!=objeto.obtenerScreen().id);
	}

	function definir(escenario,color,posicion){
		tipo_fondo=color;
		if(color!="TRANSPARENT"){
			context.fillStyle=color;
			context.fillRect(0,0,WIDTH,HEIGHT);
		}
		textura=new THREE.Texture(objeto);
		material=new THREE.MeshBasicMaterial({map:textura,side:THREE.DoubleSide});
		material.transparent=true;
		geometria=new THREE.PlaneGeometry(WIDTH,HEIGHT);
		screen_objeto=new THREE.Mesh(geometria,material);
		screen_objeto.position=getPosicionReal(escenario,posicion);
		textura.needsUpdate=true;
	}

	function obtenerTextura(){
		return textura;
	}

	function obtenerScreen(){
		return screen_objeto;
	}

	function setBackground(ruta){
		base_image=new Image();
		base_image.src=ruta;	
		base_image.onload=function(){
			console.log("cargando "+ruta);
			context.drawImage(base_image,0,0);
			textura.needsUpdate=true;
		}
		ruta_carta_sin_voltear=ruta;
	}

	function setBackgroundCarta(ruta){
		ruta_carta=ruta;
	}

	function getTipoBackground(){
		return tipo_fondo;
	}

	function getNombre(){
		return nombre;
	}

	function verRutaBackground(){
		console.log(base_image.src);
	}

	function actualizar(){
		textura.needsUpdate=true;
	}

	function ocultar(){
		screen_objeto.visible=false;
	}
	init(tipo_elemento,width,height,nom);
	return{
		definir:definir,
		obtenerScreen:obtenerScreen,
		obtenerTextura:obtenerTextura,
		getPosicionReal:getPosicionReal,
		getNombre:getNombre,
		setBackground:setBackground,
		setBackgroundCarta:setBackgroundCarta,
		actualizar:actualizar,
		ocultar:ocultar,
		voltear:voltear,
		esIgualA:esIgualA,
		esParDe:esParDe
	};

}

var Detector=function(obj){
	var detector,posicion,objeto,vector_posicion;	
	var detectados=[];
	function init(obj){
		detector=new AR.Detector();
		objeto=obj;
		posicion=objeto.obtenerScreen().position;
		vector_posicion=new THREE.Vector3();
	}

	function detectar(escenario,bytes,objetos,objetos_en_escena,camara){
		var markers = detector.detect(bytes);   	
	   	if(markers.length>0){   	
	   		objeto.obtenerScreen().position=objeto.getPosicionReal(escenario,new THREE.Vector3(markers[0].corners[0].x,markers[0].corners[0].y,15));
	   		objeto.obtenerScreen().visible=true;
	   		objeto.actualizar();	   		
			vector_posicion.x=objeto.obtenerScreen().position.x;
			vector_posicion.y=objeto.obtenerScreen().position.y;			
			var raycaster = new THREE.Raycaster( camara.position, vector_posicion.sub( camara.position ).normalize() );
			//console.log("veamos "+objetos[0].position.x+" "+objetos[0].position.y+" el marcador "+objeto.obtenerScreen().position.x+" "+objeto.obtenerScreen().position.y+" el original "+markers[0].corners[0].x+" "+markers[0].corners[0].y);
			intersects=raycaster.intersectObjects(objetos);
			if(intersects.length>0){			
				if(detectados.length==1 && detectados[0].esParDe(objetos_en_escena[intersects[0].object.id])){
					objetos_en_escena[intersects[0].object.id].voltear();
					console.log("elimine "+intersects[0].object.id);
					pos_elemento=objetos.indexOf(intersects[0].object);					
					delete objetos_en_escena[intersects[0].object.id];
					if (pos_elemento > -1) {
					    objetos.splice(pos_elemento, 1);
					}
					detectados.pop();	
				}else if(detectados.length==0){					
					objetos_en_escena[intersects[0].object.id].voltear();
					console.log("no habia ninguno");
					detectados.push(objetos_en_escena[intersects[0].object.id]);
				}else if(detectados[0].obtenerScreen().id!=intersects[0].object.id){
					detectados[0].voltear();
					detectados.pop();
				}
							
			}
					 
	   	}
	}

	function obtenerObjeto(){
		return objeto;
	}

	init(obj);
	return {
		detectar:detectar,
		obtenerObjeto:obtenerObjeto
	}
}
//var main=function(){
	var Escenario=function(SCREEN_WIDTH,SCREEN_HEIGHT){
		var camara,scene,renderer,VIEW_ANGLE,ASPECT,SCREEN_WIDTH,SCREEN_HEIGHT,movieScreen,videoTexture,detector;
		var canvas_recipe,canvas_recipe_context,projector,WIDTH_MOVIE,HEIGHT_MOVIE;
		var objetos=[],objetos_en_escena={};			
		function init(screen_width,screen_height){
			SCREEN_WIDTH=screen_width;
			SCREEN_HEIGHT=screen_height;
			scene=new THREE.Scene();
			renderer=new THREE.WebGLRenderer();
			renderer.setSize(screen_width,screen_height);
			document.body.appendChild(renderer.domElement);
			definirCamara();
		}
		function definirCamara(){			
			var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
			camara = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			camara.useTarget = false
			camara.position.z=1000;	
			scene.add(camara);
		}		

		function initWebcam(WIDTH_INIT,HEIGHT_INIT){
			video= new THREEx.WebcamTexture();
			videoTexture = video.texture;
			WIDTH_MOVIE=WIDTH_INIT;
			HEIGHT_MOVIE=HEIGHT_INIT;
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
				
			movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
			var movieGeometry = new THREE.PlaneGeometry( WIDTH_MOVIE, HEIGHT_MOVIE, 100, 1 );
			movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
			movieScreen.position.set(0,50,0);//*/			
			scene.add(movieScreen);	
			initVideo();
		}

		function getEscenario(){
			return {width:video.video.width,height:video.video.height};//{width:WIDTH_MOVIE,height:HEIGHT_MOVIE};
		}

		function initVideo(){			
			canvas_recipe=document.createElement("canvas");
			canvas_recipe.width=video.video.width;
			canvas_recipe.height=video.video.height;
			canvas_recipe_context=canvas_recipe.getContext("2d");
		}

		function initMarcador(objeto){
			detector=new Detector(objeto);
			scene.add(objeto.obtenerScreen());
		}

		function anadir(objeto){
			console.log("anadiendo "+objeto.getNombre());
			objetos.push(objeto.obtenerScreen());
			objetos_en_escena[objeto.obtenerScreen().id]=objeto;
			scene.add(objeto.obtenerScreen());
			//console.log(objetos_textura.length+" llevo tantos objetos");
		}

		function obtenerBytesVideo(){
			return canvas_recipe_context.getImageData(0, 0, video.video.width, video.video.height);
		}

		function render(){
			rendering();
			dibujarVideo();
			detector.detectar(getEscenario(),obtenerBytesVideo(),objetos,objetos_en_escena,camara);
			requestAnimationFrame(render);
		}

		function dibujarVideo(){
			canvas_recipe_context.drawImage(video.video,0,0,video.video.width,video.video.height)
		}

		function verObjetos(){
			for(var i=0;i<objetos.length;i++){
				console.log("los objetos son "+objetos[i].id+" "+objetos[i].position.x+" "+objetos[i].position.y);
			}
		}

		function rendering(){
			videoTexture.needsUpdate=true;
			for(var i=0;i<objetos.length;i++)
				objetos[i].needsUpdate=true;			
			detector.obtenerObjeto().actualizar();
			renderer.render( scene, camara );
		}

		init(SCREEN_WIDTH,SCREEN_HEIGHT);
		return{
			anadir:anadir,
			render:render,
			definirCamara:definirCamara,
			initWebcam:initWebcam,
			initMarcador:initMarcador,
			getEscenario:getEscenario,
			verObjetos:verObjetos
		}
	}
//}

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var escenario=new Escenario(SCREEN_WIDTH,SCREEN_HEIGHT);
escenario.initWebcam(1000,700);
objeto_detector=new ColisionObjeto(document.createElement("canvas"),132,150,"detector");
objeto_detector.definir(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(10,10,0));
objeto_detector.setBackground('../assets/img/mano_escala.png');
objeto_detector.ocultar();
escenario.initMarcador(objeto_detector);
var animales=["medusa","ballena","cangrejo","pato"];
for(var i=1,columna=30,fila_pos=i,fila=20;i<=8;i++,fila_pos=((i==5) ? 1 : fila_pos+1),fila=(fila_pos==1 ? 20 : (fila+120+20)),columna=((i>4) ? 30+120+30 : 30)){		
	console.log("agregando carta en "+fila_pos+" "+animales[fila_pos-1]);
	carta=new ColisionObjeto(document.createElement("canvas"),120,120,animales[fila_pos-1]);
	carta.definir(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(fila,columna,0));
	carta.setBackground("../assets/img/memorama/sin_voltear.jpg");
	carta.setBackgroundCarta("../assets/img/memorama/escala/cart"+i+"_"+animales[fila_pos-1]+".jpg");
	escenario.anadir(carta);
}
escenario.verObjetos();
escenario.render();
},{}]},{},[1]);
