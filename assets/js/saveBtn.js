document.getElementById('saveBtn')?.addEventListener('click', function() {//adiciona um listener de clique ao botão de salvar
    const outputText = document.getElementById('outputText')?.value;
    
    if (!outputText?.trim()) {
        return;
    }

    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });// Cria um Blob com o conteúdo do texto
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');// Cria um elemento de link temporário
    link.href = url;
    
    const date = new Date();// Gera um nome de arquivo com timestamp
    const defaultName = `texto_formatado_${date.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`;
    
    link.download = defaultName;// Define o nome do arquivo para download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);// Libera o objeto URL criado
});