/*	
	presenta-b.js

	presentacion utilizando libreria tink (por los botones	
	preparacion de botones interactivos : ver interactivity.js

	Desarrollo de presentación en pantalla de una aplicacion

	Incorporacion de fonts, ejemplos de codigo en 
		https://developers.google.com/fonts/docs/getting_started
		Imperdible!

	Font families. codigo 

	font-family: 'Amatic SC', cursive;
	font-family: 'Bungee Shade', cursive;

STANDARD @IMPORT
<link href="https://fonts.googleapis.com/css?family=Amatica+SC:700|Bangers|Bungee|Bungee+Inline|Sigmar+One" rel="stylesheet">
Specify in CSS

Use the following CSS rules to specify these families:
font-family: 'Bangers', cursive;
font-family: 'Sigmar One', cursive;
font-family: 'Bungee Inline', cursive;
font-family: 'Bungee', cursive;
font-family: 'Amatica SC', cursive;

color de fondo tomado de
	http://www.w3schools.com/colors/colors_picker.asp
#558000
rgb(85, 128, 0)
hsl(80, 100%, 25%)

	//	Opciones menu de inicio (presentacion)
	//	jugar
	//	como se juega
	//	puntaje

*/

//Aliases
"use strict";

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Sprite = PIXI.Sprite,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Text = PIXI.Text;


//Test that Pixi is working
console.log(PIXI);

//Create a Pixi EscenarioGral and renderer
var EscenarioGral = new Container(),
//Create the renderer
renderer = autoDetectRenderer(900,600);
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//	Set the canvas's border style and background color
renderer.view.style.border = "5px solid #040";
renderer.backgroundColor = "0xeeffdd";
//	renderer.backgroundColor = "0xeeffdd";

//let scale = scaleToWindow(renderer.view);

//	EscenarioGral.interactive = true;

//load resources; a JSON file and run the `setup` function when it's done 
loader.add("images/sumadotileset.json")	.load(setup);


//Define any variables that are used in more than one function
var t = undefined,
	BotonAyuda = undefined,
	BotonJugar = undefined,
	BotonPuntos = undefined,
	actionMessage = undefined,
	EscenaMenuInic = undefined,			//	container pantalla de inicio
	EscenaFinJuego = undefined,			//	container aviso de fin del juego
	EscenaDeAyudas = undefined,			//	container ayudas
	EscenaDelJuego = undefined,			//	container del juego
	EscenaEstadist = undefined,			//	container de estadisticas
	id = undefined,
	message = undefined,
	pointer = undefined,
	state = play, 
	stateMessage = undefined,
	//	DEBUG = false;		
	DEBUG = true;


function setup() {
	//	Preparacion general

	//Create a new instance of Tink
	t = new Tink(PIXI, renderer.view);

	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	//	Get a reference to the texture atlas id's
	id = resources["images/sumadotileset.json"].textures;

	//	Make the game scene and add it to the EscenarioGral
	EscenaDelJuego = new PIXI.Container();
	EscenarioGral.addChild(EscenaDelJuego);
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//Create the EscenaFinJuego
	EscenaFinJuego = new Container();
	EscenarioGral.addChild(EscenaFinJuego);

	//	Crear escenario de ayudas
	EscenaDeAyudas = new Container();
	EscenarioGral.addChild(EscenaDeAyudas);

	//	Crear escenario de ayudas
	EscenaEstadist = new Container();
	EscenarioGral.addChild(EscenaEstadist);

	//	Prepara las diferentes pantallas / escenas.
	PantallaInicio();
	PantallaAyuda();
	PantallaTutorial();
	PantallaJugar();
	PantallaEstadistica();

	//	Set the initial game state
	state = play;

	//	menu()

	//	Una grilla para ubicarnos en el canvas
	if (DEBUG) 
	{
		DibujaGrilla()
	}

	//	definir cuales son las escenas visibles y cuales invisibles
	EscenaMenuInic.visible = true;			//	container pantalla de inicio
	EscenaFinJuego.visible = false;		//	container aviso de fin del juego
	EscenaDelJuego.visible = false;			//	container del juego
	EscenaDeAyudas.visible = true;
	EscenaEstadist.visible = true;
	EscenarioGral.visible = true;


	//Start the game loop
	gameLoop();

    // render the EscenarioGral
    renderer.render(EscenarioGral);
    //	renderer.render(EscenarioGral);


}


function PantallaInicio() {

	//	var graphics = new PIXI.Graphics();
	EscenaMenuInic = new Container();
	EscenarioGral.addChild(EscenaMenuInic);
	
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


	//	Prepara los botones con las opciones de juego, ayuda, puntaje
	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	//	Get a reference to the texture atlas id's
	var buttonFrames			//	almacenar el array de imagenes del boton

	//	The button state textures
	//	Preparacion boton de juego
	//	let buttonJugarFrames = [id["botonjugarup.png"],id["botonjugarover.png"],id["botonjugardown.png"]];
	//	me guardo el nombre anterior para ampliar luego
	buttonFrames = [id["botonjugarup.png"], id["botonjugarover.png"], 	id["botonjugardown.png"]];

	//	The `BotonJugar`
	BotonJugar = t.button(buttonFrames, 50, 500 );

	//Add the button to the EscenarioGral
	EscenaMenuInic.addChild(BotonJugar);

	//Define the button's actions
	BotonJugar.over = function () {
		//	return console.log("over");
	};
	BotonJugar.out = function () {
		//	return console.log("out");
	};
	BotonJugar.press = function () {
		console.log("Pulsaron boton JUGAR");
		//	definir cuales son las escenas visibles y cuales invisibles
		EscenaMenuInic.visible = false;			//	container pantalla de inicio
		EscenaFinJuego.visible = false;		//	container aviso de fin del juego
		EscenaDelJuego.visible = true;			//	container del juego
		EscenaDeAyudas.visible = false;
		EscenaEstadist.visible = false;
		EscenarioGral.visible = true;

		Jugar();
	};
	//	BotonJugar.release = function () {
	//		return console.log("released");
	//	};
	BotonJugar.tap = function () {
		//	return console.log("tapped");
	};


	//	Preparacion boton de ayudas
	buttonFrames = [id["botonayudaup.png"], id["botonayudaover.png"], 	id["botonayudadown.png"]];

	BotonAyuda = t.button(buttonFrames, 350, 500 );

	//Add the button to the EscenarioGral
	EscenaMenuInic.addChild(BotonAyuda);

	//Define the button's actions
	BotonAyuda.over = function () {
		//	return console.log("BotonAyuda over");
	};
	BotonAyuda.out = function () {
		//	return console.log("BotonAyuda out");
	};
	BotonAyuda.press = function () {
		//	PantallaAyuda();
		//	definir cuales son las escenas visibles y cuales invisibles
		EscenaMenuInic.visible = false;			//	container pantalla de inicio
		EscenaFinJuego.visible = false;		//	container aviso de fin del juego
		EscenaDelJuego.visible = false;			//	container del juego
		EscenaDeAyudas.visible = true;
		EscenaEstadist.visible = false;
		EscenarioGral.visible = true;

		return console.log("Pulsaron boton AYUDA");
	};
	BotonAyuda.release = function () {
		//	return console.log("BotonAyuda released");
	};
	BotonAyuda.tap = function () {
		//	return console.log("BotonAyuda tapped");
	};


	//	Preparacion boton de puntaje
	buttonFrames = [id["botonpuntajeup.png"], id["botonpuntajeover.png"], 	id["botonpuntajedown.png"]];

	BotonPuntos = t.button(buttonFrames, 650, 500 );

	//Add the button to the EscenarioGral
	EscenaMenuInic.addChild(BotonPuntos);

	//Define the button's actions
	BotonPuntos.over = function () {
		//	return console.log("BotonPuntos over");
	};
	BotonPuntos.out = function () {
		//	return console.log("BotonPuntos out");
	};
	BotonPuntos.press = function () {
		return console.log("Pulsaron boton ESTADISTICA");
	};
	BotonPuntos.release = function () {
		//	return console.log("BotonPuntos released");
	};
	BotonPuntos.tap = function () {
		//	return console.log("BotonPuntos tapped");
	};

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
	console.log( "EscenaDelJuego.visible : " + EscenaDelJuego.visible );
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
	return console.log("Llamaron function PantallaJugar");
	
	var tablero, i,	aSumaPolig, 
	   	aVertex = undefined,
		i = undefined,			//	para conteo usos varios
		aPosPolig = undefined,
		num, cImagen;

	//	1. Access the `TextureCache` directly. esto sería el piso
	//	creacion del tablero con metodo 1
	
	//	var tableroTexture = id["tablero.png"];
	//	tablero = new PIXI.Sprite(tableroTexture);

	tablero = id["tablero.png"];

	tablero.x = 54;
	tablero.y = 54;
	// make it a bit bigger, so it's easier to grab
	tablero.scale.set(1.18);
	EscenaDelJuego.addChild(tablero);

}

function PantallaEstadistica() {
	return console.log("Llamaron function PantallaEstadistica");
}


function Jugar() {
	console.log("Llamaron a la opcion JUGAR");

}