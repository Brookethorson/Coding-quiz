$(function (){
    let appStates = {
        Initial : "state.initial",
        Questioning : "state.questioning",
        SubmittingScore : "state.submittingscore",
        Leaderboard : "state.leaderboard"
    };

//let list 
    let contEl = $("#content");
    let timerEl = $("#timer");
    let highscoreEl = $("#highscores");
    let currentState;
    let previousState;
    let score = 0;
    let secondsElapsed = 0;
    let interval;

    let currentQuestion = 0;
    let lastAnswer = "";

    const quizTime = 80;

//Questions
    const questions = [
        question1 = {
            textContent: "Commonly used data types DO NOT include:",
            options : ["strings","booleans","alert","numbers"],
            answer : "alert"
        },

        question2 = {
            textContent: "The condition in an if / else statement is enclosed within _____.",
            options : ["quotes", "curly brackets","parentheses","square brackets"],
            answer : "parentheses"
        },

        question3 = {
            textContent: "Arrays in JavaScript can be used to store _____.",
            options : ["numbers and strings","other arrays","booleans","all of the above"],
            answer : "all of the above"
        },

        question4 = {
            textContent: "String values must be enclosed within _____ when being assigned to variables.",
            options : ["commas", "curly brackets", "quotes","parentheses"],
            answer : "quotes"
        },

        question5 = {
            textContent: "A very useful tool used during development and debugging for printing content to the debugger is:",
            options : ["JavaScript","terminal / bash", "for loops", "console log"],
            answer : "console log"
        }
    ];

    init();

    function init(){
        $(timerEl).html(`Timer: ${getFormattedSeconds()}`);
        $(highscoreEl).html("View Highscores");
        reset();
        createMainPage();

        $(highscoreEl).on("click", function(){
            clearInterval(interval);
            createLeaderboard();
        });
    }

    function reset() {
        secondsElapsed = 0;
        currentQuestion = 0;
    }
//quiz start timer
    function startTimer() {
        clearInterval(interval);

        interval = setInterval(function() {
            secondsElapsed++;
            $(timerEl).html(`Timer: ${getFormattedSeconds()}`);

            if (secondsElapsed >= quizTime) {
                clearInterval(interval);
                if (secondsElapsed > quizTime) 
                    secondsElapsed = quizTime;
                createSubmitPage();
            }
        }, 1000);
    }

    function getFormattedSeconds() {
        return (quizTime - secondsElapsed);
    }
//start page
    function createMainPage() {
        currentState = appStates.Initial;
        

        $(contEl).empty();
        
        let header = $("<header><h1>Coding Quiz</h1></header>");
        let paragraph = $("<p>Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds.</p>")
        let button = $("<button id=\"start-quiz-btn\" type=\"button\" class=\"quizbtn\">Start Quiz</button>")

        $(contEl).append(header, paragraph, button);

        $("#start-quiz-btn").on("click", function() {
            createNewQuestion();
        });
    }
//move thru the quiz
    function createNewQuestion() {
        if(currentQuestion >= questions.length) {
            createSubmitPage();
            return;
        }

        previousState = currentState;
        currentState = appStates.Questioning;
     

        $(contEl).empty();

        let questionObj = questions[currentQuestion];
        let header = $(`<h1>${questionObj.textContent}</h1>`);
        let unList = $("<ul>");

        $(questionObj.options).each(function(index, value){
            let btn = $(`<li><button type="button" class="ques-option quizbtn" data-ques-option="${value}">${index + 1}. ${value}</button></li>`);
            $(unList).append(btn);
        });

        $(contEl).append(header, unList);

        if(previousState != appStates.Questioning)
            startTimer();
//adds to score if correct subtracts if wrong 
//display correct or wrong 
        $(".ques-option").on("click", function(event){
            event.preventDefault();
            lastAnswer = $(this).attr("data-ques-option");
            let isCorrect = lastAnswer === questionObj.answer;

            if (isCorrect)
                score += 30;
            else if (!isCorrect) {
                secondsElapsed += 10;
            }

            currentQuestion++;
            createNewQuestion();

            if (isCorrect)
                displayMessage("Correct");
            else 
                displayMessage("Wrong");
        });

        function displayMessage(message) {
            let messageText = $(`<div class="fader"><hr><h3>${message}</h3></div>`);
            $("#content").append(messageText);
        }
    }
//Credentials and Highscores
    function createSubmitPage() {
        clearInterval(interval);
        $(timerEl).html(`Timer: ${getFormattedSeconds()}`);
        currentState = appStates.SubmittingScore;
    

        let totalScore = score + (Math.floor(getFormattedSeconds() * .10));

        $(contEl).empty();

        let header = $("<h1>All Done</h1>");
        let paragraph = $(`<p style="text-align: left">Your final score is ${totalScore}.</p>`);
        let submitField = $("<div class=\"submit-field\">Enter initials: <input id=\"initials\" type=\"text\"> <button id=\"initials-submit\" type=\"button\" class=\"quizbtn\">Submit</button></div>");

        $(contEl).append(header, paragraph, submitField);

        $("#initials-submit").on("click", function(event){
            event.preventDefault();
        
            currentState = appStates.Initial;

            let inputInitials = $("#initials").val();

            if(!inputInitials){
                alert("Please enter your initials.");
                return;
            }

            let highscores = localStorage.getItem("highscores");

            if(!highscores)
                highscores = {};
            else
                highscores = JSON.parse(highscores);

            highscores[inputInitials] = totalScore;

//Add to local storage
            localStorage.setItem("highscores", JSON.stringify(highscores));

            createLeaderboard();
            reset();
        });
    }
//create and sort leaderboard
    function createLeaderboard() {
        if(currentState != appStates.Leaderboard)
            previousState = currentState;
            currentState = appStates.Leaderboard;
       

        $(highscoreEl).empty();
        $(timerEl).empty();
        $(contEl).empty();

        let header = $("<h1 style=\"margin-top:0;\">Highscores</h1>");

        let highscores = localStorage.getItem("highscores");

        $(contEl).append(header);

        if(highscores)
        {
            let parsedHighscores = JSON.parse(highscores);

            let sortedHighscores = sortHighscores();

            let orderScores = $("<ol id=\"highscore-list\"></ol>");

            let counter = 1;
            $.each(sortedHighscores, function(key, value)
            {
                let liElement = $(`<li class="highscore">${counter}. ${key} - ${value}</li>`);

                
                $(orderScores).append(liElement);
                counter++;
            });

            $(contEl).append(orderScores);
            
//High score content 
            function sortHighscores() {
                items = Object.keys(parsedHighscores).map(function(key) {
                    return [key, parsedHighscores[key]];
                });
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });
                sorted_obj={}
                $.each(items, function(k, v) {
                    use_key = v[0]
                    use_value = v[1]
                    sorted_obj[use_key] = use_value
                });
                return(sorted_obj);
            } 
        }
//high scores and play again buttons
        let buttons = $("<div style=\"text-align:center\"><button id=\"highscorebk\" type=\"button\" class=\"quizbtn\">Play Again</button> <button id=\"highscoreclr\" type=\"button\" class=\"quizbtn\">Clear scores</button></div>");

        $(contEl).append(buttons);

        $("#highscoreclr").on("click", function(event) {
            event.preventDefault();
            localStorage.removeItem("highscores");
            $("#highscore-list").empty();
        });

        $("#highscorebk").on("click", function(event){
            event.preventDefault();

//switch to previous state if case is not matched
            switch(previousState)
            {
                case appStates.Initial:
                    createMainPage();
                    break;
                case appStates.Questioning:
                    createNewQuestion();
                    break; 
                case appStates.SubmittingScore:
                    createSubmitPage();
                    break;
                default:
                    break;
            }

            $(timerEl).html(`Timer: ${getFormattedSeconds()}`);
            $(highscoreEl).html("View Highscores");
        });
    }
});