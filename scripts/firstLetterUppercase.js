document.getElementById('firstLetterUppercase').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('firstLetterSentence').checked = false;
    }
    processText();
});