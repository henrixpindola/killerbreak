const WordList = {
    MAX_WORDS: 18,
    words: [],
    
    init: function() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
    },
    
    loadFromStorage: function() {
        const saved = localStorage.getItem('customWords');
        this.words = saved ? JSON.parse(saved) : [];
    },
    
    setupEventListeners: function() {
        document.getElementById('addCustomWord')?.addEventListener('click', () => {
            const input = document.getElementById('customWords');
            const word = input?.value.trim();
            
            if (this.addWord(word)) {
                input.value = '';
                this.notifyUpdate();
            }
        });
        
        document.getElementById('clearCustomWords')?.addEventListener('click', () => {
            if (this.clear()) {
                this.notifyUpdate();
            }
        });
        
        document.getElementById('customWords')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addCustomWord')?.click();
            }
        });
    },
    
    addWord: function(word) {
        if (!word) return false;
        
        if (this.words.some(w => w.toLowerCase() === word.toLowerCase())) {
            alert('Esta palavra (ou variação) já existe!');
            return false;
        }
        
        if (this.words.length >= this.MAX_WORDS) {
            alert(`Limite máximo de ${this.MAX_WORDS} palavras atingido!`);
            return false;
        }
        
        this.words.push(word);
        this.save();
        return true;
    },
    
    removeWord: function(word) {
        this.words = this.words.filter(w => w !== word);
        this.save();
        this.notifyUpdate();
    },
    
    clear: function() {
        if (this.words.length === 0) return false;
        
        if (confirm('Tem certeza que deseja limpar toda a lista?')) {
            this.words = [];
            this.save();
            return true;
        }
        return false;
    },
    
    save: function() {
        localStorage.setItem('customWords', JSON.stringify(this.words));
    },
    
    updateUI: function() {
        const listElement = document.getElementById('customWordsList');
        if (!listElement) return;
        
        listElement.innerHTML = this.words.map(word => `
            <li>
                ${this.escapeHTML(word)}
                <button onclick="WordList.removeWord('${this.escapeHTML(word)}')">❌</button>
            </li>
        `).join('');
    },
    
    escapeHTML: function(str) {
        return str.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;');
    },
    
    notifyUpdate: function() {
        this.updateUI();
        document.dispatchEvent(new CustomEvent('wordListUpdated'));
    },
    
    getWords: function() {
        return [...this.words];
    }
};

document.addEventListener('DOMContentLoaded', () => WordList.init());