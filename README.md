# 📋 KB Text — Processador e Formatador de Texto

### 💻 HTML5 | CSS3 | JavaScript ES6+

---

## ✨ Visão Geral

**KB Text** é uma ferramenta web moderna para **processar textos copiados**, especialmente de PDFs e e-books.
Seu objetivo é limpar, corrigir e padronizar o conteúdo de forma automática e rápida, tornando o texto pronto para edição ou uso em outros documentos.

---

## 🚀 Funcionalidades

### 🔧 Processamento de Texto

* **Remover Quebras de Linha** — elimina “enters” desnecessários
* **Corrigir Espaçamento** — ajusta e remove espaços múltiplos
* **Capitalização (Maiúsculas/Minúsculas)**

  * TODAS MAIÚSCULAS
  * todas minúsculas
  * Primeira Letra De Cada Palavra
  * Primeira letra do texto
  * Primeira letra de cada frase (modo título)

### 💾 Gerenciamento de Texto

* **Colar** — insere texto diretamente da área de transferência
* **Copiar** — copia o texto processado
* **Editar** — move o texto processado de volta para edição
* **Salvar** — exporta o texto em `.txt`
* **Limpar** — apaga todas as áreas

### 🧠 Palavras Personalizadas

* Adicione palavras que **não devem ser alteradas** durante a formatação
* Visualize, remova e limpe a lista personalizada com facilidade

---

## 🎨 Interface

### Design Moderno e Responsivo

* Tema em tons de **verde neon** sobre fundo escuro
* **Layout adaptável** a desktop, tablet e mobile
* **Animações suaves** e feedback visual
* **Modal de Instruções** com informações de uso
* Ícones e tipografia moderna (Segoe UI)

---

## 🛠️ Tecnologias Utilizadas

* **HTML5** — estrutura semântica
* **CSS3** — design moderno com variáveis e gradientes
* **JavaScript ES6+** — manipulação dinâmica do DOM
* **Google Fonts (Segoe UI)** — tipografia limpa e legível

---

## 📦 Estrutura de Arquivos

```
assets/
├── css/
│   └── styles.css      # Estilos globais e tema verde neon
├── js/
│   └── script.js       # Lógica principal e controle de eventos
├── img/
│   └── attention.png   # Ícone do modal (opcional)
index.html              # Estrutura principal da aplicação
```

---

## 🎯 Como Usar

1. **Cole ou digite** seu texto na área de entrada (à esquerda).
2. **Ative as opções** desejadas:

   * Remover quebras de linha
   * Corrigir espaçamento
   * Escolher o tipo de capitalização
3. **Veja o resultado automaticamente** na área da direita.
4. Use os botões para **copiar, salvar ou editar** o texto processado.
5. Adicione palavras à **lista personalizada** se quiser preservar certas palavras durante o processamento.

---

## 🌈 Cores do Tema (principais variáveis)

```css
:root {
  --primary-color: #4ade80;
  --primary-dark: #15803d;
  --secondary-color: #86efac;
  --light-color: #f5f7fa;
  --dark-color: #e2e8f0;
  --gray-color: #1f2937;
  --accent-glow: #22ff88;
}
```

---

## 📱 Responsividade

Interface adaptada para:

* 🖥️ **Desktop:** +1200px
* 💻 **Tablet:** 768px – 1199px
* 📱 **Mobile:** abaixo de 768px

---

## ⚠️ Limitações e Recomendações

* A formatação é heurística; revise o resultado final antes de usar.
* Textos técnicos, jurídicos ou com nomes próprios podem exigir ajustes manuais.
* Utilize a seção de **palavras personalizadas** para evitar alterações indesejadas.

---

## 🔧 Personalização

### ➕ Adicionar Novos Tipos de Capitalização

1. Crie uma nova checkbox no HTML.
2. Implemente a lógica no `script.js`.

### 🎨 Alterar o Tema

Modifique as variáveis em `:root` dentro do `styles.css`.

---

## 👥 Desenvolvido Por

**Henrique Espindola**
🔗 [GitHub](https://github.com/henrixpindola)

---

## 🐛 Reportar Bugs

Abra uma *issue* no repositório do GitHub e descreva o problema encontrado.

---

## 💡 Contribuição

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b minha-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para o repositório remoto
5. Abra um **Pull Request**

---

⭐ **Se este projeto foi útil, deixe uma estrela no GitHub!**