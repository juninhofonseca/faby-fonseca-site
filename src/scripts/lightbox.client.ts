const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');

if (dialog) {
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const title = dialog.querySelector<HTMLElement>('[data-lightbox-title]');
  const position = dialog.querySelector<HTMLElement>('[data-lightbox-position]');
  const closeButton =
    dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  const prevButton =
    dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
  const nextButton =
    dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]');

  let cards: HTMLAnchorElement[] = [];
  let index = 0;
  let trigger: HTMLElement | null = null;
  let failed = new Set<number>();

  function getVisibleCards(): HTMLAnchorElement[] {
    return Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        '[data-gallery-section]:not([hidden]) [data-photo-card]',
      ),
    );
  }

  function preload(offset: number): void {
    if (cards.length < 2) return;

    const candidate = cards[(index + offset + cards.length) % cards.length];
    const source = candidate?.dataset.fullSrc;

    if (source) {
      const preloaded = new Image();
      preloaded.src = source;
    }
  }

  function update(): void {
    const card = cards[index];

    if (!card || !image || !position) return;

    image.src = card.dataset.fullSrc ?? '';
    image.alt = card.dataset.alt ?? '';

    if (title) {
      title.textContent = card.dataset.title ?? '';
    }

    position.textContent = `Foto ${index + 1} de ${cards.length}`;
    preload(1);
    preload(-1);
  }

  function open(card: HTMLAnchorElement): void {
    cards = getVisibleCards();

    const cardIndex = cards.indexOf(card);
    index = cardIndex >= 0 ? cardIndex : Number(card.dataset.index ?? 0);
    trigger = card;
    failed = new Set();

    update();

    if (!dialog!.open) {
      dialog!.showModal();
    }

    closeButton?.focus();
  }

  function go(delta: number): void {
    if (cards.length === 0) return;

    index = (index + delta + cards.length) % cards.length;
    update();
  }

  document.addEventListener('click', (event) => {
    if (
      !(event.target instanceof Element) ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const card = event.target.closest<HTMLAnchorElement>('[data-photo-card]');
    if (!card) return;

    event.preventDefault();
    open(card);
  });

  prevButton?.addEventListener('click', () => go(-1));
  nextButton?.addEventListener('click', () => go(1));
  closeButton?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    trigger?.focus();
    trigger = null;
  });

  image?.addEventListener('error', () => {
    if (!dialog.open || cards.length === 0) return;

    failed.add(index);

    if (failed.size >= cards.length) {
      dialog.close();
      return;
    }

    for (let step = 1; step <= cards.length; step += 1) {
      const candidate = (index + step) % cards.length;
      if (!failed.has(candidate)) {
        index = candidate;
        update();
        break;
      }
    }
  });
}
