

$(document).ready(onReady)

$(window).resize(onResize)
window.onorientationchange = onResize;

window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }
isMobile = window.mobilecheck();

var renderer = PIXI.autoDetectRenderer(1024, 690);
document.body.appendChild(renderer.view);

//var help = document.getElementById("help");

var interactiveManager = new Interactive();
var stage = new PIXI.Stage(0x987db3, true);
//stage.interactive = true;

var mouse = new PIXI.Point();
var touches = [];

var ratio = new PIXI.Point();

var simpleApp = new SimpleApp(stage);

var loadingScreen = new LoadingScreen();
var titleScreen;
var gameScreen;// = new GAME.Game();

var startup	= new Startup();

var highScores = new GAME.Highscores();

var music = document.getElementById('music');
music.playing = true;

PIXI.Texture.addTextureToCache(PIXI.Texture.fromImage("img/sound_OFF.png"));
PIXI.Texture.addTextureToCache(PIXI.Texture.fromImage("img/sound_ON.png"));

flip = PIXI.Sprite.fromImage("img/playLandscape.png")
flip.anchor.x = flip.anchor.y = 0.5;
flipBg = PIXI.Sprite.fromImage("img/BG_col_submit.png");	
var muteButton = PIXI.Sprite.fromImage("img/sound_ON.png");
muteButton.position.x = 11;
muteButton.position.y = 11;
muteButton.hitScale = 1;
muteButton.setInteractive(true);
muteButton.visible = false;

stage.addChild(muteButton);

var isLandscape = false;
var doRender = true;

muteButton.mousedown = muteButton.touchstart = function(mouse)
{
	//alert("!")
	if(music.playing)
	{
		this.setTexture(PIXI.TextureCache["img/sound_OFF.png"])
		music.playing = false;
		music.pause();
	}	
	else
	{
		this.setTexture(PIXI.TextureCache["img/sound_ON.png"])
		music.playing = true;
		music.play();
	}
}

function onReady()
{
	init();
	
}


function init()
{
	startup.run();
	//simpleApp.gotoScreen(loadingScreen);
	/*
	renderer.view.addEventListener('mousemove', onMouseMove);
	renderer.view.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mouseup', onMouseUp);
	
	renderer.view.addEventListener("touchstart", onTouchStart, true);
	renderer.view.addEventListener("touchend", onTouchEnd, true);
	renderer.view.addEventListener("touchmove", onTouchMove, true);
	*/
	
	//renderer.view.addEventListener('touchmove', onMouseMove);
	//renderer.view.addEventListener('touchbegin', onTouchBegin);
//	renderer.view.addEventListener('touchend', onTouchEnd);
//	renderer.view.addEventListener('touchend', onMouseDown);
//	document.addEventListener('mouseup', onMouseUp);
	
	requestAnimFrame(update);	
	
	onResize();
}


function update()
{
	if(simpleApp.currentScreen == gameScreen && !isLandscape)gameScreen.update();
	renderer.render(stage);

	if(!doRender)return;
	requestAnimFrame(update);	
}

function startRender()
{
	if(doRender)return;
	doRender = true;	
	requestAnimFrame(update);	
}

// TOUCHY TOUCH!
function onTouchMove(event)
{
	event.preventDefault();
	var rect = renderer.view.getBoundingClientRect();
	mouse.x = (event.touches[0].clientX - rect.left) / ratio.x;
	mouse.y = (event.touches[0].clientY - rect.top) / ratio.y;
}

function onTouchStart(event)
{
	event.preventDefault();
	/*
	var st = " > ";
	
	touches =  event.touches;
	


	for (var i=0; i < touches.length; i++) 
	{
		
		var touch =
		st += touch.identifier + " ";
		 
		//help.inn
		touches[i].x = (touches[i].clientX - rect.left) * ratio.x;
		touches[i].y = (touches[i].clientY - rect.top) * ratio.y;
	
	}
	
	*/
	var rect = renderer.view.getBoundingClientRect();
//	help.innerHTML = "st";
	mouse.x = (event.touches[0].clientX - rect.left) / ratio.x;
	mouse.y = (event.touches[0].clientY - rect.top) / ratio.y;
	
	interactiveManager.mousedown();
}

function onTouchEnd(event)
{
	//help.innerHTML = "UP";
	event.preventDefault();
	interactiveManager.mouseup();
}

// MOUSE MOUE!
function onMouseMove(event)
{
	event.preventDefault();
	
	 var rect = renderer.view.getBoundingClientRect();
	 mouse.x = (event.clientX - rect.left) / ratio.x;
	 mouse.y = (event.clientY - rect.top) / ratio.y;
}

function onMouseDown(event)
{
	event.preventDefault();
	//alert("!")
	
//	if(gameScreen)gameScreen.hand.tap();
	interactiveManager.mousedown();
}

function onMouseUp(event)
{
	
	event.preventDefault();
	interactiveManager.mouseup();
}

function onResize()
{
	var w = $(window).width(); 
	var h = $(window).height(); 
	
	ratio.x = w/1024;
	ratio.y = h/690;
	
	var ratioValue = ratio.x < ratio.y ? ratio.x : ratio.y;
	
	ratio.x = ratioValue;
	ratio.y = ratioValue;
	
	renderer.view.style.width = w + "px"//ratioValue * 1024 + "px";
	renderer.view.style.height = h +"px"//ratioValue * 690 + "px";
	
//	if(gameScreen)gameScreen.resize(1024, 690);
	
	simpleApp.resize(1024, 690);
	
	flip.scale.x = 1/ ( w/1024);
	flip.scale.y = 1/ (h/690);
	
	flip.position.x = 1024/2;
	flip.position.y = 690/2;
	
	flipBg.scale.x = 1024/50;
	flipBg.scale.y = 690/50;
	
	var tempLandscape = (h > w)
	
	if(tempLandscape != isLandscape)
	{
		isLandscape = tempLandscape;
		
		if(!isLandscape) 
		{
			stage.removeChild(flipBg);
			stage.removeChild(flip);
		//	simpleApp.currentScreen.visible = true;
		//	startRender();
		}
		else
		{
		//	simpleApp.currentScreen.visible = false;
			stage.addChild(flipBg);
			stage.addChild(flip);
		//	doRender = false;
		}
	}
}

mat3.inverse = function (mat, dest) {
	
	/*
	 *
	
	0, 1, 2
	3, 4, 5
	6, 7, 8
	
	a, c, tx,
	b, d, ty,
	u, v, w
	
	this.localTransform[0] = this._cr * this.scale.x;
	this.localTransform[1] = -this._sr * this.scale.y
	this.localTransform[3] = this._sr * this.scale.x;
	this.localTransform[4] = this._cr * this.scale.y;
	
	///AAARR GETTER SETTTER!
	
	this.localTransform[2] = this.position.x;
	this.localTransform[5] = this.position.y;
	*/
        var a00 = mat[0], a01 = mat[1], a02 = mat[2],
            a10 = mat[3], a11 = mat[4], a12 = mat[5],

            d = a00 * a11 + a01 * -a10,
            
            id = 1 / d;

        dest[0] = a11 * id;
        dest[1] = -a01 * id;
        dest[2] = (a12 * a01 - a02 * a11) * id;
        dest[3] = -a10 * id;
        dest[4] = a00 * id;
        dest[5] = (-a12 * a00 + a02 * a10) * id;
        dest[6] = 0
        dest[7] = 0
        dest[8] = 1
        return dest;
        
       
    };
    
// OVERWRITE!
PIXI.InteractionManager.prototype.hitTest = function(interactionData, displayObject)
{
	if(this.dirty)
	{
		this.dirty = false;
		this.interactiveItems = [];
		// go through and collect all the objects that are interactive..
		this.collectInteractiveSprite(this.stage);
	}
	
	var tempPoint = this.tempPoint;
	var tempMatrix = this.tempMatrix;
	var global = interactionData.global;
	
	var length = this.interactiveItems.length;
	
	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];
		if(!item.visible)continue;
		
		var worldTransform = item.worldTransform;
		
		// THIS WAS 
	//	mat3.inverse(item.worldTransform, tempMatrix);
		
		var a00 = worldTransform[0], a01 = worldTransform[1], a02 = worldTransform[2],
            a10 = worldTransform[3], a11 = worldTransform[4], a12 = worldTransform[5],
            id = 1 / (a00 * a11 + a01 * -a10);
		
		tempPoint.x = a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id; 
		tempPoint.y = a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id;
		
		var modWidth = item.width * item.hitScale;
		
		var diffX =  modWidth - item.width ;
		
		var x1 = (-item.width * item.anchor.x) - diffX * 0.5;
		
		if(tempPoint.x > x1 && tempPoint.x < x1 + modWidth)
		{
			var modHeight = item.height * item.hitScale;
			var diffY =  modHeight - item.height;
			var y1 = (-item.height * item.anchor.y) - diffY * 0.5;
		
			
			if(tempPoint.y > y1 && tempPoint.y < y1 + modHeight)
			{
				// hit!
				return item;
			}
		}
	}
	
	return null;	
}
//document.ontouchstart = function(e){ 
 //   event.preventDefault(); 
//}
