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

//Create a Pixi stage and renderer
var stage = new Container(),
//Create the renderer
renderer = autoDetectRenderer(900,600);
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//	Set the canvas's border style and background color
renderer.view.style.border = "5px solid #040";
renderer.backgroundColor = "0xeeffdd";
//	renderer.backgroundColor = "0xeeffdd";

//let scale = scaleToWindow(renderer.view);

//	stage.interactive = true;

//load resources; a JSON file and run the `setup` function when it's done 
loader.add("images/sumadotileset.json")	.load(setup);


//Define any variables that are used in more than one function
var t = undefined,
	BotonAyuda = undefined,
	BotonJugar = undefined,
	BotonPuntos = undefined,
	actionMessage = undefined,
	botonera = undefined,
	gameOverScene,						//	container aviso de fin del juego
	gameScene,							//	container del juego
	id = undefined,
	message = undefined,
	pointer = undefined,
	presentacion = undefined,			//	container para la presentacion
	state = play, 
	stateMessage = undefined,
	//	DEBUG = false;		//	true;
	DEBUG = true;


function setup() {

	//Create a new instance of Tink
	t = new Tink(PIXI, renderer.view);

	//////////////////////////////////////////////////////////////////////////////////////////////
	//	Preparacion de botones
	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	//	Get a reference to the texture atlas id's
	id = resources["images/sumadotileset.json"].textures;

	var buttonFrames			//	almacenar el array de imagenes del boton

	//	The button state textures
	//	Preparacion boton de juego
	//	let buttonJugarFrames = [id["botonjugarup.png"],id["botonjugarover.png"],id["botonjugardown.png"]];
	//	me guardo el nombre anterior para ampliar luego
	buttonFrames = [id["botonjugarup.png"], id["botonjugarover.png"], 	id["botonjugardown.png"]];

	//	The `BotonJugar`
	BotonJugar = t.button(buttonFrames, 50, 500 );

	//Add the button to the stage
	stage.addChild(BotonJugar);

	//Define the button's actions
	BotonJugar.over = function () {
		return console.log("over");
	};
	BotonJugar.out = function () {
		return console.log("out");
	};
	BotonJugar.press = function () {
		return console.log("pressed");
	};
	BotonJugar.release = function () {
		return console.log("released");
	};
	BotonJugar.tap = function () {
		return console.log("tapped");
	};


	//	Preparacion boton de ayudas
	buttonFrames = [id["botonayudaup.png"], id["botonayudaover.png"], 	id["botonayudadown.png"]];

	BotonAyuda = t.button(buttonFrames, 350, 500 );

	//Add the button to the stage
	stage.addChild(BotonAyuda);

	//Define the button's actions
	BotonAyuda.over = function () {
		return console.log("BotonAyuda over");
	};
	BotonAyuda.out = function () {
		return console.log("BotonAyuda out");
	};
	BotonAyuda.press = function () {
		return console.log("BotonAyuda pressed");
	};
	BotonAyuda.release = function () {
		return console.log("BotonAyuda released");
	};
	BotonAyuda.tap = function () {
		return console.log("BotonAyuda tapped");
	};


	//	Preparacion boton de puntaje
	buttonFrames = [id["botonpuntajeup.png"], id["botonpuntajeover.png"], 	id["botonpuntajedown.png"]];

	BotonPuntos = t.button(buttonFrames, 650, 500 );

	//Add the button to the stage
	stage.addChild(BotonPuntos);

	//Define the button's actions
	BotonPuntos.over = function () {
		return console.log("BotonPuntos over");
	};
	BotonPuntos.out = function () {
		return console.log("BotonPuntos out");
	};
	BotonPuntos.press = function () {
		return console.log("BotonPuntos pressed");
	};
	BotonPuntos.release = function () {
		return console.log("BotonPuntos released");
	};
	BotonPuntos.tap = function () {
		return console.log("BotonPuntos tapped");
	};


	//Add the `stageMessage`
	stateMessage = new PIXI.Text("State: ", { font: "18px Bangers", fill: "black" });
	stateMessage.position.set(8, 8);
	stage.addChild(stateMessage);

	//Add the `actionMessage`
	actionMessage = new PIXI.Text("Action: ", { font: "18px Bangers", fill: "black" });
	actionMessage.position.set(8, 32);
	stage.addChild(actionMessage);

	//Optionally create a `pointer` object
	//pointer = t.makePointer();

	//Start the game loop
	gameLoop();



/*
	var graphics = new PIXI.Graphics();
	var	botonUp, botonOv, botonDw;

	botonera = new Container();
	stage.addChild(botonera);
	
	//	Make the `gameOver` scene invisible when the game first starts
	botonera.visible = true;

/*	
	var spritesumado = PIXI.utils.TextureCache["su-ma-do.png"];
	spritesumado = new Sprite(spritesumado);
	spritesumado.x = 400;
	spritesumado.y = 150;
	// make it a bit bigger, so it's easier to grab
	spritesumado.scale.set(1.0);
	botonera.addChild(spritesumado);


	var botonjugarup = PIXI.utils.TextureCache["botonjugarup.png"];
	botonjugarup = new Sprite(botonjugarup);
	botonjugarup.x = 50;
	botonjugarup.y = 500;
	// make it a bit bigger, so it's easier to grab
	botonjugarup.scale.set(1.0);
	botonera.addChild(botonjugarup);

	var botonayudaup = PIXI.utils.TextureCache["botonayudaup.png"];
	botonayudaup = new Sprite(botonayudaup);
	botonayudaup.x = 350;
	botonayudaup.y = 500;
	botonayudaup.scale.set(1.0);
	botonera.addChild(botonayudaup);

	var botonpuntajeup = PIXI.utils.TextureCache["botonpuntajeup.png"];
	botonpuntajeup = new Sprite(botonpuntajeup);
	botonpuntajeup.x = 650;
	botonpuntajeup.y = 500;
	botonpuntajeup.scale.set(1.0);
	botonera.addChild(botonpuntajeup);

*/
	//	console.log( "se cargó el boton" ) ;

    
	// draw a second rounded rectangle
	// graphics.lineStyle(2, 0x336600, 3);
	// graphics.beginFill(0x669900, 0.95);
	// graphics.drawRoundedRect(350, 500, 250, 50, 10);
	// graphics.endFill();
	// botonera.addChild(graphics);
	//	
	//	message = new Text( "AYUDA", { font: "32px Bangers", fill : "#080", align : 'left'});
	//	message.position.set( 400, 300);
	//	botonera.addChild(message);
 
	//	to make the canvas fill the entire window, this CSS styling and resize the renderer to the size of the browser window.
	//	renderer.view.style.position = "absolute";
	//	renderer.view.style.display = "block";
	//	renderer.autoResize = true;
	//	renderer.resize(window.innerWidth, window.innerHeight);


	//Optionally create a `pointer` object
	//pointer = t.makePointer();

	
	// make the button interactive...
    //	t.makeInteractive(botonJugar);


	//	para cada boton qu quisiera preparar ....

    //	botonJugar
    //	    // set the mousedown and touchstart callback...
    //	    .on('mousedown', onButtonDown)
    //	    .on('touchstart', onButtonDown)
//	
//	        // set the mouseup and touchend callback...
//	        .on('mouseup', onButtonUp)
//	        .on('touchend', onButtonUp)
//	        .on('mouseupoutside', onButtonUp)
//	        .on('touchendoutside', onButtonUp)
//	
//	        // set the mouseover callback...
//	        .on('mouseover', onButtonOver)
//	
//	        // set the mouseout callback...
//	        .on('mouseout', onButtonOut)

        // you can also listen to click and tap events :
        //.on('click', noop)
        
//		button.tap = noop;
//		button.click = noop;
//	    // add it to the stage
//	    stage.addChild(button);
//	
//	    // add button to array
//	    buttons.push(button);
//	

	//////////////////////////////////////////////////////////////////////////////////////////////
	//Create the `gameOver` scene
	gameOverScene = new Container();
	stage.addChild(gameOverScene);

	//Make the `gameOver` scene invisible when the game first starts
	gameOverScene.visible = false;
	stage.visible = true;

	//	Set the initial game state
	//	state = play;

	//	menu()

	//	Una grilla para ubicarnos en el canvas
	if (DEBUG) 
	{
		for (var i = 0; i < 18; i++)
		{
			//	lineas horizontales
			var line = new PIXI.Graphics();
			line.lineStyle(1, "#bbbbbbb", 1);
			line.moveTo(0, 0);
			line.lineTo(900, 0);
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


	//Start the game loop
	gameLoop();

    // render the stage
    renderer.render(stage);
    //	renderer.render(stage);
}



function gameLoop() {

	//	console.log( "gameloop() ----------------------------" );

	//Loop this function 60 times per second
	requestAnimationFrame(gameLoop);

	//Run the current state
	state();

	//Update Tink
	t.update();

	//Render the stage
	renderer.render(stage);
}




//	--------------------------------------
function play() {
	//	console.log( "play() ----------------------------" );
	stateMessage.text = "State: " + BotonJugar.state;
	actionMessage.text = "Action: " + BotonJugar.action;

	//	actionMessage.text = "Action: " + botonJugar.action;

	//	pointer.press = () => console.log("The pointer was pressed");
	//	pointer.release = () => console.log("The pointer was released");
	//	pointer.tap = () => console.log("The pointer was tapped");
	
	//	if (resuelto) {
	//		state = end;
	//	message.text = "GANASTE...SSSSSSS!";
	//	}
	//	console.log( "state en play() |" + state + "|");
	//	console.log( "fin de play() ----------------------------" );

}

////////////////////////////////////////////////////////////////////////////////////////

