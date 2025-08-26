function createOutputManager() {
    const output = document.getElementById('outputText');
    
    if (!output) {
        console.warn('Elemento outputText não encontrado!');
        return null;
    }
    
    // Configuração inicial
    output.value = '';
    output.readOnly = true;
    output.placeholder = 'Texto formatado aparecerá aqui...';
    
    // Função principal que processa e atualiza o output
    function updateOutput() {
        const inputText = document.getElementById('inputText')?.value || '';
        const removeBreaks = document.getElementById('removeBreaks')?.checked || false;
        
        let processedText = inputText;
        
        // Aplica correção de espaços SE o checkbox estiver marcado
        if (removeBreaks) {
            processedText = fixSpaces(processedText);
        }
        
        // Aplica outras transformações (capitalização, palavras customizadas, etc.)
        processedText = applyAllTransformations(processedText);
        
        // Atualiza o output
        output.value = processedText;
    }
    
    function fixSpaces(text) {
        if (typeof text !== 'string') return '';
        
        return text
            .replace(/\s+/g, ' ')           // Múltiplos espaços → um espaço
            .replace(/([.,!?;:])\s+/g, '$1 ') // Espaços após pontuação
            .replace(/\s+([.,!?;:])/g, '$1')  // Espaços antes de pontuação
            .replace(/(\w)\.(\w)/g, '$1. $2') // Espaço após ponto seguido de letra
            .trim();
    }
    
    function applyAllTransformations(text) {
        // 1. Capitalização
        text = applyCapitalization(text);
        
        // 2. Palavras customizadas (se existir)
        if (window.wordList?.getWords) {
            text = applyCustomWords(text, window.wordList.getWords());
        }
        
        // 3. Outras transformações podem ser adicionadas aqui
        
        return text;
    }
    
    function applyCapitalization(text) {
        const activeMode = window.checkboxGroup?.getActiveCapitalization?.();
        if (!activeMode) return text;
        
        const strategies = {
            'AllUppercase': () => text.toUpperCase(),
            'AllLowercase': () => text.toLowerCase(),
            'CapitalLetters': () => text.replace(/\b\w/g, char => char.toUpperCase()),
            'firstLetterUppercase': () => text.charAt(0).toUpperCase() + text.slice(1),
            'firstLetterSentence': () => text.replace(/(?:^|[.!?]\s+)(\w)/g, match => match.toUpperCase())
        };
        
        return strategies[activeMode]?.() || text;
    }
    
    function applyCustomWords(text, customWords) {
        if (!customWords || customWords.length === 0) return text;
        
        let processedText = text;
        customWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            processedText = processedText.replace(regex, word);
        });
        
        return processedText;
    }
    
    // Setup de event listeners para atualização automática
    function setupAutoUpdate() {
        // Listeners para todos os eventos relevantes
        document.addEventListener('checkboxGroupUpdated', updateOutput);
        document.addEventListener('wordListUpdated', updateOutput);
        
        // Input em tempo real
        const inputText = document.getElementById('inputText');
        if (inputText) {
            inputText.addEventListener('input', debounce(updateOutput, 200));
        }
        
        // Checkbox de corrigir espaços (ESPECÍFICO PARA O PROBLEMA)
        const removeBreaks = document.getElementById('removeBreaks');
        if (removeBreaks) {
            removeBreaks.addEventListener('change', updateOutput);
        }
        
        // Processamento inicial
        updateOutput();
    }
    
    // Função debounce para performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Inicialização
    setupAutoUpdate();
    
    // API pública
    return {
        clear: function() {
            output.value = '';
        },
        setText: function(text) {
            output.value = text;
        },
        update: updateOutput,
        getValue: function() {
            return output.value;
        }
    };
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    window.outputManager = createOutputManager();
    
    // Força uma atualização inicial após tudo carregar
    setTimeout(() => {
        if (window.outputManager?.update) {
            window.outputManager.update();
        }
    }, 500);
});