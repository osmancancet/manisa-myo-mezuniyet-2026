#!/bin/bash
# ============================================================================
#  MEZUNİYET TÖRENİ — MÜZİK İNDİRME ARACI
#  Tüm tören + kutlama müziklerini net adlarla "Muzik-Dosyalari/" klasörüne
#  indirir. Ses ekibine bu klasörü olduğu gibi verebilirsiniz.
#
#  KULLANIM: Bu dosyaya Finder'da çift tıklayın  (ya da Terminal'de çalıştırın)
#  Not: İnternet gerekir. Kurulum gerektirmez (yt-dlp tek dosya indirilir).
# ============================================================================
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/Muzik-Dosyalari"
BIN="$HERE/.bin"
YTDLP="$BIN/yt-dlp"

echo "════════════════════════════════════════════════════════"
echo "  🎓  MEZUNİYET TÖRENİ — MÜZİK İNDİRME"
echo "════════════════════════════════════════════════════════"
mkdir -p "$BIN" "$OUT/01-Toren" "$OUT/02-Kutlama"

# ---- yt-dlp hazırla (sistemde varsa onu, yoksa taşınabilir sürümü indir) ----
if command -v yt-dlp >/dev/null 2>&1; then
  YTDLP="$(command -v yt-dlp)"
elif [ ! -x "$YTDLP" ]; then
  echo "→ İndirme motoru (yt-dlp) hazırlanıyor… (tek seferlik, ~30 MB)"
  if ! curl -L --fail --progress-bar \
        -o "$YTDLP" \
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"; then
    echo "✗ yt-dlp indirilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin."
    read -r -p "Çıkmak için Enter…" _; exit 1
  fi
  chmod +x "$YTDLP"
fi

# ---- biçim: ffmpeg varsa MP3, yoksa M4A (dönüştürme gerektirmez) ----
if command -v ffmpeg >/dev/null 2>&1; then
  FMT=(-x --audio-format mp3 --audio-quality 0); KALITE="MP3"
else
  FMT=(-f "bestaudio[ext=m4a]/bestaudio"); KALITE="M4A"
  echo "ℹ️  ffmpeg yok → dosyalar .m4a olarak inecek (sorunsuz çalar)."
fi
echo "   Biçim: $KALITE"

OK=0; FAIL=0
dl() {  # klasör  numara  ad  youtubeID
  local folder="$1" num="$2" name="$3" id="$4"
  printf "  ⬇️  %s - %s … " "$num" "$name"
  if "$YTDLP" -q --no-warnings --no-playlist "${FMT[@]}" \
       -o "$OUT/$folder/$num - $name.%(ext)s" \
       "https://www.youtube.com/watch?v=$id" 2>/dev/null; then
    echo "✓"; OK=$((OK+1))
  else
    echo "✗ (atlandı)"; FAIL=$((FAIL+1))
  fi
}

echo
echo "── 1) TÖREN MÜZİKLERİ ──────────────────────────────────"
dl 01-Toren 01 "Mezunlar Gecidi - Giris Muzigi"            EHkdxDVMKOA
dl 01-Toren 02 "Dereceler - Belge Takdimi"                 yRh-dzrI4Z4
dl 01-Toren 03 "Temsili Diploma - Esra Hoca ozel parca"    dW9xbFLaatU
dl 01-Toren 04 "Kep Atma - We Are The Champions (Queen)"   04854XqcfCY

echo
echo "── 2) KUTLAMA / HALAY LİSTESİ ──────────────────────────"
dl 02-Kutlama 01 "Erik Dali Gevrektir"                     P4a65mbm2xM
dl 02-Kutlama 02 "Ankaranin Baglari - Ankarali Coskun"     Q2LwcYHBCj0
dl 02-Kutlama 03 "Yerinde Dur - Sefo & Demet Akalin"       _NoTqg152B0
dl 02-Kutlama 04 "Yakar Gecerim - Ajda Pekkan"             Xpp_y2Os5Co
dl 02-Kutlama 05 "Balikesir Ciftetellisi"                  RMdfDibP6ao
dl 02-Kutlama 06 "Karisik Ciftetelli (45 dk)"              S03ceB1vseo
dl 02-Kutlama 07 "Ciftetelli Potpori (15 dk)"              sV2AzDPH46Y
dl 02-Kutlama 08 "Ankara Oyun Havalari (30 dk)"            TLzkOZhkpuk
dl 02-Kutlama 09 "Omrum - Oyun Havasi"                     YaJYZVPnBl0
dl 02-Kutlama 10 "Misket - Ankara"                         Bz0pHK44yvI
dl 02-Kutlama 11 "Fidayda - Hudayda - Ankara"              FQ4dacmQvsg
dl 02-Kutlama 12 "Ankara Oyun Havasi Potpori (30 dk)"      lZ6qcQnghYc
dl 02-Kutlama 13 "Roman Oyun Havasi"                       oQdYo2XYGrc

echo
echo "── 3) GENİŞ OYUN HAVASI KATALOĞU (46) ──────────────────"
dls() {  # klasör  numara  ad  arama-sorgusu  (YouTube'da adıyla aranır)
  printf "  ⬇️  %s - %s … " "$2" "$3"
  if "$YTDLP" -q --no-warnings --no-playlist "${FMT[@]}" \
       -o "$OUT/$1/$2 - $3.%(ext)s" "ytsearch1:$4" 2>/dev/null; then
    echo "✓"; OK=$((OK+1)); else echo "✗ (atlandı)"; FAIL=$((FAIL+1)); fi; }
dls 03-OyunHavalari 01 "Erik Dali"             "Erik Dalı oyun havası"
dls 03-OyunHavalari 02 "Ankaranin Baglari"     "Ankaranın Bağları oyun havası"
dls 03-OyunHavalari 03 "Yerinde Dur"           "Yerinde Dur Sefo Demet Akalın"
dls 03-OyunHavalari 04 "Yakar Gecerim"         "Yakar Geçerim Ajda Pekkan"
dls 03-OyunHavalari 05 "Omrum"                 "Ömrüm oyun havası"
dls 03-OyunHavalari 06 "Misket"                "Misket Ankara oyun havası"
dls 03-OyunHavalari 07 "Fadime"                "Fadime Ankara oyun havası"
dls 03-OyunHavalari 08 "Hulya"                 "Hülya Ankara oyun havası"
dls 03-OyunHavalari 09 "Yandim Seker"          "Yandım Şeker oyun havası"
dls 03-OyunHavalari 10 "Fidayda"               "Fidayda Ankara oyun havası"
dls 03-OyunHavalari 11 "Hudayda"               "Hüdayda Ankara oyun havası"
dls 03-OyunHavalari 12 "Yarim Istanbulu"       "Yarim İstanbul'u oyun havası"
dls 03-OyunHavalari 13 "Rampi Rampi"           "Rampi Rampi oyun havası"
dls 03-OyunHavalari 14 "Ciftetelli"            "Çiftetelli oyun havası"
dls 03-OyunHavalari 17 "Esmerim"               "Esmerim Biçim Biçim oyun havası"
dls 03-OyunHavalari 18 "Madimak"               "Madımak oyun havası"
dls 03-OyunHavalari 19 "Tamzara"               "Tamzara halay"
dls 03-OyunHavalari 20 "Delilo"                "Delilo halay"
dls 03-OyunHavalari 21 "Diyarbakir Halayi"     "Diyarbakır Halayı"
dls 03-OyunHavalari 22 "Govend"                "Govend halay"
dls 03-OyunHavalari 23 "Harmandali"            "Harmandalı zeybek"
dls 03-OyunHavalari 24 "Sari Zeybek"           "Sarı Zeybek"
dls 03-OyunHavalari 25 "Bergama Zeybegi"       "Bergama Zeybeği"
dls 03-OyunHavalari 26 "Izmir Zeybegi"         "İzmir Zeybeği"
dls 03-OyunHavalari 27 "Horon"                 "Horon karadeniz oyun havası"
dls 03-OyunHavalari 28 "Karadeniz Oyun Havasi" "Karadeniz oyun havası"
dls 03-OyunHavalari 29 "Sinanay"               "Şinanay oyun havası"
dls 03-OyunHavalari 30 "Mavilim"               "Mavilim oyun havası"
dls 03-OyunHavalari 31 "Hoplaya Hoplaya"       "Hoplaya Hoplaya oyun havası"
dls 03-OyunHavalari 32 "Drama Koprusu"         "Drama Köprüsü rumeli"
dls 03-OyunHavalari 33 "Vardar Ovasi"          "Vardar Ovası rumeli"
dls 03-OyunHavalari 34 "Sallana Sallana"       "Sallana Sallana oyun havası"
dls 03-OyunHavalari 35 "Nare"                  "Nare halay"
dls 03-OyunHavalari 36 "Dello"                 "Dello halay"
dls 03-OyunHavalari 37 "Halay Potpori"         "Halay potpori"
dls 03-OyunHavalari 38 "Cekirge"               "Çekirge oyun havası"
dls 03-OyunHavalari 39 "Koroglu"               "Köroğlu halk oyunu"
dls 03-OyunHavalari 40 "Karsilama"             "Karşılama trakya oyun havası"
dls 03-OyunHavalari 41 "Damdan Dama"           "Damdan Dama oyun havası"
dls 03-OyunHavalari 42 "Kina Havasi"           "Kına Havası"
dls 03-OyunHavalari 43 "Cokertme"              "Çökertme zeybek"
dls 03-OyunHavalari 44 "Cakici Zeybegi"        "Çakıcı zeybeği"
dls 03-OyunHavalari 45 "Telgrafin Telleri"     "Telgrafın Telleri Ankara oyun havası"
dls 03-OyunHavalari 46 "Entarisi Ala Benziyor" "Entarisi Ala Benziyor oyun havası"
dls 03-OyunHavalari 47 "Haci Arap"             "Hacı Arap Ankara oyun havası"
dls 03-OyunHavalari 48 "Cezayir"               "Cezayir Ankara oyun havası"

# ---- ses ekibi için OKUNBENI ----
cat > "$OUT/OKUNBENI.txt" <<'TXT'
MEZUNİYET TÖRENİ — MÜZİK DOSYALARI (Ses Ekibi İçin)
====================================================

KLASÖR 01-Toren  → Tören sırasıyla:
  01  Mezunlar Geçidi Giriş Müziği  → Mezunlar alana girip yerlerini alırken.
  02  Dereceler / Belge Takdimi     → Plaket, başarı belgeleri ve TSO hediye
                                       çeki takdiminde (aynı parça sürer).
  03  Temsili Diploma (Esra Hoca)   → Mezuniyet belgeleri takdiminde; YALNIZCA
                                       Dijital Dönüşüm programında. Diğer
                                       programlarda talep yoksa 01 (Giriş) çalın.
  04  Kep Atma (We Are the Champions)→ Geri sayım + kep atma anında.

KLASÖR 02-Kutlama → Tören bitince SIRAYLA çalınacak ana liste (13 parça).
KLASÖR 03-OyunHavalari → Geniş oyun havası/halay/zeybek kataloğu (46 parça,
  numaralı). Sırayla ya da seçerek çalınır.

NOT: MEZUNİYET ŞARKIMIZ.mp3 (okulun hazırladığı özel parça) bu araçla İNMEZ;
  ayrıca eklenir. Tören öncesi alanda çalınacak.

ÖNEMLİ NOTLAR:
  • İSTİKLAL MARŞI bu pakette YOKTUR — ayrı, hazır kayıttan çalınır (alan ses
    sistemi). Saygı duruşunda tam sessizlik.
  • Tören öncesi (alan dolarken) MEZUNİYET ŞARKIMIZ çalar + perdede MYO tanıtım
    sunumu oynar; tören başlayınca durdurulur.
  • Marş ve konuşmalardan önce çalan müziğin kapatıldığından emin olun.

Detaylı akış için: Muzik-Akis-Raporu.pdf
TXT

echo
echo "════════════════════════════════════════════════════════"
echo "  ✅ BİTTİ — İndi: $OK   Atlandı: $FAIL"
echo "  📁 Klasör: $OUT"
echo "  → Bu klasörü olduğu gibi ses ekibine verebilirsiniz."
echo "════════════════════════════════════════════════════════"
open "$OUT" 2>/dev/null || true
read -r -p "Kapatmak için Enter…" _
