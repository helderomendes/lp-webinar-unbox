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

### 1. Formulário e webhook (obrigatório)

A inscrição segue este caminho:

```
formulário → POST /api/lead (função serverless) → webhook da Revi
```

**Por que não chamar o webhook direto do navegador:** o secret `x-revi-secret` ficaria visível no
código-fonte da página para qualquer visitante, e o header customizado dispararia um preflight de
CORS que o webhook pode recusar. A função `api/lead.js` resolve os dois: guarda o secret no
servidor e recebe uma chamada de mesma origem.

**Configure no Vercel** (Settings → Environment Variables):

| Variável | Valor |
|---|---|
| `REVI_WEBHOOK_SECRET` | o secret do header `x-revi-secret` |
| `REVI_WEBHOOK_URL` | opcional, só se a URL do listener mudar |

Sem a variável, o envio continua funcionando — mas sem autenticação, limitado a 60 requisições
por minuto pela Revi.

**O que a função faz antes de repassar:**

- valida nome, e-mail e telefone (retorna `422` sem chamar o webhook se algo estiver errado)
- **normaliza o telefone**: `+55`, `0055` e o `0` antes do DDD são removidos, então
  `+55 11 98765-4321` e `011 98765-4321` chegam iguais, como `11987654321`. O `55` só é
  tratado como DDI quando sobram dígitos demais para um número local — 55 também é DDD
  válido (Santa Maria/RS). A validação exige DDD a partir de 11, 10 dígitos para fixo e
  11 para celular com o 9 na terceira posição
- descarta bots pelo campo-armadilha `website_confirm`, invisível no formulário
- normaliza e-mail para minúsculo e telefone para só dígitos
- monta o payload final:

```json
{
  "event": "webinar_lead",
  "webinar": { "slug": "...", "nome": "...", "data": "2026-09-08T19:00:00-03:00" },
  "lead": { "name": "", "email": "", "phone": "", "store": null, "revenue": null },
  "source": { "url": "", "referrer": "", "utm_source": "", "utm_campaign": "..." },
  "submitted_at": "ISO 8601"
}
```

UTMs, `gclid` e `fbclid` da URL entram sozinhos em `source`, então dá para medir de onde veio
cada inscrição.

**Se o envio falhar**, o formulário mostra um aviso vermelho, reabilita o botão e não exibe a tela
de confirmação — o visitante sabe que precisa tentar de novo. Em `CONFIG`, deixar `leadEndpoint`
vazio volta ao modo demonstração, que só mostra a confirmação sem enviar nada.

### 2. Logos e foto

Os arquivos oficiais já estão aplicados (vindos do Drive, pasta *Revi Marketing → Webinar Unbox*):

- `assets/logo-revi-dark.svg` — logo da Revi em versão dark, no header
- `assets/logo-unbox.png` — logo da Unbox (estrela neon + wordmark), no header
- `assets/bruno-pereira.jpg` — foto do palestrante, no hero e na seção dele
- `assets/og-cover.png` — imagem de compartilhamento 1200×630, gerada a partir dos logos

Para trocar qualquer um, basta substituir o arquivo mantendo o nome.

### 3. SEO — trocar o domínio

As tags apontam para `https://lp-webinar-unbox.vercel.app`. Ao ligar um domínio próprio, troque
essa URL no canonical, no `og:url`, no `og:image` e nos dois blocos de dados estruturados.
A página traz:

- `<title>` com o tema completo e meta description de ~150 caracteres
- canonical, `og:url`, `og:site_name`, `og:locale` e `robots` com `max-image-preview:large`
- **JSON-LD de Event** (data, formato online, organizadores, palestrantes, ingresso gratuito)
- **JSON-LD de FAQPage** com as 7 perguntas, elegível a rich result no Google
- um único `<h1>`, `<h2>` por seção e `alt` em todas as imagens

### 4. Lâminas dos cases (antes e depois)

Cada card de case mostra a captura do site dentro de um **mockup de laptop**: a lâmina rola
sozinha de cima a baixo e um **slider** revela o depois por cima do antes. Arquivos esperados
em `assets/`:

| Arquivo | Case |
|---|---|
| `case-oddie-depois.jpg` | Oddie — só o depois (sem slider, a lâmina só rola) |
| `case-pamela-antes.jpg` / `case-pamela-depois.jpg` | Pamela Concept |
| `case-badia-antes.jpg` / `case-badia-depois.jpg` | Badia |

**Como capturar:** página inteira (full page), largura de 1440px, JPEG ou WebP com qualidade
alta. Antes e depois da mesma marca não precisam ter a mesma altura — cada camada percorre a
própria sobra, então as duas chegam ao rodapé juntas.

As cinco lâminas já estão no repositório. **Se algum arquivo faltar, o mockup daquele card se
remove sozinho** e ele fica só com logo, categoria e texto — nada de imagem quebrada no ar.

Detalhes de comportamento: a rolagem pausa enquanto alguém arrasta o slider; o controle é um
`input[type=range]` invisível, então funciona no teclado; páginas mais longas rolam mais devagar,
para a leitura ficar parecida entre os cards; e com `prefers-reduced-motion` a lâmina fica parada
no topo, com o slider ainda funcionando.

### 5. Dados pendentes (marcados em amarelo na página)

Os trechos com fundo amarelo tracejado (`.todo`) são placeholders de dados que ainda não existem.
Eles são propositalmente visíveis para não irem ao ar por engano. Busque em `index.html` por `class="todo"`:

Falta a **confirmação da política de gravação** citada no FAQ e no CTA final.

### 7. Medição (GTM / GA4)

O loader da Revi está instalado no `<head>` com `defer`:

```html
<script defer src="https://df81sh4kfcckj.cloudfront.net/revi-loader.js?siteKey=..."></script>
```

A captura do lead é do webhook. O `track()` é só medição, empurrando para `window.dataLayer`
(lido por GTM, GA4 e Meta via GTM) e disparando um `CustomEvent` de mesmo nome no documento.

Dois eventos são emitidos:

- **`webinar_form_start`** — no primeiro clique dentro do formulário, para medir abandono
- **`webinar_lead`** — na inscrição validada, com `name`, `email` (minúsculo), `phone` (só dígitos),
  `loja`, `faturamento` e o identificador do webinar

Os nomes ficam em `CONFIG.leadEvent` e `CONFIG.formStartEvent`. Todo o bloco roda dentro de
`try/catch`: se o rastreamento falhar, a inscrição acontece do mesmo jeito.

### 8. Links legais e pixels

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
