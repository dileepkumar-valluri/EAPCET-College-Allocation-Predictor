
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
VALID_AP_LOCAL_AREAS = {'ALL', "AU", "SVU"}

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
    Return up to five historical cutoff records with cutoff >= student rank.

    AP predictions require an AU or SVU local-area selection.
    TG local-area filtering is unavailable in the current dataset.

    Results are historical comparisons, not guaranteed allotments.
    """

    # Normalize inputs.
    state = str(state).strip().upper()
    category = str(category).strip().upper()
    gender = str(gender).strip().lower()
    preferred_branch = str(preferred_branch).strip().upper()

    if local_area is not None:
        local_area = str(local_area).strip().upper()

    # Validate inputs.
    if state not in VALID_STATES:
        raise ValueError("State must be AP or TG.")

    if category not in CATEGORY_COLUMNS:
        raise ValueError(f"Unsupported category: {category}")

    if gender not in {"boys", "girls"}:
        raise ValueError("Gender must be boys or girls.")

    if (
        not isinstance(rank, int)
        or isinstance(rank, bool)
        or rank <= 0
    ):
        raise ValueError("Rank must be a positive integer.")

    if (
        not isinstance(limit, int)
        or isinstance(limit, bool)
        or limit <= 0
    ):
        raise ValueError("Limit must be a positive integer.")

    if not preferred_branch:
        raise ValueError("Preferred branch cannot be empty.")

    # Require local-area selection for AP.
    if state == "AP":
        if local_area not in VALID_AP_LOCAL_AREAS:
            raise ValueError(
                "For AP predictions, select Entire AP, AU, or SVU."
            )

    # Do not claim TG local-area filtering is supported.
    elif local_area is not None:
        raise ValueError(
            "TG local-area filtering is unavailable in the current dataset."
        )

    # Select the category/gender cutoff column.
    cutoff_column = f"{CATEGORY_COLUMNS[category]}_{gender}"

    # Load standardized data.
    data = load_standardized_data()

    if cutoff_column not in data.columns:
        raise ValueError(
            f"Required cutoff column '{cutoff_column}' is missing."
        )

    # Normalize filter fields.
    state_values = (
        data["state"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.upper()
    )

    branch_codes = (
        data["branch_code"]
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

    # Filter by state and preferred branch.
    filtered = data[
        (state_values == state)
        & (
            branch_codes.eq(preferred_branch)
            | branch_names.eq(preferred_branch)
        )
    ].copy()

    if filtered.empty:
        return pd.DataFrame(columns=RESULT_COLUMNS)

    # Apply AP local-area filter.
    # ALL means search every AP record without AU/SVU filtering.
    if state == "AP" and local_area != "ALL":
        local_area_values = (
            filtered["local_area"]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.upper()
        )

        filtered = filtered[
            local_area_values == local_area
        ].copy()

    if filtered.empty:
        return pd.DataFrame(columns=RESULT_COLUMNS)

    # Convert selected historical cutoff to numeric.
    filtered["cutoff_rank"] = pd.to_numeric(
        filtered[cutoff_column],
        errors="coerce",
    )

    # Exclude records without a valid cutoff.
    filtered = filtered.dropna(subset=["cutoff_rank"]).copy()

    if filtered.empty:
        return pd.DataFrame(columns=RESULT_COLUMNS)

    # Only cutoffs equal to or greater than the student's rank.
    filtered = filtered[
        filtered["cutoff_rank"] >= rank
    ].copy()

    if filtered.empty:
        return pd.DataFrame(columns=RESULT_COLUMNS)

    # Calculate distance from the student's rank.
    filtered["rank_difference"] = (
        filtered["cutoff_rank"] - rank
    )

    filtered["prediction_status"] = "Historical cutoff match"

    # Sort by nearest eligible cutoff.
    # Preserve different counselling phases and source records.
    filtered = filtered.sort_values(
        by=[
            "rank_difference",
            "college_name",
            "college_code",
        ],
        ascending=[True, True, True],
        kind="stable",
    )

    return (
        filtered[RESULT_COLUMNS]
        .head(limit)
        .reset_index(drop=True)
    )


if __name__ == "__main__":
    # AP test: select a local area.
    ap_results = predict_colleges(
        state="AP",
        rank=80000,
        category="OC",
        gender="boys",
        preferred_branch="CSE",
        limit=5,
        local_area="AU",
    )

    print("\nAP prediction results (AU):")
    if ap_results.empty:
        print("No eligible historical cutoff records found.")
    else:
        print(ap_results.to_string(index=False))

    # TG test: no local-area filter is applied.
    tg_results = predict_colleges(
        state="TG",
        rank=80000,
        category="OC",
        gender="boys",
        preferred_branch="CSE",
        limit=5,
        local_area=None,
    )

    print("\nTG prediction results:")
    if tg_results.empty:
        print("No eligible historical cutoff records found.")
    else:
        print(tg_results.to_string(index=False))
