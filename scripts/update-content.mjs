import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root, 'index.html');
const manifestPath = resolve(root, 'SOURCE_SHA256.json');

let html = await readFile(indexPath, 'utf8');

// 09. SEO Content
html = html.replace(
  /<title>.*?<\/title>/s,
  '<title>Yogendra Chaudhary | UI/UX & Product Designer</title>'
);
html = html.replace(
  /<meta name="description" content=".*?">/s,
  '<meta name="description" content="Explore the portfolio of Yogendra Chaudhary, a UI/UX and Product Designer specializing in user flows, intuitive interfaces, design systems, and digital product experiences.">'
);
html = html.replace(
  /<meta property="og:title" content=".*?">/s,
  '<meta property="og:title" content="Yogendra Chaudhary | UI/UX & Product Designer">'
);
html = html.replace(
  /<meta property="og:description" content=".*?">/s,
  '<meta property="og:description" content="Explore the portfolio of Yogendra Chaudhary, a UI/UX and Product Designer specializing in user flows, intuitive interfaces, design systems, and digital product experiences.">'
);
html = html.replace(
  /<meta name="twitter:title" content=".*?">/s,
  '<meta name="twitter:title" content="Yogendra Chaudhary | UI/UX & Product Designer">'
);
html = html.replace(
  /<meta name="twitter:description" content=".*?">/s,
  '<meta name="twitter:description" content="Explore the portfolio of Yogendra Chaudhary, a UI/UX and Product Designer specializing in user flows, intuitive interfaces, design systems, and digital product experiences.">'
);

// 01. Top-right text
html = html.replaceAll(
  'Handmade</span> with ❤️ in Nepal',
  'Designed with care</span> ❤️ in Kathmandu, Nepal'
);
html = html.replaceAll(
  'Handmade with ❤️ in Nepal',
  'Designed with care ❤️ in Kathmandu, Nepal'
);

// 02. Hero Section
html = html.replaceAll(
  'An IDF certified Product Designer, crafting experiences that flow.',
  'UI/UX & Product Designer focused on creating intuitive, functional, and user-friendly digital experiences.'
);
html = html.replaceAll(
  'I make complicated things feel simple, and good products feel a little magical. 5+ years, 15+ clients, and a mildly unhealthy obsession with getting the details right.',
  'I turn complex workflows into simple, meaningful digital experiences. From accounting software to university websites and service platforms, I focus on usability, clear interactions, and thoughtful design details that make products easier to use.'
);

// 03. Featured Work navigation & counter
html = html.replaceAll(
  'Featured Work [05]',
  'Featured Work [03]'
);

// Project 1
html = html.replaceAll(
  'A case study of how I designed Numira, an accounting &amp; business management platform streamlining party, purchase, and financial workflows.',
  'Designing clearer workflows for accounting and business management, making complex financial tasks easier to understand and navigate.'
);
html = html.replaceAll(
  'A case study of how I designed Numira, an accounting & business management platform streamlining party, purchase, and financial workflows.',
  'Designing clearer workflows for accounting and business management, making complex financial tasks easier to understand and navigate.'
);
html = html.replaceAll(
  'Existing pet tracking apps had less than 20% weekly retention. Dog owners were downloading them, logging a few activities, then abandoning them within days.',
  'Designing clearer workflows for accounting and business management, making complex financial tasks easier to understand and navigate.'
);
html = html.replaceAll(
  'Designed status-based menus, vouchers with reversal, chart of accounts, and type-to-confirm dialogs for irreversible financial operations.',
  'I designed key areas of Numira, including customer and supplier management, purchasing, accounting, and settings. My work covered purchase orders, bills, payments, vouchers, fiscal-year closing, user roles, and security flows. The focus was on organizing information-heavy screens, maintaining consistent interaction patterns, and making important financial actions clear and predictable.'
);

// Project 2
html = html.replaceAll(
  'A comprehensive university web portal and registration system designed from landing page to student enrollment for Tribhuvan University.',
  'A complete responsive university website designed to make academic information, resources, and registration easier to access.'
);
html = html.replaceAll(
  'Students, faculty, and administration needed an integrated portal for notices, events, and an intuitive 7-step program registration flow across mobile and desktop.',
  'A complete responsive university website designed to make academic information, resources, and registration easier to access.'
);
html = html.replaceAll(
  'Better compliance accuracy due to structured inputs. Faster onboarding for both individuals and companies. Faster design delivery because of reusable components.',
  'I designed the SOMTU website across desktop and mobile, creating 87 screens and 81 component variants. The project included academic programs, notices, events, research, resources, and a seven-step registration process. I also developed a comprehensive design reference to support consistency and developer handoff.'
);

// Project 3
html = html.replaceAll(
  'A case study on designing The Vedic Sewa, a spiritual services platform spanning customer &amp; guru profiles, bookings, livestreams, and shop workflows.',
  'Designing a connected platform that simplifies spiritual service bookings and interactions between customers and gurus.'
);
html = html.replaceAll(
  'A case study on designing The Vedic Sewa, a spiritual services platform spanning customer & guru profiles, bookings, livestreams, and shop workflows.',
  'Designing a connected platform that simplifies spiritual service bookings and interactions between customers and gurus.'
);
html = html.replaceAll(
  'Enabling time-constrained, stressed travelers to confidently order and receive food within an unpredictable airport environment without missing their flight or experiencing additional anxiety.',
  'I designed customer and guru experiences for puja, yatra, and consultation bookings across web and mobile. The work included user profiles, booking management, a shop and purchase flow, refunds, livestreams, notifications, and verification processes. Special attention was given to status-based actions, clear navigation, and handling empty, pending, locked, and error states.'
);

// 04. About statistics in static HTML
html = html.replaceAll('>Years</span> <span style="display:inline-block;opacity:0.001;transform:translateX(0px) translateY(10px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)">of</span> <span style="display:inline-block;opacity:0.001;transform:translateX(0px) translateY(10px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)">Experience</span>', '>Selected</span> <span style="display:inline-block;opacity:0.001;transform:translateX(0px) translateY(10px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)">Projects</span>');
html = html.replaceAll('>Years</span> <span style="display:inline-block;opacity:0.001;transform:translateX(0px) translateY(10px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)">ofExperience</span>', '>Selected</span> <span style="display:inline-block;opacity:0.001;transform:translateX(0px) translateY(10px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)">Projects</span>');
html = html.replaceAll('>Clients</span>', '>SOMTU Screens Designed</span>');
html = html.replaceAll('>Timezones</span>', '>SOMTU Component Variants</span>');

// 05. Design Process Intro
html = html.replaceAll(
  'Every project starts with questions, not screens. I research, map the problem space, then design systems that scale - always looping back with teams and users until the experience feels inevitable.',
  'My design process focuses on understanding the problem before shaping the interface. I work through user flows, design systems, interaction details, and continuous refinement to create products that are both useful and consistent.'
);

// 08. Footer
html = html.replaceAll(
  '© 2026 Yogendra Chaudhary. All Rights Reserved',
  '© 2026 Yogendra Chaudhary. All rights reserved.'
);
html = html.replaceAll(
  '© 2026 Yogendra Chaudhary. All rights Reserved',
  '© 2026 Yogendra Chaudhary. All rights reserved.'
);

// Now update the <script id="cv-content-sync"> block with comprehensive live hydration and DOM synchronizer
const syncScriptStart = html.indexOf('<script id="cv-content-sync">');
const syncScriptEnd = html.indexOf('</script>', syncScriptStart);

if (syncScriptStart !== -1 && syncScriptEnd !== -1) {
  const newSyncScript = `<script id="cv-content-sync">
(function() {
  'use strict';
  const CV = {
    name: "Yogendra Chaudhary",
    heroName: "yogendra",
    shortName: "Yogendra",
    title: "UI/UX & Product Designer",
    headline: "UI/UX & Product Designer focused on creating intuitive, functional, and user-friendly digital experiences.",
    heroIntro: "Hello! 👋 I'm",
    heroDescription: "I turn complex workflows into simple, meaningful digital experiences. From accounting software to university websites and service platforms, I focus on usability, clear interactions, and thoughtful design details that make products easier to use.",
    headerTopRight: "Designed with care ❤️ in Kathmandu, Nepal",
    featuredWorkNav: "Featured Work [03]",
    email: "yogendrachaudhary2061@gmail.com",
    linkedin: "https://www.linkedin.com/in/yogendrach",
    linkedinHandle: "linkedin.com/in/yogendrach",
    resumeUrl: "/assets/aistudio/Yogendra_Chaudhary_CV_cc247373.pdf",
    location: "Kathmandu, Nepal",
    phone: "9843688407",
    sectionVisibility: {
      header: true,
      work: true,
      process: true,
      experience: true,
      about: true,
      footer: true
    },
    projects: [
      {
        id: "p1",
        number: "01",
        name: "Numira",
        category: "Product Design / Business Management Software",
        title: "Numira — Accounting & Business Management",
        shortDescription: "Designing clearer workflows for accounting and business management, making complex financial tasks easier to understand and navigate.",
        detailedDescription: "I designed key areas of Numira, including customer and supplier management, purchasing, accounting, and settings. My work covered purchase orders, bills, payments, vouchers, fiscal-year closing, user roles, and security flows.\\n\\nThe focus was on organizing information-heavy screens, maintaining consistent interaction patterns, and making important financial actions clear and predictable.",
        tags: "Product Design / Accounting / User Flows / UI Components",
        cta: "Explore Project ↗",
        url: "/perro.html"
      },
      {
        id: "p2",
        number: "02",
        name: "SOMTU",
        category: "Website & Product Design / Education",
        title: "SOMTU — School of Management, Tribhuvan University",
        shortDescription: "A complete responsive university website designed to make academic information, resources, and registration easier to access.",
        detailedDescription: "I designed the SOMTU website across desktop and mobile, creating 87 screens and 81 component variants.\\n\\nThe project included academic programs, notices, events, research, resources, and a seven-step registration process. I also developed a comprehensive design reference to support consistency and developer handoff.",
        tags: "Web Design / Responsive UI / Design System / Registration Flow",
        cta: "Explore Project ↗",
        url: "/mercore.html"
      },
      {
        id: "p3",
        number: "03",
        name: "The Vedic Sewa",
        category: "Product Design / Services Platform",
        title: "The Vedic Sewa — Spiritual Services Platform",
        shortDescription: "Designing a connected platform that simplifies spiritual service bookings and interactions between customers and gurus.",
        detailedDescription: "I designed customer and guru experiences for puja, yatra, and consultation bookings across web and mobile.\\n\\nThe work included user profiles, booking management, a shop and purchase flow, refunds, livestreams, notifications, and verification processes. Special attention was given to status-based actions, clear navigation, and handling empty, pending, locked, and error states.",
        tags: "UI/UX Design / Booking Flows / Web & Mobile / Interaction Design",
        cta: "Explore Project ↗",
        url: "/perro-deepdive.html"
      }
    ],
    about: {
      heading: "About",
      mainDescription: "Hi, I'm Yogendra Chaudhary, a UI/UX and Product Designer who enjoys simplifying complex digital experiences.\\n\\nI started my professional design journey at Aarawan Media & Tech, where I completed a three-month UI/UX internship and was appointed Junior UI/UX Designer.\\n\\nI work on user flows, interface design, reusable components, and interaction patterns, with a focus on usability and consistency. I enjoy collaborating with developers, refining designs through feedback, and turning ideas into practical digital products.",
      stats: [
        { value: "03", label: "Selected Projects" },
        { value: "87", label: "SOMTU Screens Designed" },
        { value: "81", label: "SOMTU Component Variants" }
      ]
    },
    designProcess: {
      heading: "Design Process",
      intro: "My design process focuses on understanding the problem before shaping the interface. I work through user flows, design systems, interaction details, and continuous refinement to create products that are both useful and consistent.",
      steps: [
        { number: "01", title: "Systems Thinking", description: "I break down complex workflows into clear, connected experiences, ensuring that information, actions, and interface states work together logically." },
        { number: "02", title: "User Research", description: "I use usability testing, interface reviews, and feedback to identify friction, understand user needs, and improve the overall experience." },
        { number: "03", title: "Interaction Design", description: "I design user flows and interface interactions that make navigation intuitive, actions predictable, and everyday tasks easier to complete." },
        { number: "04", title: "Cross-functional Collaboration", description: "I collaborate with developers to communicate design decisions, maintain consistency, and support the accurate implementation of digital products." }
      ]
    },
    skillsAndTools: {
      heading: "Skills & Tools",
      description: "My skill set combines user experience thinking, visual design, reusable components, and practical collaboration to build clear and consistent interfaces.",
      categories: [
        { category: "UX Design", items: "User Flows / Workflow Design / Usability Testing / Interaction Design" },
        { category: "UI Design", items: "Interface Design / Typography / Layout / Visual Hierarchy / UI Components" },
        { category: "Design Systems", items: "Reusable Components / Component Consistency / UI States / Design Iteration" },
        { category: "Tools & Collaboration", items: "Figma / Adobe Photoshop / Adobe Illustrator / Developer Handoff / Cross-functional Collaboration" }
      ]
    },
    contact: {
      heading: "Let's work together.",
      description: "Have a product idea or a design challenge? I'd love to hear about it. Let's discuss how thoughtful design can make your digital experience clearer, easier, and more useful.",
      cta: "Let's Connect ↗"
    },
    footer: {
      description: "Thoughtful interfaces. Clear interactions. Better digital experiences.",
      email: "yogendrachaudhary2061@gmail.com",
      linkedin: "linkedin.com/in/yogendrach",
      copyright: "© 2026 Yogendra Chaudhary. All rights reserved.",
      backToTop: "↑ Back to top"
    }
  };

  try {
    const cached = localStorage.getItem('portfolio_content_override');
    if (cached) Object.assign(CV, JSON.parse(cached));
  } catch (e) {}

  function applySectionVisibility() {
    const sec = CV.sectionVisibility;
    if (!sec) return;
    let styleEl = document.getElementById('section-visibility-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'section-visibility-styles';
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

  let isSyncing = false;
  function syncContent() {
    if (!document || !document.body || isSyncing) return;
    isSyncing = true;
    try {
      applySectionVisibility();

      // 1. Links & Navigation
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

      // 3. Top-right badge / info
      document.querySelectorAll('.framer-1y62ftj, [data-framer-name="Info"]').forEach(el => {
        if (el.textContent.includes('❤️') || el.textContent.includes('Handmade') || el.textContent.includes('Nepal')) {
          const p = el.querySelector('p');
          if (p && !p.dataset.updated) {
            p.innerHTML = '<span class="framer-text" style="color:var(--token-ac56c595-9d44-487e-a4d6-6b87f8a23457, rgb(255, 77, 0));">Designed with care</span> ❤️ in Kathmandu, Nepal';
            p.dataset.updated = 'true';
          }
        }
      });

      // 4. Hero Headline and Description
      document.querySelectorAll('.framer-e749yc, [data-framer-name="New Texts"] .framer-e749yc').forEach(el => {
        if (!el.dataset.updated) {
          el.innerHTML = '<p class="framer-text framer-styles-preset-lyok3u" data-styles-preset="WYtyUgnNE" dir="auto">' + (CV.headline || 'UI/UX & Product Designer focused on creating intuitive, functional, and user-friendly digital experiences.') + '</p>';
          el.dataset.updated = 'true';
        }
      });
      document.querySelectorAll('.framer-1f196a6, [data-framer-name="New Texts"] .framer-1f196a6').forEach(el => {
        if (!el.dataset.updated) {
          el.innerHTML = '<p class="framer-text framer-styles-preset-1ojhyqw" data-styles-preset="Y_wgLR1zP" dir="auto">' + (CV.heroDescription || 'I turn complex workflows into simple, meaningful digital experiences. From accounting software to university websites and service platforms, I focus on usability, clear interactions, and thoughtful design details that make products easier to use.') + '</p>';
          el.dataset.updated = 'true';
        }
      });

      // 5. Featured Work Header & Counter
      document.querySelectorAll('.framer-a7v2gu-container, .framer-177y3p8').forEach(el => {
        if (el.textContent.includes('Featured Work')) {
          const target = el.querySelector('div, p');
          if (target && target.textContent.includes('[05]')) {
            target.textContent = target.textContent.replace('[05]', '[03]');
          }
        }
      });

      // 6. About Description & Statistics
      const aboutSec = document.getElementById('about') || document.querySelector('[data-framer-name="About"]');
      if (aboutSec) {
        // Main bio text
        const aboutBio = aboutSec.querySelector('.framer-1twzoh2-container, .framer-14js2ex');
        if (aboutBio && !aboutBio.dataset.updated) {
          aboutBio.innerHTML = '<div style="font-family:&quot;Google Sans Flex Variable Light Rounded&quot;, sans-serif;font-size:20px;font-weight:300;line-height:1.6em;color:var(--token-ac56c595-9d44-487e-a4d6-6b87f8a23457, rgb(241, 239, 237));">' +
            '<p style="margin-bottom:16px;">Hi, I\\'m <strong>Yogendra Chaudhary</strong>, a UI/UX and Product Designer who enjoys simplifying complex digital experiences.</p>' +
            '<p style="margin-bottom:16px;">I started my professional design journey at <strong>Aarawan Media &amp; Tech</strong>, where I completed a three-month UI/UX internship and was appointed Junior UI/UX Designer.</p>' +
            '<p>I work on user flows, interface design, reusable components, and interaction patterns, with a focus on usability and consistency. I enjoy collaborating with developers, refining designs through feedback, and turning ideas into practical digital products.</p>' +
            '</div>';
          aboutBio.dataset.updated = 'true';
        }

        // Stats replacement: 03 Selected Projects / 87 SOMTU Screens Designed / 81 SOMTU Component Variants
        const statCards = aboutSec.querySelectorAll('.framer-1ojrojg, .framer-1if7akh, .framer-1rfeuei, [data-framer-name="Stats"] > div');
        const h3s = aboutSec.querySelectorAll('h3');
        const statPs = aboutSec.querySelectorAll('.framer-10h1fhw p, .framer-1gayqbd p, .framer-26kcro p');
        if (h3s.length >= 3) {
          h3s[0].innerHTML = '<span style="font-size:48px;font-weight:700;color:#fff;">03</span>';
          h3s[1].innerHTML = '<span style="font-size:48px;font-weight:700;color:#fff;">87</span>';
          h3s[2].innerHTML = '<span style="font-size:48px;font-weight:700;color:#fff;">81</span>';
        }
        if (statPs.length >= 3) {
          statPs[0].textContent = 'Selected Projects';
          statPs[1].textContent = 'SOMTU Screens Designed';
          statPs[2].textContent = 'SOMTU Component Variants';
        }
      }

      // 7. Design Process Introduction & Steps
      const processSec = document.getElementById('process') || document.querySelector('[data-framer-name="Process"]');
      if (processSec) {
        const procIntro = processSec.querySelector('.framer-1eohgdn p, .framer-1ktyapm p');
        if (procIntro && !procIntro.dataset.updated) {
          procIntro.textContent = 'My design process focuses on understanding the problem before shaping the interface. I work through user flows, design systems, interaction details, and continuous refinement to create products that are both useful and consistent.';
          procIntro.dataset.updated = 'true';
        }
        const procDescriptions = processSec.querySelectorAll('.framer-1930fba p');
        if (procDescriptions.length >= 4) {
          procDescriptions[0].textContent = 'I break down complex workflows into clear, connected experiences, ensuring that information, actions, and interface states work together logically.';
          procDescriptions[1].textContent = 'I use usability testing, interface reviews, and feedback to identify friction, understand user needs, and improve the overall experience.';
          procDescriptions[2].textContent = 'I design user flows and interface interactions that make navigation intuitive, actions predictable, and everyday tasks easier to complete.';
          procDescriptions[3].textContent = 'I collaborate with developers to communicate design decisions, maintain consistency, and support the accurate implementation of digital products.';
        }
      }

      // 8. Contact Section & Footer Quote
      document.querySelectorAll('.framer-5edfb2-container, .framer-12e1a0g').forEach(el => {
        if (el.textContent.includes('Great design') || el.textContent.includes('Thoughtful interfaces') || el.textContent.includes('seen')) {
          el.innerHTML = '<div style="font-family:&quot;Google Sans Flex Variable Rounded&quot;, sans-serif;font-size:18px;font-weight:400;color:#8c96a8;line-height:1.5em;"><p>Thoughtful interfaces. Clear interactions. Better digital experiences.</p></div>';
        }
      });

      // 9. Text Nodes across document
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
        } else if (v.includes('your.email@example.com')) {
          node.nodeValue = v.replaceAll('your.email@example.com', CV.email);
        } else if (v.includes('Senior Product Designer')) {
          node.nodeValue = v.replaceAll('Senior Product Designer', 'UI/UX & Product Designer');
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
          node.nodeValue = v.replaceAll('Mercore', 'SOMTU & The Vedic Sewa');
        } else if (v.includes('Bengaluru')) {
          node.nodeValue = v.replaceAll('Bengaluru', CV.location || 'Kathmandu, Nepal');
        } else if (v.includes('Years of Experience') || v.includes('Years ofExperience')) {
          node.nodeValue = v.replaceAll(/Years of\s*Experience/g, 'Selected Projects');
        } else if (v.trim() === 'Clients') {
          node.nodeValue = 'SOMTU Screens Designed';
        } else if (v.trim() === 'Timezones') {
          node.nodeValue = 'SOMTU Component Variants';
        } else if (v.includes('All Rights Reserved')) {
          node.nodeValue = v.replaceAll('All Rights Reserved', 'All rights reserved.');
        }
      }
    } catch(e) {
      console.warn('Sync note:', e);
    } finally {
      isSyncing = false;
    }
  }

  // Floating admin shortcut button
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

  // Live Firebase Firestore Sync
  function connectLiveSync() {
    window.addEventListener('storage', e => {
      if (e.key === 'portfolio_content_override' && e.newValue) {
        try {
          Object.assign(CV, JSON.parse(e.newValue));
          syncContent();
        } catch(err) {}
      }
    });

    fetch('/api/content')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name) {
          Object.assign(CV, data);
          syncContent();
        }
      })
      .catch(() => {});

    fetch('/firebase-applet-config.json')
      .then(r => r.ok ? r.json() : null)
      .then(async cfg => {
        if (!cfg || !cfg.apiKey) return;
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js');
        const { getFirestore, doc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js');
        const app = initializeApp(cfg);
        const db = getFirestore(app, cfg.firestoreDatabaseId);
        onSnapshot(doc(db, 'portfolio', 'main'), snap => {
          if (snap.exists()) {
            const d = snap.data();
            Object.assign(CV, d);
            try { localStorage.setItem('portfolio_content_override', JSON.stringify(d)); } catch(e){}
            syncContent();
          }
        }, () => {});
      })
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { syncContent(); addAdminButton(); });
  } else {
    syncContent();
    addAdminButton();
  }
  window.addEventListener('load', () => { syncContent(); addAdminButton(); connectLiveSync(); });
  setTimeout(() => { syncContent(); addAdminButton(); }, 100);
  setTimeout(() => { syncContent(); addAdminButton(); }, 300);
  setTimeout(() => { syncContent(); addAdminButton(); }, 800);

  try {
    let timeout = null;
    const observer = new MutationObserver(() => {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          syncContent();
        }, 120);
      }
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  } catch(e) {}
})();
</script>`;

  html = html.slice(0, syncScriptStart) + newSyncScript + html.slice(syncScriptEnd + 9);
}

await writeFile(indexPath, html, 'utf8');

// Update hash in SOURCE_SHA256.json
const newHash = createHash('sha256').update(html).digest('hex');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.files['index.html'] = newHash;
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log('SUCCESS: index.html updated and SOURCE_SHA256.json synchronized!');
