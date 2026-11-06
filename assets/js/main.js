/**
 * PIETRA VERA — Architectural Tile, Marble & Granite Flooring
 * Main Interactive Application Script (Vanilla JS + GSAP)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. THEME & RTL DIRECTION MANAGEMENT (WITH LOCALSTORAGE)
     ========================================================================== */
  const THEME_STORAGE_KEY = 'pietra_vera_theme';
  const DIR_STORAGE_KEY = 'pietra_vera_dir';

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // Ignore storage errors in restricted environments
    }

    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach((btn) => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.innerHTML = isDark
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    });
  }

  function getSavedDir() {
    try {
      return localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
    } catch (e) {
      return 'ltr';
    }
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    try {
      localStorage.setItem(DIR_STORAGE_KEY, dir);
    } catch (e) {
      // Ignore storage errors
    }

    const rtlButtons = document.querySelectorAll('[data-rtl-toggle]');
    rtlButtons.forEach((btn) => {
      const isRtl = dir === 'rtl';
      btn.textContent = isRtl ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      btn.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      btn.classList.toggle('active', isRtl);
    });
  }

  // Apply immediately on script load
  applyTheme(getSavedTheme());
  applyDir(getSavedDir());

  function initThemeToggles() {
    applyTheme(getSavedTheme());
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });
  }

  function initRtlToggles() {
    applyDir(getSavedDir());
    const rtlButtons = document.querySelectorAll('[data-rtl-toggle]');
    rtlButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        applyDir(next);
      });
    });
  }

  /* ==========================================================================
     2. STICKY NAVBAR, DESKTOP DROPDOWN (HOVER + CLICK) & MOBILE DRAWER
     ========================================================================== */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileDropdownBtn = document.getElementById('mobileHomeDropdownBtn');
    const mobileSubmenu = document.getElementById('mobileHomeSubmenu');

    // Sticky scroll state
    const handleScroll = () => {
      if (!header) return;
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Desktop dropdown: support click toggle in addition to CSS hover
    dropdownItems.forEach((item) => {
      const trigger = item.querySelector('[data-dropdown-trigger]');
      const menu = item.querySelector('.dropdown-menu-custom');
      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('is-open');
        dropdownItems.forEach((other) => {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('[data-dropdown-trigger]');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1024 && !item.classList.contains('is-open')) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close desktop dropdown when clicking outside
    document.addEventListener('click', (e) => {
      dropdownItems.forEach((item) => {
        if (!item.contains(e.target)) {
          item.classList.remove('is-open');
          const trigger = item.querySelector('[data-dropdown-trigger]');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Mobile drawer toggle
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', String(!expanded));
        mobileDrawer.classList.toggle('is-open', !expanded);
        document.body.style.overflow = !expanded ? 'hidden' : '';
      });

      // Close mobile menu when clicking a direct navigation link
      const mobileLinks = mobileDrawer.querySelectorAll('a');
      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileDrawer.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }

    // Mobile Home submenu accordion
    if (mobileDropdownBtn && mobileSubmenu) {
      mobileDropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = mobileSubmenu.classList.contains('is-open');
        mobileSubmenu.classList.toggle('is-open', !isOpen);
        mobileDropdownBtn.setAttribute('aria-expanded', String(!isOpen));
        const chevron = mobileDropdownBtn.querySelector('.dropdown-chevron');
        if (chevron) {
          chevron.style.transform = !isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }

    // Reset mobile drawer on desktop resize & Escape key
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        mobileDrawer.classList.remove('is-open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach((item) => {
          item.classList.remove('is-open');
          const trigger = item.querySelector('[data-dropdown-trigger]');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
        if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
          mobileDrawer.classList.remove('is-open');
          if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  }

  /* ==========================================================================
     3. INTERACTIVE BEFORE & AFTER COMPARISON SLIDERS
     ========================================================================== */
  function initBeforeAfterSliders() {
    const wrappers = document.querySelectorAll('.ba-comparison-wrapper');
    wrappers.forEach((wrapper) => {
      const range = wrapper.querySelector('.ba-range-input');
      const beforeLayer = wrapper.querySelector('.ba-before-layer');
      const handleLine = wrapper.querySelector('.ba-handle-line');

      if (!range || !beforeLayer || !handleLine) return;

      const updateSlider = (val) => {
        const percentage = Math.max(0, Math.min(100, Number(val)));
        beforeLayer.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        handleLine.style.left = `${percentage}%`;
      };

      updateSlider(range.value || 50);

      range.addEventListener('input', (e) => {
        updateSlider(e.target.value);
      });
    });

    // Transformation Preset Switcher on Home 1
    const presetButtons = document.querySelectorAll('[data-ba-preset]');
    const mainBaWrapper = document.getElementById('mainBeforeAfterStage');
    if (presetButtons.length > 0 && mainBaWrapper) {
      const beforeImg = mainBaWrapper.querySelector('.ba-before-layer img');
      const afterImg = mainBaWrapper.querySelector('.ba-after-layer img');
      const beforeTag = mainBaWrapper.querySelector('.ba-label-before');
      const afterTag = mainBaWrapper.querySelector('.ba-label-after');
      const captionTitle = document.getElementById('baCaptionTitle');
      const captionSpecs = document.getElementById('baCaptionSpecs');
      const rangeInput = mainBaWrapper.querySelector('.ba-range-input');
      const beforeLayer = mainBaWrapper.querySelector('.ba-before-layer');
      const handleLine = mainBaWrapper.querySelector('.ba-handle-line');

      presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          presetButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const beforeSrc = btn.getAttribute('data-before-img');
          const afterSrc = btn.getAttribute('data-after-img');
          const beforeLabel = btn.getAttribute('data-before-label');
          const afterLabel = btn.getAttribute('data-after-label');
          const title = btn.getAttribute('data-title');
          const specs = btn.getAttribute('data-specs');

          if (beforeImg && beforeSrc) beforeImg.src = beforeSrc;
          if (afterImg && afterSrc) afterImg.src = afterSrc;
          if (beforeTag && beforeLabel) beforeTag.textContent = beforeLabel;
          if (afterTag && afterLabel) afterTag.textContent = afterLabel;
          if (captionTitle && title) captionTitle.textContent = title;
          if (captionSpecs && specs) captionSpecs.textContent = specs;

          if (rangeInput && beforeLayer && handleLine) {
            rangeInput.value = 50;
            beforeLayer.style.clipPath = 'inset(0 50% 0 0)';
            handleLine.style.left = '50%';
          }
        });
      });
    }
  }

  /* ==========================================================================
     4. INTERACTIVE MATERIAL SWATCH EXPLORER (HOME 1)
     ========================================================================== */
  function initMaterialExplorer() {
    const swatchButtons = document.querySelectorAll('[data-material-swatch]');
    if (!swatchButtons.length) return;

    const stageImg = document.getElementById('materialStageImage');
    const stageCategory = document.getElementById('materialStageCategory');
    const stageTitle = document.getElementById('materialStageTitle');
    const stageDesc = document.getElementById('materialStageDesc');
    const stageOrigin = document.getElementById('materialSpecOrigin');
    const stageFinish = document.getElementById('materialSpecFinish');
    const stageHardness = document.getElementById('materialSpecHardness');
    const stageApplication = document.getElementById('materialSpecApp');
    const stageCta = document.getElementById('materialStageCta');

    swatchButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        swatchButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const data = {
          img: btn.getAttribute('data-img'),
          category: btn.getAttribute('data-category'),
          title: btn.getAttribute('data-title'),
          desc: btn.getAttribute('data-desc'),
          origin: btn.getAttribute('data-origin'),
          finish: btn.getAttribute('data-finish'),
          hardness: btn.getAttribute('data-hardness'),
          app: btn.getAttribute('data-app'),
          stoneType: btn.getAttribute('data-stone-type') || 'Marble'
        };

        if (stageImg && data.img) {
          stageImg.style.opacity = '0.4';
          setTimeout(() => {
            stageImg.src = data.img;
            stageImg.alt = data.title + ' flooring slab installation';
            stageImg.style.opacity = '1';
          }, 140);
        }
        if (stageCategory) stageCategory.textContent = data.category;
        if (stageTitle) stageTitle.textContent = data.title;
        if (stageDesc) stageDesc.textContent = data.desc;
        if (stageOrigin) stageOrigin.textContent = data.origin;
        if (stageFinish) stageFinish.textContent = data.finish;
        if (stageHardness) stageHardness.textContent = data.hardness;
        if (stageApplication) stageApplication.textContent = data.app;
        if (stageCta) {
          stageCta.href = `contact.html?stone=${encodeURIComponent(data.stoneType)}&material=${encodeURIComponent(data.title)}#quote-form`;
        }
      });
    });
  }

  /* ==========================================================================
     5. HOME 2 — ATELIER HERO SLAB SWITCHER & INTERACTIVE FLOORING ESTIMATOR
     ========================================================================== */
  function initHome2AtelierFeatures() {
    // Hero Slab Switcher
    const slabPills = document.querySelectorAll('[data-atelier-slab]');
    const heroImg = document.getElementById('atelierHeroImage');
    const heroSlabTitle = document.getElementById('atelierHeroSlabTitle');
    const heroSlabMeta = document.getElementById('atelierHeroSlabMeta');

    if (slabPills.length && heroImg) {
      slabPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          slabPills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');

          const imgSrc = pill.getAttribute('data-img');
          const title = pill.getAttribute('data-title');
          const meta = pill.getAttribute('data-meta');

          heroImg.style.opacity = '0.35';
          setTimeout(() => {
            if (imgSrc) heroImg.src = imgSrc;
            if (heroSlabTitle && title) heroSlabTitle.textContent = title;
            if (heroSlabMeta && meta) heroSlabMeta.textContent = meta;
            heroImg.style.opacity = '1';
          }, 150);
        });
      });
    }

    // Interactive Flooring Project Estimator on Home 2
    const estStone = document.getElementById('estStoneSelect');
    const estArea = document.getElementById('estAreaRange');
    const estAreaDisplay = document.getElementById('estAreaValue');
    const estProperty = document.getElementById('estPropertySelect');
    const estPriceOutput = document.getElementById('estRangeOutput');
    const estDurationOutput = document.getElementById('estDurationOutput');
    const estSystemOutput = document.getElementById('estSystemOutput');
    const estLockQuoteBtn = document.getElementById('estTransferBtn');

    if (estStone && estArea && estPriceOutput) {
      const rates = {
        Tiles: { min: 18, max: 28, system: 'Schluter Ditra + Polymer-Modified Thin-Set' },
        Marble: { min: 34, max: 52, system: 'Crack-Isolation Membrane + White Latex Mortar + Diamond Honing' },
        Granite: { min: 30, max: 46, system: 'High-Density Medium Bed Mortar + Epoxy Joint System' }
      };

      const recalculate = () => {
        const stone = estStone.value || 'Marble';
        const area = parseInt(estArea.value, 10) || 850;
        const prop = estProperty ? estProperty.value : 'Residential';
        const rateObj = rates[stone] || rates.Marble;

        if (estAreaDisplay) {
          estAreaDisplay.textContent = `${area.toLocaleString()} sq. ft.`;
        }

        const commMultiplier = prop === 'Commercial' ? 1.12 : 1.0;
        const minTotal = Math.round((area * rateObj.min * commMultiplier) / 100) * 100;
        const maxTotal = Math.round((area * rateObj.max * commMultiplier) / 100) * 100;

        estPriceOutput.textContent = `$${minTotal.toLocaleString()} – $${maxTotal.toLocaleString()}`;

        const days = Math.max(3, Math.ceil(area / 220));
        if (estDurationOutput) {
          estDurationOutput.textContent = `${days} – ${days + 3} Working Days`;
        }
        if (estSystemOutput) {
          estSystemOutput.textContent = rateObj.system;
        }
        if (estLockQuoteBtn) {
          estLockQuoteBtn.href = `contact.html?stone=${encodeURIComponent(stone)}&property=${encodeURIComponent(prop)}&area=${encodeURIComponent(area)}#quote-form`;
        }
      };

      estStone.addEventListener('change', recalculate);
      estArea.addEventListener('input', recalculate);
      if (estProperty) estProperty.addEventListener('change', recalculate);
      recalculate();
    }
  }

  /* ==========================================================================
     6. GALLERY CATEGORY FILTERS & INTERACTIVE IMAGE LIGHTBOX
     ========================================================================== */
  function initGalleryAndLightbox() {
    const filterButtons = document.querySelectorAll('[data-gallery-filter]');
    const galleryItems = document.querySelectorAll('.gallery-card-item');
    const countBadge = document.getElementById('galleryCountDisplay');

    const updateVisibleOddCenter = () => {
      const visible = Array.from(galleryItems).filter((el) => !el.classList.contains('is-hidden'));
      galleryItems.forEach((el) => el.classList.remove('tab-center-odd'));
      if (visible.length % 2 !== 0 && visible.length > 0) {
        visible[visible.length - 1].classList.add('tab-center-odd');
      }
    };

    if (filterButtons.length && galleryItems.length) {
      updateVisibleOddCenter();
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const filterValue = btn.getAttribute('data-gallery-filter');
          let visibleCount = 0;

          galleryItems.forEach((item) => {
            const categories = (item.getAttribute('data-category') || '').split(' ');
            const matches = filterValue === 'all' || categories.includes(filterValue);

            if (matches) {
              item.classList.remove('is-hidden');
              visibleCount++;
            } else {
              item.classList.add('is-hidden');
            }
          });

          updateVisibleOddCenter();

          if (countBadge) {
            countBadge.textContent = `Showing ${visibleCount} Architectural ${visibleCount === 1 ? 'Project' : 'Projects'}`;
          }
        });
      });
    }

    // Interactive Lightbox Modal
    const lightbox = document.getElementById('galleryLightbox');
    const triggers = document.querySelectorAll('[data-lightbox-trigger]');
    if (!lightbox || !triggers.length) return;

    const lbImg = document.getElementById('lightboxImage');
    const lbTitle = document.getElementById('lightboxTitle');
    const lbCategory = document.getElementById('lightboxCategory');
    const lbSpecs = document.getElementById('lightboxSpecs');
    const lbQuoteBtn = document.getElementById('lightboxQuoteLink');
    const lbClose = document.getElementById('lightboxCloseBtn');
    const lbPrev = document.getElementById('lightboxPrevBtn');
    const lbNext = document.getElementById('lightboxNextBtn');

    let currentIndex = 0;

    const getVisibleTriggers = () => {
      return Array.from(triggers).filter((t) => {
        const parentItem = t.closest('.gallery-card-item');
        return !parentItem || !parentItem.classList.contains('is-hidden');
      });
    };

    const populateLightbox = (triggerEl) => {
      if (!triggerEl) return;
      const img = triggerEl.getAttribute('data-img');
      const title = triggerEl.getAttribute('data-title') || 'Architectural Flooring Installation';
      const category = triggerEl.getAttribute('data-cat-label') || 'Luxury Flooring';
      const specs = triggerEl.getAttribute('data-specs') || '';
      const stone = triggerEl.getAttribute('data-stone') || 'Marble';

      if (lbImg && img) {
        lbImg.src = img;
        lbImg.alt = title;
      }
      if (lbTitle) lbTitle.textContent = title;
      if (lbCategory) lbCategory.textContent = category;
      if (lbSpecs) lbSpecs.textContent = specs;
      if (lbQuoteBtn) {
        lbQuoteBtn.href = `contact.html?stone=${encodeURIComponent(stone)}&material=${encodeURIComponent(title)}#quote-form`;
      }
    };

    const openLightbox = (triggerEl) => {
      const visibleList = getVisibleTriggers();
      currentIndex = Math.max(0, visibleList.indexOf(triggerEl));
      populateLightbox(triggerEl);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const stepLightbox = (direction) => {
      const visibleList = getVisibleTriggers();
      if (!visibleList.length) return;
      currentIndex = (currentIndex + direction + visibleList.length) % visibleList.length;
      populateLightbox(visibleList[currentIndex]);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(trigger);
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(trigger);
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => stepLightbox(-1));
    if (lbNext) lbNext.addEventListener('click', () => stepLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ==========================================================================
     7. CONTACT & QUOTATION FORM VALIDATION + URL PARAM PRE-FILL
     ========================================================================== */
  function initFormsAndValidation() {
    const quoteForm = document.getElementById('flooringQuoteForm');
    const quoteSuccessBox = document.getElementById('quoteSuccessConfirmation');
    const quoteResetBtn = document.getElementById('quoteResetBtn');

    // Pre-fill form fields if navigated with query params (?stone=Marble&property=Commercial&area=1200&material=...)
    if (quoteForm && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const stoneParam = params.get('stone');
      const propParam = params.get('property');
      const areaParam = params.get('area');
      const materialParam = params.get('material');

      if (stoneParam) {
        const stoneRadios = quoteForm.querySelectorAll('input[name="projectType"]');
        stoneRadios.forEach((radio) => {
          if (radio.value.toLowerCase() === stoneParam.toLowerCase()) {
            radio.checked = true;
          }
        });
        const stoneSelect = quoteForm.querySelector('#projectTypeSelect');
        if (stoneSelect) {
          Array.from(stoneSelect.options).forEach((opt) => {
            if (opt.value.toLowerCase().includes(stoneParam.toLowerCase())) {
              stoneSelect.value = opt.value;
            }
          });
        }
      }

      if (propParam) {
        const propSelect = quoteForm.querySelector('#propertyType');
        if (propSelect) {
          Array.from(propSelect.options).forEach((opt) => {
            if (opt.value.toLowerCase() === propParam.toLowerCase()) {
              propSelect.value = opt.value;
            }
          });
        }
      }

      if (areaParam) {
        const areaInput = quoteForm.querySelector('#projectArea');
        if (areaInput) areaInput.value = areaParam;
      }

      if (materialParam) {
        const msgInput = quoteForm.querySelector('#projectDetails');
        if (msgInput && !msgInput.value) {
          msgInput.value = `I am interested in requesting a flooring consultation and quotation for ${materialParam}.`;
        }
      }
    }

    if (quoteForm) {
      const validateField = (input) => {
        if (!input) return true;
        const val = input.value.trim();
        let valid = true;

        if (input.hasAttribute('required') && !val) {
          valid = false;
        } else if (input.type === 'email' && val) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        } else if (input.id === 'clientPhone' && val) {
          valid = /^[0-9+()\-\s]{7,20}$/.test(val);
        } else if (input.id === 'projectArea' && val) {
          const num = Number(val);
          valid = !isNaN(num) && num >= 20 && num <= 500000;
        }

        input.classList.toggle('is-invalid', !valid);
        return valid;
      };

      const inputs = quoteForm.querySelectorAll('.form-control-luxury, .form-select-luxury');
      inputs.forEach((input) => {
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid')) {
            validateField(input);
          }
        });
        input.addEventListener('blur', () => validateField(input));
      });

      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputs.forEach((input) => {
          if (!validateField(input)) {
            isFormValid = false;
          }
        });

        if (!isFormValid) {
          const firstInvalid = quoteForm.querySelector('.is-invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Gather submitted data for confirmation receipt
        const clientName = (quoteForm.querySelector('#clientName')?.value || 'Valued Client').trim();
        const selectedStoneRadio = quoteForm.querySelector('input[name="projectType"]:checked');
        const selectedStone = selectedStoneRadio ? selectedStoneRadio.value : 'Marble Flooring';
        const propertyType = quoteForm.querySelector('#propertyType')?.value || 'Residential';
        const projectArea = quoteForm.querySelector('#projectArea')?.value || '500';
        const projectLocation = quoteForm.querySelector('#projectLocation')?.value || 'Metro Area';
        const refCode = 'PV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

        const sumName = document.getElementById('confirmClientName');
        const sumRef = document.getElementById('confirmRefCode');
        const sumScope = document.getElementById('confirmScopeText');

        if (sumName) sumName.textContent = clientName;
        if (sumRef) sumRef.textContent = refCode;
        if (sumScope) {
          sumScope.textContent = `${selectedStone} (${propertyType}) — Approx. ${Number(projectArea).toLocaleString()} sq. ft. in ${projectLocation}`;
        }

        quoteForm.style.display = 'none';
        if (quoteSuccessBox) {
          quoteSuccessBox.style.display = 'block';
          quoteSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      if (quoteResetBtn) {
        quoteResetBtn.addEventListener('click', () => {
          quoteForm.reset();
          inputs.forEach((i) => i.classList.remove('is-invalid'));
          if (quoteSuccessBox) quoteSuccessBox.style.display = 'none';
          quoteForm.style.display = 'block';
        });
      }
    }

    // Footer Lookbook / Newsletter Form
    const footerForms = document.querySelectorAll('.footer-subscribe-form');
    footerForms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const feedbackEl = form.querySelector('.footer-form-feedback');
        if (!emailInput) return;

        const email = emailInput.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isValid) {
          emailInput.classList.add('is-invalid');
          if (feedbackEl) {
            feedbackEl.textContent = 'Please enter a valid architectural/client email address.';
            feedbackEl.style.color = '#F87171';
            feedbackEl.style.display = 'block';
          }
          return;
        }

        emailInput.classList.remove('is-invalid');
        emailInput.value = '';
        if (feedbackEl) {
          feedbackEl.textContent = 'Thank you. Our Architectural Stone Specification Catalog has been sent to your inbox.';
          feedbackEl.style.color = '#C8AA78';
          feedbackEl.style.display = 'block';
        }
      });
    });
  }

  /* ==========================================================================
     8. BACK TO TOP, IMAGE FALLBACK & GSAP SCROLL ANIMATIONS
     ========================================================================== */
  function initBackToTopAndAnimations() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      window.addEventListener(
        'scroll',
        () => {
          if (window.scrollY > 450) {
            backToTopBtn.classList.add('is-visible');
          } else {
            backToTopBtn.classList.remove('is-visible');
          }
        },
        { passive: true }
      );

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Graceful luxury stone texture SVG fallback if any external image fails to load
    const allImages = document.querySelectorAll('img');
    allImages.forEach((img) => {
      img.addEventListener('error', function handleImgError() {
        if (this.dataset.fallbackApplied) return;
        this.dataset.fallbackApplied = 'true';
        const label = (this.alt || 'Architectural Natural Stone').replace(/["'<>]/g, '').slice(0, 38);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#23211E"/>
              <stop offset="50%" stop-color="#191816"/>
              <stop offset="100%" stop-color="#2C2925"/>
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill="url(#g)"/>
          <path d="M0,220 Q340,180 620,290 T1200,240" fill="none" stroke="#A6824B" stroke-opacity="0.22" stroke-width="2"/>
          <path d="M120,800 Q480,520 820,440 T1200,140" fill="none" stroke="#F5F2EB" stroke-opacity="0.1" stroke-width="1.5"/>
          <rect x="60" y="60" width="1080" height="680" fill="none" stroke="#A6824B" stroke-opacity="0.28" stroke-width="1"/>
          <text x="600" y="390" text-anchor="middle" fill="#C8AA78" font-family="Georgia, serif" font-size="28" letter-spacing="4">PIETRA VERA ATELIER</text>
          <text x="600" y="435" text-anchor="middle" fill="#A8A29E" font-family="sans-serif" font-size="15" letter-spacing="3">${label.toUpperCase()}</text>
        </svg>`;
        this.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      });
    });

    // Subtle GSAP animations if GSAP is available
    if (typeof window.gsap !== 'undefined') {
      const revealEls = document.querySelectorAll('[data-gsap-reveal]');
      if (typeof window.ScrollTrigger !== 'undefined') {
        window.gsap.registerPlugin(window.ScrollTrigger);
        revealEls.forEach((el) => {
          window.gsap.fromTo(
            el,
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true
              }
            }
          );
        });
      }
    }
  }

  /* ==========================================================================
     INITIALIZE ON DOM CONTENT LOADED
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggles();
    initRtlToggles();
    initNavigation();
    initBeforeAfterSliders();
    initMaterialExplorer();
    initHome2AtelierFeatures();
    initGalleryAndLightbox();
    initFormsAndValidation();
    initBackToTopAndAnimations();
  });
})();

