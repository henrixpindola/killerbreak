const customWordsList = document.getElementById('customWordsList');
let words = [];

function updateWordList() {
    customWordsList.innerHTML = '';
    words.forEach((word, index) => {
        const li = document.createElement('li');
        
        // Cria span para a palavra
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        wordSpan.className = 'word-text';
        
        // Cria botão de editar
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.onclick = () => editWordInline(index, wordSpan);
        editBtn.title = 'Editar palavra';
        editBtn.className = 'edit-btn';
        
        // Cria botão de remover
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '❌';
        removeBtn.onclick = () => removeWord(index);
        removeBtn.title = 'Remover palavra';
        removeBtn.className = 'remove-btn';
        
        // Adiciona elementos ao li
        li.appendChild(wordSpan);
        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        
        customWordsList.appendChild(li);
    });
}

function editWordInline(index, wordSpan) {
    const currentWord = words[index];
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentWord;
    input.className = 'edit-input';
    
    // Substitui o span pelo input
    wordSpan.style.display = 'none';
    wordSpan.parentNode.insertBefore(input, wordSpan);
    input.focus();
    input.select();
    
    function saveEdit() {
        const newWord = input.value.trim();
        if (newWord && newWord !== currentWord) {
            words[index] = newWord;
            saveWords();
        }
        wordSpan.textContent = words[index];
        wordSpan.style.display = 'inline';
        input.remove();
    }
    
    function cancelEdit() {
        wordSpan.style.display = 'inline';
        input.remove();
    }
    
    // Salva ao pressionar Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
    
    // Salva ao perder foco
    input.addEventListener('blur', saveEdit);
}

function removeWord(index) {
    if (confirm('Tem certeza que deseja remover esta palavra?')) {
        words.splice(index, 1);
        updateWordList();
        saveWords();
    }
}

// Função para obter palavras (usada por inputText.js)
window.getCustomWords = function() {
    return [...words];
}

// Função para adicionar palavra
window.addCustomWord = function(word) {
    if (word && word.trim() !== '' && !words.includes(word.trim())) {
        words.push(word.trim());
        updateWordList();
        saveWords();
        return true;
    }
    return false;
}

// Função para limpar lista
window.clearCustomWords = function() {
    if (confirm('Tem certeza que deseja limpar toda a lista de palavras?')) {
        words = [];
        updateWordList();
        saveWords();
    }
}

// Salva no localStorage quando houver modificações
function saveWords() {
    localStorage.setItem('customWords', JSON.stringify(words));
}

// Inicializa a lista se houver dados salvos e configura event listeners
document.addEventListener('DOMContentLoaded', function() {
    const savedWords = localStorage.getItem('customWords');
    if (savedWords) {
        words = JSON.parse(savedWords);
        updateWordList();
    }
    
    // Event listener para o botão "Adicionar"
    document.getElementById('addCustomWord').addEventListener('click', () => {
        const wordInput = document.getElementById('customWords');
        const word = wordInput.value.trim();
        if (word) {
            if (window.addCustomWord(word)) {
                wordInput.value = '';
            }
        }
    });
    
    // Event listener para Enter no campo de input
    document.getElementById('customWords').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('addCustomWord').click();
        }
    });
    
    // Event listener para o botão "Limpar Lista"
    document.getElementById('clearCustomWords').addEventListener('click', () => {
        window.clearCustomWords();
    });
});
