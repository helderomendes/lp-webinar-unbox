# LP Webinar — Hipercustomização de E-commerce com IA (Revi × Unbox)

Landing page de captura para o webinar **"Hipercustomização de E-commerce e Jornada de Compra com IA"**,
com Bruno Pereira (fundador da Unbox) — 8 de setembro, às 19h.

Página única, sem build: abra o `index.html` no navegador ou publique o arquivo em qualquer host estático.

## Estrutura das seções

Segue a mesma lógica de uma LP de webinar do RD Station Landing Pages:

1. **Header sticky** — logos Revi × Unbox, data e CTA (no mobile vira barra fixa no rodapé)
2. **Hero** — headline, subheadline com data, bullets de atrativos, mini-card do palestrante e **formulário com contagem regressiva**
3. **Faixa de destaques** — sorteio ao vivo + mega desconto
4. **Contexto** — por que hipercustomização agora
5. **O que você vai descobrir** — 4 cards numerados
6. **Cases antes e depois** — Zétona, Oddie e Oto
7. **Palestrante** — Bruno Pereira
8. **Para quem é** — lojistas, empreendedores, marcas D2C
9. **Sorteio + desconto** — bloco de destaque com CTA
10. **FAQ** — accordion
11. **CTA final + rodapé**

## O que ajustar antes de publicar

### 1. Formulário (obrigatório)

No bloco `CONFIG`, no fim do `index.html`:

```js
var CONFIG = {
  eventDate: '2026-09-08T19:00:00-03:00',   // data/hora do webinar
  formEndpoint: '',                          // endpoint do form (vazio = modo demo)
  thankYouUrl: ''                            // página de obrigado
};
```

- `formEndpoint` **vazio** = modo demonstração: valida os campos e mostra a tela de confirmação
  **sem enviar dados a lugar nenhum**. Bom para revisar a página, não serve para captar lead.
- Para RD Station: `https://cta-redirect.rdstation.com/v2/conversions` + adicionar os hidden
  `token_rdstation` e `conversion_identifier` dentro do `<form id="leadForm">`.
- Para HubSpot/outro CRM: aponte `formEndpoint` para o endpoint correspondente ou troque o
  bloco de submit por embed do próprio CRM.

Campos enviados: `name`, `email`, `personal_phone`, `cf_loja`, `cf_faturamento_mensal`.

### 2. Logos e foto

Os arquivos oficiais já estão aplicados (vindos do Drive, pasta *Revi Marketing → Webinar Unbox*):

- `assets/logo-revi-dark.svg` — logo da Revi em versão dark, no header
- `assets/logo-unbox.png` — logo da Unbox (estrela neon + wordmark), no header
- `assets/bruno-pereira.jpg` — foto do palestrante, no hero e na seção dele
- `assets/og-cover.png` — imagem de compartilhamento 1200×630, gerada a partir dos logos

Para trocar qualquer um, basta substituir o arquivo mantendo o nome.

### 3. SEO — trocar o domínio

Antes de publicar, substitua `https://SEU-DOMINIO.com.br/webinar-ai-commerce` (4 ocorrências:
canonical, og:url e os dois blocos de dados estruturados) pela URL final. A página já traz:

- `<title>` com o tema completo e meta description de ~150 caracteres
- canonical, `og:url`, `og:site_name`, `og:locale` e `robots` com `max-image-preview:large`
- **JSON-LD de Event** (data, formato online, organizadores, palestrantes, ingresso gratuito)
- **JSON-LD de FAQPage** com as 7 perguntas, elegível a rich result no Google
- um único `<h1>`, `<h2>` por seção e `alt` em todas as imagens

### 4. Dados pendentes (marcados em amarelo na página)

Os trechos com fundo amarelo tracejado (`.todo`) são placeholders de dados que ainda não existem.
Eles são propositalmente visíveis para não irem ao ar por engano. Busque em `index.html` por `class="todo"`:

1. `[X]%` — percentual do desconto (3 ocorrências)
2. `[+X% de conversão]` / `[métrica real]` — um número por case
3. `[N]` — quantas lojas o Bruno já subiu com IA (2 ocorrências)

Faltam também os **prints antes/depois** dos cases (`assets/case-zetona.jpg`, `case-oddie.jpg`,
`case-oto.jpg`) e a **confirmação da política de gravação** citada no FAQ.

### 5. Links legais e pixels

- Política de Privacidade: dois `href="#"` (formulário e rodapé).
- Não há GTM/pixel instalado. Adicione antes do `</body>` conforme a stack de mídia.

## Identidade visual

| Token | Cor | Uso |
|---|---|---|
| `--bg` | `#05070F` | fundo base (dark mode Revi) |
| `--surface` | `#0B1130` | cards e superfícies |
| `--blue` | `#2F6BFF` | azul Revi |
| `--green` | `#25F58A` | neon Unbox |
| `--purple` | `#A855F7` | neon Unbox |
| `--neon` | gradiente verde → azul → roxo | botões, números, destaques |

Tipografia: **Space Grotesk** (títulos e botões) + **Inter** (texto).

## Elementos de IA

Camada visual que dá o clima de inteligência artificial, toda em CSS/Canvas — sem biblioteca externa:

- **Aurora** — véu de luz verde/azul/roxo e orbs que se movem devagar ao fundo
- **Rede neural** — canvas de nós conectados no hero, que reagem ao ponteiro do mouse
- **Esfera iridescente** — gradiente cônico girando atrás do formulário
- **Sparkles** — estrelas de 4 pontas (o mesmo desenho da marca Unbox) piscando em pontos-chave
- **Feixe de luz** — brilho que percorre o topo dos cards
- **Cursor neon** — ponto verde + anel azul com atraso, que cresce sobre elementos clicáveis

Tudo desligado automaticamente em `prefers-reduced-motion`. O cursor customizado só assume quando
há mouse de verdade (`pointer: fine`) e o JS carrega — sem isso, o cursor do sistema continua normal.
A rede neural pausa quando o hero sai da tela.

## Acessibilidade e performance

- Sem dependências externas além do Google Fonts.
- `prefers-reduced-motion` desliga todas as animações.
- Animações de entrada são à prova de falha: sem JS, tudo aparece normalmente.
- Foco visível em botões, campos e itens do FAQ; contagem regressiva com `role="timer"`.
