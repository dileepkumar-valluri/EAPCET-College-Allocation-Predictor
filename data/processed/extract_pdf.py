from pathlib import Path
import csv
import pdfplumber

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"

PDF_FILES = {
    "TGEAPCET_2025_LASTRANKS_FirstPhase.pdf":
        "TG_EAPCET_2025_First_Phase.csv",

    "TGEAPCET_2025_LASTRANKS_SecondPhase.pdf":
        "TG_EAPCET_2025_Second_Phase.csv",

    "TGEAPCET_2025_FINALPHASE_LASTRANKS.pdf":
        "TG_EAPCET_2025_Final_Phase.csv",
}


def clean_cell(value):
    if value is None:
        return "NA"

    value = " ".join(value.split())

    return value if value else "NA"


def extract_pdf(pdf_name, csv_name):
    pdf_path = RAW_DIR / pdf_name
    csv_path = OUTPUT_DIR / csv_name

    if not pdf_path.exists():
        print(f"FILE NOT FOUND: {pdf_name}")
        return

    headers = None
    data_rows = []
    skipped_rows = 0

    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            tables = page.extract_tables()

            for table in tables:
                if not table:
                    continue

                if headers is None:
                    headers = [clean_cell(cell) for cell in table[0]]

                for row in table[1:]:
                    cleaned = [clean_cell(cell) for cell in row]

                    if len(cleaned) != len(headers):
                        skipped_rows += 1
                        continue

                    # Skip repeated header rows.
                    if cleaned == headers:
                        continue

                    data_rows.append(cleaned)

    if not headers or not data_rows:
        print(f"NO DATA EXTRACTED: {pdf_name}")
        return

    with csv_path.open(
        "w", newline="", encoding="utf-8-sig"
    ) as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(data_rows)

    print(f"\nPDF: {pdf_name}")
    print(f"Rows extracted: {len(data_rows)}")
    print(f"Columns: {len(headers)}")
    print(f"Rows skipped: {skipped_rows}")
    print(f"CSV saved: {csv_path.name}")


if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for pdf_name, csv_name in PDF_FILES.items():
        extract_pdf(pdf_name, csv_name)

    print("\nTG EAPCET PDF extraction finished.")
