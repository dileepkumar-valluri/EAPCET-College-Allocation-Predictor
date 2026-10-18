
from backend.data_loader import load_all_datasets

import pandas as pd

ap_df, tg_df = load_all_datasets()

boys_columns = [
    "oc_boys",
    "bc_a_boys",
    "bc_b_boys",
    "bc_c_boys",
    "bc_d_boys",
    "bc_e_boys",
    "sc_i_boys",
    "sc_ii_boys",
    "sc_iii_boys",
    "st_boys",
    "ews_boys",
]

print("TG dataset shape:", tg_df.shape)

missing_mask = tg_df[boys_columns].isna().all(axis=1)
missing_records = tg_df[missing_mask]

print("\nRows missing every boys' cutoff:", len(missing_records))

print("\nSample records:")
print(
    missing_records[
        [
            "institute_code",
            "institute_name",
            "branch_code",
            "phase",
            *boys_columns,
        ]
    ].head(15).to_string(index=False)
)

print("\nMissing values per boys' cutoff:")
print(tg_df[boys_columns].isna().sum().to_string())
