/* =========================================================
   Crochê Digital da Vovó — interações da página
   - Menu mobile
   - Accordion do FAQ
   - Animações suaves ao rolar (reveal)
   - Contador regressivo da oferta (visual)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuLinks = document.querySelector("[data-menu-links]");
  const accordion = document.querySelector("[data-accordion]");
  const countdown = document.getElementById("countdown");

  /* ---------- Menu mobile ---------- */
  if (menuToggle && menuLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menuLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Accordion do FAQ ---------- */
  if (accordion) {
    accordion.addEventListener("click", (event) => {
      const trigger = event.target.closest(".accordion-trigger");
      if (!trigger) return;

      const item = trigger.closest(".accordion-item");
      const panel = item.querySelector(".accordion-panel");
      const isOpen = item.classList.contains("is-open");

      // Fecha todos antes de abrir o selecionado
      accordion.querySelectorAll(".accordion-item").forEach((other) => {
        other.classList.remove("is-open");
        const otherTrigger = other.querySelector(".accordion-trigger");
        const otherPanel = other.querySelector(".accordion-panel");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  }

  /* ---------- Animações ao rolar ---------- */
  const animatedItems = document.querySelectorAll(".reveal, .stagger");
  if (animatedItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    animatedItems.forEach((element) => observer.observe(element));
  }

  /* ---------- Contador visual da oferta (não trava nada) ---------- */
  if (countdown) {
    const startSeconds = 15 * 60; // 15 minutos
    let remainingSeconds = startSeconds;

    const format = (seconds) => {
      const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${secs}`;
    };

    const tick = () => {
      remainingSeconds = remainingSeconds > 0 ? remainingSeconds - 1 : startSeconds;
      countdown.textContent = format(remainingSeconds);
    };

    countdown.textContent = format(remainingSeconds);
    setInterval(tick, 1000);
  }

  /* ---------- Destaque da oferta ao clicar em "comprar" ---------- */
  const offerCard = document.querySelector(".offer-card");
  if (offerCard) {
    const offerLinks = document.querySelectorAll('a[href="#oferta"]');
    offerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        offerCard.classList.remove("is-highlight");
        // força reinício da animação
        void offerCard.offsetWidth;
        offerCard.classList.add("is-highlight");
        window.setTimeout(() => offerCard.classList.remove("is-highlight"), 1600);
      });
    });
  }
});
