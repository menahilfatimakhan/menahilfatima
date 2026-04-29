import fitz
doc = fitz.open("Portfolio Website.pdf")
text = ""
for page in doc:
    text += page.get_text()
with open("pdf_content.txt", "w", encoding="utf-8") as f:
    f.write(text)
print(f"Extracted {len(text)} characters from {len(doc)} pages")
