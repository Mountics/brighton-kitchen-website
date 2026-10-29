// Brighton College Kitchen: page behaviour (no dependencies)

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav: menu button opens and closes the links
var navToggle = document.querySelector('.nav-toggle');
var siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  var setMenu = function (open) {
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    siteNav.classList.toggle('is-open', open);
  };
  navToggle.addEventListener('click', function () {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  // Close after choosing a link
  siteNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  // Close with Esc and return focus to the button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });
  // Close when tapping outside the header
  document.addEventListener('click', function (event) {
    if (siteNav.classList.contains('is-open') && !event.target.closest('.site-header')) setMenu(false);
  });
  // Reset if the screen grows to desktop width
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });
}

// FAQ accordion: one answer open at a time
document.querySelectorAll('[data-faq]').forEach(function (list) {
  var buttons = list.querySelectorAll('.faq__q');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      buttons.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls')).hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls')).hidden = false;
      }
    });
  });
});

// Reveal sections as they scroll into view, staggering items in the same row
var revealEls = document.querySelectorAll('[data-reveal]');
revealEls.forEach(function (el) {
  var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
    return child.hasAttribute('data-reveal');
  });
  var index = siblings.indexOf(el);
  if (index > 0) el.style.setProperty('--reveal-delay', Math.min(index, 5) * 0.08 + 's');
});
if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function (el) { revealObserver.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });
}

// Gallery: click a photo to view it larger, with previous/next and keyboard arrows
var galleryButtons = document.querySelectorAll('.gallery__open');
if (galleryButtons.length) {
  var icon = function (d) {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };
  var lightbox = document.createElement('dialog');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-label', 'Kitchen photo');
  lightbox.innerHTML =
    '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      '<span class="lightbox__count"></span>' +
    '</figure>' +
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Close">' + icon('<path d="M6 6l12 12"/><path d="M18 6 6 18"/>') + '</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous photo">' + icon('<path d="m15 6-6 6 6 6"/>') + '</button>' +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Next photo">' + icon('<path d="m9 6 6 6-6 6"/>') + '</button>';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector('.lightbox__img');
  var lbCaption = lightbox.querySelector('.lightbox__caption');
  var lbCount = lightbox.querySelector('.lightbox__count');
  var current = 0;

  var showPhoto = function (index) {
    current = (index + galleryButtons.length) % galleryButtons.length;
    var source = galleryButtons[current].querySelector('img');
    lbImg.src = source.currentSrc || source.src;
    lbImg.alt = source.alt;
    lbCaption.textContent = source.alt;
    lbCount.textContent = (current + 1) + ' / ' + galleryButtons.length;
    // restart the fade-in for each photo
    lbImg.style.animation = 'none';
    void lbImg.offsetWidth;
    lbImg.style.animation = '';
  };

  galleryButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
      showPhoto(index);
      lightbox.showModal();
    });
  });
  lightbox.querySelector('.lightbox__close').addEventListener('click', function () { lightbox.close(); });
  lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { showPhoto(current - 1); });
  lightbox.querySelector('.lightbox__next').addEventListener('click', function () { showPhoto(current + 1); });
  // Clicking the dark area around the photo closes it
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox || event.target.classList.contains('lightbox__figure')) lightbox.close();
  });
  lightbox.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') showPhoto(current - 1);
    if (event.key === 'ArrowRight') showPhoto(current + 1);
  });
  // Return focus to the photo that was opened
  lightbox.addEventListener('close', function () { galleryButtons[current].focus(); });
}

// Back-to-top button
var toTop = document.createElement('button');
toTop.type = 'button';
toTop.className = 'to-top';
toTop.setAttribute('aria-label', 'Back to top');
toTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>';
toTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
document.body.appendChild(toTop);

var ticking = false;
function onScroll() {
  toTop.classList.toggle('is-shown', window.scrollY > window.innerHeight);
  ticking = false;
}
window.addEventListener('scroll', function () {
  if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

// Highlight the nav link for the section currently on screen (homepage only)
var navLinks = document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)');
if (navLinks.length && 'IntersectionObserver' in window) {
  var linkFor = {};
  navLinks.forEach(function (link) { linkFor[link.getAttribute('href').slice(1)] = link; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) { link.classList.remove('is-active'); });
      linkFor[entry.target.id].classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(linkFor).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) spy.observe(section);
  });
}

// Enquiry form
var form = document.querySelector('[data-enquiry-form]');
if (form) {
  var success = document.querySelector('[data-form-success]');
  var resetBtn = document.querySelector('[data-form-reset]');
  var submitBtn = form.querySelector('[type="submit"]');
  var locationSelect = form.elements.location;
  var locationHint = form.querySelector('[data-location-hint]');
  var addresses = {
    Melbourne: 'Level 1, 255 William Street, Melbourne, VIC 3000',
    Brisbane: 'Level 2, 108 Margaret Street, Brisbane City, QLD 4000'
  };

  // Show the address of the chosen city, with a link back to the homepage card
  function updateLocationHint() {
    if (!locationHint) return;
    var address = addresses[locationSelect.value];
    locationHint.innerHTML = address
      ? address + ' · <a href="index.html#locations">View kitchen</a>'
      : '';
  }

  // Pre-select the city when arriving from a location card (enquire.html?location=Melbourne)
  var params = new URLSearchParams(window.location.search);
  var city = params.get('location');
  if (city && locationSelect && addresses[city]) {
    locationSelect.value = city;
    locationSelect.closest('.field').classList.add('is-prefilled');
  }
  if (locationSelect) {
    locationSelect.addEventListener('change', updateLocationHint);
    updateLocationHint();
  }

  // Inline validation: show the browser's message under the field
  function checkField(input) {
    var field = input.closest('.field');
    if (!field) return true;
    if (input.checkValidity()) {
      field.classList.remove('is-invalid');
      field.removeAttribute('data-error');
      return true;
    }
    field.classList.add('is-invalid');
    field.setAttribute('data-error', input.validationMessage);
    return false;
  }
  Array.prototype.forEach.call(form.elements, function (input) {
    if (!input.willValidate) return;
    input.addEventListener('blur', function () { checkField(input); });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('is-invalid')) checkField(input);
    });
    input.addEventListener('change', function () { checkField(input); });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var firstInvalid = null;
    Array.prototype.forEach.call(form.elements, function (input) {
      if (input.willValidate && !checkField(input)) {
        if (!firstInvalid) firstInvalid = input;
        var field = input.closest('.field');
        field.classList.remove('is-shake');
        void field.offsetWidth; // restart the shake animation
        field.classList.add('is-shake');
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    setLoading(true);
    sendEnquiry(form)
      .then(showSuccess)
      .catch(function () {
        alert('Sorry, something went wrong. Please try again.');
      })
      .then(function () { setLoading(false); });
  });

  // TODO: send the data to the real form handler. The confirmation only shows
  // once this promise resolves, so it must reject if delivery fails. Example:
  // return fetch(form.action, { method: 'POST', body: new FormData(form) })
  //   .then(function (res) { if (!res.ok) throw new Error('Send failed'); });
  function sendEnquiry() {
    return Promise.resolve();
  }

  function setLoading(isLoading) {
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.disabled = isLoading;
  }

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('.is-invalid, .is-prefilled').forEach(function (field) {
        field.classList.remove('is-invalid', 'is-prefilled');
      });
      updateLocationHint();
      success.hidden = true;
      form.hidden = false;
    });
  }
}
