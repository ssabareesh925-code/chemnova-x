
/*
 * CHEMNOVA X — CENTRAL INTERFACE CONTROLLER
 * Version: 1.0
 *
 * Responsibilities:
 * 1. Shared navigation on every page
 * 2. Consistent visual theme
 * 3. Responsive mobile sidebar
 * 4. Stable dashboard module ordering
 * 5. Preserve existing page functionality
 */

(() => {
  "use strict";

  if (window.ChemNovaCore) return;

  const CONFIG = {
    brand: "ChemNova X",
    team: "CYBER DEMONS",

    navigation: [
      {
        section: "LEARNING SPACE",
        items: [
          { label: "Dashboard", href: "index.html", icon: "◈" },
          { label: "Nova Academy", href: "academy.html", icon: "▤" },
          { label: "My Learning", href: "learn.html", icon: "◎" }
        ]
      },
      {
        section: "EXPLORE",
        items: [
          { label: "Practice Arena", href: "practice.html", icon: "⌘" },
          { label: "Virtual ChemLab", href: "chemlab.html", icon: "⚗" },
          { label: "Molecular Studio", href: "molecular.html", icon: "✧" },
          { label: "Calculation Hub", href: "calculators.html", icon: "∑" }
        ]
      },
      {
        section: "YOUR JOURNEY",
        items: [
          { label: "Achievements", href: "achievements.html", icon: "♛" },
          { label: "Developer Team", href: "team.html", icon: "♧" }
        ]
      }
    ],

    // Fixed order for recognised dashboard feature cards.
    dashboardOrder: [
      "nova academy",
      "my learning",
      "practice arena",
      "virtual chemlab",
      "molecular studio",
      "calculation hub",
      "achievements",
      "developer team",
      "our team"
    ]
  };

  const STYLE_ID = "chemnova-core-styles";
  const SIDEBAR_ID = "cnx-sidebar";
  const OVERLAY_ID = "cnx-overlay";

  const normalise = value =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const currentFile = () => {
    const parts = location.pathname.split("/");
    return (parts.pop() || "index.html").toLowerCase();
  };

  const activeFile = currentFile();

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      :root {
        --cnx-bg: #080b18;
        --cnx-panel: #10162a;
        --cnx-panel-2: #141c34;
        --cnx-border: rgba(150,165,220,.13);
        --cnx-text: #f4f6ff;
        --cnx-muted: #9ba7c5;
        --cnx-purple: #9b75ff;
        --cnx-cyan: #45d9ef;
        --cnx-sidebar-width: 245px;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        background-color: var(--cnx-bg) !important;
        color: var(--cnx-text);
      }

      /* CENTRAL SIDEBAR */

      #${SIDEBAR_ID} {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 10001;
        width: var(--cnx-sidebar-width);
        height: 100dvh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        padding: 24px 15px 17px;
        background: rgba(9,13,27,.98);
        border-right: 1px solid var(--cnx-border);
        backdrop-filter: blur(20px);
        transform: translateX(0);
        transition: transform .25s ease;
        font-family: Inter, sans-serif;
      }

      #${SIDEBAR_ID} * {
        box-sizing: border-box;
      }

      .cnx-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 10px 25px;
        border-bottom: 1px solid var(--cnx-border);
      }

      .cnx-brand-icon {
        width: 43px;
        height: 43px;
        flex: 0 0 43px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        color: white;
        font-size: 21px;
        font-weight: 800;
        background: linear-gradient(135deg,#7656e8,#31c7df);
        box-shadow: 0 0 25px rgba(121,93,237,.25);
      }

      .cnx-brand-name {
        color: #f4f6ff;
        font: 700 20px 'Space Grotesk',sans-serif;
        letter-spacing: -.8px;
      }

      .cnx-brand-name span {
        color: var(--cnx-purple);
      }

      .cnx-brand-sub {
        display: block;
        margin-top: 4px;
        color: #8290b1;
        font-size: 8px;
        letter-spacing: 1.7px;
      }

      .cnx-section-label {
        padding: 20px 12px 8px;
        color: #71809f;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.6px;
      }

      .cnx-nav-link {
        min-height: 42px;
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 2px 0;
        padding: 10px 12px;
        border: 1px solid transparent;
        border-radius: 10px;
        color: #a8b3ce;
        font-size: 11px;
        font-weight: 650;
        text-decoration: none !important;
        transition: background .18s ease,color .18s ease;
      }

      .cnx-nav-link:hover {
        color: white;
        background: rgba(139,105,255,.10);
        border-color: rgba(145,124,255,.13);
      }

      .cnx-nav-link.active {
        color: white;
        background: linear-gradient(
          90deg,
          rgba(139,105,255,.20),
          rgba(65,205,232,.07)
        );
        border-color: rgba(145,124,255,.22);
      }

      .cnx-nav-icon {
        width: 21px;
        flex: 0 0 21px;
        text-align: center;
        color: var(--cnx-cyan);
        font-size: 16px;
      }

      .cnx-sidebar-bottom {
        margin-top: auto;
        padding: 17px 12px 5px;
        border-top: 1px solid var(--cnx-border);
        color: #8592b2;
        font-size: 10px;
        line-height: 1.8;
      }

      .cnx-sidebar-bottom strong {
        display: block;
        color: white;
        font-size: 12px;
        letter-spacing: 1px;
      }

      /* MOBILE CONTROLS */

      #${OVERLAY_ID} {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,.65);
        backdrop-filter: blur(3px);
      }

      #cnx-menu-button {
        display: none;
        width: 39px;
        height: 39px;
        flex: 0 0 39px;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--cnx-border);
        border-radius: 10px;
        background: rgba(255,255,255,.04);
        color: white;
        font-size: 20px;
        cursor: pointer;
      }

      /* COMMON PAGE LAYOUT */

      body {
        padding-left: var(--cnx-sidebar-width);
      }

      body > .layout,
      body > #app,
      body > .app,
      body > .page-layout {
        min-height: 100vh;
      }

      .main,
      .main-content,
      .app-main,
      .page-content,
      main {
        max-width: 1650px;
      }

      /* Keep existing cards visually consistent without changing
         their content, dimensions or internal functionality. */

      .member,
      .faculty,
      .leader-panel,
      .acknowledgement,
      .card,
      .feature-card,
      .module-card {
        transition-property: border-color,background-color,box-shadow !important;
      }

      /* Disable layout-changing hover movement. */

      .member:hover,
      .faculty:hover,
      .card:hover,
      .feature-card:hover,
      .module-card:hover {
        transform: none !important;
      }

      /* Prevent animated transforms from moving dashboard items. */

      .dashboard-grid,
      .dashboard-cards,
      .feature-grid,
      .features-grid,
      .module-grid,
      .modules-grid,
      .cards-grid {
        align-items: stretch;
      }

      @media(max-width:800px) {
        body {
          padding-left: 0 !important;
        }

        #${SIDEBAR_ID} {
          transform: translateX(-105%);
          box-shadow: 15px 0 50px rgba(0,0,0,.5);
        }

        #${SIDEBAR_ID}.open {
          transform: translateX(0);
        }

        #${OVERLAY_ID}.open {
          display: block;
        }

        #cnx-menu-button {
          display: inline-flex;
        }

        .main,
        .main-content,
        .app-main,
        .page-content,
        main {
          margin-left: 0 !important;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        #${SIDEBAR_ID},
        #${SIDEBAR_ID} * {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildSidebar() {
    // Remove old page-specific sidebars so only one is visible.
    document.querySelectorAll(
      "body > .layout > .sidebar, body > .sidebar, body > aside.sidebar"
    ).forEach(oldSidebar => {
      oldSidebar.setAttribute("data-cnx-old-sidebar", "true");
      oldSidebar.style.display = "none";
    });

    // Avoid adding duplicate central navigation.
    if (document.getElementById(SIDEBAR_ID)) return;

    const sidebar = document.createElement("aside");
    sidebar.id = SIDEBAR_ID;
    sidebar.setAttribute("aria-label", "ChemNova X navigation");

    sidebar.innerHTML = `
      <div class="cnx-brand">
        <div class="cnx-brand-icon">⚗</div>
        <div>
          <div class="cnx-brand-name">ChemNova <span>X</span></div>
          <span class="cnx-brand-sub">ENGINEERING CHEMISTRY</span>
        </div>
      </div>

      ${CONFIG.navigation.map(group => `
        <div class="cnx-section-label">${group.section}</div>
        ${group.items.map(item => `
          <a class="cnx-nav-link ${activeFile === item.href ? "active" : ""}"
             href="${item.href}"
             ${activeFile === item.href ? 'aria-current="page"' : ""}>
            <span class="cnx-nav-icon">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join("")}
      `).join("")}

      <div class="cnx-sidebar-bottom">
        <strong>${CONFIG.team}</strong>
        Six minds. One shared vision.<br>
        ChemNova X · 2026
      </div>
    `;

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    const menuButton = document.createElement("button");
    menuButton.id = "cnx-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = "☰";

    document.body.prepend(overlay);
    document.body.prepend(sidebar);

    // Put the central menu button into the existing topbar if possible.
    const topbar = document.querySelector(
      ".topbar, .header, .app-header, header"
    );

    const topbarLeft = topbar?.querySelector(
      ".topbar-left, .header-left, .left"
    );

    if (topbarLeft) {
      topbarLeft.prepend(menuButton);
    } else if (topbar) {
      topbar.prepend(menuButton);
    } else {
      document.body.appendChild(menuButton);
    }

    const closeMenu = () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.innerHTML = "☰";
    };

    const openMenu = () => {
      sidebar.classList.add("open");
      overlay.classList.add("open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation");
      menuButton.innerHTML = "✕";
    };

    menuButton.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 800) closeMenu();
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  /*
   * DASHBOARD ORDER PROTECTION
   *
   * Recognised cards are arranged in the fixed order in CONFIG.
   * Unrecognised cards retain their original relative order.
   * A mutation observer restores the order if another script
   * moves existing cards after initialisation.
   */

  function stableDashboardOrder() {
    if (activeFile !== "index.html" && activeFile !== "") return;

    const selectors = [
      ".dashboard-grid",
      ".dashboard-cards",
      ".feature-grid",
      ".features-grid",
      ".module-grid",
      ".modules-grid",
      ".cards-grid"
    ];

    const grids = [...new Set(
      selectors.flatMap(selector =>
        [...document.querySelectorAll(selector)]
      )
    )];

    const priority = new Map(
      CONFIG.dashboardOrder.map((name, index) => [name, index])
    );

    grids.forEach((grid, gridIndex) => {
      if (grid.dataset.cnxOrderReady === "true") return;

      const cards = [...grid.children].filter(element =>
        element.nodeType === 1
      );

      if (cards.length < 2) return;

      const originalPosition = new Map(
        cards.map((card, index) => [card, index])
      );

      const getPriority = card => {
        const label = normalise(
          card.innerText || card.textContent || ""
        );

        for (const [name, rank] of priority) {
          if (label.includes(name)) return rank;
        }

        return 1000 + (originalPosition.get(card) ?? 0);
      };

      const sorted = [...cards].sort((a, b) =>
        getPriority(a) - getPriority(b)
      );

      const restoreOrder = () => {
        const current = [...grid.children].filter(element =>
          element.nodeType === 1
        );

        const desired = [
          ...sorted.filter(card => card.parentElement === grid),
          ...current.filter(card => !sorted.includes(card))
        ];

        const alreadyCorrect = desired.every(
          (card, index) => current[index] === card
        );

        if (!alreadyCorrect) {
          desired.forEach(card => grid.appendChild(card));
        }
      };

      restoreOrder();
      grid.dataset.cnxOrderReady = "true";

      const observer = new MutationObserver(() => {
        restoreOrder();
      });

      observer.observe(grid, { childList: true });

      // Keep observer reference alive for this page session.
      if (!window.__cnxDashboardObservers) {
        window.__cnxDashboardObservers = [];
      }

      window.__cnxDashboardObservers.push(observer);
    });
  }

  function init() {
    addStyles();
    buildSidebar();
    stableDashboardOrder();

    // Some pages create their dashboard cards dynamically.
    // Retry briefly after DOM creation, without changing page data.
    requestAnimationFrame(stableDashboardOrder);
    setTimeout(stableDashboardOrder, 300);
    setTimeout(stableDashboardOrder, 1000);
  }

  window.ChemNovaCore = {
    version: "1.0",
    init,
    closeMenu: () => {
      document.getElementById(SIDEBAR_ID)?.classList.remove("open");
      document.getElementById(OVERLAY_ID)?.classList.remove("open");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
