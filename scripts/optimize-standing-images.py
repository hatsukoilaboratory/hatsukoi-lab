from pathlib import Path
from shutil import copy2
from PIL import Image

project_root = Path(__file__).resolve().parent.parent
asset_dir = project_root / "client" / "public" / "assets"
original_dir = Path("/home/ubuntu/webdev-static-assets/hatsukoi-standing-originals")
original_dir.mkdir(parents=True, exist_ok=True)

for source in sorted(asset_dir.glob("*.png")):
    if source.stem.split("_")[0] not in {"ginpatsu", "kouhai", "bokukko", "douki", "haishinsha", "ai", "mizuki", "koito", "natsu"}:
        continue
    copy2(source, original_dir / source.name)
    destination = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.save(destination, "WEBP", quality=92, method=6)
    print(f"{source.name} -> {destination.name}")
