const form = document.getElementById('signup-form'); 
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const nameInput = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPw = document.getElementById('confirm');
const tags = document.getElementById('tags');
const terms = document.getElementById('terms');
const touched = new Set();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\d{10}$/;
const successMsg = document.getElementById('successMsg');
const err = {
  name: document.getElementById('err-name'),
  email: document.getElementById('err-email'),
  phone: document.getElementById('err-phone'),
  password: document.getElementById('err-password'),
  confirm: document.getElementById('err-confirm'),
  tags: document.getElementById('err-tags'),
  terms: document.getElementById('err-terms')
};

function setError(input, el, msg)
{
  input.setCustomValidity(msg || '');
  el.textContent = msg || '';
  return !msg;
}

function vName()
{
  const v = nameInput.value.trim();
  return setError(nameInput, err.name, v ? '' : '請輸入姓名');
}

function vEmail()
{
  const v = email.value.trim();
  if (!v) return setError(email, err.email, '請輸入 Email');
  if (!emailRe.test(v)) return setError(email, err.email, 'Email 格式不正確');
  return setError(email, err.email, '');
}

function vPhone()
{
  const v = phone.value.trim();
  if (!v) return setError(phone, err.phone, '請輸入手機');
  if (!phoneRe.test(v)) return setError(phone, err.phone, '需 10 碼數字');
  return setError(phone, err.phone, '');
}

function vPw()
{
  const v = password.value.trim();
  const a = /[A-Za-z]/.test(v);
  const b = /\d/.test(v);
  const c = /[!@#$%^&*]/.test(v);
  const bar = document.getElementById('strength');
  const fill = document.getElementById('strength-fill');
  const text = document.getElementById('strength-text');

  let msg = '';
  if (!v) msg = '請輸入密碼';
  else if (v.length < 8) msg = '至少 8 碼';
  else if (!a || !b) msg = '需英數混合';
  else msg = '';

  let level = 0;
  if (v.length >= 8 && a && b) level = 1;
  if (v.length >= 10 && a && b && c) level = 2;
  if (v.length >= 12 && a && b && c) level = 3;

  bar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  fill.style.width = '0%';
  text.textContent = '';

  if (level === 1)
  {
    bar.classList.add('strength-weak');
    fill.style.width = '33%';
    fill.style.backgroundColor = '#dc3545';
    text.textContent = '弱';
  }
  else if (level === 2)
  {
    bar.classList.add('strength-medium');
    fill.style.width = '66%';
    fill.style.backgroundColor = '#ffc107';
    text.textContent = '中';
  }
  else if (level === 3)
  {
    bar.classList.add('strength-strong');
    fill.style.width = '100%';
    fill.style.backgroundColor = '#28a745';
    text.textContent = '強';
  }

  return setError(password, err.password, msg);
}

function vConfirm()
{
  const a = password.value.trim();
  const b = confirmPw.value.trim();
  if (!b) return setError(confirmPw, err.confirm, '請再次輸入密碼');
  if (a !== b) return setError(confirmPw, err.confirm, '兩次密碼不一致');
  return setError(confirmPw, err.confirm, '');
}

function vTags()
{
  const boxes = tags.querySelectorAll('input[type="checkbox"]');
  const checked = tags.querySelectorAll('input[type="checkbox"]:checked').length;
  const target = boxes[0];
  if (!target) return true;
  return setError(target, err.tags, checked > 0 ? '' : '請至少選 1 項');
}

function vTerms()
{
  return setError(terms, err.terms, terms.checked ? '' : '請勾選同意');
}

function validateAll()
{
  const checks = [
    { ok: vName(), el: nameInput },
    { ok: vEmail(), el: email },
    { ok: vPhone(), el: phone },
    { ok: vPw(), el: password },
    { ok: vConfirm(), el: confirmPw },
    { ok: vTags(), el: tags },
    { ok: vTerms(), el: terms }
  ];
  const bad = checks.find(x => !x.ok);
  return bad ? bad.el : null;
}

function onBlur(e)
{
  touched.add(e.target.id || e.target.name);
  run(e.target.id);
}

function onInput(e)
{
  if (!touched.has(e.target.id)) return;
  run(e.target.id);
}

function run(id)
{
  if (id === 'name') vName();
  if (id === 'email') vEmail();
  if (id === 'phone') vPhone();
  if (id === 'password')
  {
    vPw();
    if (touched.has('confirm')) vConfirm();
  }
  if (id === 'confirm') vConfirm();
}

[nameInput, email, phone, password, confirmPw].forEach(el =>
{
  el.addEventListener('blur', onBlur);
  el.addEventListener('input', onInput);
});

function toggleTagStyle(cb)
{
  const label = cb.closest('label');
  if (!label) return;
  if (cb.checked) label.classList.add('text-primary');
  else label.classList.remove('text-primary');
}

function updateTagCount()
{
  const c = tags.querySelectorAll('input[type="checkbox"]:checked').length;
  const el = document.getElementById('tag-count');
  if (el) el.textContent = `已選 ${c} 項`;
}

tags.addEventListener('click', e =>
{
  const cb = e.target.closest('input[type="checkbox"]');
  if (!cb) return;
  touched.add('tags');
  toggleTagStyle(cb);
  updateTagCount();
  if (touched.has('tags')) vTags();
  saveData();
});

tags.addEventListener('blur', () =>
{
  touched.add('tags');
  vTags();
}, true);

terms.addEventListener('change', () =>
{
  if (touched.has('terms')) vTerms();
});

terms.addEventListener('blur', () =>
{
  touched.add('terms');
  vTerms();
});

form.addEventListener('submit', async e =>
{
  e.preventDefault();
  ['name', 'email', 'phone', 'password', 'confirm'].forEach(id => touched.add(id));
  touched.add('tags');
  touched.add('terms');
  const first = validateAll();
  if (first)
  {
    first.focus();
    return;
  }
  submitBtn.disabled = true;
  resetBtn.disabled = true;
  const oldText = submitBtn.textContent;
  submitBtn.textContent = '送出中...';
  await new Promise(r => setTimeout(r, 1000));
  form.reset();
  Object.values(err).forEach(x => x.textContent = '');
  touched.clear();
  tags.querySelectorAll('label').forEach(l => l.classList.remove('text-primary'));
  updateTagCount();
  document.getElementById('strength').classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  document.getElementById('strength-fill').style.width = '0%';
  document.getElementById('strength-text').textContent = '';
  submitBtn.disabled = false;
  resetBtn.disabled = false;
  submitBtn.textContent = oldText;
  successMsg.classList.remove('d-none');
  successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => successMsg.classList.add('d-none'), 2000);
  localStorage.removeItem('signupForm');
});

function saveData()
{
  const data = {
    name: nameInput.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    confirm: confirmPw.value,
    tags: Array.from(tags.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value),
    terms: terms.checked
  };
  localStorage.setItem('signupForm', JSON.stringify(data));
}

function loadData()
{
  const data = JSON.parse(localStorage.getItem('signupForm') || '{}');
  if (!data) return;
  if (data.name) nameInput.value = data.name;
  if (data.email) email.value = data.email;
  if (data.phone) phone.value = data.phone;
  if (data.password) password.value = data.password;
  if (data.confirm) confirmPw.value = data.confirm;
  if (data.tags)
  {
    data.tags.forEach(v =>
    {
      const box = tags.querySelector(`input[value="${v}"]`);
      if (box)
      {
        box.checked = true;
        toggleTagStyle(box);
      }
    });
  }
  if (data.terms) terms.checked = true;
  updateTagCount();
  vPw();
}

[nameInput, email, phone, password, confirmPw].forEach(el =>
{
  el.addEventListener('input', saveData);
});

terms.addEventListener('change', saveData);

window.addEventListener('DOMContentLoaded', loadData);

password.addEventListener('input', () =>
{
  vPw();
  if (touched.has('confirm')) vConfirm();
});
