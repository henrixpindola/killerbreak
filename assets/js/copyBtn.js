document.getElementById('copyBtn').addEventListener('click', async () => {
    const outputText = document.getElementById('outputText');
    
    try {
        await navigator.clipboard.writeText(outputText.value);
        alert('Texto copiado!');
    } catch (err) {
        try {
            outputText.select();
            document.execCommand('copy');
            alert('Texto copiado! 📋');
        } catch (error) {
            alert('Erro ao copiar texto');
        }
    }
});