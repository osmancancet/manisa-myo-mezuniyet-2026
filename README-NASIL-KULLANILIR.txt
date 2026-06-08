═══════════════════════════════════════════════════════════════════════════
  MANİSA TEKNİK BİLİMLER MYO — 2026 MEZUNİYET TÖRENİ SUNUMU  (Next.js)
  Nasıl Kullanılır?
═══════════════════════════════════════════════════════════════════════════

EKRANLAR (sunucu elle ilerletir):
  1) Açılış   2) Yürüyüş (program program)   3) Dereceler (BÖLÜM bölüm)
  4) Kapanış  5) Kutlama / Halay (müzikli)

KONTROLLER:
  →  / Boşluk / tıklama → İleri      ←  → Geri
  1 2 3 4 5 → ekrana atla            F → tam ekran   B → karart   H → yardım
  (Prova: adres sonuna #dereceler3 gibi yazıp doğrudan o ekrana gidebilirsin.)


───────────────────────────────────────────────────────────────────────────
A) ÇALIŞTIRMA
───────────────────────────────────────────────────────────────────────────
Bu bir Next.js projesidir. Terminalde proje klasöründe:

  • Geliştirme/önizleme:   npm install   (ilk sefer)   →   npm run dev
    Tarayıcıda  http://localhost:3000  aç.

  • Yayına hazır (statik):  npm run build   →   "out/" klasörü oluşur.
    Bu klasör her yere yüklenebilir / internetsiz de sunulabilir.


───────────────────────────────────────────────────────────────────────────
B) DERECE FOTOĞRAFI EKLEME   ← en sık iş
───────────────────────────────────────────────────────────────────────────
Fotoğrafları  public/photos/honor/  klasörüne, ÖĞRENCİNİN TAM ADIYLA koy.
Dosya adı, lib/data.js'teki adla BİREBİR aynı olmalı (Türkçe harfler olur).
Örnek dosya adı:  Mehmet AŞUROĞLU.jpg

Şu an beklenen dosya adları (.jpg):
  Muhammet Emin DOĞAN.jpg        Ulaş Arda KÖYLÜ.jpg
  Ezgi BUDAK.jpg                 Berkay TEKDAL.jpg
  Melek GÖKÇE.jpg                Yunus ÖZLÜK.jpg
  Enise Sude DEĞİRMENCİ.jpg      Mehmet AŞUROĞLU.jpg
  Arda Yılmaz BODUR.jpg          Önder ÇELİK.jpg
  Kemal KARA.jpg                 Halis Emir TURAN.jpg
  Derin Aslı BAYGUT.jpg          Tuğba VELİOĞULLARI.jpg
  Azra HANÇERLİOĞULLARI.jpg      Ceren CAŞKIR.jpg
  Aydan ALOĞLU.jpg               Ayşegül ÖZZEYBEK.jpg
  Hatice SOĞANCI.jpg
  (Fotoğraf yoksa otomatik siluet görünür; eksik kimseyi bozmaz.)

Not: Bir öğrenci hem okul hem bölüm derecesindeyse aynı dosya iki yerde
kullanılır — tek dosya koyman yeterli.


───────────────────────────────────────────────────────────────────────────
C) DERECE VERİSİNİ DÜZENLEME (isim/derece/program)
───────────────────────────────────────────────────────────────────────────
lib/data.js  →  HONORS bölümü. Her grup bir bölüm (veya "okul" geneli).
Her satır:  H(derece, "öğrenciNo", "Ad SOYAD", "Program Adı")
  • Beraberlik için aynı dereceyi iki kez yaz (örn. iki tane 3.).
  • Verisi gelmeyen bölümler boş [] bırakılırsa "yakında" yazısı çıkar.
  • Bir grubu tamamen gizlemek için o G(...) satırını // ile başlat.


───────────────────────────────────────────────────────────────────────────
D) YÜRÜYÜŞ (ARKA PLAN) FOTOĞRAFLARI
───────────────────────────────────────────────────────────────────────────
public/photos/procession/<program-klasörü>/  içine  01.jpg 02.jpg 03.jpg ...
Kaç tane koyarsan o kadarı arka planda döner. Klasör adları küçük harf/tireli
(örn. grafik-tasarimi). Tam liste lib/data.js → programs içinde.


───────────────────────────────────────────────────────────────────────────
E) KUTLAMA MÜZİĞİ (iki mod, Kutlama ekranında üstten seçilir)
───────────────────────────────────────────────────────────────────────────
• YouTube (online):  Hazır 10 gerçek oyun havası/halay sırayla çalar
  (internet gerekir). Kendi listeni kullanmak için lib/data.js →
  MUSIC.youtubePlaylistUrl alanına YouTube çalma listesi linkini yapıştır.
  ⚠️ Törenden önce bir kez test et (yükleyen gömmeyi kapatmış olabilir).

• Yerel MP3 (offline, ekolayzerli):  public/music/ klasörüne
  01.mp3 ... 40.mp3 koy. (Liste sırası lib/data.js → MUSIC.tracks)
  ⚠️ Telif nedeniyle şarkı dosyaları pakette GELMEZ; bunları sen eklersin.


───────────────────────────────────────────────────────────────────────────
F) YAYINLAMA (link almak)
───────────────────────────────────────────────────────────────────────────
• EN KOLAY (Next'e özel):  vercel.com → projeyi içe aktar → otomatik link.
• Statik olarak her yere:  npm run build  → oluşan "out/" klasörünü
  Netlify Drop / GitHub Pages / herhangi bir statik sunucuya yükle.
• Törende internetsiz:  "out/" klasörünü yerel bir sunucuyla aç
  (ör.  python3 -m http.server --directory out 8000  → http://localhost:8000).
  (YouTube müzik moduna internet gerekir; offline için MP3 modunu kullan.)


───────────────────────────────────────────────────────────────────────────
G) NOTLAR
───────────────────────────────────────────────────────────────────────────
• Eski basit (tek dosya) sürüm _statik-yedek/ klasöründe duruyor (yedek).
• Bu yıl mezun veren 6 bölüm var (Bilgisayar, Elektrik-Enerji, Elektronik,
  İnşaat, İstatistik, Makine-Metal) — toplam 11 program. Kimya, Otomotiv ve
  Grafik Tasarımı mezun vermediği için çıkarıldı. Yeni program/bölüm eklemek
  için lib/data.js → programs ve HONORS listelerine ekleyebilirsin.
═══════════════════════════════════════════════════════════════════════════
