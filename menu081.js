/*	
	menu.js

	Colores para botones #ff6600

	5/2/2017	vers 0.81	reposicionamiento con dibujos nuevos
	27/1/2017	vers 0.76
	25/1/2017	vers 0.75	
	24/1/2017	vers 0.7	agrego el generador de vertices aleatorio.
							ya no setá mas hard coded
	22/1/2017	vers 0.6

php -S localhost:8080

*/

//Aliases
"use strict";

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Sprite = PIXI.Sprite,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Text = PIXI.Text;

var rendererOptions = {
	antialiasing: false,
	transparent: false,
	resolution: window.devicePixelRatio,
	autoResize: true,
}

//Create the renderer
//	750 de alto para visualizar los botones cuando son desplazados
//	var renderer = autoDetectRenderer(900,750);
var renderer = autoDetectRenderer( 700, 550, rendererOptions );

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//	Set the canvas's border style and background color
renderer.view.style.border = "5px solid #630";
renderer.backgroundColor = "0xffffcc";

//	Algunas constantes
var	LIMITE_TABLERO = 450,
	LINEA_BOTONES = 470;

//Define any variables that are used in more than one function
var t = undefined,
	BotonAyuda = undefined,
	BotonJugar = undefined,
	BotonPuntos = undefined,
	BotonAtras = undefined,
	MessageFin = undefined,
	EscenaMenuInic = undefined,			//	container pantalla de inicio
	EscenaFinJuego = undefined,			//	container aviso de fin del juego
	EscenaDeAyudas = undefined,			//	container ayudas
	EscenaDeJuego = undefined,			//	container juego
	EscenarioGral = undefined,			//	container del total (1er nivel)
	EscenaEstadist = undefined,			//	container de estadisticas
	//	draggableObjects = undefined,
	id = undefined,
	message = undefined,
	nVertice = undefined,
	numTexture = undefined,
	pointer = undefined,
	state = undefined, 
	stateMessage = undefined,
	MessExtra = undefined,
    //	gridstep = 200,
    gridstep = 150,
    resuelto = false,
	aSumaPolig  = [],	//	array con la suma de los poligonos
	aNumeros = [],		//	array con los numeros
	aVertices = [],		//	array con datos de vertices
						//	aVPos contiene las posición de los vértices
	//	aVPos = [ [100,100], [300,100], [500,100], [100,300], [300,300], [500,300], [100,500], [300,500], [500,500] ],
	//	aVPos = [ [75,75], [225,75], [375,75], [75,225], [225,225], [375,225], [75,375], [225,375], [375,375] ],
	aVPos = [ [68,68], [218,68], [368,68], [68,218], [218,218], [368,218], [68,368], [218,368], [368,368] ],
	DEBUG = false;		
	//	DEBUG = true;

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

var style = {
	font:"64px Luckiest Guy",	// Set style, size and font
    //	fontFamily: 'Sriracha',
    //	fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'light',
    //	fill: ['#ffffff', '#00ff99'], // gradient
    fill: '#442211',
    stroke: '#4a1850',
    strokeThickness: 1,
    dropShadow: false,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 550
};

	MessageFin = new Text( "Buenísimo!",  style );
	MessageFin.position.set(100,100);
	EscenaFinJuego.addChild(MessageFin);

	MessageFin = new Text( "Has resuelto correctamente.", style );
	MessageFin.position.set(100,250);
	EscenaFinJuego.addChild(MessageFin);


	//	detectar y procesar teclas pulsadas mediante 'keydown' event listener en el document
	document.addEventListener('keydown', onKeyDown);



	//Start the game loop
	gameLoop();

    // render the EscenarioGral
	//	renderer.render(EscenarioGral);
    //	renderer.render(EscenarioGral);

}


function PantallaInicio() {

	EscenaMenuInic.visible = true;

	//	titulo del menu y juego
	var spritesumado = PIXI.utils.TextureCache["su-ma-do.png"];
	spritesumado = new PIXI.Sprite(spritesumado);
	spritesumado.x = 96 ;
	spritesumado.y = 150 ;
	// make it a bit bigger, so it's easier to grab
	spritesumado.scale.set(1.0);
	EscenaMenuInic.addChild(spritesumado);

	MessExtra = new Text( "Vamos a sumar...!", {font:"20px Sriracha", fill:"#442244"} );
	MessExtra.position.set(10,10);
	EscenaMenuInic.addChild(MessExtra);

}



function gameLoop() {

	//	console.log( "gameloop() ----------------------------" );

	//Loop this function 60 times per second
	requestAnimationFrame(gameLoop);

	console.log("Ahora viene state()");
	//	Run the current state
	state();
	//	play();

	//	console.log( "state en gameloop() |" + state + "|");

	//Update Tink
	t.update();

	//Render the EscenarioGral
	renderer.render(EscenarioGral);

}




//	--------------------------------------
function play() {
	if (resuelto) {
		state = end;
	}
}

////////////////////////////////////////////////////////////////////////////////////////

//	solamente para depurar
function DibujaGrilla() {

		for (var i = 0; i < 18; i++)
		{
			//	lineas horizontales
			var line = new PIXI.Graphics();
			line.lineStyle(1, "#bbbbbbb", 0.5 )
			line.moveTo(0, 0);
			line.lineTo(900, 0);
			line.x = 0;
			line.y = ( 50 * i ) + 25 ;
			EscenarioGral.addChild(line);
			//	console.log( "Linea en posicion: " + line.y );

			//	lineas verticales
			//	var line = new PIXI.Graphics();
			line = new PIXI.Graphics();
			line.lineStyle(1, "#ace", 0.5);
			line.moveTo(0, 0);
			line.lineTo(0, 600);
			line.x = ( 50 * i ) + 25;
			line.y = 0;
			EscenarioGral.addChild(line);
		}

}


function PantallaAyuda() {
//		var marco = new PIXI.Graphics();
	var graphics = new PIXI.Graphics();

	// draw a rounded rectangle
	graphics.lineStyle(8, 0x332211, 0.95)
	graphics.beginFill(0x669900, 0.95);
	graphics.drawRoundedRect(40, 40, 620, 400 );
	graphics.endFill();

	EscenaDeAyudas.addChild(graphics);

	console.log("EscenarioGral.width:" + EscenarioGral.width )
	console.log("EscenarioGral.height:" + EscenarioGral.height )

//	var style = new PIXI.TextStyle({
var style = {
	font:"24px Sriracha",	// Set style, size and font
    //	fontFamily: 'Sriracha',
    //	fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'light',
    //	fill: ['#ffffff', '#00ff99'], // gradient
    fill: '#ffffff',
    stroke: '#4a1850',
    strokeThickness: 1,
    dropShadow: false,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 570
};


	var richText = new Text('¿Qué es?\nSU-MA-DO es un desafío de lógica que requiere un mínimo conocimiento de aritmética para ser resuelto.\n' + 
	'¿En que consiste?\n' + 
	'Hay nueve círculos unidos de forma tal que se forman cuadrados y triángulos.  ' + 
	'En los círculos o vértices de cada figura se ha asignado un número diferente entre uno y nueve.  ' + 
	'En cada figura se muestra la suma resultante de los correspondientes vértices.  ' + 
	'El objeto del juego es deducir los valores asignados a cada círculo.\n' + 
	'Se dan como ayuda los valores de dos vértices.', style);
richText.x = 60;
richText.y = 60;
EscenaDeAyudas.addChild(richText);

//	var richText = new Text('¿Qué es?\nSU-MA-DO es un juego-entretenimiento-desafío de lógica que requiere un mínimo conocimiento de aritmética para ser resuelto.  Es una oportunidad de ejercicio cerebral y diversión al mismo tiempo.\n¿En que consiste?\nHay nueve círculos unidos de forma tal que se forman cuadrados y triángulos.  En los círculos o vértices de cada figura se ha asignado un número diferente entre uno y nueve.  En cada figura se muestra la suma resultante de los correspondientes vértices.  El objeto del juego es deducir los valores asignados a cada círculo.  Se da como ayuda los valores de dos vértices.\n', textOptions);
//	richText.x = 30;
//	richText.y = 180;

	//	EscenaDeAyudas.addChild(richText);

	EscenaDeAyudas.visible = true;

	console.log("Llamaron function PantallaAyuda");
}


function PantallaTutorial() {
	return console.log("Llamaron function PantallaTutorial");
}

function PantallaJugar() {
	//	esta funcion prepara la escena de juego

	var tablero,
		i = undefined,			//	para conteo usos varios
		aPosPolig = undefined,
		num, cImagen;

	var tableroTexture = id["sumado-tablero.png"];
	tablero = new PIXI.Sprite(tableroTexture);
	//	tablero = id["sumado-tablero.png"];

	tablero.x = 41;
	tablero.y = 42;
	// make it a bit bigger, so it's easier to grab
	//	tablero.scale.set(1.34);
	tablero.scale.set(1.00);
	EscenaDeJuego.addChild(tablero);

	//Make the `draggableObjects' scene visible when the game first starts
	//	EscenaDeJuego.visible = true;
	//	EscenarioGral.addChild(EscenaDeJuego);

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
		//	num.anchor.set(0.5);
		num.anchor.set(0.4);

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

		//	add draggable objects to container
		EscenaDeJuego.addChild(num);

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

	//	colocamos las sumas de los poligonos en posición
	//	aPosPolig da la posición del texto indicador de la suma.
	aPosPolig = [[145, 095],[090, 146],[270, 120],[120, 270],[300, 246],[240, 296] ];

	for ( i = 0; i < 6; i++)
	{
		//	aSumaPolig[i] = new PIXI.Text("999", {font:"50px Sigmar One", fill:"red"});
		aSumaPolig[i] = new Text("999", {font:"50px Sriracha", fill:"#060"});
		//	aSumaPolig[0].text = "XXX" ;
		//	aSumaPolig[i].style = {font:"50px Sigmar One", fill:"red"} ;

	
		//	message = new PIXI.Text( aSumaPolig[i], { font: "56px Calibri", fill : "green", align : 'right'});
		aSumaPolig[i].position.set(aPosPolig [i][0], aPosPolig [i][1]);
		EscenaDeJuego.addChild( aSumaPolig[i] );
	}

}

function PantallaEstadistica() {
	return console.log("Llamaron function PantallaEstadistica");
}


function Jugar() {
	var i = undefined;

	console.log("Llamaron a la opcion JUGAR");

    resuelto = false;

//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = false;
	EscenaDeJuego.visible = true;
	EscenaEstadist.visible = false;
	EscenaFinJuego.visible = false;
	EscenaMenuInic.visible = false;
	EscenarioGral.visible = true;

	EscenaDeJuego.alpha = 0.9 ;

	//	pruebo quitar al boton del area visible (para no destuirlo y crearlo nuevmante)
	//	...y esto funciona. Asi es que...
	BotonJugar.y = 650;
	BotonAyuda.y = 650;	
	BotonPuntos.y = 650;
	BotonAtras.y = LINEA_BOTONES;

	BotonJugar.disabled=true;
	BotonAyuda.disabled=true;
	BotonPuntos.disabled=true;
	BotonAtras.disabled=false;

	BotonJugar.visible = false;
	BotonAyuda.visible = false;
	BotonPuntos.visible = false;
	BotonAtras.visible = true;

	//	posicionar los sprites de numeros
	// creacion de los sprites draggables para cada nro
	for ( i = 1; i < 10; i++)
	{
		//	formula para calcular posicion de estacionamiento
		aNumeros[i].x = LIMITE_TABLERO + 50 + ( i % 2) * 60 ;
		aNumeros[i].y = i * 50 ;
		
	}

	GenJuego()		//	genera un nuevo juego
	
	state = play;

}

function Menu() {
	//	console.log("Llamaron a la opcion MENU");

	//	para asegurarnos el estilo de texto
	MessExtra.style = {font:"20px Luckiest Guy", fill:"#442244"} ;
	//	MessExtra.style = {font:"20px Sriracha", fill:"#ffffcc"} ;

	//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = false;		//	container ayudas
	EscenaDeJuego.visible = false;
	EscenaEstadist.visible = false;		//	container estadisticas
	EscenaFinJuego.visible = false;		//	container aviso de fin del juego
	EscenaMenuInic.visible = true;		//	container pantalla de inicio
	EscenarioGral.visible = true;		//	container del juego

	BotonJugar.y = LINEA_BOTONES;
	BotonAyuda.y = LINEA_BOTONES;		//	durante el juego mantenemos el boton de ayuda
	BotonPuntos.y = LINEA_BOTONES;
	BotonAtras.y = 650;

	//	BotonJugar.disabled=false;
	//	BotonAyuda.disabled=false;
	//	BotonPuntos.disabled=false;
	//	BotonAtras.disabled=true;

	BotonJugar.visible = true;
	BotonAyuda.visible = true;
	BotonPuntos.visible = true;
	BotonAtras.visible = false;

	state = Menu;
	//	state = "";
}

function Ayuda() {
	//	console.log("Llamaron a la opcion AYUDA");

//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = true;
	EscenaDeJuego.visible = false;
	EscenaEstadist.visible = false;
	EscenaFinJuego.visible = false;
	EscenaMenuInic.visible = false;
	EscenarioGral.visible = true;

	BotonJugar.y = 650;
	BotonAyuda.y = 650;		//	durante el juego mantenemos el boton de ayuda
	BotonPuntos.y = 650;
	BotonAtras.y = LINEA_BOTONES;

	BotonAtras.visible = true;
	BotonAtras.disabled=false;

	state = Ayuda;

}

function Estadistica() {
	console.log("Llamaron a la opcion ESTADISTICA");
}

function HaceBotones() {
	//	console.log("Llamaron a la opcion HaceBotones");

	//	Prepara los botones con las opciones de juego, ayuda, puntaje
	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	//	Get a reference to the texture atlas id's
	var buttonFrames			//	almacenar el array de imagenes del boton

	//	The button state textures
	//	Preparacion boton de juego
	buttonFrames = [id["botonjugarup.png"], id["botonjugarover.png"], 	id["botonjugardown.png"]];

	BotonJugar = t.button(buttonFrames, 100, LINEA_BOTONES );
	BotonJugar.scale.set(0.7);

	//	Add the button to the EscenarioGral
	EscenaMenuInic.addChild(BotonJugar);

	//Define the button's actions
	BotonJugar.over		= function () {	};
	BotonJugar.out		= function () {	};
	BotonJugar.press	= function () { return Jugar() };
	BotonJugar.tap		= function () {	};


	//	Preparacion boton de ayudas
	buttonFrames = [id["botonayudaup.png"], id["botonayudaover.png"], 	id["botonayudadown.png"]];

	BotonAyuda = t.button(buttonFrames, 420, LINEA_BOTONES );
	BotonAyuda.scale.set(0.7);

	//Add the button to the EscenarioGral
	EscenaMenuInic.addChild(BotonAyuda);

	//Define the button's actions
	BotonAyuda.over = function () {	};
	BotonAyuda.out = function () {	};
	BotonAyuda.press = function () { return Ayuda() };
	BotonAyuda.release = function () {	};
	BotonAyuda.tap = function () {	};


	//	Preparacion boton de puntaje
	buttonFrames = [id["botonpuntajeup.png"], id["botonpuntajeover.png"], 	id["botonpuntajedown.png"]];

	BotonPuntos = t.button(buttonFrames, 260, LINEA_BOTONES );
	BotonPuntos.scale.set(0.7);

	//Add the button to the EscenarioGral
	EscenaMenuInic.addChild(BotonPuntos);

	//Define the button's actions
	BotonPuntos.over = function () {	};
	BotonPuntos.out = function () {	};
	BotonPuntos.press = function () {	return console.log("Pulsaron boton ESTADISTICA") };
	BotonPuntos.release = function () {	};
	BotonPuntos.tap = function () {	};

	//	Preparacion boton de salida
	buttonFrames = [id["botonatrasup.png"], id["botonatrasover.png"], 	id["botonatrasdown.png"]];

	BotonAtras = t.button(buttonFrames, 300, LINEA_BOTONES );
	BotonAtras.scale.set(0.7);

	//Add the button to the EscenarioGral
	EscenarioGral.addChild(BotonAtras);

	//Define the button's actions
	BotonAtras.over = function () {	};
	BotonAtras.out = function () {	};
	BotonAtras.press = function () { Menu() };
	BotonAtras.release = function () {	};
	BotonAtras.tap = function () {	};

}

//--------------------------------


function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;

	console.log( " this.data: " + this.val );

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
		if (newPosition.x > 0 && newPosition.x < LIMITE_TABLERO && newPosition.y > 0 && newPosition.y < LIMITE_TABLERO )
		{
			var newPosition = this.data.getLocalPosition(this.parent);
			nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 
			aVertices[nVertice][2] = ''
		}
	}
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
		if ( newPosition.x < 0 || newPosition.x > LIMITE_TABLERO || newPosition.y < 0 || newPosition.y > LIMITE_TABLERO )
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
			console.log( "nVertice = " + nVertice )
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
				aVertices[nVertice][2] = this.val;

			} else {
				//	va al estacionamiento.
				//	console.log( "ficha-numero va al estacionamiento")
				//	move the sprite to its designated position
				lNumOK = false;

				//	newPosition.x = 700;
				//	newPosition.y = 80 + this.val * 50;
			}
		}

		if ( !lNumOK )
		{
			//	formula para calcular posicion de estacionamiento
			newPosition.x = LIMITE_TABLERO + 50 + ( this.val % 2) * 60 ;
			newPosition.y = this.val * 50 ;
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

function GenJuego()			//	genera un nuevo juego
{
	//	la funciones para el ordenamiento
	var aTemp = undefined,
		//	aPosPolig = [],		//	array con posición de datos poligonos
		i = undefined,
		n = undefined,
		aVertex = [];		//	para ubicar numeros aleatoriamente

	for ( i = 0; i < 9; i++)
	{
		aVertex.push( [i + 1, Math.random() ] );
	}

	aVertex = bubbleSort(aVertex, 0, aVertex.length - 1);

	////////////////////////////////////////////////////
	//	Preparo un vector con la data de los vértices:
	//		id del vértice (codificado adecuadamente para identificarlo facil)
	//		valor objetivo
	//		id.num colocado: codigo del número colocado en el vértice o señal de estar vacio
	//		indicador de vértice-dato (fijo)
	for ( i = 0; i < 9; i++)
	{
		aVertices[i] = [i, aVertex[i][0], "", false]
		console.log( "Vertice " + i + " |" + aVertices[i][0] + "|" + aVertices[i][1] + "|" + aVertices[i][2] + "|" + aVertices[i][3] + "|"  );
		//			aVertices[2][1] && this.val != aVertices[6][1]  )
	}


	//	asignamos los vértices datos. Por ahora un solo modelo. Datos son los vertices 2 y 6
	aVertices[2][3] = true;
	aVertices[2][2] = aVertices[2][1];
	//	asigno la posición fija a los datos. 
	//	nVertice = Math.floor( newPosition.x / gridstep ) + 3 * Math.floor( newPosition.y / gridstep ) 
	//	aNumeros[aVertices[2][2]].position.x = ( aVertices[2][0] % 3 ) * 175 + 75;
	aNumeros[aVertices[2][2]].position.x =  aVPos[2][0];
	aNumeros[aVertices[2][2]].position.y =  aVPos[2][1];
	//	aNumeros[aVertices[2][2]].position.y = Math.floor( aVertices[2][0] / 3 ) * 125 + 75 ;
	aNumeros[2].draggable = false;

	aVertices[6][3] = true;
	aVertices[6][2] = aVertices[6][1];
	//	asigno la posición fija a los datos
	//	aNumeros[aVertices[6][2]].position.x = ( aVertices[6][0] % 3 ) * 125 + 75;
	//	aNumeros[aVertices[6][2]].position.y = Math.floor( aVertices[6][0] / 3 ) * 125 + 75 ;
	aNumeros[aVertices[6][2]].position.x =  aVPos[6][0];
	aNumeros[aVertices[6][2]].position.y =  aVPos[6][1];
	aNumeros[6].draggable = false;


	////////////////////////////////////////////////////
	//	Actualizamos la suma de los poligonos
	aSumaPolig[0].text = aVertices[0][1]+ aVertices[1][1]+ aVertices[4][1] ;
	aSumaPolig[1].text = aVertices[0][1]+ aVertices[3][1]+ aVertices[4][1] ;
	aSumaPolig[2].text = aVertices[1][1]+ aVertices[2][1]+ aVertices[4][1]+ aVertices[5][1] ;
	aSumaPolig[3].text = aVertices[3][1]+ aVertices[4][1]+ aVertices[6][1]+ aVertices[7][1] ;
	aSumaPolig[4].text = aVertices[4][1]+ aVertices[5][1]+ aVertices[8][1] ;
	aSumaPolig[5].text = aVertices[4][1]+ aVertices[7][1]+ aVertices[8][1] ;

}


function bubbleSort(inputArray, start, rest) {
	for (var i = rest - 1; i >= start;  i--) {
		for (var j = start; j <= i; j++) {
			if (inputArray[j+1][1] < inputArray[j][1] ) {
				var tempValue = inputArray[j];
				inputArray[j] = inputArray[j+1];
				inputArray[j+1] = tempValue;
			}
		}
	}
	return inputArray;
}



function end() {
	console.log("Entramos a la funcion end() " );
	
	//	definir cuales son las escenas visibles y cuales invisibles
	EscenaDeAyudas.visible = false;		//	container ayudas
	EscenaDeJuego.visible = true;
	EscenaEstadist.visible = false;		//	container estadisticas
	EscenaFinJuego.visible = true;		//	container aviso de fin del juego
	EscenaMenuInic.visible = false;		//	container pantalla de inicio
	EscenarioGral.visible = true;		//	container del juego

	EscenaDeJuego.alpha = 0.1 ;

	BotonJugar.y = 650;
	BotonAyuda.y = 650;		//	durante el juego mantenemos el boton de ayuda
	BotonPuntos.y = 650;
	BotonAtras.y = LINEA_BOTONES;

	BotonJugar.visible = true;
	BotonAyuda.visible = true;
	BotonPuntos.visible = true;
	BotonAtras.visible = true;


	//	gameScene.visible = false;
	EscenaFinJuego.visible = true;
	//	stage.visible = false;
	//	console.log( "state en end() |" + state + "|");

	//	window.alert("Fin de juego. Otro?");
	//	console.log("Ya avisó")
	
	//	aqui tendrían que venir las opciones
	//	nuevo juego
	//	salir
	//	ayuda
	
}



//	procesar teclas pulsadas
function onKeyDown(key) {

	var	cualTecla = key.key;
	console.log( "cualTecla :" + cualTecla );

    if (key.key === "*" ) {
		state = Menu;
    }

    // W Key is 87
    // Up arrow is 87
    if (key.keyCode === 87 || key.keyCode === 38) {
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
    }

    // A Key is 65
    // Left arrow is 37
    if (key.keyCode === 65 || key.keyCode === 37) {
    }

    // D Key is 68
    // Right arrow is 39
    if (key.keyCode === 68 || key.keyCode === 39) {
    }

}

