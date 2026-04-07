import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isOwnerLoggedIn } from "../utils/auth";
import { getAnalyticsStats } from "../api/analyticsApi";
import { API_BASE_URL } from "../utils/config";


export default function OwnerAnalytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activePanel, setActivePanel] = useState(null); // 👈 interaction
  const [mostViewedProperty, setMostViewedProperty] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function loadHistory() {

      try {

        const res = await fetch(`${API_BASE_URL}/api/analytics/history`);

        if (!res.ok) {
          setScanHistory([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setScanHistory(data);
        } else {
          setScanHistory([]);
        }

      } catch (err) {
        console.error("History error:", err);
        setScanHistory([]);
      }

    }

    loadHistory();

  }, []);

  const loadStats = async () => {
    try {
      setError(null);

      const data = await getAnalyticsStats();

      setStats({
        totalViews: data.totalViews || 0,
        totalQrScans: data.totalQrScans || 0,
        totalProperties: data.totalProperties || 0,
        todayQrScans: data.todayQrScans || 0
      });

    } catch (err) {
      console.error(err);
      setError("Unable to fetch latest analytics.");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {

    if (!mostViewedProperty?.id) return;

    fetch(`${API_BASE_URL}/api/forms/${mostViewedProperty.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Property fetch failed");
        return res.json();
      })
      .then(data => {

        setMostViewedProperty(prev => ({
          ...prev,
          title: data.title || data.pgName || "Property",
          location: data.location || data.address || ""
        }));

      })
      .catch(err => console.error(err));

  }, [mostViewedProperty?.id]);



  useEffect(() => {
    if (!isOwnerLoggedIn()) {
      navigate("/login");
      return;
    }

    const todayScans = stats ? stats.todayQrScans : 0;
    let message = "👀 Share your QR to increase visibility.";
    if (todayScans >= 10) {
      message = "🔥 Wow! Many people are checking your home today!";
    } else if (todayScans >= 5) {
      message = "📈 Interest is growing steadily.";
    } else if (todayScans >= 1) {
      message = "🙂 Your listing got attention today.";
    }

    // setStats(finalStats);
  }, [stats]);

  const engagementPercent = stats
    ? Math.min(stats?.todayQrScans * 10, 100)
    : 0;

  // if (!stats) {
  //   return <Loading />;
  // }

  const isEmpty =
    stats &&
    stats.totalViews === 0 &&
    stats.totalQrScans === 0 &&
    stats.totalProperties === 0;


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center animate-fadeIn">

          <h2 className="text-xl font-bold text-red-500 mb-2">
            ⚠️ Analytics temporarily unavailable
          </h2>

          <p className="text-gray-600 mb-4">
            Our backend service is currently unavailable or restarting.
            Don’t worry — your data is safe.
            Please try again shortly.
          </p>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔄 Retry
          </button>

        </div>
      </div>
    );
  }

  if (!stats && !error) {
    return (
      <div className="p-6 space-y-4 mt-20 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl"></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="h-40 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          📭 No Data Yet
        </h2>
        <p className="text-gray-500 mb-4">
          Start sharing your property to see analytics here.
        </p>

        <Link
          to="/addproperty"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl"
        >
          Add Property
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* ===== HERO ===== */}
      <div
        className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg cursor-pointer"

      >
        <h1 className="text-2xl  text-center bg-yellow-100 text-black rounded-lg -mt-4 mb-5 font-bold">Owner Analytics</h1>

        <div className="mt-2">
          <p className="text-sm uppercase tracking-wide opacity-100">
            Growth Assistant
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mt-1">
            Let’s get more tenants for your home 🏡
          </h1>

          <p className="text-sm opacity-90 mt-2">
            Simple actions based on real visitor behavior
          </p>
        </div>


        {/* 
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Badge text={`👁 ${stats.totalViews} Views`} />
          <Badge text={`📱 ${stats.totalQrScans} QR Scans`} />
          <Badge text={`🏠 ${stats.totalProperties} Property`} />
        </div> */}
      </div>

      {/* ===== CLICKABLE METRICS ===== */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-y-10 text-center">
        <Metric
          label="Total Views"
          value={stats?.totalViews || 0}
          onClick={() => setActivePanel("views")}
        />
        <Metric
          label="QR Scans"
          value={stats?.totalQrScans || 0}
          onClick={() => setActivePanel("qr")}
        />
        <Metric
          label="Today"
          value={stats?.todayQrScans || 0}
          highlight
          onClick={() => setActivePanel("today")}
        />
        <Metric
          label="Listings"
          value={stats?.totalProperties || 0}
          onClick={() => setActivePanel("property")}
        />
      </div>

      {mostViewedProperty && (
        <div className="mt-3 p-2 rounded-xl">
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700">
              🔥 Most Viewed Property
            </h3>

            <div className="mt-3">

              <Link
                to={`/property/${mostViewedProperty.id}`}
                className="text-lg font-semibold text-indigo-600 hover:underline"
              >
                {mostViewedProperty.title || "Loading property..."}
              </Link>

              <p className="text-sm text-gray-500">
                {mostViewedProperty.location}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                👁 {mostViewedProperty.count} people viewed this property
              </p>
            </div>

          </div>
        </div>
      )}

      <div className="mt-5 bg-white rounded-xl shadow p-4 text-center">

        <h2 className="text-lg font-semibold text-gray-800 bg-yellow-100 border rounded-lg">
          Track Your Property Performance
        </h2>

        <p className="text-sm text-gray-500 italic mt-2 mb-4">
          View detailed QR scans, visitor behavior, and engagement analytics.
        </p>

        <Link
          to="/owner/qr-insights"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 active:scale-95 transition"
        >
          📊 Open QR Insights
        </Link>

      </div>


      {/* ===== ENGAGEMENT ===== */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Engagement Level
        </h2>

        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-4 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
            style={{ width: `${engagementPercent}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Based on today’s QR interactions
        </p>
      </div>

      {/* ===== SMART SUGGESTIONS ===== */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          How to increase tenant interest
        </h2>

        <div className="space-y-3">

          <Suggestion
            icon="📱"
            title="Share your QR in busy places"
            desc="Paste it near hostels, offices, tea shops, or PG areas."
            impact="+ High walk-in chances"
          />

          <Suggestion
            icon="🕒"
            title="Peak time sharing"
            desc="Most scans happen between 6–9 PM. Share during this time."
            impact="+ Better visibility"
          />

          <Suggestion
            icon="📸"
            title="Add clear photos"
            desc="Listings with photos get 3x more views than text-only."
            impact="+ More trust"
          />

          <Suggestion
            icon="💬"
            title="Respond quickly"
            desc="Call or WhatsApp replies within 10 minutes convert better."
            impact="+ Higher conversion"
          />

          {stats?.todayQrScans >= 10 && (
            <Suggestion
              icon="🔥"
              title="You’re trending today!"
              desc="People are actively checking your home. Keep sharing."
              impact="🚀 Momentum boost"
              highlight
            />
          )}

        </div>
      </div>


      {/* ===== INTERACTION PANEL (BOTTOM SHEET) ===== */}
      {activePanel && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          onClick={() => setActivePanel(null)}
        >
          <div
            className="bg-white w-full rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              {panelTitle(activePanel)}
            </h3>

            <p className="text-sm text-gray-600">
              {panelContent(activePanel, stats)}
            </p>

            <button
              className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function Metric({ label, value, highlight, onClick }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>

      <p
        className={`text-3xl font-bold ${highlight ? "text-emerald-600" : "text-gray-800"
          }`}
      >
        {value}
      </p>

      <button
        className="text-[11px] text-indigo-500 mt-1 underline"
        onClick={onClick}
      >
        View details
      </button>
    </div>
  );
}

function Activity({ icon, title, sub }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-700">{title}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="bg-white/20 px-3 py-1 rounded-full">
      {text}
    </span>
  );
}

/* ===== PANEL TEXT ===== */

function panelTitle(type) {
  return {
    views: "Total Views",
    qr: "QR Scans",
    today: "Today’s Activity",
    property: "Your Listing",
  }[type];
}

function panelContent(type, stats) {
  switch (type) {
    case "views":
      return `Your property page was viewed ${stats?.totalViews || 0} times. These views come from QR scans and shared links.`;
    case "qr":
      return `Your QR code was scanned ${stats?.totalQrScans || 0} times. QR scans show high-intent users.`;
    case "today":
      return `Today alone, ${stats?.todayQrScans || 0} people interacted with your listing.`;
    case "property":
      return `You currently have ${stats?.totalProperties || 0} active property listed.`;
    default:
      return "";
  }
}

function Suggestion({ icon, title, desc, impact, highlight }) {
  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border transition ${highlight
        ? "bg-emerald-50 border-emerald-300"
        : "bg-white border-gray-200"
        }`}
    >
      <div className="text-2xl">{icon}</div>

      <div className="flex-1">
        <p className="font-medium text-gray-800">
          {title}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {desc}
        </p>
      </div>

      <div className="text-xs text-indigo-600 font-semibold whitespace-nowrap">
        {impact}
      </div>
    </div>
  );
}
