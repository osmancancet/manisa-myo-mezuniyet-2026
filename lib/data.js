/* ============================================================================
   MEZUNİYET TÖRENİ — VERİ DOSYASI (Next.js)
   Manisa Teknik Bilimler Meslek Yüksekokulu — 2026

   ⚠️  Düzenlemen gereken tek dosya burası. (Bkz. README-NASIL-KULLANILIR.txt)
   Yollar "/" ile başlar çünkü dosyalar "public/" klasöründedir.
============================================================================ */

/* ----------------------------------------------------------------------------
   1) PROGRAMLAR  — "Yürüyüş / Geçit" ekranında program program kullanılır.
      (Arka planda dönen yürüyüş fotoğrafları için.)
---------------------------------------------------------------------------- */
function proc(slug, count = 25) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    list.push(`/photos/procession/${slug}/${String(i).padStart(2, "0")}.jpg`);
  }
  return list;
}
// Ekleri tek yerden uygula: program adları "... Programı", bölümler "... Bölümü".
const withProgram = (s) => (s && !/Programı$/.test(s) ? `${s} Programı` : s);
const withDept = (s) => (s && !/Bölümü$/.test(s) ? `${s} Bölümü` : s);

function P(slug, name, department) {
  return { slug, name: withProgram(name), department: withDept(department), active: true, procession: proc(slug) };
}

export const CEREMONY_DATA = {
  school: {
    name: "Manisa Teknik Bilimler Meslek Yüksekokulu",
    shortName: "Manisa Teknik Bilimler MYO",
    university: "Manisa Celal Bayar Üniversitesi",
    year: 2026,
    introTitle: "2026 Mezuniyet Töreni",
    introSubtitle: "Mezunlarımızı gururla uğurluyoruz",
    closingTitle: "Yolunuz Açık Olsun",
    closingSubtitle: "Yolunuz açık olsun",
    closingMessage: "Nice emek, nice umutla bugüne geldiniz. Bir yolculuk tamamlandı; önünüzde aydınlık nice yıllar var. Hakkınız helal olsun, yolunuz hep açık olsun.",
    quote: "Eğitimdir ki bir milleti ya özgür, bağımsız, şanlı, yüce bir toplum hâlinde yaşatır; ya da onu tutsaklığa ve yoksulluğa sürükler.",
    quoteAuthor: "Mustafa Kemal Atatürk",
    logo: "/assets/logo.png",
  },
  placeholderPhoto: "/assets/placeholder-student.svg",
  processionPhotoIntervalMs: 5000,

  // SIRA: Resmi tören metnindeki Mezunlar Geçidi sırası (İnşaat → … → Bilgisayar).
  programs: [
    P("insaat-teknolojisi",                   "İnşaat Teknolojisi",                   "İnşaat"),
    P("buyuk-veri-analistligi",               "Büyük Veri Analistliği",               "İstatistik"),
    P("makine",                               "Makine",                               "Makine ve Metal Teknolojileri"),
    P("makine-resim-ve-konstruksiyon",        "Makine Resim ve Konstrüksiyonu",       "Makine ve Metal Teknolojileri"),
    P("endustriyel-kalipcilik",               "Endüstriyel Kalıpçılık",               "Makine ve Metal Teknolojileri"),
    P("imalat-yurutme-sistemleri-operatorlugu","İmalat Yürütme Sistemleri Operatörlüğü","Makine ve Metal Teknolojileri"),
    P("mekatronik",                           "Mekatronik",                           "Elektronik ve Otomasyon"),
    P("dijital-donusum-elektronigi",          "Dijital Dönüşüm Elektroniği",          "Elektronik ve Otomasyon"),
    P("elektrik",                             "Elektrik",                             "Elektrik ve Enerji"),
    P("alternatif-enerji-kaynaklari",         "Alternatif Enerji Kaynakları Teknolojisi",         "Elektrik ve Enerji"),
    P("bilgisayar-programciligi",             "Bilgisayar Programcılığı",             "Bilgisayar Teknolojileri"),
  ],
};

export const ACTIVE_PROGRAMS = CEREMONY_DATA.programs.filter((p) => p.active !== false);

/* ----------------------------------------------------------------------------
   2) DERECELER  — "Dereceler" ekranında BÖLÜM bölüm gösterilir.
      Her grup: bir bölüm (veya okul geneli). Her öğrenci: derece, ad, program, no.
      Beraberlik olabilir (örn. iki tane 3.). Boş bırakılan gruplar "yakında" gösterir.

      📷 FOTOĞRAF: public/photos/honor/ klasörüne öğrencinin tam adıyla koy:
         örn.  "Mehmet AŞUROĞLU.jpg"   (data'daki ad ile birebir aynı olmalı)
---------------------------------------------------------------------------- */
function H(rank, no, name, program) {
  return { rank, no, name, program: withProgram(program), photo: `/photos/honor/${name}.jpg` };
}
function G(key, title, subtitle, honors = []) {
  return { key, title, subtitle, honors };
}

export const HONORS = [
  G("okul", "Meslek Yüksekokulu Derecesi", "Okul Geneli", [
    H(1, "241613050", "Muhammet Emin DOĞAN", "Bilgisayar Programcılığı"),
    H(2, "241613023", "Ulaş Arda KÖYLÜ",     "Bilgisayar Programcılığı"),
    H(2, "241615025", "Ezgi BUDAK",          "Alternatif Enerji Kaynakları Teknolojisi"),
    H(3, "241606072", "Berkay TEKDAL",       "Makine"),
  ]),

  G("bilgisayar-teknolojileri", "Bilgisayar Teknolojileri Bölümü", "Bölüm Derecesi", [
    H(1, "241613050", "Muhammet Emin DOĞAN", "Bilgisayar Programcılığı"),
    H(2, "241613023", "Ulaş Arda KÖYLÜ",     "Bilgisayar Programcılığı"),
    H(3, "241613025", "Melek GÖKÇE",         "Bilgisayar Programcılığı"),
  ]),

  G("elektrik-ve-enerji", "Elektrik ve Enerji Bölümü", "Bölüm Derecesi", [
    H(1, "241615025", "Ezgi BUDAK",            "Alternatif Enerji Kaynakları Teknolojisi"),
    H(2, "241612043", "Yunus ÖZLÜK",           "Elektrik"),
    H(3, "241615006", "Enise Sude DEĞİRMENCİ", "Alternatif Enerji Kaynakları Teknolojisi"),
  ]),

  G("elektronik-ve-otomasyon", "Elektronik ve Otomasyon Bölümü", "Bölüm Derecesi", [
    H(1, "241608046", "Mehmet AŞUROĞLU",   "Mekatronik"),
    H(2, "241617026", "Arda Yılmaz BODUR", "Dijital Dönüşüm Elektroniği"),
    H(3, "241617008", "Önder ÇELİK",       "Dijital Dönüşüm Elektroniği"),
    H(3, "241608011", "Kemal KARA",        "Mekatronik"),
  ]),

  G("insaat", "İnşaat Bölümü", "Bölüm Derecesi", [
    H(1, "241603092", "Halis Emir TURAN",     "İnşaat Teknolojisi"),
    H(2, "241603065", "Derin Aslı BAYGUT",    "İnşaat Teknolojisi"),
    H(3, "241603051", "Tuğba VELİOĞULLARI",   "İnşaat Teknolojisi"),
  ]),

  G("istatistik", "İstatistik Bölümü", "Bölüm Derecesi", [
    H(1, "241616007", "Aydan ALOĞLU",     "Büyük Veri Analistliği"),
    H(2, "241616008", "Ayşegül ÖZZEYBEK", "Büyük Veri Analistliği"),
    H(3, "241616021", "Hatice SOĞANCI",   "Büyük Veri Analistliği"),
  ]),

  G("makine-ve-metal", "Makine ve Metal Teknolojileri Bölümü", "Bölüm Derecesi", [
    H(1, "241606072", "Berkay TEKDAL",            "Makine"),
    H(2, "241618029", "Azra HANÇERLİOĞULLARI",    "İmalat Yürütme Sistemleri Operatörlüğü"),
    H(3, "241618008", "Ceren CAŞKIR",             "İmalat Yürütme Sistemleri Operatörlüğü"),
  ]),

];

/* ============================================================================
   3) KUTLAMA / HALAY MÜZİĞİ
   • ONLINE (YouTube): aşağıdaki gerçek videolar sırayla çalar (internet gerekir).
     Kendi listeni kullanmak istersen youtubePlaylistUrl alanına link yapıştır.
   • OFFLINE (MP3): public/music/ klasörüne 01.mp3 ... 40.mp3 koy.
   ⚠️ Telif nedeniyle MP3 dosyaları pakette gelmez; offline için sen eklersin.
============================================================================ */
/* GERİ SAYIM HIZI — her rakam ekranda kaç milisaniye kalsın (1000 = 1 saniye).
   Sunucular yavaş sayıyorsa artır (ör. 1600). Canlı tam senkron için geri sayım
   sırasında Boşluk / → tuşuyla her rakamı elle de ilerletebilirsin. */
export const COUNTDOWN_STEP_MS = 1700;

export const MUSIC = {
  youtubePlaylistUrl: "",

  /* GERİ SAYIM ŞARKISI (kep atma anı) — hocanın istediği parça.
     Sunucular 10'dan geriye sayarken "C" tuşuyla geri sayım açılır ve bu şarkı çalar.
     • file:      İnternetsiz çalmak için public/music/champions.mp3 eklersen onu çalar.
     • youtubeId: Dosya yoksa otomatik YouTube (sadece ses) ile çalar. Başka parça
                  istersen buradaki kimliği değiştir (YouTube linkindeki v= değeri). */
  anthem: {
    title: "We Are the Champions — Queen",
    file: "/music/champions.mp3",
    youtubeId: "04854XqcfCY",
  },

  /* EKRAN MÜZİĞİ (arka planda, sadece ses, internet gerekir) — ilgili ekrana
     girince otomatik başlar, çıkınca durur. Başka parça istersen YouTube linkindeki
     v= değerini (videoId) buraya yaz.
     • procession: Öğrenciler ilk yerlerine geçerken (Mezunlar Geçidi ekranı).
     • honors:     Derecelilere belge takdimi sırasında (Dereceler ekranı). */
  procession: { title: "Mezunlar Geçidi — Giriş Müziği", youtubeId: "EHkdxDVMKOA" },
  honors:     { title: "Dereceler — Belge Takdimi Müziği", youtubeId: "yRh-dzrI4Z4" },
  // Mezunlarımızın Takdimi (temsili diploma) ekranı boyunca çalar — Esra Hoca için özel parça.
  takdim:     { title: "Mezunlarımızın Takdimi — Temsili Diploma", youtubeId: "dW9xbFLaatU" },

  // SIRA: Tören sonrası istenen açılış — Erik Dalı → Ankara'nın Bağları → Yerinde Dur →
  // Yakar Geçerim; ardından çiftetelli ve Ankara oyun havaları.
  youtubeIds: [
    // — Tören sonrası açılış (hocanın istediği sıra) —
    { id: "P4a65mbm2xM", title: "Erik Dalı Gevrektir" },
    { id: "Q2LwcYHBCj0", title: "Ankara'nın Bağları — Ankaralı Coşkun" },
    { id: "_NoTqg152B0", title: "Yerinde Dur — Sefo & Demet Akalın" },
    { id: "Xpp_y2Os5Co", title: "Yakar Geçerim — Ajda Pekkan" },
    // — Manisa / Ege: çiftetelli —
    { id: "RMdfDibP6ao", title: "Balıkesir Çiftetellisi — Harbi Çiftetelli" },
    { id: "S03ceB1vseo", title: "Karışık Çiftetelli — 45 dk Kesintisiz" },
    { id: "sV2AzDPH46Y", title: "Çiftetelli Potpori — 15 dk" },
    // — Ankara oyun havaları —
    { id: "TLzkOZhkpuk", title: "Ankara Oyun Havaları — 30 dk Kesintisiz" },
    { id: "YaJYZVPnBl0", title: "Ömrüm (Oyun Havası)" },
    { id: "Bz0pHK44yvI", title: "Misket — Ankara" },
    { id: "FQ4dacmQvsg", title: "Fidayda / Hüdayda — Ankara" },
    { id: "lZ6qcQnghYc", title: "Ankara Oyun Havası — 30 dk Potpori" },
    { id: "oQdYo2XYGrc", title: "Roman Oyun Havası" },
  ],
  tracks: [
    // — Tören sonrası açılış (hocanın istediği sıra) —
    { n: 1,  title: "Erik Dalı (Gevrek)",      artist: "Oyun Havası" },
    { n: 2,  title: "Ankara'nın Bağları",      artist: "Oyun Havası" },
    { n: 3,  title: "Yerinde Dur",             artist: "Sefo & Demet Akalın" },
    { n: 4,  title: "Yakar Geçerim",           artist: "Ajda Pekkan" },
    { n: 5,  title: "Ömrüm",                   artist: "Oyun Havası" },
    { n: 6,  title: "Misket",                  artist: "Ankara" },
    { n: 7,  title: "Fadime",                  artist: "Ankara" },
    { n: 8,  title: "Hülya",                    artist: "Ankara" },
    { n: 9,  title: "Yandım Şeker",            artist: "Oyun Havası" },
    { n: 10, title: "Fidayda",                 artist: "Ankara" },
    { n: 11, title: "Hüdayda",                 artist: "Ankara" },
    { n: 12, title: "Yarim İstanbul'u",        artist: "Oyun Havası" },
    { n: 13, title: "Rampi Rampi",             artist: "Oyun Havası" },
    { n: 14, title: "Çiftetelli",               artist: "Oyun Havası" },
    { n: 15, title: "Ağır Roman",              artist: "Roman Havası" },
    { n: 16, title: "Hamamcı Teyze",           artist: "Roman Havası" },
    { n: 17, title: "Esmerim (Biçim Biçim)",   artist: "Oyun Havası" },
    { n: 18, title: "Madımak",                  artist: "Oyun Havası" },
    { n: 19, title: "Tamzara",                  artist: "Halay" },
    { n: 20, title: "Delilo",                   artist: "Halay" },
    { n: 21, title: "Diyarbakır Halayı",       artist: "Halay" },
    { n: 22, title: "Govend",                   artist: "Halay" },
    { n: 23, title: "Harmandalı",               artist: "Ege Zeybek" },
    { n: 24, title: "Sarı Zeybek",             artist: "Zeybek" },
    { n: 25, title: "Bergama Zeybeği",         artist: "Zeybek" },
    { n: 26, title: "İzmir Zeybeği",           artist: "Zeybek" },
    { n: 27, title: "Horon",                    artist: "Karadeniz" },
    { n: 28, title: "Karadeniz Oyun Havası",   artist: "Karadeniz" },
    { n: 29, title: "Şinanay",                  artist: "Oyun Havası" },
    { n: 30, title: "Mavilim",                  artist: "Oyun Havası" },
    { n: 31, title: "Hoplaya Hoplaya",         artist: "Oyun Havası" },
    { n: 32, title: "Drama Köprüsü",           artist: "Rumeli" },
    { n: 33, title: "Vardar Ovası",            artist: "Rumeli" },
    { n: 34, title: "Sallana Sallana",         artist: "Oyun Havası" },
    { n: 35, title: "Nare",                     artist: "Halay" },
    { n: 36, title: "Dello",                    artist: "Halay" },
    { n: 37, title: "Halay Potpori",           artist: "Halay" },
    { n: 38, title: "Çekirge",                 artist: "Oyun Havası" },
    { n: 39, title: "Köroğlu",                  artist: "Halk Oyunu" },
    { n: 40, title: "Karşılama",                artist: "Trakya" },
    { n: 41, title: "Damdan Dama",             artist: "Oyun Havası" },
    { n: 42, title: "Kına Havası",             artist: "Oyun Havası" },
  ].map((t) => ({ ...t, file: `/music/${String(t.n).padStart(2, "0")}.mp3` })),
};
