//オブジェクト指向でGameのオブジェクト(エッグマシン)を作った。
class Game {
  //作り方？
  constructor() {
    //材料？ボックスを作る。
    this.question = document.getElementById("question");
    this.choices = Array.from(document.getElementsByClassName("choice-text"));
    this.questionCounterText = document.getElementById("questionCounter");
    //ユーザーネームのインプットボックスを作り、IDの空欄部分の要素を得る。
    this.usernameText = document.getElementById("UsernameInpt");
    //ローカルストレージからインプットされたユーザー名をHTML内に表示する。
    this.usernameText.innerText = localStorage.getItem("username");

    //???
    this.currentQuestion = {};
    //最初の選択はFalseにしておく。
    this.acceptingAnswers = false;
    this.score = 0;
    this.questionCounter = 1;
    this.availableQuesions = [];

    //CONSTANTS?正解お場合は、１０ポイント。
    this.CORRECT_BONUS = 10;
    //問題数のインプットをストレージから得る。
    this.MAX_QUESTIONS = localStorage.getItem("questionsNumber");

    //ユーザーの回答を置く場所。
    this.userAnswers = [];

    //選択肢をクリックしたら、以下のことが起こる。
    this.choices.forEach((choice) => {
      choice.addEventListener("click", (e) => {
        const selectedChoice = e.target;

        //クリックとアンクリックをtpggleでできるようにし、クリックした場合は、choosenをHTML内に追加する。
        selectedChoice.parentElement.classList.toggle("choosen");

        //ユーザーが選択した回答の配列を作る。
        this.userAnswers[this.questionCounter - 1] = Array.from(
          document.getElementsByClassName("choice-container")
        ).map((c) => {
          return c.classList.contains("choosen");
          //[]
        });
      });
    });

    //Submitのボタンを押したら、以下のことが起こる。
    let checkAnswersBtn = document.getElementById("checkAnswersBtn");
    checkAnswersBtn.addEventListener("click", (e) => {
      this.endGame();
    });

    //GoBackのボタンを押したら、以下のことが起こる。
    let goBackBtn = document.getElementById("goBackBtn");
    goBackBtn.addEventListener("click", (e) => {
      this.questionCounter--;
      this.getNewQuestion();
    });

    //GoForwardのボタンを押したら、以下のことが起こる。
    let goForwardBtn = document.getElementById("goForwardBtn");
    goForwardBtn.addEventListener("click", (e) => {
      this.questionCounter++;
      this.getNewQuestion();
    });

    fetch(
      "https://quizapi.io/api/v1/questions?apiKey=D4fwC5JMzn3sbU7EI4SKm9tLTIXsZyUv2d6yzxCM&difficulty=Easy&limit=10&tags=HTML"
    )
      .then((response) => response.json())
      .then((data) => {
        this.availableQuesions = data;
        this.startGame();
      });
  }

  endGame() {
    for (let i = 0; i < this.userAnswers.length; i++) {
      const allChoices = this.userAnswers[i]; // [true, false, false, false]
      const allAnswers = this.availableQuesions[i]["correct_answers"]; // [true, false, false, false]
      console.log(allChoices);

      let isCorrect = this.correct(allChoices, allAnswers);
      if (isCorrect) {
        this.incrementScore(10);
      }
    }
    return window.location.assign("end.html");
  }

  startGame() {
    this.questionCounter = 1;
    this.score = 0;
    localStorage.setItem("playerScore", 0);
    //console.log(availableQuesions);
    this.getNewQuestion();
  }

  //Display Feedback for Correct/Incorrect Answers
  correct(allChoices, correctAnswers) {
    for (let check = 0; check < allChoices.length; check++) {
      const choosen = allChoices[check];
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
      this.questionCounter > this.MAX_QUESTIONS
    ) {
      //go to the end page
      this.endGame();
      return;
    }
    //???これでもいい？
    this.questionCounterText.innerText =
      this.questionCounter + "/" + this.MAX_QUESTIONS;
    //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    //
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
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  new Game();
});
