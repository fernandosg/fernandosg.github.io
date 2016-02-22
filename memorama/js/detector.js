module.exports=function(){
		var detector,posicion,objeto,vector_posicion;	
		var detectados=[];
		var init=function(obj){
			detector=new AR.Detector();
			objeto=obj;
			posicion=objeto.obtenerScreen().position;
			vector_posicion=new THREE.Vector3();
		}

		var getPosicionReal=function(escenario,posicion){
			return new THREE.Vector3(posicion.x-(escenario.width/2),
				((-1*posicion.y)+(escenario.height/2)),posicion.z)
		}

		var detectar=function(escenario,bytes,objetos,objetos_en_escena,camara){
			var markers = detector.detect(bytes);   	
		   	if(markers.length>0){   	
		   		objeto.obtenerScreen().position=objeto.getPosicionReal(escenario,new THREE.Vector3(markers[0].corners[0].x,markers[0].corners[0].y,15));
		   		objeto.obtenerScreen().visible=true;
		   		objeto.actualizar();	   		
				vector_posicion.x=objeto.obtenerScreen().position.x;
				vector_posicion.y=objeto.obtenerScreen().position.y;			
				var raycaster = new THREE.Raycaster( camara.position, vector_posicion.sub( camara.position ).normalize() );
				intersects=raycaster.intersectObjects(objetos);
				if(intersects.length>0){			
					if(detectados.length==1 && detectados[0].esParDe(objetos_en_escena[intersects[0].object.id])){
						objetos_en_escena[intersects[0].object.id].voltear();
						pos_elemento=objetos.indexOf(intersects[0].object);					
						delete objetos_en_escena[intersects[0].object.id];
						if (pos_elemento > -1) {
						    objetos.splice(pos_elemento, 1);
						}
						detectados.pop();	
					}else if(detectados.length==0){					
						objetos_en_escena[intersects[0].object.id].voltear();
						detectados.push(objetos_en_escena[intersects[0].object.id]);
					}else if(detectados[0].obtenerScreen().id!=intersects[0].object.id){
						detectados[0].voltear();
						detectados.pop();
					}
								
				}
						 
		   	}
		}

		var obtenerObjeto=function(){
			return objeto;
		}

		return {
			init:init,
			detectar:detectar,
			obtenerObjeto:obtenerObjeto
		}
}