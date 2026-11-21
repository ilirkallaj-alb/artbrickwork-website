(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Gallery filters
  var buttons = document.querySelectorAll('.filters button');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      document.querySelectorAll('.gallery figure').forEach(function (fig) {
        fig.classList.toggle('hide', f !== 'all' && fig.getAttribute('data-cat') !== f);
      });
    });
  });

  // Lightbox
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('.gallery figure').forEach(function (fig) {
      fig.addEventListener('click', function () {
        var img = fig.querySelector('img');
        lbImg.src = img.getAttribute('data-full') || img.src;
        lbImg.alt = img.alt;
        lb.classList.add('open');
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
  }

  // Quote form (AJAX with graceful fallback to normal POST)
  var form = document.querySelector('#quote-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      status.className = 'form-status';
      fetch(form.getAttribute('data-ajax'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && String(res.d.success) !== 'false') {
            form.reset();
            status.textContent = 'Thank you! Your request has been sent. We will get back to you within 24 hours.';
            status.className = 'form-status ok';
          } else { throw new Error('send'); }
        })
        .catch(function () {
          status.innerHTML = 'Sorry, something went wrong. Please call us or email <a href="mailto:Artbrickwork@hotmail.com">Artbrickwork@hotmail.com</a>.';
          status.className = 'form-status err';
        })
        .finally(function () { btn.disabled = false; btn.textContent = 'Request My Free Quote'; });
    });
  }
})();
