class WordList {
    static MAX_WORDS = 18;
    static words = [];

    static init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
    }

    static loadFromStorage() {
        const saved = localStorage.getItem('customWords');
        this.words = saved ? JSON.parse(saved) : [];
    }

    static setupEventListeners() {
        document.getElementById('addCustomWord').addEventListener('click', () => {
            const input = document.getElementById('customWords');
            const word = input.value.trim();
            
            if (this.addWord(word)) {
                input.value = '';
                this.notifyUpdate();
            }
        });

        document.getElementById('clearCustomWords').addEventListener('click', () => {
            if (this.clear()) {
                this.notifyUpdate();
            }
        });

        document.getElementById('customWords').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addCustomWord').click();
            }
        });
    }

    static addWord(word) {
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
    }

    static removeWord(word) {
        this.words = this.words.filter(w => w !== word);
        this.save();
        this.notifyUpdate();
    }

    static clear() {
        if (this.words.length === 0) return false;
        
        if (confirm('Tem certeza que deseja limpar toda a lista?')) {
            this.words = [];
            this.save();
            return true;
        }
        return false;
    }

    static save() {
        localStorage.setItem('customWords', JSON.stringify(this.words));
    }

    static updateUI() {
        const listElement = document.getElementById('customWordsList');
        listElement.innerHTML = this.words.map(word => `
            <li>
                ${word}
                <button onclick="WordList.removeWord('${word}')">❌</button>
            </li>
        `).join('');
    }

    static notifyUpdate() {
        this.updateUI();
        document.dispatchEvent(new CustomEvent('wordListUpdated'));
    }

    static getWords() {
        return [...this.words];
    }
}

document.addEventListener('DOMContentLoaded', () => WordList.init());