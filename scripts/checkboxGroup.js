class CheckboxGroup {
    static init() {
        // 1. Configura grupos exclusivos
        const capitalizacaoGroup = [
            'todasMaiusculas', 
            'todasMinusculas',
            'iniciaisPalavras',
            'firstLetterUppercase',
            'firstLetterSentence'
        ];
        
        this.setupExclusiveGroups([capitalizacaoGroup]);
        
        // 2. Configura dependência das quebras de linha
        this.setupLineBreakDependencies();
    }

    static setupLineBreakDependencies() {
        const removeBreaks = document.getElementById('removeBreaks');
        const keepBlankLines = document.getElementById('keepBlankLines');

        // Inicializa estado
        keepBlankLines.disabled = !removeBreaks.checked;

        removeBreaks.addEventListener('change', () => {
            keepBlankLines.disabled = !removeBreaks.checked;
            if (!removeBreaks.checked) {
                keepBlankLines.checked = false;
            }
            document.dispatchEvent(new Event('checkboxGroupUpdated'));
        });

        keepBlankLines.addEventListener('change', () => {
            if (keepBlankLines.checked && !removeBreaks.checked) {
                keepBlankLines.checked = false;
            }
            document.dispatchEvent(new Event('checkboxGroupUpdated'));
        });
    }

    static setupExclusiveGroups(groups) {
        groups.forEach(group => {
            group.forEach(id => {
                document.getElementById(id).addEventListener('change', (e) => {
                    if (e.target.checked) {
                        group.filter(x => x !== id).forEach(otherId => {
                            document.getElementById(otherId).checked = false;
                        });
                    }
                    document.dispatchEvent(new Event('checkboxGroupUpdated'));
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => CheckboxGroup.init());