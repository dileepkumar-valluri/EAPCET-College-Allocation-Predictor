
from backend.standardize_data import load_standardized_data

data = load_standardized_data()

ap_data = data[data["state"] == "AP"].copy()

print("AP local-area values, including missing values:")
print(
    ap_data["local_area"]
    .fillna("MISSING")
    .value_counts(dropna=False)
    .to_string()
)

print("\nTG local-area values:")
tg_data = data[data["state"] == "TG"]

print(
    tg_data["local_area"]
    .fillna("MISSING")
    .value_counts(dropna=False)
    .to_string()
)
