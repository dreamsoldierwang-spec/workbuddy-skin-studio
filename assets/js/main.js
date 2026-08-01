// ===== 移动端导航 =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ===== 导航滚动态 =====
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 12) nav.style.boxShadow = '0 8px 30px -16px rgba(0,0,0,0.8)';
  else nav.style.boxShadow = 'none';
};
window.addEventListener('scroll', onScroll);
onScroll();

// ===== 动态渲染已生成皮肤 =====
async function loadSkins() {
  const grid = document.getElementById('skinsGrid');
  if (!grid) return;
  try {
    const res = await fetch('downloads/skins/manifest.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('manifest ' + res.status);
    const skins = await res.json();
    grid.innerHTML = skins.map(s => {
      const c1 = s.accent || '#888';
      const c2 = s.surface || '#111';
      const themeLabel = (s.theme || 'dark') === 'dark' ? '暗色' : '亮色';
      return `
      <div class="skin-dl">
        <div class="skin-dl-thumb" style="--c1:${c1};--c2:${c2}">
          <span class="tag">${themeLabel}</span>
        </div>
        <div class="skin-dl-body">
          <div class="skin-dl-name"><span class="dot" style="background:${c1}"></span>${escapeHtml(s.name)}</div>
          <div class="skin-dl-desc">${escapeHtml(s.desc || '')}</div>
          <a class="dl-btn" href="downloads/skins/${encodeURIComponent(s.file)}" download>下载 .wbskin</a>
        </div>
      </div>`;
    }).join('');
  } catch (e) {
    grid.innerHTML = '<p class="muted" style="grid-column:1/-1">皮肤清单加载失败，请稍后刷新或到 GitHub 仓库查看。</p>';
    console.error(e);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

loadSkins();
