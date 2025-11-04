// add javascript here
// date.textContent = time();
const unused = setInterval(time, 1000); // Calls time every 3 seconds (3000 milliseconds)
//globle variables
let score, answer, level;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
//event listeners
playBtn.addEventListener("click",play);
guessBtn.addEventListener("click", makeGuess);
tries = ["try", "tries"];

function time(){
    let d = new Date();
    // concatenate the date and time
    months = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];
    prefixes = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
        "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
        "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
        "st"];
    minutes = d.getMinutes();
    if(minutes<10){
        minutes = "0" + minutes;
    }
    seconds = d.getSeconds();
    if(seconds<10){
        seconds = "0" + seconds;
    }
    let str = d.getHours() + ":" + minutes + ":" + seconds + "<br>"+
    months[d.getMonth()] + " " + d.getDate() + prefixes[d.getDate()] + ", " + d.getFullYear();
    // console.log(str);
    date.innerHTML = str;
}

function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUp.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }
    answer = Math.floor(Math.random()*level)+1;
    msg.textContent = "Guess a number between 1-" + level + ", inclusive";
    guess.placeholder = answer;
    score = 0;
    giveUp.addEventListener("click", function(){
        msg.textContent = "The answer was " + answer + ". You gave up after " + score + " try/tries.";
        reset();
    });
}
function makeGuess(){
    giveUp.addEventListener("click", function(){
        msg.textContent = "The answer was " + answer + ". You gave up after " + score + " try/tries.";
        reset();
    });

    let userGuess = parseInt(guess.value);
    let outputStr = "";
    if(isNaN(userGuess)){
        msg.textContent = "INVALID, GUESS A NUMBER";
        return;
    }
    score++;
    if(userGuess<answer){
        outputStr = "Too low!"
        if((answer-userGuess)>(level*0.5)){
            outputStr += "(Very cold)";
        }
    }else if(userGuess>answer){
        outputStr = "Too high!"
        if((userGuess-answer)>(level*0.5)){
            outputStr += " (Very cold)";
        }else{
            outputStr += "Cold"
        }
    }else{
        outputStr = "Correct! " + score + " try(s)." 
        reset();
        updateScore();
    }
    msg.textContent = outputStr;
}
function reset(){
    guessBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i = 0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    scoreArr.push(score);
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    scoreArr.sort((a,b) => a-b);

    const lb = document.getElementsByName("leaderboard");

    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i<lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}