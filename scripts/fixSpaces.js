const FixSpaces = (() => {
    function init() {
        const checkbox = document.getElementById('fixSpaces');
        
        if (!checkbox) return;

        checkbox.addEventListener('change', () => {
            // Dispara evento personalizado para forçar reprocessamento
            document.dispatchEvent(new CustomEvent('fixSpacesChanged', {
                detail: { enabled: checkbox.checked }
            }));
            
            // Força reprocessamento imediato
            if (window.TextProcessor && typeof TextProcessor.process === 'function') {
                TextProcessor.process();
            }
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', FixSpaces.init);