const startButton = document.getElementById("start-button");
const gameFrame = document.getElementById("game-fr");
const shuttle = document.getElementById("shuttle");
const statusMsg = document.getElementById("status-msg");
const questionSpot = document.getElementById("question-spot");
const questionEl = document.getElementById("question");
const answersForm = document.getElementById("answers");
const nextButton = document.getElementById("next-button");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const leaderboardScreen = document.getElementById("leaderboard-screen");
const leaderboardList = document.getElementById("leaderboard");
const restartButton = document.getElementById("restart-button");
const endGameContainer = document.getElementById("endGameContainer");

let score = 0;
let streak = 0;
let correctAnswers = 0;
let questions = [];
let randomIndex = null;


// Fetch questions from S3
async function fetchQuestions() {
  try {
    const response = await fetch("https://astroa11y.s3.us-east-1.amazonaws.com/questions.json");
    questions = await response.json();
    console.log("Questions fetched:", questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

let playerName = "";
// Start the game
startButton.addEventListener("click", async () => {
  playerName = prompt("Enter your name to start the game:") || "Anonymous";
  // const playerName = prompt("Enter your name for the leaderboard:");
  // if (playerName) {
  //   saveScore(playerName, score);
  // }

  await fetchQuestions();
  startGame();
});

function startGame() {
  startButton.parentElement.classList.add("hidden");
  gameFrame.classList.remove("hidden");
  questionSpot.classList.add("hidden");
  statusMsg.textContent = "The more questions you get right, the more progress your shuttle makes towards Saturn!";
  statusMsg.classList.remove("hidden");
  displayQuestion();
}

function displayQuestion() {
  if (correctAnswers >= 3) {
    celebrateWin();
    return;
  }

  if (!questions || questions.length === 0) {
    console.error("No questions available to display.");
    statusMsg.textContent = "Oops! There are no questions available at the moment.";
    return;
  }

  // Show the question container
  questionSpot.classList.remove("hidden");

  // Pick a random question
  const randomIndex = Math.floor(Math.random() * questions.length);
  const currentQuestion = questions[randomIndex];
  console.log("Random Index: ", randomIndex);

  if (!currentQuestion || !currentQuestion.question || !currentQuestion.answers) {
    console.error("Invalid question format:", currentQuestion);
    statusMsg.textContent = "Encountered an issue with a question. Skipping.";
    return;
  }

  // Display the question
  questionEl.textContent = currentQuestion.question;
  console.log("Displaying question:", currentQuestion.question);
  // Clear existing answers and populate new ones
  answersForm.innerHTML = "";
  Object.entries(currentQuestion.answers).forEach(([key, value]) => {
    const label = document.createElement("label");
    label.textContent = value;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = key;

    label.prepend(input); // Attach the input to the label

    label.classList.add("answer-choice");

    answersForm.appendChild(label);
  });

  // Ensure the "Next" button is visible
  nextButton.classList.remove("hidden");
  nextButton.onclick = async () => {
    const selectedAnswer = answersForm.querySelector("input[name='answer']:checked");
    if (!selectedAnswer) {
      alert("Please select an answer before proceeding.");
      return;
    }

    const result = await evaluateAnswer(selectedAnswer.value, randomIndex);
    if (result) {
      handleResult(result);
    } else {
      alert("Error evaluating your answer. Please try again.");
    }
  };
}

async function evaluateAnswer(answer, randomIndex) {
  console.log("Evaluate Answer answer: ", answer);
  console.log("Evaluate Answer Random Index: ", randomIndex);
  try {
    const response = await fetch("https://r7tghbdnmreblqcctb563bmkyi0ufhvn.lambda-url.us-east-1.on.aws/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, randomIndex }),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Response from Lambda:", result); // Debugging
    return result;
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return { correct: false }; // Default to false on error
  }
}


function handleResult(result) {
  console.log("Result from evaluateAnswer:", result);
  if (result.correct) {
    correctAnswers++;
    score += 10;
    streak++;
    moveShuttle();
    alert("Good job! You just blasted away an asteroid!");
  } else {
    streak = 0;
    alert("Oh no, your shuttle was hit by some space trash.");
  }

  updateStats();
  displayQuestion();
}

function moveShuttle() {
  const progress = (correctAnswers / 10) * 100;
  shuttle.style.transform = `translateX(${progress}%)`;
}

function updateStats() {
  scoreEl.textContent = `Score: ${score}`;
  streakEl.textContent = `Streak: ${streak}`;
}

// function celebrateWin() {
//   statusMsg.textContent = "Congratulations! You made it to Saturn!";
//   questionSpot.classList.add("hidden");
//   leaderboardScreen.classList.remove("hidden");
//   gameFrame.classList.add("hidden");

//   updateLeaderboard(playerName, score);
//   fetchLeaderboard();
//   saveScore();
// }


function celebrateWin() {
  statusMsg.textContent = "Congratulations! You made it to Saturn!";
  questionSpot.classList.add("hidden");
  gameFrame.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");

  updateLeaderboard(playerName, score); 
}

async function updateLeaderboard(playerName, score) {
  const payload = { name: playerName, score };

  try {
    const response = await fetch("https://4r473xvoumsa4yqveakjd6mvmu0zxsex.lambda-url.us-east-1.on.aws/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Leaderboard updated successfully.");
    await fetchLeaderboard(); // Fetch leaderboard after updating
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
}


async function saveScore() {
  try {
    const response = await fetch("https://4r473xvoumsa4yqveakjd6mvmu0zxsex.lambda-url.us-east-1.on.aws/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, score }),
    });

    const leaderboard = await response.json();
    displayLeaderboard(leaderboard);
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

async function fetchLeaderboard() {
  try {
    const response = await fetch("https://4r473xvoumsa4yqveakjd6mvmu0zxsex.lambda-url.us-east-1.on.aws/");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const leaderboard = await response.json();
    displayLeaderboard(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}

function displayLeaderboard(leaderboard) {
  leaderboardList.innerHTML = ""; // Clear existing entries

  leaderboard.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(listItem);
  });

  leaderboardScreen.classList.remove("hidden");
}

async function restartGame() {
  score = 0;
  streak = 0;
  correctAnswers = 0;

  // Hide leaderboard and reset UI
  leaderboardScreen.classList.add("hidden");
  endGameContainer.classList.add("hidden");
  gameFrame.classList.remove("hidden");

  // Start a new game
  await fetchQuestions();
  displayQuestion();
}

restartButton.onclick = restartGame;

