/* =============================================
   VENKATESWARA MOTORS — vm-script.js
   =============================================
   
   HOW TO CONNECT FORM TO YOUR EMAIL (jeeveshs18@gmail.com)
   =============================================
   
   We use EmailJS — a FREE service that sends form
   data directly to your Gmail. No server needed.
   
   SETUP STEPS:
   1. Go to https://www.emailjs.com and create a FREE account
   2. Click "Add New Service" → choose Gmail → connect your 
      jeeveshs18@gmail.com account
   3. Note your SERVICE ID (looks like: service_xxxxxxx)
   4. Click "Email Templates" → Create New Template
      Use these template variables: {{from_name}}, {{phone}}, 
      {{interest}}, {{message}}, {{to_email}}
      Set "To Email" as: jeeveshs18@gmail.com
   5. Note your TEMPLATE ID (looks like: template_xxxxxxx)
   6. Click your profile (top right) → get your PUBLIC KEY
   7. Replace the 3 values below with your actual IDs
   ============================================= */

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY_HERE';      // from EmailJS → Account → Public Key
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID_HERE';      // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE';     // from EmailJS → Email Templates

// Load EmailJS SDK
(function loadEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => emailjs.init(EMAILJS_PUBLIC_KEY);
  document.head.appendChild(script);
})();


/* =============================================
   MOBILE MENU
   =============================================*/
const hamburger = document.getElementById('nav-hamburger');
const mobOverlay = document.getElementById('mob-overlay');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobOverlay.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    hamburger.classList.add('open');
    mobOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});


/* =============================================
   SCROLL REVEAL
   =============================================*/
const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revObs.observe(r));


/* =============================================
   NAV ACTIVE STATE ON SCROLL
   =============================================*/
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--white)' : '';
  });
}, { passive: true });


/* =============================================
   FORM VALIDATION
   =============================================*/
function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned) || /^(\+91|91|0)[6-9]\d{9}$/.test(cleaned);
}

function setErr(fieldId, errId, msg) {
  const f = document.getElementById(fieldId);
  const e = document.getElementById(errId);
  if (f) f.classList.add('error');
  if (e) e.textContent = msg;
}
function clearErr(fieldId, errId) {
  const f = document.getElementById(fieldId);
  const e = document.getElementById(errId);
  if (f) f.classList.remove('error');
  if (e) e.textContent = '';
}

function showToast(type, msg) {
  const t = document.getElementById('vm-toast');
  t.className = 'vm-toast ' + type;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 6000);
}

// Live phone validation
document.getElementById('vm-phone').addEventListener('blur', function() {
  if (this.value && !validatePhone(this.value)) {
    setErr('vm-phone', 'vm-phone-err', '⚠ Enter a valid 10-digit mobile number (e.g. 9876543210)');
  } else {
    clearErr('vm-phone', 'vm-phone-err');
  }
});

document.getElementById('vm-name').addEventListener('blur', function() {
  if (!this.value.trim()) {
    setErr('vm-name', 'vm-name-err', '⚠ Please enter your name');
  } else {
    clearErr('vm-name', 'vm-name-err');
  }
});


/* =============================================
   FORM SUBMISSION — sends to jeeveshs18@gmail.com
   =============================================*/
function handleVMSubmit() {
  const name     = document.getElementById('vm-name').value.trim();
  const phone    = document.getElementById('vm-phone').value.trim();
  const interest = document.getElementById('vm-interest').value;
  const message  = document.getElementById('vm-message').value.trim();
  const btn      = document.getElementById('vm-submit-btn');

  // Clear previous errors
  clearErr('vm-name', 'vm-name-err');
  clearErr('vm-phone', 'vm-phone-err');
  clearErr('vm-interest', 'vm-interest-err');

  let hasError = false;

  if (!name) {
    setErr('vm-name', 'vm-name-err', '⚠ Please enter your name');
    hasError = true;
  }
  if (!phone) {
    setErr('vm-phone', 'vm-phone-err', '⚠ Please enter your phone number');
    hasError = true;
  } else if (!validatePhone(phone)) {
    setErr('vm-phone', 'vm-phone-err', '⚠ Enter a valid 10-digit Indian mobile number');
    hasError = true;
  }
  if (!interest) {
    setErr('vm-interest', 'vm-interest-err', '⚠ Please select what you\'re interested in');
    hasError = true;
  }

  if (hasError) {
    showToast('error', '⚠ Please fix the errors above.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Send email via EmailJS
  const templateParams = {
    from_name: name,
    phone:     phone,
    interest:  interest,
    message:   message || 'No additional message',
    to_email:  'jeeveshs18@gmail.com',
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      btn.disabled = false;
      btn.textContent = 'Send Enquiry →';

      // Clear form fields
      document.getElementById('vm-name').value     = '';
      document.getElementById('vm-phone').value    = '';
      document.getElementById('vm-interest').value = '';
      document.getElementById('vm-message').value  = '';

      showToast('success', '✅ Enquiry sent! We will contact you soon. 🏍️');
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      btn.disabled = false;
      btn.textContent = 'Send Enquiry →';
      showToast('error', '❌ Something went wrong. Please call us directly: +91 97880 21456');
    });
}
