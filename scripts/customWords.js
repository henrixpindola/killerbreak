const customWordsList = document.getElementById('customWordsList');
let words = [];

function updateWordList() {
    customWordsList.innerHTML = '';
    words.forEach((word, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${word}
            <button onclick="editWord(${index})">✏️</button>
            <button onclick="removeWord(${index})">❌</button>
        `;
        customWordsList.appendChild(li);
    });
}

window.editWord = (index) => {
    const newWord = prompt('Editar palavra:', words[index]);
    if (newWord) words[index] = newWord;
    updateWordList();
};

window.removeWord = (index) => {
    words.splice(index, 1);
    updateWordList();
};