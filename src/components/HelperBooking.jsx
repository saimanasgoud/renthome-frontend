import { useState } from "react";

export default function HelperBooking({ onConfirmHelper, onCancelHelper }) {

  const [needHelper, setNeedHelper] = useState("No");
  const [helpers, setHelpers] = useState(1);
  const [hours, setHours] = useState(4);
  const [tip, setTip] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateAmount = () => {
    if (needHelper !== "Yes") return 0;
    const rate = hours === 8 ? 800 : 400;
    return helpers * rate + tip;
  };

  const totalAmount = calculateAmount();

  return (
<div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 space-y-6 max-w-md w-full mx-auto border border-gray-200">      <h2 className="text-xl font-bold text-indigo-600 text-center">
        🧹 Helper Services
      </h2>

      {/* NEED HELPER */}
      <div className="flex gap-4">
        {["Yes", "No"].map(opt => (
          <button
            key={opt}
            onClick={() => {
              setNeedHelper(opt);
              setConfirmed(false);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${needHelper === opt
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {needHelper === "Yes" && (
        <>
          {/* NUMBER OF HELPERS */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Number of Helpers
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={helpers}
              onChange={e => setHelpers(+e.target.value)}
              className="w-full mt-2"
            />

            <p className="text-center font-semibold text-indigo-600">
              {helpers} Helper{helpers > 1 && "s"}
            </p>
          </div>

          {/* DURATION */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Duration
            </label>

            <select
              value={hours}
              onChange={e => setHours(+e.target.value)}
              className="w-full border rounded-xl p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={4}>Half Day (4 hrs)</option>
              <option value={8}>Full Day (8 hrs)</option>
            </select>
          </div>

          {/* TIP */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Tip (Optional)
            </label>

            <div className="flex gap-3 mt-2 justify-center">
              {[0, 50, 100, 200].map(t => (
                <button
                  key={t}
                  onClick={() => setTip(t)}
                  className={`px-4 py-1 rounded-full text-sm transition ${tip === t
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  ₹{t}
                </button>
              ))}
            </div>
          </div>

          {/* TOTAL SUMMARY */}
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex justify-between items-center">
            <span className="font-semibold text-gray-700">
              Total Service Cost
            </span>
            <span className="text-lg font-bold text-indigo-700">
              ₹ {totalAmount}
            </span>
          </div>

          {/* BUTTONS */}
          {!confirmed ? (
  <button
    disabled={loading}
    onClick={() => {
      setLoading(true);

      setTimeout(() => {
        onConfirmHelper({
          helpers,
          hours,
          tip,
          totalAmount
        });
        setConfirmed(true);
        setLoading(false);
      }, 1200);
    }}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Processing...
      </>
    ) : (
      "✅ Confirm Helper"
    )}
  </button>
) : (
            <button
              onClick={() => {
                setConfirmed(false);
                setNeedHelper("No");
                onCancelHelper && onCancelHelper();
              }}
              className="w-full text-red-600 font-semibold underline"
            >
              ❌ Cancel Helper Booking
            </button>
          )}

        </>
      )}
    </div>
  );
}