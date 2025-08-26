document.getElementById('removeBreaks')?.addEventListener('change', function() {
    if (typeof processText === 'function') {
        processText(); // Reexecuta o processamento do texto
    }
});