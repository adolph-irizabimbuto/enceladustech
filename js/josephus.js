
// works out the largest binary number in a Given number
function largestBinaryNumber(number){
  let largestNumber;
  for(let i= 1; i <= number;){
   largestNumber = i
   i = i*2; 
   
  }
  return largestNumber;
}

// Equation for the Josephus Problem, whe
function josephusProblem(numberOfPlayers){
  let winningSeat = ((numberOfPlayers - largestBinaryNumber(numberOfPlayers)) * 2) + 1
  
  return winningSeat;
}

// returns a random number between 1 and x (1000)
function randomNumber(limit){

  let index = Math.floor(Math.random() *limit);
  return index
}

/*is called whenever the "start" button is clicked 
  it will populate the "number of People" label with a random number from the
 "randomNumber() funtion"
 and lastly it will start the timer
*/

function start(){
  let label = document.getElementById("people");
  label.innerHTML = randomNumber(20);
  startTimer();
}

// HANDLING THE COUNTDOWN TIMER:

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
const FULL_DASH_ARRAY = 283;
let score = 0;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
      color: "green"
  },
  warning: {
      color: "orange",
      threshold: WARNING_THRESHOLD
  },
  alert: {
      color: "red",
      threshold: ALERT_THRESHOLD
  }
};
let remainingPathColor = COLOR_CODES.info.color;

// formats time into a 
function formatTimerLeft(time){
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if(seconds < 10){
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds
}

let timerInterval = -1;

function startTimer() {
  const isPaused = false;
  
    timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
  
    document.getElementById("base-timer-label").innerHTML = 
    formatTimerLeft(timeLeft);

    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft <= 10){
      const background = timeLeft % 2 ===0 ? "red": "white";
      document.getElementById("baseTimerC").style.fill = background;
      document.getElementById("base-timer-path-remaining").style.strokeWidth = "7px";
     
    }
    if(timeLeft <=0){
      clearInterval(timerInterval); 
      let watchLabel = document.getElementById("base-timer-label")
      document.getElementById("baseTimerC").style.fill = "white";
      watchLabel.innerHTML = "Game Over";
      watchLabel.style.fontSize = "2.5rem"

      document.getElementById("answerButton").setAttribute("class", "button is-static");
      document.getElementById("correctAnwerLabel").innerHTML = 
        josephusProblem(parseInt(document.getElementById("people").innerHTML));
    }
  }, 1000);

  
}

document.getElementById("base-timer-path-remaining").style.stroke = remainingPathColor;

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}
          
function setCircleDasharray() {
 const circleDasharray = `${(
 calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
 document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    remainingPathColor = COLOR_CODES.alert.color;
    document.getElementById("base-timer-path-remaining").style.stroke = remainingPathColor;
}else if (timeLeft <= warning.threshold) {
  remainingPathColor = COLOR_CODES.warning.color;
  document.getElementById("base-timer-path-remaining").style.stroke = remainingPathColor;
  }
}

function correctAnswer() {
  let userAnswerInt = parseInt(document.getElementById("answerField").value);
  const numberOfParticipants = parseInt(document.getElementById("people").innerHTML);
  const correctAnswer = josephusProblem(numberOfParticipants);
  let resultLabel = document.getElementById("resultLabel");
  
   for(let i = 0; i < 1; i++){
    score++;
    }

  if(userAnswerInt === correctAnswer){
    
    document.getElementById("pointsLabel").innerHTML = score;
    resultLabel.innerHTML = "Correct";
    resultLabel.style.color = "green"
    resultLabel.style.fontSize = "0.9rem";
    clearInterval(timerInterval);
    document.getElementById("correctAnwerLabel").innerHTML = correctAnswer;
    document.getElementById("startNext").innerHTML = " Next Question";
    document.getElementById("startNext").style.fontSize = "0.5rem"
    document.getElementById("restartY").setAttribute("class", "fas fa-hand-point-right");
    
  }
  if(userAnswerInt !== correctAnswer){
    resultLabel.innerHTML = "Incorrect";
    resultLabel.style.color = "red"
    resultLabel.style.fontSize = "0.8rem";
    }
    
}
