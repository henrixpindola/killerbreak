function setupReaderModal() {// Configuração do modal de leitura
    const modal = document.getElementById('readerModal');
    const attentionIcon = document.querySelector('.attention-icon');
    const closeBtn = document.querySelector('.reader-modal-close');
    
    if (!modal || !attentionIcon) {
        console.warn('Elementos do modal não encontrados');
        return;
    }
    
    console.log('Modal reader encontrado, configurando eventos...');// Log para depuração
    
    attentionIcon.addEventListener('click', (e) => {// Abrir modal ao clicar no ícone de atenção
        e.preventDefault();
        e.stopPropagation();
        console.log('Abrindo modal...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Impede scroll da página
    });
    
    function closeModal() {// Função para fechar o modal
        console.log('Fechando modal...');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura scroll
    }
    
    if (closeBtn) {// Fechar ao clicar no botão de fechar
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    modal.addEventListener('click', (e) => {// Fechar ao clicar fora do conteúdo do modal
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {// Fechar ao pressionar Esc
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    const modalContent = document.querySelector('.reader-modal-content');// Evitar fechamento ao clicar dentro do conteúdo
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    console.log('Modal reader configurado com sucesso');
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {// Atraso para garantir que o modal esteja no DOM
        setupReaderModal();
    }, 100);
});

function openReaderModal() {// Função auxiliar para abrir o modal programaticamente
    const modal = document.getElementById('readerModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeReaderModal() {// Função auxiliar para fechar o modal programaticamente
    const modal = document.getElementById('readerModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.readerModal = {// Expor funções para uso externo
    open: openReaderModal,
    close: closeReaderModal
};