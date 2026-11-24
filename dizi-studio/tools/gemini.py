#!/usr/bin/env python3
"""Gemini işçisi: Claude (lider) görevi verir, Gemini yazar, Claude kontrol eder.

Anahtar ortamın ağ sırrında durur (generativelanguage.googleapis.com, Authorization: Bearer);
proxy ekler, bu betik anahtarı hiç görmez. Ücretsiz katman kotası geçerlidir.

Örnek:
  python3 tools/gemini.py "Bu bileşene göz kırpma ekle" --dosya src/x.tsx --cikis /tmp/x.tsx --kod
  echo "özetle" | python3 tools/gemini.py - --dosya docs/a.md
"""
import argparse, json, os, ssl, sys, time, urllib.request, urllib.error

URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
SISTEM = (
    "Sen Remotion/React (TypeScript) ile dikey animasyon dizisi üreten bir ekipte kıdemli bir yazılımcısın. "
    "Görevi eksiksiz yap, kısaltma ve '...' bırakma. Türkçe değişken adlarını koru. "
    "Kod istenirse yalnız tam dosya içeriğini döndür, açıklama yazma."
)


def ctx():
    for yol in (os.environ.get("SSL_CERT_FILE"), os.environ.get("REQUESTS_CA_BUNDLE"), "/root/.ccr/ca-bundle.crt"):
        if yol and os.path.exists(yol):
            return ssl.create_default_context(cafile=yol)
    return ssl.create_default_context()


def main():
    a = argparse.ArgumentParser()
    a.add_argument("gorev", help="görev metni; '-' ise stdin")
    a.add_argument("--dosya", action="append", default=[], help="bağlam dosyası (birden çok)")
    a.add_argument("--cikis", help="cevabı bu dosyaya yaz")
    a.add_argument("--kod", action="store_true", help="``` çitlerini ayıkla")
    a.add_argument("--model", default="gemini-2.5-flash")
    a.add_argument("--sistem", default=SISTEM)
    x = a.parse_args()

    gorev = sys.stdin.read() if x.gorev == "-" else x.gorev
    for d in x.dosya:
        gorev += f"\n\n=== DOSYA: {d} ===\n" + open(d, encoding="utf-8").read()

    govde = json.dumps({"model": x.model, "messages": [
        {"role": "system", "content": x.sistem}, {"role": "user", "content": gorev}]}).encode()
    for deneme in range(4):
        req = urllib.request.Request(URL, govde, {"Content-Type": "application/json",
                                                  "Authorization": "Bearer proxy-injected"})
        try:
            with urllib.request.urlopen(req, timeout=600, context=ctx()) as r:
                d = json.load(r)
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:400]
            if e.code in (429, 500, 503) and deneme < 3:
                print(f"[gemini] {e.code}, {10 * (deneme + 1)} sn sonra tekrar", file=sys.stderr)
                time.sleep(10 * (deneme + 1)); continue
            sys.exit(f"[gemini] HTTP {e.code}: {msg}")

    metin = d["choices"][0]["message"]["content"] or ""
    if x.kod and "```" in metin:
        parca = metin.split("```")
        if len(parca) >= 3:
            metin = parca[1].split("\n", 1)[1] if "\n" in parca[1] else parca[1]
    u = d.get("usage", {})
    print(f"[gemini] {x.model} · giriş {u.get('prompt_tokens')} · çıkış {u.get('completion_tokens')} token",
          file=sys.stderr)
    if x.cikis:
        open(x.cikis, "w", encoding="utf-8").write(metin)
        print(f"[gemini] yazıldı: {x.cikis} ({len(metin)} karakter)", file=sys.stderr)
    else:
        print(metin)


if __name__ == "__main__":
    main()
