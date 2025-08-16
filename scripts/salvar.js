document.getElementById('salvar').addEventListener('click', () => {
    const outputText = document.getElementById('outputText').value;
    
    if (!outputText.trim()) {
        alert('Nenhum conteúdo para salvar!');
        return;
    }

    // Cria um blob com o conteúdo
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    
    // Cria um elemento de link invisível
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Sugere um nome de arquivo padrão com data/hora
    const date = new Date();
    const defaultName = `texto_formatado_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}.txt`;
    
    // Permite ao usuário escolher o nome/local
    link.download = defaultName; // Nome sugerido
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libera memória
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
    }, 100);
});