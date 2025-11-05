// add javascript here
// date.textContent = time();
const update = setInterval(time, 1000); // Calls time every 1 second

// global variables
let score, answer, level;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
const tries = ["try", "tries"];

// event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
// IMPORTANT: one global giveUp handler (do NOT add inside play() or makeGuess())
giveUp.addEventListener("click", onGiveUp);

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

    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = true;
        if (levelArr[i].checked) {
            level = Number(levelArr[i].value);
        }
    }

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = "Guess a number between 1-" + level + ", inclusive";
    guess.placeholder = answer; // keep your debug hint
    score = 0;
}

function onGiveUp() {
    msg.textContent = "The answer was " + answer + ". You gave up after " + score +
        " try/tries. You get a score of " + level + ".";
    score = level;
    reset();
    updateScore();
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
    } else if (userGuess > answer) {
        outputStr = "Too high!";
    } else {
        outputStr = "Correct! " + score + " try(s).";
        outputStr += " " + wasScoreGood();
        reset();
        updateScore();
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
        outputStr += "(Very Cold)";
        } else if(diff < (level*0.9)){
        outputStr += "(Freezing)";
        }
    }

    msg.textContent = outputStr;
}

function wasScoreGood(){
    let message = "";
    if (score <= Math.log2(level)/2){
        message = "Great score! You must have good luck.";
    } else if(score <= Math.log2(level)*1.5){
        message = "Decent score. You used a strategy.";
    } else if(score <= Math.log2(level)*2){
        message = "Not a good score. Work harder.";
    } else {
        message = "Terrible score. Just wow... that was awful.";
    }
    return message;
}

function reset() {
    guessBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    giveUp.disabled = true;
    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = false;
    }
}

function updateScore() {
    scoreArr.push(score);
    wins.textContent = "Total wins: " + scoreArr.length;

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
}
