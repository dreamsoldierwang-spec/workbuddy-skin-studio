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

// ===== 大图弹窗 =====
function createLightbox() {
  if (document.getElementById('skinLightbox')) return;
  const box = document.createElement('div');
  box.id = 'skinLightbox';
  box.className = 'skin-lightbox';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <button class="lightbox-close" aria-label="关闭">&times;</button>
    <img class="lightbox-img" src="" alt="皮肤背景大图" />
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(box);

  const close = () => {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  box.querySelector('.lightbox-backdrop').addEventListener('click', close);
  box.querySelector('.lightbox-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function openLightbox(src, caption) {
  if (!src) return;
  createLightbox();
  const box = document.getElementById('skinLightbox');
  const img = box.querySelector('.lightbox-img');
  const cap = box.querySelector('.lightbox-caption');
  img.src = src;
  cap.textContent = caption || '';
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  img.onerror = () => { cap.textContent = (caption || '') + '（图片加载失败）'; };
}

// ===== 动态渲染皮肤画廊（含缩略图 + 大图预览） =====
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
      const bg = `downloads/skins/${encodeURIComponent(s.bg || (id + '-bg.jpg'))}`;
      return `
      <article class="skin-card">
        <div class="skin-thumb" data-bg="${bg}" data-name="${escapeHtml(s.name)}" title="查看大图">
          <img src="${thumb}" alt="${escapeHtml(s.name)} 皮肤预览" loading="lazy" />
          <span class="${tagClass}">${themeLabel}</span>
          <div class="skin-thumb-overlay" aria-hidden="true">
            <div class="skin-thumb-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </div>
            <span class="skin-thumb-hint">查看大图</span>
          </div>
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

    grid.querySelectorAll('.skin-thumb').forEach(el => {
      el.addEventListener('click', e => {
        // 点击下载按钮时不触发大图
        if (e.target.closest('.skin-dl-btn')) return;
        const src = el.dataset.bg;
        const name = el.dataset.name;
        if (src) openLightbox(src, name + ' · 背景大图');
      });
    });
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

// ===== 皮肤效果轮播 =====
(function initShowcase() {
  const track = document.getElementById('showcaseTrack');
  const carousel = document.getElementById('showcaseCarousel');
  if (!track || !carousel) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  if (!total) return;

  const dotsContainer = document.getElementById('showcaseDots');
  const prevBtn = carousel.querySelector('.showcase-arrow.prev');
  const nextBtn = carousel.querySelector('.showcase-arrow.next');
  let current = 0;
  let autoTimer = null;

  // 生成指示点
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'showcase-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `第 ${i + 1} 张`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(i) {
    current = (i + total) % total;
    update();
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // 键盘支持
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
  carousel.setAttribute('tabindex', '0');

  // 触摸滑动支持
  let startX = 0;
  let isDragging = false;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });
  track.addEventListener('touchmove', () => { if (isDragging) isDragging = true; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
    }
    isDragging = false;
  }, { passive: true });

  // 自动轮播
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function resetAuto() { stopAuto(); startAuto(); }

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  startAuto();
  update();
})();
