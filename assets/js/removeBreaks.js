document.getElementById('removeBreaks')?.addEventListener('change', function() {//adiciona um listener de mudança ao checkbox de remover quebras de linha
    if (typeof processText === 'function') {
        processText(); // Reexecuta o processamento do texto
    }
});