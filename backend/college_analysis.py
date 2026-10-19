
import pandas as pd

from backend.predictor import CATEGORY_COLUMNS, VALID_STATES
from backend.standardize_data import load_standardized_data


ANALYSIS_COLUMNS = [
    "state",
    "college_code",
    "college_name",
    "district",
    "local_area",
    "branch_code",
    "branch_name",
    "phase",
    "cutoff_rank",
    "student_rank",
    "rank_difference",
    "rank_comparison",
]


def analyze_college(
    state: str,
    college_code: str,
    branch_code: str,
    rank: int,
    category: str,
    gender: str,
    local_area: str | None = None,
) -> pd.DataFrame:
    """
    Return only counselling phases whose historical cutoff
    is greater than or equal to the student's rank.

    Results are ordered First, Second, then Final.
    Historical cutoff comparisons do not guarantee allotment.
    """

    state = str(state).strip().upper()
    college_code = str(college_code).strip().upper()
    branch_code = str(branch_code).strip().upper()
    category = str(category).strip().upper()
    gender = str(gender).strip().lower()

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

    if not college_code or not branch_code:
        raise ValueError("College code and branch code are required.")

    if state == "AP":
        if local_area not in {"ALL", "AU", "SVU"}:
            raise ValueError(
                "For AP, local area must be ALL, AU, or SVU."
            )
    elif local_area is not None:
        raise ValueError("TG local-area filtering is unavailable.")

    data = load_standardized_data()
    cutoff_column = f"{CATEGORY_COLUMNS[category]}_{gender}"

    required = {
        "state",
        "college_code",
        "college_name",
        "district",
        "local_area",
        "branch_code",
        "branch_name",
        "phase",
        cutoff_column,
    }

    missing = required.difference(data.columns)

    if missing:
        raise ValueError(
            "Missing dataset columns: " + ", ".join(sorted(missing))
        )

    for column in ["state", "college_code", "branch_code"]:
        data[column] = (
            data[column]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.upper()
        )

    selected = data[
        (data["state"] == state)
        & (data["college_code"] == college_code)
        & (data["branch_code"] == branch_code)
    ].copy()

    if state == "AP" and local_area != "ALL":
        areas = (
            selected["local_area"]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.upper()
        )
        selected = selected[areas == local_area].copy()

    if selected.empty:
        return pd.DataFrame(columns=ANALYSIS_COLUMNS)

    selected["cutoff_rank"] = pd.to_numeric(
        selected[cutoff_column],
        errors="coerce",
    )

    # Exclude records with missing or invalid cutoffs.
    selected = selected.dropna(subset=["cutoff_rank"]).copy()

    # Keep only phases matching the student's rank.
    # A lower cutoff number than the student's rank is excluded.
    selected = selected[
        selected["cutoff_rank"] >= rank
    ].copy()

    if selected.empty:
        return pd.DataFrame(columns=ANALYSIS_COLUMNS)

    selected["student_rank"] = rank
    selected["rank_difference"] = (
        selected["cutoff_rank"] - rank
    )
    selected["rank_comparison"] = "Within historical cutoff"

    # Preserve counselling phase order.
    phase_order = {
        "First": 1,
        "Second": 2,
        "Final": 3,
    }

    selected["phase_order"] = (
        selected["phase"]
        .astype("string")
        .str.strip()
        .map(phase_order)
        .fillna(99)
    )

    selected = selected.sort_values(
        ["phase_order", "rank_difference"],
        ascending=[True, False],
        kind="stable",
    )

    selected = selected.drop(columns=["phase_order"])

    return selected[ANALYSIS_COLUMNS].reset_index(drop=True)


if __name__ == "__main__":
    result = analyze_college(
        state="TG",
        college_code="KLRT",
        branch_code="CSE",
        rank=80000,
        category="OC",
        gender="boys",
    )

    if result.empty:
        print("No matching historical cutoff phases found.")
    else:
        print(
            result[
                ["phase", "cutoff_rank", "rank_difference", "rank_comparison"]
            ].to_string(index=False)
        )
