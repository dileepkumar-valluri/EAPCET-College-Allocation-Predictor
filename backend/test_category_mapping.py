
from backend.standardize_data import load_standardized_data

data = load_standardized_data()

columns = [
    "state",
    "college_code",
    "college_name",
    "branch_code",
    "phase",
    "local_area",
    "oc_boys",
    "oc_girls",
    "bc_a_boys",
    "bc_a_girls",
    "sc_i_boys",
    "sc_i_girls",
    "st_boys",
    "st_girls",
    "ews_boys",
    "ews_girls",
]

for state in ["AP", "TG"]:
    sample = data[
        (data["state"] == state)
        & (data["branch_code"].astype(str).str.upper() == "CSE")
    ]

    print(f"\n========== {state} CSE SAMPLE ==========")
    print(f"Total CSE records: {len(sample)}")

    print(
        sample[columns]
        .head(10)
        .to_string(index=False)
    )

print("\n========== CATEGORY CUTOFF SUMMARY ==========")

cutoff_columns = [
    "oc_boys", "oc_girls",
    "bc_a_boys", "bc_a_girls",
    "sc_i_boys", "sc_i_girls",
    "st_boys", "st_girls",
    "ews_boys", "ews_girls",
]

for state in ["AP", "TG"]:
    subset = data[data["state"] == state]

    print(f"\n{state}")
    print(subset[cutoff_columns].notna().sum().to_string())
