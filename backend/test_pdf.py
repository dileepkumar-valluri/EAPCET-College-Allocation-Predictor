
from pathlib import Path
import pdfplumber

project_root = Path(__file__).resolve().parent.parent

pdf_path = (
    project_root
    / "data"
    / "raw"
    / "TGEAPCET_2025_LASTRANKS_FirstPhase.pdf"
)

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[0]

    tables = page.extract_tables()

    print("Number of tables detected:", len(tables))

    for table_index, table in enumerate(tables[:2], start=1):
        print(f"\nTable {table_index}:")

        for row in table[:5]:
            print(row)
