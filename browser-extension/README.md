# UPGW Browser Extension (Mode B: Existing Website Adaptation)

A Chrome Manifest V3 browser extension for safe, chat-driven web personalization.

## Capabilities

- **Increase text size**: Dynamic scaling of readable elements.
- **Improve readability**: Increases line-height to 1.75 and sets comfortable line lengths.
- **Color themes**: Apply high-contrast Dark, Warm Sepia, Calming Green, or Soft Blue themes.
- **Highlight content**: Highlights primary headings and keywords.
- **Simplify layout**: Dims distracting sidebars, peripheral ads, and nonessential widgets.
- **Supplemental Reader Panel**: Injects a clean, isolated assistant drawer.
- **Preview & Confirmation**: All changes are previewed before applying.
- **Full Undo / Restore**: Instantly revert the page to its exact original appearance.

## Security Architecture

1. **Manifest V3**: Uses modern declarative standards and service workers.
2. **Fixed Operation Dispatcher**: The content script executes *only* predetermined, hardcoded styling operations. **No dynamic script execution, eval(), or remote JavaScript is ever permitted.**
3. **Restricted Domain Protection**: Automatically disables modifications on `chrome://`, browser internal settings, authentication portals, and banking pages.
4. **Minimal Permissions**: Requires only `activeTab`, `storage`, and `scripting`. Does NOT intercept passwords, cookies, payment details, or credentials.

## Installation Instructions (Chrome / Edge / Brave)

1. Open your Chromium-based browser (Chrome, Edge, Brave, Opera).
2. Navigate to `chrome://extensions/` (or `edge://extensions/`).
3. Enable **Developer mode** using the toggle switch in the top right.
4. Click **Load unpacked**.
5. Select this directory:
   ```
   universal-personalized-generative-web-v2/browser-extension
   ```
6. The **UPGW - Universal Web Personalizer** extension icon will appear in your browser toolbar!
7. Visit any webpage (e.g. Wikipedia, a blog, or documentation) and click the extension icon to personalize the page.
