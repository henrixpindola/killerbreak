document.getElementById("delBtn").addEventListener("click", () => {//adiciona um listener de clique ao botão de deletar*/
  const inputText = document.getElementById("inputText")
  const outputText = document.getElementById("outputText")
  const TextProcessor = window.TextProcessor //declara o objeto TextProcessor global

  inputText.value = ""
  outputText.value = ""

  if (typeof TextProcessor?.process === "function") {
    TextProcessor.process()
  }

  if (window.outputManager?.update) {
    window.outputManager.update()
  }
})
