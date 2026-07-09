// ─── PARSE ───
function parseQuestions(raw) {
  if (!raw) return [];
  try {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/s, '').trim();
    
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        const arrayStr = cleaned.substring(firstBracket, lastBracket + 1);
        const parsedArray = JSON.parse(arrayStr);
        return Array.isArray(parsedArray) ? parsedArray : [];
      }
      return [];
    }
    
    const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
    
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (parseError) {
      console.warn("Standart JSON parse başarısız, kurtarma deneniyor...", parseError);
      let fixedJsonStr = jsonStr
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/\\n/g, ' ')
        .trim();
      
      try {
        const parsed = JSON.parse(fixedJsonStr);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed.questions;
        }
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e2) {
        console.error("Kurtarma girişimi de başarısız:", e2);
      }
      return [];
    }
  } catch (e) {
    console.error("parseQuestions hatası:", e);
    return [];
  }
}

// ─── RENDER KITAPÇIK ───
function renderExamQuestions(questions) {
  const output = document.getElementById('questionsOutput');
  if (!output) return;
  
  output.classList.remove('hidden');
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.classList.add('hidden');
  
  output.innerHTML = `
    <div class="output-toolbar">
      <h3>📚 ${escHtml(state.exam)} Deneme Kitapçığı (${questions.length} Soru)</h3>
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
      header.innerHTML = `<span>${escHtml(currentBolum.toUpperCase())}</span>`;
      output.appendChild(header);
    }

    const card = document.createElement('div');
    card.className = 'q-card';
    card.innerHTML = `
      <div class="q-card-header">
        <div class="q-number">${i + 1}</div>
        <div class="q-meta">
          <span class="q-exam">${escHtml(q.bolumName)}</span>
          ${q.kazanim ? `<span class="q-topic">${escHtml(q.kazanim)}</span>` : ''}
        </div>
      </div>
      <div class="q-body">
        <div class="q-visual" id="visual-${i}"></div>
        <p class="q-text">${escHtml(q.text)}</p>
        <div class="q-options">
          ${Object.keys(q.options).map(key => `
            <div class="q-option" onclick="checkOption(${i}, '${key}', '${q.answer}')" id="opt-${i}-${key}">
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
        <button class="btn-save" onclick="saveQuestion(${i})">💾 Kaydet</button>
      </div>
    `;
    output.appendChild(card);
    if (q.visual_type && q.visual_type !== 'none') renderVisual(q, `visual-${i}`);
  });
}

function renderVisual(q, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const vt = q.visual_type;
  const vd = q.visual_data;

  const title = vd?.title || (vt === 'bar_chart' ? 'Grafik' : vt === 'line_chart' ? 'Çizgi Grafiği' : vt === 'pie_chart' ? 'Pasta Grafiği' : vt === 'image' ? 'Görsel' : 'Veri');
  const caption = vd?.caption || vd?.description || '';

  if (vt === 'table' && vd?.headers) {
    container.innerHTML = `
      <div class="vis-card">
        <div class="vis-header"><span class="vis-badge">📋</span><strong>${escHtml(title)}</strong></div>
        <table class="vis-table">
          <thead>
            <tr>${vd.headers.map(h => `<th>${escHtml(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${vd.rows.map(r => `<tr>${r.map(c => `<td>${escHtml(c)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        ${caption ? `<div class="vis-caption">${escHtml(caption)}</div>` : ''}
      </div>`;
  } else if (vt === 'geometry') {
    const svgMarkup = generateGeometrySVG(vd);
    container.innerHTML = `
      <div class="vis-card">
        <div class="vis-header"><span class="vis-badge">📐</span><strong>${escHtml(title)}</strong></div>
        <div class="vis-geometry" style="display: flex; justify-content: center; padding: 12px; background: rgba(255,255,255,0.01); border-radius: 8px; color: currentColor;">
          ${svgMarkup ? svgMarkup : escHtml(vd.description || caption || 'Şekil')}
        </div>
        ${caption ? `<div class="vis-caption" style="margin-top: 8px;">${escHtml(caption)}</div>` : ''}
      </div>`;
  } else if ((vt === 'bar_chart' || vt === 'line_chart' || vt === 'pie_chart') && vd?.labels && vd?.datasets) {
    const canvasId = `chart-${containerId}`;
    container.innerHTML = `
      <div class="vis-card">
        <div class="vis-header"><span class="vis-badge">📊</span><strong>${escHtml(title)}</strong></div>
        <div class="vis-canvas-wrap"><canvas id="${canvasId}" height="220"></canvas></div>
        ${caption ? `<div class="vis-caption">${escHtml(caption)}</div>` : ''}
      </div>`;
    setTimeout(() => {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;

      const chartConfig = {
        type: vt === 'pie_chart' ? 'pie' : vt === 'line_chart' ? 'line' : 'bar',
        data: {
          labels: vd.labels,
          datasets: vd.datasets.map(ds => ({
            ...ds,
            backgroundColor: vt === 'pie_chart'
              ? ds.backgroundColor || ['#6c63ff', '#38bdf8', '#fbbf24', '#34d399', '#f87171']
              : ds.backgroundColor || (vt === 'line_chart' ? 'rgba(108, 99, 255, 0.2)' : 'rgba(108, 99, 255, 0.7)'),
            borderColor: ds.borderColor || '#6c63ff',
            borderWidth: ds.borderWidth || 2,
            tension: ds.tension || 0.3,
            fill: vt === 'line_chart'
          }))
        },
        options: {
          responsive: true,
          animation: { duration: 800 },
          plugins: {
            legend: { labels: { color: '#f1f5f9' } },
            title: { display: !!vd.title, text: vd.title, color: '#f1f5f9' }
          },
          scales: vt === 'pie_chart' ? undefined : {
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      };
      new Chart(ctx, chartConfig);
    }, 50);
  } else if (vt === 'image' && vd) {
    if (vd.url && (vd.url.startsWith('http') || vd.url.startsWith('data:'))) {
      container.innerHTML = `
        <div class="vis-card">
          <div class="vis-header"><span class="vis-badge">🖼️</span><strong>${escHtml(title)}</strong></div>
          <img src="${escHtml(vd.url)}" alt="${escHtml(vd.alt || 'Görsel')}" style="width: 100%; border-radius: 8px; max-height: 280px; object-fit: contain; background: var(--bg2);" />
          ${caption ? `<div class="vis-caption" style="margin-top: 8px;">${escHtml(caption)}</div>` : ''}
        </div>`;
    } else if (vd.prompt) {
      const imgId = `img-${containerId}`;
      const skeletonId = `skeleton-${containerId}`;
      
      container.innerHTML = `
        <div class="vis-card">
          <div class="vis-header"><span class="vis-badge">🖼️</span><strong>${escHtml(title)}</strong></div>
          <div id="${skeletonId}" style="width: 100%; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px dashed var(--border); margin-bottom: 8px;">
            <div class="spinner" style="width: 28px; height: 28px; border-width: 2.5px; margin-bottom: 8px; border-top-color: var(--accent2);"></div>
            <span style="font-size: 11px; color: var(--text2);">Yapay Zeka Görseli Üretiliyor...</span>
          </div>
          <img id="${imgId}" class="hidden" alt="${escHtml(title)}" style="width: 100%; border-radius: 8px; max-height: 280px; object-fit: contain; background: var(--bg2);" />
          ${caption ? `<div class="vis-caption" style="margin-top: 8px;">${escHtml(caption)}</div>` : ''}
        </div>`;
        
      // Asenkron olarak resmi üret
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
            // Sınavın global state'indeki soru görselini de güncelle ki kaydedildiğinde kalsın!
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
    } else {
      const svg = `<svg viewBox="0 0 320 200" class="vis-illustration" role="img" aria-label="${escHtml(title)}"><rect x="20" y="20" width="280" height="160" rx="24" fill="rgba(108,99,255,0.12)" stroke="rgba(108,99,255,0.45)"/><circle cx="108" cy="96" r="38" fill="#38bdf8" opacity="0.8"/><rect x="168" y="62" width="86" height="68" rx="16" fill="#a78bfa" opacity="0.8"/><path d="M48 154h224" stroke="rgba(255,255,255,0.4)" stroke-width="8" stroke-linecap="round"/></svg>`;
      container.innerHTML = `<div class="vis-card"><div class="vis-header"><span class="vis-badge">🖼️</span><strong>${escHtml(title)}</strong></div>${svg}${caption ? `<div class="vis-caption">${escHtml(caption)}</div>` : ''}</div>`;
    }
  }
}

// ─── INTERACTIVE & SAVE FUNCTIONS ───
function checkOption(qIndex, selectedKey, correctKey) {
  const optElSelected = document.getElementById(`opt-${qIndex}-${selectedKey}`);
  if (!optElSelected) return;

  const qCard = optElSelected.closest('.q-body');
  const optionsContainer = qCard.querySelector('.q-options');
  if (!optionsContainer || optionsContainer.classList.contains('answered')) return;
  
  optionsContainer.classList.add('answered');

  const optionKeys = ['A', 'B', 'C', 'D', 'E'];
  optionKeys.forEach(key => {
    const optEl = document.getElementById(`opt-${qIndex}-${key}`);
    if (!optEl) return;
    if (key === correctKey) {
      optEl.classList.add('correct');
    } else if (key === selectedKey) {
      optEl.classList.add('wrong');
    }
  });

  const solutionEl = document.getElementById(`sol-${qIndex}`);
  if (solutionEl) solutionEl.classList.add('visible');
}

function saveQuestion(index) {
  const q = state.questions[index];
  if (!q) return;

  const exists = state.saved.some(savedQ => savedQ.text === q.text);
  if (exists) {
    showToast('⚠️ Bu soru zaten kayıtlı.');
    return;
  }

  state.saved.push(q);
  localStorage.setItem('soruai_saved', JSON.stringify(state.saved));
  showToast('✅ Soru başarıyla kaydedildi.');
  renderSaved();
}

function renderSaved() {
  const container = document.getElementById('savedList');
  if (!container) return;

  if (state.saved.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📁</div>
        <p>Henüz kaydedilmiş soru bulunmuyor.</p>
        <p class="empty-sub">Sınav ürettikten sonra beğendiğiniz soruları kaydedebilirsiniz.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  state.saved.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    card.style.marginBottom = '20px';
    
    card.innerHTML = `
      <div class="q-card-header">
        <div class="q-number">${i + 1}</div>
        <div class="q-meta">
          <span class="q-exam">${escHtml(q.examType || 'Soru')} - ${escHtml(q.bolumName || '')}</span>
          ${q.kazanim ? `<span class="q-topic">${escHtml(q.kazanim)}</span>` : ''}
        </div>
      </div>
      <div class="q-body">
        <div class="q-visual" id="saved-visual-${i}"></div>
        <p class="q-text">${escHtml(q.text)}</p>
        <div class="q-options">
          ${Object.keys(q.options).map(key => `
            <div class="q-option" onclick="checkSavedOption(${i}, '${key}', '${q.answer}')" id="saved-opt-${i}-${key}">
              <span class="opt-letter">${key}</span>
              <span>${escHtml(q.options[key])}</span>
            </div>
          `).join('')}
        </div>
        <div class="q-solution" id="saved-sol-${i}">
          <div class="solution-title">Doğru Cevap: ${q.answer}</div>
          <div class="solution-text">${escHtml(q.solution)}</div>
        </div>
      </div>
      <div class="q-actions">
        <button class="btn-reveal" onclick="document.getElementById('saved-sol-${i}').classList.toggle('visible')">💡 Çözüm</button>
        <button class="btn-delete" onclick="deleteSavedQuestion(${i})">🗑️ Sil</button>
      </div>
    `;
    container.appendChild(card);
    if (q.visual_type && q.visual_type !== 'none') {
      renderVisual(q, `saved-visual-${i}`);
    }
  });
}

function checkSavedOption(qIndex, selectedKey, correctKey) {
  const optElSelected = document.getElementById(`saved-opt-${qIndex}-${selectedKey}`);
  if (!optElSelected) return;

  const qCard = optElSelected.closest('.q-body');
  const optionsContainer = qCard.querySelector('.q-options');
  if (!optionsContainer || optionsContainer.classList.contains('answered')) return;
  
  optionsContainer.classList.add('answered');

  const optionKeys = ['A', 'B', 'C', 'D', 'E'];
  optionKeys.forEach(key => {
    const optEl = document.getElementById(`saved-opt-${qIndex}-${key}`);
    if (!optEl) return;
    if (key === correctKey) {
      optEl.classList.add('correct');
    } else if (key === selectedKey) {
      optEl.classList.add('wrong');
    }
  });

  const solutionEl = document.getElementById(`saved-sol-${qIndex}`);
  if (solutionEl) solutionEl.classList.add('visible');
}

function deleteSavedQuestion(index) {
  state.saved.splice(index, 1);
  localStorage.setItem('soruai_saved', JSON.stringify(state.saved));
  showToast('🗑️ Soru silindi.');
  renderSaved();
}

function clearSaved() {
  if (confirm('Tüm kayıtlı soruları silmek istediğinize emin misiniz?')) {
    state.saved = [];
    localStorage.removeItem('soruai_saved');
    showToast('🗑️ Tüm kayıtlı sorular silindi.');
    renderSaved();
  }
}

// ─── GEOMETRI / DIK KARTOPU ÇİZİM MOTORU (SVG) ───
function generateGeometrySVG(vd) {
  const shape = vd.shape_type ? vd.shape_type.toLowerCase() : '';
  const p = vd.params || {};
  
  // Çizim alanı boyutları
  const width = 320;
  const height = 200;
  
  // Sınav kitapçığına uygun, yüksek kontrastlı mor/siyah tonlarında çizimler
  const stroke = 'currentColor'; // Temaya göre (koyu modda açık renk, baskıda/yazıcıda siyah)
  const fill = 'none';
  const strokeWidth = 2;
  const strokeDash = '3,3';
  
  let svgContent = '';
  
  if (shape === 'triangle') {
    const lA = escHtml(p.label_a || 'A');
    const lB = escHtml(p.label_b || 'B');
    const lC = escHtml(p.label_c || 'C');
    
    // Üçgen köşeleri koordinatları
    const ax = 160, ay = 40;
    const bx = 70, by = 160;
    const cx = 250, cy = 160;
    
    svgContent += `
      <!-- Üçgen Poligonu -->
      <polygon points="${ax},${ay} ${bx},${by} ${cx},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Köşe Etiketleri -->
      <text x="${ax}" y="${ay - 8}" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lA}</text>
      <text x="${bx - 12}" y="${by + 4}" text-anchor="end" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lB}</text>
      <text x="${cx + 12}" y="${by + 4}" text-anchor="start" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lC}</text>
    `;
    
    // Kenar Uzunlukları
    if (p.side_ab) {
      svgContent += `<text x="${(ax + bx)/2 - 15}" y="${(ay + by)/2}" text-anchor="end" font-size="11" fill="currentColor">${escHtml(p.side_ab)}</text>`;
    }
    if (p.side_ac) {
      svgContent += `<text x="${(ax + cx)/2 + 15}" y="${(ay + cy)/2}" text-anchor="start" font-size="11" fill="currentColor">${escHtml(p.side_ac)}</text>`;
    }
    if (p.side_bc) {
      svgContent += `<text x="${(bx + cx)/2}" y="${by + 16}" text-anchor="middle" font-size="11" fill="currentColor">${escHtml(p.side_bc)}</text>`;
    }
    
    // Açı Değerleri
    if (p.angle_a) {
      svgContent += `<text x="${ax}" y="${ay + 25}" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.8">${escHtml(p.angle_a)}</text>`;
    }
    if (p.angle_b) {
      svgContent += `<text x="${bx + 25}" y="${by - 10}" text-anchor="start" font-size="10" fill="currentColor" opacity="0.8">${escHtml(p.angle_b)}</text>`;
    }
    if (p.angle_c) {
      svgContent += `<text x="${cx - 25}" y="${by - 10}" text-anchor="end" font-size="10" fill="currentColor" opacity="0.8">${escHtml(p.angle_c)}</text>`;
    }
    
  } else if (shape === 'circle') {
    const lO = escHtml(p.label_o || 'O');
    const cx = 160, cy = 100, r = 60;
    
    svgContent += `
      <!-- Çember Çizgisi -->
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <!-- Merkez Noktası -->
      <circle cx="${cx}" cy="${cy}" r="3" fill="${stroke}" />
      <text x="${cx - 8}" y="${cy + 12}" text-anchor="end" font-size="11" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lO}</text>
    `;
    
    // Yarıçap Çizgisi
    svgContent += `
      <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="${strokeDash}" />
    `;
    
    if (p.radius_val) {
      svgContent += `<text x="${cx + r/2}" y="${cy - 6}" text-anchor="middle" font-size="11" fill="currentColor">${escHtml(p.radius_val)}</text>`;
    }
    
    // Açı Dilimi
    if (p.angle_sector) {
      const angleDeg = parseFloat(p.angle_sector) || 60;
      const angleRad = (angleDeg * Math.PI) / 180;
      const sx = cx + r * Math.cos(-angleRad);
      const sy = cy + r * Math.sin(-angleRad);
      
      svgContent += `
        <line x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}" stroke="${stroke}" stroke-width="1.5" />
        <!-- Açı Yayı -->
        <path d="M ${cx + 15},${cy} A 15,15 0 0,0 ${cx + 15 * Math.cos(-angleRad)},${cy + 15 * Math.sin(-angleRad)}" fill="none" stroke="currentColor" stroke-width="1" />
        <text x="${cx + 20}" y="${cy - 8}" text-anchor="start" font-size="10" fill="currentColor" opacity="0.8">${angleDeg}°</text>
      `;
    }
    
  } else if (shape === 'rectangle' || shape === 'square') {
    const lA = escHtml(p.label_a || 'D');
    const lB = escHtml(p.label_b || 'C');
    const lC = escHtml(p.label_c || 'B');
    const lD = escHtml(p.label_d || 'A');
    
    const rx = 80, ry = 50;
    const rw = 160, rh = 100;
    
    svgContent += `
      <!-- Dikdörtgen Kutusu -->
      <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Köşe Etiketleri -->
      <text x="${rx - 10}" y="${ry + 10}" text-anchor="end" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lD}</text>
      <text x="${rx + rw + 10}" y="${ry + 10}" text-anchor="start" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lC}</text>
      <text x="${rx + rw + 10}" y="${ry + rh - 2}" text-anchor="start" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lB}</text>
      <text x="${rx - 10}" y="${ry + rh - 2}" text-anchor="end" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lA}</text>
    `;
    
    if (p.width_val) {
      svgContent += `<text x="${rx + rw/2}" y="${ry - 8}" text-anchor="middle" font-size="11" fill="currentColor">${escHtml(p.width_val)}</text>`;
    }
    if (p.height_val) {
      svgContent += `<text x="${rx + rw + 8}" y="${ry + rh/2 + 4}" text-anchor="start" font-size="11" fill="currentColor">${escHtml(p.height_val)}</text>`;
    }
    
  } else if (shape === 'cylinder') {
    const cx = 160, cy = 50, rx = 50, ry = 15, h = 100;
    
    svgContent += `
      <!-- Üst Elips -->
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Yan Çizgiler -->
      <line x1="${cx - rx}" y1="${cy}" x2="${cx - rx}" y2="${cy + h}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx + rx}" y1="${cy}" x2="${cx + rx}" y2="${cy + h}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Alt Yaylar (Ön ve Arka) -->
      <path d="M ${cx - rx},${cy + h} A ${rx},${ry} 0 0,0 ${cx + rx},${cy + h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <path d="M ${cx - rx},${cy + h} A ${rx},${ry} 0 0,1 ${cx + rx},${cy + h}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="${strokeDash}" />
      
      <!-- Yarıçap ve Merkez Noktası -->
      <line x1="${cx}" y1="${cy + h}" x2="${cx + rx}" y2="${cy + h}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="${strokeDash}" />
      <circle cx="${cx}" cy="${cy + h}" r="2.5" fill="${stroke}" />
    `;
    
    if (p.radius_val) {
      svgContent += `<text x="${cx + rx/2}" y="${cy + h - 4}" text-anchor="middle" font-size="10" fill="currentColor">${escHtml(p.radius_val)}</text>`;
    }
    if (p.height_val) {
      svgContent += `
        <!-- Yükseklik Boyut Ölçüsü -->
        <line x1="${cx + rx + 15}" y1="${cy}" x2="${cx + rx + 15}" y2="${cy + h}" stroke="currentColor" stroke-width="1" opacity="0.6" />
        <line x1="${cx + rx + 10}" y1="${cy}" x2="${cx + rx + 20}" y2="${cy}" stroke="currentColor" stroke-width="1" opacity="0.6" />
        <line x1="${cx + rx + 10}" y1="${cy + h}" x2="${cx + rx + 20}" y2="${cy + h}" stroke="currentColor" stroke-width="1" opacity="0.6" />
        <text x="${cx + rx + 22}" y="${cy + h/2 + 4}" text-anchor="start" font-size="11" fill="currentColor">${escHtml(p.height_val)}</text>
      `;
    }
    
  } else if (shape === 'angle') {
    const lO = escHtml(p.label_o || 'O');
    const lA = escHtml(p.label_a || 'A');
    const lB = escHtml(p.label_b || 'B');
    
    const ox = 90, oy = 140;
    const ax = 240, ay = 140;
    const bx = 200, by = 50;
    
    svgContent += `
      <!-- Kollar -->
      <line x1="${ox}" y1="${oy}" x2="${ax}" y2="${ay}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${ox}" y1="${oy}" x2="${bx}" y2="${by}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Nokta Etiketleri -->
      <text x="${ox - 10}" y="${oy + 4}" text-anchor="end" font-size="12" font-family="sans-serif" font-weight="bold" fill="${stroke}">${lO}</text>
      <text x="${ax}" y="${ay + 16}" text-anchor="middle" font-size="11" fill="currentColor">${lA}</text>
      <text x="${bx + 8}" y="${by + 4}" text-anchor="start" font-size="11" fill="currentColor">${lB}</text>
      
      <!-- Açı Yayı -->
      <path d="M ${ox + 25},${oy} A 25,25 0 0,0 ${ox + 22},${oy - 12}" fill="${fill}" stroke="currentColor" stroke-width="1.5" />
    `;
    
    if (p.angle_val) {
      svgContent += `<text x="${ox + 35}" y="${oy - 8}" text-anchor="start" font-size="11" fill="currentColor" opacity="0.8">${escHtml(p.angle_val)}</text>`;
    }
    
  } else if (shape === 'coordinate') {
    const ox = 160, oy = 100;
    
    svgContent += `
      <!-- X ve Y Eksen Çizgileri -->
      <line x1="30" y1="${oy}" x2="290" y2="${oy}" stroke="${stroke}" stroke-width="1.5" />
      <line x1="${ox}" y1="180" x2="${ox}" y2="20" stroke="${stroke}" stroke-width="1.5" />
      
      <!-- Eksen Ok Başları -->
      <polygon points="290,${oy-4} 298,${oy} 290,${oy+4}" fill="currentColor" />
      <polygon points="${ox-4},20 ${ox},12 ${ox+4},20" fill="currentColor" />
      
      <!-- Eksen Etiketleri -->
      <text x="295" y="${oy + 14}" text-anchor="end" font-size="10" font-family="sans-serif" font-weight="bold" fill="${stroke}">x</text>
      <text x="${ox - 10}" y="22" text-anchor="end" font-size="10" font-family="sans-serif" font-weight="bold" fill="${stroke}">y</text>
      <text x="${ox - 8}" y="${oy + 12}" text-anchor="end" font-size="9" fill="currentColor" opacity="0.6">0</text>
    `;
    
    // Noktalar
    if (Array.isArray(p.points)) {
      p.points.forEach(pt => {
        const px = ox + (pt.x * 20); // Eksen Ölçeği: 1 birim = 20px
        const py = oy - (pt.y * 20);
        
        svgContent += `
          <circle cx="${px}" cy="${py}" r="3" fill="var(--accent, #6c63ff)" />
          <line x1="${px}" y1="${py}" x2="${px}" y2="${oy}" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" opacity="0.4" />
          <line x1="${px}" y1="${py}" x2="${ox}" y2="${py}" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" opacity="0.4" />
          <text x="${px + 5}" y="${py - 5}" font-size="10" font-family="sans-serif" font-weight="bold" fill="${stroke}">${escHtml(pt.label || '')}(${pt.x},${pt.y})</text>
        `;
      });
    }
    
    // Eksen Üzerindeki Doğrular
    if (Array.isArray(p.lines)) {
      p.lines.forEach(ln => {
        if (Array.isArray(ln.from) && Array.isArray(ln.to)) {
          const x1 = ox + (ln.from[0] * 20);
          const y1 = oy - (ln.from[1] * 20);
          const x2 = ox + (ln.to[0] * 20);
          const y2 = oy - (ln.to[1] * 20);
          
          svgContent += `
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--accent2, #a78bfa)" stroke-width="2" />
          `;
        }
      });
    }
  } else {
    return null;
  }
  
  return `<svg viewBox="0 0 320 200" style="display: block; margin: 0 auto; max-width: 100%; height: auto; color: currentColor;">${svgContent}</svg>`;
}

// ─── BANNER / DUYURU YÖNETİMİ ───
let currentSlideIndex = 0;
let carouselTimer = null;

function renderBanners() {
  const container = document.getElementById('carouselContainer');
  const indicators = document.getElementById('carouselIndicators');
  const adminList = document.getElementById('settingsBannersList');
  
  if (!container) return;
  
  const activeBanners = state.banners && state.banners.length > 0 ? state.banners : DEFAULT_BANNERS;
  
  // 1. Carousel Container
  container.innerHTML = activeBanners.map((b, idx) => {
    const bgStyle = b.image 
      ? `background-image: url('${b.image}');` 
      : `background: ${b.color || 'linear-gradient(135deg, #6c63ff, #a78bfa)'};`;
      
    return `
      <div class="carousel-slide" style="${bgStyle}">
        <div class="carousel-slide-overlay"></div>
        <div class="carousel-slide-content">
          ${b.badge ? `<span class="carousel-badge">${escHtml(b.badge)}</span>` : ''}
          <h2 class="carousel-title">${escHtml(b.title)}</h2>
          <p class="carousel-subtitle">${escHtml(b.subtitle)}</p>
        </div>
      </div>
    `;
  }).join('');
  
  // 2. Carousel Indicators
  if (indicators) {
    indicators.innerHTML = activeBanners.map((_, idx) => `
      <div class="carousel-dot ${idx === currentSlideIndex ? 'active' : ''}" onclick="setCarouselSlide(${idx})"></div>
    `).join('');
  }
  
  // 3. Settings Admin List
  if (adminList) {
    if (!state.banners || state.banners.length === 0) {
      adminList.innerHTML = `
        <div class="empty-state" style="min-height: 100px; padding: 20px; border-style: solid; border-width: 1px;">
          <p style="font-size: 13px; color: var(--text3);">Henüz özel banner yüklemediniz. Sistemdeki varsayılan tanıtım bannerları gösteriliyor.</p>
        </div>
      `;
    } else {
      adminList.innerHTML = state.banners.map((b, idx) => `
        <div class="banner-admin-card">
          <div class="banner-admin-preview" style="${b.image ? `background-image: url('${b.image}');` : `background: ${b.color || '#6c63ff'};`}"></div>
          <div class="banner-admin-info">
            ${b.badge ? `<span class="banner-admin-badge">${escHtml(b.badge)}</span>` : ''}
            <div class="banner-admin-title">${escHtml(b.title)}</div>
            <div class="banner-admin-subtitle">${escHtml(b.subtitle)}</div>
          </div>
          <button class="btn-delete" onclick="deleteBanner('${b.id}')">🗑️ Sil</button>
        </div>
      `).join('');
    }
  }
}

function startBannerRotation() {
  if (carouselTimer) clearInterval(carouselTimer);
  
  const activeBanners = state.banners && state.banners.length > 0 ? state.banners : DEFAULT_BANNERS;
  if (activeBanners.length <= 1) return;
  
  carouselTimer = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function moveCarousel(direction) {
  const container = document.getElementById('carouselContainer');
  if (!container) return;
  
  const activeBanners = state.banners && state.banners.length > 0 ? state.banners : DEFAULT_BANNERS;
  const count = activeBanners.length;
  if (count <= 1) return;
  
  currentSlideIndex = (currentSlideIndex + direction + count) % count;
  updateCarouselPosition();
}

function setCarouselSlide(index) {
  currentSlideIndex = index;
  updateCarouselPosition();
  startBannerRotation();
}

function updateCarouselPosition() {
  const container = document.getElementById('carouselContainer');
  const indicators = document.getElementById('carouselIndicators');
  if (!container) return;
  
  container.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  
  if (indicators) {
    indicators.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }
}

async function addNewBanner() {
  const badgeEl = document.getElementById('bannerBadge');
  const titleEl = document.getElementById('bannerTitle');
  const subtitleEl = document.getElementById('bannerSubtitle');
  const fileEl = document.getElementById('bannerImageFile');
  
  const badge = badgeEl ? badgeEl.value.trim() : '';
  const title = titleEl ? titleEl.value.trim() : '';
  const subtitle = subtitleEl ? subtitleEl.value.trim() : '';
  
  if (!title || !subtitle) {
    showToast('⚠️ Lütfen en azından Başlık ve Açıklama alanlarını doldurun.', 'warn');
    return;
  }
  
  let imageBase64 = '';
  if (fileEl && fileEl.files && fileEl.files[0]) {
    try {
      imageBase64 = await readFileAsBase64(fileEl.files[0]);
    } catch (e) {
      showToast('❌ Resim dosyası okunamadı.', 'error');
      return;
    }
  }
  
  const gradients = [
    'linear-gradient(135deg, #6c63ff, #a78bfa)',
    'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #f43f5e, #fda4af)',
    'linear-gradient(135deg, #f59e0b, #fcd34d)',
    'linear-gradient(135deg, #8b5cf6, #c084fc)'
  ];
  const randomColor = gradients[Math.floor(Math.random() * gradients.length)];
  
  const newBanner = {
    id: 'banner_' + Date.now(),
    title: title,
    subtitle: subtitle,
    badge: badge,
    image: imageBase64,
    color: randomColor
  };
  
  if (!state.banners) state.banners = [];
  state.banners.push(newBanner);
  localStorage.setItem('soruai_banners', JSON.stringify(state.banners));
  showToast('✅ Banner başarıyla eklendi.');
  
  if (badgeEl) badgeEl.value = '';
  if (titleEl) titleEl.value = '';
  if (subtitleEl) subtitleEl.value = '';
  if (fileEl) fileEl.value = '';
  
  currentSlideIndex = state.banners.length - 1;
  renderBanners();
  updateCarouselPosition();
  startBannerRotation();
}

function deleteBanner(id) {
  state.banners = state.banners.filter(b => b.id !== id);
  localStorage.setItem('soruai_banners', JSON.stringify(state.banners));
  showToast('🗑️ Banner silindi.');
  
  currentSlideIndex = 0;
  renderBanners();
  updateCarouselPosition();
  startBannerRotation();
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
