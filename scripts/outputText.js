function initOutputManager() {
    const output = document.getElementById('outputText');
    
    if (!output) {
        console.warn('Output element not found');
        return;
    }
    
    output.value = '';
    output.readOnly = true;
    output.placeholder = 'Texto formatado aparecerá aqui...';
    
    // Retorna funções para manipular o output
    return {
        clear: function() {
            output.value = '';
        },
        setText: function(text) {
            output.value = text;
        }
    };
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    window.outputManager = initOutputManager();
});