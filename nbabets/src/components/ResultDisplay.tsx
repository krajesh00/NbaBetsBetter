import { BetResult } from "../model";

export function ResultDisplay({ data }: { data: BetResult; }) {
  return (
    <div>
      <b>Bernoulli</b>
      <div className="grid grid-cols-2">
        <div
          className={data.b_expected_multiplier_under >= data.b_expected_multiplier_over
            ? "bg-green-300"
            : "bg-red-300"}
        >
          <b>Under</b>
          <p>{data.b_expected_multiplier_under.toFixed(3)}</p>
          <p>{(data.b_confidence_under * 100).toFixed(2) + "%"}</p>

        </div>
        <div
          className={data.b_expected_multiplier_over >= data.b_expected_multiplier_under
            ? "bg-green-300"
            : "bg-red-300"}
        >
          <b>Over</b>
          <p>{data.b_expected_multiplier_over.toFixed(3)}</p>
          <p>{(data.b_confidence_over * 100).toFixed(2) + "%"}</p>
        </div>
      </div>
      <b>Normal Distribution</b>
      <div className="grid grid-cols-2">
        <div
          className={data.n_expected_multiplier_under >= data.n_expected_multiplier_over
            ? "bg-green-300"
            : "bg-red-300"}
        >
          <b>Under</b>
          <p>{data.n_expected_multiplier_under.toFixed(3)}</p>
          <p>{(data.n_confidence_under * 100).toFixed(2) + "%"}</p>

        </div>
        <div
          className={data.n_expected_multiplier_over >= data.n_expected_multiplier_under
            ? "bg-green-300"
            : "bg-red-300"}
        >
          <b>Over</b>
          <p>{data.n_expected_multiplier_over.toFixed(3)}</p>
          <p>{(data.n_confidence_over * 100).toFixed(2) + "%"}</p>
        </div>
      </div>
    </div>
  );
}
