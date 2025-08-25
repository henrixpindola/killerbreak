function createCheckboxGroup() {
    const capitalizationIds = [
        'todasMaiusculas', 
        'todasMinusculas',
        'iniciaisPalavras',
        'firstLetterUppercase',
        'firstLetterSentence'
    ];
    
    let processingTimeout = null;
    
    function init() {
        this.setupLineBreakDependencies();
        this.setupCapitalizationGroup();
        this.setupGlobalListeners();
        console.log('CheckboxGroup inicializado');
    }
    
    function setupLineBreakDependencies() {
        const removeBreaks = document.getElementById('removeBreaks');
        const keepBlankLines = document.getElementById('keepBlankLines');
        
        if (!removeBreaks || !keepBlankLines) return;
        
        // Estado inicial
        keepBlankLines.disabled = !removeBreaks.checked;
        
        // Event listeners com processamento automático
        removeBreaks.addEventListener('change', () => {
            keepBlankLines.disabled = !removeBreaks.checked;
            if (!removeBreaks.checked) {
                keepBlankLines.checked = false;
            }
            this.triggerTextProcessing();
        });
        
        keepBlankLines.addEventListener('change', () => {
            if (keepBlankLines.checked && !removeBreaks.checked) {
                keepBlankLines.checked = false;
                return;
            }
            this.triggerTextProcessing();
        });
    }
    
    function setupCapitalizationGroup() {
        capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                // Remove listener anterior para evitar duplicação
                const freshCheckbox = checkbox.cloneNode(true);
                checkbox.parentNode.replaceChild(freshCheckbox, checkbox);
                
                freshCheckbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        // Desmarca todas as outras checkboxes de capitalização
                        this.uncheckOtherCapitalization(id);
                    }
                    this.triggerTextProcessing();
                });
            }
        });
    }
    
    function setupGlobalListeners() {
        // Monitora mudanças em outros componentes
        document.addEventListener('wordListUpdated', () => {
            this.triggerTextProcessing();
        });
        
        // Input em tempo real
        const inputText = document.getElementById('inputText');
        if (inputText) {
            inputText.addEventListener('input', () => {
                this.triggerTextProcessing();
            });
        }
    }
    
    function uncheckOtherCapitalization(activeId) {
        capitalizationIds.filter(id => id !== activeId).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
                // Dispara evento change manualmente para garantir
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }
    
    function getActiveCapitalization() {
        return capitalizationIds.find(id => {
            const checkbox = document.getElementById(id);
            return checkbox?.checked;
        });
    }
    
    function isAnyCapitalizationActive() {
        return this.getActiveCapitalization() !== undefined;
    }
    
    function clearAllCapitalization() {
        capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
                // Dispara evento change manualmente
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }
    
    function triggerTextProcessing() {
        clearTimeout(processingTimeout);
        processingTimeout = setTimeout(() => {
            // Dispara evento global
            document.dispatchEvent(new CustomEvent('checkboxGroupUpdated'));
            
            // Chama processamento do TextProcessor se disponível
            if (typeof TextProcessor !== 'undefined' && typeof TextProcessor.process === 'function') {
                TextProcessor.process();
            }
            // Ou chama OutputManager se disponível
            else if (typeof outputManager !== 'undefined' && typeof outputManager.update === 'function') {
                outputManager.update();
            }
        }, 100);
    }
    
    // API pública
    return {
        init: init.bind(this),
        getActiveCapitalization: getActiveCapitalization.bind(this),
        isAnyCapitalizationActive: isAnyCapitalizationActive.bind(this),
        clearAllCapitalization: clearAllCapitalization.bind(this),
        triggerTextProcessing: triggerTextProcessing.bind(this),
        uncheckOtherCapitalization: uncheckOtherCapitalization.bind(this)
    };
}

// Instância global
const checkboxGroup = createCheckboxGroup();
document.addEventListener('DOMContentLoaded', () => checkboxGroup.init());