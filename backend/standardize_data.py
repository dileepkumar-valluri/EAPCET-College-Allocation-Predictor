
import pandas as pd

from backend.data_loader import load_all_datasets


# Standard category columns used by both datasets.
CATEGORIES = [
    "OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E",
    "SC_I", "SC_II", "SC_III", "ST", "EWS",
]


def standardize_ap(df: pd.DataFrame) -> pd.DataFrame:
    """Convert AP engineering records to the common schema."""
    result = pd.DataFrame({
        "state": "AP",
        "year": df["year"],
        "college_code": df["inst_code"],
        "college_name": df["inst_name"],
        "branch_code": df["branch_code"],
        "branch_name": df["branch_name_reference"],
        "district": df["district"],
        "local_area": df["local_area"],
        "region": df["region"],
        "phase": "Available in source",
    })

    for category in CATEGORIES:
        for gender in ("BOYS", "GIRLS"):
            source_col = f"{category}_{gender}"
            target_col = f"{category.lower()}_{gender.lower()}"

            if source_col in df.columns:
                result[target_col] = pd.to_numeric(
                    df[source_col].replace(
                        {"NA": pd.NA, "N/A": pd.NA, "": pd.NA}
                    ),
                    errors="coerce",
                )
            else:
                result[target_col] = pd.NA

    # AP EWS cutoffs use OC_EWS columns in the source.
    result["ews_boys"] = pd.to_numeric(
        df["OC_EWS_BOYS"], errors="coerce"
    )
    result["ews_girls"] = pd.to_numeric(
        df["OC_EWS_GIRLS"], errors="coerce"
    )

    return result


def standardize_tg(df: pd.DataFrame) -> pd.DataFrame:
    """Convert TG engineering records to the common schema."""
    result = pd.DataFrame({
        "state": "TG",
        "year": df["year"],
        "college_code": df["institute_code"],
        "college_name": df["institute_name"],
        "branch_code": df["branch_code"],
        "branch_name": df["branch_name"],
        "district": df["place"],
        "local_area": pd.NA,
        "region": pd.NA,
        "phase": df["phase"],
    })

    for category in CATEGORIES:
        for gender in ("boys", "girls"):
            source_col = f"{category.lower()}_{gender}"
            target_col = f"{category.lower()}_{gender}"

            if source_col in df.columns:
                result[target_col] = pd.to_numeric(
                    df[source_col].replace(
                        {"NA": pd.NA, "N/A": pd.NA, "": pd.NA}
                    ),
                    errors="coerce",
                )
            else:
                result[target_col] = pd.NA

    return result


def load_standardized_data() -> pd.DataFrame:
    """Load both states and combine their standardized records."""
    ap_df, tg_df = load_all_datasets()

    ap_clean = standardize_ap(ap_df)
    tg_clean = standardize_tg(tg_df)

    return pd.concat(
        [ap_clean, tg_clean],
        ignore_index=True,
    )


if __name__ == "__main__":
    data = load_standardized_data()

    print("Standardization completed.")
    print(f"Total records: {len(data)}")

    print("\nRecords by state:")
    print(data["state"].value_counts().to_string())

    print("\nStandardized columns:")
    print(data.columns.tolist())

    print("\nSample records with local area:")
    print(
        data[
            [
                "state",
                "college_code",
                "college_name",
                "branch_code",
                "branch_name",
                "local_area",
                "oc_boys",
                "oc_girls",
                "ews_boys",
                "ews_girls",
                "phase",
            ]
        ].head(10).to_string(index=False)
    )

    print("\nMissing cutoff counts:")
    print(
        data[["oc_boys", "oc_girls", "ews_boys", "ews_girls"]]
        .isna()
        .sum()
        .to_string()
    )

    print("\nDuplicate college-branch-phase records:")
    duplicate_cols = [
        "state",
        "college_code",
        "branch_code",
        "phase",
    ]

    duplicate_mask = data.duplicated(
        subset=duplicate_cols,
        keep=False,
    )

    print(f"Rows involved in duplicates: {duplicate_mask.sum()}")

    print("\nDuplicate examples for investigation:")
    duplicates = data[
        duplicate_mask
    ].sort_values(duplicate_cols)

    print(
        duplicates[
            [
                "state",
                "college_code",
                "college_name",
                "branch_code",
                "branch_name",
                "local_area",
                "phase",
                "oc_boys",
                "oc_girls",
            ]
        ].head(30).to_string(index=False)
    )

    print("\nRecords by state and phase:")
    print(
        data.groupby(["state", "phase"], dropna=False)
        .size()
        .to_string()
    )

    print("\nAditya University CSE local-area records:")
    sample = data[
        (data["state"] == "AP")
        & (data["college_code"] == "ADTPPU")
        & (data["branch_code"] == "CSE")
    ]

    print(
        sample[
            [
                "college_name",
                "branch_code",
                "local_area",
                "oc_boys",
                "oc_girls",
            ]
        ].to_string(index=False)
    )
