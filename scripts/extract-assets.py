"""Pull every media file from indilabs.ai and extract the raster images
embedded inside its SVG wrappers. Output: public/media/ (source: indilabs.ai only)."""
import base64, os, re, subprocess, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "sources" / "raw-media"
OUT = ROOT / "sources" / "extracted"
RAW.mkdir(parents=True, exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)

bundle = urllib.request.urlopen(urllib.request.Request(
    "https://indilabs.ai/static/js/main.9f78a1eb.js", headers={"User-Agent": "Mozilla/5.0"})).read().decode("utf-8", "ignore")
paths = sorted(set(re.findall(r'static/media/[^"]+', bundle)))
for p in paths:
    dest = RAW / os.path.basename(p)
    if not dest.exists():
        url = "https://indilabs.ai/" + p.replace(" ", "%20")
        dest.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})).read())
print(f"downloaded {len(paths)} files")

def stem(name):  # drop the webpack hash: "Frame 440 (1).784fa.svg" -> "Frame 440 (1)"
    return re.sub(r"\.[0-9a-f]{16,}$", "", os.path.splitext(name)[0])

for f in sorted(RAW.iterdir()):
    if f.suffix == ".svg":
        imgs = re.findall(r'data:image/(png|jpe?g);base64,([A-Za-z0-9+/=]+)', f.read_text(errors="ignore"))
        for i, (ext, b64) in enumerate(imgs):
            name = stem(f.name).lower().replace(" ", "-").replace("(", "").replace(")", "")
            target = OUT / f"{name}{'' if len(imgs) == 1 else '-' + str(i)}.png"
            target.write_bytes(base64.b64decode(b64))
            print("extracted", target.name, subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(target)], capture_output=True, text=True).stdout.split()[-3::2])
