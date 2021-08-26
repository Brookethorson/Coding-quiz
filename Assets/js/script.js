$(document).ready(function (){
    let appStates = {
        Initial : "state.initial",
        Questioning : "state.questioning",
        SubmittingScore : "state.submittingscore",
        Leaderboard : "state.leaderboard"
    };

    let contEl = $("#content");
    let timerEl = $("#timer");
    let highscoreEl = $("#highscores");
    let currentState;
    let previousState;
    let score = 0;
    let secondsElapsed = 0;
    let interval;

    let currentQuestion = 0;
    let lastSelectedAnswer = "";

    const quizTime = 80;
    //Quiz questions  
     const questions = [
         question1 = {
             textContent: "Commonly used data types DO NOT include:",
             options : ["strings","booleans","alert","numbers"],
             answer : "alert"
         },
 
         question2 = {
             textContent: "The condition in an if / else statement is enclosed within _____.",
             options : ["quotes","curly brackets","parentheses","square brackets"],
             answer : "parentheses"
         },
 
         question3 = {
             textContent: "Arrays in JavaScript can be used to store _____.",
             options : ["numbers and strings","other arrays","booleans","all of the above"],
             answer : "all of the above"
         },
 
         question4 = {
             textContent: "String values must be enclosed within _____ when being assigned to variables.",
             options : ["commas","curly brackets","quotes","parentheses"],
             answer : "quotes"
         },
 
         question5 = {
             textContent: "A very useful tool used during development and debugging for printing content to the debugger is:",
             options : ["JavaScript","terminal / bash","for loops","console log"],
             answer : "console log"
         },
     ];