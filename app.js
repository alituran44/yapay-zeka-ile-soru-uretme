// ─── MODEL LİSTESİ ───
const GEMINI_MODELS = [
  { name: 'gemini-1.5-flash', ver: 'v1beta' },
  { name: 'gemini-1.5-pro',   ver: 'v1beta' }
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

// ─── ZORLUK REHBERİ (Prompt için) ───
const DIFF_GUIDE = {
  'Kolay': {
    hint: 'Kolay: tanım/formülün doğrudan uygulandığı, tek adımlı, kısa sorular.',
    rule: `- Soru TEK bir kazanımı test etmeli ve TEK işlem/adımda çözülmeli.
- Metin kısa ve doğrudan olmalı, ekstra senaryo/bağlam ekleme.`
  },
  'Orta': {
    hint: 'Orta: iki kavramın birleştiği, kısa senaryolu, tek adımda çözülemeyen sorular.',
    rule: `- Soru EN AZ İKİ farklı kazanımı veya iki işlemi art arda birleştirmeli (örn. önce oran-orantı, sonra yüzde).
- Kısa bir gerçek-hayat bağlamı (senaryo) kullan ama gereksiz uzatma.
- Öğrenci ilk okuyuşta cevabı göremesin; en az 2 adımlık çözüm gereksin.`
  },
  'Zor': {
    hint: 'Zor: en az 3 adımlı çözüm gerektiren, birden fazla kazanımı bir arada kullanan, sayısal işlem yoğun sorular.',
    rule: `- Soru EN AZ ÜÇ ayrı adım/çıkarım gerektirmeli; ara sonuçlar bir sonraki adımın girdisi olmalı.
- Birden fazla kazanımı (örn. cebir + geometri, ya da kimyada mol + yüzde bileşim) aynı soruda birleştir.
- Sayısal olarak öğrenciyi zorlayacak ama elle çözülebilir değerler kullan (çok büyük/anlamsız sayılardan kaçın).
- Dikkat dağıtıcı (gereksiz ama gerçekçi) en az bir veri ekle; öğrenci hangi verinin gerekli olduğunu ayırt etmeli.`
  },
  'Yeni Nesil': {
    hint: 'Yeni Nesil: uzun bir okuma parçası/grafik/tablo temelli, gerçek hayat bağlamlı, çıkarım gerektiren sorular.',
    rule: `- Soru, ÖSYM'nin "yeni nesil / beceri temelli" formatına uygun olmalı: bir metin, grafik, tablo veya günlük hayat durumu SUN, sonra bu veriye dayanan bir soru sor.
- Ezber bilgiyle değil, verilen veriyi YORUMLAYARAK çözülmeli.
- visual_type alanını "none" bırakma; mümkünse table, bar_chart, line_chart veya geometry kullanarak sorunun dayandığı veriyi görselleştir.
- Şıklardan en az ikisi, veriyi yanlış yorumlayan öğrencinin seçebileceği şekilde kurgulanmalı.`
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
};

// ─── KAZANIM HARİTASI (ders → konular) ───
const KAZANIM_MAP = {
  'Türkçe': ['Paragrafta Ana Düşünce','Paragrafta Yardımcı Düşünce','Sözcükte Anlam','Cümlede Anlam','Deyim ve Atasözleri','Metin Türleri','Noktalama İşaretleri','Yazım Kuralları','Fiil Çatısı','Sözcük Türleri','Cümle Türleri','Okuduğunu Anlama'],
  'Matematik': ['Sayılar ve İşlemler','Doğal Sayılar','Tam Sayılar','Kesirler','Ondalık Sayılar','Oran-Orantı','Yüzdeler','Denklemler','Eşitsizlikler','Fonksiyonlar','Olasılık','İstatistik','Mantık','Sayı Dizileri'],
  'Geometri': ['Üçgenler','Dörtgenler','Çokgenler','Çember ve Daire','Katı Cisimler','Koordinat Geometrisi','Analitik Geometri','Dönüşüm Geometrisi','Vektörler'],
  'Fizik': ['Kuvvet ve Hareket','Enerji','Dalgalar','Elektrik','Manyetizma','Optik','Modern Fizik','Termodinamik'],
  'Kimya': ['Atom Yapısı','Periyodik Sistem','Kimyasal Bağlar','Mol Kavramı','Çözeltiler','Kimyasal Tepkemeler','Organik Kimya','Asit-Baz'],
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

// Dersler bu kategoriye giriyorsa görsel/grafik/şekil üretimi teşvik edilir
const VISUAL_FRIENDLY_DERSLER = new Set([
  'Matematik','Temel Matematik','Geometri','Fizik','Kimya','Biyoloji','Fen Bilimleri',
  'Coğrafya','Sayısal Yetenek','Sözel','Sayısal'
]);

// ─── STATE ───
const state = {
  exam: 'TYT',
  diff: 'Orta',
  opts: '4',
  count: 3,
  kazanimlar: [],
  questions: [],
  saved: JSON.parse(localStorage.getItem('soruai_saved') || '[]'),
  mode: 'manual',
  charts: [] // Chart.js örneklerini takip et (temizlemek için)
};

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('soruai_key');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
  }
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
  const apiKey = document.getElementById('apiKey').value.trim() || localStorage.getItem('soruai_key');
  if (!apiKey) { showToast('⚠️ Lütfen Gemini API anahtarını girin', 'warn'); return; }

  const config = SINAV_CONFIG[state.exam];
  if (!config) { showToast('⚠️ Sınav konfigürasyonu bulunamadı', 'error'); return; }

  const gorsel = document.getElementById('gorselToggle').checked;
  const optCount = state.opts;

  state.questions = [];
  destroyAllCharts();
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
  const guide = DIFF_GUIDE[zorluk] || DIFF_GUIDE['Orta'];
  const gorselUygun = VISUAL_FRIENDLY_DERSLER.has(ders);

  const visualSchema = `
GÖRSEL ŞEMASI (visual_type alanına göre visual_data'yı DOLDUR):
- "none": visual_data: {}
- "table": visual_data: { "headers": ["Sütun1","Sütun2"], "rows": [["a","b"],["c","d"]] }
- "bar_chart": visual_data: { "labels": ["Ocak","Şubat"], "datasets": [{ "label": "Seri Adı", "data": [10, 20] }] }
- "line_chart": visual_data: { "labels": ["t1","t2","t3"], "datasets": [{ "label": "Seri Adı", "data": [1,2,3] }] }
- "geometry": visual_data: {
    "shape": "triangle" | "rectangle" | "circle" | "coordinate",
    "points": [ { "id": "A", "x": 0, "y": 0, "label": "A" }, { "id": "B", "x": 4, "y": 0, "label": "B" }, ... ],
    "segments": [ ["A","B"], ["B","C"] ],
    "circle": { "centerId": "O", "radius": 3 },
    "measurements": [ { "type": "length", "from": "A", "to": "B", "value": "6 cm" }, { "type": "angle", "at": "B", "value": "90°" } ]
  }
  (x,y koordinatlarını basit tam sayılarla ver, şeklin orantısı gerçekçi olsun.)`;

  const gorselKurali = gorsel && gorselUygun
    ? `- Bu ders görselleştirmeye uygun. Sorularının EN AZ %40'ında visual_type'ı "none" DIŞINDA bir değer yap (uygun olanı: table/bar_chart/line_chart/geometry) ve soruyu o görsele dayandır.`
    : gorsel
      ? `- Görsel destek açık ama bu ders çoğunlukla metinsel; sadece gerçekten anlamlı olduğunda (ör. tablo/kronoloji) görsel kullan, zorlama.`
      : `- Görsel destek kapalı; tüm sorularda visual_type: "none" kullan.`;

  return `Türkiye'deki resmi ${exam} sınavı için uzman bir soru komisyonu üyesisin (MEB/ÖSYM standartlarına hakim, deneyimli bir öğretmensin).
Görev: ${ders} bölümü için ${count} adet ÖZGÜN soru hazırlaman gerekiyor.

ZORLUK SEVİYESİ: ${zorluk}
${guide.rule}

GENEL KURALLAR:
- Bölüm: ${ders}
- Soru Sayısı: ${count}
- Seçenekler: ${optLabels}
- Sorular bilimsel/matematiksel açıdan %100 doğru olmalı; çözümü elle/hesap makinesiyle doğrulanabilir olmalı.
- Aynı deneme içinde soruları birbirinin kopyası yapma; her biri farklı bir kazanımı veya farklı bir senaryoyu kullansın.
- Her yanlış şık (distractor) RASTGELE olmamalı; öğrencinin yapabileceği SPESİFİK bir hesap/kavram hatasını yansıtmalı. Bu hatayı "misconceptions" alanında kısaca açıkla.
${gorselKurali}
${visualSchema}

MUTLAKA SADECE JSON DÖNDÜR, başka hiçbir metin ekleme:
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
      "solution": "Adım adım çözüm (zorluk seviyesine uygun adım sayısında)...",
      "misconceptions": { "B": "Bu şık neden cazip bir yanlış: ...", "C": "...", "D": "..." }
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
            generationConfig: { temperature: 0.85, maxOutputTokens: 8192 },
          }),
        }
      );
      if (!res.ok) {
        const errJson = await res.json();
        const apiMsg = errJson.error?.message || `HTTP ${res.status}`;
        const reason = errJson.error?.status || 'Unknown';

        lastErr = new Error(`[${model}] ${apiMsg} (Status: ${reason})`);
        console.warn(`Model denemesi başarısız: ${lastErr.message}`);

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

    const misconceptionsHtml = q.misconceptions
      ? Object.entries(q.misconceptions).map(([k, v]) => `<div class="mis-item"><b>${k}:</b> ${escHtml(v)}</div>`).join('')
      : '';

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
          ${misconceptionsHtml ? `<div class="solution-mis"><div class="solution-title" style="margin-top:10px;">Neden diğer şıklar yanlış?</div>${misconceptionsHtml}</div>` : ''}
        </div>
      </div>
      <div class="q-actions">
        <button class="btn-reveal" onclick="document.getElementById('sol-${i}').classList.toggle('visible')">💡 Çözüm</button>
      </div>
    `;
    output.appendChild(card);
    if (q.visual_type && q.visual_type !== 'none') renderVisual(q, `visual-${i}`, i);
  });
}

// ─── GERÇEK GÖRSEL RENDER (Chart.js + SVG Geometri) ───
function destroyAllCharts() {
  state.charts.forEach(c => { try { c.destroy(); } catch (e) {} });
  state.charts = [];
}

function renderVisual(q, containerId, idx) {
  const container = document.getElementById(containerId);
  const vt = q.visual_type;
  const vd = q.visual_data || {};

  if (vt === 'table' && vd.headers && vd.rows) {
    container.innerHTML = `<table class="vis-table"><thead><tr>${vd.headers.map(h => `<th>${escHtml(h)}</th>`).join('')}</tr></thead><tbody>${vd.rows.map(r => `<tr>${r.map(c => `<td>${escHtml(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    return;
  }

  if ((vt === 'bar_chart' || vt === 'line_chart') && vd.labels && vd.datasets) {
    container.innerHTML = `<div class="vis-chart-wrap"><canvas id="chart-${idx}"></canvas></div>`;
    const ctx = document.getElementById(`chart-${idx}`).getContext('2d');
    const palette = ['#6c63ff', '#a78bfa', '#38bdf8', '#34d399', '#f59e0b'];
    const chart = new Chart(ctx, {
      type: vt === 'bar_chart' ? 'bar' : 'line',
      data: {
        labels: vd.labels,
        datasets: vd.datasets.map((ds, i) => ({
          label: ds.label || `Seri ${i + 1}`,
          data: ds.data,
          backgroundColor: vt === 'bar_chart' ? palette[i % palette.length] : 'rgba(108,99,255,0.15)',
          borderColor: palette[i % palette.length],
          borderWidth: 2,
          tension: 0.3,
          fill: vt === 'line_chart'
        }))
      },
      options: {
        responsive: true,
        plugins: { legend: { display: vd.datasets.length > 1, labels: { color: '#a0a0b8' } } },
        scales: {
          x: { ticks: { color: '#a0a0b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#a0a0b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
    state.charts.push(chart);
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
