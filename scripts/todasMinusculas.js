document.getElementById('todasMinusculas').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('todasMaiusculas').checked = false;
        document.getElementById('iniciaisPalavras').checked = false;
    }
    processText();
});