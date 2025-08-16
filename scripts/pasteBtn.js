document.getElementById('pasteBtn').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputText').value = text;
    } catch (err) {
        alert('Erro ao colar. Permita acesso à área de transferência.');
    }
});