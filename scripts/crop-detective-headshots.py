from pathlib import Path
from PIL import Image

source_dir = Path("/home/ubuntu/webdev-static-assets/hatsukoi-detective-source")
output_dir = Path("/home/ubuntu/webdev-static-assets/hatsukoi-detective")
output_dir.mkdir(parents=True, exist_ok=True)

# 道庭は顔と髪、鳴海は探偵帽と顔が入る正方形へ切り出す。
crops = {
    "michiba-top-headshot.webp": ("michiba-source.png", (278, 32, 618, 372)),
    "narumi-top-headshot.webp": ("narumi-source.png", (210, 16, 510, 316)),
}

for output_name, (source_name, box) in crops.items():
    with Image.open(source_dir / source_name) as image:
        image.crop(box).resize((420, 420), Image.Resampling.LANCZOS).save(output_dir / output_name, "WEBP", quality=92, method=6)
