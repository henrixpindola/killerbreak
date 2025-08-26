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
        this.cleanupConflictingListeners();
        this.setupEventListeners();
        console.log('CheckboxGroup inicializado - Modo Exclusivo');
    }

    function cleanupConflictingListeners() {
        capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                const clone = checkbox.cloneNode(true);
                checkbox.parentNode.replaceChild(clone, checkbox);
            }
        });
    }

    function setupEventListeners() {
        capitalizationIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.handleCapitalizationChange(e.target, id);
                });
            }
        });
        
        const inputText = document.getElementById('inputText');
        if (inputText) {
            inputText.addEventListener('input', () => this.triggerTextProcessing());
        }
        
        document.addEventListener('wordListUpdated', () => this.triggerTextProcessing());
    }

    function handleCapitalizationChange(checkbox, changedId) {
        if (checkbox.checked) {
            // Se está marcando, desmarca TODAS as outras
            this.uncheckAllExcept(changedId);
        } else {
            // Se está desmarcando, verifica se é a única marcada
            // Se for a única, permite desmarcar (estado "nenhum")
            // Se não for a única, impede desmarque
            const currentlyChecked = this.getCurrentlyCheckedIds();
            if (currentlyChecked.length > 1 && currentlyChecked.includes(changedId)) {
                // Há outras marcadas E esta está entre elas → impede desmarque
                checkbox.checked = true;
                return;
            }
            // Se é a única marcada, permite desmarcar (checkbox.checked já é false)
        }
        this.triggerTextProcessing();
    }

    function uncheckAllExcept(activeId) {
        capitalizationIds.forEach(id => {
            if (id !== activeId) {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = false;
                }
            }
        });
    }

    // NOVO: Retorna array com IDs das checkboxes marcadas
    function getCurrentlyCheckedIds() {
        return capitalizationIds.filter(id => {
            const checkbox = document.getElementById(id);
            return checkbox?.checked;
        });
    }

    function countCheckedBoxes() {
        return this.getCurrentlyCheckedIds().length;
    }

    function getActiveCapitalization() {
        const checked = this.getCurrentlyCheckedIds();
        return checked.length > 0 ? checked[0] : null;
    }

    function triggerTextProcessing() {
        clearTimeout(processingTimeout);
        processingTimeout = setTimeout(() => {
            document.dispatchEvent(new CustomEvent('checkboxGroupUpdated'));
            if (typeof TextProcessor?.process === 'function') {
                TextProcessor.process();
            }
        }, 100);
    }

    return {
        init,
        getActiveCapitalization,
        triggerTextProcessing
    };
}

// Instância global
const checkboxGroup = createCheckboxGroup();

function initializeCheckboxGroup() {
    setTimeout(() => {
        checkboxGroup.init();
    }, 50);
}

// ⚠️ CÓDIGO DE EMERGÊNCIA - força o comportamento "um ou nenhum"
function enforceExclusiveCheckboxes() {
    const ids = [
        'todasMaiusculas', 
        'todasMinusculas', 
        'iniciaisPalavras',
        'firstLetterUppercase', 
        'firstLetterSentence'
    ];
    
    // Função que desmarca todas exceto a especificada
    function uncheckOthers(activeId) {
        ids.forEach(id => {
            if (id !== activeId) {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = false;
            }
        });
    }
    
    // Adiciona listeners para cada checkbox
    ids.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            // Remove qualquer listener existente
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
            
            // Adiciona novo listener
            newCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    uncheckOthers(id);
                } else {
                    // Se está desmarcando, verifica se é a única
                    const checkedCount = ids.filter(otherId => {
                        const otherCheckbox = document.getElementById(otherId);
                        return otherCheckbox?.checked;
                    }).length;
                    
                    // Se não é a única, impede desmarque
                    if (checkedCount > 1) {
                        this.checked = true;
                    }
                }
                
                // Dispara processamento de texto
                if (typeof checkboxGroup?.triggerTextProcessing === 'function') {
                    checkboxGroup.triggerTextProcessing();
                } else if (typeof TextProcessor?.process === 'function') {
                    TextProcessor.process();
                }
            });
        }
    });
    
    console.log('Modo emergência ativado - Comportamento exclusivo forçado');
}

// Executa o modo emergência após um delay
setTimeout(() => {
    enforceExclusiveCheckboxes();
}, 1000);

document.addEventListener('DOMContentLoaded', initializeCheckboxGroup);