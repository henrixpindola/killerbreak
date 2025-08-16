document.getElementById('iniciaisPalavras').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('todasMaiusculas').checked = false;
        document.getElementById('todasMinusculas').checked = false;
    }
    processText();
});