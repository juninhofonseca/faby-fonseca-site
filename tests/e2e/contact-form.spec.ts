import { test, expect, type Page } from '@playwright/test';

const API = 'https://api.web3forms.com/submit';

const VALID = {
  name: 'Maria Silva',
  phone: '(11) 91234-5678',
  email: 'maria@exemplo.com',
  category: 'casamentos',
  details: 'Casamento em 12/09/2027, em São Paulo, com 120 convidados.',
};

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
};

async function mockApi(
  page: Page,
  handler: (body: Record<string, string>) => { status: number; body: unknown },
): Promise<string[]> {
  const received: string[] = [];

  await page.route(API, async (route) => {
    const request = route.request();

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS });
      return;
    }

    const body = request.postData() ?? '';
    received.push(body);

    const result = handler(JSON.parse(body || '{}'));
    await route.fulfill({
      status: result.status,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
      body: JSON.stringify(result.body),
    });
  });

  return received;
}

async function openForm(page: Page): Promise<void> {
  await page.goto('/contato/');
  // O tempo mínimo antispam é de 3 s; nos testes de fluxo normal ele é neutralizado.
  await page
    .locator('[data-contact-form]')
    .evaluate((form) => ((form as HTMLElement).dataset.minFillMs = '0'));
}

async function fillForm(page: Page, values = VALID): Promise<void> {
  await page.locator('[data-field="name"]').fill(values.name);
  await page.locator('[data-field="phone"]').fill(values.phone);
  await page.locator('[data-field="email"]').fill(values.email);
  await page.locator('[data-category-select]').selectOption(values.category);
  await page.locator('[data-field="details"]').fill(values.details);
  await page.locator('[data-field="consent"]').check();
}

test.describe('Formulário de orçamento', () => {
  test('envia o pedido e confirma sem guardar dados no navegador', async ({ page }) => {
    const requests = await mockApi(page, () => ({
      status: 200,
      body: { success: true, message: 'Form submitted successfully' },
    }));

    await openForm(page);
    await fillForm(page);
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-form-status]')).toBeVisible();
    await expect(page.locator('[data-status-title]')).toBeFocused();
    await expect(page.locator('[data-field="name"]')).toHaveValue('');

    expect(requests).toHaveLength(1);

    const payload = JSON.parse(requests[0] ?? '{}');
    expect(payload).toMatchObject({
      access_key: 'chave-de-teste-e2e',
      name: VALID.name,
      phone: VALID.phone,
      email: VALID.email,
      category: VALID.category,
      consent: 'sim',
      consent_version: '2026-10-25',
      from_name: 'Site Faby Fonseca',
      source: 'direto',
    });
    expect(payload.consent_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(payload.subject).toContain('Casamentos');
    expect(payload.subject).toContain(VALID.name);
    expect(payload.website).toBeUndefined();

    const storage = await page.evaluate(() => ({
      local: window.localStorage.length,
      session: window.sessionStorage.length,
      cookie: document.cookie,
      url: window.location.search,
    }));

    expect(storage).toEqual({ local: 0, session: 0, cookie: '', url: '' });
  });

  test('bloqueia o envio vazio e foca o primeiro campo', async ({ page }) => {
    const requests = await mockApi(page, () => ({ status: 200, body: { success: true } }));

    await openForm(page);
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-error-for="name"]')).toBeVisible();
    await expect(page.locator('[data-field="name"]')).toBeFocused();
    expect(requests).toHaveLength(0);
  });

  test('recusa e-mail inválido sem chamar o serviço', async ({ page }) => {
    const requests = await mockApi(page, () => ({ status: 200, body: { success: true } }));

    await openForm(page);
    await fillForm(page, { ...VALID, email: 'maria@' });
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-error-for="email"]')).toContainText('e-mail válido');
    await expect(page.locator('[data-field="email"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-field="email"]')).toBeFocused();
    expect(requests).toHaveLength(0);
  });

  test('exige consentimento e foca a caixa de autorização', async ({ page }) => {
    const requests = await mockApi(page, () => ({ status: 200, body: { success: true } }));

    await openForm(page);
    await fillForm(page);
    await page.locator('[data-field="consent"]').uncheck();
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-error-for="consent"]')).toContainText('autorizar');
    await expect(page.locator('[data-field="consent"]')).toBeFocused();
    expect(requests).toHaveLength(0);
  });

  test('mantém os dados quando o serviço retorna erro', async ({ page }) => {
    await mockApi(page, () => ({
      status: 500,
      body: { success: false, message: 'Erro temporário no serviço.' },
    }));

    await openForm(page);
    await fillForm(page);
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-form-error]')).toBeVisible();
    await expect(page.locator('[data-error-message]')).toHaveText('Erro temporário no serviço.');
    await expect(page.locator('[data-field="name"]')).toHaveValue(VALID.name);
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await expect(page.locator('[data-error-email]')).toHaveAttribute('href', /mailto:/);
    await expect(page.locator('[data-error-whatsapp]')).toHaveAttribute('href', /wa\.me/);
  });

  test('trata falha de rede como erro recuperável', async ({ page }) => {
    await page.route(API, (route) => route.abort('failed'));

    await openForm(page);
    await fillForm(page);
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-form-error]')).toBeVisible();
    await expect(page.locator('[data-error-message]')).toContainText('conexão');
    await expect(page.locator('[data-field="email"]')).toHaveValue(VALID.email);
  });

  test('descarta envio com o campo oculto preenchido', async ({ page }) => {
    const requests = await mockApi(page, () => ({ status: 200, body: { success: true } }));

    await openForm(page);
    await fillForm(page);
    await page
      .locator('[data-honeypot="website"]')
      .evaluate((input) => ((input as HTMLInputElement).value = 'https://spam.example'));
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-form-status]')).toBeVisible();
    expect(requests).toHaveLength(0);
  });

  test('descarta envio rápido demais', async ({ page }) => {
    const requests = await mockApi(page, () => ({ status: 200, body: { success: true } }));

    await page.goto('/contato/');
    await page
      .locator('[data-contact-form]')
      .evaluate((form) => ((form as HTMLElement).dataset.minFillMs = '60000'));

    await fillForm(page);
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-form-error]')).toBeVisible();
    await expect(page.locator('[data-error-message]')).toContainText('Aguarde');
    expect(requests).toHaveLength(0);
  });

  test('pré-seleciona a categoria vinda da galeria', async ({ page }) => {
    await page.goto('/contato/?categoria=ensaios');

    await expect(page.locator('[data-category-select]')).toHaveValue('ensaios');
    await expect(page.locator('[data-category-note]')).toContainText('Ensaios');
  });

  test('limita o campo de detalhes a 1000 caracteres', async ({ page }) => {
    await page.goto('/contato/');
    const details = page.locator('[data-field="details"]');

    await expect(details).toHaveAttribute('maxlength', '1000');
    await details.fill('a'.repeat(1200));
    await expect(details).toHaveValue('a'.repeat(1000));
    await expect(page.locator('[data-counter]')).toHaveText('1000/1000');
  });
});

test.describe('Formulário sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('mantém o envio nativo e o redirecionamento', async ({ page }) => {
    await page.goto('/contato/');

    const form = page.locator('[data-contact-form]');

    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', API);
    await expect(page.locator('input[name="access_key"]')).toHaveValue('chave-de-teste-e2e');
    await expect(page.locator('input[name="redirect"]')).toHaveValue(/\/contato\/enviado\/$/);
    await expect(page.locator('[data-field="consent"]')).not.toBeChecked();
  });

  test('exibe a confirmação no retorno do envio', async ({ page }) => {
    await page.goto('/contato/enviado/');

    await expect(page.locator('[data-sent-panel]')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Pedido enviado');
  });
});
