import { test, expect } from '@playwright/test';

test.describe('Encaminhamento para orçamento', () => {
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

    await page.locator('[data-category-select]').selectOption('ensaios');
    await expect(page.locator('[data-category-select]')).toHaveValue('ensaios');
  });

  test('parâmetro inválido abre o contato sem seleção', async ({ page }) => {
    await page.goto('/contato/?categoria=nao-existe');

    await expect(page.locator('[data-category-select]')).toHaveValue('');
  });

  test('acesso direto abre o contato sem seleção', async ({ page }) => {
    await page.goto('/contato/');

    await expect(page.locator('[data-category-select]')).toHaveValue('');
  });
});
