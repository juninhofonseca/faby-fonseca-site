/**
 * Validação e montagem do payload do formulário de orçamento.
 *
 * Funções puras, sem DOM: usadas pelo script do navegador e disponíveis para testes.
 * As regras espelham `specs/003-formulario-contato/data-model.md`.
 */

import { DETAILS_MAX_LENGTH, DETAILS_MIN_LENGTH } from './contact';

export interface FormValues {
  name: string;
  phone: string;
  email: string;
  category: string;
  details: string;
  consent: boolean;
}

export type FieldName = keyof FormValues;

export type FieldErrors = Partial<Record<FieldName, string>>;

export interface PayloadOptions {
  accessKey: string;
  privacyVersion: string;
  consentAt: string;
  source: string;
  subject: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Remove tudo que não for dígito e descarta o DDI brasileiro quando presente. */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D+/g, '');

  if (digits.startsWith('55') && digits.length > 11) {
    return digits.slice(2);
  }

  return digits;
}

export function validateField(field: FieldName, values: FormValues): string | null {
  switch (field) {
    case 'name': {
      const name = values.name.trim();
      if (!name) return 'Informe seu nome.';
      if (name.length < 2) return 'Informe pelo menos 2 caracteres.';
      if (name.length > 100) return 'Use no máximo 100 caracteres.';
      return null;
    }

    case 'phone': {
      const phone = normalizePhone(values.phone);
      if (!phone) return 'Informe um telefone para contato.';
      if (phone.length < 10 || phone.length > 11) {
        return 'Informe o telefone com DDD, por exemplo (11) 91234-5678.';
      }
      return null;
    }

    case 'email': {
      const email = values.email.trim();
      if (!email) return 'Informe seu e-mail.';
      if (email.length > 254) return 'Use no máximo 254 caracteres.';
      if (!EMAIL_PATTERN.test(email)) {
        return 'Informe um e-mail válido, por exemplo nome@exemplo.com.';
      }
      return null;
    }

    case 'category':
      if (!values.category) return 'Selecione a categoria de interesse.';
      return null;

    case 'details': {
      const details = values.details.trim();
      if (!details) return 'Conte um pouco sobre o evento.';
      if (details.length < DETAILS_MIN_LENGTH) {
        return `Descreva o evento com pelo menos ${DETAILS_MIN_LENGTH} caracteres.`;
      }
      if (details.length > DETAILS_MAX_LENGTH) {
        return `Use no máximo ${DETAILS_MAX_LENGTH} caracteres.`;
      }
      return null;
    }

    case 'consent':
      if (!values.consent) {
        return 'É necessário autorizar o uso dos dados para enviar o pedido.';
      }
      return null;

    default:
      return null;
  }
}

const FIELD_ORDER: FieldName[] = ['name', 'phone', 'email', 'category', 'details', 'consent'];

export function validateForm(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of FIELD_ORDER) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }

  return errors;
}

/** Primeiro campo com erro, na ordem visual do formulário. */
export function firstInvalidField(errors: FieldErrors): FieldName | null {
  return FIELD_ORDER.find((field) => Boolean(errors[field])) ?? null;
}

export function buildPayload(values: FormValues, options: PayloadOptions): Record<string, string> {
  const payload: Record<string, string> = {
    access_key: options.accessKey,
    subject: options.subject,
    from_name: 'Site Faby Fonseca',
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    category: values.category,
    details: values.details.trim(),
    consent: values.consent ? 'sim' : 'não',
    consent_version: options.privacyVersion,
    consent_at: options.consentAt,
    source: options.source,
  };

  return payload;
}
