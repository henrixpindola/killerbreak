function createCheckboxGroup(TextProcessor) {/*função que cria o grupo de checkboxes*/
  const capitalizationIds = [/*declara as ids dos checkboxes de capitalização*/
    "AllUppercase",
    "AllLowercase",
    "CapitalLetters",
    "firstLetterUppercase",
    "firstLetterSentence",
  ]

  function init() {/*função que inicializa o grupo de checkboxes*/
    setupEventListeners()
    console.log("CheckboxGroup inicializado - Modo Exclusivo")
  }

  function setupEventListeners() {/*função que configura os listeners de eventos para os checkboxes*/
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

  function triggerTextProcessing() {/*função que dispara o processamento de texto*/
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

const checkboxGroup = createCheckboxGroup(window.TextProcessor)/*cria o grupo de checkboxes, passando o objeto TextProcessor global*/

document.addEventListener("DOMContentLoaded", () => {/*espera o carregamento do DOM*/
  setTimeout(() => {
    checkboxGroup.init()
  }, 100)
})
