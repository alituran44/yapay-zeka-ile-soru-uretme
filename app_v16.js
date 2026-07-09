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
  renderBanners();
  startBannerRotation();
});

// ─── NAVIGATION ───
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sectionEl = document.getElementById('section-' + name);
  if (sectionEl) sectionEl.classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
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
  const apiKeyEl = document.getElementById('apiKey');
  const key = apiKeyEl ? apiKeyEl.value.trim() : '';
  if (key) {
    localStorage.setItem('soruai_key', key);
    showToast('✅ API anahtarı kaydedildi');
  }
}

function saveKeyFromSettings() {
  const settingsKeyEl = document.getElementById('apiKeySettings');
  const key = settingsKeyEl ? settingsKeyEl.value.trim() : '';
  if (key) {
    localStorage.setItem('soruai_key', key);
    const mainKeyInp = document.getElementById('apiKey');
    if (mainKeyInp) mainKeyInp.value = key;
    showToast('✅ API anahtarı kaydedildi');
  }
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
  
  state.questions = []; // Sıfırla
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
        
        // Her istek öncesinde 2 saniyelik güvenli bekleme (429'u önlemek için)
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
  const tarz = zorluk === 'ÖSYM Tarzı' ? 'Yeni Nesil Beceri Temelli' : 'Standart Kazanım Odaklı';

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
LGS (Liselere Geçiş Sınavı) ÖZEL YÖNERGELERİ:
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
