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
 * Mega-menu under the hovered nav row (not under the whole 2-row header).
 * Prevents the cursor from crossing a lower nav row and closing the panel.
 */
(function initMegaMenuRowPosition() {
  const MQ = window.matchMedia('(min-width: 1000px)');

  function containingBlock() {
    return document.querySelector('.shopify-section--header');
  }

  function positionFor(li) {
    const mega = li && li.querySelector(':scope > .mega-menu');
    const ancestor = containingBlock();
    if (!mega || !ancestor || !MQ.matches) return;

    const liRect = li.getBoundingClientRect();
    const ancestorRect = ancestor.getBoundingClientRect();
    const top = Math.max(0, Math.round(liRect.bottom - ancestorRect.top));
    mega.style.top = top + 'px';
    mega.dataset.megaRowPositioned = 'true';
  }

  function clearPosition(li) {
    const mega = li && li.querySelector(':scope > .mega-menu');
    if (!mega) return;
    mega.style.removeProperty('top');
    delete mega.dataset.megaRowPositioned;
  }

  function openItemFromEvent(event) {
    const nav = event.target;
    if (!(nav instanceof Element)) return null;
    const openLink = nav.querySelector('.header__linklist-link[aria-expanded="true"]');
    return openLink ? openLink.closest('.header__linklist-item') : null;
  }

  document.addEventListener('desktop-nav:dropdown:open', (event) => {
    const li = openItemFromEvent(event);
    if (li) {
      // Layout after un-hiding so measurements are correct
      requestAnimationFrame(() => positionFor(li));
    }
  });

  document.addEventListener('desktop-nav:dropdown:close', (event) => {
    const nav = event.target;
    if (!(nav instanceof Element)) return;
    nav.querySelectorAll('.mega-menu[data-mega-row-positioned]').forEach((mega) => {
      mega.style.removeProperty('top');
      delete mega.dataset.megaRowPositioned;
    });
  });

  // Reposition on resize while open
  window.addEventListener('resize', () => {
    if (!MQ.matches) {
      document.querySelectorAll('.mega-menu[data-mega-row-positioned]').forEach((mega) => {
        mega.style.removeProperty('top');
        delete mega.dataset.megaRowPositioned;
      });
      return;
    }
    const openLink = document.querySelector(
      '.shopify-section--header .header__linklist-link[aria-expanded="true"]'
    );
    const li = openLink && openLink.closest('.header__linklist-item');
    if (li) positionFor(li);
  });
})();

/**
 * Desktop header nav: header__wrapper is nav-only — full-width linklist.
 */
(function initDesktopNavLayout() {
  const MQ = window.matchMedia('(min-width: 1000px)');

  function getParts() {
    const header = document.querySelector('store-header.header') || document.querySelector('.shopify-section--header .header');
    if (!header) return null;
    const nav = header.querySelector('.header__inline-navigation');
    const list = nav && nav.querySelector('.header__linklist');
    if (!nav || !list) return null;
    return { header, nav, list };
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

  function layoutNav() {
    const parts = getParts();
    if (!parts) return;

    hideMore(parts.list);
    parts.list.style.removeProperty('width');
    parts.list.style.removeProperty('max-width');
    parts.list.style.removeProperty('flex-wrap');

    if (!MQ.matches) {
      parts.header.classList.remove('header--nav-inline', 'header--nav-stacked');
      return;
    }

    parts.header.classList.add('header--nav-inline');
    parts.header.classList.remove('header--nav-stacked');
    parts.list.style.width = '100%';
    parts.list.style.maxWidth = '100%';
  }

  function run() {
    requestAnimationFrame(layoutNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.addEventListener('resize', run);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run);
  }
  document.addEventListener('shopify:section:load', run);
  MQ.addEventListener('change', run);
})();
