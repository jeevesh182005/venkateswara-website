/* =============================================
   VENKATESWARA MOTORS — vm-script.js
   EmailJS credentials: already plugged in below.
   ============================================= */

const EMAILJS_PUBLIC_KEY  = '3BlKBJO4m1QjtqzSl';
const EMAILJS_SERVICE_ID  = 'service_m8rmz3t';
const EMAILJS_TEMPLATE_ID = 'template_3km6qrn';

/* Load EmailJS SDK */
(function loadEmailJS() {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => { emailjs.init(EMAILJS_PUBLIC_KEY); };
  document.head.appendChild(s);
})();

/* =============================================
   MOBILE MENU
   ============================================= */
const hamburger  = document.getElementById('nav-hamburger');
const mobOverlay = document.getElementById('mob-overlay');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => {
  const isOpen = mobOverlay.classList.contains('open');
  if (isOpen) { closeMobileMenu(); }
  else { hamburger.classList.add('open'); mobOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(r => revObs.observe(r));

/* =============================================
   NAV ACTIVE STATE
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--white)' : ''; });
}, { passive: true });

/* =============================================
   PHONE VALIDATION — FULLY FIXED
   Strips +, spaces, hyphens, brackets first.
   Then accepts: 10-digit starting 6-9
   or with prefix 91 / 0
   ============================================= */
function validatePhone(raw) {
  const phone = String(raw).replace(/[\s\-\(\)\.\+]/g, '');
  if (/^[6-9]\d{9}$/.test(phone)) return true;        // 9876543210
  if (/^91[6-9]\d{9}$/.test(phone)) return true;      // 919876543210
  if (/^0[6-9]\d{9}$/.test(phone)) return true;       // 09876543210
  return false;
}

/* =============================================
   ERROR / TOAST HELPERS
   ============================================= */
function setErr(fid, eid, msg) {
  const f = document.getElementById(fid), e = document.getElementById(eid);
  if (f) f.classList.add('error');
  if (e) e.textContent = msg;
}
function clearErr(fid, eid) {
  const f = document.getElementById(fid), e = document.getElementById(eid);
  if (f) f.classList.remove('error');
  if (e) e.textContent = '';
}
function showToast(type, msg) {
  const t = document.getElementById('vm-toast');
  t.className = 'vm-toast ' + type;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 7000);
}

/* Live blur validation */
document.getElementById('vm-phone').addEventListener('blur', function () {
  if (this.value && !validatePhone(this.value))
    setErr('vm-phone', 'vm-phone-err', '⚠ Enter a valid 10-digit number (e.g. 9876543210)');
  else clearErr('vm-phone', 'vm-phone-err');
});
document.getElementById('vm-name').addEventListener('blur', function () {
  if (!this.value.trim()) setErr('vm-name', 'vm-name-err', '⚠ Please enter your name');
  else clearErr('vm-name', 'vm-name-err');
});

/* =============================================
   SUBMIT — sends to jeeveshs18@gmail.com
   Template variables: name, phone, email, service, message, time
   ============================================= */
function handleVMSubmit() {
  const name     = document.getElementById('vm-name').value.trim();
  const phone    = document.getElementById('vm-phone').value.trim();
  const interest = document.getElementById('vm-interest').value;
  const message  = document.getElementById('vm-message').value.trim();
  const btn      = document.getElementById('vm-submit-btn');

  clearErr('vm-name',     'vm-name-err');
  clearErr('vm-phone',    'vm-phone-err');
  clearErr('vm-interest', 'vm-interest-err');

  let hasError = false;
  if (!name)   { setErr('vm-name',  'vm-name-err',  '⚠ Please enter your name');        hasError = true; }
  if (!phone)  { setErr('vm-phone', 'vm-phone-err', '⚠ Please enter your phone number');hasError = true; }
  else if (!validatePhone(phone)) {
    setErr('vm-phone', 'vm-phone-err', '⚠ Enter a valid 10-digit number (e.g. 9876543210)');
    hasError = true;
  }
  if (!interest) { setErr('vm-interest','vm-interest-err','⚠ Please select a service'); hasError = true; }

  if (hasError) { showToast('error', '⚠ Please fix the errors above.'); return; }

  if (typeof emailjs === 'undefined') {
    showToast('error', '⚠ Network issue. Please call: +91 97880 21456');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  const now     = new Date();
  const timeStr = now.toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    name:    name,
    phone:   phone,
    email:   'Venkateswara Motors Enquiry',
    service: interest,
    message: message || '(No message)',
    time:    timeStr,
  })
  .then(() => {
    btn.disabled = false;
    btn.textContent = 'Send Enquiry →';
    document.getElementById('vm-name').value     = '';
    document.getElementById('vm-phone').value    = '';
    document.getElementById('vm-interest').value = '';
    document.getElementById('vm-message').value  = '';
    showToast('success', '✅ Enquiry sent! We will contact you soon. 🏍️');
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    btn.disabled = false;
    btn.textContent = 'Send Enquiry →';
    showToast('error', '❌ Failed to send. Please call: +91 97880 21456');
  });
}