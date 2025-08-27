const TextProcessor = (() => {
  const MAX_CHARS = 320;
  let debounceTimer;
  let inputElement, outputElement;

  const ALL_CHECKBOX_IDS = [
      'removeBreaks', 
      'fixSpaces', 
      'keepBlankLines',
      'AllUppercase', 
      'AllLowercase',
      'CapitalLetters',
      'firstLetterUppercase',
      'firstLetterSentence'
  ];

  function init() {
      inputElement = document.getElementById('inputText');
      outputElement = document.getElementById('outputText');
      
      if (!inputElement || !outputElement) return;
      
      inputElement.maxLength = MAX_CHARS;
      inputElement.addEventListener('input', debounceProcess);
      
      setupCheckboxListeners();
      
      document.addEventListener('wordListUpdated', process);
      document.addEventListener('checkboxGroupUpdated', process);
      
      setTimeout(process, 100);
  }

  function setupCheckboxListeners() {
      ALL_CHECKBOX_IDS.forEach(checkboxId => {
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
              checkbox.addEventListener('change', process);
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
      outputElement.value = applyAllRules(text);
  }

  function applyAllRules(text) {
      if (!text.trim()) return '';

      const protection = protectCustomWords(text);
      let processedText = protection.text;
      
      // PROCESSAMENTO PARALELO - cada função recebe o texto ORIGINAL
      processedText = processLineBreaks(processedText);
      processedText = processSpaces(processedText);
      processedText = applyCapitalization(processedText);
      processedText = restoreCustomWords(processedText, protection.placeholders);
      
      return processedText;
  }

  function processSpaces(text) {
      // CORREÇÃO ESPAÇOS: funciona no texto ORIGINAL, independente de quebras
      if (!isChecked('fixSpaces')) {
          return text;
      }
      
      // Aplica apenas nos ESPAÇOS, não mexe em quebras
      return text
          .replace(/[^\S\r\n]{2,}/g, ' ')          // Múltiplos espaços → um (exceto quebras)
          .replace(/([.,!?;:])[^\S\r\n]+/g, '$1 ') // Espaço após pontuação
          .replace(/[^\S\r\n]+([.,!?;:])/g, '$1')  // Remove espaço antes de pontuação
          .replace(/([a-zÀ-ÿ])\.([A-Z])/gi, '$1. $2')
          .trim();
  }

  function processLineBreaks(text) {
      // CORREÇÃO QUEBRAS: funciona no texto ORIGINAL
      if (!isChecked('removeBreaks')) {
          return text;
      }

      const shouldKeepBlankLines = isChecked('keepBlankLines');

      if (shouldKeepBlankLines) {
          // Mantém linhas em branco, remove quebras simples
          return text
              .replace(/(\r?\n){2,}/g, '\n\n')     // Normaliza múltiplas quebras
              .replace(/([^\n])\r?\n([^\n])/g, '$1 $2') // Quebras simples → espaço
              .trim();
      } else {
          // Remove TODAS as quebras
          return text
              .replace(/\r?\n/g, ' ')               // Quebras → espaços
              .trim();
      }
  }

  function applyCapitalization(text) {
      const customWords = window.getCustomWords ? window.getCustomWords() : [];
      
      if (isChecked('AllUppercase')) {
          return text.toUpperCase();
      }
      
      if (isChecked('AllLowercase')) {
          return text.toLowerCase();
      }
      
      if (isChecked('CapitalLetters')) {
          return text.replace(/\b\w/g, char => char.toUpperCase());
      }
      
      if (isChecked('firstLetterUppercase')) {
          return text.charAt(0).toUpperCase() + text.slice(1);
      }
      
      if (isChecked('firstLetterSentence')) {
          return text.replace(/(^|[.!?]\s+)(\w)/g, (_, prefix, letter) => 
              prefix + letter.toUpperCase()
          );
      }

      return text;
  }

  function isChecked(id) {
      const element = document.getElementById(id);
      return element ? element.checked : false;
  }

  function protectCustomWords(text) {
      const customWords = window.getCustomWords ? window.getCustomWords() : [];
      const placeholders = new Map();
      
      if (customWords.length === 0) return { text, placeholders };

      let index = 0;
      
      customWords.forEach(word => {
          const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
          
          text = text.replace(regex, match => {
              const placeholder = `CUSTOM_${index++}`;
              placeholders.set(placeholder, match);
              return placeholder;
          });
      });
      
      return { text, placeholders };
  }

  function restoreCustomWords(text, placeholders) {
      placeholders.forEach((word, placeholder) => {
          text = text.replace(placeholder, word);
      });
      return text;
  }

  return {
      init,
      process,
      forceProcess: process
  };
})();

document.addEventListener('DOMContentLoaded', TextProcessor.init);