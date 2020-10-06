//オブジェクト指向でGame(egg machine)のオブジェクト(エッグマシン)を作った。
//I made a Game class in an object-oriented manner.
class Game {
  //作り方？
  //Constructor is a function that runs when creating the object.
  constructor() {
    //材料？ボックスを作る。
    // Set variables for object.
    this.question = document.getElementById("question");
    this.choices = Array.from(document.getElementsByClassName("choice-text"));
    this.questionCounterText = document.getElementById("questionCounter");
    //ユーザーネームのインプットボックスを作り、IDの空欄部分の要素を得る。
    //Create an variable for the user name input element
    this.usernameText = document.getElementById("UsernameInpt");
    //ローカルストレージからインプットされたユーザー名をHTML内に表示する。
    //Display the user name input taken from the local storage in HTML.
    this.usernameText.innerText = localStorage.getItem("username");

    // User score
    this.score = 0;

    // Current question index
    this.questionCounter = 1;

    // All fetched questions from the API
    this.availableQuesions = [];

    //CONSTANTS?１０ポインのボックス。
    // Amount of points when correct
    this.CORRECT_BONUS = 10;
    //問題数のインプットをストレージから得る。
    //Get the input of the number of questions (the user wants) from the storage.
    this.MAX_QUESTIONS = localStorage.getItem("questionsNumber");

    //ユーザーの回答を置く場所。
    //Where to put the user's answer.
    this.userAnswers = [];

    //選択肢をクリックしたら、以下のことが起こる。
    //When you click on an option, the following happens (loop through each choice element and add click listener):
    this.choices.forEach((choice) => {
      choice.addEventListener("click", (e) => {
        const selectedChoice = e.target;

        //クリックとアンクリックをtpggleでできるようにし、クリックした場合は、choosenをHTML内に追加する。
        // switch between "choosen" and not
        selectedChoice.parentElement.classList.toggle("choosen");

        //ユーザーが選択した回答の配列を作る。
        //Create an array of user-selected answers. [[true, false, false, false], [true, false, false, false]]
        // For every element pick out if it has the "choosen" css class.
        this.userAnswers[this.questionCounter - 1] = Array.from(
          document.getElementsByClassName("choice-container")
        ).map((c) => {
          return c.classList.contains("choosen");
          //選択したところはtrueとなっている。[true, true, false, false]
          //The selected part is true.
        });
      });
    });

    //Submitのボタンを押したら、以下のことが起こる。
    //When you press the Submit button, the following happens:
    let checkAnswersBtn = document.getElementById("checkAnswersBtn");
    checkAnswersBtn.addEventListener("click", (e) => {
      this.endGame();
    });

    //GoBackのボタンを押したら、以下のことが起こる。
    //When you press the GoBack button, the following happens:
    let goBackBtn = document.getElementById("goBackBtn");
    goBackBtn.addEventListener("click", (e) => {
      if (this.questionCounter == 1) {
        return;
      }
      this.questionCounter--;
      this.getNewQuestion();
    });

    //GoForwardのボタンを押したら、以下のことが起こる。
    //When you press the GoForward button, the following happens:
    let goForwardBtn = document.getElementById("goForwardBtn");
    goForwardBtn.addEventListener("click", (e) => {
      this.questionCounter++;
      this.getNewQuestion();
    });

    fetch(
      "https://quizapi.io/api/v1/questions?apiKey=D4fwC5JMzn3sbU7EI4SKm9tLTIXsZyUv2d6yzxCM&difficulty=Easy&limit=10&tags=HTML"
    )
      .then((response) => response.json()) // convert string "fasdfasdfas" to object {fdsfafsd: true}
      .then((data) => {
        this.availableQuesions = data;
        this.startGame();
        //availableQuesions は、9: {id: 502, question: "Which tag inserts a line horizontally on your web page?", description: null, answers: {…}, multiple_correct_answers: "false", …}
      });
  }

  endGame() {
    //ユーザーが選択した問題数の数だけforループでユーザーの回答とソースからの解答の配列を作る。
    //Load arrays of user's answers and answers from the source in a for loop for the number of questions selected by the user.
    for (let i = 0; i < this.userAnswers.length; i++) {
      const allChoices = this.userAnswers[i]; // [true, false, false, false]
      const allAnswers = this.availableQuesions[i]["correct_answers"]; // [true, false, false, false]
      /*ex) correct_answers:
      answer_a_correct: "true"
      answer_b_correct: "false"
      answer_c_correct: "false"
      answer_d_correct: "false"
      answer_e_correct: "false"
      answer_f_correct: "false"
      console.log(allChoices);
      */

      // Check answers
      let isCorrect = this.correct(allChoices, allAnswers);
      //正解なら１０ポイントをプラスする。
      if (isCorrect) {
        // Give bonus
        this.incrementScore(this.CORRECT_BONUS);
      }
    }
    //全てが終わったら、スコアを表示する。
    // End game by going to end page
    return window.location.assign("end.html");
  }

  startGame() {
    // Set default values
    this.questionCounter = 1;
    this.score = 0;
    localStorage.setItem("playerScore", 0);
    this.getNewQuestion();
  }

  //ユーザーの回答とソースからの解答の配列を比較して正解かどうかをチェックする。
  //Check if the answer is correct by comparing the user's answer array with the array of answers from the source.
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
        //true and false or false and true = true
        return false;
      } // true and true or false and false = false
    }
    return true;
  }

  //新しい問題を表示する。
  //Show new issues.
  getNewQuestion() {
    //残りの問題数または、問題の最大数に達したらゲーム終わり。
    //The game ends when the number of remaining questions or the maximum number of questions is reached.
    if (
      this.availableQuesions.length === 0 ||
      this.questionCounter > this.MAX_QUESTIONS
    ) {
      //go to the end page
      this.endGame();
      return;
    }
    //現在の問題数を表示する。
    //Display the current number of problems.
    this.questionCounterText.innerText =
      this.questionCounter + "/" + this.MAX_QUESTIONS;
    //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    //
    this.currentQuestion = this.availableQuesions[this.questionCounter - 1];
    this.question.innerText = this.currentQuestion.question;
    //HTMLのdatasetの数字のところに選択肢を表示。
    //Show your choices
    this.choices.forEach((choice) => {
      const number = choice.dataset["number"];
      choice.innerText = this.currentQuestion["answers"][
        "answer_" + ["a", "b", "c", "d", "e", "f"][number]
      ];
      //<div class="choice-container choosen">のようにchoosenをクラスの中に追加する。
      //Remove choosen in the class like <div class = "choice-container choosen">.
      choice.parentElement.classList.remove("choosen");
    });
  }

  //正解の場合スコアを１０ポイントずつ足していく。
  //If the answer is correct, add 10 points each.
  incrementScore(num) {
    this.score += num;
    localStorage.setItem("playerScore", this.score);
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  new Game();
});
