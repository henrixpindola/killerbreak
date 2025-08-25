document.getElementById('todasMaiusculas').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('todasMinusculas').checked = false;
        document.getElementById('iniciaisPalavras').checked = false;
    }
    processText();
});