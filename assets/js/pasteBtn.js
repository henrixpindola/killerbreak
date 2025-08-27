document.getElementById('pasteBtn')?.addEventListener('click', async function() {
    const inputText = document.getElementById('inputText');
    
    if (!inputText) {
        alert('Campo de entrada não encontrado!');
        return;
    }
    
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
        // Feedback visual opcional
        inputText.focus();
    } catch (err) {
        alert('Erro ao colar. Permita acesso à área de transferência.');
    }
});