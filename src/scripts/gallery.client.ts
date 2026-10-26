const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('[data-category-link]'),
);
const sections = Array.from(
  document.querySelectorAll<HTMLElement>('[data-gallery-section]'),
);
const budgetCta =
  document.querySelector<HTMLAnchorElement>('[data-budget-cta]');
const baseMeta = document.querySelector<HTMLMetaElement>('meta[name="app-base"]');
const appBase = (baseMeta?.content ?? '/').replace(/\/$/, '');

function setActiveLink(slug: string): void {
  for (const link of links) {
    const isActive = link.dataset.categoryLink === slug;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

function updateBudgetCta(slug: string): void {
  if (!budgetCta) return;

  budgetCta.href =
    slug === 'todos'
      ? `${appBase}/contato/`
      : `${appBase}/contato/?categoria=${slug}`;
}

function showAll(updateUrl = true): void {
  for (const section of sections) {
    section.hidden = false;
  }

  setActiveLink('todos');
  updateBudgetCta('todos');

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.delete('categoria');
    window.history.pushState({ categoria: 'todos' }, '', url);
  }

  document.dispatchEvent(
    new CustomEvent('gallery:change', { detail: { slug: 'todos' } }),
  );
}

function activate(slug: string, updateUrl = true): void {
  const target = sections.find(
    (section) => section.dataset.gallerySection === slug,
  );

  if (!target) {
    showAll(updateUrl);
    return;
  }

  for (const section of sections) {
    section.hidden = section !== target;
  }

  setActiveLink(slug);
  updateBudgetCta(slug);

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('categoria', slug);
    window.history.pushState({ categoria: slug }, '', url);
  }

  document.dispatchEvent(
    new CustomEvent('gallery:change', { detail: { slug } }),
  );
}

for (const link of links) {
  link.addEventListener('click', (event) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const slug = link.dataset.categoryLink;
    if (!slug) return;

    event.preventDefault();

    if (slug === 'todos') {
      showAll();
    } else {
      activate(slug);
    }
  });
}

window.addEventListener('popstate', () => {
  const requested = new URL(window.location.href).searchParams.get('categoria');
  const isValid =
    requested &&
    sections.some((section) => section.dataset.gallerySection === requested);

  if (requested && isValid) {
    activate(requested, false);
  } else {
    showAll(false);
  }
});

const requestedOnLoad = new URL(window.location.href).searchParams.get(
  'categoria',
);
const initialIsValid =
  requestedOnLoad &&
  sections.some(
    (section) => section.dataset.gallerySection === requestedOnLoad,
  );

if (requestedOnLoad && initialIsValid) {
  activate(requestedOnLoad, false);
} else {
  showAll(false);
}
