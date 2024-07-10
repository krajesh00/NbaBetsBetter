import { BetResult } from "../model";

export function ResultDisplay({ data }: { data: BetResult; }) {
  return (
    <div>
      <b>Expected Multipliers</b>
      <div className="grid grid-cols-2">
        <div
          className={data.expected_multiplier_under >= data.expected_multiplier_over
            ? "bg-green-300"
            : "bg-red-300"}
        >
          <b>Under</b>
          <p>{data.expected_multiplier_under.toFixed(3)}</p>
        </div>
        <div
          className={data.expected_multiplier_over >= data.expected_multiplier_under
            ? "bg-green-300"
            : "bg-red-300"}
        >
          <b>Over</b>
          <p>{data.expected_multiplier_over.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}
