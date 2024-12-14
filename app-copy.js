import { getQuestions } from "./js/questions.mjs";

const gameSpot = document.getElementById('game-spot');
const startArea = document.getElementById('start-area');
const startButton = document.getElementById('start');
const gameFr = document.getElementById('game-fr');
const shuttleProg = document.getElementById('shuttle-prog');
const shuttle = document.getElementById('shuttle');
const saturn = document.getElementById('saturn');
const statusMsg = document.getElementById('status-msg');
const questionSpot = document.getElementById('question-spot');
const nextButton = document.getElementById('next-button');
const scoreStreak = document.getElementById('score-streak');
// const score = document.getElementById('score');
// const streak = document.getElementById('streak');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const leaderboard = document.getElementById('leaderboard');
const restartButton = document.getElementById('restart-button');



// make a moving class that is called as needed

let currentPage = 0;
let score = 0;
let streak = 0;
let correctAnswers = 0;
let totalToWin = 10;

// will be getting questions from s3
//const questions = [];


function setQuestions(questions) {
  const question = document.querySelector('.question');
  


  //     const output = [];
//     myQuestions.forEach((currentQuestion, questionNumber) => {
//       const answers = [];
//       for (let letter in currentQuestion.answers) {
//         answers.push(`
//           <label>
//             <input type="radio" name="question${questionNumber}" value="${letter}" data-question="${questionNumber}">
//             ${letter}: ${currentQuestion.answers[letter]}
//           </label>
//         `);
//       }
//       output.push(`
//         <div class="slide ${questionNumber === 0 ? '' : 'hidden'}">
//           <div class="question">${currentQuestion.question}</div>
//           <div class="answers">${answers.join('')}</div>
//           <div class="feedback hidden"></div>
//         </div>
//       `);
//     });
//     quizContainer.innerHTML = output.join('');
//   }
}

async function init() {
  const questions = await getQuestions;

}

init();

// document.addEventListener('DOMContentLoaded', () => {
//   const quizContainer = document.getElementById('quiz-container');
//   const resultsContainer = document.getElementById('results');
//   const previousButton = document.getElementById('previous');
//   const nextButton = document.getElementById('next');
//   const streakDisplay = document.getElementById('streak');
//   const scoreDisplay = document.getElementById('score');

//   let currentSlide = 0;
//   let score = 0;
//   let streak = 0;

//   const myQuestions = [
//     {
//       question: "What is a best practice for writing alt text?",
//       answers: { a: "It should be over 250 characters.", b: "It should be repetitive.", c: "It should be under 250 characters." },
//       correctAnswer: "c"
//     },
//     {
//       question: "Which one of these is a JavaScript package manager?",
//       answers: { a: "Node.js", b: "TypeScript", c: "npm" },
//       correctAnswer: "c"
//     },
//     {
//       question: "Which tool can you use to ensure code quality?",
//       answers: { a: "Angular", b: "jQuery", c: "RequireJS", d: "ESLint" },
//       correctAnswer: "d"
//     }
//   ];

//   function buildQuiz() {
//     const output = [];
//     myQuestions.forEach((currentQuestion, questionNumber) => {
//       const answers = [];
//       for (let letter in currentQuestion.answers) {
//         answers.push(`
//           <label>
//             <input type="radio" name="question${questionNumber}" value="${letter}" data-question="${questionNumber}">
//             ${letter}: ${currentQuestion.answers[letter]}
//           </label>
//         `);
//       }
//       output.push(`
//         <div class="slide ${questionNumber === 0 ? '' : 'hidden'}">
//           <div class="question">${currentQuestion.question}</div>
//           <div class="answers">${answers.join('')}</div>
//           <div class="feedback hidden"></div>
//         </div>
//       `);
//     });
//     quizContainer.innerHTML = output.join('');
//   }

//   function showSlide(n) {
//     const slides = document.querySelectorAll('.slide');
//     slides.forEach((slide, index) => {
//       slide.classList.toggle('hidden', index !== n);
//     });
//     previousButton.classList.toggle('hidden', n === 0);
//     nextButton.classList.toggle('hidden', n === slides.length - 1);
//   }

//   function handleAnswer(event) {
//     const input = event.target;
//     const questionNumber = input.dataset.question;
//     const userAnswer = input.value;
//     const currentQuestion = myQuestions[questionNumber];
//     const feedback = input.closest('.slide').querySelector('.feedback');

//     if (feedback.classList.contains('revealed')) {
//       return; // Prevent re-choosing an answer.
//     }

//     feedback.classList.add('revealed');
//     if (userAnswer === currentQuestion.correctAnswer) {
//       score++;
//       streak++;
//       feedback.textContent = "Correct!";
//       feedback.style.color = "lightgreen";
//     } else {
//       streak = 0;
//       feedback.textContent = `Incorrect! The correct answer was: ${currentQuestion.correctAnswer}`;
//       feedback.style.color = "red";
//     }

//     scoreDisplay.textContent = `Score: ${score}`;
//     streakDisplay.textContent = `Streak: ${streak}`;
//   }

//   function nextSlide() {
//     showSlide(++currentSlide);
//   }

//   function previousSlide() {
//     showSlide(--currentSlide);
//   }

//   nextButton.addEventListener('click', nextSlide);
//   previousButton.addEventListener('click', previousSlide);

//   document.addEventListener('change', (event) => {
//     if (event.target.matches('input[type="radio"]')) {
//       handleAnswer(event);
//     }
//   });

//   document.getElementById('start-game').addEventListener('click', () => {
//     document.getElementById('start-screen').classList.add('hidden');
//     document.getElementById('game').classList.remove('hidden');
//     buildQuiz();
//     showSlide(0);
//     score = 0;
//     streak = 0;
//     scoreDisplay.textContent = `Score: ${score}`;
//     streakDisplay.textContent = `Streak: ${streak}`;
//   });
// });

// // I'm designing a game to teach accessibility principles. The static content will be stored on S3. A lambda function (or two) will be used to calcutate the streak/score/actions/game state for the shuttle progress. A dynamodb table is used to make a leaderboard at the end of the game.
// // h2 says "Do you have what it takes to make it to Saturn?"
// // under the H2, there is a button that says "Start Game"
// // If the user selects the start button, the first thing they see is an animation of a space shuttle moving slightly across the page with a message that says "the more questions you get right, the more progress your shuttle makes towards Saturn!" There is a saturn icon located at the end of the shuttle's path. 
// // The user can see the first question. It is a question followed by three answer choices. The answer choices are radio buttons. After selecting a button, the user can then select the "next" button. If they get the question right, they are alerted with a message that says "good job, you just blasted away an asteroid and your shuttle is moving closer to Saturn." Their score and streaks update. The score and the streak are located in the bottom portion of the screen.
// // The user can see the second question they can answer. Similar to the first question, if they get it right, they see a success message and the shuttle makes more progress across the screen. 
// // However, every time the user gets a question wrong, they lose their streak and are alerted with a new situation. "Oh no, your shuttle was hit by some space trash. Answer a question right to repair the damage." They can see the next question. 
// // The user only needs to get 10 right to reach Saturn. There is a pool of questions that are randomly selected from. 
// // Once the user gets ten questions right, the shuttle reaches saturn and there is a celebration message. 
// // After the entire game has been completed, there is a leaderboard at the end. 