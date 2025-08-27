// reader.js - Modal de informações do Killerbreak
// assets/js/reader.js

function setupReaderModal() {
    // Elementos do modal
    const modal = document.getElementById('readerModal');
    const attentionIcon = document.querySelector('.attention-icon');
    const closeBtn = document.querySelector('.reader-modal-close');
    
    if (!modal || !attentionIcon) {
        console.warn('Elementos do modal não encontrados');
        return;
    }
    function autoExpand(textarea) {
        // Reset da altura para que possa encolher também
        textarea.style.height = 'auto';
        // Define a altura com base no scrollHeight
        textarea.style.height = (textarea.scrollHeight) + 'px';
        
        // Atualiza o contador de caracteres
        updateCharCount(textarea);
    }
    
    
    // Conteúdo do modal (já está no HTML, apenas garantir funcionalidade)
    console.log('Modal reader encontrado, configurando eventos...');
    
    // Abrir modal ao clicar no ícone de atenção
    attentionIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Abrindo modal...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Impede scroll da página
    });
    
    // Fechar modal
    function closeModal() {
        console.log('Fechando modal...');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura scroll
    }
    
    // Fechar com botão X
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Fechar ao clicar fora do conteúdo do modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fechar com tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Prevenir que eventos subam para elementos pai
    const modalContent = document.querySelector('.reader-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    console.log('Modal reader configurado com sucesso');
}

// ========== DARK MODE FUNCTIONALITY ========== //
function setupDarkMode() {
    const toggleSwitch = document.querySelector('#theme-toggle');
    const themeLabel = document.querySelector('#theme-label');
    
    if (!toggleSwitch) {
        console.warn('Interruptor de dark mode não encontrado');
        return;
    }
    
    // Verificar se há uma preferência salva
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar o tema salvo
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
        if (themeLabel) themeLabel.textContent = 'Modo Escuro';
    }
    
    // Função para alternar o tema
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeLabel) themeLabel.textContent = 'Modo Escuro';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            if (themeLabel) themeLabel.textContent = 'Modo Claro';
        }
    }
    
    // Event listener para mudanças no interruptor
    toggleSwitch.addEventListener('change', switchTheme);
    
    console.log('Dark mode configurado com sucesso');
}

// Função auxiliar para abrir o modal programaticamente
function openReaderModal() {
    const modal = document.getElementById('readerModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Função auxiliar para fechar o modal programaticamente
function closeReaderModal() {
    const modal = document.getElementById('readerModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno delay para garantir que tudo carregou
    setTimeout(() => {
        setupReaderModal();
        setupDarkMode(); // Configurar o dark mode
    }, 100);
});

// Adicionar ao escopo global para acesso externo
window.readerModal = {
    open: openReaderModal,
    close: closeReaderModal
};

// Adicionar função global para controle do tema
window.themeController = {
    toggle: function() {
        const toggleSwitch = document.querySelector('#theme-toggle');
        if (toggleSwitch) {
            toggleSwitch.checked = !toggleSwitch.checked;
            toggleSwitch.dispatchEvent(new Event('change'));
        }
    },
    setTheme: function(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            const toggleSwitch = document.querySelector('#theme-toggle');
            if (toggleSwitch) toggleSwitch.checked = true;
            const themeLabel = document.querySelector('#theme-label');
            if (themeLabel) themeLabel.textContent = 'Modo Claro';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            const toggleSwitch = document.querySelector('#theme-toggle');
            if (toggleSwitch) toggleSwitch.checked = false;
            const themeLabel = document.querySelector('#theme-label');
            if (themeLabel) themeLabel.textContent = 'Modo Escuro';
        }
    },
    getTheme: function() {
        return localStorage.getItem('theme') || 'light';
    }
    
};