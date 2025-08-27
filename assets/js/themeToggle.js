// themeToggle.js - Controla a alternância entre temas claro e escuro

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Verificar se há uma preferência salva
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema salvo ou padrão (claro)
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        body.removeAttribute('data-theme');
        themeToggle.checked = false;
    }
    
    // Alternar tema quando o switch for clicado
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});