//	sumado.js
//	codigo para plantear un sumado. Por ahora de 3 x 3
//	Tarea actual
//		Preparar vector con datos de vértices
//			valor objetivo
//			valor asignado o vacio
//			Tener en cuenta asociar las posiciones en que se deja el 
//			sprite-numero con los vertices para posibilitar analisis.

//		Preparar vector con numeros a asignar (sprites)
//			valor numerico
//		Preparar vector para estacionamiento de numeros a asignar
//			id cochera
//			valor ocupado o vacio

//	1	Tomar / generar la data de poligonos y vértices: (linea 150)
//		diagrama con la correspondecia de vértices a su id y
//		poligonos a su ID

//	2	decodificar data para el sumado actual, vienen en formato JSON 
//		generada por
//			http://skielcast.pythonanywhere.com/3x3_v1
//		{"vertexes": [1, 6, 9, 8, 7, 4, 5, 2, 3], "poligons": [14, 16, 26, 22, 14, 12]}
//		{"vertexes": [2, 4, 9, 6, 8, 5, 3, 7, 1], "poligons": [14, 16, 26, 24, 14, 16]}

//		Falta cargar los vectores aSumaPolig y aPosPolig 
//		que contienen los valores de los poligonos a presentar y la posición de los textos

//	3	agregar menu inicial
//	4	contador de tiempo, avisos de fin del entretenimiento, tabla de solucionadores y reiniciar
//	5

//Test that Pixi is working
console.log(PIXI);

//	por ahora no uso alias para tener en claro cuales son las funciones de PIXI

//Create a Pixi stage and renderer

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();    
stage.interactive = true;

//Define any variables that are used in more than one function
var t = undefined,
    pointer = undefined,
    grid = undefined,
    draggableObjects = undefined,
	aVertices = [],				//	array con datos de vertices
	DEBUG = true;


	//load a JSON file and run the `setup` function when it's done 
	PIXI.loader
	  .add("images/sumadotileset.json")
	  .load(setup);



function setup() {

	//	$.getJSON('http://skielcast.pythonanywhere.com/2x3_v1', function(data) {	});

	//	Set the canvas's border style and background color
	renderer.view.style.border = "4px solid red";
	renderer.backgroundColor = "0xeeeeee";

	//Define variables that might be used in more than one function
	var tablero, i,	aSumaPolig, aPosPolig ;
	var message 

	//	pruebo armar un array con los numeros
	var num, cImagen, aNumeros = [];
	//	grilla para posiciones de detencion fijas
	grid = [200,200];


	//	1. Access the `TextureCache` directly. esto sería el piso
	//	creacion del tablero con metodo 1
	var tableroTexture = PIXI.utils.TextureCache["tablero.png"];
	tablero = new PIXI.Sprite(tableroTexture);
	tablero.x = 54;
	tablero.y = 54;
	// make it a bit bigger, so it's easier to grab
	tablero.scale.set(1.18);
	stage.addChild(tablero);

	//Create a container for the draggable objects and
	draggableObjects = new PIXI.Container();

	// creacion de los sprites draggables para cada nro
	for (var i = 0; i < 10; i++)
	{
		cImagen = "num0" + i + ".png";
		numTexture = PIXI.utils.TextureCache[cImagen];
		num = new PIXI.Sprite(numTexture);

		num.interactive = true;
		stage.addChild(num);    

		// this button mode will mean the hand cursor appears when you roll over the num with your mouse
		num.buttonMode = true;

		// center the num's anchor point
		num.anchor.set(0.5);

		// make it a bit bigger, so it's easier to grab
		num.scale.set(1.0);

		// setup events
		num
		// events for drag start
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)
		// events for drag end
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		// events for drag move
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);

		// move the sprite to its designated position
		num.position.x = 700;
		num.position.y = 80 + i * 50;

		//	add draggable objects to container
		draggableObjects.addChild(num);

		// add it to the stage
		stage.addChild(num);
		
		//	para hacerlo draggable (con la libreria)
		//	num.draggable();

		aNumeros[i] = num;
		
		//	Make the sprites draggable
		//	t.makeDraggable(aNumeros[i]);
		//	aNumeros[i].draggable = true;

		if (DEBUG) 
		{
				console.log( i + " es draggable " + aNumeros[i].draggable );
		}

	}


	////////////////////////////////////////////////////
	//	Preparo un vector con la data de los vértices:
	//		id del vértice (codificado adecuadamente para identificarlo facil)
	//		valor objetivo
	//		id.num colocado: codigo del número colocado en el vértice o señal de estar vacio
	//

	////////////////////////////////////////////////////
	//	colocamos las sumas de los poligonos en posición
	aSumaPolig = [14, 16, 26, 22, 14, 12];
	aPosPolig = [[210, 140],[140, 205],[370, 170],[170, 370],[340, 405],[410, 340]];

	for ( i = 0; i < 6; i++)
	{
		message = new PIXI.Text( aSumaPolig[i], { font: "56px Calibri", fill : "green", align : 'right'});
		message.position.set(aPosPolig [i][0], aPosPolig [i][1]);
		stage.addChild(message);
	}

	//////////////////////////
	//	Una grilla para ubicarnos en el canvas
		if (DEBUG) 
		{
			for (var i = 0; i < 12; i++)
			{
				//	lineas horizontales
				var line = new PIXI.Graphics();
				line.lineStyle(1, 0xff88ff, 1);
				line.moveTo(0, 0);
				line.lineTo(600, 00);
				line.x = 0;
				line.y = 50 * (i + 1);
				stage.addChild(line);
				//	console.log( "Linea en posicion: " + line.y );

				//	lineas verticales
				var line = new PIXI.Graphics();
				line.lineStyle(1, 0xff88ff, 1);
				line.moveTo(0, 0);
				line.lineTo(0, 600);
				line.x = 50 * (i + 1);
				line.y = 0;
				stage.addChild(line);
			}
		}


	animate();

}



function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;

	/////////////////////////////
	//	debug
	console.log( "En inicio, this.position: " + this.position.x + "," + this.position.y );
	//	console.log( "   this.parent: " + this.data.getLocalPosition.x + "," + this.data.getLocalPosition.y );

}


function onDragEnd()
{
	var gridstep, nLineaOffset = 100;

	//	this sería el sprite con numero a posicionar
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
		//	parece que this.parent es el puntero del mouse

		/////////////////////////////////////////////////////
		//	aca modifico para tratar de introducir una grilla

		gridstep = grid[0];
		console.log( "newPosition.x : " + newPosition.x );
		console.log( "Math.round(newPosition.x / gridstep): " + Math.round(newPosition.x / gridstep) );
		console.log( "(newPosition.x / gridstep): " + (newPosition.x / gridstep) );
		newPosition.x = nLineaOffset + ( Math.round(( newPosition.x - nLineaOffset )/ gridstep ) * gridstep );

		gridstep = grid[1];											
		newPosition.y = nLineaOffset + ( Math.round((newPosition.y - nLineaOffset )/ gridstep ) * gridstep );
		//	lo que sigue no lo uso por ahora 
		//		if(containment && !(x > 0 || x2 < containment.width))
		//		{
		//			x += (x > 0) ? -grid : grid;
		//		}

		console.log( "nLineaOffset + Math.round(newPosition.x / gridstep) * gridstep;" + newPosition.x )
		console.log( "nLineaOffset + Math.round(newPosition.y / gridstep) * gridstep;" + newPosition.y )		
		console.log( "saliendo de ondragmove --> posicion: " + newPosition.x + ", " + newPosition.y );
		/////////////////////////////////////////////////////

        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }

	this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

	/////////////////////////////
	//	debug
	console.log( "saliendo de Dragend, this.position: " + this.position.x + "," + this.position.y );

}



function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
		/////////////////////////////////////////////////////

        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
 
    }
}


// run the render loop
//	animate();


function animate() {

    renderer.render(stage);

	//	Loop this function 60 times per second
    requestAnimationFrame(animate);

	//Run the current state
	//	state();

	//Update Tink
	//	t.update();

    // render the stage
    renderer.render(stage);
}




