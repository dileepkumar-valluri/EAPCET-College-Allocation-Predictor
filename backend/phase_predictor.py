
import pandas as pd

from backend.predictor import CATEGORY_COLUMNS
from backend.standardize_data import load_standardized_data


PHASES = ["First", "Second", "Final"]

PHASE_RESULT_COLUMNS = [
    "state",
    "college_code",
    "college_name",
    "district",
    "branch_code",
    "branch_name",
    "phase",
    "cutoff_rank",
    "rank_difference",
    "prediction_status",
]


def _prepare_data(rank, category, gender, preferred_branch):
    if not isinstance(rank, int) or isinstance(rank, bool) or rank <= 0:
        raise ValueError("Rank must be a positive integer.")

    category = str(category).strip().upper()
    gender = str(gender).strip().lower()
    preferred_branch = str(preferred_branch).strip().upper()

    if category not in CATEGORY_COLUMNS:
        raise ValueError(f"Unsupported category: {category}")

    if gender not in {"boys", "girls"}:
        raise ValueError("Gender must be boys or girls.")

    if not preferred_branch:
        raise ValueError("Preferred branch cannot be empty.")

    data = load_standardized_data()

    required = {
        "state",
        "college_code",
        "college_name",
        "district",
        "branch_code",
        "branch_name",
        "phase",
        f"{CATEGORY_COLUMNS[category]}_{gender}",
    }

    missing = required.difference(data.columns)
    if missing:
        raise ValueError(
            "Missing dataset columns: " + ", ".join(sorted(missing))
        )

    for column in ["state", "college_code", "branch_code"]:
        data[column] = (
            data[column].fillna("").astype(str).str.strip().str.upper()
        )

    data["phase"] = data["phase"].fillna("").astype(str).str.strip()

    branch_names = (
        data["branch_name"].fillna("").astype(str).str.strip().str.upper()
    )

    cutoff_column = f"{CATEGORY_COLUMNS[category]}_{gender}"

    data = data[
        (data["state"] == "TG")
        & data["phase"].isin(PHASES)
        & (
            data["branch_code"].eq(preferred_branch)
            | branch_names.eq(preferred_branch)
        )
    ].copy()

    data["cutoff_rank"] = pd.to_numeric(
        data[cutoff_column], errors="coerce"
    )

    return data


def predict_phase_wise(
    rank: int,
    category: str,
    gender: str,
    preferred_branch: str,
    limit: int = 5,
) -> dict:
    """
    Return up to five matching colleges separately for each TG phase.
    Colleges with missing cutoffs or cutoffs below the student's rank
    are excluded from that phase's recommendations.
    """

    if not isinstance(limit, int) or isinstance(limit, bool) or limit <= 0:
        raise ValueError("Limit must be a positive integer.")

    data = _prepare_data(rank, category, gender, preferred_branch)

    output = {}

    for phase in PHASES:
        phase_data = data[data["phase"] == phase].copy()

        # Only historical cutoffs matching the student's rank.
        phase_data = phase_data.dropna(subset=["cutoff_rank"])
        phase_data = phase_data[phase_data["cutoff_rank"] >= rank].copy()

        phase_data["rank_difference"] = (
            phase_data["cutoff_rank"] - rank
        )
        phase_data["prediction_status"] = "Within historical cutoff"

        phase_data = phase_data.sort_values(
            ["rank_difference", "college_name", "college_code"],
            ascending=[True, True, True],
            kind="stable",
        )

        phase_data = phase_data.drop_duplicates(
            subset=["college_code"],
            keep="first",
        )

        output[phase] = (
            phase_data[PHASE_RESULT_COLUMNS]
            .head(limit)
            .reset_index(drop=True)
            .to_dict(orient="records")
        )

    return output


def predict_all_three_phases(
    rank: int,
    category: str,
    gender: str,
    preferred_branch: str,
    limit: int = 5,
) -> pd.DataFrame:
    """
    Return colleges with a valid historical cutoff matching the student's
    rank in all three TG phases: First, Second, and Final.
    """

    if not isinstance(limit, int) or isinstance(limit, bool) or limit <= 0:
        raise ValueError("Limit must be a positive integer.")

    data = _prepare_data(rank, category, gender, preferred_branch)

    data = data.dropna(subset=["cutoff_rank"]).copy()

    # Only cutoff records that match the student's rank.
    data = data[data["cutoff_rank"] >= rank].copy()

    if data.empty:
        return pd.DataFrame(columns=PHASE_RESULT_COLUMNS)

    # A college must have a qualifying cutoff in every phase.
    phase_counts = data.groupby(
        ["college_code", "branch_code"]
    )["phase"].nunique()

    eligible_keys = phase_counts[phase_counts == 3].index

    if len(eligible_keys) == 0:
        return pd.DataFrame(columns=PHASE_RESULT_COLUMNS)

    eligible = data.set_index(
        ["college_code", "branch_code"]
    ).loc[eligible_keys].reset_index()

    # Rank colleges by their least favorable matching phase:
    # the smallest cutoff-minus-student-rank difference.
    scores = (
        eligible.groupby(["college_code", "branch_code"])
        ["rank_difference"].min()
        if "rank_difference" in eligible.columns
        else (
            eligible.assign(
                rank_difference=eligible["cutoff_rank"] - rank
            )
            .groupby(["college_code", "branch_code"])["rank_difference"]
            .min()
        )
    )

    eligible = eligible.assign(
        rank_difference=eligible["cutoff_rank"] - rank
    )

    scores = eligible.groupby(
        ["college_code", "branch_code"]
    )["rank_difference"].min()

    scores = scores.sort_values(ascending=False)

    selected_keys = list(scores.head(limit).index)

    eligible = eligible.set_index(
        ["college_code", "branch_code"]
    )

    selected = eligible.loc[selected_keys].reset_index()

    selected["prediction_status"] = "Within historical cutoff in all 3 phases"

    return selected[PHASE_RESULT_COLUMNS].sort_values(
        ["college_code", "phase"],
        key=lambda column: (
            column.map({"First": 1, "Second": 2, "Final": 3})
            if column.name == "phase"
            else column
        ),
        kind="stable",
    ).reset_index(drop=True)


if __name__ == "__main__":
    phase_results = predict_phase_wise(
        rank=80000,
        category="OC",
        gender="boys",
        preferred_branch="CSE",
    )

    for phase, colleges in phase_results.items():
        print(f"\n{phase} Phase — {len(colleges)} matching colleges")
        for college in colleges:
            print(
                college["college_code"],
                college["college_name"],
                college["cutoff_rank"],
            )

    all_phase_results = predict_all_three_phases(
        rank=80000,
        category="OC",
        gender="boys",
        preferred_branch="CSE",
    )

    print(
        "\nColleges matching all three phases:",
        all_phase_results["college_code"].nunique()
        if not all_phase_results.empty
        else 0,
    )

    if not all_phase_results.empty:
        print(
            all_phase_results[
                ["college_code", "college_name", "phase", "cutoff_rank"]
            ].to_string(index=False)
        )
