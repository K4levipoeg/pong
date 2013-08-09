//BEGIN LIBRARY CODE

var x = 145;
var y = 580;
var dy = 0;
var dx = 0;
var canvas;
var paddlex;
var paddleh = 10;       //Paddle-i kõrgus
var	paddlew = 70;       //Paddle-i laius
var rightDown = false;
var leftDown = false;
var inervalId = 0;
var bricks;
var nRows = 5;
var nCols = 5;
var brickWidth;
var brickHeight = 15;
var padding = 1;
var ballr = 10;
var rowColors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"]
var paddleColor = "green";
var ballColor = "black";
var backColor = "#00000";
var rand;
var brickCounter = 0;
var onHold = true;

function init(){
	canvas = $('#canvas')[0].getContext('2d');
	width = $('canvas').width();
	height = $('canvas').height();
	paddlex = width / 4;
	brickWidth = (width/nCols) - 1;
	intervalId = setInterval(draw, 8);
}

function initbricks(){

	bricks = new Array(nRows);
	for(i = 0; i < nRows; i++){
		bricks[i] = new Array(nCols)
		for(j = 0; j < nCols; j++){
			bricks[i][j] = 1;
		}
	}

	rand = Math.floor(nRows * nCols/8);

	for(i = 0; i < rand; i++){

		var x;
		var y;

		x = Math.floor((Math.random()*4)+1);
		y = Math.floor((Math.random()*4)+1);

		if(i == 0 && bricks[x][y] !== 3 && bricks[x][y] !== 4){
			bricks[x][y] = 2;
		}else if(i == 0 && bricks[x][y] !== 2 && bricks[x][y] !== 4){
			bricks[x][y] = 3;
		}else if(i == 0 && bricks[x][y] !== 2 && bricks[x][y] !== 3){
			bricks[x][y] = 4;
		}
	}

}

function drawBricks(){
	for(i = 0; i < nRows; i++){
		canvas.fillStyle = rowColors[i];
		for (j = 0; j < nCols; j++){
			
			//if(bricks[i][j] == 1 || bricks[i][j] == 2 ){
			if(bricks[i][j] !== 0){
				rect((j * (brickWidth + padding)) + padding, 
					 (i * (brickHeight + padding)) + padding,
					 brickWidth, brickHeight);
			}
		}
	}
}

function circle(x,y,r){
	canvas.beginPath();
	canvas.arc(x, y, r, 0, Math.PI*2, true);
	canvas.closePath();
	canvas.fill();
}

function rect(x,y,w,h){
	canvas.beginPath();
	canvas.rect(x, y, w, h);
	canvas.closePath();
	canvas.fill();
}

function clear(){
	canvas.clearRect(0, 0, width, height);
}

function onKeyDown(evt){
	if(evt.keyCode == 39 && onHold == false){
		rightDown = true;
	}else if(evt.keyCode == 37 && onHold == false){
		leftDown = true;
	}else if(evt.keyCode == 32 && onHold == true){
		dy = -3;
		dx = 1.5;
		onHold = false;
	}
}

function onKeyUp(evt){
	if(evt.keyCode == 39 && onHold == false){
		rightDown = false;
	}else if(evt.keyCode == 37 && onHold == false){
		leftDown = false;
	}
}

function restart(){
	$('#score').text(0);
	brickCounter = 0;
	initbricks();
	x = width/2;
	y = height-20;
	dy = 0;
	dx = 0;
	paddlew = 75;
	paddlex = width/2 - paddlew/2;
	onHold = true;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function paus(){
	alert("Jätkamiseks vajuta OK")
}

//END LIBRARY CODE

function draw(){
	console.log();
	canvas.fillStyle = backColor;
	clear();
	canvas.fillStyle = ballColor;
	circle(x, y, ballr);

	//Brick-ga põrge + boonuse määramine(0 = brick false; 1 = brick true; 2 = special brick)
	rowHeight = brickHeight + padding;
	colWidth = brickWidth + padding;
	row = Math.floor(y/rowHeight);
	col = Math.floor(x/colWidth);
	if(y < nRows * rowHeight && row >= 0 && col >=0 && bricks[row][col] == 1){
		dy = -dy;
		bricks[row][col] = 0;
		brickCounter++;
		$('#score').text(brickCounter);
	}else if(y < nRows * rowHeight && row >= 0 && col >=0 && bricks[row][col] == 2){
		dy = -dy;
		bricks[row][col] = 0;
		paddlew = 100;
		paddleColor = "red";
		brickCounter++;
		$('#score').text(brickCounter);
	}else if(y < nRows * rowHeight && row >= 0 && col >=0 && bricks[row][col] == 3){
		dy = -dy;
		bricks[row][col] = 0;
		paddlew = 40;
		paddleColor = "black";
		brickCounter++;
		$('#score').text(brickCounter);

	}else if(y < nRows * rowHeight && row >= 0 && col >=0 && bricks[row][col] == 4){
		dy = -dy;
		bricks[row][col] = 0;
		intervalId = setInterval(draw, 50);
		paddleColor = "orange";
		brickCounter++;
		$('#score').text(brickCounter);

	}

	if(brickCounter == 25){
		restart();
		alert("Tubli!");
	}

	//Paddle-i liigutamine
	if(rightDown && paddlex < width-paddlew){
		paddlex += 5;
	}else if(leftDown && paddlex > 0){
		paddlex -= 5;
	}
	canvas.fillStyle = paddleColor;
	rect(paddlex, height-paddleh, paddlew, paddleh)

	drawBricks();

	//Palli põrkamine
	if (x + dx + ballr > width || x + dx - ballr < 0){
    	dx = -dx;
    }
  	if (y + dy - ballr< 0){
    	dy = -dy;

  	}

  	//Paddle-ile põrkamine
    else if(y + dy + ballr > height - paddleh){
    	if (x > paddlex && x < paddlex + paddlew){
    		dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
    		dy = -dy
    	}else if(y + dy + ballr > height){
    		//clearInterval(intervalId);
			restart()
			alert("Ai ai ai..");
    	}
    }

    //Palli liikumine
	x += dx;
	y += dy;

}




