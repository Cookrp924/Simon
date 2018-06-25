//var colors = ["red","blue","green","purple"];
var colors = ["#9b0000","#000072","#009b00", "#9b009b"];
var brightColors = ["liteRed", "liteBlue", "liteGreen", "litePurple"];
var pickedColors = [];
var gameColors = [];
var winCount = 3;
var count = 0;
var selectors = document.getElementsByClassName("select");
var start = document.querySelector("button");
var onOff = document.getElementById("onOff");
var difficulty = document.getElementById("difficulty");
var turn = document.getElementById("turn");
var turnCount = 0;

var sound1 = new Audio("http://sep800.mine.nu/files/sounds/buzzer.wav"); //game over
var sound2 = new Audio("http://www.telephonetribute.com/audio/zero.wav"); //button press
var sound3 = new Audio("https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_electronic_beep_01.mp3"); //color sequence
var sound4 = new Audio("https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_trumpet_bugle_03.mp3"); //win game

//turn game on/off
onOff.addEventListener("change", function(){
	if(this.checked){
		for(i = 0; i < selectors.length; i++){
			selectors[i].style.pointerEvents = "auto";
		}
		start.style.pointerEvents = "auto";
		turn.textContent = "--";
		
	}else{
		for(i = 0; i < selectors.length; i++){
			selectors[i].style.pointerEvents = "none";
		}
		start.style.pointerEvents = "none";
		turn.textContent = "";	
	}
})

//easy & hard modes
difficulty.addEventListener("change", function(){
	if(this.checked){
		winCount = 5;
	}else{
		winCount = 3;
	}
})

//new game
start.addEventListener("click", newGame)

//starts or resets the game
function newGame(){
	pickedColors = [];
	gameColors = [];
	turnCount = 0;
	getColor();
}

//game chooses a color
function getColor(){
	pickedColors = [];
	count = 0;
	var random = Math.floor(Math.random()*4);
	var color = colors[random];
	gameColors.push(color);
	//console.log("getting color: " + color);
	//console.log("gameColors: " + gameColors);
	setTimeout(function(){
		colorSequence([0,gameColors.length], 1.1, function(col){
			sound3.play();
			display(col);
		})
		turnCount++;
		turn.textContent = Number(turnCount);
	}, 1000)
}

//display game color sequence
function colorSequence(range, time, callback){
	for(i = 0; i < selectors.length; i++){
		selectors[i].style.pointerEvents = "none";
	}
	var col = range[0];
	callback(col);
	loop();
	function loop(){
		setTimeout(function(){
			col++;
			if(col < range[1]){
				callback(col);
				loop();
			}else{
				for(i = 0; i < selectors.length; i++){
					selectors[i].style.pointerEvents = "auto";
				}	
			}	
		}, time * 1000)
	}
}

//highlight individual color in game color sequence
function display(col){
	for(i = 0; i < colors.length; i++){
		if(gameColors[col] === colors[i]){
			selectors[i].classList.add(brightColors[i]);
			setTimeout(function(){
				for(i = 0; i < selectors.length; i++){
					selectors[i].classList.remove(brightColors[i]);
				}			
			}, 500);
		}
	}
}

//player chooses a color
for(i = 0; i < selectors.length; i++){
	(function(sel){
		clickAction(sel);
	})(i)	
}

//color lights up, sound plays when clicked
function clickAction(sel){
	selectors[sel].addEventListener("mousedown", function(){
		selectors[sel].classList.add(brightColors[sel]);
		pickedColors.push(colors[sel]);
		compare();
	});
	selectors[sel].addEventListener("mouseup", function(){
		selectors[sel].classList.remove(brightColors[sel]);
	});
}

//comparing arrays gameColors,pickedColors and performing appropriate action
function compare(){
	if(pickedColors[count] === gameColors[count] || count > winCount){
		console.log("Yes!!");
		sound2.play();
		setTimeout(function(){
			sound2.pause();
			sound2.currentTime = 0;
		}, 300);
		count++;
		if(pickedColors.length === gameColors.length){
			if(count === winCount){
				//YOU WON!!!
				setTimeout(function(){
					colorFlash();
				}, 500);
				count++;
			}else{
				getColor();
			}
		}
	}else{
		//Game Over
		sound1.play();
		displayAll();
		turn.textContent = "! !";
		/*setTimeout(function(){
			newGame();
		}, 1500);*/		
	}
	if(turnCount > winCount){
		sound1.play();
		setTimeout(function(){
			newGame();
		}, 1500);
	}
}

//win game sequence
function colorFlash(){
	sound4.play();
	var i = 0;
	while(i < 3){
		(function(i){
			setTimeout(function(){
				displayAll();
			}, 1000 * i);
		})(i++)
	}
}

//highlight all colors at once
function displayAll(){
	for(i = 0; i < colors.length; i++){
		selectors[i].classList.add(brightColors[i]);
		setTimeout(function(){
			for(i = 0; i < selectors.length; i++){
				selectors[i].classList.remove(brightColors[i]);
			}			
		}, 500);
	}
}
