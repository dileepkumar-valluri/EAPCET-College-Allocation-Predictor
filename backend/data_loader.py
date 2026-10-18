
from pathlib import Path

import pandas as pd

# Project directories
PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"

# Dataset paths
AP_DATASET = RAW_DATA_DIR / "ap_eapcet_2025_COMPLETE_engineering_last_rank_dataset.csv"
TG_DATASET = RAW_DATA_DIR / "tgeapcet_2025_all_phases_clean.csv"


def load_dataset(file_path: Path, state: str) -> pd.DataFrame:
    """Load a CSV dataset and attach its state identifier."""
    if not file_path.exists():
        raise FileNotFoundError(f"{state} dataset not found: {file_path}")

    df = pd.read_csv(file_path, encoding="utf-8-sig", dtype=str)
    df.columns = df.columns.str.strip()

    # Preserve the original columns and record the source state.
    df["state"] = state
    df["source_file"] = file_path.name

    return df


def load_all_datasets() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load AP and TG datasets separately."""
    ap_df = load_dataset(AP_DATASET, "AP")
    tg_df = load_dataset(TG_DATASET, "TG")

    return ap_df, tg_df


if __name__ == "__main__":
    ap_data, tg_data = load_all_datasets()

    print(f"AP EAPCET: {len(ap_data)} rows, {len(ap_data.columns)} columns")
    print(f"TG EAPCET: {len(tg_data)} rows, {len(tg_data.columns)} columns")

    print("\nAP columns:")
    print(ap_data.columns.tolist())

    print("\nTG columns:")
    print(tg_data.columns.tolist())
