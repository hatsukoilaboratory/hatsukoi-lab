from pathlib import Path

from PIL import Image


SOURCE_DIR = Path("/home/ubuntu/webdev-static-assets")
OUTPUT_DIR = SOURCE_DIR / "hatsukoi-webp"
SOURCES = (
    "hatsukoi-lab-hero-paper.png",
    "hatsukoi-lab-heart-stamp.png",
    "hatsukoi-lab-note-tab.png",
    "hatsukoi-lab-roster-paper.png",
    "heroines-generation-two-pair-clean.png",
    "commission-takenoshita-chiharu.png",
    "commission-takanashi-rina.png",
)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name in SOURCES:
        source_path = SOURCE_DIR / name
        with Image.open(source_path) as image:
            image.convert("RGBA").save(
                OUTPUT_DIR / f"{source_path.stem}.webp",
                "WEBP",
                quality=88,
                method=6,
            )


if __name__ == "__main__":
    main()
