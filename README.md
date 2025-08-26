# 📋 Killerbreak - README

![Killerbreak](https://img.shields.io/badge/Version-1.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Visão Geral

O **Killerbreak** é uma ferramenta web moderna para processamento e formatação de texto. Permite remover quebras de linha, corrigir espaçamento, aplicar diferentes estilos de capitalização e gerenciar palavras personalizadas.

## 🚀 Funcionalidades

### 🔧 Processamento de Texto
- **Remoção de Quebras de Linha** - Elimina enters desnecessários
- **Correção de Espaços** - Padroniza espaçamento e remove espaços múltiplos
- **Múltiplos Formatos de Capitalização**:
  - `TODAS MAIÚSCULAS` - Texto em caixa alta
  - `todas minúsculas` - Texto em caixa baixa  
  - `Apenas Iniciais Maiúsculas` - Title Case
  - `Primeira letra maiúscula` - Sentence case
  - `Primeira letra de frase maiúscula` - Proper sentence case

### 💾 Gerenciamento de Texto
- **Colar** - Cola texto da área de transferência
- **Copiar** - Copia texto formatado
- **Editar** - Move texto formatado para edição
- **Salvar** - Download do texto como arquivo .txt
- **Limpar** - Apaga todo o conteúdo

### ⚡ Palavras Personalizadas
- Adicione palavras para preservar formatação específica
- Lista visual das palavras personalizadas
- Botão para limpar toda a lista

## 🎨 Interface

### Design Moderno
- **Tema Escuro** com acentos verdes
- **Layout Responsivo** para mobile e desktop
- **Animações Suaves** e feedback visual
- **Ícones Intuitivos** e tipografia monospace

### Modal de Ajuda
- Acessível pelo ícone ⚠️ de atenção
- Explicações detalhadas das funcionalidades
- Fecha com X, clique fora ou tecla Escape

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com variáveis CSS
- **JavaScript ES6+** - Funcionalidades interativas
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia Courier New

## 📦 Estrutura de Arquivos

```
assets/
├── css/
│   └── styles.css          # Estilos principais
├── js/
│   ├── outputText.js       # Gerenciamento de output
│   ├── inputText.js        # Processamento principal
│   ├── checkboxGroup.js    # Controle de checkboxes
│   ├── pasteBtn.js         # Funcionalidade colar
│   ├── delBtn.js           # Funcionalidade limpar
│   ├── copyBtn.js          # Funcionalidade copiar
│   ├── editLink.js         # Funcionalidade editar
│   ├── saveBtn.js          # Funcionalidade salvar
│   ├── removeBreaks.js     # Controle de quebras
│   ├── customWords.js      # Palavras personalizadas
│   └── reader.js           # Modal de ajuda
├── img/
│   └── attention.png       # Ícone de atenção
```

## 🎯 Como Usar

1. **Cole seu texto** na caixa da esquerda
2. **Ajuste as opções** conforme necessidade:
   - Marque/desmarque "Remover quebras de linha"
   - Marque/desmarque "Corrigir espaços"  
   - Selecione o estilo de capitalização desejado
3. **O resultado aparecerá automaticamente** na caixa da direita
4. **Use os botões** para copiar, editar ou salvar o texto formatado

### ⌨️ Atalhos
- **Escape** - Desmarca todas as opções de capitalização
- **Enter** no campo de palavras - Adiciona palavra personalizada

## 🌈 Cores do Tema

```css
:root {
    --coder-dark: #ffffff;        /* Fundo principal */
    --coder-blue: #ff8e8e;        /* Destaques */
    --code-green: #000000;        /* Títulos e bordas */
    --code-purple: #ffffff;       /* Botões */
    --book-beige: #cf682d;        /* Elementos secundários */
    --footer-green: #a9db34;      /* Destaques footer */
    --delete-red: #ff4655;        /* Botões de exclusão */
}
```

## 📱 Responsividade

O design é totalmente responsivo e se adapta a:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)  
- **Mobile** (< 768px)

## 🔧 Personalização

### Adicionar Novos Estilos de Texto
1. Adicione checkbox no HTML com ID único
2. Registre no array `capitalizationIds` no `checkboxGroup.js`
3. Implemente a lógica de formatação no `inputText.js`

### Modificar Cores
Edite as variáveis CSS no início do `styles.css`:

```css
:root {
    --coder-dark: #sua_cor;
    --code-green: #sua_cor;
    /* ... */
}
```

## 👥 Desenvolvido Por

- **Suzana Costa** 
  - [GitHub](https://github.com/suzi19)
  - [LinkedIn](https://www.linkedin.com/in/suzana-costa-5465b4272/)

- **Henrique Espindola**
  - [GitHub](https://github.com/henrixpindola) 
  - [LinkedIn](https://www.linkedin.com/in/henrique-espindola-500409256)

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🐛 Reportar Bugs

Encontrou um problema? [Abra uma issue](https://github.com/henrixpindola/killerbreak/issues) no GitHub.

## 💡 Contribuição

Contribuições são bem-vindas! Siga os passos:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**⭐ Se este projeto foi útil, deixe uma estrela no [GitHub](https://github.com/henrixpindola/killerbreak)!**