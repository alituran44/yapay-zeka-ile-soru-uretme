// ─── MODEL LİSTESİ ───
const GEMINI_MODELS = [
  { name: 'gemini-flash-latest',     ver: 'v1beta' },
  { name: 'gemini-pro-latest',      ver: 'v1beta' },
  { name: 'gemini-1.5-flash-latest', ver: 'v1beta' },
  { name: 'gemini-1.5-pro-latest',   ver: 'v1beta' },
];

// ─── SINAV KONFIGURASYONLARI (Resmi Soru Sayıları) ───
const SINAV_CONFIG = {
  'TYT': {
    label: 'TYT (Temel Yeterlilik Testi)', sik: 4, sure: 165,
    bolumler: [
      { ders: 'Türkçe',          count: 40 },
      { ders: 'Sosyal Bilimler', count: 20, detay: 'Tarih(5), Coğrafya(5), Felsefe(5), Din(5)' },
      { ders: 'Temel Matematik', count: 40 },
      { ders: 'Fen Bilimleri',   count: 20, detay: 'Fizik(7), Kimya(7), Biyoloji(6)' }
    ]
  },
  'AYT_SAY': {
    label: 'AYT Sayısal', sik: 5, sure: 180,
    bolumler: [
      { ders: 'Matematik',  count: 40 },
      { ders: 'Fen Bilimleri', count: 40, detay: 'Fizik(14), Kimya(13), Biyoloji(13)' }
    ]
  },
  'LGS': {
    label: 'LGS (Liselere Giriş Sınavı)', sik: 4, sure: 155,
    bolumler: [
      { ders: 'Türkçe',          count: 20 },
      { ders: 'T.C. İnkılap',    count: 10 },
      { ders: 'Din Kültürü',     count: 10 },
      { ders: 'İngilizce',       count: 10 },
      { ders: 'Matematik',       count: 20 },
      { ders: 'Fen Bilimleri',   count: 20 }
    ]
  },
  'KPSS': {
    label: 'KPSS (Genel Yetenek / Genel Kültür)', sik: 5, sure: 130,
    bolumler: [
      { ders: 'Türkçe',          count: 30 },
      { ders: 'Matematik',       count: 30 },
      { ders: 'Tarih',           count: 27 },
      { ders: 'Coğrafya',        count: 18 },
      { ders: 'Vatandaşlık',     count: 9 },
      { ders: 'Güncel Bilgiler', count: 6 }
    ]
  },
  'DGS': {
    label: 'DGS (Dikey Geçiş Sınavı)', sik: 5, sure: 135,
    bolumler: [
      { ders: 'Sözel',    count: 50 },
      { ders: 'Sayısal',  count: 50 }
    ]
  },
  'ALES': {
    label: 'ALES (Akademik Personel Sınavı)', sik: 5, sure: 150,
    bolumler: [
      { ders: 'Sözel',    count: 50 },
      { ders: 'Sayısal',  count: 50 }
    ]
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
  'AYT': [
    { group: 'Sayısal', items: ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji'] },
    { group: 'Sözel', items: ['Türk Dili ve Edebiyatı', 'Tarih-1', 'Coğrafya-1', 'Tarih-2', 'Coğrafya-2', 'Felsefe', 'Din Kültürü'] },
    { group: 'EA', items: ['Matematik (EA)', 'Geometri (EA)', 'Türk Dili ve Edebiyatı (EA)', 'Tarih-1 (EA)', 'Coğrafya-1 (EA)'] },
    { group: 'Dil', items: ['İngilizce', 'Almanca', 'Fransızca'] },
  ],
  'LGS': [
    { group: 'Sözel', items: ['Türkçe', 'İnkılap Tarihi', 'Din Kültürü', 'İngilizce'] },
    { group: 'Sayısal', items: ['Matematik', 'Fen Bilimleri'] },
  ],
  'KPSS': [
    { group: 'Genel Yetenek', items: ['Türkçe', 'Matematik'] },
    { group: 'Genel Kültür', items: ['Tarih', 'Coğrafya', 'Vatandaşlık/Anayasa', 'Güncel Bilgiler'] },
    { group: 'Alan', items: ['Eğitim Bilimleri', 'Hukuk', 'İktisat', 'Kamu Yönetimi'] },
  ],
  'DGS': [
    { group: 'Sayısal', items: ['Matematik', 'Geometri'] },
    { group: 'Sözel', items: ['Türkçe', 'Genel Kültür'] },
  ],
  'ALES': [
    { group: 'Sayısal', items: ['Sayısal Yetenek', 'Matematik'] },
    { group: 'Sözel', items: ['Sözel Yetenek', 'Türkçe'] },
  ],
  'Bursluluk': [
    { group: 'Dersler', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Din Kültürü'] },
  ],
  '5. Sınıf Yazılı': [
    { group: 'Dersler', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Din Kültürü', 'İngilizce'] },
  ],
  '6. Sınıf Yazılı': [
    { group: 'Dersler', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Din Kültürü', 'İngilizce'] },
  ],
  '7. Sınıf Yazılı': [
    { group: 'Dersler', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Din Kültürü', 'İngilizce'] },
  ],
  '8. Sınıf Yazılı': [
    { group: 'Dersler', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'İnkılap Tarihi', 'Din Kültürü', 'İngilizce'] },
  ],
  'ÖSYM Tarzı': [
    { group: 'Sayısal', items: ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji'] },
    { group: 'Sözel', items: ['Türkçe', 'Edebiyat', 'Tarih', 'Coğrafya', 'Felsefe'] },
  ],
  'MEB Tarzı': [
    { group: 'Tüm Dersler', items: ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İnkılap Tarihi', 'Din Kültürü', 'İngilizce', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya'] },
  ],
};

// ─── KAZANIM HARİTASI (ders → konular) ───
const KAZANIM_MAP = {
  'Türkçe': ['Paragrafta Ana Düşünce','Paragrafta Yardımcı Düşünce','Sözcükte Anlam','Cümlede Anlam','Deyim ve Atasözleri','Metin Türleri','Noktalama İşaretleri','Yazım Kuralları','Fiil Çatısı','Sözcük Türleri','Cümle Türleri','Okuduğunu Anlama'],
  'Matematik': ['Sayılar ve İşlemler','Doğal Sayılar','Tam Sayılar','Kesirler','Ondalık Sayılar','Oran-Orantı','Yüzdeler','Denklemler','Eşitsizlikler','Fonksiyonlar','Olasılık','İstatistik','Mantık','Sayı Dizileri'],
  'Geometri': ['Üçgenler','Dörtgenler','Çokgenler','Çember ve Daire','Katı Cisimler','Koordinat Geometrisi','Analitik Geometri','Dönüşüm Geometrisi','Vektörler'],
  'Fizik': ['Kuvvet ve Hareket','Enerji','Dalgalar','Elektrik','Manyetizma','Optik','Modern Fizik','Termodinamik'],
  'Kimya': ['Atom Yapısı','Periyodik Sistem','Kimyasal Bağlar','Mol Kavramı','Çözeltiler','Kimyasal Tepkimeler','Organik Kimya','Asit-Baz'],
  'Biyoloji': ['Hücre','Canlıların Sınıflandırılması','Genetik','Evrim','Ekosistem','İnsan Fizyolojisi','Bitkiler','Hayvanlar'],
  'Tarih': ['Osmanlı Tarihi','Cumhuriyet Dönemi','Atatürk İlkeleri','Dünya Tarihi','Savaşlar','Kültür ve Medeniyet'],
  'Coğrafya': ['Türkiye Coğrafyası','İklim','Nüfus ve Yerleşme','Ekonomik Coğrafya','Harita Bilgisi','Dünya Coğrafyası'],
  'Fen Bilimleri': ['Madde ve Doğası','Kuvvet ve Hareket','Işık','Ses','Hücre ve Organizmalar','Vücudumuz','Elektrik','Çevre ve Enerji'],
  'Sosyal Bilgiler': ['Atatürk ve Cumhuriyet','Demokrasi','Coğrafya','Ekonomi','Kültür ve Miras','Küresel Bağlantılar'],
  'İnkılap Tarihi': ['Kurtuluş Savaşı','Atatürk İlkeleri','Cumhuriyetin İlanı','Çok Partili Hayat','Türkiye Cumhuriyeti'],
  'Felsefe': ['Varlık Felsefesi','Bilgi Felsefesi','Ahlak Felsefesi','Siyaset Felsefesi','Din Felsefesi','Mantık'],
  'Türk Dili ve Edebiyatı': ['Şiir','Roman','Hikaye','Divan Edebiyatı','Halk Edebiyatı','Cumhuriyet Dönemi Edebiyatı','Anlatım Biçimleri'],
  'Vatandaşlık/Anayasa': ['Anayasa','Temel Haklar','Devlet Yapısı','Seçim Sistemi','Yargı'],
  'Sayısal Yetenek': ['Sayı Dizisi','Saat','Takvim','Kesir İşlemleri','Alan-Çevre','Problem Çözme'],
  'Sözel Yetenek': ['Eş Anlam','Zıt Anlam','Deyim','Atasözü','Cümle Tamamlama','Paragraf'],
  'Temel Matematik': ['Sayılar','Oran-Orantı','Yüzde','Denklem','Mantık','İstatistik'],
};

// ─── STATE ───
const state = {
  exam: 'TYT',
  diff: 'Kolay',
  opts: '4',
  count: 3,
  kazanimlar: [],   // Çoklu kazanım
  questions: [],
  saved: JSON.parse(localStorage.getItem('soruai_saved') || '[]'),
  mode: 'manual' // 'manual' or 'deneme'
};

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('soruai_key');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
  }
  // renderSaved(); // Geçici olarak devre dışı
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

// ─── DENEME ÜRETİMİ ───
async function generateDeneme() {
  const apiKey = document.getElementById('apiKey').value.trim() || localStorage.getItem('soruai_key');
  if (!apiKey) { showToast('⚠️ Lütfen Gemini API anahtarını girin', 'warn'); return; }

  const config = SINAV_CONFIG[state.exam];
  if (!config) { showToast('⚠️ Sınav konfigürasyonu bulunamadı', 'error'); return; }

  const gorsel = document.getElementById('gorselToggle').checked;
  const optCount = state.opts;
  
  state.questions = []; // Sıfırla
  setLoading(true, `${config.label} hazırlanıyor...`);

  try {
    for (const [index, bolum] of config.bolumler.entries()) {
      const stepMsg = `[${index + 1}/${config.bolumler.length}] ${bolum.ders} bölümü üretiliyor (${bolum.count} Soru)...`;
      setLoadingStep(stepMsg);
      
      const prompt = buildExamPrompt(state.exam, bolum.ders, bolum.count, optCount, state.diff, gorsel);
      const raw = await callGemini(apiKey, prompt);
      const bolumQuestions = parseQuestions(raw);
      
      bolumQuestions.forEach(q => {
        q.bolumName = bolum.ders;
        q.examType = state.exam;
      });

      state.questions = [...state.questions, ...bolumQuestions];
      showToast(`✅ ${bolum.ders} tamamlandı`);
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
function buildExamPrompt(exam, ders, count, optCount, zorluk, gorsel) {
  const optLabels = optCount === '5' ? 'A, B, C, D, E' : 'A, B, C, D';
  const tarz = zorluk === 'ÖSYM Tarzı' ? 'Yeni Nesil Beceri Temelli' : 'Standart Kazanım Odaklı';

  return `Türkiye'deki resmi ${exam} sınavı için uzman bir komisyonsun.
Görev: ${ders} bölümü için ${count} adet ÖZGÜN soru hazırlaman gerekiyor.

STANDARTLAR:
- Bölüm: ${ders}
- Soru Sayısı: ${count}
- Seçenekler: ${optLabels}
- Zorluk: ${tarz}
- Hatasızlık: Sorular bilimsel açıdan %100 doğru olmalı.
- Görsel: ${gorsel ? 'Soru için gerekliyse visual_type seç ve veriyi sağla.' : 'visual_type: none'}

MUTLAKA SADECE JSON DÖNDÜR:
{
  "questions": [
    {
      "id": ${Date.now()},
      "kazanim": "Müfredat kazanımı",
      "visual_type": "none | table | bar_chart | line_chart | geometry",
      "visual_data": {},
      "text": "Soru metni...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": "A",
      "solution": "Adım adım çözüm..."
    }
  ]
}`;
}

// ─── GEMINI API (v1 Endpoint) ───
async function callGemini(apiKey, prompt) {
  let lastErr = null;
  for (const modelObj of GEMINI_MODELS) {
    const model = modelObj.name;
    const ver = modelObj.ver;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        }
      );
      if (!res.ok) {
        const errJson = await res.json();
        const apiMsg = errJson.error?.message || `HTTP ${res.status}`;
        const reason = errJson.error?.status || 'Unknown';
        
        lastErr = new Error(`[${model}] ${apiMsg} (Status: ${reason})`);
        console.warn(`Model denemesi başarısız: ${lastErr.message}`);
        
        // Eğer anahtar geçersizse (INVALID_ARGUMENT) diğer modelleri denemeye gerek yoktur
        if (apiMsg.includes('API key not valid') || apiMsg.includes('invalid')) {
          throw lastErr; 
        }
        continue;
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastErr = new Error(`${model}: Boş yanıt döndü.`);
        continue;
      }
      return text;
    } catch (e) {
      console.error(`Fetch hatası (${model}):`, e);
      lastErr = e;
      continue;
    }
  }
  throw new Error(`Üretim Başarısız: ${lastErr?.message || 'Bilinmeyen hata'}`);
}

async function testApiStatus() {
  const apiKey = document.getElementById('apiKey').value.trim() || localStorage.getItem('soruai_key');
  if (!apiKey) { showToast('⚠️ Önce API anahtarını girin', 'warn'); return; }
  
  showToast('🔍 API Test ediliyor...');
  try {
    const res = await callGemini(apiKey, "Sadece 'BAĞLANTI TAMAM' yaz.");
    showToast('✨ BAĞLANTI BAŞARILI!', 'success');
    showError('✅ API Testi Başarılı: ' + res);
  } catch (err) {
    showError('❌ Test Sırasında Hata: ' + err.message);
  }
}

// ─── PARSE ───
function parseQuestions(raw) {
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    return parsed.questions || [];
  } catch (e) { return []; }
}

// ─── RENDER KITAPÇIK ───
function renderExamQuestions(questions) {
  const output = document.getElementById('questionsOutput');
  output.classList.remove('hidden');
  document.getElementById('emptyState').classList.add('hidden');
  
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
    if (q.bolumName !== currentBolum) {
      currentBolum = q.bolumName;
      const header = document.createElement('div');
      header.className = 'bolum-header';
      header.innerHTML = `<span>${currentBolum.toUpperCase()}</span>`;
      output.appendChild(header);
    }

    const card = document.createElement('div');
    card.className = 'q-card';
    card.innerHTML = `
      <div class="q-card-header">
        <div class="q-number">${i + 1}</div>
        <div class="q-meta"><span class="q-exam">${q.bolumName}</span></div>
      </div>
      <div class="q-body">
        <div class="q-visual" id="visual-${i}"></div>
        <p class="q-text">${escHtml(q.text)}</p>
        <div class="q-options">
          ${Object.keys(q.options).map(key => `
            <div class="q-option" onclick="this.classList.toggle('active')" id="opt-${i}-${key}">
              <span class="opt-letter">${key}</span>
              <span>${escHtml(q.options[key])}</span>
            </div>
          `).join('')}
        </div>
        <div class="q-solution" id="sol-${i}">
          <div class="solution-title">Doğru Cevap: ${q.answer}</div>
          <div class="solution-text">${escHtml(q.solution)}</div>
        </div>
      </div>
      <div class="q-actions">
        <button class="btn-reveal" onclick="document.getElementById('sol-${i}').classList.toggle('visible')">💡 Çözüm</button>
      </div>
    `;
    output.appendChild(card);
    if (q.visual_type && q.visual_type !== 'none') renderVisual(q, `visual-${i}`);
  });
}

function renderVisual(q, containerId) {
  const container = document.getElementById(containerId);
  const vt = q.visual_type;
  const vd = q.visual_data;
  if (vt === 'table' && vd?.headers) {
    container.innerHTML = `<table class="vis-table"><thead><tr>${vd.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${vd.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  } else if (vt === 'geometry') {
    container.innerHTML = `<div class="vis-geometry">📐 ${escHtml(vd.description)}</div>`;
  }
}

function setLoading(on, step) {
  document.getElementById('loadingState').classList.toggle('hidden', !on);
  document.getElementById('loadingStep').textContent = step || '';
}

function setLoadingStep(msg) { document.getElementById('loadingStep').textContent = msg; }
function showError(msg) { 
  const output = document.getElementById('questionsOutput');
  output.classList.remove('hidden');
  document.getElementById('emptyState').classList.add('hidden');
  output.innerHTML = `<div class="error-box">❌ ${escHtml(msg)}</div>`; 
}
function showToast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }
function escHtml(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }
