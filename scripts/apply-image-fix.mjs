import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root, 'index.html');
const manifestPath = resolve(root, 'SOURCE_SHA256.json');

let html = await readFile(indexPath, 'utf8');

const syncScriptStart = html.indexOf('<script id="cv-content-sync">');
const syncScriptEnd = html.indexOf('</script>', syncScriptStart);

if (syncScriptStart === -1 || syncScriptEnd === -1) {
  console.error('Could not find cv-content-sync in index.html');
  process.exit(1);
}

const content = JSON.parse(await readFile(resolve(root, 'data/content.json'), 'utf8'));

const newSyncScript = `<script id="cv-content-sync">
(function() {
  'use strict';
  const defaultImages = {
    avatar: "framerusercontent.com/images/sHYLC5GLvyuqZRvQ521YBEuOos5bd4.png",
    project1: "framerusercontent.com/images/JFlxur51MvdnXVwJcmocQgdbRz8f210.png",
    project2: "framerusercontent.com/images/3uqfpcZtUI0KOAlHMVjpapzRl8c7f5.png",
    project3: "framerusercontent.com/images/Qz0PfMLlkZPgfWPWG0w1Aj6I8c7f5.png",
    ogImage: "framerusercontent.com/images/mE8wUY9AKZAw29HtTltTNM78Y.png",
    favicon: "framerusercontent.com/images/HBHFPi1YvOmewl8NVUc4Ff7IXk.png"
  };

  const CV = {
    name: "Yogendra Chaudhary",
    heroName: "yogendra",
    shortName: "Yogendra",
    role: "UI/UX Designer | Product Designer",
    headline: "UI/UX & Product Designer focused on creating intuitive, functional, and user-friendly digital experiences.",
    heroIntro: "Hello! 👋 I'm",
    heroDescription: "I turn complex workflows into simple, meaningful digital experiences. From accounting software to university websites and service platforms, I focus on usability, clear interactions, and thoughtful design details that make products easier to use.",
    headerTopRight: "Designed with care ❤️ in Kathmandu, Nepal",
    featuredWorkNav: "Featured Work [03]",
    email: "yogendrachaudhary2061@gmail.com",
    linkedin: "https://www.linkedin.com/in/yogendrach",
    resumeUrl: "/assets/aistudio/Yogendra_Chaudhary_CV_cc247373.pdf",
    location: "Kathmandu, Nepal",
    phone: "9843688407",
    sectionVisibility: {
      header: true,
      work: true,
      process: true,
      experience: false,
      about: true,
      moments: true,
      footer: true
    },
    images: Object.assign({}, defaultImages, ${JSON.stringify(content.images || {})}),
    texts: ${JSON.stringify(content.texts || {})},
    moments: ${JSON.stringify(content.moments || {})}
  };

  try {
    const cached = localStorage.getItem("portfolio_content_override");
    if (cached) {
      const parsed = JSON.parse(cached);
      Object.assign(CV, parsed);
      if (parsed.images) CV.images = Object.assign({}, CV.images, parsed.images);
      if (parsed.texts) CV.texts = Object.assign({}, CV.texts, parsed.texts);
      if (parsed.moments) CV.moments = parsed.moments;
    }
  } catch (e) {}

  function applySectionVisibility() {
    const sec = CV.sectionVisibility;
    if (!sec) return;
    let styleEl = document.getElementById("section-visibility-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "section-visibility-styles";
      document.head.appendChild(styleEl);
    }
    const rules = [];
    if (sec.header === false) rules.push('section#header-1, [data-framer-name="Header"], .framer-bdf1dy { display: none !important; }');
    if (sec.work === false) rules.push('section#work, [data-framer-name="Work"], a[href*="#work"], .framer-chfo71-container { display: none !important; }');
    if (sec.process === false) rules.push('section#process, [data-framer-name="Process"], a[href*="#process"] { display: none !important; }');
    if (sec.experience === false) rules.push('section#experience, [data-framer-name="Experience"], a[href*="#experience"] { display: none !important; }');
    if (sec.about === false) rules.push('section#about, [data-framer-name="About"], a[href*="#about"], .framer-10lyrh0-container { display: none !important; }');
    if (sec.footer === false) rules.push('footer, [data-framer-name="Footer"] { display: none !important; }');
    styleEl.textContent = rules.join('\\n');
  }

  function applyImage(img, newSrc, role, defaultUrl) {
    if (!img || !newSrc) return;
    img.dataset.portfolioImg = role;

    const currentSrcAttr = img.getAttribute("src") || "";
    const isCustom = Boolean(newSrc !== defaultUrl && (newSrc.startsWith("data:image/") || !newSrc.includes(defaultUrl)));

    if (isCustom) {
      if (currentSrcAttr !== newSrc || img.hasAttribute("srcset")) {
        img.removeAttribute("srcset");
        img.srcset = "";
        img.removeAttribute("sizes");
        img.setAttribute("src", newSrc);
        img.src = newSrc;
      }
    } else {
      if (currentSrcAttr !== defaultUrl && !currentSrcAttr.includes(defaultUrl)) {
        img.setAttribute("src", defaultUrl);
        img.src = defaultUrl;
      }
    }

    img.onerror = function() {
      if (this.src !== defaultUrl && !this.src.includes(defaultUrl)) {
        console.warn("[Portfolio image fallback]", role, "reverting to original");
        this.removeAttribute("srcset");
        this.removeAttribute("sizes");
        this.src = defaultUrl;
      }
    };
  }

  function syncImages() {
    if (!CV.images) return;

    if (CV.images.avatar) {
      document.querySelectorAll('img[src*="sHYLC5GLvyuqZRvQ"], img[srcset*="sHYLC5GLvyuqZRvQ"], #about [data-framer-background-image-wrapper="true"] img, section[data-framer-name="About"] img, img[data-portfolio-img="avatar"]')
        .forEach(img => applyImage(img, CV.images.avatar, "avatar", defaultImages.avatar));
    }

    if (CV.images.project1) {
      document.querySelectorAll('img[src*="JFlxur51MvdnXVwJcmocQgdbRz8"], img[src*="KXWpMKybppkBnLsGiuMplKlAf8"], img[srcset*="JFlxur51MvdnXVwJcmocQgdbRz8"], img[srcset*="KXWpMKybppkBnLsGiuMplKlAf8"], img[data-portfolio-img="project1"]')
        .forEach(img => applyImage(img, CV.images.project1, "project1", defaultImages.project1));
    }

    if (CV.images.project2) {
      document.querySelectorAll('img[src*="3uqfpcZtUI0KOAlHMVjpapzRl8"], img[srcset*="3uqfpcZtUI0KOAlHMVjpapzRl8"], img[data-portfolio-img="project2"]')
        .forEach(img => applyImage(img, CV.images.project2, "project2", defaultImages.project2));
    }

    if (CV.images.project3) {
      document.querySelectorAll('img[src*="Qz0PfMLlkZPgfWPWG0w1Aj6I8"], img[srcset*="Qz0PfMLlkZPgfWPWG0w1Aj6I8"], img[data-portfolio-img="project3"]')
        .forEach(img => applyImage(img, CV.images.project3, "project3", defaultImages.project3));
    }

    if (CV.images.favicon) {
      document.querySelectorAll('link[rel="icon"]').forEach(l => { l.href = CV.images.favicon; });
    }
    if (CV.images.ogImage) {
      document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => { m.content = CV.images.ogImage; });
    }

    // Moments slider images / videos
    const moments = CV.moments;
    if (moments) {
      if (moments.enabled === false || (CV.sectionVisibility && CV.sectionVisibility.moments === false)) {
        document.querySelectorAll('section.framer-hs8by8, [data-framer-name="Slider"]').forEach(s => { s.style.display = "none"; });
      } else {
        document.querySelectorAll('section.framer-hs8by8, [data-framer-name="Slider"]').forEach(s => { s.style.display = ""; });
      }
      if (Array.isArray(moments.items) && moments.items.length > 0) {
        ['Ticker (L)', 'Ticker (S)'].forEach(tickerName => {
          const ticker = document.querySelector('[data-framer-name="' + tickerName + '"]');
          if (!ticker) return;
          const listItems = ticker.querySelectorAll('ul > li');
          moments.items.forEach((item, idx) => {
            const li = listItems[idx];
            if (!li || !item.url) return;
            if (item.type === 'video' || item.url.includes('.mp4') || item.url.includes('.webm')) {
              let video = li.querySelector('video');
              if (!video) {
                const img = li.querySelector('img');
                if (img) {
                  video = document.createElement('video');
                  video.loop = true;
                  video.muted = true;
                  video.playsInline = true;
                  video.autoplay = true;
                  video.style.cssText = 'cursor:auto;width:100%;height:100%;border-radius:0px;display:block;object-fit:cover;object-position:50% 50%;';
                  img.parentNode.replaceChild(video, img);
                }
              }
              if (video && video.src !== item.url) {
                video.src = item.url;
                video.load();
                video.play().catch(() => {});
              }
            } else {
              let img = li.querySelector('img');
              if (!img) {
                const video = li.querySelector('video');
                if (video) {
                  img = document.createElement('img');
                  img.style.cssText = 'display:block;width:100%;height:100%;border-radius:inherit;object-fit:cover;object-position:center;';
                  video.parentNode.replaceChild(img, video);
                }
              }
              if (img) {
                img.src = item.url;
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
                if (item.title || item.caption) img.alt = item.title || item.caption;
              }
            }
          });
        });
      }
    }
  }

  let isSyncing = false;
  function syncContent() {
    if (!document || !document.body || isSyncing) return;
    isSyncing = true;
    try {
      applySectionVisibility();
      syncImages();

      // 1. Links
      document.querySelectorAll('a').forEach(a => {
        try {
          const text = (a.textContent || '').trim();
          const href = a.getAttribute('href') || '';
          if (href.includes('404')) {
            a.href = 'perro-deepdive.html';
            if (a.target === '_blank') a.target = '_self';
          } else if (text.includes('LinkedIn') || href.includes('linkedin.com')) {
            a.href = CV.linkedin || 'https://www.linkedin.com/in/yogendrach';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.removeAttribute('aria-disabled');
          } else if (text.includes('Resume') || href.includes('resume')) {
            a.href = CV.resumeUrl || '/assets/aistudio/Yogendra_Chaudhary_CV_cc247373.pdf';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.removeAttribute('aria-disabled');
          } else if (text.includes('@') || text.includes('example.com') || a.getAttribute('data-framer-name') === 'Email') {
            a.href = 'mailto:' + (CV.email || 'yogendrachaudhary2061@gmail.com');
            a.removeAttribute('aria-disabled');
          }
        } catch(err) {}
      });

      // 2. Headings & Names
      document.querySelectorAll('h1').forEach(h => {
        try {
          const t = (h.textContent || '').trim().toLowerCase();
          if (t === 'shubham' || t === 'yogendra') {
            h.textContent = (CV.heroName || 'yogendra').toLowerCase();
          }
        } catch(err) {}
      });

      // 3. Dynamic Announcement & Texts Sync
      const announcement = CV.texts?.heroAnnouncement || CV.heroAnnouncement;
      if (announcement) {
        document.querySelectorAll('.framer-1ochvl6 p').forEach(p => { p.textContent = announcement; });
      }
      const greeting = CV.texts?.greeting || CV.texts?.heroIntro || CV.heroIntro;
      if (greeting) {
        document.querySelectorAll('.framer-1elp66r p').forEach(p => { p.textContent = greeting; });
      }
      const footerNote = CV.texts?.footerNote || CV.footerNote;
      if (footerNote) {
        document.querySelectorAll('.framer-11f5jx5 p').forEach(p => { p.textContent = footerNote; });
      }
      const aboutStory = CV.texts?.aboutStory || CV.aboutStory || CV.bio;
      if (aboutStory) {
        document.querySelectorAll('.framer-ljx6pi p').forEach(p => { p.textContent = aboutStory; });
      }

      // 4. Loading screen watcher
      const loadingName = CV.texts?.loadingScreen || CV.name || 'Yogendra Chaudhary';
      document.querySelectorAll('.framer-r5wbtm-container').forEach(container => {
        try {
          const txt = (container.textContent || '').replace(/\\s+/g, ' ').trim();
          if (txt.includes('Shubham') || txt.includes('Prakash') || (txt !== loadingName && txt.length > 0)) {
            const [firstName, ...rest] = loadingName.split(' ');
            const lastName = rest.join(' ') || 'Chaudhary';
            const wg0 = container.querySelector('[data-wg="0"]');
            const wg2 = container.querySelector('[data-wg="2"]');
            if (wg0 && wg2) {
              const createLetterSpans = word => Array.from(word).map(char => {
                const s = document.createElement('span');
                s.style.display = 'inline-block';
                s.style.willChange = 'transform, opacity, color, filter';
                s.textContent = char;
                return s;
              });
              wg0.innerHTML = '';
              createLetterSpans(firstName).forEach(s => wg0.appendChild(s));
              wg2.innerHTML = '';
              createLetterSpans(lastName).forEach(s => wg2.appendChild(s));
            }
          }
        } catch(err) {}
      });

      // 5. Text Nodes across document
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        const v = node.nodeValue;
        if (!v || v.trim().length === 0) continue;
        if (v.includes('Shubham Prakash')) {
          node.nodeValue = v.replaceAll('Shubham Prakash', CV.name);
        } else if (v.includes('[Shubham Prakash]')) {
          node.nodeValue = v.replaceAll('[Shubham Prakash]', '[' + CV.name + ']');
        } else if (v.trim() === 'Shubham') {
          node.nodeValue = CV.shortName || 'Yogendra';
        } else if (v.trim() === 'Prakash') {
          node.nodeValue = 'Chaudhary';
        } else if (v.includes('your.email@example.com')) {
          node.nodeValue = v.replaceAll('your.email@example.com', CV.email);
        } else if (v.includes('Senior Product Designer')) {
          node.nodeValue = v.replaceAll('Senior Product Designer', CV.role);
        } else if (v.includes('Tech Alchemy, UK')) {
          node.nodeValue = v.replaceAll('Tech Alchemy, UK', 'Aarawan Media & Tech | Kathmandu, Nepal');
        } else if (v.includes('Tech Alchemy')) {
          node.nodeValue = v.replaceAll('Tech Alchemy', 'Aarawan Media & Tech');
        } else if (v.includes('Senior UX Designer')) {
          node.nodeValue = v.replaceAll('Senior UX Designer', 'Junior UI/UX Designer');
        } else if (v.includes('Lineup Polo')) {
          node.nodeValue = v.replaceAll('Lineup Polo', 'School of Management, TU (SOMTU)');
        } else if (v.includes('Freelance Designer')) {
          node.nodeValue = v.replaceAll('Freelance Designer', 'UI/UX & Product Designer');
        } else if (v.includes('Perro Pet')) {
          node.nodeValue = v.replaceAll('Perro Pet', 'Numira ERP & Accounting');
        } else if (v.includes('Mercore')) {
          node.nodeValue = v.replaceAll('Mercore', 'The Vedic Sewa & SOMTU');
        } else if (v.includes('Bengaluru')) {
          node.nodeValue = v.replaceAll('Bengaluru', CV.location || 'Nepal');
        }
      }
    } catch(e) {
      console.warn('Sync note:', e);
    } finally {
      isSyncing = false;
    }
  }

  // Floating admin button
  function addAdminButton() {
    if (!document.body || document.getElementById('floating-admin-btn')) return;
    try {
      const btn = document.createElement('a');
      btn.id = 'floating-admin-btn';
      btn.href = '/admin';
      btn.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:99999;display:inline-flex;align-items:center;gap:8px;background:rgba(20,24,31,0.92);color:#f0f2f5;border:1px solid #334155;padding:8px 14px;border-radius:9999px;font-size:12px;font-weight:600;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,0.5);backdrop-filter:blur(10px);transition:all 0.2s;font-family:sans-serif;';
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4d00" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg><span>Admin Panel</span>';
      btn.onmouseover = () => { btn.style.borderColor = '#ff4d00'; btn.style.transform = 'translateY(-2px)'; };
      btn.onmouseout = () => { btn.style.borderColor = '#334155'; btn.style.transform = 'none'; };
      document.body.appendChild(btn);
    } catch(e) {}
  }

  // Live Firebase & localStorage sync
  function connectLiveSync() {
    window.addEventListener('storage', e => {
      if (e.key === 'portfolio_content_override' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          Object.assign(CV, parsed);
          if (parsed.images) CV.images = Object.assign({}, CV.images, parsed.images);
          syncContent();
        } catch(err) {}
      }
    });

    fetch('/api/content')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && (data.name || data.images)) {
          Object.assign(CV, data);
          if (data.images) CV.images = Object.assign({}, CV.images, data.images);
          try { localStorage.setItem('portfolio_content_override', JSON.stringify(data)); } catch(e){}
          syncContent();
        }
      })
      .catch(() => {});

    fetch('/firebase-applet-config.json')
      .then(r => r.ok ? r.json() : null)
      .then(async cfg => {
        if (!cfg || !cfg.apiKey) return;
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js');
        const { getFirestore, doc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js');
        const app = getApps().length > 0 ? getApps()[0] : initializeApp(cfg);
        const db = getFirestore(app, cfg.firestoreDatabaseId);
        onSnapshot(doc(db, 'portfolio', 'main'), snap => {
          if (snap.exists()) {
            const d = snap.data();
            Object.assign(CV, d);
            if (d.images) CV.images = Object.assign({}, CV.images, d.images);
            try { localStorage.setItem('portfolio_content_override', JSON.stringify(d)); } catch(e){}
            syncContent();
          }
        }, () => {});
      })
      .catch(() => {});
  }

  // Intercept Framer React hydration re-renders and breakpoint variant changes
  try {
    let syncTimer = null;
    const scheduleSync = () => {
      if (!syncTimer) {
        syncTimer = setTimeout(() => {
          syncTimer = null;
          syncContent();
        }, 50);
      }
    };

    const imageObserver = new MutationObserver((mutations) => {
      let shouldReapply = false;
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'src' || m.attributeName === 'srcset')) {
          const t = m.target;
          if (t && t.tagName === 'IMG' && t.dataset && t.dataset.portfolioImg) {
            shouldReapply = true;
            break;
          }
        } else if (m.type === 'childList' && m.addedNodes.length > 0) {
          shouldReapply = true;
          break;
        }
      }
      if (shouldReapply) scheduleSync();
    });

    if (document.documentElement) {
      imageObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset']
      });
    }
  } catch(e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { syncContent(); addAdminButton(); });
  } else {
    syncContent();
    addAdminButton();
  }
  window.addEventListener('load', () => { syncContent(); addAdminButton(); connectLiveSync(); });
  [0, 50, 120, 250, 500, 1000, 2000, 3000].forEach(delay => setTimeout(syncContent, delay));
  window.addEventListener('resize', syncContent);
  window.addEventListener('scroll', syncContent, { passive: true });
})();
</script>`;

html = html.slice(0, syncScriptStart) + newSyncScript + html.slice(syncScriptEnd + 9);
await writeFile(indexPath, html, 'utf8');

const newHash = createHash('sha256').update(html).digest('hex');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.files['index.html'] = newHash;
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('Successfully updated index.html and SOURCE_SHA256.json!');
