const customWordsList = document.getElementById('customWordsList');
let words = [];

function updateWordList() {
    customWordsList.innerHTML = '';
    words.forEach((word, index) => {
        const li = document.createElement('li');
        
        // Cria span para a palavra
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        
        // Cria botão de editar
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.onclick = () => editWord(index);
        editBtn.title = 'Editar palavra';
        
        // Cria botão de remover
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = 'X';
        removeBtn.onclick = () => removeWord(index);
        removeBtn.title = 'Remover palavra';
        
        // Adiciona elementos ao li
        li.appendChild(wordSpan);
        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        
        customWordsList.appendChild(li);
    });
}

function editWord(index) {
    const newWord = prompt('Editar palavra:', words[index]);
    if (newWord && newWord.trim() !== '') {
        words[index] = newWord.trim();
        updateWordList();
    }
}

function removeWord(index) {
    if (confirm('Tem certeza que deseja remover esta palavra?')) {
        words.splice(index, 1);
        updateWordList();
    }
}

// Função para adicionar palavra (chamada por addCustomWord.js)
window.addCustomWord = function(word) {
    if (word && word.trim() !== '' && !words.includes(word.trim())) {
        words.push(word.trim());
        updateWordList();
        return true;
    }
    return false;
}

// Função para limpar lista (chamada por clearCustomWords.js)
window.clearCustomWords = function() {
    if (confirm('Tem certeza que deseja limpar toda a lista de palavras?')) {
        words = [];
        updateWordList();
    }
}

// Função para obter palavras (usada por inputText.js)
window.getCustomWords = function() {
    return [...words];
}

// Inicializa a lista se houver dados salvos
document.addEventListener('DOMContentLoaded', function() {
    const savedWords = localStorage.getItem('customWords');
    if (savedWords) {
        words = JSON.parse(savedWords);
        updateWordList();
    }
});

// Salva no localStorage quando houver modificações
function saveWords() {
    localStorage.setItem('customWords', JSON.stringify(words));
}

// Modifica as funções para salvar automaticamente
const originalEditWord = window.editWord;
window.editWord = function(index) {
    originalEditWord(index);
    saveWords();
}

const originalRemoveWord = window.removeWord;
window.removeWord = function(index) {
    originalRemoveWord(index);
    saveWords();
}

window.addCustomWord = function(word) {
    const success = originalAddCustomWord(word);
    if (success) {
        saveWords();
    }
    return success;
}

window.clearCustomWords = function() {
    const originalClear = window.clearCustomWords;
    originalClear();
    saveWords();
}