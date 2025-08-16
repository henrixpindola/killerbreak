class OutputManager {
    static init() {
        this.output = document.getElementById('outputText');
        this.output.value = '';
        this.output.readOnly = true;
        this.output.placeholder = 'Texto formatado aparecerá aqui...';
    }
}

document.addEventListener('DOMContentLoaded', () => OutputManager.init());