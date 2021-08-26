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