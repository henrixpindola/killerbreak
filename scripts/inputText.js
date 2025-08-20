class TextProcessor {
    static MAX_CHARS = 320;
    static debounceTimer;

    static init() {
        this.input = document.getElementById('inputText');
        this.output = document.getElementById('outputText');
        
        this.input.maxLength = this.MAX_CHARS;
        this.input.addEventListener('input', () => this.debounceProcess());
        

        document.addEventListener('checkboxGroupUpdated', () => this.process());
    }

    static debounceProcess() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.process(), 200);
    }

    static process() {
        const text = this.input.value.slice(0, this.MAX_CHARS);
        this.output.value = this.applyAllRules(text);
    }

    static applyAllRules(text) {
        if (!text.trim()) return '';

        text = this.applyCustomWords(text);
        text = this.processLineBreaks(text);
        
        if (document.getElementById('fixSpaces').checked) {
            text = text.replace(/[^\S\n]+/g, ' ').trim();
        }
        
        text = this.applyCapitalization(text);
        return text;
    }

    static processLineBreaks(text) {
        const removeBreaks = document.getElementById('removeBreaks').checked;
        const keepBlankLines = document.getElementById('keepBlankLines').checked;

        if (!removeBreaks) {
            return text; // Mantém todas as quebras originais
        }

        if (keepBlankLines) {
            // Padrão para identificar blocos de texto entre linhas vazias
            const paragraphs = text.split(/(\n{2,})/);
            let result = '';
            
            for (let i = 0; i < paragraphs.length; i++) {
                if (paragraphs[i].startsWith('\n')) {
                    // Mantém as linhas vazias exatamente como estão
                    result += paragraphs[i];
                } else {
                    // Remove quebras de linha simples dentro do parágrafo
                    result += paragraphs[i].replace(/\n/g, ' ');
                }
            }
            
            return result;
        } else {
            // Remove TODAS as quebras
            return text.replace(/\n+/g, ' ');
        }
    }

    static applyCustomWords(text) {
        const customWords = window.getCustomWords ? window.getCustomWords() : [];
        if (customWords.length === 0) return text;

        customWords.sort((a, b) => b.length - a.length).forEach(word => {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            text = text.replace(regex, word);
        });
        
        return text;
    }

    static applyCapitalization(text) {
        const customWords = window.getCustomWords ? window.getCustomWords() : [];
        
        if (document.getElementById('todasMaiusculas').checked) {
            return this.transformExceptCustomWords(text, 'uppercase', customWords);
        }
        
        if (document.getElementById('todasMinusculas').checked) {
            return this.transformExceptCustomWords(text, 'lowercase', customWords);
        }
        
        if (document.getElementById('iniciaisPalavras').checked) {
            return this.transformExceptCustomWords(text, 'titleCase', customWords);
        }
        
        if (document.getElementById('firstLetterUppercase').checked) {
            return this.capitalizeFirstLetter(text, customWords);
        }
        
        if (document.getElementById('firstLetterSentence').checked) {
            return this.capitalizeSentences(text, customWords);
        }

        return text;
    }

    static transformExceptCustomWords(text, mode, customWords) {
        if (customWords.length === 0) {
            return this.applyTransform(text, mode);
        }

        const parts = [];
        let lastIndex = 0;
        const regex = new RegExp(`\\b(${customWords.join('|')})\\b`, 'gi');

        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    text: text.slice(lastIndex, match.index),
                    transform: true
                });
            }
            
            parts.push({
                text: match[0],
                transform: false
            });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push({
                text: text.slice(lastIndex),
                transform: true
            });
        }

        return parts.map(part => {
            return part.transform 
                ? this.applyTransform(part.text, mode) 
                : part.text;
        }).join('');
    }

    static applyTransform(text, mode) {
        switch (mode) {
            case 'uppercase': return text.toUpperCase();
            case 'lowercase': return text.toLowerCase();
            case 'titleCase': 
                return text.replace(/\b\w/g, char => char.toUpperCase());
            default: return text;
        }
    }

    static capitalizeFirstLetter(text, customWords) {
        if (text.length === 0) return text;
        
        const firstWord = text.split(/\s+/)[0];
        if (customWords.some(word => 
            word.toLowerCase() === firstWord.toLowerCase())) {
            return text;
        }
        
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static capitalizeSentences(text, customWords) {
        return text.replace(/(^|[.!?]\s+)(\w)/g, (match, prefix, firstLetter) => {
            const isCustom = customWords.some(word => 
                word.toLowerCase() === (prefix + firstLetter).toLowerCase());
            
            return isCustom ? match : prefix + firstLetter.toUpperCase();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => TextProcessor.init());