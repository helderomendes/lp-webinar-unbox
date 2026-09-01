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

### 2. Logos e foto (placeholders)

Os logos hoje são **reconstruções em SVG inline** (marca da Unbox + wordmarks), não os arquivos oficiais:

- `index.html` → comentários `LOGO REVI` e `LOGO UNBOX` no header. Troque por
  `<img src="assets/logo-revi.svg">` / `assets/logo-unbox.svg` quando tiver os originais.
- Foto do palestrante: coloque o arquivo em **`assets/bruno-pereira.jpg`**. Sem o arquivo,
  a página cai automaticamente para o monograma "BP".
- Imagem de compartilhamento: `assets/og-cover.png` (1200×630).

### 3. Links legais e pixels

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

## Acessibilidade e performance

- Sem dependências externas além do Google Fonts.
- `prefers-reduced-motion` desliga todas as animações.
- Animações de entrada são à prova de falha: sem JS, tudo aparece normalmente.
- Foco visível em botões, campos e itens do FAQ; contagem regressiva com `role="timer"`.
