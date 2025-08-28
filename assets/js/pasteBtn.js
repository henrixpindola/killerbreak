document.getElementById('pasteBtn')?.addEventListener('click', async function() {//adiciona um listener de clique ao botão de colar
    const inputText = document.getElementById('inputText');
    
    if (!inputText) {
        alert('Campo de entrada não encontrado!');
        return;
    }
    
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
        inputText.focus();
    } catch (err) {

    }
});