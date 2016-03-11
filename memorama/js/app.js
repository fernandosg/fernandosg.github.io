var Escenario=require("./escenario");
var ColisionObjeto=require("./colisionobjeto");
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var escenario=Escenario();
escenario.init(SCREEN_WIDTH,SCREEN_HEIGHT);
escenario.initWebcam(1000,700);
objeto_detector=ColisionObjeto();
objeto_detector.init(document.createElement("canvas"),132,150,"detector");
objeto_detector.definir(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(10,10,0));
objeto_detector.setBackground('./assets/img/mano_escala.png');
objeto_detector.ocultar();
extra=ColisionObjeto();
extra.init(document.createElement("canvas"),132,150,"mano");
extra.definir3d(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(300,10,0));
extra.setBackground('./assets/img/mano_escala.png');
escenario.anadirPrueba(extra);
escenario.initMarcador(objeto_detector);
/*
var animales=["medusa","ballena","cangrejo","pato"];
for(var i=1,columna=30,fila_pos=i,fila=20;i<=8;i++,fila_pos=((i==5) ? 1 : fila_pos+1),fila=(fila_pos==1 ? 20 : (fila+120+20)),columna=((i>4) ? 30+120+30 : 30)){		
	carta=ColisionObjeto();
	carta.init(document.createElement("canvas"),120,120,animales[fila_pos-1]);
	carta.definir(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(fila,columna,0));
	carta.setBackground("./assets/img/memorama/sin_voltear.jpg");
	carta.setBackgroundCarta("./assets/img/memorama/escala/cart"+i+"_"+animales[fila_pos-1]+".jpg");
	escenario.anadir(carta);
}*/


//objeto_detector.actualizar3d();
//escenario.verObjetos();
escenario.render();