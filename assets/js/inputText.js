const TextProcessor = (() => {
  const MAX_CHARS = 320
  let debounceTimer
  let inputElement, outputElement

  const ALL_CHECKBOX_IDS = [
    "removeBreaks",
    "fixSpaces",
    "AllUppercase",
    "AllLowercase",
    "CapitalLetters",
    "firstLetterUppercase",
    "firstLetterSentence",
  ]

  function init() {
    inputElement = document.getElementById("inputText")
    outputElement = document.getElementById("outputText")

    if (!inputElement || !outputElement) return

    inputElement.maxLength = MAX_CHARS
    inputElement.addEventListener("input", debounceProcess)

    setupCheckboxListeners()

    document.addEventListener("checkboxGroupUpdated", process)

    setTimeout(process, 100)
  }

  function setupCheckboxListeners() {
    ALL_CHECKBOX_IDS.forEach((checkboxId) => {
      const checkbox = document.getElementById(checkboxId)
      if (checkbox) {
        checkbox.addEventListener("change", process)
      }
    })
  }

  function debounceProcess() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(process, 200)
  }

  function process() {
    if (!inputElement || !outputElement) return

    const text = inputElement.value.slice(0, MAX_CHARS)
    const processedText = applyAllRules(text)
    outputElement.value = processedText

    document.dispatchEvent(
      new CustomEvent("textProcessed", {
        detail: { originalText: text, processedText: processedText },
      }),
    )
  }

  function applyAllRules(text) {
    if (!text.trim()) return ""

    const protection = protectWords(text)
    let processedText = protection.text

    processedText = processLineBreaks(processedText)
    processedText = processSpaces(processedText)
    processedText = applyCapitalization(processedText)
    return restoreWords(processedText, protection.placeholders)
  }

  function processSpaces(text) {
    if (!isChecked("fixSpaces")) {
      return text
    }

    return text
      .replace(/[ \t]{2,}/g, " ") // Múltiplos espaços/tabs → um espaço
      .replace(/^[ \t]+/gm, "") // Remove espaços no início de cada linha
      .replace(/[ \t]+$/gm, "") // Remove espaços no final de cada linha
      .replace(/([.,!?;:])[ \t]+/g, "$1 ") // Um espaço após pontuação
      .replace(/[ \t]+([.,!?;:])/g, "$1") // Remove espaço antes de pontuação
      .replace(/([a-zÀ-ÿ])\.([A-Z])/gi, "$1. $2") // Espaço após ponto antes de maiúscula
  }

  function processLineBreaks(text) {
    if (!isChecked("removeBreaks")) {
      return text
    }

    return text.replace(/\r?\n/g, " ")
  }

  function applyCapitalization(text) {
    const Words = window.getWords ? window.getWords() : []

    if (isChecked("AllUppercase")) {
      return text.toUpperCase()
    }

    if (isChecked("AllLowercase")) {
      return text.toLowerCase()
    }

    if (isChecked("CapitalLetters")) {
      return text.toLowerCase().replace(/(^|[^a-zÀ-ÿ])([a-zÀ-ÿ])/g, (match, separator, letter) => {
        return separator + letter.toUpperCase()
      })
    }

    if (isChecked("firstLetterUppercase")) {
      const lowerText = text.toLowerCase()
      return lowerText.charAt(0).toUpperCase() + lowerText.slice(1)
    }

    if (isChecked("firstLetterSentence")) {
      const lowerText = text.toLowerCase()
      return lowerText.replace(/(^|[.!?]\s+)(\w)/g, (_, prefix, letter) => prefix + letter.toUpperCase())
    }

    return text
  }

  function isChecked(id) {
    const element = document.getElementById(id)
    return element ? element.checked : false
  }

  function protectWords(text) {
    const Words = window.getWords ? window.getWords() : []
    const placeholders = new Map()

    if (Words.length === 0) return { text, placeholders }

    let index = 0

    Words.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b${escaped}\\b`, "gi")

      text = text.replace(regex, (match) => {
        const placeholder = `CUSTOM_${index++}`
        placeholders.set(placeholder, match)
        return placeholder
      })
    })

    return { text, placeholders }
  }

  function restoreWords(text, placeholders) {
    placeholders.forEach((word, placeholder) => {
      text = text.replace(placeholder, word)
    })
    return text
  }

  return {
    init,
    process,
    forceProcess: process,
  }
})()

document.addEventListener("DOMContentLoaded", TextProcessor.init)
