//Test that Pixi is working
console.log(PIXI);

//	en esta version utilizo las tecnicas de libreria tink.js

//	Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
	DEBUG = true;

	//	Rectangle = (PIXI.Rectangle);

//Create a Pixi stage and renderer
var stage = new Container(),
    renderer = autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);


//Define any variables that are used in more than one function
var t = undefined,
    pointer = undefined,
    grid = undefined,
    draggableObjects = undefined;

	//load a JSON file and run the `setup` function when it's done 
	loader
	  .add("images/sumadotileset.json")
	  .load(setup);
 

function setup() {

	//Set the canvas's border style and background color
	renderer.view.style.border = "4px dashed black";
	renderer.backgroundColor = "0xdddddd";

	//Define any variables that are used in more than one function
	//////////////////////////////////////////
	//	aqui comienza el uso de librer�a tink
	t = new Tink(PIXI, renderer.view);

	pointer = t.makePointer();

	//Add a custom `press` method
//		pointer.press = function () {
//			/////////////////////////////
//			//	debug	
//			console.log("The pointer was released in function animate()");
//			//	console.log( "Al final, this.position: " + this.position.x + "," + this.position.y );
//	
//			this.alpha = 1;
//	
//			this.dragging = false;
//	
//			// set the interaction data to null
//			this.data = null;
//	
//			// store a reference to the data
//			// the reason for this is because of multitouch
//			// we want to track the movement of this particular touch
//			this.data = event.data;
//			this.alpha = 0.5;
//			this.dragging = true;
//	
//			/////////////////////////////
//			//	debug
//			console.log( "En inicio, this.position: " + this.position.x + "," + this.position.y );
//			//	console.log( "   this.parent: " + this.data.getLocalPosition.x + "," + this.data.getLocalPosition.y );
//		};
//	
//	
//	
//		//Add a custom `release` method
//		pointer.release = () => console.log("The pointer was released");
//	
//		//Add a custom `tap` method
//		//	pointer.tap = () => console.log("The pointer was tapped");
//	
//		pointer.tap = function () {
//			console.log("The pointer was tapped");
//		};



	//let scale = scaleToWindow(renderer.view);

	//Set the initial game state
	//	var state = animate;

	//Define variables that might be used in more than one function
	var tablero
	//	, num01, num02, num03, id;

	//	pruebo armar un array con los numeros
	var num, cImagen, aNumeros = [];
	//	grilla para posiciones de detencion fijas
	grid = [200,200];


	//	1. Access the `TextureCache` directly. esto ser�a el piso
	//	creacion del tablero con metodo 1
	var tableroTexture = TextureCache["tablero.png"];
	tablero = new Sprite(tableroTexture);
	tablero.x = 54;
	tablero.y = 54;
	// make it a bit bigger, so it's easier to grab
	tablero.scale.set(1.18);
	stage.addChild(tablero);

	//Create a container for the draggable objects and
	draggableObjects = new Container();

	// creacion de los sprites draggables para cada nro
	for (var i = 0; i < 10; i++)
	{
		cImagen = "num0" + i + ".png";
		numTexture = TextureCache[cImagen];
		num = new Sprite(numTexture);

		//	Test 
		//	console.log( "Imagen creada: " + cImagen );
		
		// enable the bunny to be interactive... this will allow it to respond to mouse and touch events
		//	num.interactive = true;

		// this button mode will mean the hand cursor appears when you roll over the num with your mouse
		//	num.buttonMode = true;

		// center the num's anchor point
		num.anchor.set(0.5);

		// make it a bit bigger, so it's easier to grab
		num.scale.set(1.0);


		// setup events
//			num
//			// events for drag start
//			.on('mousedown', onDragStart)
//			.on('touchstart', onDragStart)
//			// events for drag end
//			.on('mouseup', onDragEnd)
//			.on('mouseupoutside', onDragEnd)
//			.on('touchend', onDragEnd)
//			.on('touchendoutside', onDragEnd)
//			// events for drag move
//			.on('mousemove', onDragMove)
//			.on('touchmove', onDragMove);

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
		
		//Make the sprites draggable
		t.makeDraggable(aNumeros[i]);
		aNumeros[i].draggable = true;

		if (DEBUG) 
		{
				console.log( i + " es draggable " + aNumeros[i].draggable );
		}

	}

	//	para hacer draggable los numeros
	//	t.makeDraggable(aNumeros[0], aNumeros[1],aNumeros[2],aNumeros[3],aNumeros[4] );

	////////////////////////////////////////////////////
	//	colocamos las sumas de los poligonos en posici�n
	var message = new PIXI.Text( "A9", {fontFamily : 'Calibri', fontSize: 56, fill : "green", align : 'right'});
	message.position.set(210, 140);
	stage.addChild(message);

	message = new PIXI.Text(	"B9", {fontFamily : 'Calibri', fontSize: 56, fill : "green", align : 'right'});
	message.position.set(140, 205);
	stage.addChild(message);

	message =	new PIXI.Text(	"C9", {fontFamily : 'Calibri', fontSize: 56, fill : "green", align : 'right'});
	message.position.set(370, 170);
	stage.addChild(message);

	message = new PIXI.Text(	"D9", {fontFamily : 'Calibri', fontSize: 56, fill : 'green', align : 'center'});
	message.position.set(170, 370);
	stage.addChild(message);

	message = new PIXI.Text(	"E9", {fontFamily : 'Calibri', fontSize: 56, fill : 0x10ff10, align : 'center'});
	message.position.set(340, 405);
	stage.addChild(message);

	message = new PIXI.Text(	"F9", {fontFamily : 'Calibri', fontSize: 56, fill : 0x10ff10, align : 'center'});
	message.position.set(410, 340);
	stage.addChild(message);

	//////////////////////////
	//	Una grilla para ubicarnos en el canvas
	for (var i = 0; i < 12; i++)
	{
		//	lineas horizontales
		var line = new PIXI.Graphics();
		line.lineStyle(1, 0xff44ff, 1);
		line.moveTo(0, 0);
		line.lineTo(600, 00);
		line.x = 0;
		line.y = 50 * (i + 1);
		stage.addChild(line);
		//	console.log( "Linea en posicion: " + line.y );

		//	lineas verticales
		var line = new PIXI.Graphics();
		line.lineStyle(1, 0xff44ff, 1);
		line.moveTo(0, 0);
		line.lineTo(0, 600);
		line.x = 50 * (i + 1);
		line.y = 0;
		stage.addChild(line);

	}

	animate();

}


//	requestAnimationFrame(animate);


// este seria el loop del juego (game loop)
function animate() {

	//	Loop this function 60 times per second
    requestAnimationFrame(animate);

	//Run the current state
	//	state();

	//Update Tink
	t.update();

	//	verifico deteccion de pointermovements
	//	if (pointer.press)
	//	{
	//		console.log("The pointer was pressed, izquierdo");
	//	}
	//		if (pointer.release)
	//	{
	//		console.log("The pointer was released, izquierdo suelto");
	//	}
	//	
	//	if (pointer.tap)
	//	{
	//		console.log("The pointer was tapped, derecho");
	//	}
	

	//	pointer.press = () => console.log("The pointer was pressed, izquierdo");
	//	Add a custom `press` method
	pointer.press = function () {
		/////////////////////////////
		//	debug
		console.log("The pointer was pressed in function animate()");
		console.log( "En inicio, this.position: " + this.position.x + "," + this.position.y );
		//	console.log( "   this.parent: " + this.data.getLocalPosition.x + "," + this.data.getLocalPosition.y );

		// store a reference to the data
		// the reason for this is because of multitouch
		// we want to track the movement of this particular touch
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;

	};


	pointer.release = function () {
		/////////////////////////////
		//	debug	
		console.log("The pointer was released in function animate()");
		console.log( "Al final, this.position: " + this.position.x + "," + this.position.y );

		var gridstep, nLineaOffset = 100;

		if (this.dragging)
		{
			var newPositionx = this.position.x;
			var newPositiony = this.position.y;
			/////////////////////////////////////////////////////
			//	aca modifico para tratar de introducir una grilla

			gridstep = grid[0];
			newPositionx = nLineaOffset + (Math.round(newPositionx / gridstep) - 0.5) * gridstep;
			gridstep = grid[1];
			newPositiony = nLineaOffset + (Math.round(newPositiony / gridstep) - 0.5) * gridstep;
		//	lo que sigue no lo uso por ahora 
		//		if(containment && !(x > 0 || x2 < containment.width))
		//		{
		//			x += (x > 0) ? -grid : grid;
		//		}
		//		console.log( "this: " + this.position.x + "     new: " + newPosition.x );
			/////////////////////////////////////////////////////

			this.position.x = newPositionx;
			this.position.y = newPositiony;
		}

		this.alpha = 1;

		this.dragging = false;

		// set the interaction data to null
		this.data = null;

	};


	pointer.tap = function () {
		/////////////////////////////
		//	debug	
		console.log("The pointer was tapped in function animate(). Posicion: " + this.position.x + "," + this.position.y );
	};


    // render the stage
    renderer.render(stage);
}


	//	Add a custom `press` method
	//	pointer.press = function () {
	//	return console.log("seteo: el puntero fue presionado");
	//	};
	//Add a custom `release` method
	//	pointer.release = function () {
	//	return console.log("The pointer was released");
	//	};
	//Add a custom `tap` method
	//	pointer.tap = function () {
	//	return console.log("The pointer was tapped");
	//	};



//	function onDragStart(event)
//	{
//	    // store a reference to the data
//	    // the reason for this is because of multitouch
//	    // we want to track the movement of this particular touch
//	    this.data = event.data;
//	    this.alpha = 0.5;
//	    this.dragging = true;
//		/////////////////////////////
//		//	debug
//		console.log( "En inicio, this.position: " + this.position.x + "," + this.position.y );
//		//	console.log( "   this.parent: " + this.data.getLocalPosition.x + "," + this.data.getLocalPosition.y );
//	}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

	/////////////////////////////
	//	debug	
	//	
	console.log( "Al final, this.position: " + this.position.x + "," + this.position.y );

}

function onDragMove()
{
	var gridstep, nLineaOffset = 100;

    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
		/////////////////////////////////////////////////////
		//	aca modifico para tratar de introducir una grilla

		gridstep = grid[0];
		newPosition.x = nLineaOffset + (Math.round(newPosition.x / gridstep) - 0.5) * gridstep;
		gridstep = grid[1];
		newPosition.y = nLineaOffset + (Math.round(newPosition.y / gridstep) - 0.5) * gridstep;
	//	lo que sigue no lo uso por ahora 
	//		if(containment && !(x > 0 || x2 < containment.width))
	//		{
	//			x += (x > 0) ? -grid : grid;
	//		}
	//		console.log( "this: " + this.position.x + "     new: " + newPosition.x );
		/////////////////////////////////////////////////////

        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}


//	pointer.press = () => console.log("The pointer was pressed");
//	pointer.release = () => console.log("The pointer was released");
//	pointer.tap = () => console.log("The pointer was tapped");