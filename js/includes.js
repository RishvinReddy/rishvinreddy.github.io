/**
 * includes.js — Shared Header & Footer Loader
 * Fetches _header.html and _footer.html and injects them into their
 * placeholder elements, then re-executes any <script> tags within.
 */
(function () {
  'use strict';

  function execScripts(container) {
    container.querySelectorAll('script').forEach(function (oldScript) {
      var newScript = document.createElement('script');
      // Copy attributes (type, src, defer, etc.)
      Array.prototype.slice.call(oldScript.attributes).forEach(function (attr) {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function loadInclude(url, placeholderId) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url);
        return res.text();
      })
      .then(function (html) {
        var el = document.getElementById(placeholderId);
        if (!el) return;
        // Create a wrapper, inject HTML, then unwrap
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        el.parentNode.insertBefore(wrapper, el);
        el.parentNode.removeChild(el);
        // Execute any <script> blocks in the fetched HTML
        execScripts(wrapper);
        // Unwrap the div so the inserted elements sit directly in the parent
        var parent = wrapper.parentNode;
        while (wrapper.firstChild) {
          parent.insertBefore(wrapper.firstChild, wrapper);
        }
        parent.removeChild(wrapper);
      })
      .catch(function (err) {
        console.warn('[includes.js]', err.message);
      });
  }

  // Resolve the base path — works whether the page is at root or deeper
  function basePath() {
    // All pages are at root level in this project
    return '';
  }

  function init() {
    var base = basePath();
    Promise.all([
      loadInclude(base + '_header.html', 'site-header-placeholder'),
      loadInclude(base + '_footer.html', 'site-footer-placeholder')
    ]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
