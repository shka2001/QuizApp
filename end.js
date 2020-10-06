class End {
  constructor() {
    document.addEventListener("DOMContentLoaded", function (e) {
      playersUsername.innerText = localStorage.getItem("username");
      finalScore.innerText = localStorage.getItem("playerScore");
    });
  }
}

new End();
