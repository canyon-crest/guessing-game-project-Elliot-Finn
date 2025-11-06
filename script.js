// add javascript here
// date.textContent = time();
const update = setInterval(time, 1000); // Calls time every 1 second

// global variables
let score, answer, level, pName;

const levelArr = document.getElementsByName("level");
const scoreArr = [];
const timeArr = [];
let fastestTime = 10**30;
const tries = ["try", "tries"];
const timeEl = document.getElementById("time");
let timer = 0;
let rawTimer = 0;
let starttime = 0;
let gaveUp = false;
let upper, lower;
let hintCount = 0;
// event listeners
enter.addEventListener("click", start);
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUp.addEventListener("click", onGiveUp);
hintBtn.addEventListener("click", giveHint);

function giveHint() {
    if(hintCount == 0){
        hints.innerHTML = "<li>" + "The number is " + ["even","odd"][answer%2] + "</li>"
    } else if(hintCount == 1){
        hints.innerHTML += "<li>" + "The last digit is " + 
        ["less than 5", "greater than 5"][Math.floor((answer % 10) / 5)] + "</li>";
        console.log(hints.innerHTML);
    } else {
        hints.innerHTML += "<li>" + "The last digit is " + (answer % 10) + "</li>" + 
        "No more hints available.";
        hintBtn.disabled = true;
    }
    hintCount++;
    score++;
    //even/odd, last digit greater than 5, last digit
    
}

function updateTimer() {
  const ms = Date.now() - starttime;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  rawTimer = ms;
  timer = m + "m " + s + "s"
  console.log(timer);
}

function startTimer() {
  starttime = Date.now();
  updateTimer();                      // show 0s immediately
  timer = setInterval(updateTimer, 250);
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

function start(){
    pName = playerName.value;
    pName = pName[0].toUpperCase() + pName.substring(1).toLowerCase();
    console.log(pName);
    playerName.disabled = true;
    enter.disabled = true;
    e.disabled = false;
    m.disabled = false;
    h.disabled = false;
    playBtn.disabled = false;
    msg.textContent = "Welcome, " + pName + "! First you will select a level.";
}


function time() {
    const d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];
    const prefixes = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
        "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
        "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
        "st"];
    let minutes = d.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = d.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;

    const str = d.getHours() + ":" + minutes + ":" + seconds + "<br>" +
        months[d.getMonth()] + " " + d.getDate() + prefixes[d.getDate()] + ", " + d.getFullYear();
    date.innerHTML = str;
}

function play() {
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUp.disabled = false;
    hintBtn.disabled = false;

    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = true;
        if (levelArr[i].checked) {
            level = Number(levelArr[i].value);
        }
    }

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = "Guess a number between 1-" + level + ", inclusive";
    // guess.placeholder = answer; // keep your debug hint
    score = 0;
    lower = 0;
    upper = level+1;
    startTimer();
}

function onGiveUp() {
    msg.textContent = "The answer was " + answer + ". You gave up after " + score +
        " try/tries. Poor " + pName + ", you get a score of " + level + ".";
    score = level;
    gaveUp = true;
    updateScore();
    reset();
    score = 0;
}

function makeGuess() {

    let userGuess = parseInt(guess.value, 10);
    let outputStr = "";

    if (isNaN(userGuess)) {
        msg.textContent = "INVALID, GUESS A NUMBER";
        return;
    }

    score++;
    let diff = Math.abs(userGuess - answer);
    if (userGuess < answer) {
        outputStr = "Too low!";
        if(userGuess > lower+1){
            lower = userGuess-1;
        }
    } else if (userGuess > answer) {
        outputStr = "Too high!";
        if(userGuess < upper-1){
            upper = userGuess+1;
        }
    } else {
        outputStr = "Correct! " + score + " try(s).";
        outputStr += " " + wasScoreGood();
        outputStr += " It took you " + timer + ".";
        reset();
        updateScore();
        stopTimer();
    }
    // warm and such
    if (diff != 0) {
        if(diff < (level * 0.1)){
            outputStr += " (Very hot)";
        } else if(diff < (level * 0.25)) {
            outputStr += " (Warm)";
        } else if(diff < (level * 0.4)) {
            outputStr += " (Cold)";
        } else if(diff < (level * 0.7)) {
            outputStr += " (Very Cold)";
        } else {
            outputStr += " (Freezing)";
        }
    }
    if(!(userGuess == answer)){
        outputStr += "<br>Range: " + lower + " < x < " + upper;
    }

    msg.innerHTML = outputStr;
}

function wasScoreGood(){
    let message = "";
    if (score <= Math.log2(level)/2){
        message = "Great score! You must have good luck, " + pName + ".";
    } else if(score <= Math.log2(level)*1.5){
        message = "Decent score. You used a strategy, " + pName + ".";
    } else if(score <= Math.log2(level)*2){
        message = "Not a good score. Work harder, " + pName + ".";
    } else {
        message = "Terrible score. Just wow, " + pName + "... that was awful.";
    }
    return message;
}

function reset() {
    guessBtn.disabled = true;
    guess.value = "";
    gaveUp = false;
    guess.placeholder = "";
    hints.innerHTML = "";
    hintBtn.disabled = true;
    hintCount = 0;
    guess.disabled = true;
    playBtn.disabled = false;
    giveUp.disabled = true;
    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = false;
    }
}

function updateScore() {
    scoreArr.push(score);

    //always run the score bit
    let sum = 0;
    scoreArr.sort((a, b) => a - b);

    const lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < scoreArr.length; i++) {
        sum += scoreArr[i];
        if (i < lb.length) {
            lb[i].textContent = scoreArr[i];
        }
    }

    const avg = sum / scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);

    //ignore the timer and the number of wins if user gave up
    if(!gaveUp){
        timeArr.push(rawTimer);
        let timeAvg = 0;
        for(let i = 0; i < timeArr.length; i++){
            timeAvg += timeArr[i];
        }
        timeAvg = timeAvg / timeArr.length;
        avgTime.textContent = "Average Time: " + Math.floor(timeAvg / 60000) + "m " +
                Math.floor(timeAvg / 1000) % 60 + "s";  

        wins.textContent = "Total wins: " + scoreArr.length;

        if (rawTimer < fastestTime) {
            fastestTime = rawTimer;
            bestTime.textContent = "Fastest Time: " + Math.floor(fastestTime / 60000) + "m " +
                Math.floor(fastestTime / 1000) % 60 + "s";
            console.log("Fastest Time: " + Math.floor(fastestTime / 60000) + "m " +
                Math.floor(fastestTime / 1000) % 60 + "s");
        }
    }
}
