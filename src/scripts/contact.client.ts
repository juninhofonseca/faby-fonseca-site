const select = document.querySelector<HTMLSelectElement>('[data-category-select]');
const note = document.querySelector<HTMLElement>('[data-category-note]');

if (select) {
  const requested = new URL(window.location.href).searchParams.get('categoria');
  const option = Array.from(select.options).find(
    (candidate) => candidate.value === requested,
  );

  if (option && option.value) {
    select.value = option.value;

    if (note) {
      note.textContent = `Categoria pré-selecionada: ${option.textContent?.trim() ?? ''}.`;
      note.hidden = false;
    }
  }

  select.addEventListener('change', () => {
    if (!note) return;

    const current = select.selectedOptions[0];
    const label = current?.value ? current.textContent?.trim() ?? '' : '';

    if (!label) {
      note.hidden = true;
      note.textContent = '';
      return;
    }

    note.textContent = `Categoria selecionada: ${label}.`;
    note.hidden = false;
  });
}
