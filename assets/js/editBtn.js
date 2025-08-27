document.getElementById("editBtn")?.addEventListener("click", () => {
  const outputText = document.getElementById("outputText")
  const inputText = document.getElementById("inputText")

  if (!outputText || !inputText) return

  if (!outputText.value.trim()) {
    alert("Não há texto formatado para editar!")
    return
  }

  // Declare the TextProcessor variable before using it
  const TextProcessor = window.TextProcessor || {}

  inputText.value = outputText.value
  inputText.focus()

  // Trigger text processing immediately to format the moved text
  if (typeof TextProcessor?.process === "function") {
    TextProcessor.process()
  }

  // Also trigger via outputManager if available
  if (window.outputManager?.update) {
    window.outputManager.update()
  }
})
