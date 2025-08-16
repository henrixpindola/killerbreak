document.getElementById('addCustomWord').addEventListener('click', () => {
    const wordInput = document.getElementById('customWords');
    const word = wordInput.value.trim();
    if (word) {
        wordList.addWord(word);
        wordInput.value = '';
    }
});