/**
 * Dados públicos de contato e configuração do envio de orçamento.
 *
 * Nada aqui é secreto: o e-mail e o WhatsApp são divulgados de propósito, e a chave do
 * Web3Forms é uma chave de envio (aparece no HTML de qualquer site que usa o serviço).
 * A chave real nunca é versionada — vem de `PUBLIC_WEB3FORMS_KEY` no build.
 */

export const CONTACT_EMAIL = 'juninho.fonseca@gmail.com';

export const WHATSAPP_NUMBER = '5511967458235';

export const WHATSAPP_MESSAGE =
  'Olá, Faby! Vim pelo site e gostaria de um orçamento.';

/** Perfil público do Instagram, usado na home e no rodapé. */
export const INSTAGRAM_HANDLE = 'faby.fonseca.fotografia';

export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/** Versão do aviso de privacidade aceito no consentimento (ISO AAAA-MM-DD). */
export const PRIVACY_VERSION = '2026-10-25';

/** Data exibida na política e no bloco de consentimento (ISO AAAA-MM-DD). */
export const PRIVACY_EFFECTIVE_AT = '2026-10-25';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/** Tempo mínimo entre o carregamento e o envio, em milissegundos (antispam). */
export const MIN_FILL_TIME_MS = 3000;

/** Limite do campo de detalhes do evento. */
export const DETAILS_MAX_LENGTH = 1000;

/** Mínimo de caracteres para o campo de detalhes do evento. */
export const DETAILS_MIN_LENGTH = 10;

const EMAIL_SUBJECT = 'Orçamento pelo site';

export function buildMailtoHref(subject: string = EMAIL_SUBJECT): string {
  const params = new URLSearchParams({ subject });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export function buildWhatsappHref(): string {
  const params = new URLSearchParams({ text: WHATSAPP_MESSAGE });
  return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`;
}

/** Chave do Web3Forms injetada no build; vazia quando não configurada. */
export function getWeb3FormsKey(): string {
  return (import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '').trim();
}

export function isFormConfigured(key: string = getWeb3FormsKey()): boolean {
  return key.length > 0;
}

/** Formata uma data ISO (AAAA-MM-DD) como DD/MM/AAAA, sem depender do fuso do navegador. */
export function formatPrivacyDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}
