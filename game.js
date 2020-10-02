const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [
  /*{
    question: "Inside which HTML element do we put the JavaScript??",
    choice1: "<script>",
    choice2: "<javascript>",
    choice3: "<js>",
    choice4: "<scripting>",
    answer: 1,
  },
  {
    question:
      "What is the correct syntax for referring to an external script called 'xxx.js'?",
    choice1: "<script href='xxx.js'>",
    choice2: "<script name='xxx.js'>",
    choice3: "<script src='xxx.js'>",
    choice4: "<script file='xxx.js'>",
    answer: 3,
  },
  {
    question: " How do you write 'Hello World' in an alert box?",
    choice1: "msgBox('Hello World');",
    choice2: "alertBox('Hello World');",
    choice3: "msg('Hello World');",
    choice4: "alert('Hello World');",
    answer: 4,
  },*/
];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = localStorage.getItem("questionsNumber");

startGame = () => {
  questionCounter = 0;
  score = 0;
  localStorage.setItem("playerScore", 0);
  availableQuesions = [...questions];
  //console.log(availableQuesions);
  getNewQuestion();
};

//新しい問題を表示する。
getNewQuestion = () => {
  //残りの問題数または、問題の最大数に達したらゲーム終わり。
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //go to the end page
    return window.location.assign(
      "file:///C:/Users/shiho/Desktop/QuizApp/end.html"
    );
  }
  questionCounter++;
  //???これでもいい？
  questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;
  //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  //問題をランダムに表示する。
  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;
  //HTMLのdatasetの数字のところに選択肢を表示。
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText =
      currentQuestion["answers"][
        "answer_" + ["a", "b", "c", "d", "e", "f"][number]
      ];
    choice.parentElement.classList.remove("choosen");
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

//Display Feedback for Correct/Incorrect Answers
//正解でなければ、リターンする。

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    const selectedChoice = e.target;

    selectedChoice.parentElement.classList.toggle("choosen");
  });
});

let checkAnswersBtn = document.getElementById("checkAnswersBtn");
checkAnswersBtn.addEventListener("click", function (e) {
  let allChoices = Array.from(
    document.getElementsByClassName("choice-container")
  );
  console.log(allChoices);
  for (let check = 0; check < allChoices.length; check++) {
    const choosen = allChoices[check].classList.contains("choosen");
    const correctAnswer =
      currentQuestion["correct_answers"][
        "answer_" + ["a", "b", "c", "d", "e", "f"][check] + "_correct"
      ] == "true";
    console.log(choosen);
    console.log(correctAnswer);

    if (choosen != correctAnswer) {
      getNewQuestion();
      return;
    }
  }
  incrementScore(10);
  getNewQuestion();
});
//正解の場合スコアを１０ポイントずつ足していく。
incrementScore = (num) => {
  score += num;
  localStorage.setItem("playerScore", score);

  scoreText.innerText = score;
};

fetch(
  "https://quizapi.io/api/v1/questions?apiKey=D4fwC5JMzn3sbU7EI4SKm9tLTIXsZyUv2d6yzxCM&difficulty=Easy&limit=10&tags=HTML"
)
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    startGame();
  });
