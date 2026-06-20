# EasyCalc

> Calculadora web moderna com parser aritmético próprio, validações em tempo real,
> histórico, memória, tema claro/escuro e suporte a teclado NumPad.

## Features

- **Parser manual** – two-pass (`* /` antes de `+ -`), sem `eval()`, sem riscos de segurança
- **Validação em tempo real** – operadores consecutivos, ponto duplicado, operador no início, estado de erro com auto-clean
- **Histórico** – últimos 10 cálculos, colapsável, botão limpar
- **Memória** – `MC`, `MR`, `M+`, `M-` com indicador visual
- **Temas** – claro/escuro com CSS custom properties e persistência em `localStorage`
- **Teclado NumPad** – mapeamento por `event.code`, funciona mesmo com NumLock desligado
- **Toggle de sinal** – `±` com inversão inteligente de operadores
- **Design responsivo** – breakpoints 480px e 360px
- **Fonte dinâmica** – `adjustFontSize()` reduz fonte quando o número transborda o display

## Arquitetura

```
EasyCalc/
├── index.html                 # Estrutura semântica e ordem de carregamento
├── assets/
│   ├── css/
│   │   └── style.css          # Temas (CSS custom properties), grid, responsivo
│   └── js/
│       ├── calculator.js      # Lógica pura: parser, validação, toggleSign
│       └── script.js          # DOM: eventos, histórico, memória, tema
└── README.md
```

Separação clara entre **lógica de cálculo** (`calculator.js`, sem DOM) e **interação com a UI** (`script.js`, eventos e estado). Isso permite testar a engine de cálculo isoladamente e mantém o código modular e de fácil manutenção.

## Decisões técnicas

| Decisão | Motivo |
|---|---|
| Parser two-pass manual | Evita `eval()` e vulnerabilidades |
| `event.code` no NumPad | Funciona com NumLock desligado |
| CSS custom properties | Troca de tema instantânea, sem reflow |
| `requestAnimationFrame` no `adjustFontSize` | Leitura correta do scrollWidth após atualização do DOM |
| `:not(.mem-btn)` nos seletores | Impede vazamento de eventos para a grade principal |
| Separação calculator.js / script.js | Lógica testável isoladamente; DOM desacoplado |

## Uso

Abra `index.html` em qualquer navegador moderno.

### Ações

| Entrada | Ação |
|---|---|
| Clique nos botões | Insere número/operador |
| NumPad | Mesma função, mesmo com NumLock off |
| `C` | Limpa o display |
| `⌫` / `Backspace` | Apaga o último caractere |
| `Space` | Limpa o display (atalho de teclado) |
| `=` / `Enter` | Calcula a expressão |
| `%` | Percentual do último número |
| `±` | Inverte o sinal |
| `MC` | Limpa a memória |
| `MR` | Insere o valor da memória no display |
| `M+` | Soma o display à memória |
| `M-` | Subtrai o display da memória |
| `⌃` / `⌄` | Recolhe / expande o histórico |
| `✕` | Limpa o histórico |
| `☀️` / `🌙` | Alterna tema claro / escuro |

## Tecnologias

HTML5, CSS3 (Flexbox, Grid, Custom Properties), JavaScript (Vanilla ES6+).

Nenhuma dependência externa ou framework.
