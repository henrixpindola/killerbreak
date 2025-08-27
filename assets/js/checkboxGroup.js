function createCheckboxGroup(TextProcessor) {
  const capitalizationIds = [
    "AllUppercase",
    "AllLowercase",
    "CapitalLetters",
    "firstLetterUppercase",
    "firstLetterSentence",
  ]

  function init() {
    setupEventListeners()
    console.log("CheckboxGroup inicializado - Modo Exclusivo")
  }

  function setupEventListeners() {
    capitalizationIds.forEach((id) => {
      const checkbox = document.getElementById(id)
      if (checkbox) {
        const newCheckbox = checkbox.cloneNode(true)
        checkbox.parentNode.replaceChild(newCheckbox, checkbox)

        newCheckbox.addEventListener("change", function () {
          if (this.checked) {
            capitalizationIds.forEach((otherId) => {
              if (otherId !== id) {
                const otherCheckbox = document.getElementById(otherId)
                if (otherCheckbox) otherCheckbox.checked = false
              }
            })
          }

          triggerTextProcessing()
        })
      }
    })
  }

  function triggerTextProcessing() {
    document.dispatchEvent(new CustomEvent("checkboxGroupUpdated"))
    if (typeof TextProcessor?.process === "function") {
      TextProcessor.process()
    }
    if (window.TextProcessor?.process) {
      window.TextProcessor.process()
    }
  }

  return {
    init,
    triggerTextProcessing,
  }
}

const checkboxGroup = createCheckboxGroup(window.TextProcessor)

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    checkboxGroup.init()
  }, 100)
})
