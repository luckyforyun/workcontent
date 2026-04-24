import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // === State Management ===
  let isFirstTime = !localStorage.getItem('sos_onboarded');
  let currentLang = localStorage.getItem('sos_lang') || 'zh';

  const translations = {
    zh: {
      appTitle: "紧急救援",
      appSubtitle: "随时待命",
      sosCall: "SOS 紧急呼叫",
      sosSub: "电话拨号 + 发送位置",
      currentLoc: "当前位置",
      nearbyAed: "附近 AED",
      sosVideo: "SOS 视频",
      cpr: "心肺复苏",
      aedUsage: "AED 使用",
      preparing: "准备发送",
      locationShare: "位置共享",
      waitingTrigger: "等待触发...",
      emergencyContact: "紧急联系人",
      prepareAlert: "准备提醒",
      autoSendCountdown: "自动发送倒计时",
      cancelSOS: "取消求救",
      cancelSOS2: "取消求救",
      sendingNow: "正在发送...",
      locationShare3: "位置共享",
      emergencyContact3: "紧急联系人",
      cancelSOS3: "取消求救",
      rescueOnWay: "救援已在路上",
      locationShare2: "位置共享",
      locAttached: "位置已附加",
      emergencyContact2: "紧急联系人",
      noticeSent: "通知已发送",
      callEmergency: "拨打 110/119/120",
      quickSms: "快捷短信",
      navHome: "求救",
      navContacts: "联系人",
      navHistory: "记录",
      navSettings: "设置"
    },
    en: {
      appTitle: "EMERGENCY",
      appSubtitle: "ON STANDBY",
      sosCall: "SOS CALL",
      sosSub: "Dial + Share Location",
      currentLoc: "Current Location",
      nearbyAed: "Nearby AED",
      sosVideo: "SOS Videos",
      cpr: "CPR Guide",
      aedUsage: "AED Usage",
      preparing: "PREPARING",
      locationShare: "Location Share",
      waitingTrigger: "Waiting...",
      emergencyContact: "Emergency Contacts",
      prepareAlert: "Alerting...",
      autoSendCountdown: "Auto Send In",
      cancelSOS: "Cancel SOS",
      cancelSOS2: "Cancel SOS",
      sendingNow: "SENDING...",
      locationShare3: "Location Share",
      emergencyContact3: "Emergency Contacts",
      cancelSOS3: "Cancel SOS",
      rescueOnWay: "RESCUE ON THE WAY",
      locationShare2: "Location Share",
      locAttached: "Attached",
      emergencyContact2: "Emergency Contacts",
      noticeSent: "Notified",
      callEmergency: "Call 911",
      quickSms: "Quick SMS",
      navHome: "SOS",
      navContacts: "Contacts",
      navHistory: "History",
      navSettings: "Settings"
    }
  };

  function updateLanguage() {
    const texts = document.querySelectorAll('[data-i18n]');
    texts.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        el.innerText = translations[currentLang][key];
      }
    });
  }

  // Initial language setup
  updateLanguage();

  const langSwitchBtn = document.getElementById('btn-lang-switch');
  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', () => {
      currentLang = currentLang === 'zh' ? 'en' : 'zh';
      localStorage.setItem('sos_lang', currentLang);
      updateLanguage();
    });
  }
  
  // === DOM Elements ===
  const app = document.getElementById('app');
  const bottomNav = document.getElementById('bottom-nav');
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  
  // SOS Elements
  const sosBtn = document.getElementById('btn-sos');
  const stateDefault = document.getElementById('sos-default-state');
  const stateSending = document.getElementById('sos-sending-state');
  const stateActualSending = document.getElementById('sos-actual-sending-state');
  const stateSuccess = document.getElementById('sos-success-state');
  const btnCancelSos = document.getElementById('btn-cancel-sos');
  const btnCancelActual = document.getElementById('btn-cancel-actual');
  const btnResetSos = document.getElementById('btn-reset-sos');
  const countdownEl = document.getElementById('cancel-countdown');
  const locText = document.getElementById('loc-text');

  // === Navigation Logic ===
  function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if(target) target.classList.add('active');

    if (pageId === 'page-onboarding') {
      bottomNav.classList.add('hidden');
    } else {
      bottomNav.classList.remove('hidden');
      navItems.forEach(nav => {
        if (nav.dataset.target === pageId) nav.classList.add('active');
        else nav.classList.remove('active');
      });
    }
  }

  navItems.forEach(nav => {
    nav.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(nav.dataset.target);
    });
  });

  // === Onboarding Logic ===
  if (isFirstTime) {
    navigateTo('page-onboarding');
    setupOnboarding();
  } else {
    navigateTo('page-home');
  }

  function setupOnboarding() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const btnStart = document.getElementById('btn-start');
    let currentSlide = 0;

    app.addEventListener('click', (e) => {
      if (e.target === btnStart) {
        localStorage.setItem('sos_onboarded', 'true');
        navigateTo('page-home');
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(updateLocation, () => {
            if(locText) locText.innerText = '定位未授权';
          });
        }
        return;
      }

      if (document.getElementById('page-onboarding').classList.contains('active')) {
        currentSlide++;
        if (currentSlide >= slides.length) currentSlide = slides.length - 1;
        
        slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      }
    });
  }

  // === Location updates ===
  function updateLocation(pos) {
    const lat = pos.coords.latitude.toFixed(4);
    const lng = pos.coords.longitude.toFixed(4);
    const coordsEl = document.querySelector('.coords');
    
    if (locText) {
      locText.innerText = `北京市`;
    }
    if (coordsEl) {
      coordsEl.innerText = `${lat}, ${lng}`;
    }
  }

  if(!isFirstTime && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updateLocation, () => {
      if(locText) locText.innerText = '北京市 (模拟定位)';
    });
  } else if (!isFirstTime) {
     if(locText) locText.innerText = '北京市 (模拟定位)';
  }

  // === SOS Logic ===
  let pressTimer;
  let isPressing = false;
  let countdownInterval;
  let cancelTimeout;
  let actualSendingTimeout;

  const startPress = (e) => {
    if(stateDefault.classList.contains('active') === false) return;
    isPressing = true;
    sosBtn.classList.add('pressing');
    if (navigator.vibrate) navigator.vibrate(50);

    pressTimer = setTimeout(() => {
      if (isPressing) triggerSOS();
    }, 1500);
  };

  const cancelPress = () => {
    if (isPressing) {
      isPressing = false;
      sosBtn.classList.remove('pressing');
      clearTimeout(pressTimer);
    }
  };

  const triggerSOS = () => {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    cancelPress();
    
    // Switch to Sending State
    stateDefault.classList.remove('active');
    stateSending.classList.add('active');
    
    let secondsLeft = 5;
    countdownEl.innerText = secondsLeft;
    
    const progressFill = document.getElementById('cancel-progress');
    if(progressFill) {
      progressFill.style.transition = 'none';
      progressFill.style.width = '100%';
      // Force reflow
      progressFill.offsetHeight;
      progressFill.style.transition = 'width 5s linear';
      progressFill.style.width = '0%';
    }

    countdownInterval = setInterval(() => {
      secondsLeft--;
      countdownEl.innerText = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    cancelTimeout = setTimeout(() => {
      // Actual Sending Phase
      stateSending.classList.remove('active');
      stateActualSending.classList.add('active');
      
      actualSendingTimeout = setTimeout(() => {
        // Complete SOS
        stateActualSending.classList.remove('active');
        stateSuccess.classList.add('active');
        addHistoryRecord();
      }, 2000);
    }, 5000);
  };

  const cancelSOS = () => {
    clearInterval(countdownInterval);
    clearTimeout(cancelTimeout);
    clearTimeout(actualSendingTimeout);
    stateSending.classList.remove('active');
    stateActualSending.classList.remove('active');
    stateDefault.classList.add('active');
  };

  const resetSOS = () => {
    stateSuccess.classList.remove('active');
    stateDefault.classList.add('active');
  };

  sosBtn.addEventListener('touchstart', startPress);
  sosBtn.addEventListener('touchend', cancelPress);
  sosBtn.addEventListener('touchcancel', cancelPress);
  sosBtn.addEventListener('mousedown', startPress);
  sosBtn.addEventListener('mouseup', cancelPress);
  sosBtn.addEventListener('mouseleave', cancelPress);

  btnCancelSos.addEventListener('click', cancelSOS);
  if(btnCancelActual) btnCancelActual.addEventListener('click', cancelSOS);
  btnResetSos.addEventListener('click', resetSOS);

  // === Mock Data Rendering ===
  const renderContacts = () => {
    const list = document.getElementById('contact-list');
    if(!list) return;
    const contacts = [
      { name: '妈妈', phone: '138****1234', primary: true },
      { name: '爸爸', phone: '139****5678', primary: false },
      { name: '张警官', phone: '110', primary: false }
    ];

    list.innerHTML = contacts.map(c => `
      <div class="card-item">
        <div class="card-left">
          <div class="avatar">${c.name[0]}</div>
          <div class="contact-info">
            <h4>${c.name} ${c.primary ? '<span class="tag-primary">主要</span>' : ''}</h4>
            <p>${c.phone}</p>
          </div>
        </div>
        <button class="btn-icon"><i class="ph ph-trash"></i></button>
      </div>
    `).join('');
  };

  const renderHistory = () => {
    const list = document.getElementById('history-list');
    if(!list) return;
    const history = [
      { date: '2026-04-23 14:20', loc: '北京市朝阳区', status: '成功' },
      { date: '2026-04-10 09:15', loc: '北京市海淀区', status: '已取消' }
    ];

    list.innerHTML = history.map(h => `
      <div class="card-item">
        <div class="history-info">
          <h4>${h.date}</h4>
          <p><i class="ph ph-map-pin"></i> ${h.loc}</p>
        </div>
        <div class="${h.status === '成功' ? 'status-success' : 'status-failed'}">${h.status}</div>
      </div>
    `).join('');
  };

  function addHistoryRecord() {
    const list = document.getElementById('history-list');
    if(!list) return;
    const now = new Date();
    const formatted = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.toTimeString().split(' ')[0]}`;
    const newRecord = `
      <div class="card-item" style="animation: flashBg 1s;">
        <div class="history-info">
          <h4>${formatted}</h4>
          <p><i class="ph ph-map-pin"></i> 北京市 (最新位置)</p>
        </div>
        <div class="status-success">成功</div>
      </div>
    `;
    list.insertAdjacentHTML('afterbegin', newRecord);
  }

  renderContacts();
  renderHistory();
});
