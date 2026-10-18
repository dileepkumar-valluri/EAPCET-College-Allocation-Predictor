
import pandas as pd

from backend.data_loader import load_all_datasets


ap_df, tg_df = load_all_datasets()

print("\n========== AP SOURCE COLUMNS ==========")
print(ap_df.columns.tolist())

print("\n========== TG SOURCE COLUMNS ==========")
print(tg_df.columns.tolist())


def inspect_columns(df, state):
    print(f"\n========== {state} CUTOFF AUDIT ==========")

    for category in [
        "OC", "BC_A", "BC_B", "BC_C", "BC_D",
        "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"
    ]:
        for gender in ["BOYS", "GIRLS"]:
            candidates = [
                f"{category}_{gender}",
                f"{category.lower()}_{gender.lower()}",
            ]

            # AP EWS may use OC_EWS source columns.
            if category == "EWS":
                candidates.insert(0, f"OC_EWS_{gender}")

            source_col = next(
                (col for col in candidates if col in df.columns),
                None,
            )

            if source_col is None:
                print(f"{category:6} {gender:5}: SOURCE COLUMN MISSING")
                continue

            values = pd.to_numeric(
                df[source_col]
                .replace({"NA": pd.NA, "N/A": pd.NA, "": pd.NA}),
                errors="coerce",
            )

            print(
                f"{category:6} {gender:5}: "
                f"column={source_col:20} "
                f"valid={values.notna().sum():5} "
                f"missing={values.isna().sum():5} "
                f"sample={values.dropna().head(5).tolist()}"
            )


inspect_columns(ap_df, "AP")
inspect_columns(tg_df, "TG")
