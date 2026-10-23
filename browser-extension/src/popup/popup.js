/**
 * UPGW Extension Popup Script
 * Handles user interactions, previews, applying operations, and restoring original page styles.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const pageTitleEl = document.getElementById("page-title");
  const pageStatusEl = document.getElementById("page-status");
  const promptInput = document.getElementById("prompt-input");
  const planBtn = document.getElementById("plan-btn");
  const planPreview = document.getElementById("plan-preview");
  const planExplanation = document.getElementById("plan-explanation");
  const operationsList = document.getElementById("operations-list");
  const applyBtn = document.getElementById("apply-btn");
  const cancelPlanBtn = document.getElementById("cancel-plan-btn");
  const restoreBtn = document.getElementById("restore-btn");
  const appliedCountText = document.getElementById("applied-count-text");
  const feedbackEl = document.getElementById("feedback");

  let currentTab = null;
  let plannedOperations = [];

  // 1. Get active browser tab
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0) {
      currentTab = tabs[0];
      pageTitleEl.textContent = currentTab.title || currentTab.url || "Active Page";

      // Query content script for page status
      chrome.tabs.sendMessage(currentTab.id, { type: "GET_PAGE_INFO" }, response => {
        if (chrome.runtime.lastError || !response) {
          pageStatusEl.textContent = "Standby";
          pageStatusEl.className = "badge";
        } else {
          if (response.canModify) {
            pageStatusEl.textContent = "Supported";
            pageStatusEl.className = "badge ready";
          } else {
            pageStatusEl.textContent = "Restricted";
            pageStatusEl.className = "badge restricted";
            showFeedback("This page is restricted for security.", true);
          }
          if (response.appliedCount > 0) {
            appliedCountText.textContent = `${response.appliedCount} changes applied`;
          }
        }
      });
    }
  } catch (err) {
    pageTitleEl.textContent = "Browser Tab Unavailable";
  }

  // 2. Quick Action Buttons
  document.querySelectorAll(".quick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      promptInput.value = btn.dataset.prompt;
      generatePlan(btn.dataset.prompt);
    });
  });

  // 3. Plan Preview Button
  planBtn.addEventListener("click", () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      showFeedback("Please enter a customization request.", true);
      return;
    }
    generatePlan(prompt);
  });

  // 4. Generate plan via backend API or fallback
  async function generatePlan(prompt) {
    showFeedback("Planning modifications...");
    planBtn.disabled = true;

    try {
      // Send request to backend
      const res = await fetch("http://127.0.0.1:8000/api/v1/extension/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          page_title: currentTab ? currentTab.title : "",
          page_url: currentTab ? currentTab.url : ""
        })
      });

      if (!res.ok) {
        throw new Error(`Backend returned status ${res.status}`);
      }

      const data = await res.json();
      plannedOperations = data.operations || [];

      // Render plan preview
      planExplanation.textContent = data.explanation || "Review proposed changes:";
      operationsList.innerHTML = "";
      plannedOperations.forEach(op => {
        const li = document.createElement("li");
        li.textContent = `• ${op.description}`;
        operationsList.appendChild(li);
      });

      planPreview.style.display = "flex";
      showFeedback("");
    } catch (err) {
      // Offline fallback: generate client-side plan
      fallbackPlan(prompt);
    } finally {
      planBtn.disabled = false;
    }
  }

  function fallbackPlan(prompt) {
    const lower = prompt.toLowerCase();
    plannedOperations = [];

    if (lower.includes("font") || lower.includes("text") || lower.includes("big")) {
      plannedOperations.push({
        type: "adjust_font_size",
        value: "125%",
        description: "Increase body font size to 125%"
      });
    }
    if (lower.includes("dark")) {
      plannedOperations.push({
        type: "apply_color_theme",
        value: "dark",
        description: "Apply dark high-contrast mode"
      });
    } else if (lower.includes("sepia")) {
      plannedOperations.push({
        type: "apply_color_theme",
        value: "sepia",
        description: "Apply warm sepia background"
      });
    }
    if (lower.includes("highlight")) {
      plannedOperations.push({
        type: "highlight_content",
        value: "#fef08a",
        description: "Highlight headings"
      });
    }
    if (lower.includes("simplify")) {
      plannedOperations.push({
        type: "simplify_layout",
        description: "Dim peripheral sidebars and banners"
      });
    }
    if (lower.includes("reader") || lower.includes("panel")) {
      plannedOperations.push({
        type: "inject_reader_panel",
        description: "Open reading assistant panel"
      });
    }

    if (plannedOperations.length === 0) {
      plannedOperations.push({
        type: "enhance_readability",
        description: "Enhance line height and paragraph width"
      });
    }

    planExplanation.textContent = "Planned safe changes (local mode):";
    operationsList.innerHTML = "";
    plannedOperations.forEach(op => {
      const li = document.createElement("li");
      li.textContent = `• ${op.description}`;
      operationsList.appendChild(li);
    });
    planPreview.style.display = "flex";
    showFeedback("");
  }

  // 5. Apply Changes Button
  applyBtn.addEventListener("click", () => {
    if (!currentTab || plannedOperations.length === 0) return;

    chrome.tabs.sendMessage(
      currentTab.id,
      {
        type: "APPLY_OPERATIONS",
        operations: plannedOperations
      },
      response => {
        if (chrome.runtime.lastError || !response || !response.success) {
          showFeedback("Failed to apply changes to this page.", true);
        } else {
          showFeedback(`Applied ${response.appliedCount} change(s)!`);
          appliedCountText.textContent = `${response.appliedCount} change(s) applied`;
          planPreview.style.display = "none";

          // Inform backend
          fetch("http://127.0.0.1:8000/api/v1/extension/apply-record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operations_applied: plannedOperations.map(o => o.type),
              page_url: currentTab.url
            })
          }).catch(() => {});
        }
      }
    );
  });

  // 6. Cancel Plan Button
  cancelPlanBtn.addEventListener("click", () => {
    planPreview.style.display = "none";
    plannedOperations = [];
    showFeedback("");
  });

  // 7. Restore Original Button
  restoreBtn.addEventListener("click", () => {
    if (!currentTab) return;

    chrome.tabs.sendMessage(currentTab.id, { type: "RESTORE_ORIGINAL" }, response => {
      if (chrome.runtime.lastError || !response || !response.success) {
        showFeedback("Could not restore page.", true);
      } else {
        showFeedback("Page restored to original!");
        appliedCountText.textContent = "0 changes applied";
        planPreview.style.display = "none";
      }
    });
  });

  function showFeedback(msg, isError = false) {
    feedbackEl.textContent = msg;
    feedbackEl.className = isError ? "feedback error" : "feedback";
  }
});
