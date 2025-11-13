const registrationPage = document.getElementById('registration-page');
const welcomePage = document.getElementById('welcome-page');
const registrationForm = document.getElementById('registration-form');
const submitBtn = document.getElementById('submit-btn');
const privacyModal = document.getElementById('privacy-modal');
const privacyLink = document.getElementById('privacy-link');
const closeModal = document.querySelector('.close');
const agreeBtn = document.getElementById('agree-btn');
const privacyCheckbox = document.getElementById('privacy-agreement');
const startExploringBtn = document.getElementById('start-exploring');
const uploadArea = document.getElementById('upload-area');
const photoInput = document.getElementById('photo');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const removePhotoBtn = document.getElementById('remove-photo');

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
}

photoInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        previewImage.src = reader.result;
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
    validatePhoto();
});

removePhotoBtn?.addEventListener('click', () => {
    photoInput.value = '';
    previewImage.src = '';
    previewContainer.style.display = 'none';
    validatePhoto();
});

privacyLink?.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'block';
});

closeModal?.addEventListener('click', () => privacyModal.style.display = 'none');

agreeBtn?.addEventListener('click', () => {
    privacyCheckbox.checked = true;
    privacyModal.style.display = 'none';
    validatePrivacy();
});

privacyCheckbox?.addEventListener('mousedown', (e) => {
    if (!privacyCheckbox.checked) {
        e.preventDefault();
        privacyModal.style.display = 'block';
    }
});

document.querySelector('label[for="privacy-agreement"]')?.addEventListener('click', (e) => {
    if (!privacyCheckbox.checked) {
        e.preventDefault();
        privacyModal.style.display = 'block';
    }
});

function validateField(id, cond, message) {
    const el = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (!cond) {
        err.textContent = message;
        el.style.borderColor = 'var(--danger-color)';
        return false;
    } else {
        err.textContent = '';
        el.style.borderColor = 'var(--success-color)';
        return true;
    }
}

function validateUsername() {
    const username = document.getElementById('username').value.trim();
    return validateField('username', username.length >= 3, '帳號至少 3 碼');
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const isValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
    validateField('password', isValid, '至少 8 碼且含英數字');
    
    if (document.getElementById('confirm-password').value) {
        validateConfirmPassword();
    }
    return isValid;
}

function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    return validateField('confirm-password', confirmPassword === password, '兩次密碼不一致');
}

function validateNickname() {
    const nickname = document.getElementById('nickname').value.trim();
    return validateField('nickname', nickname.length > 0, '請輸入暱稱');
}

function validateAge() {
    const age = parseInt(document.getElementById('age').value, 10);
    return validateField('age', age >= 18 && age <= 120, '年齡需在 18 歲以上');
}

function validateEmail() {
    const email = document.getElementById('email').value;
    return validateField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Email 格式錯誤');
}

function validateBio() {
    const bio = document.getElementById('bio').value.trim();
    return validateField('bio', bio.length >= 10, '至少輸入 10 個字');
}

function validateGender() {
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    const err = document.getElementById('gender-error');
    if (!genderChecked) {
        err.textContent = '請選擇你的性別';
        return false;
    } else {
        err.textContent = '';
        return true;
    }
}

function validatePhoto() {
    return validateField('photo', photoInput.files && photoInput.files.length > 0, '請上傳大頭貼');
}

function validatePrivacy() {
    const err = document.getElementById('privacy-error');
    if (!privacyCheckbox.checked) {
        err.textContent = '請同意隱私條款';
        return false;
    } else {
        err.textContent = '';
        return true;
    }
}

function validateForm() {
    let isValid = true;
    isValid &= validateUsername();
    isValid &= validatePassword();
    isValid &= validateConfirmPassword();
    isValid &= validateNickname();
    isValid &= validateAge();
    isValid &= validateEmail();
    isValid &= validateBio();
    isValid &= validateGender();
    isValid &= validatePhoto();
    isValid &= validatePrivacy();
    return !!isValid;
}

function resetForm() {
    registrationForm.reset();
    previewImage.src = '';
    previewContainer.style.display = 'none';
    document.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.style.borderColor = '#e3e6ea';
    });
}

document.getElementById('reset-btn')?.addEventListener('click', resetForm);

registrationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    showWelcomePage();
});

function showWelcomePage() {
    const username = document.getElementById('username').value;
    const nickname = document.getElementById('nickname').value || username;
    const age = document.getElementById('age').value;

    document.getElementById('welcome-name').textContent = `${nickname}（${age}）`;
    document.getElementById('welcome-bio').textContent = document.getElementById('bio').value;

    switchPage('welcome-page');
}

const discoverPage = document.getElementById('discover-page');
const cardStack = document.getElementById('card-stack');
const geoStatus = document.getElementById('geo-status');
const likeBtn = document.getElementById('btn-like');
const dislikeBtn = document.getElementById('btn-dislike');

let currentUser = null;
let deck = [];
let topIndex = 0;
let liked = [];
let noped = [];

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function generateMockProfiles(center, count=18) {
    const names = ["Ivy","Kelly","Amber","Mia","Chloe","Harry","Jay","Ken","Leo","Max","Nina","Owen","Penny","Quinn","Ruby"];
    const interestsPool = ["音樂","健身","旅行","攝影","電影","美食","閱讀","舞蹈","遊戲","登山"];
    const genders = ["male","female"];
    const arr = [];
    for (let i=0; i<count; i++) {
        const dx = (Math.random()-0.5) * 0.08;
        const dy = (Math.random()-0.5) * 0.08;
        const g = genders[Math.floor(Math.random()*genders.length)];
        const intr = interestsPool.sort(()=>0.5-Math.random()).slice(0,3);
        arr.push({
            id: 'p'+(1000+i),
            name: names[Math.floor(Math.random()*names.length)],
            age: 18 + Math.floor(Math.random()*12),
            gender: g,
            bio: "嗨！一起去喝咖啡或跳舞～",
            interests: intr,
            photo: null,
            lat: center.lat + dx,
            lng: center.lng + dy
        });
    }
    return arr;
}

function getOppositeGender(g) {
    if (!g) return null;
    return g === 'male' ? 'female' : 'male';
}

function requestLocation() {
    if (!navigator.geolocation) {
        geoStatus.textContent = "你的瀏覽器不支援定位功能。";
        return Promise.resolve(null);
    }
    geoStatus.textContent = "正在嘗試定位…";
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const {latitude, longitude} = pos.coords;
                geoStatus.textContent = "定位成功！";
                resolve({lat: latitude, lng: longitude});
            },
            (err) => {
                console.warn("Geolocation error:", err);
                geoStatus.textContent = "無法取得定位，將改用隨機附近位置示範。";
                resolve({lat: 25.033968, lng: 121.564468});
            },
            {enableHighAccuracy: true, timeout: 8000, maximumAge: 60000}
        );
    });
}

function toKM(n){ return Math.round(n*10)/10; }

function buildCard(profile, userCenter) {
    const km = toKM(haversine(userCenter.lat, userCenter.lng, profile.lat, profile.lng));
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.dataset.id = profile.id;

    const likeStamp = document.createElement('div');
    likeStamp.className = 'like-indicator';
    likeStamp.textContent = 'LIKE';

    const nopeStamp = document.createElement('div');
    nopeStamp.className = 'nope-indicator';
    nopeStamp.textContent = 'NOPE';

    const photo = document.createElement('div');
    photo.className = 'photo';
    const img = document.createElement('img');
    img.src = profile.photo || 'https://picsum.photos/seed/' + encodeURIComponent(profile.id) + '/600/400';
    img.alt = profile.name;
    photo.appendChild(img);

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<div><strong>${profile.name}, ${profile.age}</strong><div class="badges"><span class="badge">${km} km</span>${profile.interests.map(i=>`<span class="badge">${i}</span>`).join('')}</div></div>`;

    card.appendChild(likeStamp);
    card.appendChild(nopeStamp);
    card.appendChild(photo);
    card.appendChild(info);

    enableSwipe(card);
    return card;
}

function renderDeck(center) {
    cardStack.innerHTML = '';
    for (let i=deck.length-1; i>=topIndex; i--) {
        const card = buildCard(deck[i], center);
        card.style.transform = `translateY(${(i-topIndex)*4}px)`;
        cardStack.appendChild(card);
    }
}

function enableSwipe(card) {
    let startX = 0, currentX = 0, dragging = false;

    const onDown = (e) => {
        dragging = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        card.style.transition = 'none';
    };
    const onMove = (e) => {
        if (!dragging) return;
        currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const dx = currentX - startX;
        const rot = dx / 20;
        card.style.transform = `translate(${dx}px, 0) rotate(${rot}deg)`;
        const like = card.querySelector('.like-indicator');
        const nope = card.querySelector('.nope-indicator');
        const op = Math.min(1, Math.abs(dx) / 120);
        if (dx > 0) { like.style.opacity = op; nope.style.opacity = 0; }
        else { nope.style.opacity = op; like.style.opacity = 0; }
    };
    const onUp = () => {
        if (!dragging) return;
        dragging = false;
        const rect = card.getBoundingClientRect();
        const dx = (rect.left + rect.right)/2 - (cardStack.getBoundingClientRect().left + cardStack.offsetWidth/2);
        if (Math.abs(dx) > 100) {
            const isLike = dx > 0;
            swipeFinalize(card, isLike);
        } else {
            card.style.transition = 'transform 0.2s ease';
            card.style.transform = '';
            const like = card.querySelector('.like-indicator');
            const nope = card.querySelector('.nope-indicator');
            like.style.opacity = 0; nope.style.opacity = 0;
        }
    };

    card.addEventListener('mousedown', onDown);
    card.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    card.addEventListener('touchstart', onDown, {passive:true});
    card.addEventListener('touchmove', onMove, {passive:true});
    card.addEventListener('touchend', onUp);
}

function swipeFinalize(card, isLike) {
    const dx = isLike ? 600 : -600;
    card.style.transition = 'transform 0.3s ease';
    card.style.transform = `translate(${dx}px, -60px) rotate(${isLike?15:-15}deg)`;
    const item = deck[topIndex];
    setTimeout(()=>{
        if (isLike) liked.push(item);
        else noped.push(item);
        topIndex++;
        card.remove();
        if (topIndex >= deck.length) {
            cardStack.innerHTML = '<div class="welcome-bio">沒有更多人囉，稍後再回來看看～</div>';
        }
    }, 280);
}

likeBtn?.addEventListener('click', ()=> {
    const topCard = cardStack.querySelector('.profile-card:last-child');
    if (topCard) swipeFinalize(topCard, true);
});

dislikeBtn?.addEventListener('click', ()=> {
    const topCard = cardStack.querySelector('.profile-card:last-child');
    if (topCard) swipeFinalize(topCard, false);
});

startExploringBtn?.addEventListener('click', async ()=>{
    const username = document.getElementById('username')?.value || '你';
    const age = parseInt(document.getElementById('age')?.value || '20', 10);
    const bio = document.getElementById('bio')?.value || '';
    const gender = (document.querySelector('input[name="gender"]:checked')?.value) || null;
    const pref = document.getElementById('preference')?.value || 'opposite';
    currentUser = {username, age, bio, gender, preference: pref};

    switchPage('discover-page');

    const center = await requestLocation();
    if (!center) return;
    currentUser.lat = center.lat; currentUser.lng = center.lng;

    let candidates = generateMockProfiles(center, 18);
    if (pref === 'opposite' && gender) {
        const target = getOppositeGender(gender);
        candidates = candidates.filter(p => p.gender === target);
    }
    candidates.sort((a,b)=>haversine(center.lat,center.lng,a.lat,a.lng) - haversine(center.lat,center.lng,b.lat,b.lng));
    deck = candidates;
    topIndex = 0;
    renderDeck(center);
});

document.getElementById('username')?.addEventListener('input', validateUsername);
document.getElementById('username')?.addEventListener('blur', validateUsername);

document.getElementById('password')?.addEventListener('input', validatePassword);
document.getElementById('password')?.addEventListener('blur', validatePassword);

document.getElementById('confirm-password')?.addEventListener('input', validateConfirmPassword);
document.getElementById('confirm-password')?.addEventListener('blur', validateConfirmPassword);

document.getElementById('nickname')?.addEventListener('input', validateNickname);
document.getElementById('nickname')?.addEventListener('blur', validateNickname);

document.getElementById('age')?.addEventListener('input', validateAge);
document.getElementById('age')?.addEventListener('blur', validateAge);

document.getElementById('email')?.addEventListener('input', validateEmail);
document.getElementById('email')?.addEventListener('blur', validateEmail);

document.getElementById('bio')?.addEventListener('input', validateBio);
document.getElementById('bio')?.addEventListener('blur', validateBio);

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', validateGender);
});

privacyCheckbox?.addEventListener('change', validatePrivacy);