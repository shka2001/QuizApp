class Game {
  constructor() {
    this.question = document.getElementById("question");
    this.choices = Array.from(document.getElementsByClassName("choice-text"));
    this.questionCounterText = document.getElementById("questionCounter");
    this.scoreText = document.getElementById("score");

    this.currentQuestion = {};
    this.acceptingAnswers = false;
    this.score = 0;
    this.questionCounter = 0;
    this.availableQuesions = [];

    this.questions = [];

    //CONSTANTS
    this.CORRECT_BONUS = 10;
    this.MAX_QUESTIONS = localStorage.getItem("questionsNumber");

    //Display Feedback for Correct/Incorrect Answers
    //正解でなければ、リターンする。

    this.choices.forEach((choice) => {
      choice.addEventListener("click", (e) => {
        const selectedChoice = e.target;

        selectedChoice.parentElement.classList.toggle("choosen");
      });
    });

    let checkAnswersBtn = document.getElementById("checkAnswersBtn");
    checkAnswersBtn.addEventListener("click", (e) => {
      let allChoices = Array.from(
        document.getElementsByClassName("choice-container")
      );
      console.log(allChoices);

      let isCorrect = this.correct(
        allChoices,
        this.currentQuestion["correct_answers"]
      );
      if (isCorrect) {
        this.incrementScore(10);
      }

      this.getNewQuestion();
    });

    fetch(
      "https://quizapi.io/api/v1/questions?apiKey=D4fwC5JMzn3sbU7EI4SKm9tLTIXsZyUv2d6yzxCM&difficulty=Easy&limit=10&tags=HTML"
    )
      .then((response) => response.json())
      .then((data) => {
        this.questions = data;
        this.startGame();
      });
  }

  startGame() {
    this.questionCounter = 0;
    this.score = 0;
    localStorage.setItem("playerScore", 0);
    this.availableQuesions = [...this.questions];
    //console.log(availableQuesions);
    this.getNewQuestion();
  }

  correct(allChoices, correctAnswers) {
    for (let check = 0; check < allChoices.length; check++) {
      const choosen = allChoices[check].classList.contains("choosen");
      const correctAnswer =
        correctAnswers[
          "answer_" + ["a", "b", "c", "d", "e", "f"][check] + "_correct"
        ] == "true";
      console.log(choosen);
      console.log(correctAnswer);

      if (choosen != correctAnswer) {
        return false;
      }
    }
    return true;
  }

  //新しい問題を表示する。
  getNewQuestion() {
    //残りの問題数または、問題の最大数に達したらゲーム終わり。
    if (
      this.availableQuesions.length === 0 ||
      this.questionCounter >= this.MAX_QUESTIONS
    ) {
      //go to the end page
      return window.location.assign("end.html");
    }
    this.questionCounter++;
    //???これでもいい？
    this.questionCounterText.innerText =
      this.questionCounter + "/" + this.MAX_QUESTIONS;
    //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    //問題をランダムに表示する。
    this.currentQuestion = this.availableQuesions[this.questionCounter - 1];
    this.question.innerText = this.currentQuestion.question;
    //HTMLのdatasetの数字のところに選択肢を表示。
    this.choices.forEach((choice) => {
      const number = choice.dataset["number"];
      choice.innerText = this.currentQuestion["answers"][
        "answer_" + ["a", "b", "c", "d", "e", "f"][number]
      ];
      choice.parentElement.classList.remove("choosen");
    });

    this.acceptingAnswers = true;
  }

  //正解の場合スコアを１０ポイントずつ足していく。
  incrementScore(num) {
    this.score += num;
    localStorage.setItem("playerScore", this.score);

    this.scoreText.innerText = this.score;
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  new Game();
});
