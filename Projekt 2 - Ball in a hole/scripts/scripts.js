let winW, winH;
let ball;
let ballChangeVector;
let holes;
let numberOfHoles = 4;
let movementTimer;
let counter = 0;
let timer;
let timerset = false;



////////////////////////////////przyciski:
function startGame(){	
	initialization();

	window.addEventListener('resize', initialization, false);

//	window.addEventListener('deviceorientation', onDeviceOrientationChange);
	window.addEventListener('deviceorientation', this.onDeviceOrientationChange.bind(this));

	
	startCounting()
	movementTimer = setInterval( function(){moveBallAndRenderBallAndHoles()}, 10); 
}	

function continueGame(){
	if(timerset){
			clearInterval(timer);
	}
	timer = setInterval(function(){myTimer()},1000);
	timerset = true;
}

function pauseGame(){
	clearInterval(timer);
}


/////////////////////////////////rysowanie kulek

function renderBall() {
	let surface = document.getElementById('surface');
	let context = surface.getContext('2d');
	
	context.beginPath();
	context.clearRect(0, 0, surface.width, surface.height);
	context.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI, false);
	context.fillStyle = ball.color;
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = ball.color;
	context.stroke();
} 


function renderHoles() {
	let holesSurface = document.getElementById('surface');
	let context = holesSurface.getContext('2d');
	
	for(let i=1; i<=numberOfHoles; i++){
		context.beginPath();
		context.arc(holes[i].x, holes[i].y, holes[i].r, 0, 2 * Math.PI, false);
		context.fillStyle = holes[i].color;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = holes[i].color;
		context.stroke();		
	}
} 


//czas start!
function startCounting(){
        document.getElementById("myTxt").value = 0;
        if(timerset){
                clearInterval(timer);
        }
        counter = 0;
        timer = setInterval(function(){myTimer()},1000);
        timerset = true;
}

////////////////////////////////////////////////////
//inicjalizacja Layoutu
function initialization() {
	let surface = document.getElementById('surface');

	winW = surface.width = window.innerWidth;
	winH = surface.height = window.innerHeight*0.85;
	let rozmiarKul = Math.max(2,Math.min(winW,winH)/16);

	ball = {	
		r:rozmiarKul,
		x:rozmiarKul,
		y:rozmiarKul,
		color:'rgba(0, 0, 0, 0.8)'//black
	};
	ballChangeVector = {
		x:0,
		y:0
	}

	if(numberOfHoles<=0)
		finishWin();
	holes = [numberOfHoles+1];

	holes[1] = {
		r:rozmiarKul,
		x:winW-rozmiarKul,
		y:winH-rozmiarKul,
		color:'rgba(255, 0, 0, 0.8)'//red
	};
	for(let i=2; i<=numberOfHoles; i++)
		do{
			let xRandom = rozmiarKul + Math.floor(Math.random() * (winW-2*rozmiarKul))
			let yRandom = rozmiarKul + Math.floor(Math.random() * (winH-2*rozmiarKul))
			holes[i] = {
				r:rozmiarKul,
				x:xRandom,
				y:yRandom,
				color:'rgba(255, 0, 0, 0.8)'//red
			}
		}while(doesIntersectWithOthers(i))

	if( Math.random() * numberOfHoles <=1){
		let temp = holes[numberOfHoles];
		holes[numberOfHoles] = holes[1];
		holes[1] = temp;
	}


	holes[numberOfHoles].color = 'rgba(0, 0, 255, 0.8)';//blue
	//do ostatniej musimy trafic
	
}

function doesIntersectWithOthers(actual){
	if(doesTheyIntersect(ball.x,holes[actual].x,ball.y,holes[actual].y,ball.r))
		return true;

	for(let i =1; i<actual; i++)
		if(doesTheyIntersect(holes[i].x,holes[actual].x,holes[i].y,holes[actual].y,ball.r))
			return true;	

	return false;
}



// Does the gyroscope or accelerometer actually work?
	
function onDeviceOrientationChange(event) {
	let xDelta, yDelta;
	switch (window.orientation) {
		case 0: // portrait - normal
			xDelta = event.gamma;
			yDelta = event.beta;
			break;
		case 180: // portrait - upside down
			xDelta = event.gamma * -1;
			yDelta = event.beta * -1;
			break;
		case 90: // landscape - bottom right
			xDelta = event.beta;
			yDelta = event.gamma * -1;
			break;
		case -90: // landscape - bottom left
			xDelta = event.beta * -1;
			yDelta = event.gamma;
			break;
		default:
			xDelta = event.gamma;
			yDelta = event.beta;
	}

	ballChangeVector.x = xDelta/16;
	ballChangeVector.y = yDelta/16;
}

function moveBallAndRenderBallAndHoles() {
	if(!timerset)//pauza
		return;


	//zeby nie wyjechac poza obrzeza:
	ball.x = Math.max(ball.r, Math.min(winW - ball.r, ball.x+ballChangeVector.x));
	ball.y = Math.max(ball.r, Math.min(winH - ball.r, ball.y+ballChangeVector.y));


	while( numberOfHoles > 0 && 
		doesTheyIntersect(	ball.x,holes[numberOfHoles].x,
							ball.y,holes[numberOfHoles].y,ball.r))
			holes[--numberOfHoles].color = 'rgba(0, 0, 255, 0.8)';//blue

		

	if( numberOfHoles <= 0)
		finishWin();

	for(let i=1; i<=numberOfHoles; i++)
		if(doesTheyIntersect(ball.x,holes[i].x,ball.y,holes[i].y,ball.r))
			finishLose();


	
	renderBall();
	renderHoles();
}

function doesTheyIntersect(x1,x2,y1,y2,r){
	//czy sie udalo?
	if ((x1 < (x2 + (r / 2))) && 
		(x1 > (x2 - (r / 2)))	&& 
		(y1 < (y2 + (r / 2))) && 
		(y1 > (y2 - (r / 2)))) 
		return true;

	return false;
}


function myTimer(){
        counter++;
        document.getElementById("myTxt").value = counter;
}


// WIN / LOST
function finishWin() {
		let result = document.getElementById("myTxt").value;
        let canvas = document.getElementById("surface");
        let context = canvas.getContext("2d");
        message = "You win!\n\n" + " Game time of " + result + "seconds";
        alert(message);
        location.reload(true);
}

function finishLose() {
	let result = document.getElementById("myTxt").value;
	let canvas = document.getElementById("surface");
	let context = canvas.getContext("2d");
	message = "You lost!\n\n" + " Game time of " + result + "seconds";
	alert(message);
	location.reload(true);
}

