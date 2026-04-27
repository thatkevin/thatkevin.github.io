const GUIDE_HTML = `
  <div class="pat-guide">
    <div class="pat-guide-header">
      <h2>Getting a GitHub token</h2>
      <button class="btn btn-ghost btn-sm" id="guide-close">✕</button>
    </div>
    <ol class="pat-steps">
      <li>
        <strong>Go to GitHub Settings</strong>
        <p>Click your avatar → <em>Settings</em> → <em>Developer settings</em> → <em>Personal access tokens</em> → <em>Tokens (classic)</em>.</p>
        <a class="pat-link" href="https://github.com/settings/tokens/new" target="_blank" rel="noopener">Open GitHub → New token ↗</a>
      </li>
      <li>
        <strong>Name it</strong>
        <p>Call it something like <code>blog-cms</code> so you remember what it's for.</p>
      </li>
      <li>
        <strong>Set expiry</strong>
        <p>90 days is sensible. You can always regenerate it here when it expires.</p>
      </li>
      <li>
        <strong>Tick the <code>repo</code> scope</strong>
        <p>This is the only permission needed. It lets the CMS read and write files in your repository.</p>
      </li>
      <li>
        <strong>Click Generate token</strong>
        <p>Copy the token immediately — GitHub only shows it once. Paste it into the CMS login field.</p>
      </li>
    </ol>
    <div class="pat-note">
      Your token is stored in your browser's <code>localStorage</code> and sent only to <code>api.github.com</code>. It never touches any other server.
    </div>
  </div>
`;

export class LoginView {
  constructor(onAuth) {
    this.onAuth = onAuth;
  }

  render() {
    return `
      <div class="login-screen">
        <div class="login-panel">
          <div class="login-wordmark">kev.cc — CMS</div>
          <h1 class="login-headline">Content<br>manager.</h1>
          <p class="login-sub">Connect with a GitHub personal access token. Stored locally, sent only to GitHub.</p>
          <div class="login-form" id="login-form">
            <div class="field">
              <label>GitHub Personal Access Token</label>
              <input
                type="password"
                id="pat-input"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                autocomplete="off"
                spellcheck="false"
              >
            </div>
            <div id="login-error" class="login-error" style="display:none"></div>
            <button class="btn btn-primary" id="login-btn" type="button">Connect</button>
          </div>
          <p class="login-hint">
            Don't have one? <button class="btn-inline" id="guide-btn">How to create a token ↗</button>
          </p>
        </div>
      </div>

      <div class="guide-backdrop" id="guide-backdrop" style="display:none">
        <div class="guide-panel">
          ${GUIDE_HTML}
        </div>
      </div>
    `;
  }

  bind(container) {
    const btn      = container.querySelector('#login-btn');
    const input    = container.querySelector('#pat-input');
    const err      = container.querySelector('#login-error');
    const guideBtn = container.querySelector('#guide-btn');
    const backdrop = container.querySelector('#guide-backdrop');

    guideBtn.addEventListener('click', () => {
      backdrop.style.display = 'flex';
    });

    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) backdrop.style.display = 'none';
    });

    backdrop.querySelector('#guide-close').addEventListener('click', () => {
      backdrop.style.display = 'none';
    });

    const attempt = async () => {
      const token = input.value.trim();
      if (!token) return;
      btn.disabled = true;
      btn.textContent = 'Connecting…';
      err.style.display = 'none';
      try {
        await this.onAuth(token);
      } catch (e) {
        err.textContent = e.message || 'Authentication failed. Check your token and try again.';
        err.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Connect';
        input.focus();
      }
    };

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
    input.focus();
  }
}
