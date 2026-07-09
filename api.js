// ─── DİNAMİK MODEL LİSTELEME ───
async function getAvailableModels(apiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
      throw new Error(`Model listesi alınamadı: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.models || !Array.isArray(data.models)) {
      throw new Error("Geçersiz API yanıtı (models dizisi bulunamadı).");
    }
    
    const filtered = data.models
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
      .map(m => {
        const cleanName = m.name.replace(/^models\//, "");
        return { name: cleanName, ver: 'v1beta' };
      });
      
    if (filtered.length === 0) {
      throw new Error("generateContent destekleyen hiçbir model bulunamadı.");
    }
    
    // Modelleri öncelik sırasına göre sırala:
    // En hızlı/güncel flash modeller en başta, pro modeller arkada olacak şekilde
    filtered.sort((a, b) => {
      const isFlashA = a.name.includes("flash") ? 1 : 0;
      const isFlashB = b.name.includes("flash") ? 1 : 0;
      if (isFlashA !== isFlashB) return isFlashB - isFlashA;
      
      const getScore = (name) => {
        if (name.includes("3.5")) return 4;
        if (name.includes("3.1")) return 3;
        if (name.includes("2.5")) return 2;
        if (name.includes("2.0")) return 1;
        return 0;
      };
      return getScore(b.name) - getScore(a.name);
    });
    
    console.log("Kullanılabilir Gemini modelleri:", filtered);
    return filtered;
  } catch (err) {
    console.warn("Modeller listelenirken hata oluştu, varsayılan liste kullanılacak:", err);
    return GEMINI_MODELS;
  }
}

// ─── GEMINI API (v1 Endpoint) ───
async function callGemini(apiKey, prompt, referenceImages = []) {
  const errors = [];
  
  // Önce API anahtarının yetkili olduğu modelleri dinamik olarak al
  let modelsList = GEMINI_MODELS;
  try {
    modelsList = await getAvailableModels(apiKey);
  } catch (e) {
    console.warn("Dinamik model listeleme başarısız, varsayılanlar kullanılacak.");
  }
  
  // Önce aktif çalışan modeli dene, yoksa listeyi sırayla tara
  const modelsToTry = [];
  if (state.activeModelObj) {
    modelsToTry.push(state.activeModelObj);
  }
  
  // Diğer modelleri ekle (mükerrerliği önlemek için filtrele)
  for (const m of modelsList) {
    if (!state.activeModelObj || m.name !== state.activeModelObj.name || m.ver !== state.activeModelObj.ver) {
      modelsToTry.push(m);
    }
  }
 
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
          console.warn(`[${model}] 429 Hız Sınırı! ${waitTime / 1000} saniye bekleniyor (Deneme ${attempts}/${maxAttempts})...`);
          showToast(`⏳ Kota limiti aşıldı, bekleniyor (${attempts}/${maxAttempts})...`, 'warn');
          await sleep(waitTime);
          continue;
        }
        
        if (!res.ok) {
          const errJson = await res.json();
          const apiMsg = errJson.error?.message || `HTTP ${res.status}`;
          const reason = errJson.error?.status || 'Unknown';
          
          modelErr = new Error(`[${model} (${ver})] ${apiMsg} (Status: ${reason})`);
          console.warn(`Model denemesi başarısız: ${modelErr.message}`);
          
          if (apiMsg.includes('API key not valid') || apiMsg.includes('invalid')) {
            throw modelErr; 
          }
          if (state.activeModelObj && state.activeModelObj.name === model && state.activeModelObj.ver === ver) {
            state.activeModelObj = null;
            localStorage.removeItem('soruai_active_model');
          }
          break; // Bu model için daha fazla deneme yapma, sonraki modele geç
        }
        
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          modelErr = new Error(`[${model} (${ver})] Boş yanıt döndü.`);
          break; // Sonraki modele geç
        }
        
        // Başarılı modeli kaydet
        if (!state.activeModelObj || state.activeModelObj.name !== model || state.activeModelObj.ver !== ver) {
          state.activeModelObj = { name: model, ver: ver };
          localStorage.setItem('soruai_active_model', JSON.stringify(state.activeModelObj));
          console.log(`Aktif çalışan model güncellendi: ${model} (${ver})`);
        }
        
        return text;
      } catch (e) {
        console.error(`Fetch hatası (${model}):`, e);
        modelErr = e;
        if (state.activeModelObj && state.activeModelObj.name === model && state.activeModelObj.ver === ver) {
          state.activeModelObj = null;
          localStorage.removeItem('soruai_active_model');
        }
        break; // Sonraki modele geç
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
    if (state.activeModelObj) {
      showToast(`⚡ Model: ${state.activeModelObj.name} (${state.activeModelObj.ver})`, 'success');
    }
  } catch (err) {
    showError('❌ Test Sırasında Hata: ' + err.message);
  }
}

// ─── IMAGEN 3 IMAGE GENERATION API ───
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

