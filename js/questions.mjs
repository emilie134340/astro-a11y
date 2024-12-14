export async function getQuestions() {
    const questions = await fetch('https://astroa11y.s3.us-east-1.amazonaws.com/questions.json');
    console.log(questions); //why no work??
    return questions;
}

export function questionTemplate(questions) {
    return `<p id="question">${questions.question}</p>
    <form id="answers">
        <label>
        <input type="radio" name="question${questionNumber}" value="${letter}" data-question="${questionNumber}">
            ${letter}: ${questions.answers[letter]}
          </label><br>
    </form>
    `

    const output = [];
    questions.forEach((currentQuestion, questionNumber) => {
      const answers = [];
      for (let letter in currentQuestion.answers) {
        answers.push(`
          <label>
            <input type="radio" name="question${questionNumber}" value="${letter}" data-question="${questionNumber}">
            ${letter}: ${currentQuestion.answers[letter]}
          </label>
        `);
      }
      output.push(`
        <div class="slide ${questionNumber === 0 ? '' : 'hidden'}">
          <div class="question">${currentQuestion.question}</div>
          <div class="answers">${answers.join('')}</div>
          <div class="feedback hidden"></div>
        </div>
      `);
    });
    quizContainer.innerHTML = output.join('');
  }
