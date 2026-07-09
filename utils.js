const sleep = ms => new Promise(r => setTimeout(r, ms));

function escHtml(s) {
  return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function togglePass(id) {
  const el = document.getElementById(id);
  if (el) {
    el.type = el.type === 'password' ? 'text' : 'password';
  }
}

function setLoading(on, step) {
  const loadingEl = document.getElementById('loadingState');
  if (loadingEl) {
    loadingEl.classList.toggle('hidden', !on);
  }
  const loadingStepEl = document.getElementById('loadingStep');
  if (loadingStepEl) {
    loadingStepEl.textContent = step || '';
  }
}

function setLoadingStep(msg) {
  const loadingStepEl = document.getElementById('loadingStep');
  if (loadingStepEl) {
    loadingStepEl.textContent = msg;
  }
}

function showError(msg) {
  const output = document.getElementById('questionsOutput');
  const emptyState = document.getElementById('emptyState');
  if (output) {
    output.classList.remove('hidden');
    output.innerHTML = `<div class="error-box">❌ ${escHtml(msg)}</div>`;
  }
  if (emptyState) {
    emptyState.classList.add('hidden');
  }
}
