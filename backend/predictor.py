
import pandas as pd

from backend.standardize_data import load_standardized_data


CATEGORY_COLUMNS = {
    "OC": "oc",
    "BC_A": "bc_a",
    "BC_B": "bc_b",
    "BC_C": "bc_c",
    "BC_D": "bc_d",
    "BC_E": "bc_e",
    "SC_I": "sc_i",
    "SC_II": "sc_ii",
    "SC_III": "sc_iii",
    "ST": "st",
    "EWS": "ews",
}

VALID_STATES = {"AP", "TG"}
VALID_AP_LOCAL_AREAS = {"ALL", "AU", "SVU"}

RESULT_COLUMNS = [
    "state",
    "college_code",
    "college_name",
    "district",
    "local_area",
    "branch_code",
    "branch_name",
    "phase",
    "cutoff_rank",
    "rank_difference",
    "prediction_status",
]


def predict_colleges(
    state: str,
    rank: int,
    category: str,
    gender: str,
    preferred_branch: str,
    limit: int = 5,
    local_area: str | None = None,
) -> pd.DataFrame:
    """
    Return up to five unique colleges whose historical cutoff
    is greater than or equal to the student's rank.

    Only records matching the student's rank are recommended.
    The nearest eligible historical cutoff record is retained
    for each college.

    Historical comparisons do not guarantee seat allotment.
    """

    state = str(state).strip().upper()
    category = str(category).strip().upper()
    gender = str(gender).strip().lower()
    preferred_branch = str(preferred_branch).strip().upper()

    if local_area is not None:
        local_area = str(local_area).strip().upper()

    if state not in VALID_STATES:
        raise ValueError("State must be AP or TG.")

    if category not in CATEGORY_COLUMNS:
        raise ValueError(f"Unsupported category: {category}")

    if gender not in {"boys", "girls"}:
        raise ValueError("Gender must be boys or girls.")

    if not isinstance(rank, int) or isinstance(rank, bool) or rank <= 0:
        raise ValueError("Rank must be a positive integer.")

    if not isinstance(limit, int) or isinstance(limit, bool) or limit <= 0:
        raise ValueError("Limit must be a positive integer.")

    if not preferred_branch:
        raise ValueError("Preferred branch cannot be empty.")

    if state == "AP":
        if local_area not in VALID_AP_LOCAL_AREAS:
            raise ValueError(
                "For AP predictions, select ALL, AU, or SVU."
            )
    elif local_area is not None:
        raise ValueError(
            "TG local-area filtering is unavailable in the current dataset."
        )

    cutoff_column = f"{CATEGORY_COLUMNS[category]}_{gender}"
    data = load_standardized_data()

    required_columns = {
        "state",
        "college_code",
        "college_name",
        "district",
        "branch_code",
        "branch_name",
        "local_area",
        "phase",
        cutoff_column,
    }

    missing_columns = required_columns.difference(data.columns)

    if missing_columns:
        raise ValueError(
            "Required dataset columns are missing: "
            + ", ".join(sorted(missing_columns))
        )

    # Normalize fields used for filtering.
    for column in ["state", "college_code", "branch_code"]:
        data[column] = (
            data[column]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.upper()
        )

    branch_names = (
        data["branch_name"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.upper()
    )

    filtered = data[
        (data["state"] == state)
        & (
            data["branch_code"].eq(preferred_branch)
            | branch_names.eq(preferred_branch)
        )
    ].copy()

    if state == "AP" and local_area != "ALL":
        areas = (
            filtered["local_area"]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.upper()
        )
        filtered = filtered[areas == local_area].copy()

    if filtered.empty:
        return pd.DataFrame(columns=RESULT_COLUMNS)

    # Convert cutoffs and exclude missing values.
    filtered["cutoff_rank"] = pd.to_numeric(
        filtered[cutoff_column],
        errors="coerce",
    )
    filtered = filtered.dropna(subset=["cutoff_rank"]).copy()

    # Critical rule: exclude all historical cutoffs below the student's rank.
    filtered = filtered[
        filtered["cutoff_rank"] >= rank
    ].copy()

    if filtered.empty:
        return pd.DataFrame(columns=RESULT_COLUMNS)

    filtered["rank_difference"] = (
        filtered["cutoff_rank"] - rank
    )
    filtered["prediction_status"] = "Within historical cutoff"

    # Nearest eligible cutoff first.
    filtered = filtered.sort_values(
        by=["rank_difference", "college_name", "college_code"],
        ascending=[True, True, True],
        kind="stable",
    )

    # Return one recommendation per college.
    filtered = filtered.drop_duplicates(
        subset=["college_code"],
        keep="first",
    )

    return (
        filtered[RESULT_COLUMNS]
        .head(limit)
        .reset_index(drop=True)
    )


if __name__ == "__main__":
    results = predict_colleges(
        state="TG",
        rank=80000,
        category="OC",
        gender="boys",
        preferred_branch="CSE",
        limit=5,
    )

    if results.empty:
        print("No matching historical cutoff records found.")
    else:
        print(results.to_string(index=False))
