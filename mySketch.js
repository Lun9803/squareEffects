// Assignment 3 DECO1012
// FROM Bolun Li   unikey: boli7059

let windowSize = [900, 700];
let shapes = [];
let stars = [];

let UIBlock;
let numSlider;
let showSliderNum;
let backColourPicker;
let transparencySlider;
let sizeSlider;
let starColourPicker;
// check boxes
let rectCheck;
let triangleCheck;
let circleCheck;

let mic;

// setup user interface
function setupUI(){
	document.getElementsByTagName("body")[0].setAttribute("style", "min-width:1600px");

	UIBlock = createDiv();
	UIBlock.style("display", "block");
	UIBlock.style("margin", "15px 0 20px");
	UIBlock.style("height", "50px");

	// numSlider changes the number of rects in a rect group 
	let numSelection = createDiv();
	numSelection.parent(UIBlock);
	numSelection.style("display", "inline-block");

	createDiv("Number of particles").parent(numSelection);
	numSlider = createSlider(1, 10, 5, 1);
	numSlider.parent(numSelection);
	showSliderNum = createSpan(numSlider.value());
	showSliderNum.parent(numSelection);
	showSliderNum.style("margin-left", "5px");

	// color picker changes the background color
	let colorSelection = createDiv();
	colorSelection.parent(UIBlock);
	colorSelection.style("display", "inline-block");
	colorSelection.style("margin-left", "30px");

	createDiv("Background colour").parent(colorSelection);
	backColourPicker = createColorPicker("black");
	backColourPicker.parent(colorSelection);
	backColourPicker.style("display", "block");
	backColourPicker.style("margin", "0 auto");

	// star colour picker changes the star colour
	let starColour = createDiv();
	starColour.parent(UIBlock);
	starColour.style("display", "inline-block");
	starColour.style("margin-left", "30px");

	createDiv("Star colour").parent(starColour);
	starColourPicker = createColorPicker("white");
	starColourPicker.parent(starColour);
	starColourPicker.style("display", "block");
	starColourPicker.style("margin", "0 auto");


	// transparency slider changes transparency of the rects
	let transSelection = createDiv();
	transSelection.parent(UIBlock);
	transSelection.style("display", "inline-block");
	transSelection.style("margin-left", "30px");

	let transDiv = createDiv("Transparency");
	transDiv.parent(transSelection);
	transDiv.style("margin-left", "20px");

	transparencySlider = createSlider(0.5, 1, 0.8, 0.1);
	transparencySlider.parent(transSelection);

	showTransNum = createSpan(transparencySlider.value());
	showTransNum.parent(transSelection);
	showTransNum.style("margin-left", "5px");

	// size slider changes size of the rects
	let sizeBlock = createDiv();
	sizeBlock.parent(UIBlock);
	sizeBlock.style("display", "inline-block");
	sizeBlock.style("margin-left", "30px");

	let sizeDiv = createDiv("Max shape size");
	sizeDiv.parent(sizeBlock);
	sizeDiv.style("margin-left", "20px");

	sizeSlider = createSlider(100, 200, 120, 1);
	sizeSlider.parent(sizeBlock);

	showSizeNum = createSpan(sizeSlider.value());
	showSizeNum.parent(sizeBlock);
	showSizeNum.style("margin-left", "5px");

	// checkboxes 
	let checkBlock = createDiv();
	checkBlock.parent(UIBlock);
	checkBlock.style("display", "inline-block");
	checkBlock.style("margin-left", "100px");
	checkBlock.style("vertical-align", "top");

	createDiv("Select shapes to be generated").parent(checkBlock);
	rectCheck = createCheckbox("rectangle", true);
	rectCheck.parent(checkBlock);
	triangleCheck = createCheckbox("triangle", false);
	triangleCheck.parent(checkBlock);
	circleCheck = createCheckbox("circle", false);
	circleCheck.parent(checkBlock);

	// display message
	let message = createDiv("Make noise to get more stars!");
	message.style("float", "right");
	message.style("margin", "300px 300px 0 0");
	message.style("font-size", "20px");
}


function setup() {
	setupUI();
	angleMode(DEGREES);
	rectMode(CENTER)
	createCanvas(windowSize[0], windowSize[1]);
	strokeWeight(0.5);

	// set the onclick function to the canvas so it only works when click inside the panel
	let canvas = document.getElementsByTagName("canvas")[0];
	canvas.onclick = function(){createShapes(mouseX, mouseY);}

	// setup microphone
	mic = new p5.AudioIn();
	// Turns on the mic
  mic.start();
}

// this function fixed a bug where the audio won't start in chrome
function touchStarted(){
	getAudioContext().resume();
}


function draw() {

	background(backColourPicker.color());

	let starNum = mic.getLevel()*50;
	
	for(let i=0; i<starNum; i++){
		stars.push(new star(random(windowSize[0]), random(windowSize[1])));
	}

	let i = 0;
  	while(i<stars.length){
		if(!stars[i].checkExpire()){
			stars[i].render();
			i++;
		}
		// if a square expires, delete it from array
		else{
			stars.splice(i, 1);
		}
	}

	i = 0;
  	while(i<shapes.length){
		if(!shapes[i].checkExpire()){
			shapes[i].render();
			i++;
		}
		// if a square expires, delete it from array
		else{
			shapes.splice(i, 1);
		}
	}

	showSliderNum.html(numSlider.value());
	showTransNum.html(transparencySlider.value());
	showSizeNum.html(sizeSlider.value());
}


// draw triangles 

function drawTriangle(w){
	triangle(0, -w/2, -w/3, w/4, w/3, w/4);
}


// star function

function star(x, y){
	// positions of the star
	this.x = x;
	this.y = y;
	// colour of the star
	this.fillColor = starColourPicker.color();
	// size of the star
	this.size = random(1, 3);
	// start time of the star
	this.startTime = new Date();

	this.checkExpire = function(){
		// expires after 4 seconds
		return new Date() - this.startTime > 1000;
	}

	this.render = function(){
		// the time count after the shape is created
		let existTime = new Date() - this.startTime;

		let tempW = this.size;
		// do a enter animate
		if(existTime<300){
			tempW = this.size * (1-(1-existTime/300));
		}

		// do a leave animate, leave animate lasts for 0.5 seconds
		if(existTime>700){
			tempW = this.size * (1-(existTime-700)/300);
		}
		noStroke();
		fill(this.fillColor);
		circle(this.x, this.y, tempW);
	}
}


// shape class

function particle(x, y, rotation, fillColor, storkeColor, shape){
	
	// positions of the shape
	this.x = x;
	this.y = y;

	// type of the shape & dimension of the shape
	this.shape = shape;
	switch(shape){
		case "rectangle":
			this.w = random(20, sizeSlider.value());
			this.hRatio = random(1, 4); 
			break;
		case "triangle":
			this.w = random(20, sizeSlider.value());
			break;
		case "circle":
			this.w = random(20, sizeSlider.value());
			break;
		default:
			break;
	}

	// wether the rect rotate clockwise when created
	this.clockWise = random([true, false]);

	// rotation of the shape
	this.rotation = rotation+90*parseInt(random(4));

	// color of the shape
	this.fillColor = fillColor;
	this.strokeColor = storkeColor;

	// the time that the shape is created
	this.startTime = new Date();

	// whether the shape is going to be destroyed
	this.destroy = false;
	this.startDestroyTime = undefined;

	// checks if the shape expires and needs to be removed
	this.checkExpire = function(){
		// expires after 4 seconds
		return new Date() - this.startTime > 1500;
	}

	this.startDestroy = function(){
		if(this.destroy)return;
		this.startDestroyTime = new Date();
		this.destroy = true;
	}

	this.render = function(){

		// the time count after the shape is created
		let existTime = new Date() - this.startTime;

		let tempW = this.w;
		let tempRotation = this.rotation;
		// do a enter animate
		if(existTime<300){
			if(this.clockWise){
				tempRotation = this.rotation - 90*(1-existTime/300)
			}else{
				tempRotation = this.rotation + 90*(1-existTime/300)
			}
			tempW = this.w * (1-(1-existTime/300));
		}

		// do a leave animate, leave animate lasts for 0.5 seconds
		if(existTime>1000){
			if(this.clockWise){
				tempRotation = this.rotation - 90*(existTime-1000)/500
			}else{
				tempRotation = this.rotation + 90*(existTime-1000)/500
			}
			tempW = this.w * (1-(existTime-1000)/500);
		}

		push();
		fill(this.fillColor);
		stroke(this.strokeColor);
		translate(this.x, this.y);
		rotate(tempRotation);

		switch(this.shape){
			case "rectangle":
				let tempH = this.w/this.hRatio;
				rect(0, 0, tempW, tempH);
				break;
			case "triangle":
				drawTriangle(tempW/1.5);
				break;
			case "circle":
				circle(0, 0, tempW/2.5);
				break;
			default:
				break;
		}
		
		pop();
	}
}


// given a coordinator, randomly draw the shapes

function createShapes(x, y){
	// get a random color & rotation for the squre group 
	let mainColor = parseInt(random(360));
	let rotation = random(90);
	let strokeColor = color(`hsb(${mainColor}, 50%, 100%)`);
	
	let checkedShapes = [];
	if(triangleCheck.checked())checkedShapes.push("triangle");
	if(rectCheck.checked())checkedShapes.push("rectangle");
	if(circleCheck.checked())checkedShapes.push("circle");
	let shape = random(checkedShapes);
	if(checkedShapes.length == 0){
		alert("must select at least one shape!");
		return;
	}
	for(let i=0; i<numSlider.value(); i++){
		// create square group
		let fillColor = color(`hsba(${mainColor}, 100%, ${100-i*5}%, ${1-transparencySlider.value()})`);
		// rects does not have exact same center, add randomness
		let randomX = x+random(-30, 30);
		let randomY = y+(random(-30, 30));
		shapes.push(new particle(randomX, randomY, rotation, fillColor, strokeColor, shape));
	}
}

