
from pathlib import Path
import pandas as pd

project_root = Path(__file__).resolve().parent.parent

csv_path = (
    project_root
    / "data"
    / "processed"
    / "Tg_Eapcet_2025_First_Phase.csv"
)

df = pd.read_csv(csv_path)

rank_columns = [
    column for column in df.columns
    if "BOYS" in column
]

missing_rows = df[df[rank_columns].isna().any(axis=1)]

print("Rows with missing boys' ranks:", len(missing_rows))

print("\nAffected college and branch details:")

print(
    missing_rows[
        ["Inst Code", "Institute Name", "Branch Code", "Branch Name"]
    ].to_string(index=False)
)
