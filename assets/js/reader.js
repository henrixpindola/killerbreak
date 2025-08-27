// reader.js - Modal de informações do Killerbreak
function setupReaderModal() {
    // Elementos do modal
    const modal = document.getElementById('readerModal');
    const attentionIcon = document.querySelector('.attention-icon');
    const closeBtn = document.querySelector('.reader-modal-close');
    
    if (!modal || !attentionIcon) {
        console.warn('Elementos do modal não encontrados');
        return;
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

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno delay para garantir que tudo carregou
    setTimeout(() => {
        setupReaderModal();
    }, 100);
});

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

// Adicionar ao escopo global para acesso externo
window.readerModal = {
    open: openReaderModal,
    close: closeReaderModal
};