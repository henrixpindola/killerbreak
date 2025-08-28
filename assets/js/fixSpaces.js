function createSpaceFixer() {//função que cria o objeto SpaceFixer
    let processingTimeout = null;
    
    function init() {
        setupAutoProcessing();
        console.log('SpaceFixer inicializado');
    }
    
    function setupAutoProcessing() {
        // Listeners para eventos que disparam processamento
        document.addEventListener('checkboxGroupUpdated', debounceProcess);
        
        // Input em tempo real
        const inputText = document.getElementById('inputText');
        if (inputText) {
            inputText.addEventListener('input', debounceProcess);
        }
        
        // Processamento inicial
        debounceProcess();
    }
    
function processText() {//função que processa o texto
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const removeBreaks = document.getElementById('removeBreaks');
    
    if (!inputText || !outputText || !removeBreaks) {
        console.warn('Elementos não encontrados para processamento');
        return;
    }
    
    let text = inputText.value;
    const shouldFixSpaces = removeBreaks.checked;
    
    if (shouldFixSpaces) {//verifica se o checkbox de remover quebras está marcado
    text = fixSpaces(text);
    }
    
    text = applyCapitalization(text);//aplica a capitalização selecionada
    
    outputText.value = text;
}
    
    function fixSpaces(text) {//função que corrige os espaços no texto
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
    
    function applyCapitalization(text) {//função que aplica a capitalização ao texto
        const activeMode = window.checkboxGroup?.getActiveCapitalization?.();
        if (!activeMode) return text;
        
        const strategies = {
            'AllUppercase': () => text.toUpperCase(),
            'AllLowercase': () => text.toLowerCase(),
            'CapitalLetters': () => text.replace(/\b\w/g, char => char.toUpperCase()),
            'firstLetterUppercase': () => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
            'firstLetterSentence': () => text.replace(/(?:^|[.!?]\s+)(\w)/g, match => match.toUpperCase())
        };
        
        return strategies[activeMode]?.() || text;
    }
        
    function debounceProcess() {//função que debouça o processamento de texto
        clearTimeout(processingTimeout);
        processingTimeout = setTimeout(() => {
            processText();
        }, 150);
    }
    
}

const spaceFixer = createSpaceFixer();//cria o objeto SpaceFixer
document.addEventListener('DOMContentLoaded', () => spaceFixer.init());