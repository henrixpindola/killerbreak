document.getElementById('editLink')?.addEventListener('click', () => {
    const outputText = document.getElementById('outputText');
    const inputText = document.getElementById('inputText');
    
    if (!outputText || !inputText) return;
    
    if (!outputText.value.trim()) {
        alert('Não há texto formatado para editar!');
        return;
    }
    
    inputText.value = outputText.value;
    outputText.value = '';
    inputText.focus();
});