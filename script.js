// 질문과 답변 데이터 로드
function loadQuestions() {
    return JSON.parse(localStorage.getItem('questions') || '[]');
}

// 질문과 답변 데이터 저장
function saveQuestions(questions) {
    localStorage.setItem('questions', JSON.stringify(questions));
}

// 질문 목록 렌더링
function renderQuestions() {
    const questions = loadQuestions();
    const list = document.getElementById('questions-list');
    list.innerHTML = '';
    questions.forEach((q, idx) => {
        const box = document.createElement('div');
        box.className = 'question-box';
        box.innerHTML = `
            <div class="question-header">${q.subject}</div>
            <div class="question-content">${q.question}</div>
            <div class="answers" id="answers-${idx}">
                ${(q.answers||[]).map(a => `<div class='answer-box'>${a}</div>`).join('')}
            </div>
            <form class="answer-form" data-idx="${idx}">
                <input type="text" placeholder="답변을 입력하세요" required>
                <button type="submit">답변</button>
            </form>
        `;
        list.appendChild(box);
    });
}

// 질문 등록 이벤트
const questionForm = document.getElementById('question-form');
questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value.trim();
    const question = document.getElementById('question').value.trim();
    if (!subject || !question) return;
    const questions = loadQuestions();
    questions.unshift({ subject, question, answers: [] });
    saveQuestions(questions);
    renderQuestions();
    questionForm.reset();
});

// 답변 등록 이벤트 (위임)
document.getElementById('questions-list').addEventListener('submit', function(e) {
    if (e.target.classList.contains('answer-form')) {
        e.preventDefault();
        const idx = e.target.getAttribute('data-idx');
        const input = e.target.querySelector('input');
        const answer = input.value.trim();
        if (!answer) return;
        const questions = loadQuestions();
        questions[idx].answers = questions[idx].answers || [];
        questions[idx].answers.push(answer);
        saveQuestions(questions);
        renderQuestions();
    }
});

// 초기 렌더링
renderQuestions();
