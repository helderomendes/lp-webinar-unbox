/**
 * Recebe a inscrição do formulário e repassa para o webhook da Revi.
 *
 * Por que passar por aqui em vez de o navegador chamar o webhook direto:
 *   1. o secret fica no servidor — no navegador ele seria público no código-fonte;
 *   2. sem CORS: a página chama /api/lead, que é a mesma origem;
 *   3. dá para validar e barrar spam antes de sujar o CRM.
 *
 * Variáveis de ambiente (painel do Vercel → Settings → Environment Variables):
 *   REVI_WEBHOOK_SECRET  obrigatória — valor do header x-revi-secret
 *   REVI_WEBHOOK_URL     opcional — sobrescreve a URL padrão abaixo
 */

const WEBHOOK_PADRAO =
  'https://api.userevi.com/webhooks/listeners/b1890e28-1ad0-4238-a975-2e1883138565';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Deixa o telefone só com DDD + número, do jeito que a Revi espera.
 * Autopreenchimento manda "+55 11 98765-4321"; alguns navegadores mandam
 * "011 98765-4321". Os dois viram "11987654321".
 *
 * O 55 da frente só é cortado quando sobram dígitos demais para um número
 * local — 55 também é DDD válido (Santa Maria/RS).
 */
function normalizaTelefone(valor) {
  let d = String(valor || '').replace(/\D/g, '');
  if (d.startsWith('0055')) d = d.slice(4);
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  if (d.length > 10 && d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 11);
}

/** Fixo tem 10 dígitos; celular tem 11 e o terceiro é sempre 9. DDD começa em 11. */
function telefoneValido(d) {
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11 && d[2] !== '9') return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, erro: 'metodo_nao_permitido' });
  }

  const dados = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Armadilha de bot: campo invisível que só robô preenche.
  if (dados.website_confirm) {
    return res.status(200).json({ ok: true });   // finge sucesso, não repassa
  }

  const nome = String(dados.name || '').trim();
  const email = String(dados.email || '').trim().toLowerCase();
  const telefone = normalizaTelefone(dados.phone);

  if (nome.length < 2 || !EMAIL.test(email) || !telefoneValido(telefone)) {
    return res.status(422).json({ ok: false, erro: 'dados_invalidos' });
  }

  const payload = {
    event: 'webinar_lead',
    webinar: {
      slug: 'ai-commerce-hiper-customizacao',
      nome: 'AI Commerce: Hiper Customização de Jornada de Compra com AI',
      data: '2026-09-08T19:00:00-03:00'
    },
    lead: {
      name: nome,
      email,
      phone: telefone,
      store: String(dados.store || '').trim() || null,
      revenue: String(dados.revenue || '').trim() || null
    },
    source: dados.source || {},
    submitted_at: new Date().toISOString()
  };

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.REVI_WEBHOOK_SECRET) {
    headers['x-revi-secret'] = process.env.REVI_WEBHOOK_SECRET;
  }

  try {
    const r = await fetch(process.env.REVI_WEBHOOK_URL || WEBHOOK_PADRAO, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const corpo = await r.text().catch(() => '');
      console.error('[lead] webhook respondeu', r.status, corpo.slice(0, 300));
      return res.status(502).json({ ok: false, erro: 'webhook_recusou', status: r.status });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[lead] falha ao chamar o webhook:', e);
    return res.status(502).json({ ok: false, erro: 'webhook_indisponivel' });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
