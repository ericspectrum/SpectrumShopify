/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */




var links = document.links;
for (let i = 0, linksLength = links.length ; i < linksLength ; i++) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noreferrer noopener';
  }
}

/**
 * Desktop: move logo + secondary links into announcement-bar top row.
 * header__wrapper stays for nav links only. Mobile keeps original header layout.
 */
(function initHeaderTopBar() {
  const MQ = window.matchMedia('(min-width: 1000px)');
  let moved = false;
  let logoHome = null;
  let iconsHome = null;

  function getEls() {
    const header = document.querySelector('store-header.header') || document.querySelector('.shopify-section--header .header');
    const wrapper = header && header.querySelector('.header__wrapper');
    const logoSlot = document.querySelector('[data-header-top-slot="logo"]');
    const actionsSlot = document.querySelector('[data-header-top-slot="actions"]');
    const logo = document.querySelector('.header__logo');
    const icons = document.querySelector('.header__secondary-links');
    if (!header || !wrapper || !logoSlot || !actionsSlot || !logo || !icons) return null;
    return { header, wrapper, logoSlot, actionsSlot, logo, icons };
  }

  function rememberHomes(els) {
    if (!logoHome) {
      logoHome = document.createComment('header-logo-home');
      els.logo.parentNode.insertBefore(logoHome, els.logo);
    }
    if (!iconsHome) {
      iconsHome = document.createComment('header-icons-home');
      els.icons.parentNode.insertBefore(iconsHome, els.icons);
    }
  }

  function refreshAnnouncementHeight() {
    const section = document.querySelector('.shopify-section--announcement-bar');
    if (section) {
      document.documentElement.style.setProperty('--announcement-bar-height', `${section.clientHeight}px`);
    }
  }

  function moveToTopBar() {
    const els = getEls();
    if (!els || moved) return;
    rememberHomes(els);
    els.logoSlot.appendChild(els.logo);
    els.actionsSlot.appendChild(els.icons);
    document.documentElement.classList.add('header-top-bar-active');
    moved = true;
    refreshAnnouncementHeight();
  }

  function restoreToHeader() {
    if (!moved || !logoHome || !iconsHome) return;
    const logo = document.querySelector('.header__logo');
    const icons = document.querySelector('.header__secondary-links');
    if (logo) logoHome.parentNode.insertBefore(logo, logoHome);
    if (icons) iconsHome.parentNode.insertBefore(icons, iconsHome);
    document.documentElement.classList.remove('header-top-bar-active');
    moved = false;
    refreshAnnouncementHeight();
  }

  function sync() {
    if (MQ.matches) moveToTopBar();
    else restoreToHeader();
  }

  function run() {
    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  MQ.addEventListener('change', sync);
  document.addEventListener('shopify:section:load', run);
  document.addEventListener('shopify:section:reorder', run);
  // Restore before Shopify re-renders either section so nodes aren't destroyed
  document.addEventListener('shopify:section:unload', (event) => {
    const section = event.target;
    if (
      section
      && (
        section.classList.contains('shopify-section--announcement-bar')
        || section.classList.contains('shopify-section--header')
      )
    ) {
      restoreToHeader();
      logoHome = null;
      iconsHome = null;
    }
  });
})();

/**
 * Desktop header nav (after logo/icons move to announcement bar):
 * header__wrapper is nav-only. Size linklist into ~2 balanced rows;
 * if it still won't fit, allow full-width wrap.
 */
(function initDesktopNavLayout() {
  const MQ = window.matchMedia('(min-width: 1000px)');
  const WIDTH_BUFFER = 4;
  let resizeTimer = null;

  function getParts() {
    const header = document.querySelector('store-header.header') || document.querySelector('.shopify-section--header .header');
    if (!header) return null;
    const wrapper = header.querySelector('.header__wrapper');
    const nav = header.querySelector('.header__inline-navigation');
    const list = nav && nav.querySelector('.header__linklist');
    if (!wrapper || !nav || !list) return null;
    return { header, wrapper, nav, list };
  }

  function hideMore(list) {
    const moreItem = list.querySelector('[data-nav-more]');
    const moreList = list.querySelector('[data-nav-more-list]');
    list.querySelectorAll('.header__linklist-item.is-nav-overflow').forEach((item) => {
      item.hidden = false;
      item.classList.remove('is-nav-overflow');
    });
    if (moreList) {
      moreList.innerHTML = '';
      moreList.setAttribute('hidden', '');
    }
    if (moreItem) moreItem.hidden = true;
  }

  function resetListSizing(list) {
    list.style.removeProperty('width');
    list.style.removeProperty('max-width');
    list.style.removeProperty('flex-wrap');
  }

  function itemOuterWidth(el) {
    const styles = window.getComputedStyle(el);
    return el.offsetWidth
      + (parseFloat(styles.marginInlineStart) || 0)
      + (parseFloat(styles.marginInlineEnd) || 0);
  }

  function sumWidths(widths, from, to) {
    let total = 0;
    for (let i = from; i < to; i += 1) total += widths[i];
    return total;
  }

  function countWrapRows(itemWidths, availableWidth) {
    if (availableWidth <= 0) return Infinity;
    let rows = 1;
    let rowWidth = 0;

    itemWidths.forEach((width) => {
      const w = Math.min(width, availableWidth);
      if (rowWidth === 0) {
        rowWidth = w;
        return;
      }
      if (rowWidth + w <= availableWidth) {
        rowWidth += w;
        return;
      }
      rows += 1;
      rowWidth = w;
    });

    return rows;
  }

  function balancedBlockWidth(itemWidths) {
    const n = itemWidths.length;
    if (n <= 1) return sumWidths(itemWidths, 0, n);

    let bestMax = Infinity;
    let bestDiff = Infinity;

    for (let split = 1; split < n; split += 1) {
      const row1 = sumWidths(itemWidths, 0, split);
      const row2 = sumWidths(itemWidths, split, n);
      const diff = Math.abs(row1 - row2);
      const maxW = Math.max(row1, row2);

      if (diff < bestDiff || (diff === bestDiff && maxW < bestMax)) {
        bestDiff = diff;
        bestMax = maxW;
      }
    }

    return bestMax;
  }

  function widthForTwoRows(itemWidths, limit) {
    if (!itemWidths.length) return 0;

    let width = Math.ceil(balancedBlockWidth(itemWidths) + WIDTH_BUFFER);

    if (width > limit) {
      return countWrapRows(itemWidths, limit) <= 2 ? limit : null;
    }

    while (width < limit && countWrapRows(itemWidths, width) > 2) {
      width += 8;
    }

    if (countWrapRows(itemWidths, width) > 2) return null;
    return Math.min(width, limit);
  }

  function measureItemWidths(list) {
    list.style.setProperty('flex-wrap', 'nowrap');
    list.style.setProperty('width', 'max-content');
    list.style.setProperty('max-width', 'none');
    void list.offsetWidth;

    const items = [...list.querySelectorAll(':scope > .header__linklist-item:not([data-nav-more]):not([data-nav-row-break])')];
    const widths = items.map((item) => itemOuterWidth(item));

    list.style.removeProperty('flex-wrap');
    list.style.removeProperty('width');
    list.style.removeProperty('max-width');

    return { items, widths };
  }

  function layoutNav() {
    const parts = getParts();
    if (!parts) return;

    hideMore(parts.list);
    resetListSizing(parts.list);

    if (!MQ.matches) {
      parts.header.classList.remove('header--nav-inline', 'header--nav-stacked');
      return;
    }

    parts.header.classList.add('header--nav-inline');
    parts.header.classList.remove('header--nav-stacked');

    const available = Math.floor(parts.wrapper.clientWidth);
    const { widths } = measureItemWidths(parts.list);
    const blockWidth = widthForTwoRows(widths, available);

    if (blockWidth != null && blockWidth > 0) {
      parts.header.classList.add('header--nav-inline');
      parts.header.classList.remove('header--nav-stacked');
      parts.list.style.width = blockWidth + 'px';
      parts.list.style.maxWidth = available + 'px';
    } else {
      parts.header.classList.add('header--nav-stacked');
      parts.header.classList.remove('header--nav-inline');
    }
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutNav, 100);
  }

  function run() {
    // Wait a frame so top-bar move settles before measuring nav width
    requestAnimationFrame(layoutNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.addEventListener('resize', onResize);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run);
  }
  document.addEventListener('shopify:section:load', run);
})();
