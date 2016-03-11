THREE.Matrix4.prototype.setFromArray = function(m) {
        return this.set(
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15]
        );
    }
var error = new Audio("./assets/sounds/error.wav"); // buffers automatically when created
var acierto = new Audio("./assets/sounds/acierto.wav"); 
//snd.play();
var videoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),planoScene=new THREE.Scene();
var WIDTH_CANVAS=640,HEIGHT_CANVAS=480;
var videoCamera=new THREE.PerspectiveCamera(40,WIDTH_CANVAS/HEIGHT_CANVAS,0.1,1000);//THREE.Camera();
var realidadCamera=new THREE.Camera();
var planoCamera=new THREE.PerspectiveCamera(40,WIDTH_CANVAS/HEIGHT_CANVAS,0.1,2000);//THREE.Camera();
var renderer=new THREE.WebGLRenderer();

planoCamera.lookAt(planoScene.position);
renderer.autoClear = false;
renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
document.body.appendChild(renderer.domElement);


var canvas_element=document.createElement("canvas");
canvas_element.width=WIDTH_CANVAS;
canvas_element.height=HEIGHT_CANVAS;
var canvas_context=canvas_element.getContext("2d");


var video=new THREEx.WebcamTexture();
video.video.width=WIDTH_CANVAS;
video.video.height=HEIGHT_CANVAS;
videoTexture=video.texture;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
var movieGeometry = new THREE.PlaneGeometry(1,1,0.0);
movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
				//movieScreen.position.set(0,50,0);//*/		
camara3d=new THREE.Object3D();
camara3d.position.z=-1;
camara3d.add(movieScreen);
camara3d.children[0].material.map.needsUpdate=true;
videoScene.add(camara3d);	
var markerRoot=new THREE.Object3D();
markerRoot.matrixAutoUpdate = false;
var geometry = new THREE.PlaneGeometry( 100, 100, 100 );
var material = new THREE.MeshBasicMaterial({color:0xcccccc
});
var cube = new THREE.Mesh(
  geometry,
  material
);
cube.position.z=-1;
markerRoot.add(cube);
realidadScene.add(markerRoot);

function Elemento(width_canvas,height_canvas,geometry){
    var width,height,nombre,canvas,context,mesh,material,image,geometria,origen=new THREE.Vector2(),x,y;
    var imagen_carta,umbral_colision,box,imagen_principal,imagen1,imagen2,estado=true,escalas=new THREE.Vector3(),posiciones=new THREE.Vector3();
    var init=function(){
        canvas=document.createElement("canvas");
        canvas.width=width_canvas;
        canvas.height=height_canvas;
        context=canvas.getContext("2d");
        textura_principal=new THREE.Texture(canvas);
        textura_principal.minFilter = THREE.LinearFilter;
        textura_principal.magFilter = THREE.LinearFilter;
        material=new THREE.MeshBasicMaterial({map:textura_principal});  
        material.transparent=true;
        geometria=geometry;
        mesh=new THREE.Mesh(geometria,material);
        width=width_canvas;
        height=height_canvas;   
        imagen_carta=new Image();
        cambiarUmbral(1);   
    }

    function cambiarUmbral(escala){     
        umbral_colision=width/4;//+((width/2)*escala);
    }

    var etiqueta=function(etiqueta){
        console.log("el nombre "+etiqueta);
        nombre=etiqueta
    }

    var dimensiones=function(){
        return " "+width+" "+height;        
    }

    function calculoOrigen(){
        origen.x=(posiciones.x+(width/2));
        origen.y=(posiciones.y+(height/2));
        origen.z=posiciones.z;
    }

    function interseccion(b) {
      return (Math.abs(this.getOrigen().x - b.getOrigen().x) * 2 < (width + b.getDimensiones().width)) &&
             (Math.abs(this.getOrigen().y - b.getOrigen().y) * 2 < (height + b.getDimensiones().height));
    }

    var datosInteresantes=function(){
        console.log("origenes "+origen.x+" "+origen.y+" "+origen.z+" "+width+" "+height);
        console.dir(posiciones);
        console.dir(escalas);
    }

    var calculoAncho=function(height_test){
        vFOV = Math.PI/4;
        height = 2 * Math.tan( Math.PI/8 ) * Math.abs(mesh.position.z-camera.position.z);
        fraction = height_test / height;
        console.log("veamos si funciona "+fraction)
    }

    

    var definir=function(ruta){
        imagen_carta.src=ruta;
        imagen_carta.onload=function(){
            context.drawImage(imagen_carta,0,0);
            material.map.needsUpdate=true;
        }
    }

    var definirCaras=function(frontal,trasera){        
        imagen_carta.src=frontal;
        imagen_carta.onload=function(){
            context.drawImage(imagen_carta,0,0);
            material.map.needsUpdate=true;
        }
        imagen1=frontal;
        imagen2=trasera;
        imagen_principal=frontal;    
    }

    var getDimensiones=function(){
        return {width:width,height:height,position:posiciones,geometry:mesh.geometry};
    }

    var get=function(){
        return mesh;
    }

    function actualizarMedidas(){
        width=width*mesh.scale.x;
        height=height*mesh.scale.y;
        cambiarUmbral(1);
        console.log("actualice medidas "+width+" "+height);
    }

    var scale=function(x,y){
        mesh.scale.x=x;
        mesh.scale.y=y;        
        actualizarMedidas();
    }

    var position=function(pos){
        mesh.position.set(pos.x,pos.y,pos.z);
        x=pos.x;
        y=pos.y;
        posiciones=pos;
    }


    var actualizar=function(){
        material.map.needsUpdate=true;
        if(x!=mesh.position.x || y!=mesh.position.y){           
            x=mesh.position.x;
            y=mesh.position.y;
            posiciones.x=mesh.position.x;
            posiciones.y=mesh.position.y;
            posiciones.z=mesh.position.z;
            calculoOrigen();
        }
    }

    var getCanvas=function(){
        return canvas;
    }

    function distancia(v1,v2){
        dx = v1.x - v2.x;
        dy = v1.y - v2.y;

        return Math.sqrt(dx*dx+dy*dy);
    }

    function colisiona2(objeto){
        var mano=new THREE.Box3().setFromObject(mesh);
        var carta=new THREE.Box3().setFromObject(objeto);
        p1={x:mano.min.x,y:mano.max.y};
        p2={x:mano.max.x,y:mano.min.y};
        if(((carta.min.y>=mano.max.y && carta.max.y<=mano.max.x) || 
                (carta.max.y<=mano.min.y && mano.min.x>=carta.min.x) ||
                (p1.y>=carta.max.y && p1.x<=carta.min.x)||
                (p2.y<=carta.min.y && p2.x<=carta.max.x)) && distancia(carta.center(),mano.center())<=(carta.size().x/2))
            return true;
        return false;       
     }  


    function colisiona(carta){
        var mano=new THREE.Box3().setFromObject(mesh);
        carta=new THREE.Box3().setFromObject(carta);
        return distancia(carta.min,mano.min)<carta.size().x && distancia(carta.max,mano.max)<carta.size().x;  
     }
    

    var voltear=function(){
        imagen_principal=(estado) ? imagen2 : imagen1;
        //var voltear=function(){
        imagen_carta.src=imagen_principal;
            imagen_carta.onload=function(){
            context.drawImage(imagen_carta,0,0);
            textura_principal.needsUpdate=true;
        }
    //}
        estado=(estado) ? false : true;
        textura_principal.needsUpdate=true;
    }

    var esParDe=function(objeto){       
        return nombre==objeto.getNombre() && mesh.id!=objeto.get().id;
    }

    var igualA=function(objeto){
        return mesh.id==objeto.get().id;
    }

    var getOrigen=function(){
        return origen;
    }
    var getNombre=function(){
        return nombre;
    }

    var getUmbral=function(){
        return umbral_colision;
    }

    var actualizarPosicionesYescala=function(posicion,escala){
    	posiciones.x=posicion.x;
    	posiciones.y=posicion.y;
    	posiciones.z=posicion.z;
    	escalas.x=escala.x;
    	escalas.y=escala.y;
    	escalas.z=escala.z;
    	calculoOrigen();
    }

    init();
    return {
        get:get,
        getDimensiones:getDimensiones,
        nombre:nombre,
        definirCaras:definirCaras,
        voltear:voltear,
        getNombre:getNombre,
        igualA:igualA,
        esParDe:esParDe,
        distancia:distancia,
        datosInteresantes:datosInteresantes,
        calculoOrigen:calculoOrigen,
        actualizarPosicionesYescala:actualizarPosicionesYescala,
        calculoAncho:calculoAncho,
        etiqueta:etiqueta,
        scale:scale,
        dimensiones:dimensiones,
        getCanvas:getCanvas,
        getUmbral:getUmbral,
        getOrigen:getOrigen,
        actualizar:actualizar,
        position:position,
        definir:definir,
        colisiona:colisiona
    }

}

function Labels(width,height){
	var canvas,context,material,textura,sprite,x_origen,y_origen;
	function init(){
		canvas=document.createElement("canvas");
		canvas.width=width;
		canvas.height=height;
		context=canvas.getContext("2d");
	}
	var definir=function(parametros){
		context.fillStyle=parametros.color;
		context.textAlign=parametros.alineacion;
		context.font=parametros.tipografia;	
		x_origen=parametros.x;
		y_origen=parametros.y;
	}

	var crear=function(texto){
		context.fillText(texto,x_origen,y_origen);
		textura = new THREE.Texture(canvas);
		textura.minFilter = THREE.LinearFilter;
		textura.magFilter = THREE.LinearFilter;
	    textura.needsUpdate = true;

	    var material = new THREE.SpriteMaterial({
	        map: textura,
	        transparent: false,
	        useScreenCoordinates: false,
	        color: 0xffffff // CHANGED
	    });

	    sprite = new THREE.Sprite(material);
	    sprite.scale.set(15,15, 1 ); // CHANGED
	    return sprite;
	}

	var actualizar=function(texto){		
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText(texto,x_origen,y_origen);
		textura.needsUpdate=true;
	}
	init();
	return{
		definir:definir,
		crear:crear,
		actualizar:actualizar
	}

}

//init();


mano=Elemento(120,120,new THREE.PlaneGeometry(120,120));
mano.definir("./assets/img/mano_escala.png");
//mano.get().visible=false;
mano.get().position.z=-1;
objeto=new THREE.Object3D();
objeto.matrixAutoUpdate = false;
objeto.add(mano.get());
//objeto.visible=false;
realidadScene.add(objeto);
var animales=["medusa","ballena","cangrejo","pato"];
objetos=[],objetos_mesh=[];        
var animales=["medusa","ballena","cangrejo","pato"];
for(var i=1,columna=-100,fila_pos=i,fila=-300;i<=8;i++,fila_pos=((i==5) ? 1 : fila_pos+1),fila=(fila_pos==1 ? -300 : (fila+150+33)),columna=((i>4) ? 120 : -100)){			
	var elemento=Elemento(120,120,new THREE.PlaneGeometry(120,120));
	elemento.etiqueta(animales[fila_pos-1]);
	elemento.scale(.7,.7);
	elemento.definirCaras("./assets/img/memorama/sin_voltear.jpg","./assets/img/memorama/escala/cart"+i+"_"+animales[fila_pos-1]+".jpg");
	elemento.position(new THREE.Vector3(fila,columna,-800),elemento.getCanvas());	
	elemento.calculoOrigen();
	objetos_mesh.push(elemento);
	objetos.push(elemento);
    planoScene.add(elemento.get());
}
var material_kathia;
textura_kathia=new THREE.Texture(renderer_pixi.view);
textura_kathia.minFilter = THREE.LinearFilter;
textura_kathia.magFilter = THREE.LinearFilter;
geometria_kathia=new THREE.PlaneGeometry(kathia_ancho,kathia_alto);
material_kathia=new THREE.MeshBasicMaterial({map:textura_kathia});
mesh_kathia=new THREE.Mesh(geometria_kathia,material_kathia);	
mesh_kathia.position.set(-400,-300,-1100);
planoScene.add(mesh_kathia);

texto=Labels(250,250);
texto.definir({
	color:'#ff0000',
    alineacion:'center',
    tiporafia:'200px Arial',
    x:250/2,
    y:250/2
});
label=texto.crear("HELLO WORLD");
planoScene.add(label);

label.position.set(-1.5,-6.6,-20);
var JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
var JSARParameters = new FLARParam(WIDTH_CANVAS, HEIGHT_CANVAS);
var detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
detector.setContinueMode(true);
var result = new Float32Array(16);
JSARParameters.copyCameraMatrix(result, 10, 1000);
realidadCamera.projectionMatrix.setFromArray(result);
function getMarkerNumber(idx) {
	var data = detector.getIdMarkerData(idx);
	if (data.packetLength > 4) {
    	return -1;
	} 
            
	var result=0;
	for (var i = 0; i < data.packetLength; i++ ) {
    	result = (result << 8) | data.getPacketData(i);
	}

	return result;
}

function getTransformMatrix(idx) {
    var mat = new NyARTransMatResult();
    detector.getTransformMatrix(idx, mat);

    var cm = new Float32Array(16);
    cm[0] = mat.m00;
    cm[1] = -mat.m10;
    cm[2] = mat.m20;
    cm[3] = 0;
    cm[4] = mat.m01;
    cm[5] = -mat.m11;
    cm[6] = mat.m21;
    cm[7] = 0;
    cm[8] = -mat.m02;
    cm[9] = mat.m12;
    cm[10] = -mat.m22;
    cm[11] = 0;
    cm[12] = mat.m03+30;
    cm[13] = -mat.m13-20;
    cm[14] = mat.m23;
    cm[15] = 1;

    return cm;
}
//realidadCamera.position.z=200;
//realidadCamera.lookAt(realidadScene.position);
//realidadCamera.position.z=1;
//videoCamera.lookAt(videoScene.position);
//videoCamera.position.z=1;



THREE.Object3D.prototype.transformFromArray = function(m) {
    this.matrix.setFromArray(m);
    this.matrixWorldNeedsUpdate = true;
}

// CREAR OTRA ESCENA Y OTRA CAMARA, Y AGREGAR LOS ELEMENTOS VIRTUALES AQUI

function obtenerMarcador(markerCount){
	var matriz_encontrada
	for(var i=0;i<markerCount;i++){
		matriz_encontrada=getTransformMatrix(i);
	}	
    objeto.transformFromArray(matriz_encontrada);
	//markerRoot.transformFromArray(matriz_encontrada);
    objeto.visible=true;
}
var pares=0;
var detectados=[];
function logicaMemorama(pos_colision){  
    console.log("hubo colision con "+objetos_mesh[pos_colision].getNombre()+" "+pos_colision);   
    if(detectados.length==1 && detectados[0].igualA(objetos_mesh[pos_colision])){

    }else if(detectados.length==1 && detectados[0].esParDe(objetos_mesh[pos_colision])){        
        platicarModificada("acierto");
        acierto.play();
        objetos_mesh[pos_colision].voltear();               
        objetos_mesh[pos_colision]=null;
        pares++;
        detectados=[];  
    }else if(detectados.length==0){     
        objetos_mesh[pos_colision].voltear();
        detectados.push(objetos_mesh[pos_colision]);
    }else if(detectados[0].get.id!=objetos_mesh[pos_colision]){     
        platicarModificada("error_por_intento");
        error.play();
        detectados[0].voltear();
        detectados.pop();
    }
    //*/
}

function verificarColision(){
	mano.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale());
	for(var i=0;i<objetos_mesh.length;i++){
        if(objetos_mesh[i]==null)
            continue;
		if(mano.colisiona(objetos[i].get())){
			console.log("Colisiona con "+objetos[i].getNombre()+" "+i);	
            logicaMemorama(i);
        }	
	}
}
function detectarMarcador(){
	var markerCount = detector.detectMarkerLite(JSARRaster, 139); 
	if(markerCount>0){
		obtenerMarcador(markerCount);
		verificarColision();
	}
}

function rendering(){	
	renderer.clear();
	renderer.render( videoScene, videoCamera );
	renderer.clearDepth();
    renderer.render( planoScene, planoCamera );
    renderer.clearDepth();
	renderer.render( realidadScene, realidadCamera );
}

function loop(){
	camara3d.children[0].material.map.needsUpdate=true;
	//markerRoot.children[0].material.needsUpdate=true;
    objeto.children[0].material.needsUpdate=true;    
    for(var i=0;i<objetos.length;i++){
    	objetos[i].actualizar();
    }
	canvas_context.drawImage(video.video,0,0);
	canvas_element.changed = true;
	label.material.map.needsUpdate=true;
	textura_kathia.needsUpdate=true;
	detectarMarcador();
	rendering();
	requestAnimationFrame(loop);
	if(!pausado_kathia)
		animate();
}

initKathia(texto);
loop();