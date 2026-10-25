import { MIN_FILL_TIME_MS, PRIVACY_VERSION, WEB3FORMS_ENDPOINT } from '../lib/contact';
import {
  buildPayload,
  firstInvalidField,
  validateForm,
  type FieldErrors,
  type FieldName,
  type FormValues,
} from '../lib/contact-form';

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const FIELDS: FieldName[] = ['name', 'phone', 'email', 'category', 'details', 'consent'];

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  initForm(form);
}

function initForm(element: HTMLFormElement): void {
  const select = element.querySelector<HTMLSelectElement>('[data-category-select]');
  const note = element.querySelector<HTMLElement>('[data-category-note]');
  const counter = element.querySelector<HTMLElement>('[data-counter]');
  const details = element.querySelector<HTMLTextAreaElement>('[data-field="details"]');
  const submitButton = element.querySelector<HTMLButtonElement>('[data-submit]');
  const statusPanel = element.querySelector<HTMLElement>('[data-form-status]');
  const errorPanel = element.querySelector<HTMLElement>('[data-form-error]');
  const errorMessage = element.querySelector<HTMLElement>('[data-error-message]');
  const consentAt = element.querySelector<HTMLInputElement>('[data-consent-at]');
  const subject = element.querySelector<HTMLInputElement>('[data-subject]');
  const sourceInput = element.querySelector<HTMLInputElement>('input[name="source"]');
  const website = element.querySelector<HTMLInputElement>('[data-honeypot="website"]');
  const botcheck = element.querySelector<HTMLInputElement>('[data-honeypot="botcheck"]');

  const startedAt = Date.now();
  let sending = false;
  let sent = false;

  // Com JavaScript usamos validação própria; sem JavaScript o navegador valida pelos atributos.
  element.noValidate = true;

  applyRequestedCategory(select, note, sourceInput);

  select?.addEventListener('change', () => {
    clearError(element, 'category');
    updateCategoryNote(select, note);
  });

  if (details) {
    updateCounter(counter, details);
    details.addEventListener('input', () => updateCounter(counter, details));
  }

  for (const field of FIELDS) {
    const input = fieldElement(element, field);
    input?.addEventListener('input', () => clearError(element, field));
    input?.addEventListener('change', () => clearError(element, field));
  }

  element.addEventListener('submit', (event) => {
    event.preventDefault();

    if (sending || sent) return;

    const values = readValues(element);
    const errors = validateForm(values);
    showErrors(element, errors);

    const invalid = firstInvalidField(errors);
    if (invalid) {
      focusField(element, invalid);
      return;
    }

    const honeypotFilled = Boolean(website?.value.trim()) || Boolean(botcheck?.checked);

    if (honeypotFilled) {
      // Robô: fingimos sucesso para não revelar a proteção.
      showSuccess();
      return;
    }

    if (Date.now() - startedAt < getMinFillTime(element)) {
      showError('Aguarde alguns segundos e tente novamente.');
      return;
    }

    void send(values);
  });

  async function send(values: FormValues): Promise<void> {
    if (!submitButton || !consentAt) return;

    setSending(true);
    hidePanels();

    const consentTimestamp = new Date().toISOString();
    consentAt.value = consentTimestamp;

    if (subject) {
      subject.value = buildSubject(values);
    }

    const payload = buildPayload(values, {
      accessKey: element.querySelector<HTMLInputElement>('input[name="access_key"]')?.value ?? '',
      privacyVersion: PRIVACY_VERSION,
      consentAt: consentTimestamp,
      source: element.querySelector<HTMLInputElement>('input[name="source"]')?.value ?? 'direto',
      subject: subject?.value ?? 'Novo pedido de orçamento pelo site',
    });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await readJson(response);

      if (response.ok && data?.success !== false) {
        showSuccess();
      } else {
        showError(data?.message?.trim() || undefined);
      }
    } catch {
      showError('Não foi possível concluir o envio. Verifique sua conexão e tente novamente.');
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function setSending(value: boolean): void {
    sending = value;
    element.setAttribute('aria-busy', String(value));

    if (!submitButton) return;

    submitButton.disabled = value;
    submitButton.textContent = value ? 'Enviando…' : 'Enviar pedido';
  }

  function showSuccess(): void {
    sent = true;
    sending = false;

    element.reset();
    showErrors(element, {});
    updateCategoryNote(select, note);
    if (details) updateCounter(counter, details);

    element.setAttribute('aria-busy', 'false');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Pedido enviado';
    }

    if (errorPanel) errorPanel.hidden = true;
    if (statusPanel) {
      statusPanel.hidden = false;
      statusPanel.querySelector<HTMLElement>('[data-status-title]')?.focus();
    }
  }

  function showError(message?: string): void {
    setSending(false);

    if (message && errorMessage) {
      errorMessage.textContent = message;
    }

    if (statusPanel) statusPanel.hidden = true;
    if (errorPanel) {
      errorPanel.hidden = false;
      errorPanel.querySelector<HTMLElement>('[data-error-title]')?.focus();
    }
  }

  function hidePanels(): void {
    if (statusPanel) statusPanel.hidden = true;
    if (errorPanel) errorPanel.hidden = true;
  }

  function buildSubject(values: FormValues): string {
    const label = select?.selectedOptions[0]?.textContent?.trim();
    const parts = ['Novo pedido de orçamento'];

    if (label && values.category) parts.push(label);
    if (values.name.trim()) parts.push(values.name.trim());

    return parts.join(' — ');
  }
}

function getRequestedCategory(
  select: HTMLSelectElement,
): { option: HTMLOptionElement; label: string } | null {
  const requested = new URL(window.location.href).searchParams.get('categoria');
  if (!requested) return null;

  const option = Array.from(select.options).find(
    (candidate) => candidate.value === requested,
  );

  if (!option || !option.value) return null;

  return { option, label: option.textContent?.trim() ?? '' };
}

function applyRequestedCategory(
  select: HTMLSelectElement | null,
  note: HTMLElement | null,
  source: HTMLInputElement | null,
): void {
  if (!select) return;

  const requested = getRequestedCategory(select);
  if (!requested) return;

  select.value = requested.option.value;

  if (note) {
    note.textContent = `Categoria pré-selecionada: ${requested.label}.`;
    note.hidden = false;
  }

  if (source) {
    source.value = `galeria:${requested.option.value}`;
  }
}

function fieldElement(form: HTMLFormElement, field: FieldName): FieldElement | null {
  return form.querySelector<FieldElement>(`[data-field="${field}"]`);
}

/**
 * Lido a cada envio para que o valor possa ser ajustado sem recriar o formulário.
 * O padrão vem de `MIN_FILL_TIME_MS` e é gravado em `data-min-fill-ms`.
 */
function getMinFillTime(element: HTMLFormElement | null = form): number {
  const value = Number(element?.dataset.minFillMs);
  return Number.isFinite(value) && value >= 0 ? value : MIN_FILL_TIME_MS;
}

function readValues(form: HTMLFormElement): FormValues {
  const value = (field: FieldName): string => fieldElement(form, field)?.value ?? '';
  const consent = fieldElement(form, 'consent') as HTMLInputElement | null;

  return {
    name: value('name'),
    phone: value('phone'),
    email: value('email'),
    category: value('category'),
    details: value('details'),
    consent: Boolean(consent?.checked),
  };
}

function showErrors(form: HTMLFormElement, errors: FieldErrors): void {
  for (const field of FIELDS) {
    const input = fieldElement(form, field);
    const error = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    const message = errors[field];

    if (message) {
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }
      input?.setAttribute('aria-invalid', 'true');
    } else {
      clearError(form, field);
    }
  }
}

function clearError(form: HTMLFormElement, field: FieldName): void {
  const input = fieldElement(form, field);
  const error = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);

  input?.removeAttribute('aria-invalid');

  if (error) {
    error.textContent = '';
    error.hidden = true;
  }
}

function focusField(form: HTMLFormElement, field: FieldName): void {
  fieldElement(form, field)?.focus();
}

function updateCounter(
  counter: HTMLElement | null,
  details: HTMLInputElement | HTMLTextAreaElement,
): void {
  if (!counter) return;
  counter.textContent = `${details.value.length}/${details.maxLength}`;
}

function updateCategoryNote(
  select: HTMLSelectElement | null,
  note: HTMLElement | null,
): void {
  if (!select || !note) return;

  const current = select.selectedOptions[0];
  const label = current?.value ? current.textContent?.trim() ?? '' : '';

  if (!label) {
    note.hidden = true;
    note.textContent = '';
    return;
  }

  note.textContent = `Categoria selecionada: ${label}.`;
  note.hidden = false;
}

async function readJson(
  response: Response,
): Promise<{ success?: boolean; message?: string } | null> {
  try {
    return (await response.json()) as { success?: boolean; message?: string };
  } catch {
    return null;
  }
}
