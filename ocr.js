async function processReferenceFiles(files) {
  const parts = [];
  const referenceField = document.getElementById('referenceText');
  
  // Her dosya seçiminde referans resimleri temizleyip yeniden yüklüyoruz
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
        // Hem OCR çalıştırıp metni çıkar, hem de resmi doğrudan Gemini'ye yollamak için base64 olarak kaydet
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
    console.warn('PDF metin çıkarılamadı:', err);
    return '';
  }
}

async function extractImageText(file) {
  if (typeof Tesseract === 'undefined') return '';
  try {
    const result = await Tesseract.recognize(file, 'turkish');
    return result?.data?.text?.trim() || '';
  } catch (err) {
    console.warn('Görsel metni okunamadı:', err);
    return '';
  }
}
