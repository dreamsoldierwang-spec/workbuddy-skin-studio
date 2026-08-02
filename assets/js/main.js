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

// ===== 动态渲染皮肤画廊（含缩略图） =====
async function loadSkins() {
  const grid = document.getElementById('skinsGrid');
  if (!grid) return;
  try {
    const res = await fetch('downloads/skins/manifest.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('manifest ' + res.status);
    const skins = await res.json();
    grid.innerHTML = skins.map(s => {
      const id = s.file.replace(/\.wbskin$/i, '');
      const c1 = s.accent || '#888';
      const isLight = (s.theme || 'dark').toLowerCase() === 'light';
      const themeLabel = isLight ? '亮色' : '暗色';
      const tagClass = isLight ? 'tag light' : 'tag dark';
      const thumb = `assets/img/skins/${encodeURIComponent(id)}.jpg`;
      return `
      <article class="skin-card">
        <div class="skin-thumb">
          <img src="${thumb}" alt="${escapeHtml(s.name)} 皮肤预览" loading="lazy" />
          <span class="${tagClass}">${themeLabel}</span>
        </div>
        <div class="skin-body">
          <div class="skin-name"><span class="dot" style="background:${c1}"></span>${escapeHtml(s.name)}</div>
          <div class="skin-desc">${escapeHtml(s.desc || '')}</div>
          <div class="skin-foot">
            <a class="skin-dl-btn" href="downloads/skins/${encodeURIComponent(s.file)}" download>下载 .wbskin</a>
          </div>
        </div>
        <div class="skin-accent-bar" style="background:linear-gradient(90deg,${c1},transparent)"></div>
      </article>`;
    }).join('');
  } catch (e) {
    grid.innerHTML = '<p class="muted" style="grid-column:1/-1;text-align:center">皮肤清单加载失败，请稍后刷新页面重试。</p>';
    console.error(e);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

loadSkins();
