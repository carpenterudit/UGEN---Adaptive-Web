/**
 * UPGW Content Script
 * Executes ONLY validated, fixed operations.
 * NEVER executes arbitrary generated JavaScript or dynamic eval.
 */

(() => {
  // Store applied changes to support full Undo / Restore
  const originalStyles = new Map();
  let appliedOperations = [];
  let readerPanelElement = null;

  // Listen for messages from popup or background service worker
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "GET_PAGE_INFO":
        sendResponse({
          title: document.title,
          url: window.location.href,
          canModify: !isRestrictedPage(window.location.href),
          appliedCount: appliedOperations.length
        });
        break;

      case "APPLY_OPERATIONS":
        const result = applyOperations(message.operations);
        sendResponse(result);
        break;

      case "RESTORE_ORIGINAL":
        const restoreResult = restoreOriginal();
        sendResponse(restoreResult);
        break;

      case "GET_APPLIED_STATUS":
        sendResponse({
          appliedOperations,
          hasChanges: appliedOperations.length > 0
        });
        break;

      default:
        sendResponse({ error: "Unknown action" });
    }
    return true; // Keep message channel open for async response
  });

  function isRestrictedPage(url) {
    if (!url) return true;
    const lower = url.toLowerCase();
    return (
      lower.startsWith("chrome://") ||
      lower.startsWith("edge://") ||
      lower.startsWith("about:") ||
      lower.startsWith("chrome-extension://") ||
      lower.includes("accounts.google.com") ||
      lower.includes("login.live.com")
    );
  }

  function applyOperations(operations) {
    if (!Array.isArray(operations)) {
      return { success: false, error: "Invalid operations payload" };
    }

    if (isRestrictedPage(window.location.href)) {
      return { success: false, error: "This webpage cannot be modified safely due to security restrictions." };
    }

    const applied = [];

    for (const op of operations) {
      switch (op.type) {
        case "adjust_font_size":
          applyFontSize(op.value || "120%");
          applied.push(op);
          break;

        case "enhance_readability":
          applyReadability();
          applied.push(op);
          break;

        case "apply_color_theme":
          applyTheme(op.value || "dark");
          applied.push(op);
          break;

        case "highlight_content":
          applyHighlight(op.value || "#fef08a");
          applied.push(op);
          break;

        case "simplify_layout":
          applySimplify();
          applied.push(op);
          break;

        case "inject_reader_panel":
          injectReaderPanel();
          applied.push(op);
          break;

        default:
          console.warn("[UPGW] Rejected unknown operation type:", op.type);
      }
    }

    appliedOperations = applied;
    return {
      success: true,
      appliedCount: applied.length,
      operations: applied
    };
  }

  function applyFontSize(sizeValue) {
    saveOriginalStyle(document.body, "fontSize");
    document.body.style.fontSize = sizeValue;
  }

  function applyReadability() {
    const targets = document.querySelectorAll("article, main, p, li");
    targets.forEach(el => {
      saveOriginalStyle(el, "lineHeight");
      saveOriginalStyle(el, "maxWidth");
      el.style.lineHeight = "1.75";
      if (el.tagName.toLowerCase() === "p") {
        el.style.maxWidth = "75ch";
      }
    });
  }

  function applyTheme(themeName) {
    document.documentElement.classList.remove("upgw-theme-dark", "upgw-theme-sepia", "upgw-theme-calm-green", "upgw-theme-soft-blue");
    if (themeName === "dark") {
      document.documentElement.classList.add("upgw-theme-dark");
    } else if (themeName === "sepia") {
      document.documentElement.classList.add("upgw-theme-sepia");
    } else if (themeName === "calm-green") {
      document.documentElement.classList.add("upgw-theme-calm-green");
    } else if (themeName === "soft-blue") {
      document.documentElement.classList.add("upgw-theme-soft-blue");
    }
  }

  function applyHighlight(colorHex) {
    const headings = document.querySelectorAll("h1, h2, h3");
    headings.forEach(h => {
      saveOriginalStyle(h, "backgroundColor");
      saveOriginalStyle(h, "borderRadius");
      saveOriginalStyle(h, "padding");
      h.style.backgroundColor = colorHex;
      h.style.color = "#1e293b";
      h.style.borderRadius = "4px";
      h.style.padding = "2px 6px";
    });
  }

  function applySimplify() {
    const clutterSelectors = "aside, .sidebar, .ad, .ads, [role='complementary']";
    const clutters = document.querySelectorAll(clutterSelectors);
    clutters.forEach(el => {
      saveOriginalStyle(el, "opacity");
      saveOriginalStyle(el, "filter");
      el.style.opacity = "0.2";
      el.style.filter = "grayscale(100%)";
    });
  }

  function injectReaderPanel() {
    if (readerPanelElement) return;

    readerPanelElement = document.createElement("div");
    readerPanelElement.id = "upgw-reader-panel";
    readerPanelElement.innerHTML = `
      <div class="upgw-panel-header">
        <span>✨ UPGW Reader</span>
        <button id="upgw-close-panel" title="Close">✕</button>
      </div>
      <div class="upgw-panel-body">
        <p><strong>Page:</strong> ${escapeHtml(document.title)}</p>
        <p class="upgw-panel-tip">💡 High-contrast reading mode active. You can customize font, themes, or restore anytime from the extension popup.</p>
      </div>
    `;

    document.body.appendChild(readerPanelElement);

    const closeBtn = readerPanelElement.querySelector("#upgw-close-panel");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (readerPanelElement) {
          readerPanelElement.remove();
          readerPanelElement = null;
        }
      });
    }
  }

  function saveOriginalStyle(element, property) {
    if (!originalStyles.has(element)) {
      originalStyles.set(element, {});
    }
    const elemStyles = originalStyles.get(element);
    if (!(property in elemStyles)) {
      elemStyles[property] = element.style[property] || "";
    }
  }

  function restoreOriginal() {
    // 1. Restore element inline styles
    originalStyles.forEach((styles, element) => {
      for (const [prop, val] of Object.entries(styles)) {
        element.style[prop] = val;
      }
    });
    originalStyles.clear();

    // 2. Remove theme classes
    document.documentElement.classList.remove(
      "upgw-theme-dark",
      "upgw-theme-sepia",
      "upgw-theme-calm-green",
      "upgw-theme-soft-blue"
    );

    // 3. Remove injected reader panel if present
    if (readerPanelElement) {
      readerPanelElement.remove();
      readerPanelElement = null;
    }

    appliedOperations = [];

    return {
      success: true,
      message: "Webpage appearance restored to original."
    };
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
