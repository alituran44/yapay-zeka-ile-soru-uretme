// ─── GLOBAL STATE ───
const state = {
  exam: 'TYT',
  diff: 'Orta',
  opts: '4',
  count: 3,
  visualType: 'auto',
  kazanimlar: [],   // Çoklu kazanım
  questions: [],
  saved: JSON.parse(localStorage.getItem('soruai_saved') || '[]'),
  banners: JSON.parse(localStorage.getItem('soruai_banners') || '[]'),
  referenceImages: [], // Multimodal referans resimleri
  mode: 'manual', // 'manual' or 'deneme'
  activeModelObj: JSON.parse(localStorage.getItem('soruai_active_model') || 'null')
};

// ─── VARSAYILAN BANNERLAR ───
const DEFAULT_BANNERS = [
  {
    id: 'default_1',
    title: 'SoruAI Premium',
    subtitle: 'Yapay zeka ile LGS, TYT ve AYT sınavlarına %100 uyumlu soru kitapçıkları üretin.',
    badge: 'Öne Çıkan',
    image: '', 
    color: 'linear-gradient(135deg, #6c63ff, #a78bfa)'
  },
  {
    id: 'default_2',
    title: 'Yeni Nesil Sorular',
    subtitle: 'Resmi kazanımlarla tam uyumlu, yeni nesil ve beceri temelli şık görsel çizim desteği.',
    badge: 'LGS & YKS',
    image: '',
    color: 'linear-gradient(135deg, #0ea5e9, #38bdf8)'
  },
  {
    id: 'default_3',
    title: 'Ders Tamamlandı!',
    subtitle: 'En son çözdüğünüz Matematik testinin analizine grafikler sayfasından erişebilirsiniz.',
    badge: 'Harika İlerleme',
    image: '',
    color: 'linear-gradient(135deg, #10b981, #34d399)'
  }
];

// ─── MODEL LİSTESİ ───
const GEMINI_MODELS = [
  { name: 'gemini-3.5-flash',       ver: 'v1beta' },
  { name: 'gemini-2.5-flash',       ver: 'v1beta' },
  { name: 'gemini-2.0-flash',       ver: 'v1beta' },
  { name: 'gemini-2.5-pro',         ver: 'v1beta' }
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
