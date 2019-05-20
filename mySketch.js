// Assignment 3 DECO1012
// FROM Bolun Li   unikey: boli7059

let windowSize = [900, 700];
let squares = [];

let UIBlock;
let numSlider;
let showSliderNum;
let colorPicker;
let transparencySlider;
let sizeSlider;

// setup user interface
function setupUI(){
	UIBlock = createDiv();
	UIBlock.style("display", "block");
	UIBlock.style("margin", "5px 0");
	UIBlock.style("height", "50px");

	// numSlider changes the number of rects in a rect group 
	let numSelection = createDiv();
	numSelection.parent(UIBlock);
	numSelection.style("display", "inline-block");

	createDiv("Number of squares").parent(numSelection);
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
	colorPicker = createColorPicker("black");
	colorPicker.parent(colorSelection);
	colorPicker.style("display", "block");
	colorPicker.style("margin", "0 auto");

	// transparency slider changes transparency of the rects
	let transSelection = createDiv();
	transSelection.parent(UIBlock);
	transSelection.style("display", "inline-block");
	transSelection.style("margin-left", "30px");

	let transDiv = createDiv("Transparency");
	transDiv.parent(transSelection);
	transDiv.style("margin-left", "20px");

	transparencySlider = createSlider(0, 1, 0.8, 0.1);
	transparencySlider.parent(transSelection);

	showTransNum = createSpan(transparencySlider.value());
	showTransNum.parent(transSelection);
	showTransNum.style("margin-left", "5px");

	// size slider changes size of the rects
	let sizeBlock = createDiv();
	sizeBlock.parent(UIBlock);
	sizeBlock.style("display", "inline-block");
	sizeBlock.style("margin-left", "30px");

	let sizeDiv = createDiv("Max rect size");
	sizeDiv.parent(sizeBlock);
	sizeDiv.style("margin-left", "20px");

	sizeSlider = createSlider(150, 300, 230, 1);
	sizeSlider.parent(sizeBlock);

	showSizeNum = createSpan(sizeSlider.value());
	showSizeNum.parent(sizeBlock);
	showSizeNum.style("margin-left", "5px");
}


function setup() {
	setupUI();
	angleMode(DEGREES);
	rectMode(CENTER)
	createCanvas(windowSize[0], windowSize[1]);
	strokeWeight(0.5);

	// set the onclick function to the canvas so it only works when click inside the panel
	let canvas = document.getElementsByTagName("canvas")[0];
	canvas.onclick = function(){createSquares(mouseX, mouseY);}
}

function draw() {
	background(colorPicker.color());
	let i = 0;
    while(i<squares.length){
		if(!squares[i].checkExpire()){
			squares[i].render();
			i++;
		}
		// if a square expires, delete it from array
		else{
			squares.splice(i, 1);
		}
	}

	showSliderNum.html(numSlider.value());
	showTransNum.html(transparencySlider.value());
	showSizeNum.html(sizeSlider.value());
}

// square class

function squareObj(x, y, rotation, fillColor, storkeColor){
	
	// dimensions & positions of the rectangle
	this.x = x;
	this.y = y;
	this.w = random(sizeSlider.value()-90, sizeSlider.value());
	this.h = random(sizeSlider.value()-140, sizeSlider.value()-90);

	// wether the rect rotate clockwise when created
	this.clockWise = random([true, false]);

	// rotation of the rectangle
	this.rotation = rotation+90*parseInt(random(4));

	// color of the rectangle
	this.fillColor = fillColor;
	this.strokeColor = storkeColor;

	// the time that the rect is created
	this.startTime = new Date();

	// checks if the square expires and needs to be removed
	this.checkExpire = function(){
		// expires after 4 seconds
		return new Date() - this.startTime>3500;
	}

	this.render = function(){
		// the time count after the rect is created
		let existTime = new Date() - this.startTime;
		let tempRotation = this.rotation;
		let tempW = this.w;
		let tempH = this.h;
		// do a enter animate
		if(existTime<300){
			if(this.clockWise){
				tempRotation = this.rotation - 90*(1-existTime/300)
			}else{
				tempRotation = this.rotation + 90*(1-existTime/300)
			}
		}

		// do a leave animate, leave animate lasts for 0.5 seconds
		if(existTime>3000){
			if(this.clockWise){
				tempRotation = this.rotation + 90*(existTime-3000)/500
			}else{
				tempRotation = this.rotation - 90*(existTime-3000)/500
			}
			tempW = this.w * (1-(existTime-3000)/500);
			tempH = this.h * (1-(existTime-3000)/500);
		}

		push();
		
		fill(this.fillColor);
		stroke(this.strokeColor);
		translate(this.x, this.y);
		rotate(tempRotation);
		rect(0, 0, tempW, tempH);
		
		pop();
	}
}


// given a coordinator, randomly draw the squares

function createSquares(x, y){
	// get a random color & rotation for the squre group 
	let mainColor = parseInt(random(360));
	let rotation = random(90);
	let strokeColor = color(`hsb(${mainColor}, 50%, 100%)`);
	for(let i=0; i<numSlider.value(); i++){
		// create square group
		let fillColor = color(`hsba(${mainColor}, 100%, ${100-i*5}%, ${1-transparencySlider.value()})`);
		// rects does not have exact same center, add randomness
		let randomX = x+random(-30, 30);
		let randomY = y+(random(-30, 30));
		squares.push(new squareObj(randomX, randomY, rotation, fillColor, strokeColor));
	}
}

