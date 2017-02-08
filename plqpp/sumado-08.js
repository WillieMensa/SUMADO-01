//	sumado.js
//	ver Kittyattack para redondear inicio y fin de juego.
//	26/12/2016	versión 0.10 
//	Hasta aqui he conseguido presentar el tablero con la suma de los polígonos, 
//	los números que van en los vértices-dato y las fichas número para colocar en los vértices.
//	Falta la generación automática de un problema nuevo, 
//	controlar si la solución propuesta es acertada, 
//	un menú de inicio, un reloj control de tiempo insumido, 
//	opción para abandonar y vaya a saber cuantas cosas más surgen.

//	codigo para plantear un sumado. Por ahora de 3 x 3
//	seguir en linea 246 (25/12/2016)
//	Tarea actual
//		corregir onDragStart. Debe desocupar el vértice
//		posible error en el cálculo de nvertice

//		Preparar vector con numeros a asignar (sprites)
//			valor numerico

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
    gridstep = 200,
    draggableObjects = undefined,
    resuelto = false;

	aVertices = [],				//	array con datos de vertices
	//	aVPos contiene las posición de los vértices
	aVPos = [ [100,100], [300,100], [500,100], [100,300], [300,300], [500,300], [100,500], [300,500], [500,500] ],
	DEBUG = false;		//	true;


	//load a JSON file and run the `setup` function when it's done 
	PIXI.loader
	  .add("images/sumadotileset.json")
	  .load(setup);


function MenuPpal() {
	setup()
}


function setup() {

	//	$.getJSON('http://skielcast.pythonanywhere.com/2x3_v1', function(data) {	});

	//	Set the canvas's border style and background color
	renderer.view.style.border = "5px solid purple";
	renderer.backgroundColor = "0xeeeeee";

	//Define variables that might be used in more than one function
	var tablero, i,	aSumaPolig, 
	   	aVertex = undefined,
	   	message = undefined,
		i = undefined,			//	para conteo usos varios
		aPosPolig ;


	//	pruebo armar un array con los numeros
	var num, cImagen, aNumeros = [];
	//	grilla para posiciones de detencion fijas
	//	grid = [200,200];


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

    resuelto = false;

	// creacion de los sprites draggables para cada nro
	for ( i = 1; i < 10; i++)
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
		aNumeros[i].val = i;
		
		//	Make the sprites draggable
		//	t.makeDraggable(aNumeros[i]);
		//	aNumeros[i].draggable = true;

		if (DEBUG) 
		{
				//	console.log( i + " es draggable " + aNumeros[i].draggable );
		}

	}

	//	generar o leer datos de los vértices
	//	por ahora 'hard coded' para probar
	aVertex = [1, 6, 9, 8, 7, 4, 5, 2, 3]

	////////////////////////////////////////////////////
	//	Preparo un vector con la data de los vértices:
	//		id del vértice (codificado adecuadamente para identificarlo facil)
	//		valor objetivo
	//		id.num colocado: codigo del número colocado en el vértice o señal de estar vacio
	//		indicador de vértice-dato (fijo)
	//	[1, 6, 9, 8, 7, 4, 5, 2, 3]
	for ( i = 0; i < 9; i++)
	{
		aVertices[i] = [i, aVertex[i], "", false]
	}

	//	asignamos los vértices datos. Por ahora un solo modelo. Datos son los vertices 2 y 6
	aVertices[2][3] = true;
	aVertices[2][2] = aVertices[2][1];
	//	asigno la posición fija a los datos. 
	//		nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 
	aNumeros[aVertices[2][2]].position.x = ( aVertices[2][0] % 3 ) * 200 + 100;
	aNumeros[aVertices[2][2]].position.y = Math.floor( aVertices[2][0] / 3 ) * 200 + 100 ;
	aNumeros[2].draggable = false;

	aVertices[6][3] = true;
	aVertices[6][2] = aVertices[6][1];
	//	asigno la posición fija a los datos
	aNumeros[aVertices[6][2]].position.x = ( aVertices[6][0] % 3 ) * 200 + 100;
	aNumeros[aVertices[6][2]].position.y = Math.floor( aVertices[6][0] / 3 ) * 200 + 100 ;
	aNumeros[6].draggable = false;


	//	if (DEBUG) 
	//	{
	//		for ( i = 0; i < 9; i++)
	//		{
	//			console.log( "aVertices[" + i + "]: " + aVertices[i] );
	//		}
	//	}

	////////////////////////////////////////////////////
	//	colocamos las sumas de los poligonos en posición
	aSumaPolig = [14, 16, 26, 22, 14, 12];
	//	aPosPolig da la posición del texto indicador de la suma.
	aPosPolig = [[210, 140],[140, 205],[370, 170],[170, 370],[410, 340],[340, 405] ];
	//	falta indicar los vértices que suma en cada poligono
	

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

	//	console.log( " this.data: " + this.val );

	if ( this.val != aVertices[2][1] && this.val != aVertices[6][1]  )
	{
	    this.dragging = true;
	}

	var newPosition = this.data.getLocalPosition(this.parent);

	/////////////////////////////
	//	debug
	console.log( "inicio onDragStart ----------------------------" );

	if (this.data)
	{
	}
	//	si estamos tomando una ficha numero que ocupa un vertice, hay que desocupar el vertice
    if (this.dragging)
	{
		if (newPosition.x > 0 && newPosition.x < 600 && newPosition.y > 0 && newPosition.y < 600 )
		{
			var newPosition = this.data.getLocalPosition(this.parent);
			nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 
			//	console.log( "Hemos tomado una ficha-numero ubicada en un vertice")
			//	console.log( "nVertice =|" + nVertice + "|" )
			//	console.log( "aVertices[nVertice] =|" + aVertices[nVertice] + "|" )
			aVertices[nVertice][2] = ''
		}
	}
	//	console.log( "   this.parent: " + this.data.getLocalPosition.x + "," + this.data.getLocalPosition.y );
	//	console.log( "saliendo de onDragStart ----------------------------" );
}


function onDragEnd()
{
	var nLineaOffset = 100;

	//	this sería el sprite con numero a posicionar
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
		//	parece que this.parent es el puntero del mouse
		//	newPosition tiene las coordenadas del puntero del mouse
		console.log( "this.val: " + this.val)

		//	debo detectar si estoy en el area del tablero o area de estacionamiento de fichas
		//	ficha es un sprite asociado a un número a colocar en tablero.
		console.log( "--------------------------------------------------" );
		console.log( "Iniciando onDragEnd puntero en : " + newPosition.x.toString().substr(0,8) +','+ newPosition.y.toString().substr(0,8) );


		//	Estamos en el tablero o afuera?
		if ( newPosition.x < 0 || newPosition.x > 600 || newPosition.y < 0 || newPosition.y > 600 )
		{
			//	estamos afuera del tablero. va al estacionamiento.
			console.log( "afuera del tablero!.  ficha-numero va al estacionamiento")	
		} else { 
			//	dentro del tablero
			console.log( "dentro del tablero")
			//	usamos sentencia switch para determinar en que vertice debe caer la ficha numérica
			//	primero evaluamos el vértice que corresponde
			//	El nro de vertice ( nVertice ) estará dado por
			nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 

			//	console.log( "Math.floor( newPosition.x / gridstep ) = " + Math.floor( newPosition.x / gridstep ) )
			//	console.log( "3 * Math.floor( newPosition.y / gridstep = " + 3 * Math.floor( newPosition.y / gridstep ) )
			console.log( "nVertice = " + nVertice )
			//	console.log( "aVertices[nVertice] = " + aVertices[nVertice,1] + ',' + aVertices[nVertice,2] + ',' + aVertices[nVertice,3] )
			console.log( "aVertices[nVertice] = |" + aVertices[nVertice] + '|' )

			//	Ahora distinguir si nVertice está libre u ocupado
			if (aVertices[nVertice][2] === "" )
			{
				//	si vertice está libre
				console.log( "vertice está libre!")
				//	voy a ustilizar la posición del vertice 'almacenada' en el mismo
				newPosition.x = aVPos[nVertice][0];
				newPosition.y = aVPos[nVertice][1];	
				//	y amrco al vertice como ocupado
				aVertices[nVertice][2] = this.val

			} else { 
				//	block of code to be executed if the condition is false
				//	sino
				//		va al estacionamiento.
				console.log( "ficha-numero va al estacionamiento")
				// move the sprite to its designated position
				newPosition.x = 700;
				newPosition.y = 80 + this.val * 50;

			}

		}

		//	console.log( "saliendo de ondragmove --> posicion: " + newPosition.x + ", " + newPosition.y );
		/////////////////////////////////////////////////////

        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
		console.log( "--------------------------------------------------" );
    }

	this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

	console.log( "aVertices.length : " + aVertices.length );

	//	chequeo si hay solución. para esto debe ser aVertices[i][1] == aVertices[i][2] para todo i
	resuelto = true;

	for ( i = 0 ; i < aVertices.length ; i++)
	{
		if ( aVertices[i][1] != aVertices[i][2] )
		{
			resuelto = false;
		}
	}


	/////////////////////////////
	//	debug
	console.log( "resuelto : " + resuelto );
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



function animate() {

    if ( resuelto )
    {
		console.log ( "GANASTE" )
		console.log ( "GANASTE" )
		console.log ( "GANASTE" )
		setup()
    }

	//	Loop this function 60 times per second
    requestAnimationFrame(animate);

	//Run the current state
	//	state();

    // render the stage
    renderer.render(stage);
}

