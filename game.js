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
  },
  */
];

fetch(
  "https://quizapi.io/api/v1/questions?apiKey=D4fwC5JMzn3sbU7EI4SKm9tLTIXsZyUv2d6yzxCM&limit=10"
)
  .then((response) => {
    return response.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    /*questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;*/
  });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  //console.log(availableQuesions);
  getNewQuestion();
};

//新しい問題を表示する。
getNewQuestion = () => {
  //残りの問題数または、問題の最大数に達したらゲーム終わり。
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  //???これでもいい？questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  //問題をランダムに表示する。
  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;
  //HTMLのdatasetの数字のところに選択肢を表示。
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

//Display Feedback for Correct/Incorrect Answers
//正解でなければ、リターンする。
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    console.log(selectedAnswer);
    /*
    const classToApply = "incorrect";
    if (selectedAnswer == currentQuestion.answer) {
        classToApply = "correct";
    }
    */
    //上のをワンラインで書くとこうなる。
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    //正解ならば１０ポイントをプラスする。
    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    //タイムリミットの時間を１０００秒にする。
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      //新しい問題を表示する。
      getNewQuestion();
    }, 1000);
  });
});
//正解の場合スコアを１０ポイントずつ足していく。
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

//startGame();
