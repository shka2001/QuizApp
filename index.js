let playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", function (e) {
  let username = document.getElementById("username").value;
  localStorage.setItem("username", username);
  let questionsNumber = document.getElementById("questionsNumber").value;
  localStorage.setItem("questionsNumber", questionsNumber);
  console.log(localStorage);
  window.location.assign("game.html");
});
