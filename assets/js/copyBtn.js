document.getElementById('copyBtn').addEventListener('click', async () => {/*adiciona um listener de clique ao botão de copiar*/
    const outputText = document.getElementById('outputText');/*seleciona a área de texto de saída*/
    
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