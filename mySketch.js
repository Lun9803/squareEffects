// Assignment 3 DECO1012
// FROM Bolun Li   unikey: boli7059

let windowSize = [1440, 960];
let squares = [];

function setup() {
	angleMode(DEGREES);
	rectMode(CENTER)
	createCanvas(windowSize[0], windowSize[1]);
	strokeWeight(0.5);
}

function draw() {
	background(255);
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
}

// square class

function squareObj(x, y, rotation, fillColor, storkeColor){
	
	// dimensions & positions of the rectangle
	this.x = x;
	this.y = y;
	this.w = random(130, 200);
	this.h = random(60, 130)

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
				tempRotation = this.rotation + 90*(1-(existTime-3000)/500)
			}else{
				tempRotation = this.rotation - 90*(1-(existTime-3000)/500)
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
	for(let i=0; i<4; i++){
		// create square group
		let fillColor = color(`hsba(${mainColor}, 100%, ${100-i*5}%, 0.2)`);
		// rects does not have exact same center, add randomness
		let randomX = x+random(-30, 30);
		let randomY = y+(random(-30, 30));
		squares.push(new squareObj(randomX, randomY, rotation, fillColor, strokeColor));
	}
}

function mouseClicked(){
	createSquares(mouseX, mouseY);
}


