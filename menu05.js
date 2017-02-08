/*	
	menu.js

*/

//Aliases
"use strict";

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Sprite = PIXI.Sprite,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Text = PIXI.Text;


//Create a Pixi EscenarioGral 
//	var EscenarioGral = new Container(),

//Create the renderer
//	750 de alto para visualizar los botones cuando son desplazados
var renderer = autoDetectRenderer(900,750);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//	Set the canvas's border style and background color
renderer.view.style.border = "15px solid #246";
renderer.backgroundColor = "0xddeeff";


//Define any variables that are used in more than one function
var t = undefined,
	BotonAyuda = undefined,
	BotonJugar = undefined,
	BotonPuntos = undefined,
	BotonSalir = undefined,
	actionMessage = undefined,
	EscenaMenuInic = undefined,			//	container pantalla de inicio
	EscenaFinJuego = undefined,			//	container aviso de fin del juego
	EscenaDeAyudas = undefined,			//	container ayudas
	EscenaDeJuego = undefined,			//	container juego
	EscenarioGral = undefined,			//	container del total (1er nivel)
	EscenaEstadist = undefined,			//	container de estadisticas
	draggableObjects = undefined,			//	container de estadisticas
	id = undefined,
	message = undefined,
	nVertice = undefined,
	numTexture = undefined,
	pointer = undefined,
	state = undefined, 
	stateMessage = undefined,

    gridstep = 200,
    resuelto = false,
	aNumeros = [],		//	array con los numeros
	aVertices = [],		//	array con datos de vertices
						//	aVPos contiene las posición de los vértices
	aVPos = [ [100,100], [300,100], [500,100], [100,300], [300,300], [500,300], [100,500], [300,500], [500,500] ],

	//	DEBUG = false;		
	DEBUG = true;

//load resources; a JSON file and run the `setup` function when it's done 
loader.add("images/sumadotileset.json")	.load(setup);
//	loader.add("images/sprites.json")	.load(setup);


function setup() {
	//	Preparacion general

	//Create a new instance of Tink
	t = new Tink(PIXI, renderer.view);

	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	//	Get a reference to the texture atlas id's
	id = resources["images/sumadotileset.json"].textures;
	//	id = resources["images/sprites.json"].textures;

	//	Make the game scene and add it to the EscenarioGral
	EscenarioGral = new Container();
	//	EscenarioGral.addChild(EscenarioGral);
	
	//	Escenario menu inicial
	EscenaMenuInic = new Container();
	EscenarioGral.addChild(EscenaMenuInic);

	//	Escenario menu juego
	EscenaDeJuego = new Container();
	EscenarioGral.addChild(EscenaDeJuego);

	//Create the EscenaFinJuego
	EscenaFinJuego = new Container();
	EscenarioGral.addChild(EscenaFinJuego);

	//	Crear escenario de ayudas
	EscenaDeAyudas = new Container();
	EscenarioGral.addChild(EscenaDeAyudas);

	//	Crear escenario de estadisticas
	EscenaEstadist = new Container();
	EscenarioGral.addChild(EscenaEstadist);

	//	Prepara los botones necesarios
	HaceBotones();

	//	Prepara las diferentes pantallas / escenas.
	PantallaInicio();
	PantallaAyuda();
	PantallaTutorial();
	PantallaJugar();
	PantallaEstadistica();

	//	Set the initial game state
	//	state = play;
	state = Menu;

	//	Menu()

	//	Una grilla para ubicarnos en el canvas
	if (DEBUG) 
	{
		DibujaGrilla()
	}

	//	definir cuales son las escenas visibles y cuales invisibles
	EscenaMenuInic.visible = true;			//	container pantalla de inicio
	EscenaFinJuego.visible = false;		//	container aviso de fin del juego
	EscenarioGral.visible = true;			//	container del juego
	EscenaDeAyudas.visible = true;
	EscenaEstadist.visible = true;
	


	//Start the game loop
	gameLoop();

    // render the EscenarioGral
	console.log("casi al final de setup")
    renderer.render(EscenarioGral);
    //	renderer.render(EscenarioGral);


}


function PantallaInicio() {

	//	Make the `gameOver` scene invisible when the game first starts
	EscenaMenuInic.visible = true;

	//	titulo del menu y juego
	var spritesumado = PIXI.utils.TextureCache["su-ma-do.png"];
	spritesumado = new PIXI.Sprite(spritesumado);
	spritesumado.x = 250;
	spritesumado.y = 150;
	// make it a bit bigger, so it's easier to grab
	spritesumado.scale.set(1.0);
	EscenaMenuInic.addChild(spritesumado);

	if (DEBUG) 
	{
		//	Mensajes para ver estado de los botones
		stateMessage = new PIXI.Text("State: ", { font: "18px Bangers", fill: "black" });
		stateMessage.position.set(8, 8);
		EscenarioGral.addChild(stateMessage);

		actionMessage = new PIXI.Text("Action: ", { font: "18px Bangers", fill: "black" });
		actionMessage.position.set(8, 32);
		EscenarioGral.addChild(actionMessage);
	}
}



function gameLoop() {

	//	console.log( "gameloop() ----------------------------" );

	//Loop this function 60 times per second
	requestAnimationFrame(gameLoop);

	//Run the current state
	state();

	//	console.log( "state en gameloop() |" + state + "|");

	//Update Tink
	t.update();

	//Render the EscenarioGral
	renderer.render(EscenarioGral);
}




//	--------------------------------------
function play() {
	if (DEBUG)
	{
		//	console.log( "play() ----------------------------" );
		stateMessage.text = "State: " + BotonJugar.state;
		actionMessage.text = "Action: " + BotonJugar.action;
	}

	//	if (resuelto) {
	//		state = end;
	//	message.text = "GANASTE...SSSSSSS!";
	//	}
	//	console.log( "EscenarioGral.visible : " + EscenarioGral.visible );
	//	console.log( "fin de play() ----------------------------" );

}

////////////////////////////////////////////////////////////////////////////////////////

//	solamente para depurar
function DibujaGrilla() {

		for (var i = 0; i < 18; i++)
		{
			//	lineas horizontales
			var line = new PIXI.Graphics();
			line.lineStyle(1, "#bbbbbbb", 1);
			line.moveTo(0, 0);
			line.lineTo(900, 0);
			line.x = 0;
			line.y = 50 * (i + 1);
			EscenarioGral.addChild(line);
			//	console.log( "Linea en posicion: " + line.y );

			//	lineas verticales
			var line = new PIXI.Graphics();
			line.lineStyle(1, "#eee", 1);
			line.moveTo(0, 0);
			line.lineTo(0, 600);
			line.x = 50 * (i + 1);
			line.y = 0;
			EscenarioGral.addChild(line);
		}

}


function PantallaAyuda() {
	return console.log("Llamaron function PantallaAyuda");
}

function PantallaTutorial() {
	return console.log("Llamaron function PantallaTutorial");
}

function PantallaJugar() {
	//	esta funcion prepara la escena de juego

	var tablero, i,	aSumaPolig, 
	   	aVertex = undefined,
		i = undefined,			//	para conteo usos varios
		aPosPolig = undefined,
		num, cImagen;

	var tableroTexture = id["sumado-tablero.png"];
	tablero = new PIXI.Sprite(tableroTexture);

	//	tablero = id["tablero.png"];
	tablero.x = 54;
	tablero.y = 54;
	// make it a bit bigger, so it's easier to grab
	tablero.scale.set(1.34);
	EscenaDeJuego.addChild(tablero);

	//Create a container for the draggable objects and
	draggableObjects = new PIXI.Container();
	//Make the `draggableObjects' scene visible when the game first starts
	draggableObjects.visible = true;
	EscenarioGral.addChild(draggableObjects);

	// creacion de los sprites draggables para cada nro
	for ( i = 1; i < 10; i++)
	{
		cImagen = "num0" + i + ".png";
		numTexture = PIXI.utils.TextureCache[cImagen];
		num = new PIXI.Sprite(numTexture);

		num.interactive = true;
		//	draggableObjects.addChild(num);    

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

		// add it to the EscenarioGral
		//	EscenarioGral.addChild(num);
		
		//	para hacerlo draggable (con la libreria)
		//	num.draggable();

		aNumeros[i] = num;
		aNumeros[i].val = i;
		
		//	Make the sprites draggable
		//	t.makeDraggable(aNumeros[i]);
		//	aNumeros[i].draggable = true;

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
	//	nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 
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
		EscenaDeJuego.addChild(message);
	}


}

function PantallaEstadistica() {
	return console.log("Llamaron function PantallaEstadistica");
}


function Jugar() {
	console.log("Llamaron a la opcion JUGAR");

    resuelto = false;

//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = false;
	EscenaDeJuego.visible = true;
	EscenaEstadist.visible = false;
	EscenaFinJuego.visible = false;		//	container aviso de fin del juego
	EscenaMenuInic.visible = false;			//	container pantalla de inicio
	EscenarioGral.visible = true;			//	container del juego

	//	pruebo quitar al boton del area visible (para no destuirlo y crearlo nuevmante)
	//	...y esto funciona. Asi es que...
	BotonJugar.y = 650;
	BotonAyuda.y = 500;		//	durante el juego mantenemos el boton de ayuda
	BotonPuntos.y = 650;
	BotonSalir.y = 650;

	state = play;

}

function Menu() {
	console.log("Llamaron a la opcion MENU");

	//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = true;		//	container ayudas
	EscenaDeJuego.visible = false;
	EscenaEstadist.visible = false;		//	container estadisticas
	EscenaFinJuego.visible = false;		//	container aviso de fin del juego
	EscenaMenuInic.visible = true;		//	container pantalla de inicio
	EscenarioGral.visible = true;		//	container del juego

	BotonJugar.y = 500;
	BotonAyuda.y = 500;		//	durante el juego mantenemos el boton de ayuda
	BotonPuntos.y = 500;
	BotonSalir.y = 500;

	state = Menu;
}

function Ayuda() {
	console.log("Llamaron a la opcion AYUDA");
	//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = true;		//	container ayudas
	EscenaDeJuego.visible = false;
	EscenaEstadist.visible = false;		//	container estadisticas
	EscenaFinJuego.visible = false;		//	container aviso de fin del juego
	EscenaMenuInic.visible = false;		//	container pantalla de inicio
	EscenarioGral.visible = true;		//	container del juego

	BotonJugar.y = 500;
	BotonAyuda.y = 650;		//	durante el juego mantenemos el boton de ayuda
	BotonPuntos.y = 500;
	BotonSalir.y = 500;

}

function Estadistica() {
	console.log("Llamaron a la opcion ESTADISTICA");
}

function HaceBotones() {
	console.log("Llamaron a la opcion HaceBotones");

	//	Prepara los botones con las opciones de juego, ayuda, puntaje
	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	//	Get a reference to the texture atlas id's
	var buttonFrames			//	almacenar el array de imagenes del boton

	//	The button state textures
	//	Preparacion boton de juego
	buttonFrames = [id["botonjugarup.png"], id["botonjugarover.png"], 	id["botonjugardown.png"]];

	BotonJugar = t.button(buttonFrames, 50, 500 );
	BotonJugar.scale.set(0.8);

	//	Add the button to the EscenarioGral
	EscenarioGral.addChild(BotonJugar);

	//Define the button's actions
	BotonJugar.over		= function () {	};
	BotonJugar.out		= function () {	};
	BotonJugar.press	= function () { return Jugar() };
	BotonJugar.tap		= function () {	};


	//	Preparacion boton de ayudas
	buttonFrames = [id["botonayudaup.png"], id["botonayudaover.png"], 	id["botonayudadown.png"]];

	BotonAyuda = t.button(buttonFrames, 250, 500 );
	BotonAyuda.scale.set(0.8);

	//Add the button to the EscenarioGral
	EscenarioGral.addChild(BotonAyuda);

	//Define the button's actions
	BotonAyuda.over = function () {	};
	BotonAyuda.out = function () {	};
	BotonAyuda.press = function () { return Ayuda() };
	BotonAyuda.release = function () {	};
	BotonAyuda.tap = function () {	};


	//	Preparacion boton de puntaje
	buttonFrames = [id["botonpuntajeup.png"], id["botonpuntajeover.png"], 	id["botonpuntajedown.png"]];

	BotonPuntos = t.button(buttonFrames, 450, 500 );
	BotonPuntos.scale.set(0.8);

	//Add the button to the EscenarioGral
	EscenarioGral.addChild(BotonPuntos);

	//Define the button's actions
	BotonPuntos.over = function () {	};
	BotonPuntos.out = function () {	};
	BotonPuntos.press = function () {	return console.log("Pulsaron boton ESTADISTICA") };
	BotonPuntos.release = function () {	};
	BotonPuntos.tap = function () {	};

	//	Preparacion boton de salida
	buttonFrames = [id["botonsalirup.png"], id["botonsalirover.png"], 	id["botonsalirdown.png"]];

	BotonSalir = t.button(buttonFrames, 650, 500 );
	BotonSalir.scale.set(0.8);

	//Add the button to the EscenarioGral
	EscenarioGral.addChild(BotonSalir);

	//Define the button's actions
	BotonSalir.over = function () {	};
	BotonSalir.out = function () {	};
	BotonSalir.press = function () {	return console.log("Pulsaron boton BotonSalir") };
	BotonSalir.release = function () {	};
	BotonSalir.tap = function () {	};

}

//--------------------------------


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
	//	console.log( "inicio onDragStart ----------------------------" );

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
	//	no usado ???	var nLineaOffset = 100;
	//	this sería el sprite con numero a posicionar
	var lNumOK = false,
		i = undefined;		//	indica numero bien ubicado

	console.log( "onDragEnd() ---------------------------------------------" );

    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
		//	parece que this.parent es el puntero del mouse
		//	newPosition tiene las coordenadas del puntero del mouse

		//	debo detectar si estoy en el area del tablero o area de estacionamiento de fichas
		//	ficha es un sprite asociado a un número a colocar en tablero.
		//	console.log( "Iniciando onDragEnd() puntero en : " + newPosition.x.toString().substr(0,8) +','+ newPosition.y.toString().substr(0,8) );
		//	console.log( "this.val: " + this.val)


		//	Estamos en el tablero o afuera?
		if ( newPosition.x < 0 || newPosition.x > 600 || newPosition.y < 0 || newPosition.y > 600 )
		{
			//	estamos afuera del tablero. va al estacionamiento.
			//	console.log( "afuera del tablero!.  ficha-numero va al estacionamiento")	
			lNumOK = false;
		} else { 
			//	dentro del tablero
			//	console.log( "dentro del tablero")
			//	usamos sentencia switch para determinar en que vertice debe caer la ficha numérica
			//	primero evaluamos el vértice que corresponde
			//	El nro de vertice ( nVertice ) estará dado por
			nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 

			//	console.log( "Math.floor( newPosition.x / gridstep ) = " + Math.floor( newPosition.x / gridstep ) )
			//	console.log( "3 * Math.floor( newPosition.y / gridstep = " + 3 * Math.floor( newPosition.y / gridstep ) )
			//	console.log( "nVertice = " + nVertice )
			//	console.log( "aVertices[nVertice] = " + aVertices[nVertice,1] + ',' + aVertices[nVertice,2] + ',' + aVertices[nVertice,3] )
			//	console.log( "aVertices[nVertice] = |" + aVertices[nVertice] + '|' )

			//	Ahora distinguir si nVertice está libre u ocupado
			if (aVertices[nVertice][2] === "" )
			{
				//	si vertice está libre
				//	console.log( "vertice esta libre!")
				lNumOK = true;

				//	voy a ustilizar la posición del vertice 'almacenada' en el mismo
				newPosition.x = aVPos[nVertice][0];
				newPosition.y = aVPos[nVertice][1];	
				//	y amrco al vertice como ocupado
				aVertices[nVertice][2] = this.val

			} else {
				//	va al estacionamiento.
				//	console.log( "ficha-numero va al estacionamiento")
				//	move the sprite to its designated position
				lNumOK = false;

				newPosition.x = 700;
				newPosition.y = 80 + this.val * 50;
			}
		}

		if ( !lNumOK )
		{
			newPosition.x = 700;
			newPosition.y = 80 + this.val * 50;
		}

		//	console.log( "saliendo de ondragmove --> posicion: " + newPosition.x + ", " + newPosition.y );
		/////////////////////////////////////////////////////

		//	for (var i = 0; i < aVertices.length ; i++)
		//	{
		//		console.log( "aVertices[" + i + "] = |" + aVertices[i] + '|' )
		//	}
		//
		this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }

	this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

	//	console.log( "aVertices.length : " + aVertices.length );

	//	chequeo si hay solución. para esto debe ser aVertices[i][1] == aVertices[i][2] para todo i
	//	esto deberia ir a la funcion play... ???
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
	//	console.log( "resuelto : " + resuelto );
	//	console.log( "saliendo de Dragend, this.position: " + this.position.x + "," + this.position.y );
	//	console.log( "--------------------------------------------------" );

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

