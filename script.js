// app.js - Sanctuary App – Final Production Version (2025)
document.addEventListener('DOMContentLoaded', () => {
  // ==================== DATA SOURCES ====================
  const homeVerses = [
    { text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures...", ref: "Psalm 23:1-2" },
    { text: "For I know the plans I have for you,” declares the Lord, “plans to prosper you...", ref: "Jeremiah 29:11" },
    { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
    { text: "The Lord is my strength and my shield; in him my heart trusts...", ref: "Psalm 28:7" },
    { text: "Cast your burden on the Lord, and he will sustain you...", ref: "Psalm 55:22" },
    { text: "But those who hope in the Lord will renew their strength...", ref: "Isaiah 40:31" },
    { text: "Be strong and courageous. Do not be afraid...", ref: "Joshua 1:9" },
  ];

  const devotionsData = {
    Joyful: { title: "Finding Joy in the Everyday", text: "In moments of pure joy, our hearts often burst with gratitude...", reference: "Psalm 118:24" },
    Anxious: { title: "Peace That Surpasses Understanding", text: "When anxiety weighs heavy, remember that you are held by a love far greater than fear...", reference: "Philippians 4:6-7" },
    'Seeking Guidance': { title: "A Lamp Unto My Feet", text: "In seasons of uncertainty, trust that God is not hiding the path — He is the path...", reference: "Psalm 119:105" },
    Grateful: { title: "A Heart Full of Thanks", text: "Gratitude turns what we have into enough, and more...", reference: "1 Thessalonians 5:18" },
    Peaceful: { title: "Be Still and Know", text: "In the quiet, He speaks. In rest, He restores...", reference: "Psalm 46:10" },
    Tired: { title: "Come to Me, All Who Are Weary", text: "You were never meant to carry it all...", reference: "Matthew 11:28-30" },
  };

  // ==================== STATE ====================
  const state = {
    currentScreen: 0,
    selectedMood: 'Joyful',
    likedVerses: new Set(['Philippians 4:13']),
    savedVerses: new Set(['Jeremiah 29:11', 'Psalm 28:7', 'Isaiah 40:31']),
    savedDevotions: new Set(),
    user: { name: 'John Doe', streak: 45 },
  };

  // ==================== DOM ====================
  const screens = document.querySelectorAll('.mobile-screen');
  const savedContainer = document.querySelector('.saved-content-list');
  const generateBtn = document.querySelector('.generate-button');
  const moodChips = document.querySelectorAll('.mood-chip');

  // Devotion Screen
  const devotionScreen = screens[2];
  const devotionTitle = devotionScreen.querySelector('h3');
  const devotionText = devotionScreen.querySelector('.devotion-text');
  const devotionRef = devotionScreen.querySelector('.devotion-source');
  const devotionLikeBtn = devotionScreen.querySelector('.like-button');
  const devotionSaveBtn = devotionScreen.querySelector('.save-button');

  // ==================== CORE FUNCTIONS ====================
  const showScreen = (index) => {
    screens.forEach((screen, i) => {
      screen.style.transform = `translateX(${100 * (i - index)}%)`;
      screen.style.opacity = i === index ? '1' : '0';
      screen.style.pointerEvents = i === index ? 'all' : 'none';
      screen.style.zIndex = i === index ? '10' : '1';
    });

    state.currentScreen = index;

    // Dynamic Back Button
    document.querySelector('header .left-icon').forEach(icon => {
      if (index === 0 || index === 3) {
        icon.style.visibility = 'hidden';
      } else {
        icon.style.visibility = 'visible';
        icon.innerHTML = '<i class="fas fa-arrow-left"></i>';
      }
    });
  };

  const updateSavedVersesList = () => {
    if (!savedContainer) return;
    savedContainer.innerHTML = '';

    const savedRefs = Array.from(state.savedVerses);
    if (savedRefs.length === 0) {
      savedContainer.innerHTML = `<p style="text-align:center; color:var(--text-secondary); padding:40px 20px; font-style:italic;">No saved verses yet. Tap the bookmark to save one ♡</p>`;
      return;
    }

    savedRefs.forEach(ref => {
      const verse = homeVerses.find(v => v.ref === ref) || { text: "Beautiful verse saved ♡", ref };
      const card = document.createElement('div');
      card.className = 'saved-verse-card interactive';
      card.innerHTML = `
        <p class="verse-text">${verse.text}</p>
        <p class="verse-reference">${verse.ref}</p>
      `;
      savedContainer.appendChild(card);
    });
  };

  // ==================== INITIALIZE ====================
  screens.forEach(s => {
    s.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease';
    s.style.width = '100%';
    s.style.position = 'absolute';
    s.style.top = 0;
    s.style.left = 0;
  });
  showScreen(0);
  updateSavedVersesList();

  // ==================== NAVIGATION ====================
  document.addEventListener('click', e => {
    if (e.target.closest('.fa-arrow-left')) {
      if (state.currentScreen === 2) showScreen(1);
      if (state.currentScreen === 1) showScreen(0);
    }
  });

  document.querySelectorAll('.logo').forEach(l => l.addEventListener('click', () => {
    if (state.currentScreen === 0) showScreen(1);
  }));

  document.querySelectorAll('.right-icon img, .profile-avatar, .fa-cog').forEach(el => {
    el.addEventListener('click', () => showScreen(3));
  });

  // ==================== MOOD & DEVOTION ====================
  moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
      moodChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.selectedMood = chip.querySelector('span').textContent.trim();
    });
  });

  generateBtn?.addEventListener('click', () => {
    const devotion = devotionsData[state.selectedMood];
    if (!devotion) return;

    devotionTitle.textContent = devotion.title;
    devotionText.textContent = devotion.text;
    devotionRef.textContent = devotion.reference;

    const key = `${devotion.title} - ${devotion.reference}`;
    devotionLikeBtn.classList.remove('active');
    devotionSaveBtn.classList.toggle('active', state.savedDevotions.has(key));

    showScreen(2);
  });

  // ==================== HOME FEED LIKE/SAVE ====================
  document.querySelectorAll('.verse-card').forEach(card => {
    const ref = card.querySelector('.verse-reference')?.textContent.trim();
    if (!ref) return;

    const likeBtn = card.querySelector('.like-button');
    const saveBtn = card.querySelector('.save-button');

    // Sync state on load
    likeBtn.classList.toggle('active', state.likedVerses.has(ref));
    saveBtn.classList.toggle('active', state.savedVerses.has(ref));

    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('active');
      likeBtn.classList.contains('active')
        ? state.likedVerses.add(ref)
        : state.likedVerses.delete(ref);
    });

    saveBtn.addEventListener('click', () => {
      saveBtn.classList.toggle('active');
      if (saveBtn.classList.contains('active')) {
        state.savedVerses.add(ref);
      } else {
        state.savedVerses.delete(ref);
      }
      updateSavedVersesList(); // Real-time update
    });
  });

  // ==================== DEVOTION LIKE/SAVE ====================
  devotionLikeBtn?.addEventListener('click', () => devotionLikeBtn.classList.toggle('active'));

  devotionSaveBtn?.addEventListener('click', () => {
    devotionSaveBtn.classList.toggle('active');
    const key = `${devotionTitle.textContent} - ${devotionRef.textContent}`;
    devotionSaveBtn.classList.contains('active')
      ? state.savedDevotions.add(key)
      : state.savedDevotions.delete(key);
  });

  // ==================== PROFILE TABS ====================
  document.querySelectorAll('.profile-tab-button').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab-button').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ==================== BONUS: Haptic Feedback (Mobile) ====================
  document.querySelectorAll('button, .interactive').forEach(el => {
    el.addEventListener('touchstart', () => {
      if (navigator.vibrate) navigator.vibrate(10);
    }, { passive: true });
  });
});
