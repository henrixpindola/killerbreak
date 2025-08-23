function createSpaceFixer() {
    let processingTimeout = null;
    
    function init() {
        setupAutoProcessing();
        console.log('SpaceFixer inicializado');
    }
    
    function setupAutoProcessing() {
        // Listeners para eventos que disparam processamento
        document.addEventListener('checkboxGroupUpdated', debounceProcess);
        document.addEventListener('wordListUpdated', debounceProcess);
        
        // Input em tempo real
        const inputText = document.getElementById('inputText');
        if (inputText) {
            inputText.addEventListener('input', debounceProcess);
        }
        
        // Processamento inicial
        debounceProcess();
    }
    
    function processText() {
        const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const removeBreaks = document.getElementById('removeBreaks');
        
        if (!inputText || !outputText || !removeBreaks) {
            console.warn('Elementos não encontrados para processamento');
            return;
        }
        
        let text = inputText.value;
        const shouldFixSpaces = removeBreaks.checked;
        
        // Aplica correção de espaços se o checkbox estiver marcado
        if (shouldFixSpaces) {
            text = fixSpaces(text);
        }
        
        // Aplica outras transformações (se houver)
        text = applyCapitalization(text);
        text = applyCustomWords(text);
        
        outputText.value = text;
    }
    
    function fixSpaces(text) {
        if (typeof text !== 'string') return '';
        
        return text
            .replace(/\s+/g, ' ')           // Múltiplos espaços → um espaço
            .replace(/([.,!?;:])\s+/g, '$1 ') // Espaços após pontuação
            .replace(/\s+([.,!?;:])/g, '$1')  // Espaços antes de pontuação
            .replace(/(\w)\.(\w)/g, '$1. $2') // Espaço após ponto seguido de letra
            .replace(/([.!?])\s*(\w)/g, (match, punct, letter) => 
                `${punct} ${letter.toUpperCase()}`
            )
            .trim();
    }
    
    function applyCapitalization(text) {
        const activeMode = window.checkboxGroup?.getActiveCapitalization?.();
        if (!activeMode) return text;
        
        const strategies = {
            'todasMaiusculas': () => text.toUpperCase(),
            'todasMinusculas': () => text.toLowerCase(),
            'iniciaisPalavras': () => text.replace(/\b\w/g, char => char.toUpperCase()),
            'firstLetterUppercase': () => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
            'firstLetterSentence': () => text.replace(/(?:^|[.!?]\s+)(\w)/g, match => match.toUpperCase())
        };
        
        return strategies[activeMode]?.() || text;
    }
    
    function applyCustomWords(text) {
        const customWords = window.wordList?.getWords?.() || [];
        if (customWords.length === 0) return text;
        
        let processedText = text;
        customWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            processedText = processedText.replace(regex, word);
        });
        
        return processedText;
    }
    
    function debounceProcess() {
        clearTimeout(processingTimeout);
        processingTimeout = setTimeout(() => {
            processText();
        }, 150);
    }
    
    // API pública
    return {
        init,
        processText,
        fixSpaces,
        debounceProcess
    };
}

// Inicialização
const spaceFixer = createSpaceFixer();
document.addEventListener('DOMContentLoaded', () => spaceFixer.init());