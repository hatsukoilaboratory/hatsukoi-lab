from pathlib import Path

from PIL import Image


SOURCE_DIR = Path("/home/ubuntu/webdev-static-assets/hatsukoi-detective-chibis/doutei_tantei_chibi_renamed")
OUTPUT_DIR = Path("/home/ubuntu/webdev-static-assets/hatsukoi-detective-chibis/webp")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for source_path in sorted(SOURCE_DIR.glob("*.png")):
        with Image.open(source_path) as image:
            image.convert("RGBA").save(
                OUTPUT_DIR / f"{source_path.stem}.webp",
                "WEBP",
                quality=90,
                method=6,
            )


if __name__ == "__main__":
    main()
