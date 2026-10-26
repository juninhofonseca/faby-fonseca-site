import { test, expect } from '@playwright/test';

test.describe('Encaminhamento para orçamento', () => {
  test('CTA de Todos aponta para o contato sem categoria', async ({ page }) => {
    await page.goto('/portfolio/');

    await expect(page.locator('[data-budget-cta]')).toHaveAttribute('href', '/contato/');
  });

  test('CTA aponta para a categoria ativa', async ({ page }) => {
    await page.goto('/portfolio/?categoria=newborn');

    await expect(page.locator('[data-budget-cta]')).toHaveAttribute(
      'href',
      '/contato/?categoria=newborn',
    );
  });

  test('contato pré-seleciona a categoria e permite trocar', async ({ page }) => {
    await page.goto('/portfolio/?categoria=newborn');
    await page.locator('[data-budget-cta]').click();

    await expect(page).toHaveURL(/\/contato\/\?categoria=newborn/);
    await expect(page.locator('[data-category-select]')).toHaveValue('newborn');
    await expect(page.locator('[data-category-note]')).toContainText('Categoria pré-selecionada: Newborn');

    await page.locator('[data-category-select]').selectOption('ensaios');
    await expect(page.locator('[data-category-select]')).toHaveValue('ensaios');
    await expect(page.locator('[data-category-note]')).toContainText('Categoria selecionada: Ensaios');
  });

  test('parâmetro inválido abre o contato sem seleção', async ({ page }) => {
    await page.goto('/contato/?categoria=nao-existe');

    await expect(page.locator('[data-category-select]')).toHaveValue('');
  });

  test('acesso direto abre o contato sem seleção', async ({ page }) => {
    await page.goto('/contato/');

    await expect(page.locator('[data-category-select]')).toHaveValue('');
  });

  test('expõe WhatsApp, Instagram e e-mail corretos', async ({ page }) => {
    await page.goto('/contato/');

    const whatsapp = page.locator('[data-contact-whatsapp]');
    await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/5511967458235\?text=/);
    await expect(whatsapp).toHaveAttribute('href', /or%C3%A7amento|orçamento/);
    await expect(whatsapp).toHaveAttribute('target', '_blank');
    await expect(whatsapp).toHaveAttribute('rel', /noopener/);

    await expect(page.locator('[data-contact-instagram]')).toHaveAttribute(
      'href',
      'https://www.instagram.com/faby.fonseca.fotografia/',
    );
    await expect(page.locator('[data-contact-email]')).toHaveAttribute(
      'href',
      /^mailto:juninho\.fonseca@gmail\.com/,
    );
  });
});
