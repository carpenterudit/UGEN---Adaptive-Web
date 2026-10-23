# UPGW Security Model and Threat Mitigation

## 1. Zero Arbitrary Code Execution
- **Strict Component Mapping**: The frontend never evaluates AI-generated JavaScript, TypeScript, or raw HTML script tags. All components are mapped through a hardened, predefined `ComponentRegistry`.
- **Unknown Component Rejection**: Any unregistered component tag fails safely with a clear warning and is omitted from rendering.

## 2. Server-Side Action Allowlisting
- Only approved, allowlisted action identifiers can be executed via `/api/v1/actions/{action_id}/execute`.
- Unrecognized actions or arbitrary function invocations are rejected immediately with HTTP 403 Forbidden.

## 3. Browser Extension Security Boundaries
- **Manifest V3**: Built with modern service workers and strict declarative security rules.
- **Fixed Operation Dispatcher**: The content script runs only hardcoded DOM styling transforms (font size, color filters, line height, reader drawer). It never parses or executes remote scripts.
- **Protected Domain Blocklist**: Automatically disables execution on sensitive domains (`chrome://`, `edge://`, `about:`, OAuth login portals, and banking domains).
- **Minimal Permissions**: Requests only `activeTab`, `storage`, and `scripting`. Does NOT read cookies, credentials, passwords, or payment inputs.

## 4. API & Data Protection
- **No Client Secrets**: AI provider keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`) are read strictly from backend environment variables and are never transmitted to the frontend bundle.
- **Rate Limiting**: Integrated SlowAPI rate limiter on expensive generation endpoints to prevent abuse.
- **CORS Restrictions**: Configured CORS origin allowing only verified frontend hosts.
- **Input Sanitization**: Pydantic schema validation for all incoming payloads.
