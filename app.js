// ─── MODEL LİSTELERİ ───
const GEMINI_MODELS = [
  { name: 'gemini-2.5-flash',       ver: 'v1beta' },
  { name: 'gemini-2.0-flash',       ver: 'v1beta' },
  { name: 'gemini-1.5-flash',       ver: 'v1' },
  { name: 'gemini-1.5-pro',         ver: 'v1' },
  { name: 'gemini-1.5-flash',       ver: 'v1beta' },
  { name: 'gemini-1.5-pro',         ver: 'v1beta' }
];

const NVIDIA_MODELS = [
  'meta/llama-3.3-70b-instruct',
  'deepseek-ai/deepseek-r1',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'meta/llama-3.1-405b-instruct',
  'mistralai/mistral-large-2-instruct'
];

const OMNIROUTE_MODELS = [
  'gemini-2.5-flash',
  'google/gemini-2.5-flash',
  'gpt-4o',
  'openai/gpt-4o',
  'deepseek-chat',
  'deepseek/deepseek-chat',
  'deepseek-r1',
  'deepseek-ai/deepseek-r1',
  'llama-3.3-70b-instruct',
  'meta-llama/llama-3.3-70b-instruct',
  'auto'
];

// ─── SINAV KONFIGURASYONLARI (Resmi Soru Sayıları & Ara Sınıflar) ───
const SINAV_CONFIG = {
  'TYT': {
    label: 'TYT (Temel Yeterlilik Testi)', sik: 4, sure: 165,
    bolumler: [
      { ders: 'Türkçe', count: 40 },
      { ders: 'Sosyal Bilimler', count: 20, detay: 'Tarih(5), Coğrafya(5), Felsefe(5), Din(5)' },
      { ders: 'Temel Matematik', count: 40 },
      { ders: 'Fen Bilimleri', count: 20, detay: 'Fizik(7), Kimya(7), Biyoloji(6)' }
    ]
  },
  'AYT_SAY': {
    label: 'AYT Sayısal', sik: 5, sure: 180,
    bolumler: [
      { ders: 'Matematik', count: 40 },
      { ders: 'Fen Bilimleri', count: 40, detay: 'Fizik(14), Kimya(13), Biyoloji(13)' }
    ]
  },
  'AYT_SOZ': {
    label: 'AYT Sözel', sik: 5, sure: 180,
    bolumler: [
      { ders: 'Türk Dili ve Edebiyatı', count: 24 },
      { ders: 'Tarih-1 ve Coğrafya-1', count: 16, detay: 'Tarih-1(10), Coğrafya-1(6)' },
      { ders: 'Tarih-2 ve Coğrafya-2', count: 22, detay: 'Tarih-2(11), Coğrafya-2(11)' },
      { ders: 'Felsefe Grubu ve Din Kültürü', count: 18, detay: 'Felsefe(12), Din(6)' }
    ]
  },
  'AYT_EA': {
    label: 'AYT Eşit Ağırlık', sik: 5, sure: 180,
    bolumler: [
      { ders: 'Matematik', count: 40 },
      { ders: 'Türk Dili ve Edebiyatı', count: 24 },
      { ders: 'Tarih-1 ve Coğrafya-1', count: 16, detay: 'Tarih-1(10), Coğrafya-1(6)' }
    ]
  },
  'AYT_DIL': {
    label: 'AYT Yabancı Dil (YDT)', sik: 5, sure: 120,
    bolumler: [
      { ders: 'İngilizce (YDT)', count: 80, detay: 'Kelime, Dilbilgisi, Okuma Parçaları, Çeviri' }
    ]
  },
  'LGS': {
    label: 'LGS (Liselere Giriş Sınavı)', sik: 4, sure: 155,
    bolumler: [
      { ders: 'Türkçe', count: 20 },
      { ders: 'T.C. İnkılap', count: 10 },
      { ders: 'Din Kültürü', count: 10 },
      { ders: 'İngilizce', count: 10 },
      { ders: 'Matematik', count: 20 },
      { ders: 'Fen Bilimleri', count: 20 }
    ]
  },
  'KPSS_LISANS': {
    label: 'KPSS Lisans (GY/GK)', sik: 5, sure: 130,
    bolumler: [
      { ders: 'Türkçe', count: 30 },
      { ders: 'Matematik & Geometri', count: 30 },
      { ders: 'Tarih', count: 27 },
      { ders: 'Coğrafya', count: 18 },
      { ders: 'Vatandaşlık & Anayasa', count: 9 },
      { ders: 'Güncel Bilgiler', count: 6 }
    ]
  },
  'KPSS_ONLISANS': {
    label: 'KPSS Önlisans (GY/GK)', sik: 5, sure: 130,
    bolumler: [
      { ders: 'Türkçe', count: 30 },
      { ders: 'Matematik', count: 30 },
      { ders: 'Tarih', count: 27 },
      { ders: 'Coğrafya', count: 18 },
      { ders: 'Vatandaşlık', count: 9 },
      { ders: 'Güncel Bilgiler', count: 6 }
    ]
  },
  'KPSS_ORTAOGRETIM': {
    label: 'KPSS Ortaöğretim / Lise (GY/GK)', sik: 5, sure: 130,
    bolumler: [
      { ders: 'Türkçe', count: 30 },
      { ders: 'Matematik', count: 30 },
      { ders: 'Tarih', count: 27 },
      { ders: 'Coğrafya', count: 18 },
      { ders: 'Vatandaşlık', count: 9 },
      { ders: 'Güncel Bilgiler', count: 6 }
    ]
  },
  'ALES': {
    label: 'ALES (Akademik Personel Sınavı)', sik: 5, sure: 150,
    bolumler: [
      { ders: 'Sözel', count: 50 },
      { ders: 'Sayısal', count: 50 }
    ]
  },
  'DGS': {
    label: 'DGS (Dikey Geçiş Sınavı)', sik: 5, sure: 135,
    bolumler: [
      { ders: 'Sözel', count: 50 },
      { ders: 'Sayısal', count: 50 }
    ]
  },
  'GRADE_5': {
    label: '5. Sınıf ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 4, sure: 60,
    bolumler: [
      { ders: 'Türkçe (Maarif)', count: 15 },
      { ders: 'Matematik (Maarif)', count: 15 },
      { ders: 'Fen Bilimleri (Maarif)', count: 15 },
      { ders: 'Sosyal Bilgiler (Maarif)', count: 15 }
    ]
  },
  'GRADE_6': {
    label: '6. Sınıf ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 4, sure: 60,
    bolumler: [
      { ders: 'Türkçe (Maarif)', count: 15 },
      { ders: 'Matematik (Maarif)', count: 15 },
      { ders: 'Fen Bilimleri (Maarif)', count: 15 },
      { ders: 'Sosyal Bilgiler (Maarif)', count: 15 }
    ]
  },
  'GRADE_7': {
    label: '7. Sınıf ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 4, sure: 60,
    bolumler: [
      { ders: 'Türkçe (Maarif)', count: 15 },
      { ders: 'Matematik (Maarif)', count: 15 },
      { ders: 'Fen Bilimleri (Maarif)', count: 15 },
      { ders: 'Sosyal Bilgiler (Maarif)', count: 15 }
    ]
  },
  'GRADE_8': {
    label: '8. Sınıf 📘 (Klasik MEB / LGS Müfredatı)', sik: 4, sure: 75,
    bolumler: [
      { ders: 'Türkçe', count: 20 },
      { ders: 'Matematik', count: 20 },
      { ders: 'Fen Bilimleri', count: 20 },
      { ders: 'T.C. İnkılap Tarihi', count: 10 }
    ]
  },
  'GRADE_HAZIRLIK': {
    label: 'Lise Hazırlık ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 4, sure: 60,
    bolumler: [
      { ders: 'İngilizce (Maarif)', count: 25 },
      { ders: 'Türk Dili ve Edebiyatı (Maarif)', count: 15 },
      { ders: 'Matematik (Maarif)', count: 15 }
    ]
  },
  'GRADE_9': {
    label: '9. Sınıf ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 4, sure: 90,
    bolumler: [
      { ders: 'Türk Dili ve Edebiyatı (Maarif)', count: 20 },
      { ders: 'Matematik (Maarif)', count: 20 },
      { ders: 'Fizik (Maarif)', count: 10 },
      { ders: 'Kimya (Maarif)', count: 10 },
      { ders: 'Biyoloji (Maarif)', count: 10 },
      { ders: 'Tarih (Maarif)', count: 10 },
      { ders: 'Coğrafya (Maarif)', count: 10 }
    ]
  },
  'GRADE_10': {
    label: '10. Sınıf ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 4, sure: 90,
    bolumler: [
      { ders: 'Türk Dili ve Edebiyatı (Maarif)', count: 20 },
      { ders: 'Matematik (Maarif)', count: 20 },
      { ders: 'Fizik (Maarif)', count: 10 },
      { ders: 'Kimya (Maarif)', count: 10 },
      { ders: 'Biyoloji (Maarif)', count: 10 },
      { ders: 'Tarih (Maarif)', count: 10 },
      { ders: 'Coğrafya (Maarif)', count: 10 },
      { ders: 'Felsefe (Maarif)', count: 10 }
    ]
  },
  'GRADE_11': {
    label: '11. Sınıf ✨ (Türkiye Yüzyılı Maarif Modeli)', sik: 5, sure: 100,
    bolumler: [
      { ders: 'Türk Dili ve Edebiyatı (Maarif)', count: 20 },
      { ders: 'Matematik (Maarif)', count: 20 },
      { ders: 'Fizik (Maarif)', count: 10 },
      { ders: 'Kimya (Maarif)', count: 10 },
      { ders: 'Biyoloji (Maarif)', count: 10 },
      { ders: 'Tarih (Maarif)', count: 10 },
      { ders: 'Coğrafya (Maarif)', count: 10 },
      { ders: 'Felsefe (Maarif)', count: 10 }
    ]
  },
  'GRADE_12': {
    label: '12. Sınıf 🎓 (Klasik ÖSYM / YKS Müfredatı)', sik: 5, sure: 120,
    bolumler: [
      { ders: 'Matematik (YKS)', count: 30 },
      { ders: 'Türk Dili ve Edebiyatı (YKS)', count: 24 },
      { ders: 'Fizik (YKS)', count: 13 },
      { ders: 'Kimya (YKS)', count: 13 },
      { ders: 'Biyoloji (YKS)', count: 13 },
      { ders: 'Tarih (YKS)', count: 10 },
      { ders: 'Coğrafya (YKS)', count: 10 }
    ]
  }
};

// ─── ZORLUK REHBERİ (Prompt için) ───
const DIFF_GUIDE = {
  'Kolay': {
    hint: 'Kolay: tanım/formülün doğrudan uygulandığı, tek adımlı, kısa sorular.',
    rule: `- Soru TEK bir kazanımı test etmeli ve TEK işlem/adımda çözülmeli.`
  },
  'Orta': {
    hint: 'Orta: iki kavramın birleştiği, kısa senaryolu, tek adımda çözülemeyen sorular.',
    rule: `- Soru EN AZ İKİ farklı kazanımı veya iki işlemi art arda birleştirmeli.`
  },
  'Zor': {
    hint: 'Zor: en az 3 adımlı çözüm gerektiren, birden fazla kazanımı bir arada kullanan sorular.',
    rule: `- Soru EN AZ ÜÇ ayrı adım/çıkarım gerektirmeli.`
  },
  'Yeni Nesil': {
    hint: 'Yeni Nesil: ÖSYM ve Türkiye Yüzyılı Maarif Modeli formatında zengin senaryolu soru.',
    rule: `- Soru, ÖSYM ve Türkiye Yüzyılı Maarif Modeli formatına uygun olarak günlük hayat senaryosu içermeli.`
  }
};

// ─── DERS HARİTASI (sınava göre) ───
const DERS_MAP = {
  'TYT': [
    { group: 'Türkçe', items: ['Türkçe'] },
    { group: 'Matematik', items: ['Temel Matematik'] },
    { group: 'Sosyal', items: ['Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü'] },
    { group: 'Fen', items: ['Fizik', 'Kimya', 'Biyoloji'] },
  ],
  'AYT_SAY': [
    { group: 'Sayısal', items: ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji'] }
  ],
  'AYT_SOZ': [
    { group: 'Sözel', items: ['Türk Dili ve Edebiyatı', 'Tarih-1', 'Coğrafya-1', 'Tarih-2', 'Coğrafya-2', 'Felsefe Grubu', 'Din Kültürü'] }
  ],
  'AYT_EA': [
    { group: 'Eşit Ağırlık', items: ['Matematik', 'Geometri', 'Türk Dili ve Edebiyatı', 'Tarih-1', 'Coğrafya-1'] }
  ],
  'AYT_DIL': [
    { group: 'Yabancı Dil', items: ['İngilizce (YDT)', 'Grammar & Vocabulary', 'Reading Comprehension', 'Translation'] }
  ],
  'LGS': [
    { group: 'Sözel', items: ['Türkçe', 'T.C. İnkılap Tarihi', 'Din Kültürü', 'İngilizce'] },
    { group: 'Sayısal', items: ['Matematik', 'Fen Bilimleri'] },
  ],
  'KPSS_LISANS': [
    { group: 'Genel Yetenek', items: ['Türkçe', 'Matematik & Geometri', 'Sözel Mantık', 'Sayısal Mantık'] },
    { group: 'Genel Kültür', items: ['Tarih', 'Coğrafya', 'Vatandaşlık & Anayasa', 'Güncel Bilgiler'] }
  ],
  'KPSS_ONLISANS': [
    { group: 'Genel Yetenek', items: ['Türkçe', 'Matematik'] },
    { group: 'Genel Kültür', items: ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Güncel Bilgiler'] }
  ],
  'KPSS_ORTAOGRETIM': [
    { group: 'Genel Yetenek', items: ['Türkçe', 'Matematik'] },
    { group: 'Genel Kültür', items: ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Güncel Bilgiler'] }
  ],
  'GRADE_5': [
    { group: 'Maarif 5', items: ['Türkçe (Maarif)', 'Matematik (Maarif)', 'Fen Bilimleri (Maarif)', 'Sosyal Bilgiler (Maarif)'] }
  ],
  'GRADE_6': [
    { group: 'Maarif 6', items: ['Türkçe (Maarif)', 'Matematik (Maarif)', 'Fen Bilimleri (Maarif)', 'Sosyal Bilgiler (Maarif)'] }
  ],
  'GRADE_7': [
    { group: 'Maarif 7', items: ['Türkçe (Maarif)', 'Matematik (Maarif)', 'Fen Bilimleri (Maarif)', 'Sosyal Bilgiler (Maarif)'] }
  ],
  'GRADE_8': [
    { group: 'Klasik LGS 8', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'T.C. İnkılap Tarihi'] }
  ],
  'GRADE_HAZIRLIK': [
    { group: 'Maarif Hazırlık', items: ['İngilizce (Maarif)', 'Türk Dili ve Edebiyatı (Maarif)', 'Matematik (Maarif)'] }
  ],
  'GRADE_9': [
    { group: 'Maarif 9', items: ['Türk Dili ve Edebiyatı (Maarif)', 'Matematik (Maarif)', 'Fizik (Maarif)', 'Kimya (Maarif)', 'Biyoloji (Maarif)', 'Tarih (Maarif)', 'Coğrafya (Maarif)'] }
  ],
  'GRADE_10': [
    { group: 'Maarif 10', items: ['Türk Dili ve Edebiyatı (Maarif)', 'Matematik (Maarif)', 'Fizik (Maarif)', 'Kimya (Maarif)', 'Biyoloji (Maarif)', 'Tarih (Maarif)', 'Coğrafya (Maarif)', 'Felsefe (Maarif)'] }
  ],
  'GRADE_11': [
    { group: 'Maarif 11', items: ['Türk Dili ve Edebiyatı (Maarif)', 'Matematik (Maarif)', 'Fizik (Maarif)', 'Kimya (Maarif)', 'Biyoloji (Maarif)', 'Tarih (Maarif)', 'Coğrafya (Maarif)', 'Felsefe (Maarif)'] }
  ],
  'GRADE_12': [
    { group: 'Klasik YKS 12', items: ['Matematik (YKS)', 'Türk Dili ve Edebiyatı (YKS)', 'Fizik (YKS)', 'Kimya (YKS)', 'Biyoloji (YKS)', 'Tarih (YKS)', 'Coğrafya (YKS)'] }
  ]
};

// ─── KAZANIM HARİTASI (ders → konular) ───
const KAZANIM_MAP = {
  'Türkçe': ['Paragrafta Ana Düşünce','Paragrafta Yardımcı Düşünce','Sözcükte Anlam','Cümlede Anlam','Deyim ve Atasözleri','Metin Türleri','Noktalama İşaretleri','Yazım Kuralları','Sözcük Türleri','Sözel Mantık'],
  'Matematik': ['Sayı Kümeleri','Bölünebilme ve EBOB-EKOK','Oran-Orantı','Denklem ve Eşitsizlikler','Üslü-Köklü İfadeler','Problemler (Yaş, İşçi, Yüzde, Kar-Zarar)','Fonksiyonlar','Polinomlar','Trigonometri','Limit','Türev','İntegral','Olasılık','Sayısal Mantık'],
  'Geometri': ['Üçgenler','Çokgenler ve Dörtgenler','Çember ve Daire','Analitik Geometri','Çemberin Analitiği','Katı Cisimler (Prizma, Piramit, Küre)'],
  'Fizik': ['Vektörler','Newton\'ın Hareket Yasaları','Sabit İvmeli Hareket','İş, Güç ve Enerji','İtme ve Momentum','Tork ve Denge','Elektrik ve Manyetizma','Alternatif Akım','Basit Harmonik Hareket','Dalga Mekaniği','Modern Fizik'],
  'Kimya': ['Modern Atom Teorisi','Gazlar','Sıvı Çözeltiler','Kimyasal Tepkimelerde Enerji ve Hız','Kimyasal Denge','Asit-Baz Dengesi','Elektrokimya','Organik Kimya'],
  'Biyoloji': ['Hücre ve Bölünmeler','Kalıtım','İnsan Fizyolojisi (Sistemler)','Komünite ve Popülasyon Ekolojisi','Nükleik Asitler ve Protein Sentezi','Fotosentez ve Solunum','Bitki Biyolojisi'],
  'Tarih': ['İslamiyet Öncesi Türk Tarihi','Osmanlı Siyasi ve Sosyal Yapı','Milli Mücadele ve İnkılap Tarihi','Atatürkçülük','Çağdaş Türk ve Dünya Tarihi'],
  'Coğrafya': ['Türkiye\'nin Coğrafi Konumu ve İklimi','Nüfus ve Yerleşme','Ekonomik Coğrafya','Bölgesel Kalkınma Projeleri','Çevre ve Küresel İklim'],
  'Vatandaşlık & Anayasa': ['Anayasa Hukuku','1982 Anayasası','Temel Hak ve Ödevler','Yasama, Yürütme, Yargı','İdare Hukuku'],
  'Türk Dili ve Edebiyatı': ['Şiir Bilgisi ve Edebi Akımlar','Divan Edebiyatı','Halk Edebiyatı','Tanzimat ve Servet-i Fünun','Milli Edebiyat','Cumhuriyet Dönemi Edebiyatı'],
  'İngilizce (YDT)': ['Vocabulary & Phrasal Verbs','Grammar & Tenses','Reading Comprehension','Translation','Dialogue Completion']
};

// Dersler bu kategoriye giriyorsa görsel/grafik/şekil üretimi teşvik edilir
const VISUAL_FRIENDLY_DERSLER = new Set([
  'Matematik','Temel Matematik','Geometri','Fizik','Kimya','Biyoloji','Fen Bilimleri',
  'Coğrafya','Sayısal Yetenek','Sözel','Sayısal'
]);

// ─── STATE ───
const state = {
  exam: 'TYT',
  diff: 'Yeni Nesil',
  opts: '4',
  count: 3,
  visualType: 'auto',
  kazanimlar: [],
  questions: [],
  saved: JSON.parse(localStorage.getItem('soruai_saved') || '[]'),
  referenceImages: [], // Multimodal referans resimleri
  mode: 'manual',
  charts: [],
  activeModelObj: JSON.parse(localStorage.getItem('soruai_active_model') || 'null')
};

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Hatalı önbellekleri temizle
  const activeOmni = localStorage.getItem('soruai_active_omni_model');
  if (activeOmni && (activeOmni.includes('minimax') || activeOmni.includes('claude-fable'))) {
    localStorage.removeItem('soruai_active_omni_model');
  }

  const savedKey = localStorage.getItem('soruai_key');
  if (savedKey) {
    const apiKeyEl = document.getElementById('apiKey');
    if (apiKeyEl) apiKeyEl.value = savedKey;
    const settingsKey = document.getElementById('apiKeySettings');
    if (settingsKey) settingsKey.value = savedKey;
  }

  const savedOmniUrl = localStorage.getItem('soruai_omniroute_base_url');
  if (savedOmniUrl) {
    const omniUrlEl = document.getElementById('omnirouteUrl');
    if (omniUrlEl) omniUrlEl.value = savedOmniUrl;
  }

  const referenceFilesInput = document.getElementById('referenceFiles');
  if (referenceFilesInput) {
    referenceFilesInput.addEventListener('change', async (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;
      const extracted = await processReferenceFiles(files);
      if (extracted) {
        showToast('✅ Referans dosyalar işlenip prompta eklendi');
      }
    });
  }

  renderSaved();
  updateDiffHint();
});

// ─── NAVIGATION ───
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

// ─── CHIP SELECTION ───
function selectChip(el, group) {
  const grids = { exam: 'examChips', diff: 'diffChips', opts: null };
  if (group === 'opts') {
    el.closest('.chip-grid').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  } else {
    const gridEl = document.getElementById(grids[group]);
    if (gridEl) gridEl.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  }
  el.classList.add('active');
  state[group] = el.dataset.value;
  if (group === 'diff') updateDiffHint();
}

function updateDiffHint() {
  const hintEl = document.getElementById('diffHint');
  const guide = DIFF_GUIDE[state.diff];
  if (hintEl && guide) hintEl.textContent = guide.hint;
}

function onExamSelectChange(val) {
  if (val) {
    state.exam = val;
    updateDiffHint();
  }
}

// ─── KEY SAVE ───
function saveKey() {
  const key = document.getElementById('apiKey').value.trim();
  if (key) {
    localStorage.setItem('soruai_key', key);
    showToast('✅ API anahtarı kaydedildi');
  }
}

function saveKeyFromSettings() {
  const key = document.getElementById('apiKeySettings').value.trim();
  if (key) {
    localStorage.setItem('soruai_key', key);
    const mainKeyInp = document.getElementById('apiKey');
    if (mainKeyInp) mainKeyInp.value = key;
    showToast('✅ API anahtarı kaydedildi');
  }
}

function togglePass(id) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

// ─── DENEME ÜRETİMİ ───
async function generateDeneme() {
  const selectedExam = document.getElementById('examSelect')?.value || state.exam;
  state.exam = selectedExam;

  const apiKeyEl = document.getElementById('apiKey');
  const apiKey = (apiKeyEl ? apiKeyEl.value.trim() : '') || localStorage.getItem('soruai_key');
  if (!apiKey) { showToast('⚠️ Lütfen Gemini API anahtarını girin', 'warn'); return; }

  const config = SINAV_CONFIG[state.exam];
  if (!config) { showToast('⚠️ Sınav konfigürasyonu bulunamadı', 'error'); return; }

  const gorselEl = document.getElementById('gorselToggle');
  const gorsel = gorselEl ? gorselEl.checked : false;
  
  const visualTypeEl = document.getElementById('visualType');
  const visualType = (visualTypeEl ? visualTypeEl.value : '') || state.visualType || 'auto';
  
  const optCount = state.opts;
  
  const referenceTextEl = document.getElementById('referenceText');
  const referenceText = referenceTextEl ? referenceTextEl.value.trim() : '';

  state.questions = [];
  destroyAllCharts();
  setLoading(true, `${config.label} hazırlanıyor...`);

  try {
    for (const [index, bolum] of config.bolumler.entries()) {
      const totalQuestionsNeeded = bolum.count;
      const batchSize = 20;
      let questionsGeneratedForBolum = 0;
      let bolumQuestions = [];
      let attempts = 0;

      while (questionsGeneratedForBolum < totalQuestionsNeeded && attempts < 5) {
        const currentBatchSize = Math.min(batchSize, totalQuestionsNeeded - questionsGeneratedForBolum);
        const stepMsg = `[${index + 1}/${config.bolumler.length}] ${bolum.ders} üretiliyor (Soru ${questionsGeneratedForBolum + 1}-${questionsGeneratedForBolum + currentBatchSize} / ${totalQuestionsNeeded})...`;
        setLoadingStep(stepMsg);

        const prompt = buildExamPrompt(state.exam, bolum.ders, currentBatchSize, optCount, state.diff, gorsel, visualType, questionsGeneratedForBolum, referenceText);

        if (questionsGeneratedForBolum > 0 || index > 0) {
          await sleep(2000);
        }

        const raw = await callAI(apiKey, prompt, state.referenceImages);
        const batchQuestions = parseQuestions(raw);

        if (batchQuestions.length === 0) {
          attempts++;
          showToast(`⚠️ Bölümün bir parçası alınamadı, tekrar deneniyor (${attempts}/5)...`, 'warn');
          continue;
        }

        batchQuestions.forEach((q, idx) => {
          q.id = Date.now() + '_' + index + '_' + questionsGeneratedForBolum + '_' + idx;
          q.bolumName = bolum.ders;
          q.examType = state.exam;
          bolumQuestions.push(q);
        });

        questionsGeneratedForBolum += batchQuestions.length;
      }

      if (bolumQuestions.length === 0) {
        throw new Error(`${bolum.ders} bölümü üretilemedi (JSON okunamadı veya API yanıt vermedi).`);
      }

      state.questions = [...state.questions, ...bolumQuestions];
      showToast(`✅ ${bolum.ders} tamamlandı (${bolumQuestions.length} soru)`);
    }

    setLoadingStep('Deneme sınavı kitapçığı oluşturuluyor...');
    renderExamQuestions(state.questions);
    setLoading(false);
    showToast(`🎉 ${config.label} Hazır! (${state.questions.length} Soru)`);

  } catch (err) {
    console.error('Kritik Hata:', err);
    setLoading(false);
    showError(err.message);
    showToast(`❌ Hata: ${err.message}`, 'error');
  }
}

// ─── PROMPT BUILDER (Deneme Özel) ───
function buildExamPrompt(exam, ders, count, optCount, zorluk, gorsel, visualType = 'auto', startIndex = 0, referenceText = '') {
  const optLabels = optCount === '5' ? 'A, B, C, D, E' : 'A, B, C, D';
  const diffGuide = DIFF_GUIDE[zorluk] || DIFF_GUIDE['Yeni Nesil'];
  const tarz = zorluk === 'Yeni Nesil' || zorluk === 'ÖSYM Tarzı' ? 'Yeni Nesil Beceri Temelli (Üst Düzey Analiz)' : `${zorluk} Seviye (Çok Adımlı & Senaryolu)`;

  const optionsTemplate = optCount === '5'
    ? `{ "A": "A seçeneği metni", "B": "B seçeneği metni", "C": "C seçeneği metni", "D": "D seçeneği metni", "E": "E seçeneği metni" }`
    : `{ "A": "A seçeneği metni", "B": "B seçeneği metni", "C": "C seçeneği metni", "D": "D seçeneği metni" }`;

  const topics = KAZANIM_MAP[ders] || [];
  const selectedTopics = [];
  if (topics.length > 0) {
    const shuffled = [...topics].sort(() => 0.5 - Math.random());
    selectedTopics.push(...shuffled.slice(0, Math.min(5, shuffled.length)));
  }
  const topicHint = selectedTopics.length > 0 ? `Sorular şu kazanımları kapsayacak şekilde derinlemesine kurgulanmalıdır: ${selectedTopics.join(', ')}` : '';

  const allowedVisuals = gorsel
    ? (visualType === 'auto' ? '"bar_chart", "line_chart", "pie_chart", "geometry", "table", "image"' : `"${visualType}"`)
    : '"none"';

  const visualInstructions = gorsel
    ? `ZORUNLU GÖRSEL / ŞEKİL KURALI:
Ürettiğin HER SORU için mutlaka visual_type alanını [${allowedVisuals}] listesinden o derse en uygun olanı seçerek doldurmalısın. "none" değerini KULLANMA. Her sorunun mutlaka bir görseli, grafiği, şeması veya tablosu olmalıdır.

1. Matematik, Geometri, Fizik ve Fen sorularında geometrik şekil, açı veya koordinat sistemi çizimi gerekiyorsa visual_type: "geometry" seç. visual_data içeriğini şu EXACT formatta doldur:
{
  "shape": "triangle" | "circle" | "rectangle" | "cylinder" | "coordinate" | "angle",
  "title": "Şekil / Model Başlığı",
  "caption": "Şekil altı açıklaması",
  "description": "Şekil detaylı metin açıklaması",
  "points": [{"id":"A","x":0,"y":0,"label":"A"}, {"id":"B","x":4,"y":0,"label":"B"}, {"id":"C","x":0,"y":3,"label":"C"}],
  "segments": [["A","B"], ["B","C"], ["C","A"]],
  "measurements": [{"type":"length","from":"A","to":"B","value":"4 cm"}, {"type":"angle","at":"A","value":"90°"}],
  "circle": {"centerId":"A","radius":2}
}

2. Fen Bilimleri, Biyoloji, Kimya, Fizik, Coğrafya, Tarih, Türkçe veya İngilizce gibi derslerde deney düzeneği, organ şeması, harita veya olay illüstrasyonu için visual_type: "image" seç:
{
  "title": "Görsel Başlığı",
  "caption": "Görsel açıklaması",
  "prompt": "Detailed black and white vector line art textbook illustration describing the setup, clean background, educational diagram style."
}

3. Veri analizi, istatistik, karşılaştırma, sıcaklık, nüfus vb. sorularda visual_type: "bar_chart", "line_chart", "pie_chart" veya "table" seç ve labels, datasets, headers, rows verilerini eksiksiz doldur.`
    : `visual_type: "none" olarak kalabilir.`;

  const referenceInstruction = referenceText
    ? `Referans metin/soru örnekleri: ${referenceText.slice(0, 4000)}. Bu örneklerin stilini ve zorluk seviyesini temel alarak yeni ve özgün sorular üret.`
    : '';

  return `Sen Madlen Akademi ve ÖSYM / MEB Soru Hazırlama Komisyonu Başkanısın.
Görev: ${exam} sınavı ${ders} bölümü için ${count} adet %100 MADLEN METODOLOJİSİNE UYGUN, YENİ NESİL, BECERİ TEMELLİ ve ÇOK ADIMLI soru hazırlamak.
Sorular, sınavın ${startIndex + 1}. sorusundan ${startIndex + count}. sorusuna kadar olan kısmı temsil edecektir.

🎯 MADLEN AKADEMİ VE ÖSYM PEDAGOJİK SORU STANDARTLARI:
1. GERÇEK YAŞAM VE SENARYO BAĞLAMI:
   - KESİNLİKLE TEK CÜMLELİK DÜZ EZBER SORU YAZMA!
   - Her soru mutlaka gerçek yaşam problemi, bilimsel bir deney düzeneği, veri tablosu veya grafik analiz senaryosu üzerine kurulmalıdır.
   - Soru yapısı: [1. Giriş Senaryosu / Hikaye] -> [2. Verilen Veriler / Önermeler] -> [3. Analitik Soru Kökü ("Buna göre...", "Buna bağlı olarak...")]

2. ÇOK ADIMLI AKIL YÜRÜTME (BLOOM TAXONOMY - ANALİZ VE SENTEZ):
   - Soru, öğrencinin verileri okuyup EN AZ 2-3 ADIMLI analitik çıkarım veya hesaplama yapmasını zorunlu kılmalıdır.
   - 1. Adım: Veri veya görseldeki bağıntıyı tespit etme.
   - 2. Adım: Mantıksal çıkarım / matematiksel bağıntıyı kurma.
   - 3. Adım: Seçeneklerdeki önermeleri değerlendirme.

3. KAVRAM YANILGISI VE ÇELDİRİCİ MİMARİSİ (MISCONCEPTIONS):
   - Yanlış şıkların her biri (A, B, C, D, E), öğrencilerin yapabileceği yaygın işlem, birim çevirme veya mantık hatalarına göre kurgulanmalıdır.

4. GÖRSEL VE VERİ BÜTÜNLÜĞÜ:
   - Görsel veya grafik soruyla %100 entegre olmalıdır. Soru visual_data olmadan çözülememelidir.
   - ${visualInstructions}

STANDARTLAR:
- Sınav: ${exam} | Bölüm: ${ders} | Zorluk: ${tarz} (Madlen Üst Seviye)
- Seçenek Sayısı: ${optLabels}
- Konu/Kazanım: ${topicHint}
- ${referenceInstruction}

${diffGuide.rule}

ZORUNLU JSON ŞEMASI:
{
  "questions": [
    {
      "id": 1,
      "kazanim": "Müfredat kazanımı (Örn: Hücre zarından madde geçişleri ve osmotik basınç analizi)",
      "visual_type": "geometry | bar_chart | line_chart | pie_chart | table | image",
      "visual_data": {},
      "text": "Senaryo metni... (Giriş bağlamı, verilen veriler ve 'Buna göre...' ile biten soru kökü)",
      "options": ${optionsTemplate},
      "answer": "${optCount === '5' ? 'E' : 'D'}",
      "solution": "1. Adım: ..., 2. Adım: ..., 3. Adım: ... şeklinde detaylı Madlen pedagojik çözümü.",
      "misconceptions": {
        "A": "A şıkkı, osmotik basınç ile turgor basıncını karıştıran öğrencinin düştüğü tuzaktır.",
        "B": "B şıkkı, grafikteki zaman ekseninin ters okunması sonucu elde edilen çeldiricidir."
      }
    }
  ]
}`;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ─── API MANAGEMENT & CALLS ───
async function getAvailableModels(apiKey) {
  for (const ver of ['v1', 'v1beta']) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${apiKey}`);
      if (!res.ok) continue;
      const data = await res.json();
      const list = data.models || [];
      if (list.length === 0) continue;
      
      const filtered = list
        .map(m => m.name.replace('models/', ''))
        .filter(name => name.includes('gemini'))
        .map(name => ({ name, ver }));
        
      if (filtered.length > 0) return filtered;
    } catch (e) {}
  }
  return GEMINI_MODELS;
}

async function callGemini(apiKey, prompt, referenceImages = []) {
  let modelsList = GEMINI_MODELS;
  try {
    modelsList = await getAvailableModels(apiKey);
  } catch (e) {}
  
  const modelsToTry = [];
  if (state.activeModelObj) {
    modelsToTry.push(state.activeModelObj);
  }
  for (const m of modelsList) {
    if (!state.activeModelObj || m.name !== state.activeModelObj.name || m.ver !== state.activeModelObj.ver) {
      modelsToTry.push(m);
    }
  }

  const errors = [];
  for (const modelObj of modelsToTry) {
    const model = modelObj.name;
    const ver = modelObj.ver;
    let attempts = 0;
    const maxAttempts = 3;
    let modelErr = null;
    
    while (attempts < maxAttempts) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ 
                parts: [
                  { text: prompt },
                  ...(referenceImages || []).map(img => ({
                    inlineData: {
                      mimeType: img.mimeType,
                      data: img.data
                    }
                  }))
                ] 
              }],
              generationConfig: { 
                temperature: 0.7, 
                max_output_tokens: 8192,
                response_mime_type: "application/json" 
              },
            }),
          }
        );
        
        if (res.status === 429) {
          attempts++;
          const waitTime = attempts * 3000;
          modelErr = new Error(`[${model} (${ver})] Hız sınırı aşıldı (429 Rate Limit)`);
          await sleep(waitTime);
          continue;
        }
        
        if (!res.ok) {
          const errJson = await res.json();
          const apiMsg = errJson.error?.message || `HTTP ${res.status}`;
          modelErr = new Error(`[${model} (${ver})] ${apiMsg}`);
          if (apiMsg.includes('API key not valid') || apiMsg.includes('invalid')) {
            throw modelErr; 
          }
          break;
        }
        
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          modelErr = new Error(`[${model} (${ver})] Boş yanıt döndü.`);
          break;
        }
        
        if (!state.activeModelObj || state.activeModelObj.name !== model || state.activeModelObj.ver !== ver) {
          state.activeModelObj = { name: model, ver: ver };
          localStorage.setItem('soruai_active_model', JSON.stringify(state.activeModelObj));
        }
        
        return text;
      } catch (e) {
        modelErr = e;
        break;
      }
    }
    if (modelErr) {
      errors.push(modelErr.message);
    }
  }
  throw new Error("Üretim Başarısız. Denenen modellerin hata raporu:\n" + errors.map((err, i) => `${i+1}. ${err}`).join('\n'));
}

async function callNvidiaApi(apiKey, prompt) {
  const errors = [];
  for (const model of NVIDIA_MODELS) {
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'Sen Türkiye sınav sistemi için ÖSYM formatında yeni nesil sorular üreten uzman bir yapay zekasın. Yanıtını SADECE geçerli bir JSON objesi olarak dön.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.6,
          top_p: 0.95,
          max_tokens: 8192,
          response_format: { type: "json_object" }
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson.detail || errJson.error?.message || `HTTP ${res.status}`;
        errors.push(`[NVIDIA ${model}] ${msg}`);
        continue;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return content;
      }
    } catch (e) {
      errors.push(`[NVIDIA ${model}] ${e.message}`);
    }
  }
  throw new Error("NVIDIA API Üretimi Başarısız:\n" + errors.join('\n'));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Bağlantı zaman aşımına uğradı (${timeoutMs / 1000}s - Sunucu yanıt vermedi)`);
    }
    throw err;
  }
}

async function getOmniRouteModels(apiKey, cleanBaseUrl) {
  let modelsUrl = cleanBaseUrl;
  if (modelsUrl.endsWith('/chat/completions')) {
    modelsUrl = modelsUrl.replace('/chat/completions', '/models');
  } else if (modelsUrl.endsWith('/v1')) {
    modelsUrl = `${modelsUrl}/models`;
  } else {
    modelsUrl = `${modelsUrl}/v1/models`;
  }

  try {
    const res = await fetchWithTimeout(modelsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }, 6000);

    if (res.ok) {
      const data = await res.json();
      const list = data.data || data.models || [];
      if (Array.isArray(list) && list.length > 0) {
        const names = list.map(m => typeof m === 'string' ? m : (m.id || m.name)).filter(Boolean);
        if (names.length > 0) return names;
      }
    }
  } catch (e) {
    console.warn("OmniRoute /v1/models okunamadı:", e);
    if (e.message.includes('Failed to fetch') || e.message.includes('zaman aşımına') || e.message.includes('NetworkError')) {
      throw new Error(`[OmniRoute Bağlantı Hatası] '${modelsUrl}' adresi yanıt vermiyor. Lütfen sunucu IP adresi ve portunun (http://3.84.244.225:20128) aktif olduğunu kontrol edin. (${e.message})`);
    }
  }
  return OMNIROUTE_MODELS;
}

function getBestModelsForTask(ders = '', providerPref = 'auto', availableModels = []) {
  const modelsSet = new Set(availableModels);
  const pickAvailable = (candidates) => {
    const valid = candidates.filter(m => modelsSet.size === 0 || modelsSet.has(m));
    return valid.length > 0 ? valid : candidates;
  };

  if (providerPref === 'deepseek') {
    return pickAvailable([
      'ds-web/DeepSeek-R1',
      'ds-web/deepseek-chat',
      'ds-web/deepseek-v4-pro',
      'tllm/openrouter_deepseek_r1',
      'deepseek-web/DeepSeek-R1',
      'nvidia/deepseek-ai/deepseek-v4-pro'
    ]);
  }

  if (providerPref === 'claude') {
    return pickAvailable([
      'antigravity/claude-sonnet-5',
      'antigravity/claude-sonnet-4-6',
      'aug/claude-sonnet-4.6',
      'tllm/CLAUDE_4_6_SONNET',
      'no-think/antigravity/claude-sonnet-5'
    ]);
  }

  if (providerPref === 'openai') {
    return pickAvailable([
      'tllm/openrouter_gpt_4_o',
      'ddgw/gpt-4o-mini',
      'tllm/GPT_4o',
      'tllm/GPT_5'
    ]);
  }

  if (providerPref === 'gemini') {
    return pickAvailable([
      'gemini/gemini-2.5-flash',
      'antigravity/gemini-2.5-flash',
      'antigravity/gemini-3.5-flash-medium',
      'gweb/gemini-3.5-flash'
    ]);
  }

  // DERS & AKIL YÜRÜTME ODAKLI DİNAMİK MODEL SEÇİMİ
  const isReasoningHeavy = ['Matematik', 'Temel Matematik', 'Geometri', 'Fizik', 'Sayısal', 'Sayısal Yetenek'].some(d => ders.includes(d));
  const isTextHeavy = ['Türkçe', 'Sözel', 'Sözel Yetenek', 'Paragraf', 'Türk Dili ve Edebiyatı'].some(d => ders.includes(d));

  if (isReasoningHeavy) {
    return pickAvailable([
      'ds-web/DeepSeek-R1',
      'auto/best-reasoning',
      'antigravity/claude-opus-4-6-thinking',
      'tllm/openrouter_deepseek_r1',
      'antigravity/gemini-2.5-flash',
      'gemini/gemini-2.5-flash',
      'auto/best-chat',
      'auto'
    ]);
  }

  if (isTextHeavy) {
    return pickAvailable([
      'antigravity/claude-sonnet-5',
      'ds-web/deepseek-chat',
      'tllm/openrouter_gpt_4_o',
      'gemini/gemini-2.5-flash',
      'antigravity/gemini-2.5-flash',
      'auto/best-chat',
      'auto'
    ]);
  }

  // Genel Sınav Bölümleri (Sosyal, Tarih, Coğrafya, Fen, Din vb.)
  return pickAvailable([
    'gemini/gemini-2.5-flash',
    'antigravity/gemini-2.5-flash',
    'auto/best-chat',
    'ds-web/deepseek-chat',
    'ddgw/gpt-4o-mini',
    'antigravity/claude-sonnet-5',
    'auto/best-fast',
    'auto'
  ]);
}

function parseOmniResponse(rawText) {
  if (!rawText || !rawText.trim()) return null;
  const str = rawText.trim();

  // 1. Standart JSON denemesi
  try {
    const data = JSON.parse(str);
    const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || data.response || data.content;
    if (content) return content;
  } catch (e) {}

  // 2. SSE / Stream (data: {"id": ...} veya : x-omniroute...) akışlarını ayrıştırma
  const lines = str.split('\n');
  let accumulatedContent = '';
  let fullMessageContent = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data: ')) {
      const dataStr = trimmed.slice(6).trim();
      if (dataStr === '[DONE]') continue;
      try {
        const parsed = JSON.parse(dataStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        const msg = parsed.choices?.[0]?.message?.content;
        if (msg) fullMessageContent = msg;
        if (delta) accumulatedContent += delta;
      } catch (e) {}
    }
  }

  if (fullMessageContent) return fullMessageContent;
  if (accumulatedContent) return accumulatedContent;

  // 3. Regex ile JSON Objesini Çıkarma Fallback
  const jsonMatch = str.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.choices?.[0]?.message?.content) return parsed.choices[0].message.content;
      if (parsed.sinavAdi || parsed.sorular) return jsonMatch[0];
    } catch (e) {}
  }

  return null;
}

async function callOmniRouteApi(apiKey, prompt, ders = '') {
  const customUrl = localStorage.getItem('soruai_omniroute_base_url') || 'http://3.84.244.225:20128/v1';
  let cleanBaseUrl = customUrl.trim().replace(/\/+$/, '');
  const chatEndpoint = cleanBaseUrl.endsWith('/chat/completions')
    ? cleanBaseUrl
    : (cleanBaseUrl.endsWith('/v1') ? `${cleanBaseUrl}/chat/completions` : `${cleanBaseUrl}/v1/chat/completions`);

  const fetchedModels = await getOmniRouteModels(apiKey, cleanBaseUrl);
  const providerPref = document.getElementById('modelPreference')?.value || 'auto';
  const priorityModels = getBestModelsForTask(ders, providerPref, fetchedModels);

  const cachedModel = localStorage.getItem('soruai_active_omni_model');
  let modelsToTry = [];
  if (providerPref === 'auto' && cachedModel && !cachedModel.includes('minimax') && !cachedModel.includes('claude-fable')) {
    modelsToTry.push(cachedModel);
  }
  for (const pm of priorityModels) {
    if (!modelsToTry.includes(pm)) modelsToTry.push(pm);
  }
  for (const fm of fetchedModels) {
    if (!modelsToTry.includes(fm) && !fm.includes('minimax') && !fm.includes('claude-fable')) {
      modelsToTry.push(fm);
    }
  }

  const timeoutDuration = 60000;
  const errors = [];
  for (const model of modelsToTry) {
    try {
      const res = await fetchWithTimeout(chatEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'SoruAI'
        },
        body: JSON.stringify({
          model: model,
          stream: false,
          messages: [
            { role: 'system', content: 'Sen Türkiye sınav sistemi için ÖSYM formatında yeni nesil sorular üreten uzman bir yapay zekasın. Yanıtını SADECE geçerli bir JSON objesi olarak dön.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.6,
          max_tokens: 8192,
          response_format: { type: "json_object" }
        })
      }, timeoutDuration);

      const rawText = await res.text().catch(() => '');

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const errJson = JSON.parse(rawText);
          msg = errJson.detail || errJson.error?.message || msg;
        } catch (e) {
          if (rawText) msg = rawText.slice(0, 120);
        }
        errors.push(`[${model}] ${msg}`);
        if (cachedModel && cachedModel === model) {
          localStorage.removeItem('soruai_active_omni_model');
        }
        continue;
      }

      const content = parseOmniResponse(rawText);
      if (content) {
        localStorage.setItem('soruai_active_omni_model', model);
        showToast(`🤖 [${model}] AI modeli ile soru başarıyla üretildi!`, 'info');
        return content;
      } else {
        errors.push(`[${model}] Yanıt akışı okunamadı veya boş döndü`);
      }
    } catch (e) {
      console.warn(`[${model}] denemesi başarısız:`, e.message);
      errors.push(`[${model}] ${e.message}`);
      if (cachedModel && cachedModel === model) {
        localStorage.removeItem('soruai_active_omni_model');
      }
      if (e.message.includes('Failed to fetch') && !e.message.includes('zaman aşımına')) {
        throw new Error(`[OmniRoute Bağlantı Hatası] Sunucuya erişilemedi (${cleanBaseUrl}). Lütfen IP adresi ve portunu kontrol edin.`);
      }
    }
  }

  throw new Error("OmniRoute API Üretimi Başarısız:\n" + errors.join('\n'));
}

async function callAI(apiKey, prompt, referenceImages = [], ders = '') {
  if (apiKey.startsWith('AIzaSy')) {
    return await callGemini(apiKey, prompt, referenceImages);
  } else if (apiKey.startsWith('nvapi-')) {
    return await callNvidiaApi(apiKey, prompt);
  } else {
    try {
      return await callOmniRouteApi(apiKey, prompt, ders);
    } catch (e) {
      if (!apiKey.startsWith('sk-') && !apiKey.startsWith('omni-') && !apiKey.startsWith('or-')) {
        return await callGemini(apiKey, prompt, referenceImages);
      }
      throw e;
    }
  }
}


async function quickTestApiConnection(apiKey) {
  if (apiKey.startsWith('AIzaSy')) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetchWithTimeout(url, {}, 8000);
    if (!res.ok) throw new Error(`Gemini API Yanıt Vermedi (HTTP ${res.status})`);
    return "Google Gemini API Bağlantısı Başarılı (OK)";
  }

  if (apiKey.startsWith('nvapi-')) {
    const res = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/models", {
      headers: { "Authorization": `Bearer ${apiKey}` }
    }, 8000);
    if (!res.ok) throw new Error(`NVIDIA API Yanıt Vermedi (HTTP ${res.status})`);
    return "NVIDIA API Bağlantısı Başarılı (OK)";
  }

  // OmniRoute Hızlı Test (Sunucu + Model Erişimi)
  const customUrl = localStorage.getItem('soruai_omniroute_base_url') || 'http://3.84.244.225:20128/v1';
  let cleanBaseUrl = customUrl.trim().replace(/\/+$/, '');
  const modelsUrl = cleanBaseUrl.endsWith('/v1') ? `${cleanBaseUrl}/models` : `${cleanBaseUrl}/v1/models`;

  const modelsRes = await fetchWithTimeout(modelsUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }, 10000);

  if (!modelsRes.ok) {
    throw new Error(`OmniRoute Sunucusu Yanıt Vermedi (HTTP ${modelsRes.status})`);
  }

  // Hızlı tamamlama testi (12s timeout)
  const chatUrl = cleanBaseUrl.endsWith('/v1') ? `${cleanBaseUrl}/chat/completions` : `${cleanBaseUrl}/v1/chat/completions`;
  const chatRes = await fetchWithTimeout(chatUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gemini/gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Ping' }],
      max_tokens: 10
    })
  }, 12000).catch(() => null);

  if (chatRes && chatRes.ok) {
    return "OmniRoute Sunucusu ve Modeller Aktif (OK)";
  }

  return "OmniRoute Sunucusu Aktif (/v1/models OK)";
}

async function testApiStatus() {
  const btn = document.querySelector('button[onclick="testApiStatus()"]');
  const originalText = btn ? btn.innerHTML : '🔍 API Durumunu Kontrol Et';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Kontrol ediliyor...';
  }

  const apiKeyEl = document.getElementById('apiKey');
  const apiKey = (apiKeyEl ? apiKeyEl.value.trim() : '') || localStorage.getItem('soruai_key');
  if (!apiKey) {
    showToast('⚠️ Lütfen önce API anahtarını girin', 'warn');
    alert('⚠️ Lütfen önce API anahtarınızı girin.');
    if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
    return;
  }

  let provider = 'OmniRoute API';
  if (apiKey.startsWith('AIzaSy')) provider = 'Google Gemini API';
  else if (apiKey.startsWith('nvapi-')) provider = 'NVIDIA API';

  showToast(`🔍 ${provider} test ediliyor...`);

  try {
    const res = await quickTestApiConnection(apiKey);
    showToast(`✨ ${provider} BAĞLANTISI BAŞARILI!`, 'success');
    showError(`✅ ${provider} Testi Başarılı:\n` + res);
    alert(`✨ ${provider} BAĞLANTISI BAŞARILI!\n\nSunucu Yanıtı: ${res}`);
  } catch (err) {
    console.error("testApiStatus Hatası:", err);
    showToast(`❌ Hata: ${err.message}`, 'error');
    showError(`❌ ${provider} Bağlantı Hatası:\n` + err.message);
    alert(`❌ ${provider} Bağlantı Hatası:\n\n${err.message}`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

function saveOmniRouteUrl() {
  const urlEl = document.getElementById('omnirouteUrl');
  if (urlEl) {
    const url = urlEl.value.trim();
    if (url) {
      localStorage.setItem('soruai_omniroute_base_url', url);
      showToast('✅ OmniRoute API Base URL kaydedildi');
    }
  }
}

async function callImagen(apiKey, prompt) {
  const endpoints = [
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`,
      body: { prompt: prompt, config: { numberOfImages: 1, outputMimeType: "image/jpeg", aspectRatio: "1:1" } }
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-fast-generate-001:generateImages?key=${apiKey}`,
      body: { prompt: prompt, config: { numberOfImages: 1, outputMimeType: "image/jpeg", aspectRatio: "1:1" } }
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      body: { instances: [{ prompt: prompt }], parameters: { sampleCount: 1, aspectRatio: "1:1", outputMimeType: "image/jpeg" } }
    }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ep.body)
      });
      if (!res.ok) continue;
      const data = await res.json();
      const base64Bytes = data.generatedImages?.[0]?.image?.imageBytes || data.predictions?.[0]?.bytesBase64Encoded;
      if (base64Bytes) return `data:image/jpeg;base64,${base64Bytes}`;
    } catch (e) {}
  }
  throw new Error("Imagen 3 bu API anahtarında aktif değil.");
}

// ─── OCR & REFERENCE FILES PROCESSING ───
async function processReferenceFiles(files) {
  const parts = [];
  const referenceField = document.getElementById('referenceText');
  state.referenceImages = [];

  for (const file of files) {
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith('.txt') || name.endsWith('.md')) {
        const text = await file.text();
        if (text.trim()) parts.push(`Dosya: ${file.name}\n${text.trim()}`);
      } else if (name.endsWith('.pdf')) {
        const pdfText = await extractPdfText(file);
        if (pdfText) parts.push(`PDF: ${file.name}\n${pdfText}`);
      } else if (name.match(/\.(png|jpg|jpeg|webp)$/)) {
        const base64Url = await readFileAsBase64(file);
        const urlParts = base64Url.split(';base64,');
        const mimeType = urlParts[0].split(':')[1];
        const data = urlParts[1];
        
        state.referenceImages.push({
          id: 'ref_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          name: file.name,
          mimeType: mimeType,
          data: data,
          url: base64Url
        });

        const ocrText = await extractImageText(file);
        if (ocrText) parts.push(`Fotoğraf Metni (${file.name}):\n${ocrText}`);
      }
    } catch (err) {
      console.warn('Referans dosya işlenemedi:', file.name, err);
    }
  }

  const combined = parts.join('\n\n').trim();
  if (referenceField && combined) {
    referenceField.value = combined;
  }
  
  renderReferenceFilesList();
  return combined;
}

function renderReferenceFilesList() {
  const listEl = document.getElementById('referenceFilesList');
  if (!listEl) return;
  
  if (!state.referenceImages || state.referenceImages.length === 0) {
    listEl.innerHTML = '';
    return;
  }
  
  listEl.innerHTML = state.referenceImages.map((img) => `
    <div class="ref-image-chip" style="position: relative; display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; font-size: 12px; backdrop-filter: blur(4px);">
      <img src="${img.url}" style="width: 24px; height: 24px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border2);" />
      <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escHtml(img.name)}</span>
      <button type="button" onclick="deleteReferenceImage('${img.id}')" style="background: none; border: none; color: var(--red); cursor: pointer; font-size: 11px; margin-left: 4px; padding: 2px;">❌</button>
    </div>
  `).join('');
}

function deleteReferenceImage(id) {
  state.referenceImages = state.referenceImages.filter(img => img.id !== id);
  renderReferenceFilesList();
  showToast('📌 Referans resim çıkarıldı.');
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

async function extractPdfText(file) {
  if (typeof pdfjsLib === 'undefined') return '';
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += `\n[Sayfa ${i}] ${pageText}`;
    }
    return text.trim();
  } catch (err) {
    return '';
  }
}

async function extractImageText(file) {
  if (typeof Tesseract === 'undefined') return '';
  try {
    const result = await Tesseract.recognize(file, 'turkish');
    return result?.data?.text?.trim() || '';
  } catch (err) {
    return '';
  }
}

// ─── PARSE ───
function parseQuestions(raw) {
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    return parsed.questions || parsed.sorular || (Array.isArray(parsed) ? parsed : []);
  } catch (e) { return []; }
}

async function regenerateQuestionImage(idx) {
  const visContainer = document.getElementById(`visual-${idx}`);
  if (!visContainer) return;

  const q = state.currentQuestions?.[idx];
  if (!q) return;

  showToast('🎨 Yeni renkli resim çiziliyor...');

  const promptText = cleanPromptForImage(q.visual_data?.prompt || q.text || q.soru || 'science experiment');
  const seed = Math.floor(Math.random() * 1000000);
  const enhancedPrompt = `Full color realistic digital illustration, ÖSYM MEB textbook artwork, vibrant colors, clear lighting, ${promptText}`;
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=768&height=512&seed=${seed}&nologo=true`;

  visContainer.innerHTML = `
    <div class="vis-card" style="border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: rgba(15, 15, 26, 0.8); margin-top: 14px; text-align:center;">
      <div id="skel-regen-${idx}" style="min-height: 140px; display:flex; align-items:center; justify-content:center; color:var(--accent2); font-weight:600;">
        <div class="spinner" style="width:24px; height:24px; margin-right:8px;"></div> Yeni Renkli Resim Yükleniyor...
      </div>
      <img id="img-regen-${idx}" class="hidden" alt="Soru Görseli" style="max-width:100%; border-radius:10px; max-height:380px; object-fit:contain; margin:0 auto; display:block;" />
    </div>
  `;

  const imgEl = document.getElementById(`img-regen-${idx}`);
  const skelEl = document.getElementById(`skel-regen-${idx}`);

  if (imgEl && skelEl) {
    imgEl.onload = () => {
      imgEl.classList.remove('hidden');
      skelEl.classList.add('hidden');
      showToast('✨ Yeni resim başarıyla yüklendi!', 'success');
    };
    imgEl.onerror = () => {
      if (skelEl) skelEl.innerHTML = `<div style="padding:16px; color:var(--text2); font-size:12px;">🖼️ Görsel yenilendi</div>`;
    };
    imgEl.src = pollinationsUrl;

    if (imgEl.complete && imgEl.naturalWidth !== 0) {
      imgEl.classList.remove('hidden');
      skelEl.classList.add('hidden');
    }
  }
}

// ─── RENDER KITAPÇIK ───
function renderExamQuestions(questions) {
  state.currentQuestions = questions;
  const output = document.getElementById('questionsOutput');
  if (!output) return;
  output.classList.remove('hidden');
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.classList.add('hidden');

  output.innerHTML = `
    <div class="output-toolbar">
      <h3>📚 ${state.exam} Deneme Kitapçığı (${questions.length} Soru)</h3>
      <div class="toolbar-actions">
        <button class="btn-secondary" onclick="window.print()">🖨️ PDF Kaydet</button>
        <button class="btn-print" onclick="window.location.reload()">🔄 Yeni Deneme</button>
      </div>
    </div>
  `;

  let currentBolum = '';
  questions.forEach((q, i) => {
    if (!q) return;
    const bolum = q.bolumName || q.bolum || state.ders || 'GENEL';
    if (bolum !== currentBolum) {
      currentBolum = bolum;
      const header = document.createElement('div');
      header.className = 'bolum-header';
      header.innerHTML = `<span>${escHtml(currentBolum.toUpperCase())}</span>`;
      output.appendChild(header);
    }

    const optionsObj = (q.options && typeof q.options === 'object') ? q.options : {};
    const misconceptionsObj = (q.misconceptions && typeof q.misconceptions === 'object' && !Array.isArray(q.misconceptions)) ? q.misconceptions : {};

    const misconceptionsHtml = Object.keys(misconceptionsObj).length > 0
      ? Object.entries(misconceptionsObj).map(([k, v]) => `<div class="mis-item"><b>${escHtml(k)}:</b> ${escHtml(String(v))}</div>`).join('')
      : '';

    const optionsHtml = Object.keys(optionsObj).length > 0
      ? Object.keys(optionsObj).map(key => `
          <div class="q-option" onclick="this.classList.toggle('active')" id="opt-${i}-${key}">
            <span class="opt-letter">${escHtml(key)}</span>
            <span>${escHtml(String(optionsObj[key]))}</span>
          </div>
        `).join('')
      : '';

    const card = document.createElement('div');
    card.className = 'q-card';
    card.innerHTML = `
      <div class="q-card-header">
        <div class="q-number">${i + 1}</div>
        <div class="q-meta"><span class="q-exam">${escHtml(bolum)}</span></div>
      </div>
      <div class="q-body">
        <div class="q-visual" id="visual-${i}"></div>
        <p class="q-text">${escHtml(q.text || q.soru || '')}</p>
        <div class="q-options">
          ${optionsHtml}
        </div>
        <div class="q-solution" id="sol-${i}">
          <div class="solution-title">Doğru Cevap: ${escHtml(q.answer || q.cevap || '')}</div>
          <div class="solution-text">${escHtml(q.solution || q.cozum || '')}</div>
          ${misconceptionsHtml ? `<div class="solution-mis"><div class="solution-title" style="margin-top:10px;">Neden diğer şıklar yanlış?</div>${misconceptionsHtml}</div>` : ''}
        </div>
      </div>
      <div class="q-actions" style="display:flex; gap:8px;">
        <button class="btn-reveal" onclick="document.getElementById('sol-${i}').classList.toggle('visible')">💡 Çözüm</button>
        <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="regenerateQuestionImage(${i})">🎨 Görseli Yenile</button>
      </div>
    `;
    output.appendChild(card);
    
    // İstisnasız %100 Görsel Garantisi
    if (!q.visual_type || q.visual_type === 'none') {
      const textLower = (q.text || q.soru || '').toLowerCase();
      const dersLower = (bolum || '').toLowerCase();

      if (dersLower.includes('mat') || dersLower.includes('geo') || textLower.includes('üçgen') || textLower.includes('açı') || textLower.includes('şekil')) {
        q.visual_type = 'geometry';
        q.visual_data = (q.visual_data && q.visual_data.shape) ? q.visual_data : {
          shape: 'triangle',
          title: 'Geometrik Model',
          points: [{id:'A',x:0,y:0},{id:'B',x:4,y:0},{id:'C',x:0,y:3}],
          segments: [['A','B'],['B','C'],['C','A']],
          measurements: [{type:'length',from:'A',to:'B',value:'4 cm'}]
        };
      } else if (textLower.includes('oran') || textLower.includes('yüzde') || textLower.includes('grafik') || textLower.includes('artış')) {
        q.visual_type = 'bar_chart';
        q.visual_data = {
          title: 'Veri Analiz Grafiği',
          labels: ['I. Durum', 'II. Durum', 'III. Durum', 'IV. Durum'],
          datasets: [{ label: 'Değer', data: [45, 70, 30, 85] }]
        };
      } else {
        q.visual_type = 'image';
        q.visual_data = {
          title: 'Soru Senaryo Görseli',
          caption: 'Soru bağlamına uygun görsel illüstrasyonu',
          prompt: q.text || q.soru || 'educational science diagram'
        };
      }
    }

    renderVisual(q, `visual-${i}`, i);
  });
}

// ─── GERÇEK GÖRSEL RENDER (Chart.js + SVG Geometri) ───
function destroyAllCharts() {
  state.charts.forEach(c => { try { c.destroy(); } catch (e) {} });
  state.charts = [];
}

function generateConceptSvgDiagram(title, caption, promptText = '') {
  const p = (promptText || title || '').toLowerCase();
  
  let icon = '🧪';
  let categoryTitle = 'DENEY / MODEL ŞEMASI';
  let primaryColor = '#6c63ff';
  let accentColor = '#38bdf8';
  let pathSvg = '';

  if (p.includes('fizik') || p.includes('kuvvet') || p.includes('vektör') || p.includes('hız') || p.includes('hareket') || p.includes('kütle')) {
    icon = '⚡';
    categoryTitle = 'FİZİK MODELLEME ŞEMASI';
    primaryColor = '#38bdf8';
    accentColor = '#f59e0b';
    pathSvg = `
      <rect x="130" y="110" width="100" height="70" rx="8" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="180" y="150" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">m = 5 kg</text>
      <line x1="40" y1="180" x2="320" y2="180" stroke="#64748b" stroke-width="3" stroke-dasharray="6,4"/>
      <line x1="230" y1="145" x2="300" y2="145" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow)"/>
      <text x="265" y="135" font-size="13" font-weight="bold" fill="#f59e0b" text-anchor="middle">F = 20 N</text>
      <line x1="130" y1="145" x2="70" y2="145" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,2"/>
      <text x="95" y="135" font-size="12" fill="#ef4444" text-anchor="middle">F_s</text>
    `;
  } else if (p.includes('biyoloji') || p.includes('hücre') || p.includes('organel') || p.includes('dna') || p.includes('bitki') || p.includes('canlı')) {
    icon = '🧬';
    categoryTitle = 'BİYOLOJİ / CANLI YAPISI ŞEMASI';
    primaryColor = '#34d399';
    accentColor = '#a78bfa';
    pathSvg = `
      <ellipse cx="180" cy="115" rx="110" ry="65" fill="rgba(52,211,153,0.08)" stroke="#34d399" stroke-width="2.5"/>
      <circle cx="150" cy="115" r="32" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" stroke-width="2"/>
      <circle cx="150" cy="115" r="14" fill="#a78bfa" opacity="0.6"/>
      <text x="150" y="160" font-size="11" fill="#34d399" font-weight="600" text-anchor="middle">Çekirdek (DNA)</text>
      <ellipse cx="235" cy="100" rx="18" ry="10" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="235" y="122" font-size="10" fill="#f59e0b" text-anchor="middle">Mitokondri</text>
    `;
  } else if (p.includes('kimya') || p.includes('çözelti') || p.includes('asit') || p.includes('tepkim') || p.includes('madde') || p.includes('deney')) {
    icon = '🧪';
    categoryTitle = 'KİMYA DENEY DÜZENEĞİ';
    primaryColor = '#a78bfa';
    accentColor = '#38bdf8';
    pathSvg = `
      <path d="M 120,60 L 120,150 Q 120,165 135,165 L 225,165 Q 240,165 240,150 L 240,60" fill="none" stroke="#a78bfa" stroke-width="3"/>
      <path d="M 122,105 Q 180,115 238,105 L 238,150 Q 238,163 225,163 L 135,163 Q 122,163 122,150 Z" fill="rgba(167,139,250,0.25)" stroke="#38bdf8" stroke-width="1"/>
      <circle cx="150" cy="125" r="4" fill="#38bdf8" opacity="0.8"/>
      <circle cx="180" cy="135" r="6" fill="#38bdf8" opacity="0.6"/>
      <circle cx="210" cy="120" r="3" fill="#38bdf8" opacity="0.9"/>
      <text x="180" y="50" font-size="12" fill="#a78bfa" font-weight="600" text-anchor="middle">Çözelti Düzeneği</text>
    `;
  } else {
    icon = '📐';
    categoryTitle = 'GÖRSEL MODEL VE ANALİZ ŞEMASI';
    primaryColor = '#6c63ff';
    accentColor = '#a78bfa';
    pathSvg = `
      <rect x="80" y="65" width="200" height="95" rx="12" fill="rgba(108,99,255,0.08)" stroke="#6c63ff" stroke-width="2" stroke-dasharray="4,3"/>
      <circle cx="120" cy="112" r="22" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" stroke-width="2"/>
      <text x="120" y="117" font-size="16" fill="#a78bfa" font-weight="bold" text-anchor="middle">A</text>
      <line x1="142" y1="112" x2="218" y2="112" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
      <circle cx="240" cy="112" r="22" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>
      <text x="240" y="117" font-size="16" fill="#38bdf8" font-weight="bold" text-anchor="middle">B</text>
    `;
  }

  return `
    <div class="vis-card" style="border: 1px solid var(--border); border-radius: 12px; padding: 16px; background: rgba(18, 18, 26, 0.7); margin-top: 14px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
      <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:10px;">
        <span style="font-size:20px;">${icon}</span>
        <span style="font-size:11px; font-weight:700; letter-spacing:1px; color:${primaryColor}; text-transform:uppercase;">${categoryTitle}</span>
      </div>
      <svg width="100%" height="190" viewBox="0 0 360 190" style="max-width:380px; margin:0 auto; display:block;">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="${accentColor}" />
          </marker>
        </defs>
        ${pathSvg}
      </svg>
      <div style="font-size: 13.5px; font-weight: 700; color: var(--text); margin-top: 10px;">${escHtml(title)}</div>
      ${caption ? `<div style="font-size: 11.5px; color: var(--text2); margin-top: 4px; font-style: italic; line-height: 1.4; background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 6px; border: 1px dashed var(--border2); display: inline-block;">${escHtml(caption)}</div>` : ''}
    </div>
  `;
}

function cleanPromptForImage(text) {
  if (!text) return 'science educational experiment illustration';
  
  const trMap = {
    'ç':'c', 'Ç':'C', 'ğ':'g', 'Ğ':'G', 'ı':'i', 'I':'I', 'İ':'I',
    'ö':'o', 'Ö':'O', 'ş':'s', 'Ş':'S', 'ü':'u', 'Ü':'U'
  };
  
  let str = text.toString();
  for (const [key, val] of Object.entries(trMap)) {
    str = str.replaceAll(key, val);
  }
  
  return str.replace(/[^a-zA-Z0-9\s,.-]/g, ' ').replace(/\s+/g, ' ').trim();
}

async function generateRealAIImage(apiKey, promptText) {
  const cleanPrompt = cleanPromptForImage(promptText);
  const enhancedPrompt = `Full color high-resolution realistic digital illustration, rich detailed ÖSYM MEB textbook artwork, vibrant colors, clear lighting, realistic scene, high definition photograph style, ${cleanPrompt}`;

  // 1. Google Gemini Key varsa Imagen 3 dene
  if (apiKey && apiKey.startsWith('AIzaSy')) {
    try {
      return await callImagen(apiKey, enhancedPrompt);
    } catch (e) {}
  }

  // 2. Yüksek Çözünürlüklü Kesintisiz Renkli AI Görsel Motoru (Pollinations HD AI)
  const seed = Math.floor(Math.random() * 1000000);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=768&height=512&seed=${seed}&nologo=true`;
  return pollinationsUrl;
}

function renderVisual(q, containerId, idx) {
  const container = document.getElementById(containerId);
  const vt = q.visual_type;
  const vd = q.visual_data || {};
  const title = vd.title || 'Soru Görseli / İllüstrasyonu';
  const caption = vd.caption || '';

  if (vt === 'table' && vd.headers && vd.rows) {
    container.innerHTML = `
      <div class="vis-card" style="border: 1px solid var(--border); border-radius: 8px; padding: 12px; background: rgba(255,255,255,0.01); margin-top: 12px;">
        <table class="vis-table">
          <thead><tr>${vd.headers.map(h => `<th>${escHtml(h)}</th>`).join('')}</tr></thead>
          <tbody>${vd.rows.map(r => `<tr>${r.map(c => `<td>${escHtml(String(c))}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        ${caption ? `<div style="font-size:11px; color:var(--text3); margin-top:6px; text-align:center;">${escHtml(caption)}</div>` : ''}
      </div>`;
    return;
  }

  if ((vt === 'bar_chart' || vt === 'line_chart' || vt === 'pie_chart') && vd.labels && vd.datasets) {
    container.innerHTML = `
      <div class="vis-card" style="border: 1px solid var(--border); border-radius: 8px; padding: 12px; background: rgba(255,255,255,0.01); margin-top: 12px;">
        <div class="vis-chart-wrap" style="position:relative; height:200px;"><canvas id="chart-${idx}"></canvas></div>
        ${caption ? `<div style="font-size:11px; color:var(--text3); margin-top:6px; text-align:center;">${escHtml(caption)}</div>` : ''}
      </div>`;
      
    setTimeout(() => {
      const canvas = document.getElementById(`chart-${idx}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const palette = ['#6c63ff', '#a78bfa', '#38bdf8', '#34d399', '#f59e0b'];
      const chart = new Chart(ctx, {
        type: vt === 'bar_chart' ? 'bar' : (vt === 'pie_chart' ? 'pie' : 'line'),
        data: {
          labels: vd.labels,
          datasets: vd.datasets.map((ds, i) => ({
            label: ds.label || `Seri ${i + 1}`,
            data: ds.data,
            backgroundColor: vt === 'pie_chart' ? palette : (vt === 'bar_chart' ? palette[i % palette.length] : 'rgba(108,99,255,0.15)'),
            borderColor: palette[i % palette.length],
            borderWidth: 2,
            tension: 0.3,
            fill: vt === 'line_chart'
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: vt === 'pie_chart' || vd.datasets.length > 1, labels: { color: '#a0a0b8' } } },
          scales: vt === 'pie_chart' ? {} : {
            x: { ticks: { color: '#a0a0b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#a0a0b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
      state.charts.push(chart);
    }, 50);
    return;
  }

  if (vt === 'image' && vd) {
    const promptToUse = vd.prompt || vd.description || q.text;

    if (vd.url && (vd.url.startsWith('http') || vd.url.startsWith('data:'))) {
      container.innerHTML = `
        <div class="vis-card" style="border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: rgba(15, 15, 26, 0.8); margin-top: 14px; text-align:center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <img src="${escHtml(vd.url)}" alt="${escHtml(title)}" style="max-width:100%; border-radius:10px; max-height:360px; object-fit:contain; background:#000; box-shadow: 0 4px 15px rgba(0,0,0,0.5);" />
          <div style="font-size: 13.5px; font-weight: 700; color: var(--text); margin-top: 10px;">${escHtml(title)}</div>
          ${caption ? `<div style="font-size:11.5px; color:var(--text2); margin-top:4px; font-style:italic;">${escHtml(caption)}</div>` : ''}
        </div>`;
    } else {
      const imgId = `img-${containerId}`;
      const skeletonId = `skeleton-${containerId}`;
      
      container.innerHTML = `
        <div class="vis-card" style="border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: rgba(15, 15, 26, 0.8); margin-top: 14px; text-align:center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <div id="${skeletonId}" style="width: 100%; min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(108,99,255,0.05); border-radius: 10px; border: 1px dashed var(--border2); padding: 16px;">
            <div class="spinner" style="width: 28px; height: 28px; border-width: 3px; margin-bottom: 8px; border-top-color: var(--accent2);"></div>
            <span style="font-size: 12.5px; font-weight: 600; color: var(--accent2);">🖼️ Görsel İllüstrasyon Hazırlanıyor...</span>
          </div>
          <img id="${imgId}" class="hidden" alt="${escHtml(title)}" style="max-width:100%; border-radius:10px; max-height:380px; object-fit:contain; background:#000; box-shadow: 0 4px 15px rgba(0,0,0,0.5); margin:0 auto; display:block;" />
          <div style="font-size: 13.5px; font-weight: 700; color: var(--text); margin-top: 10px;">${escHtml(title)}</div>
          ${caption ? `<div style="font-size:11.5px; color:var(--text2); margin-top:4px; font-style:italic;">${escHtml(caption)}</div>` : ''}
        </div>`;

      const apiKey = document.getElementById('apiKey')?.value.trim() || localStorage.getItem('soruai_key');
      generateRealAIImage(apiKey, promptToUse)
        .then(imgUrl => {
          const imgEl = document.getElementById(imgId);
          const skelEl = document.getElementById(skeletonId);
          if (imgEl && skelEl) {
            imgEl.onload = () => {
              imgEl.classList.remove('hidden');
              skelEl.classList.add('hidden');
            };
            imgEl.onerror = () => {
              const skel = document.getElementById(skeletonId);
              if (skel) skel.innerHTML = `<div style="padding:16px; color:var(--text2); font-size:12px; text-align:center;">🖼️ ${escHtml(title)}</div>`;
            };
            imgEl.src = imgUrl;

            if (imgEl.complete && imgEl.naturalWidth !== 0) {
              imgEl.classList.remove('hidden');
              skelEl.classList.add('hidden');
            }
          }
        })
        .catch(() => {
          const skelEl = document.getElementById(skeletonId);
          if (skelEl) skelEl.innerHTML = `<div style="padding:16px; color:var(--text2); font-size:12px; text-align:center;">🖼️ ${escHtml(title)}</div>`;
        });
    }
    return;
  }

  if (vt === 'geometry' && vd.shape) {
    container.innerHTML = renderGeometrySVG(vd);
    return;
  }

  // Fallback: eski/eksik veri gelirse en azından metni göster
  if (vd.description) {
    container.innerHTML = `<div class="vis-geometry">📐 ${escHtml(vd.description)}</div>`;
  }
}

function renderGeometrySVG(vd) {
  const points = vd.points || [];
  if (points.length === 0) return '';

  const W = 360, H = 260, PAD = 40;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  let minX = Math.min(...xs), maxX = Math.max(...xs);
  let minY = Math.min(...ys), maxY = Math.max(...ys);
  if (vd.shape === 'circle' && vd.circle) {
    const c = points.find(p => p.id === vd.circle.centerId) || { x: 0, y: 0 };
    minX = Math.min(minX, c.x - vd.circle.radius); maxX = Math.max(maxX, c.x + vd.circle.radius);
    minY = Math.min(minY, c.y - vd.circle.radius); maxY = Math.max(maxY, c.y + vd.circle.radius);
  }
  const spanX = (maxX - minX) || 1, spanY = (maxY - minY) || 1;
  const scale = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY);

  const toSvg = (x, y) => {
    const sx = PAD + (x - minX) * scale;
    const sy = H - PAD - (y - minY) * scale; // Y ekseni yukarı baksın
    return [sx, sy];
  };

  const byId = {};
  points.forEach(p => { byId[p.id] = p; });

  let shapes = '';

  // Çember
  if (vd.shape === 'circle' && vd.circle) {
    const c = byId[vd.circle.centerId] || { x: 0, y: 0 };
    const [cx, cy] = toSvg(c.x, c.y);
    shapes += `<circle cx="${cx}" cy="${cy}" r="${vd.circle.radius * scale}" fill="rgba(108,99,255,0.08)" stroke="#6c63ff" stroke-width="2"/>`;
  }

  // Kenarlar
  (vd.segments || []).forEach(([a, b]) => {
    const pa = byId[a], pb = byId[b];
    if (!pa || !pb) return;
    const [x1, y1] = toSvg(pa.x, pa.y);
    const [x2, y2] = toSvg(pb.x, pb.y);
    shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a78bfa" stroke-width="2.5"/>`;
    // Uzunluk etiketi (varsa)
    const meas = (vd.measurements || []).find(m => m.type === 'length' &&
      ((m.from === a && m.to === b) || (m.from === b && m.to === a)));
    if (meas) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      shapes += `<rect x="${mx - 18}" y="${my - 10}" width="36" height="16" rx="4" fill="#12121a"/>`;
      shapes += `<text x="${mx}" y="${my + 2}" font-size="11" fill="#e5e5f0" text-anchor="middle">${escHtml(meas.value)}</text>`;
    }
  });

  // Açı etiketleri
  (vd.measurements || []).filter(m => m.type === 'angle').forEach(m => {
    const p = byId[m.at];
    if (!p) return;
    const [x, y] = toSvg(p.x, p.y);
    shapes += `<text x="${x + 10}" y="${y - 10}" font-size="11" fill="#38bdf8" font-weight="600">${escHtml(m.value)}</text>`;
  });

  // Noktalar + etiketler
  points.forEach(p => {
    const [x, y] = toSvg(p.x, p.y);
    shapes += `<circle cx="${x}" cy="${y}" r="3.5" fill="#e5e5f0"/>`;
    shapes += `<text x="${x + 8}" y="${y - 8}" font-size="13" fill="#e5e5f0" font-weight="600">${escHtml(p.label || p.id)}</text>`;
  });

  return `<div class="vis-geometry"><svg viewBox="0 0 ${W} ${H}" width="100%" height="220">${shapes}</svg>
    ${vd.description ? `<div class="vis-geometry-caption">${escHtml(vd.description)}</div>` : ''}
  </div>`;
}

// ─── EKSTRA YARDIMCI FONKSİYONLAR ───
function setLoading(on, step) {
  const loadingState = document.getElementById('loadingState');
  if (loadingState) {
    loadingState.classList.toggle('hidden', !on);
  }
  const loadingStep = document.getElementById('loadingStep');
  if (loadingStep) {
    loadingStep.textContent = step || '';
  }
}

function setLoadingStep(msg) { 
  const loadingStep = document.getElementById('loadingStep');
  if (loadingStep) {
    loadingStep.textContent = msg; 
  }
}

// Kayıtlı sorular kısmı için index.html ile uyumlu basit fonksiyonlar
function renderSaved() {
  const listEl = document.getElementById('savedList');
  if (!listEl) return;
  if (state.saved.length === 0) {
    listEl.innerHTML = '<p style="color:var(--text3); font-size:14px;">Henüz kayıtlı soru bulunmuyor.</p>';
    return;
  }
  listEl.innerHTML = state.saved.map((q, idx) => `
    <div class="saved-item">
      <div class="saved-item-info">
        <div class="saved-item-title">${escHtml(q.text.slice(0, 100))}...</div>
        <div class="saved-item-meta">${q.examType || 'TYT'} - ${q.bolumName || 'Ders'}</div>
      </div>
      <button class="btn-delete" onclick="deleteSaved(${idx})">Sil</button>
    </div>
  `).join('');
}

function deleteSaved(idx) {
  state.saved.splice(idx, 1);
  localStorage.setItem('soruai_saved', JSON.stringify(state.saved));
  renderSaved();
  showToast('🗑️ Soru silindi.');
}

function clearSaved() {
  state.saved = [];
  localStorage.setItem('soruai_saved', '[]');
  const savedList = document.getElementById('savedList');
  if (savedList) savedList.innerHTML = '';
  showToast('🗑️ Kayıtlı sorular temizlendi');
}

function showError(msg) {
  const output = document.getElementById('questionsOutput');
  if (output) {
    output.classList.remove('hidden');
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.classList.add('hidden');
    output.innerHTML = `<div class="error-box">❌ ${escHtml(msg)}</div>`;
  }
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function escHtml(s) {
  return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}
