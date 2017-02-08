/*	
	PRESENTA.js
	
	Desarrollo de presentaci�n en pantalla de una aplicacion

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




*/

//Test that Pixi is working
console.log(PIXI);

//Create a container object called the 'stage'. a Pixi stage and renderer and add the renderer.view to the DOM
var stage = new PIXI.Container();
stage.interactive = true;

//Create the renderer
var renderer = PIXI.autoDetectRenderer(900,600);
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//load a JSON file and run the `setup` function when it's done 
PIXI.loader
	.add("images/sumadotileset.json")
	.load(setup);


//Define any variables that are used in more than one function
var t = undefined,
    pointer = undefined,
   	message = undefined,
	gameScene,							//	container del juego
	gameOverScene,						//	container aviso de fin del juego
	state, 
	presentacion = undefined,			//	container para la presentacion
	//	DEBUG = false;		//	true;
	DEBUG = true;


function menu() {
	//	Opciones menu de inicio (presentacion)
	//	jugar
	//	como se juega
	//	puntaje

	var graphics = new PIXI.Graphics();
	var	botonUp, botonOv, botonDw;

	botonera = new PIXI.Container();
	stage.addChild(botonera);
	
	//	Make the `gameOver` scene invisible when the game first starts
	botonera.visible = true;

	var spritesumado = PIXI.utils.TextureCache["su-ma-do.png"];
	spritesumado = new PIXI.Sprite(spritesumado);
	spritesumado.x = 50;
	spritesumado.y = 150;
	// make it a bit bigger, so it's easier to grab
	spritesumado.scale.set(1.0);
	botonera.addChild(spritesumado);


	var botonjugarup = PIXI.utils.TextureCache["botonjugarup.png"];
	botonjugarup = new PIXI.Sprite(botonjugarup);
	botonjugarup.x = 50;
	botonjugarup.y = 500;
	// make it a bit bigger, so it's easier to grab
	botonjugarup.scale.set(1.0);
	botonera.addChild(botonjugarup);

	var botonayudaup = PIXI.utils.TextureCache["botonayudaup.png"];
	botonayudaup = new PIXI.Sprite(botonayudaup);
	botonayudaup.x = 350;
	botonayudaup.y = 500;
	botonayudaup.scale.set(1.0);
	botonera.addChild(botonayudaup);

	var botonpuntajeup = PIXI.utils.TextureCache["botonpuntajeup.png"];
	botonpuntajeup = new PIXI.Sprite(botonpuntajeup);
	botonpuntajeup.x = 650;
	botonpuntajeup.y = 500;
	botonpuntajeup.scale.set(1.0);
	botonera.addChild(botonpuntajeup);

	//	console.log( "se carg� el boton" ) ;

    
	// draw a second rounded rectangle
	// graphics.lineStyle(2, 0x336600, 3);
	// graphics.beginFill(0x669900, 0.95);
	// graphics.drawRoundedRect(350, 500, 250, 50, 10);
	// graphics.endFill();
	// botonera.addChild(graphics);
	//	
	//	message = new PIXI.Text( "AYUDA", { font: "32px Bangers", fill : "#080", align : 'left'});
	//	message.position.set( 400, 300);
	//	botonera.addChild(message);
    
	//Create an alias for the texture atlas frame ids
	let id = PIXI.loader.resources["images/button.json"].textures;

	let buttonFrames = [
		id["up.png"],
		id["over.png"],
		id["down.png"]
	];



}

function setup() {

	//	preparar menu del juego
	presentacion = new PIXI.Container();
	stage.addChild(presentacion);


	//	Set the canvas's border style and background color
	renderer.view.style.border = "15px solid #040";
	renderer.backgroundColor = "0xddffcc";

	//	to make the canvas fill the entire window, this CSS styling and resize the renderer to the size of the browser window.
	renderer.view.style.position = "absolute";
	renderer.view.style.display = "block";
	renderer.autoResize = true;
	//	renderer.resize(window.innerWidth, window.innerHeight);


	//Create the `gameOver` scene
	gameOverScene = new PIXI.Container();
	stage.addChild(gameOverScene);

	//Make the `gameOver` scene invisible when the game first starts
	gameOverScene.visible = false;
	presentacion.visible = true;

	state = play;

	menu()

	//	Una grilla para ubicarnos en el canvas
		if (DEBUG) 
		{
			for (var i = 0; i < 18; i++)
			{
				//	lineas horizontales
				var line = new PIXI.Graphics();
				line.lineStyle(1, "#bbb", 1);
				line.moveTo(0, 0);
				line.lineTo(900, 00);
				line.x = 0;
				line.y = 50 * (i + 1);
				stage.addChild(line);
				//	console.log( "Linea en posicion: " + line.y );

				//	lineas verticales
				var line = new PIXI.Graphics();
				line.lineStyle(1, "#eee", 1);
				line.moveTo(0, 0);
				line.lineTo(0, 600);
				line.x = 50 * (i + 1);
				line.y = 0;
				stage.addChild(line);
			}
		}


	//	gameLoop()
    // render the stage
    renderer.render(stage);
}





function gameLoop() {

	console.log( "gameloop() ----------------------------" );

	//	Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

	//Run the current state
	state();

    // render the stage
    renderer.render(stage);

}

//	--------------------------------------
function play() {
	console.log( "play() ----------------------------" );

	
	//	if (resuelto) {
	//		state = end;
	//	message.text = "GANASTE...SSSSSSS!";
	//	}
	//	console.log( "state en play() |" + state + "|");
	//	console.log( "fin de play() ----------------------------" );
}


//	funciones para responder a botones
function myFunction() {
    var x = document.createElement("BUTTON");
    var t = document.createTextNode("Click me");
    x.appendChild(t);
    document.body.appendChild(x);
}