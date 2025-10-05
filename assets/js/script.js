document.addEventListener("DOMContentLoaded", function () {
  // ========== CUSTOM WORDS MANAGER ==========
  const CustomWordsManager = (() => {
    let customWords = [];
    const STORAGE_KEY = 'kb-text-custom-words';

    function init() {
      loadWords();
      renderWords();
      bindEvents();
    }

    function loadWords() {
      try {
        const savedWords = localStorage.getItem(STORAGE_KEY);
        customWords = savedWords ? JSON.parse(savedWords) : [];
      } catch (e) {
        console.error("Failed to load custom words from localStorage", e);
        customWords = [];
      }
    }

    function saveWords() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customWords));
      } catch (e) {
        console.error("Failed to save custom words to localStorage", e);
      }
    }

    function renderWords() {
      const listElement = document.getElementById('customWordsList');
      const clearBtn = document.getElementById('clearCustomWordsBtn');
      if (!listElement) return;

      listElement.innerHTML = '';
      if (customWords.length === 0) {
        listElement.innerHTML = '<span style="color: #5f6368; font-size: 0.85rem;">Nenhuma palavra personalizada adicionada</span>';
        if (clearBtn) clearBtn.disabled = true;
      } else {
        customWords.forEach(word => {
          const tag = document.createElement('div');
          tag.className = 'custom-word-tag';
          tag.textContent = word;

          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-word-btn';
          removeBtn.innerHTML = '&times;';
          removeBtn.onclick = () => removeWord(word);

          tag.appendChild(removeBtn);
          listElement.appendChild(tag);
        });
        if (clearBtn) clearBtn.disabled = false;
      }
    }

    function addWord() {
      const inputElement = document.getElementById('customWordInput');
      if (!inputElement) return;

      const word = inputElement.value.trim();
      if (word && !customWords.some(existingWord => existingWord.toLowerCase() === word.toLowerCase())) {
        customWords.push(word);
        saveWords();
        renderWords();
        inputElement.value = '';
        window.TextProcessor.process();
      } else if (word && customWords.some(existingWord => existingWord.toLowerCase() === word.toLowerCase())) {
        alert('Esta palavra já foi adicionada (independente de maiúsculas/minúsculas).');
        inputElement.value = '';
      }
    }

    function removeWord(wordToRemove) {
      customWords = customWords.filter(word => word !== wordToRemove);
      saveWords();
      renderWords();
      window.TextProcessor.process();
    }

    function clearAllWords() {
      if (confirm('Tem certeza que deseja limpar todas as palavras?')) {
        customWords = [];
        saveWords();
        renderWords();
        window.TextProcessor.process();
      }
    }

    function bindEvents() {
      const addBtn = document.getElementById('addCustomWordBtn');
      const clearBtn = document.getElementById('clearCustomWordsBtn');
      const input = document.getElementById('customWordInput');

      if (addBtn) addBtn.addEventListener('click', addWord);
      if (clearBtn) clearBtn.addEventListener('click', clearAllWords);
      if (input) input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addWord();
        }
      });
    }

    function getWords() {
      return [...customWords];
    }

    return {
      init,
      getWords
    };
  })();

  // ========== CHECKBOX GROUP ==========
  function createCheckboxGroup() {
    const capitalizationIds = [
      "AllUppercase",
      "AllLowercase",
      "CapitalLetters",
      "firstLetterUppercase",
      "firstLetterSentence",
    ];

    function init() {
      setupEventListeners();
      console.log("CheckboxGroup inicializado - Modo Exclusivo");
    }

    function setupEventListeners() {
      capitalizationIds.forEach((id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          const newCheckbox = checkbox.cloneNode(true);
          checkbox.parentNode.replaceChild(newCheckbox, checkbox);

          newCheckbox.addEventListener("change", function () {
            if (this.checked) {
              capitalizationIds.forEach((otherId) => {
                if (otherId !== id) {
                  const otherCheckbox = document.getElementById(otherId);
                  if (otherCheckbox) otherCheckbox.checked = false;
                }
              });
            }
            triggerTextProcessing();
          });
        }
      });
    }

    function triggerTextProcessing() {
      document.dispatchEvent(new CustomEvent("checkboxGroupUpdated"));
      if (typeof window.TextProcessor?.process === "function") {
        window.TextProcessor.process();
      }
    }

    function getActiveCapitalization() {
      for (const id of capitalizationIds) {
        const checkbox = document.getElementById(id);
        if (checkbox?.checked) return id;
      }
      return null;
    }

    return {
      init,
      triggerTextProcessing,
      getActiveCapitalization,
    };
  }

  // ========== TEXT PROCESSOR ==========
  const TextProcessor = (() => {
    const MAX_CHARS = 320;
    let debounceTimer;
    let inputElement, outputElement;

    const ALL_CHECKBOX_IDS = [
      "removeBreaks",
      "fixSpaces",
      "AllUppercase",
      "AllLowercase",
      "CapitalLetters",
      "firstLetterUppercase",
      "firstLetterSentence",
    ];

    function init() {
      inputElement = document.getElementById("inputText");
      outputElement = document.getElementById("outputText");

      if (!inputElement || !outputElement) return;

      inputElement.maxLength = MAX_CHARS;
      inputElement.addEventListener("input", debounceProcess);
      setupCheckboxListeners();
      document.addEventListener("checkboxGroupUpdated", process);
      setTimeout(process, 100);

      // Atualizar contador de caracteres
      inputElement.addEventListener("input", updateCharCount);
      updateCharCount();
    }

    function updateCharCount() {
      const charCountElement = document.getElementById("charCount");
      if (charCountElement) {
        charCountElement.textContent = inputElement.value.length;
      }
    }

    function setupCheckboxListeners() {
      ALL_CHECKBOX_IDS.forEach((checkboxId) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
          checkbox.addEventListener("change", process);
        }
      });
    }

    function debounceProcess() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(process, 200);
    }

    function process() {
      if (!inputElement || !outputElement) return;

      const text = inputElement.value.slice(0, MAX_CHARS);
      const processedText = applyAllRules(text);
      outputElement.value = processedText;

      document.dispatchEvent(
        new CustomEvent("textProcessed", {
          detail: { originalText: text, processedText: processedText },
        })
      );

      updateCharCount();
    }

    function applyAllRules(text) {
      if (!text.trim()) return "";

      const protection = protectWords(text);
      let processedText = protection.text;

      processedText = processLineBreaks(processedText);
      processedText = processSpaces(processedText);
      processedText = applyCapitalization(processedText);
      return restoreWords(processedText, protection.placeholders);
    }

    function processSpaces(text) {
      if (!isChecked("fixSpaces")) {
        return text;
      }

      return text
        .replace(/[ \t]{2,}/g, " ")
        .replace(/^[ \t]+/gm, "")
        .replace(/[ \t]+$/gm, "")
        .replace(/([.,!?;:])[ \t]+/g, "$1 ")
        .replace(/[ \t]+([.,!?;:])/g, "$1")
        .replace(/([a-zÀ-ÿ])\.([A-Z])/gi, "$1. $2");
    }

    function processLineBreaks(text) {
      if (!isChecked("removeBreaks")) {
        return text;
      }

      return text.replace(/\r?\n/g, " ");
    }

    function applyCapitalization(text) {
      if (isChecked("AllUppercase")) {
        return text.toUpperCase();
      }

      if (isChecked("AllLowercase")) {
        return text.toLowerCase();
      }

      if (isChecked("CapitalLetters")) {
        return text
          .toLowerCase()
          .replace(
            /(^|[^a-zÀ-ÿ])([a-zÀ-ÿ])/g,
            (match, separator, letter) => {
              return separator + letter.toUpperCase();
            }
          );
      }

      if (isChecked("firstLetterUppercase")) {
        const lowerText = text.toLowerCase();
        return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
      }

      if (isChecked("firstLetterSentence")) {
        const lowerText = text.toLowerCase();
        return lowerText.replace(
          /(^|[.!?]\s+)(\w)/g,
          (_, prefix, letter) => prefix + letter.toUpperCase()
        );
      }

      return text;
    }

    function isChecked(id) {
      const element = document.getElementById(id);
      return element ? element.checked : false;
    }

    function protectWords(text) {
      const words = CustomWordsManager.getWords();
      const placeholders = new Map();

      if (words.length === 0) return { text, placeholders };

      let index = 0;

      const sortedWords = words.sort((a, b) => b.length - a.length);

      sortedWords.forEach((word) => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\b${escaped}\\b`, "gi");

        text = text.replace(regex, (match) => {
          const placeholder = `__KB_CUSTOM_${index++}__`;
          placeholders.set(placeholder, word); // Use `word` to preserve original casing
          return placeholder;
        });
      });

      return { text, placeholders };
    }

    function restoreWords(text, placeholders) {
      placeholders.forEach((word, placeholder) => {
        const regex = new RegExp(placeholder, "gi"); // Placeholder is simple, no need to escape
        text = text.replace(regex, word);
      });
      return text;
    }

    return {
      init,
      process,
      forceProcess: process,
    };
  })();

  // ========== READER MODAL ==========
  function setupReaderModal() {
    const modal = document.getElementById("readerModal");
    const attentionIcon = document.querySelector(".attention-icon");
    const closeBtn = document.querySelector(".reader-modal-close");

    if (!modal || !attentionIcon) {
      console.warn("Elementos do modal não encontrados");
      return;
    }

    console.log("Modal reader encontrado, configurando eventos...");

    attentionIcon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Abrindo modal...");
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    function closeModal() {
      console.log("Fechando modal...");
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        closeModal();
      }
    });

    const modalContent = document.querySelector(".reader-modal-content");
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    console.log("Modal reader configurado com sucesso");
  }

  function openReaderModal() {
    const modal = document.getElementById("readerModal");
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  }

  function closeReaderModal() {
    const modal = document.getElementById("readerModal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // ========== BUTTON EVENT HANDLERS ==========
  function setupButtonHandlers() {
    // Save Button
    document
      .getElementById("saveBtn")
      ?.addEventListener("click", function () {
        const outputText = document.getElementById("outputText")?.value;

        if (!outputText?.trim()) {
          alert("Nenhum texto para salvar!");
          return;
        }

        const blob = new Blob([outputText], {
          type: "text/plain;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        const date = new Date();
        const defaultName = `texto_formatado_${date
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")}.txt`;

        link.download = defaultName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      });

    // Paste Button
    document
      .getElementById("pasteBtn")
      ?.addEventListener("click", async function () {
        const inputText = document.getElementById("inputText");

        if (!inputText) {
          alert("Campo de entrada não encontrado!");
          return;
        }

        try {
          const text = await navigator.clipboard.readText();
          inputText.value = text;
          inputText.focus();

          if (typeof TextProcessor?.process === "function") {
            TextProcessor.process();
          }
        } catch (err) {
          // Fallback para navegadores mais antigos
          inputText.focus();
          document.execCommand("paste");
        }
      });

    // Edit Button
    document.getElementById("editBtn")?.addEventListener("click", () => {
      const outputText = document.getElementById("outputText");
      const inputText = document.getElementById("inputText");

      if (!outputText || !inputText) return;

      if (!outputText.value.trim()) {
        alert("Nenhum texto para editar!");
        return;
      }

      inputText.value = outputText.value;
      inputText.focus();
      TextProcessor.process();
    });

    // Delete Button
    document.getElementById("delBtn")?.addEventListener("click", () => {
      const inputText = document.getElementById("inputText");
      const outputText = document.getElementById("outputText");

      if (inputText) inputText.value = "";
      if (outputText) outputText.value = "";
      TextProcessor.process();
    });

    // Copy Button
    document
      .getElementById("copyBtn")
      ?.addEventListener("click", async () => {
        const outputText = document.getElementById("outputText");
        if (!outputText || !outputText.value.trim()) {
          alert("Nenhum texto para copiar!");
          return;
        }

        try {
          await navigator.clipboard.writeText(outputText.value);
          alert("Texto copiado! 📋");
        } catch (err) {
          try {
            outputText.select();
            document.execCommand("copy");
            alert("Texto copiado! 📋");
          } catch (error) {
            alert("Erro ao copiar texto");
          }
        }
      });

    // Remove Breaks Checkbox
    document
      .getElementById("removeBreaks")
      ?.addEventListener("change", function () {
        if (typeof TextProcessor.process === "function") {
          TextProcessor.process();
        }
      });
  }

  // ========== INITIALIZATION ==========
  function initializeAll() {
    // Initialize global objects
    window.checkboxGroup = createCheckboxGroup();
    window.TextProcessor = TextProcessor;
    window.CustomWordsManager = CustomWordsManager;

    // Initialize components
    window.checkboxGroup.init();
    TextProcessor.init();
    CustomWordsManager.init();
    setupReaderModal();
    setupButtonHandlers();

    // Expose modal functions globally
    window.readerModal = {
      open: openReaderModal,
      close: closeReaderModal,
    };

    console.log("Todos os componentes inicializados com sucesso");
  }

  // Start the application
  initializeAll();
});