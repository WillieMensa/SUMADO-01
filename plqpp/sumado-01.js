//Test that Pixi is working
console.log(PIXI);

//	sigo ejemplo de 
//		http://pixijs.github.io/examples/index.html#/demos/dragging.js
//		y le agrego los sprites tomados del texture atlas

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

//Create a Pixi stage and renderer and add the renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(800, 600);
	document.body.appendChild(renderer.view);

//Set the canvas's border style and background color
renderer.view.style.border = "1px dashed black";
renderer.backgroundColor = "0xFFFFFF";

//Define any variables that are used in more than one function
var t = new Tink(PIXI, renderer.view);
//    pointer = undefined;
var	pointer = t.makePointer();

//Add a custom `press` method
pointer.press = function () {
return console.log("seteo: el puntero fue presionado");
};
//Add a custom `release` method
pointer.release = function () {
return console.log("The pointer was released");
};
//Add a custom `tap` method
pointer.tap = function () {
return console.log("The pointer was tapped");
};


//let scale = scaleToWindow(renderer.view);

//Set the initial game state
//	var state = animate;

	//Define variables that might be used in more than one function
	var tablero
	//	, num01, num02, num03, id;

	//	pruebo armar un array con los numeros
	var num, cImagen, aNumeros = [];
	//	grilla para posiciones de detencion fijas
	var	grid = [200,200];
	//	var t = new Tink(PIXI, renderer.view);


	//load a JSON file and run the `setup` function when it's done 
	loader
	  .add("images/sumadotileset.json")
	  .load(setup);
 

function setup() {

	//////////////////////////////////////////
	//	aqui comienza el uso de librería tink
	//////////////////////////////////////////
	//	t = new Tink(PIXI, renderer.view);

	//	1. Access the `TextureCache` directly. esto sería el piso
	//	creacion del tablero con metodo 1
	var tableroTexture = TextureCache["tablero.png"];
	tablero = new Sprite(tableroTexture);
	tablero.x = 54;
	tablero.y = 54;
	// make it a bit bigger, so it's easier to grab
	tablero.scale.set(1.18);
	stage.addChild(tablero);


	for (var i = 0; i < 10; i++)
	{

		cImagen = "num0" + i + ".png";
		numTexture = TextureCache[cImagen];
		num = new Sprite(numTexture);

		//	Test 
		//	console.log( "Imagen creada: " + cImagen );
		
		// enable the bunny to be interactive... this will allow it to respond to mouse and touch events
		num.interactive = true;

		// this button mode will mean the hand cursor appears when you roll over the num with your mouse
		num.buttonMode = true;

		// center the num's anchor point
		num.anchor.set(0.5);

		// make it a bit bigger, so it's easier to grab
		num.scale.set(1.0);


		// setup events
		num
			// events for drag start
			//	.on('mousedown', onDragStart)
			.on('mousedown', pointer.press())
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

		// add it to the stage
		stage.addChild(num);
		
		//	para hacerlo draggable (con la libreria)
		//	num.draggable();

		aNumeros[i] = num;

	}

	//	para hacer draggable los numeros
	t.makeDraggable(aNumeros[0], aNumeros[1],aNumeros[2],aNumeros[3],aNumeros[4] );

	////////////////////////////////////////////////////
	//	colocamos las sumas de los poligonos en posición
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

}


//	requestAnimationFrame(animate);
animate();


// este seria el loop del juego (game loop)
function animate() {

	//	Loop this function 60 times per second
    requestAnimationFrame(animate);

	//border around the canvas 
	//	renderer.view.style.border = "5px  green";

	//To change the background color
	//	renderer.backgroundColor = 0xcceeff;

	//Set the canvas's border style and background color
	renderer.view.style.border = "1px dashed green";
	renderer.backgroundColor = "0xFFFFFF";

	//Run the current state
	//	state();

	//Update Tink
	t.update();

	//	if (pointer.press)
	//	{
	//		console.log("The pointer was pressed, izquierdo");
	//	}
	//	
	//	if (pointer.release)
	//	{
	//		console.log("The pointer was released, izquierdo suelto");
	//	}
	//	
	//	if (pointer.tap)
	//	{
	//		console.log("The pointer was tapped, derecho");
	//	}
	

	//	pointer.press = () => console.log("The pointer was pressed, izquierdo");
	//	pointer.release = () => console.log("The pointer was released");
	//	pointer.tap = () => console.log("The pointer was tapped, derecho");


    // render the stage
    renderer.render(stage);
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
