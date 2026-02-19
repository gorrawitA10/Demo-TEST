(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const headerOffset = 76;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffset + 2;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  const dropdown = document.querySelector("[data-dropdown]");
  if (dropdown) {
    const button = dropdown.querySelector("[data-dropdown-button]");
    const menu = dropdown.querySelector("[data-dropdown-menu]");
    const label = button?.querySelector(".currency_value");

    const closeDropdown = () => {
      dropdown.classList.remove("is-open");
      button?.setAttribute("aria-expanded", "false");
    };

    const openDropdown = () => {
      dropdown.classList.add("is-open");
      button?.setAttribute("aria-expanded", "true");
    };

    const toggleDropdown = () => {
      dropdown.classList.contains("is-open") ? closeDropdown() : openDropdown();
    };

    const items = menu?.querySelectorAll("[data-currency]") || [];
    if (items.length && label) {
      label.textContent =
        items[0].getAttribute("data-currency") || items[0].textContent.trim();
    }

    dropdown.addEventListener("mouseenter", openDropdown);
    dropdown.addEventListener("mouseleave", closeDropdown);

    button?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    menu?.addEventListener("click", (e) => {
      const item = e.target.closest("[data-currency]");
      if (!item) return;

      const value = item.getAttribute("data-currency") || item.textContent.trim();
      if (label) label.textContent = value;

      closeDropdown();
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) closeDropdown();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDropdown();
    });
  }

  const section = document.querySelector(".bestsellerSticky");
  const stage = section?.querySelector(".bestsellerSticky_stage");
  const title = section?.querySelector(".bestsellerSticky_title");

  if (section && stage && title) {
    const SCROLL_RANGE = 300;
    let raf = 0;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    const update = () => {
      raf = 0;

      const secRect = section.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();

      const scrolledInSection = Math.max(0, -secRect.top);
      const p = clamp01(scrolledInSection / SCROLL_RANGE);

      const titleH = title.offsetHeight;
      const maxDelta = Math.max(0, (stageRect.height - titleH) / 2);

      title.style.setProperty("--bss-y", `${p * maxDelta}px`);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    title.style.setProperty("--bss-y", "0px");
    update();
    document.fonts?.ready?.then(update);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
  }

  const banner = document.querySelector(".collections_banner");
  if (banner) {
    const video = banner.querySelector("video.is-video");

    if (video) {
      const play = async () => {
        try {
          await video.play();
        } catch (e) { }
      };

      const stop = () => {
        video.pause();
        video.currentTime = 0;
      };

      banner.addEventListener("mouseenter", play);
      banner.addEventListener("mouseleave", stop);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
      });
    }
  }

  document.querySelectorAll(".collectionCard").forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;

    const defaultSrc = img.getAttribute("src");
    const hoverSrc = img.getAttribute("data-hover");
    if (!defaultSrc || !hoverSrc) return;

    const pre = new Image();
    pre.src = hoverSrc;

    const onEnter = () => {
      img.dataset.defaultSrc = defaultSrc;
      img.src = hoverSrc;
    };

    const onLeave = () => {
      img.src = img.dataset.defaultSrc || defaultSrc;
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("touchstart", onEnter, { passive: true });
    card.addEventListener("touchend", onLeave, { passive: true });
  });

  const pills = Array.from(document.querySelectorAll("[data-faq-filter]"));
  const accordion = document.querySelector("[data-accordion]");

  const faqData = {
    orders: [
      {
        q: "CAN I EDIT OR CANCEL MY ORDER?",
        a: "If your order hasn’t shipped yet, we can usually help. Please reach out with your order number as soon as possible.",
      },
      {
        q: "WHEN WILL MY ORDER SHIP?",
        a: "Orders are processed within 1–2 business days. During peak drops, processing can take slightly longer.",
      },
      {
        q: "I DIDN’T RECEIVE AN ORDER CONFIRMATION.",
        a: "Please check your spam/junk folder first. If it’s not there, contact support with your name and purchase details.",
      },
    ],
    shipping: [
      {
        q: "DO YOU SHIP WORLDWIDE?",
        a: "We ship internationally. Delivery times vary by destination and carrier service level.",
      },
      {
        q: "HOW LONG DOES DELIVERY TAKE?",
        a: "Standard delivery typically takes 3–7 business days domestically and 7–14 business days internationally, depending on customs and carrier.",
      },
      {
        q: "HOW CAN I TRACK MY ORDER?",
        a: "Once your order ships, you’ll receive a tracking link via email. You can also track from your account page.",
      },
    ],
    returns: [
      {
        q: "WHAT IS YOUR RETURN POLICY?",
        a: "Items can be returned within 14 days of receipt, provided they are unworn, unwashed, and in original condition with tags attached.",
      },
      {
        q: "CAN I EXCHANGE FOR A DIFFERENT SIZE?",
        a: "Yes. Contact customer service and we will help reserve your preferred size while your item is in transit.",
      },
      {
        q: "WHEN WILL I GET MY REFUND?",
        a: "Refunds are processed after inspection and typically take 3–5 business days to appear, depending on your payment provider.",
      },
    ],
    sizing: [
      {
        q: "HOW DO I CHOOSE THE RIGHT SIZE?",
        a: "Check the sizing guide on each product page, and compare measurements to a similar item you already own.",
      },
      {
        q: "DO YOUR ITEMS FIT TRUE TO SIZE?",
        a: "Most styles fit true to size. If the product page notes an oversized or slim fit, we recommend sizing accordingly.",
      },
      {
        q: "WHERE CAN I FIND MEASUREMENTS?",
        a: "Measurements are listed on each product page. If you need help, message support with the item name and your height/weight.",
      },
    ],
  };

  function setActiveTab(category) {
    pills.forEach((btn) => {
      const isActive = btn.getAttribute("data-faq-filter") === category;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
  }

  function closeAll() {
    if (!accordion) return;
    accordion.querySelectorAll(".accItem").forEach((row) => {
      const btn = row.querySelector(".accBtn");
      const panel = row.querySelector(".accPanel");
      if (!btn || !panel) return;
      btn.setAttribute("aria-expanded", "false");
      panel.style.height = "0px";
    });
  }

  function openRow(row) {
    const btn = row.querySelector(".accBtn");
    const panel = row.querySelector(".accPanel");
    const inner = row.querySelector(".accPanelInner");
    if (!btn || !panel || !inner) return;

    btn.setAttribute("aria-expanded", "true");
    panel.style.height = inner.scrollHeight + "px";
  }

  function renderAccordion(category) {
    if (!accordion) return;

    const list = faqData[category] || [];
    accordion.innerHTML = list
      .map(
        (it) => `
      <div class="accItem">
        <button class="accBtn" type="button" aria-expanded="false">
          <span class="accText">${it.q}</span>
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div class="accPanel" style="height:0px;">
          <div class="accPanelInner">
            <p>${it.a}</p>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    const first = accordion.querySelector(".accItem");
    if (first) openRow(first);
  }

  pills.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-faq-filter");
      setActiveTab(category);
      renderAccordion(category);
    });
  });

  accordion?.addEventListener("click", (e) => {
    const btn = e.target.closest(".accBtn");
    if (!btn) return;
    const row = btn.closest(".accItem");
    if (!row) return;

    const isOpen = btn.getAttribute("aria-expanded") === "true";
    closeAll();
    if (!isOpen) openRow(row);
  });

  window.addEventListener(
    "resize",
    () => {
      if (!accordion) return;
      const openBtn = accordion.querySelector('.accBtn[aria-expanded="true"]');
      if (!openBtn) return;

      const row = openBtn.closest(".accItem");
      const panel = row?.querySelector(".accPanel");
      const inner = row?.querySelector(".accPanelInner");
      if (panel && inner) panel.style.height = inner.scrollHeight + "px";
    },
    { passive: true },
  );

  if (accordion && pills.length) {
    setActiveTab("shipping");
    renderAccordion("shipping");
  }

  document.querySelectorAll("[data-cselect]").forEach((root) => {
    const btn = root.querySelector(".cselect_btn");
    const menu = root.querySelector(".cselect_menu");
    const valueEl = root.querySelector("[data-cselect-value]");
    const hidden = root.querySelector('input[type="hidden"]');

    if (!btn || !menu || !valueEl || !hidden) return;

    const open = () => {
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    };

    const close = () => {
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      root.classList.contains("is-open") ? close() : open();
    });

    menu.addEventListener("click", (e) => {
      const opt = e.target.closest(".cselect_opt");
      if (!opt) return;

      const v = opt.dataset.value || opt.textContent.trim();
      valueEl.textContent = v;
      hidden.value = v;

      root.classList.add("has-value");
      close();
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  });


  const topbar = document.querySelector(".topbar");
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector(".nav");

  const setMenuOpen = (open) => {
    if (!topbar || !menuBtn) return;
    topbar.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  menuBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = topbar.classList.contains("menu-open");
    setMenuOpen(!isOpen);
  });

  nav?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) setMenuOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  const editorialToggle = document.querySelector("[data-submenu-toggle]");
  if (editorialToggle) {
    const item = editorialToggle.closest(".nav_item");
    editorialToggle.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      editorialToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

})();
