from PyPDF2 import PdfReader
pdf_path = r"d:\BAHAN UJICOBA\Web Translate Bahasa Madura\kdb-a-merged.pdf"
out_path = r"d:\BAHAN UJICOBA\Web Translate Bahasa Madura\kdb-a-merged.txt"
reader = PdfReader(pdf_path)
parts = []
for i, page in enumerate(reader.pages):
    txt = page.extract_text() or ""
    parts.append(txt)
full = "\n\n".join(parts)
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(full)
print(f"Saved text to: {out_path} (pages: {len(reader.pages)})")
# print small sample
lines = full.splitlines()
for i, line in enumerate(lines[:200]):
    print(f"{i+1:03}: {line}")
