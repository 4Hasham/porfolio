// Simple loading veil: shown immediately, hidden once the caller says the
// scene is ready to paint. Avoids a flash of an empty black canvas while
// shaders compile on slower GPUs.

export function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.classList.add('loader--done');
  setTimeout(() => loader.remove(), 600);
}
