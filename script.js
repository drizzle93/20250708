// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyA9Q09CoBGqDvf20CipLNDMaQ7nCY8c35o",
  authDomain: "lee2-8fd24.firebaseapp.com",
  projectId: "lee2-8fd24",
  storageBucket: "lee2-8fd24.firebasestorage.app",
  messagingSenderId: "171178900740",
  appId: "1:171178900740:web:1553cc0e0081b50eeee451"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firestore에서 질문 실시간 불러오기
function renderQuestions(questions) {
    const list = document.getElementById('questions-list');
    list.innerHTML = '';
    questions.forEach((q) => {
        const box = document.createElement('div');
        box.className = 'question-box';
        box.innerHTML = `
            <div class="question-header">${q.subject}</div>
            <div class="question-content">${q.question}</div>
            <div class="answers" id="answers-${q.id}">
                ${(q.answers||[]).map(a => `<div class='answer-box'>${a}</div>`).join('')}
            </div>
            <form class="answer-form" data-id="${q.id}">
                <input type="text" placeholder="답변을 입력하세요" required>
                <button type="submit">답변</button>
            </form>
        `;
        list.appendChild(box);
    });
}

// 실시간 리스너
// createdAt 내림차순(최신순)
db.collection('questions').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    const questions = [];
    snapshot.forEach(doc => {
        questions.push({ id: doc.id, ...doc.data() });
    });
    renderQuestions(questions);
});

// 질문 등록 이벤트
const questionForm = document.getElementById('question-form');
questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value.trim();
    const question = document.getElementById('question').value.trim();
    if (!subject || !question) return;
    db.collection('questions').add({
        subject,
        question,
        answers: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    questionForm.reset();
});

// 답변 등록 이벤트 (위임)
document.getElementById('questions-list').addEventListener('submit', function(e) {
    if (e.target.classList.contains('answer-form')) {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        const input = e.target.querySelector('input');
        const answer = input.value.trim();
        if (!answer) return;
        const docRef = db.collection('questions').doc(id);
        docRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                const answers = data.answers || [];
                answers.push(answer);
                docRef.update({ answers });
            }
        });
        input.value = '';
    }
});
