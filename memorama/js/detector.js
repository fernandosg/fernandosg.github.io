module.exports=function(){
		var detector,posicion,objeto,vector_posicion;	
		var detectados=[],modelSize=1.0,posit;		
		var init=function(obj,escenario){
			detector=new AR.Detector();
			objeto=obj;
			posicion=objeto.obtenerScreen().position;
			vector_posicion=new THREE.Vector3();
			posit = new POS.Posit(modelSize, escenario.width);
		}


		function centrarMarcador(objeto,escenario,corners){
			 var corners, corner, pose, i;
		        
		        for (i = 0; i < corners.length; ++ i){
		          corner = corners[i];
		          
		          corner.x = corner.x - (escenario.width / 2);
		          corner.y = (escenario.height / 2) - corner.y;
		        }
		        
		        pose = posit.pose(corners);
		        
		        updateObject(objeto,pose.bestRotation, pose.bestTranslation);     
		}


		 function updateObject(objeto_canvas,rotation, translation){
		      objeto_canvas.obtener3d().scale.x = modelSize;
		      objeto_canvas.obtener3d().scale.y = modelSize;
		      objeto_canvas.obtener3d().scale.z = modelSize;
		      
		      objeto_canvas.obtener3d().rotation.x = -Math.asin(-rotation[1][2]);
		      objeto_canvas.obtener3d().rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
		      objeto_canvas.obtener3d().rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);

		      objeto_canvas.obtenerScreen().position.x = translation[0];
		      objeto_canvas.obtenerScreen().position.y = translation[1];
		      objeto_canvas.obtener3d().position.z = translation[2];
		      console.log("lo encontre "+objeto_canvas.obtenerScreen().position.x+" "+objeto_canvas.obtenerScreen().position.y+" "+objeto_canvas.obtenerScreen().position.z);
		      objeto_canvas.obtener3d().children[0].material.map.needsUpdate=true;
		      //objeto_canvas.actualizar();//obtenerScreen().needsUpdate=true;
		 };

		var getPosicionReal=function(escenario,posicion){
			return new THREE.Vector3(posicion.x-(escenario.width/2),
				((-1*posicion.y)+(escenario.height/2)),posicion.z)
		}

		var detectar=function(extra,escenario,bytes,objetos,objetos_en_escena,camara){
			var markers = detector.detect(bytes);   	
		   	if(markers.length>0){ 
		   		//extra.obtener3d().position=objeto.getPosicionReal(escenario,new THREE.Vector3(markers[0].corners[0].x,markers[0].corners[0].y,15));
		   		centrarMarcador(extra,escenario,markers[0].corners);
				//extra.position=objeto.getPosicionReal(escenario,new THREE.Vector3(markers[0].corners[0].x,markers[0].corners[0].y,15));
		   		/*objeto.obtenerScreen().position=objeto.getPosicionReal(escenario,new THREE.Vector3(markers[0].corners[0].x,markers[0].corners[0].y,15));
		   		objeto.obtenerScreen().visible=true;
		   		objeto.actualizar();	   		
				vector_posicion.x=objeto.obtenerScreen().position.x;
				vector_posicion.y=objeto.obtenerScreen().position.y;
				extra.children[0].material.map.needsUpdate=true;
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
								
				}*/
						 
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