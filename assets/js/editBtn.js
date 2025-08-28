document.getElementById("editBtn")?.addEventListener("click", () => {//adiciona um listener de clique ao botão de editar*/
  const outputText = document.getElementById("outputText")//seleciona a área de texto de saída
  const inputText = document.getElementById("inputText")//  seleciona a área de texto de entrada

  if (!outputText || !inputText) return

  if (!outputText.value.trim()) {
    return
  }

  const TextProcessor = window.TextProcessor || {}//declara o objeto TextProcessor global

  inputText.value = outputText.value
  inputText.focus()

  if (typeof TextProcessor?.process === "function") {//verifica se a função de processamento de texto existe
    TextProcessor.process()
  }

  if (window.outputManager?.update) {//verifica se a função de atualização do gerenciador de saída existe
    window.outputManager.update()
  }
})
