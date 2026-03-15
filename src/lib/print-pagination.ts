const MIN_SECTION_LINES_AFTER_HEADING = 3;

function getResolvedLineHeight(el: HTMLElement): number {
  const view = el.ownerDocument.defaultView ?? window;
  const style = view.getComputedStyle(el);
  const explicitLineHeight = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(explicitLineHeight)) {
    return explicitLineHeight;
  }

  const fontSize = Number.parseFloat(style.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.2 : 19.2;
}

function getFirstContentLineHeight(heading: HTMLElement, scope: HTMLElement): number {
  const doc = scope.ownerDocument;
  const showElement = doc.defaultView?.NodeFilter.SHOW_ELEMENT ?? 1;
  const walker = doc.createTreeWalker(scope, showElement);
  let seenHeading = false;
  let currentNode = walker.nextNode();

  while (currentNode) {
    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = walker.nextNode();
      continue;
    }

    const currentEl = currentNode as HTMLElement;

    if (!seenHeading) {
      if (currentEl === heading) {
        seenHeading = true;
      }
      currentNode = walker.nextNode();
      continue;
    }

    if (heading.contains(currentEl)) {
      currentNode = walker.nextNode();
      continue;
    }

    const text = currentEl.innerText?.trim();
    if (text) {
      return getResolvedLineHeight(currentEl);
    }

    currentNode = walker.nextNode();
  }

  return getResolvedLineHeight(heading);
}

function markNudged(target: HTMLElement): void {
  if (!target.hasAttribute("data-page-nudge")) {
    target.setAttribute("data-page-nudge", "1");
    target.setAttribute("data-page-nudge-original-pt", target.style.paddingTop ?? "");
  }
}

function applyTopPadding(target: HTMLElement, gap: number): void {
  if (gap <= 0) {
    return;
  }

  const view = target.ownerDocument.defaultView ?? window;
  const currentPaddingTop = Number.parseFloat(view.getComputedStyle(target).paddingTop) || 0;
  markNudged(target);
  target.style.paddingTop = `${currentPaddingTop + gap}px`;
}

function getSafePaddingTarget(el: HTMLElement, root: HTMLElement): HTMLElement {
  let target: HTMLElement = el;
  const parent = el.parentElement;
  const view = el.ownerDocument.defaultView ?? window;

  if (
    parent &&
    parent !== root &&
    view.getComputedStyle(parent).display !== "inline"
  ) {
    const blockChildren = Array.from(parent.children).filter(
      (child) => view.getComputedStyle(child as HTMLElement).display !== "none"
    );

    if (blockChildren.length === 1) {
      target = parent;
    }
  }

  return target;
}

function nudgeStraddlingAtomicBlocks(root: HTMLElement, pageHeight: number): void {
  const selectors = ["p", "li", "h2", "h3", "h4", "tr", "blockquote"].join(",");
  const rootTop = root.getBoundingClientRect().top;

  root.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elTop = rect.top - rootTop;
    const elBottom = rect.bottom - rootTop;
    const pageStart = Math.floor(elTop / pageHeight);
    const pageEnd = Math.floor((elBottom - 1) / pageHeight);

    if (pageStart === pageEnd) {
      return;
    }

    const nextPageTop = (pageStart + 1) * pageHeight;
    const gap = nextPageTop - elTop;
    const target = getSafePaddingTarget(el, root);
    applyTopPadding(target, gap);
  });
}

function nudgeSectionHeadings(root: HTMLElement, pageHeight: number): void {
  const rootTop = root.getBoundingClientRect().top;

  root.querySelectorAll<HTMLElement>("[data-print-section] h2").forEach((heading) => {
    const section = heading.closest<HTMLElement>("[data-print-section]");
    if (!section) {
      return;
    }

    const headingRect = heading.getBoundingClientRect();
    const headingBottom = headingRect.bottom - rootTop;
    const pageBottom = (Math.floor((headingBottom - 1) / pageHeight) + 1) * pageHeight;
    const remainingSpace = pageBottom - headingBottom;
    const requiredSpace = getFirstContentLineHeight(heading, section) * MIN_SECTION_LINES_AFTER_HEADING;

    if (remainingSpace >= requiredSpace) {
      return;
    }

    const sectionTop = section.getBoundingClientRect().top - rootTop;
    const currentPageStart = Math.floor(sectionTop / pageHeight);
    const nextPageTop = (currentPageStart + 1) * pageHeight;
    const gap = nextPageTop - sectionTop;

    applyTopPadding(section, gap);
  });
}

export function nudgePageBreaks(root: HTMLElement, pageHeight: number): void {
  root.querySelectorAll<HTMLElement>("[data-page-nudge]").forEach((el) => {
    el.style.paddingTop = el.getAttribute("data-page-nudge-original-pt") ?? "";
    el.removeAttribute("data-page-nudge");
    el.removeAttribute("data-page-nudge-original-pt");
  });

  nudgeSectionHeadings(root, pageHeight);
  nudgeStraddlingAtomicBlocks(root, pageHeight);
}
