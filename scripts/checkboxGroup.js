class CheckboxGroup {
    constructor() {
        this.capitalizationIds = [
            'todasMaiusculas', 
            'todasMinusculas',
            'iniciaisPalavras',
            'firstLetterUppercase',
            'firstLetterSentence'
        ];

        this.init();
    }

    init() {
        this.setupLineBreakDependencies();
        this.setupCapitalizationGroup();
        this.setupCapitalizationListeners();
    }

    setupLineBreakDependencies() {
        const removeBreaks = document.getElementById('removeBreaks');
        const keepBlankLines = document.getElementById('keepBlankLines');

        if (!removeBreaks || !keepBlankLines) return;

        // Estado inicial
        keepBlankLines.disabled = !removeBreaks.checked;

        // Event listeners
        removeBreaks.addEventListener('change', () => {
            keepBlankLines.disabled = !removeBreaks.checked;
            if (!removeBreaks.checked) {
                keepBlankLines.checked = false;
            }
            this.dispatchUpdateEvent();
        });

        keepBlankLines.addEventListener('change', () => {
            if (keepBlankLines.checked && !removeBreaks.checked) {
                keepBlankLines.checked = false;
            }
            this.dispatchUpdateEvent();
        });
    }

    setupCapitalizationGroup() {
        this.capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        this.uncheckOtherCapitalization(id);
                    }
                    this.dispatchUpdateEvent();
                });
            }
        });
    }

    setupCapitalizationListeners() {
        this.capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        this.handleCapitalizationChange(id);
                    }
                    this.triggerTextProcessing();
                });
            }
        });
    }

    uncheckOtherCapitalization(activeId) {
        this.capitalizationIds.filter(id => id !== activeId).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        });
    }

    handleCapitalizationChange(activeId) {
        console.log(`Modo de capitalização ativado: ${activeId}`);
        
        // Lógica específica para cada tipo
        const handlers = {
            'todasMaiusculas': () => this.onTodasMaiusculas(),
            'todasMinusculas': () => this.onTodasMinusculas(),
            'iniciaisPalavras': () => this.onIniciaisPalavras(),
            'firstLetterUppercase': () => this.onFirstLetterUppercase(),
            'firstLetterSentence': () => this.onFirstLetterSentence()
        };

        handlers[activeId]?.();
    }

    onTodasMaiusculas() {
        // Lógica específica para TODAS MAIÚSCULAS
        console.log('Ativando modo TODAS MAIÚSCULAS');
    }

    onTodasMinusculas() {
        // Lógica específica para todas minúsculas
        console.log('Ativando modo todas minúsculas');
    }

    onIniciaisPalavras() {
        // Lógica específica para Iniciais Maiúsculas
        console.log('Ativando modo Iniciais Maiúsculas');
    }

    onFirstLetterUppercase() {
        // Lógica específica para Primeira Letra Maiúscula
        console.log('Ativando modo Primeira Letra Maiúscula');
    }

    onFirstLetterSentence() {
        // Lógica específica para Primeira Letra de Frase
        console.log('Ativando modo Primeira Letra de Frase');
    }

    getActiveCapitalization() {
        return this.capitalizationIds.find(id => {
            const checkbox = document.getElementById(id);
            return checkbox?.checked;
        });
    }

    isAnyCapitalizationActive() {
        return this.getActiveCapitalization() !== undefined;
    }

    clearAllCapitalization() {
        this.capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        });
    }

    triggerTextProcessing() {
        if (window.TextProcessor && typeof TextProcessor.debounceProcess === 'function') {
            TextProcessor.debounceProcess();
        }
    }

    dispatchUpdateEvent() {
        document.dispatchEvent(new CustomEvent('checkboxGroupUpdated'));
    }

    // Método para adicionar novos grupos dinamicamente
    addExclusiveGroup(groupName, checkboxIds) {
        checkboxIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        checkboxIds.filter(otherId => otherId !== id).forEach(otherId => {
                            const otherCheckbox = document.getElementById(otherId);
                            if (otherCheckbox) otherCheckbox.checked = false;
                        });
                    }
                    this.dispatchUpdateEvent();
                });
            }
        });
    }
}

// Instância global única
document.addEventListener('DOMContentLoaded', () => {
    window.checkboxGroup = new CheckboxGroup();
});