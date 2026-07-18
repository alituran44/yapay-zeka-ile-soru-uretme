// ─── MODEL LİSTESİ ───
const GEMINI_MODELS = [
  { name: 'gemini-2.5-flash',       ver: 'v1beta' },
  { name: 'gemini-2.0-flash',       ver: 'v1beta' },
  { name: 'gemini-1.5-flash',       ver: 'v1' },
  { name: 'gemini-1.5-pro',         ver: 'v1' },
  { name: 'gemini-1.5-flash',       ver: 'v1beta' },
  { name: 'gemini-1.5-pro',         ver: 'v1beta' }
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
  const savedKey = localStorage.getItem('soruai_key');
  if (savedKey) {
    const apiKeyEl = document.getElementById('apiKey');
    if (apiKeyEl) apiKeyEl.value = savedKey;
    const settingsKey = document.getElementById('apiKeySettings');
    if (settingsKey) settingsKey.value = savedKey;
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

        const raw = await callGemini(apiKey, prompt, state.referenceImages);
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
  const tarz = zorluk === 'Yeni Nesil' || zorluk === 'ÖSYM Tarzı' ? 'Yeni Nesil Beceri Temelli' : 'Standart Kazanım Odaklı';

  const optionsTemplate = optCount === '5'
    ? `{ "A": "A seçeneği metni", "B": "B seçeneği metni", "C": "C seçeneği metni", "D": "D seçeneği metni", "E": "E seçeneği metni" }`
    : `{ "A": "A seçeneği metni", "B": "B seçeneği metni", "C": "C seçeneği metni", "D": "D seçeneği metni" }`;

  const topics = KAZANIM_MAP[ders] || [];
  const selectedTopics = [];
  if (topics.length > 0) {
    const shuffled = [...topics].sort(() => 0.5 - Math.random());
    selectedTopics.push(...shuffled.slice(0, Math.min(5, shuffled.length)));
  }
  const topicHint = selectedTopics.length > 0 ? `Lütfen şu kazanımlarla ilgili veya benzer müfredat konularından sorular üretin: ${selectedTopics.join(', ')}` : '';

  const allowedVisuals = gorsel
    ? (visualType === 'auto' ? '"bar_chart", "line_chart", "pie_chart", "image", "table", "geometry"' : `"${visualType}"`)
    : '"none"';

  const visualInstructions = gorsel
    ? `ÖNEMLİ: Ürettiğin her soru için mutlaka visual_type alanını [${allowedVisuals}] listesinden uygun bir değer olarak seçmeli ve ilgili visual_data verilerini doldurmalısın. "none" değerini kesinlikle KULLANMA. Her sorunun mutlaka bir görseli veya çizimi olmalıdır.
1. Geometri soruları için visual_type: "geometry" seçmeli ve visual_data parametrelerini şu biçimde doldurmalısın:
{
  "shape_type": "triangle" | "circle" | "rectangle" | "cylinder" | "coordinate" | "angle",
  "title": "Şekil Başlığı",
  "caption": "Şekil altı açıklaması",
  "params": {
    // "triangle" için: angle_a, angle_b, angle_c, side_ab (sol kenar), side_bc (alt kenar), side_ac (sağ kenar), label_a, label_b, label_c
    // "circle" için: radius_val (örn: "r" veya "5 cm"), angle_sector (sektör derecesi örn: "60"), label_o (varsayılan "O")
    // "rectangle" için: width_val (örn: "12 cm"), height_val (örn: "5 cm"), label_a, label_b, label_c, label_d (varsayılan: A, B, C, D)
    // "cylinder" için: radius_val (örn: "r" veya "3 cm"), height_val (örn: "h" veya "10 cm")
    // "angle" için: angle_val (örn: "45°" veya "x"), label_o, label_a, label_b
    // "coordinate" için: points (dizi: [{"x":2,"y":3,"label":"A"}]), lines (dizi: [{"from":[2,3],"to":[-1,4]}])
  }
}
2. Fen bilgisi, Türkçe veya sosyal bilgiler gibi derslerde resim, fotoğraf veya çizim gerektiren sorular için visual_type: "image" seçmeli ve visual_data parametrelerini şu biçimde doldurmalısın:
{
  "title": "Görsel Başlığı",
  "caption": "Görsel altı açıklaması",
  "prompt": "Görselin içeriğini net ve detaylı İngilizce tanımlayan prompt. Sınav kitapçığına uygun olması için siyah-beyaz çizim veya ders kitabı illüstrasyonu stilinde olmalıdır. Örn: 'A simple black and white line art vector diagram of a flower showing its parts with labels, clean white background, science textbook style'"
}
3. Grafikler ("bar_chart", "line_chart", "pie_chart") için visual_data: labels, datasets (renksiz veya siyah/mor tonlarında), title, caption değerlerini; tablolar ("table") için visual_data: headers ve rows değerlerini dön.`
    : `Bu bölüm için görsel kullanılmayacak, visual_type: "none" olarak dön.`;

  const referenceInstruction = referenceText
    ? `Aşağıdaki referans soru/metin örneklerini kullanarak benzer tarzda ama özgün yeni sorular üret. Referansları doğrudan kopyalama; sadece stil, dil, zorluk ve soru yapısı için ilham al. Bu referanslar birincil kaynak olarak kullanılmalı ve soru üretiminin temelini oluşturmalıdır. Referans metin: ${referenceText.slice(0, 4000)}`
    : '';

  let lgsExtraInstructions = '';
  if (exam === 'LGS') {
    lgsExtraInstructions = `
=========================================
LGS (Liselere Giriş Sınavı) ÖZEL YÖNERGELERİ:
- Sorular LGS 2025 formatına, MEB örnek sorularına ve kazanım kavrama testlerine %100 uyumlu olmalıdır.
- Soru Tarzı: Tamamen "Yeni Nesil" ve "Beceri Temelli" olmalıdır. Basit ezber veya tek aşamalı düz sorular YAZMA.
- Sayısal (Matematik & Fen Bilimleri) için:
  * Her soru mutlaka günlük yaşamdan bir senaryo, görsel modelleme, deney düzeneği veya şema üzerine kurulmalıdır.
  * Sorunun metni ile visual_data altındaki görsel verisi (geometrik çizim parametreleri, tablo değerleri veya Imagen promptu) birbirine mantıksal olarak tam uyumlu olmalıdır. Soruda geçen "silindir şeklindeki kutu", "ABCD karesi", "birinci kap", "fotosentez hızı grafiği" gibi tüm detaylar görsel parametrelerinde tam olarak karşılık bulmalı ve gösterilmelidir.
  * Matematik sorularında rasyonel sayılar, üslü/köklü ifadeler, çarpanlar ve katlar, cebirsel ifadeler gibi konularda işlem kalabalığı yerine akıl yürütme, analiz ve problem çözme ön planda olmalıdır.
- Sözel (Türkçe, İnkılap Tarihi, İngilizce, Din Kültürü) için:
  * Türkçe sorularında sözel mantık, infografik yorumlama, görsel okuma, paragraftan anlam çıkarma ve tablo analizi içeren görsel ağırlıklı yeni nesil sorular hazırlamalısın.
  * İnkılap Tarihi ve İngilizce sorularında harita okuma, poster/broşür analizi, konuşma balonları veya anket tabloları içeren soru tiplerini tercih etmelisin.
- Dil ve Anlatım: Ortaokul 8. sınıf öğrencisinin net bir şekilde anlayabileceği, gereksiz akademik terimlerden arındırılmış, açık, akıcı ve MEB kitapları diline tam uyumlu bir Türkçe kullanmalısın.
=========================================`;
  }

  return `Türkiye'deki resmi ${exam} sınavı için uzman bir komisyonsun.
Görev: ${ders} bölümü için ${count} adet ÖZGÜN soru hazırlaman gerekiyor. Bu sorular, sınavın ${startIndex + 1}. sorusundan ${startIndex + count}. sorusuna kadar olan kısmı temsil edecektir.

STANDARTLAR:
- Sınav: ${exam}
- Bölüm: ${ders}
- Soru Sayısı: ${count}
- Seçenekler: ${optLabels}
- Zorluk: ${tarz}
- Hatasızlık: Sorular bilimsel açıdan %100 doğru olmalı.
- Konular: ${topicHint}
- Görsel türü: ${allowedVisuals}
- ${visualInstructions}
- ${referenceInstruction ? referenceInstruction : 'Referans soru verilmedi; müfredat ve kazanım temelli özgün sorular üret.'}
${lgsExtraInstructions}

JSON ŞEMA:
{
  "questions": [
    {
      "id": 1,
      "kazanim": "Müfredat kazanımı",
      "visual_type": "none",
      "visual_data": {},
      "text": "Soru metni...",
      "options": ${optionsTemplate},
      "answer": "${optCount === '5' ? 'E' : 'D'}",
      "solution": "Adım adım çözüm..."
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

async function callImagen(apiKey, prompt) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [
            { prompt: prompt }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg"
          }
        })
      }
    );
    
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson.error?.message || `HTTP ${res.status}`;
      throw new Error(`Imagen 3 üretimi başarısız: ${errMsg}`);
    }
    
    const data = await res.json();
    const base64Bytes = data.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Bytes) {
      throw new Error("API'den resim verisi (base64) dönmedi.");
    }
    
    return `data:image/jpeg;base64,${base64Bytes}`;
  } catch (err) {
    console.error("callImagen Hatası:", err);
    throw err;
  }
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
  const title = vd.title || 'Görsel';
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
    if (vd.url && (vd.url.startsWith('http') || vd.url.startsWith('data:'))) {
      container.innerHTML = `
        <div class="vis-card" style="border: 1px solid var(--border); border-radius: 8px; padding: 12px; background: rgba(255,255,255,0.01); margin-top: 12px; text-align:center;">
          <img src="${escHtml(vd.url)}" alt="${escHtml(title)}" style="max-width:100%; border-radius:8px; max-height:280px; object-fit:contain; background:var(--bg2);" />
          ${caption ? `<div style="font-size:11px; color:var(--text3); margin-top:6px;">${escHtml(caption)}</div>` : ''}
        </div>`;
    } else if (vd.prompt) {
      const imgId = `img-${containerId}`;
      const skeletonId = `skeleton-${containerId}`;
      
      container.innerHTML = `
        <div class="vis-card" style="border: 1px solid var(--border); border-radius: 8px; padding: 12px; background: rgba(255,255,255,0.01); margin-top: 12px; text-align:center;">
          <div id="${skeletonId}" style="width: 100%; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px dashed var(--border); margin-bottom: 8px;">
            <div class="spinner" style="width: 28px; height: 28px; border-width: 2.5px; margin-bottom: 8px; border-top-color: var(--accent2);"></div>
            <span style="font-size: 11px; color: var(--text2);">Imagen 3 Görseli Üretiliyor...</span>
          </div>
          <img id="${imgId}" class="hidden" alt="${escHtml(title)}" style="max-width:100%; border-radius:8px; max-height:280px; object-fit:contain; background:var(--bg2);" />
          ${caption ? `<div style="font-size:11px; color:var(--text3); margin-top:6px;">${escHtml(caption)}</div>` : ''}
        </div>`;
        
      const apiKey = document.getElementById('apiKey')?.value.trim() || localStorage.getItem('soruai_key');
      if (apiKey) {
        callImagen(apiKey, vd.prompt)
          .then(base64Url => {
            const imgEl = document.getElementById(imgId);
            const skelEl = document.getElementById(skeletonId);
            if (imgEl && skelEl) {
              imgEl.src = base64Url;
              imgEl.classList.remove('hidden');
              skelEl.classList.add('hidden');
            }
            q.visual_data.url = base64Url;
          })
          .catch(err => {
            console.error("Görsel yüklenirken hata:", err);
            const skelEl = document.getElementById(skeletonId);
            if (skelEl) {
              skelEl.innerHTML = `
                <span style="font-size: 20px; margin-bottom: 6px;">⚠️</span>
                <span style="font-size: 11px; color: var(--red); text-align: center; padding: 0 10px; line-height: 1.4;">Görsel üretilemedi:<br/>${escHtml(err.message)}</span>
              `;
            }
          });
      } else {
        const skelEl = document.getElementById(skeletonId);
        if (skelEl) {
          skelEl.innerHTML = `<span style="font-size: 11px; color: var(--yellow);">API Anahtarı eksik, görsel üretilemedi.</span>`;
        }
      }
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
