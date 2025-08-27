document.getElementById("delBtn").addEventListener("click", () => {
  const inputText = document.getElementById("inputText")
  const outputText = document.getElementById("outputText")
  const TextProcessor = window.TextProcessor // Declare the TextProcessor variable

  inputText.value = ""
  outputText.value = ""

  // Trigger text processing to update output immediately
  if (typeof TextProcessor?.process === "function") {
    TextProcessor.process()
  }

  // Also trigger via outputManager if available
  if (window.outputManager?.update) {
    window.outputManager.update()
  }
})
