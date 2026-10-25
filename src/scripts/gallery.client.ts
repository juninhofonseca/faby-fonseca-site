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

function activate(slug: string, updateUrl = true): void {
  const target = sections.find(
    (section) => section.dataset.gallerySection === slug,
  );

  if (!target) return;

  for (const section of sections) {
    section.hidden = section !== target;
  }

  for (const link of links) {
    const isActive = link.dataset.categoryLink === slug;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  if (budgetCta) {
    budgetCta.href = `${appBase}/contato/?categoria=${slug}`;
  }

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
    activate(slug);
  });
}

window.addEventListener('popstate', () => {
  const requested = new URL(window.location.href).searchParams.get('categoria');
  const fallback = sections[0]?.dataset.gallerySection;

  if (requested) {
    activate(requested, false);
  } else if (fallback) {
    activate(fallback, false);
  }
});

/*
 * O site é estático: o servidor não lê a query string no build. Por isso a
 * categoria pedida na URL é resolvida aqui, no primeiro carregamento. Sem
 * JavaScript todas as seções ficam visíveis (ver `noscript` do layout), o que
 * preserva o acesso ao conteúdo em links compartilhados.
 */
const requestedOnLoad = new URL(window.location.href).searchParams.get(
  'categoria',
);
const initialSlug =
  requestedOnLoad &&
  sections.some(
    (section) => section.dataset.gallerySection === requestedOnLoad,
  )
    ? requestedOnLoad
    : sections[0]?.dataset.gallerySection;

if (initialSlug) {
  activate(initialSlug, false);
}
