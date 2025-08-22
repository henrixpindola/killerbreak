const TextProcessor = (() => {
  const MAX_CHARS = 320;
  let debounceTimer;
  let inputElement, outputElement;
  let lastProcessedState = {}; // Adicionar cache de estado

  // Função de inicialização
  function init() {
      inputElement = document.getElementById('inputText');
      outputElement = document.getElementById('outputText');
      
      inputElement.maxLength = MAX_CHARS;
      inputElement.addEventListener('input', debounceProcess);
      
      document.addEventListener('wordListUpdated', process);
      document.addEventListener('checkboxGroupUpdated', process);
  }

  // Debounce otimizado
  function debounceProcess() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(process, 200);
  }

  // Processamento principal - MODIFICADO
  function process() {
      const text = inputElement.value.slice(0, MAX_CHARS);
      
      // Verificar se o estado mudou
      const currentState = getCurrentState();
      if (shouldReprocess(currentState)) {
          outputElement.value = applyAllRules(text);
          lastProcessedState = currentState; // Atualizar estado
      }
  }

  // Obter estado atual dos checkboxes - NOVO
  function getCurrentState() {
      return {
          fixSpaces: isChecked('fixSpaces'),
          removeBreaks: isChecked('removeBreaks'),
          keepBlankLines: isChecked('keepBlankLines'),
          todasMaiusculas: isChecked('todasMaiusculas'),
          todasMinusculas: isChecked('todasMinusculas'),
          iniciaisPalavras: isChecked('iniciaisPalavras'),
          firstLetterUppercase: isChecked('firstLetterUppercase'),
          firstLetterSentence: isChecked('firstLetterSentence'),
          textHash: inputElement.value.slice(0, 50) // Pequeno hash do texto
      };
  }

  // Verificar se precisa reprocessar - NOVO
  function shouldReprocess(currentState) {
      // Sempre processa se for a primeira vez
      if (!lastProcessedState.textHash) return true;
      
      // Se o texto mudou, sempre reprocessa
      if (currentState.textHash !== lastProcessedState.textHash) return true;
      
      // Se qualquer checkbox relevante mudou, reprocessa
      const relevantCheckboxes = [
          'fixSpaces', 'removeBreaks', 'keepBlankLines',
          'todasMaiusculas', 'todasMinusculas', 'iniciaisPalavras',
          'firstLetterUppercase', 'firstLetterSentence'
      ];
      
      return relevantCheckboxes.some(key => 
          currentState[key] !== lastProcessedState[key]
      );
  }

  // Aplicar todas as regras
  function applyAllRules(text) {
      if (!text.trim()) return '';

      const protection = protectCustomWords(text);
      let processedText = protection.text;
      
      processedText = processLineBreaks(processedText);
      
      if (window.FixSpaces && typeof FixSpaces.apply === 'function') {
        processedText = FixSpaces.apply(processedText);
    } else {
        // Fallback para versão antiga
        if (isChecked('fixSpaces')) {
            processedText = processedText.replace(/[^\S\n]+/g, ' ').trim();
        }
    }
      
      processedText = applyCapitalization(processedText);
      processedText = restoreCustomWords(processedText, protection.placeholders);
      
      return processedText;
  }

  // Verificar se checkbox está marcado
  function isChecked(id) {
      const element = document.getElementById(id);
      return element ? element.checked : false;
  }

  // Processar quebras de linha
  function processLineBreaks(text) {
      const removeBreaks = isChecked('removeBreaks');
      const keepBlankLines = isChecked('keepBlankLines');

      if (!removeBreaks) return text;

      if (keepBlankLines) {
          return text.split(/(\n{2,})/).reduce((result, paragraph, i) => {
              return paragraph.startsWith('\n') 
                  ? result + paragraph 
                  : result + paragraph.replace(/\n/g, ' ');
          }, '');
      } else {
          return text.replace(/\n+/g, ' ');
      }
  }

  // Aplicar capitalização
  function applyCapitalization(text) {
      const customWords = window.getCustomWords ? window.getCustomWords() : [];
      
      if (isChecked('todasMaiusculas')) {
          return transformExceptCustomWords(text, 'uppercase', customWords);
      }
      
      if (isChecked('todasMinusculas')) {
          return transformExceptCustomWords(text, 'lowercase', customWords);
      }
      
      if (isChecked('iniciaisPalavras')) {
          return transformExceptCustomWords(text, 'titleCase', customWords);
      }
      
      if (isChecked('firstLetterUppercase')) {
          return capitalizeFirstLetter(text, customWords);
      }
      
      if (isChecked('firstLetterSentence')) {
          return capitalizeSentences(text, customWords);
      }

      return text;
  }

  // Transformar exceto palavras personalizadas
  function transformExceptCustomWords(text, mode, customWords) {
      if (customWords.length === 0) return applyTransform(text, mode);

      const parts = [];
      let lastIndex = 0;
      const regex = new RegExp(`\\b(${customWords.join('|')})\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
              parts.push({ 
                  text: text.slice(lastIndex, match.index), 
                  transform: true 
              });
          }
          parts.push({ 
              text: match[0], 
              transform: false 
          });
          lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
          parts.push({ 
              text: text.slice(lastIndex), 
              transform: true 
          });
      }

      return parts.map(part => 
          part.transform ? applyTransform(part.text, mode) : part.text
      ).join('');
  }

  // Aplicar transformação específica
  function applyTransform(text, mode) {
      const transformations = {
          uppercase: () => text.toUpperCase(),
          lowercase: () => text.toLowerCase(),
          titleCase: () => text.replace(/\b\w/g, char => char.toUpperCase())
      };
      return transformations[mode]?.() || text;
  }

  // Capitalizar primeira letra
  function capitalizeFirstLetter(text, customWords) {
      if (!text) return text;
      
      const firstWord = text.split(/\s+/)[0];
      const isCustom = customWords.some(word => 
          word.toLowerCase() === firstWord.toLowerCase());
      
      return isCustom ? text : text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Capitalizar frases
  function capitalizeSentences(text, customWords) {
      return text.replace(/(^|[.!?]\s+)(\w)/g, (match, prefix, firstLetter) => {
          const potentialWord = prefix + firstLetter;
          const isCustom = customWords.some(word => 
              word.toLowerCase().startsWith(potentialWord.toLowerCase()));
          
          return isCustom ? match : prefix + firstLetter.toUpperCase();
      });
  }

  // Proteger palavras personalizadas
  function protectCustomWords(text) {
      const customWords = window.getCustomWords ? window.getCustomWords() : [];
      const placeholders = new Map();
      
      if (customWords.length === 0) return { text, placeholders };

      let index = 0;
      const sorted = [...customWords].sort((a, b) => b.length - a.length);
      
      sorted.forEach(word => {
          const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
          
          text = text.replace(regex, match => {
              const placeholder = `\u200BKB_CUSTOM_${index++}\u200B`;
              placeholders.set(placeholder, word);
              return placeholder;
          });
      });
      
      return { text, placeholders };
  }

  // Restaurar palavras personalizadas
  function restoreCustomWords(text, placeholders) {
      placeholders.forEach((word, placeholder) => {
          const regex = new RegExp(placeholder, 'g');
          text = text.replace(regex, word);
      });
      return text;
  }

  // Forçar processamento (para uso externo)
  function forceProcess() {
      process();
  }

  // Retornar API pública
  return {
      init,
      process,
      forceProcess,
      protectCustomWords
  };
})();

// Inicialização
document.addEventListener('DOMContentLoaded', TextProcessor.init);