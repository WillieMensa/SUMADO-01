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

//	Set the canvas's border style and background color
renderer.view.style.border = "15px solid #040";
renderer.backgroundColor = "0xddffcc";


//load a JSON file and run the `setup` function when it's done 
PIXI.loader	.add("images/sumadotileset.json")	.load(setup);


//Define any variables that are used in more than one function
var t = undefined,
	pointer = undefined,
   	message = undefined,
	gameScene,							//	container del juego
	gameOverScene,						//	container aviso de fin del juego
	state, 
	presentacion = undefined,			//	container para la presentacion
    botonJugar = undefined,
    id = undefined,
    stateMessage = undefined,
    actionMessage = undefined;
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

/*	
	var spritesumado = PIXI.utils.TextureCache["su-ma-do.png"];
	spritesumado = new PIXI.Sprite(spritesumado);
	spritesumado.x = 400;
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

*/
	//	console.log( "se cargó el boton" ) ;

    
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
    

}

function setup() {

	t = new Tink(PIXI, renderer.view);

	//	preparar menu del juego
	presentacion = new PIXI.Container();
	stage.addChild(presentacion);


	//////////////////////////////////////////////////////////////////////////////////////////////
	//	Preparacion de botones
	//	Create an alias for the texture atlas frame ids
	//	Hay varias formas de crear sprites a partir del atlas. Esta sería la mas expeditiva.
	var id = PIXI.loader.resources["images/sumadotileset.json"].textures;

	let buttonJugarFrames = [
		id["botonjugarup.png"],
		id["botonjugarover.png"],
		id["botonjugardown.png"]
	];

	//The `playButton`
	botonJugar = t.button(buttonJugarFrames, 50, 500 );


	//	to make the canvas fill the entire window, this CSS styling and resize the renderer to the size of the browser window.
	renderer.view.style.position = "absolute";
	renderer.view.style.display = "block";
	renderer.autoResize = true;
	//	renderer.resize(window.innerWidth, window.innerHeight);


	presentacion.addChild( botonJugar );

	//Define the button's actions
	botonJugar.over = function () {
	return console.log("over");
	};
	botonJugar.out = function () {
	return console.log("out");
	};
	botonJugar.press = function () {
	return console.log("pressed");
	};
	botonJugar.release = function () {
	return console.log("released");
	};
	botonJugar.tap = function () {
	return console.log("tapped");
	};

	//Add the `stageMessage`
	stateMessage = new PIXI.Text("State: ", { font: "18px Bangers", fill: "black" });
	stateMessage.position.set(8, 8);
	presentacion.addChild(stateMessage);

	//Add the `actionMessage`
	actionMessage = new PIXI.Text("Action: ", { font: "18px Bangers", fill: "black" });
	actionMessage.position.set(8, 32);
	presentacion.addChild(actionMessage);

	//Optionally create a `pointer` object
	//pointer = t.makePointer();

	
	// make the button interactive...
    //	t.makeInteractive(botonJugar);


	//Start the game loop
	gameLoop();


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
//	    presentacion.addChild(button);
//	
//	    // add button to array
//	    buttons.push(button);
//	

	//////////////////////////////////////////////////////////////////////////////////////////////
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
    //	renderer.render(presentacion);
}



function gameLoop() {

	console.log( "gameloop() ----------------------------" );
	//Start the loop
	//	requestAnimationFrame(gameLoop);

	play();

	//Update Tink
	t.update();

	//Optionally, you probably also want to render your root Pixi
	//container, the `stage` object, in this loop:
	renderer.render(stage);

}



//	--------------------------------------
function play() {
	console.log( "play() ----------------------------" );
	stateMessage.text = "State: " + botonJugar.state;
	actionMessage.text = "Action: " + botonJugar.action;
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

