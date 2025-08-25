document.getElementById('salvar')?.addEventListener('click', function() {
    const outputText = document.getElementById('outputText')?.value;
    
    if (!outputText?.trim()) {
        alert('Nenhum conteúdo para salvar!');
        return;
    }

    // Cria um blob com o conteúdo
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Cria um elemento de link invisível
    const link = document.createElement('a');
    link.href = url;
    
    // Sugere um nome de arquivo padrão com data/hora
    const date = new Date();
    const defaultName = `texto_formatado_${date.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`;
    
    // Configura o download
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libera memória
    URL.revokeObjectURL(url);
});