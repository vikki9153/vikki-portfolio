import sys
import os
import subprocess

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    from pypdf import PdfReader, PdfWriter


def update_metadata(infile, title):
    reader = PdfReader(infile)
    writer = PdfWriter()
    for p in reader.pages:
        writer.add_page(p)

    # preserve existing metadata and set Title
    existing = reader.metadata or {}
    new_meta = {}
    for k, v in existing.items():
        new_meta[k] = v
    new_meta['/Title'] = title
    writer.add_metadata(new_meta)

    tmp_out = infile + ".tmp"
    with open(tmp_out, "wb") as f:
        writer.write(f)
    os.replace(tmp_out, infile)
    print(f"Updated: {infile}")


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python update_pdf_metadata.py <pdf-path> <title>")
        sys.exit(1)
    pdf = sys.argv[1]
    title = sys.argv[2]
    update_metadata(pdf, title)
