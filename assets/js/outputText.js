function createOutputManager() {
  const output = document.getElementById("outputText")// Seleciona o elemento de output

  if (!output) {
    console.warn("Elemento outputText não encontrado!")
    return null
  }

  output.value = ""
  output.readOnly = true
  output.placeholder = "Texto formatado aparecerá aqui..."

  function updateOutput() {// Função principal para atualizar o output
    const inputText = document.getElementById("inputText")?.value || ""
    const removeBreaks = document.getElementById("removeBreaks")?.checked || false

    let processedText = inputText

    if (removeBreaks) {
      processedText = fixSpaces(processedText)
    }

    processedText = applyAllTransformations(processedText)// Aplica todas as transformações

    output.value = processedText// Atualiza o valor do output
  }

  function fixSpaces(text) {
    if (typeof text !== "string") return ""

    return text
      .replace(/\s+/g, " ") // Múltiplos espaços → um espaço
      .replace(/([.,!?;:])\s+/g, "$1 ") // Espaços após pontuação
      .replace(/\s+([.,!?;:])/g, "$1") // Espaços antes de pontuação
      .replace(/(\w)\.(\w)/g, "$1. $2") // Espaço após ponto seguido de letra
      .trim()
  }

  function applyAllTransformations(text) {
    
    text = applyCapitalization(text)// Aplica capitalização

    return text
  }

  function applyCapitalization(text) {// Função que aplica a capitalização ao texto
    const activeMode = window.checkboxGroup?.getActiveCapitalization?.()
    if (!activeMode) return text

    const strategies = {
      AllUppercase: () => text.toUpperCase(),
      AllLowercase: () => text.toLowerCase(),
      CapitalLetters: () => text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
      firstLetterUppercase: () => {
        const lowerText = text.toLowerCase()
        return lowerText.charAt(0).toUpperCase() + lowerText.slice(1)
      },
      firstLetterSentence: () => {
        const lowerText = text.toLowerCase()
        return lowerText.replace(/(?:^|[.!?]\s+)(\w)/g, (match) => match.toUpperCase())
      },
    }

    return strategies[activeMode]?.() || text
  }

  function setupAutoUpdate() {// Configura os listeners para atualização automática
    document.addEventListener("checkboxGroupUpdated", updateOutput)// Ouve eventos de atualização do grupo de checkboxes

    const inputText = document.getElementById("inputText")// Ouve mudanças na área de texto de entrada
    if (inputText) {
      inputText.addEventListener("input", debounce(updateOutput, 200))
    }

    const removeBreaks = document.getElementById("removeBreaks")// Ouve mudanças no checkbox de remover quebras
    if (removeBreaks) {
      removeBreaks.addEventListener("change", updateOutput)
    }

    document.addEventListener("buttonActionTriggered", updateOutput)

    updateOutput()// Processamento inicial
  }

  function debounce(func, wait) {// Função de debounce para limitar a frequência de chamadas
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  setupAutoUpdate()// Configura a atualização automática

}

document.addEventListener("DOMContentLoaded", () => {
  window.outputManager = createOutputManager()

  setTimeout(() => {// Garante que o output seja atualizado após a inicialização
    if (window.outputManager?.update) {
      window.outputManager.update()
    }
  }, 500)
})
