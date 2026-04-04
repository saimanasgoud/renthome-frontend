import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import "../styles/PropertyDetails.css";
import HelperBooking from "../components/HelperBooking";
import { recordView } from "../api/analyticsApi";

export function ImageGallery({ images }) {

  const [index, setIndex] = useState(0);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const next = () => {
    if (index < images.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  // swipe start
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // swipe move
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // swipe end
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      next();
    }

    if (isRightSwipe) {
      prev();
    }
  };

  return (
    <div className="pd-gallery">

      <div
        className="pd-gallery-main"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

        <img
          src={images[index]}
          alt="property"
          className="pd-gallery-img"
        />

        {/* counter */}
        <div className="pd-gallery-count">
          {index + 1} / {images.length}
        </div>

        {/* arrows */}
        {index > 0 && (
          <button className="pd-gallery-left" onClick={prev}>
            ❮
          </button>
        )}

        {index < images.length - 1 && (
          <button className="pd-gallery-right" onClick={next}>
            ❯
          </button>
        )}

      </div>

      {/* thumbnails */}
      <div className="pd-gallery-thumbs">
        {images.map((img, i) => (
        
        <img
  key={i}
  src={img}
  alt="thumbnail"
  onClick={() => setIndex(i)}
  className={`pd-thumb ${i === index ? "active" : ""}`}
/>
        ))}
      </div>

    </div>
  );
}

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper booking state
  const [helperBooking, setHelperBooking] = useState(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (propertyId && propertyId !== "null" && propertyId !== "undefined") {
      recordView(propertyId);
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId && propertyId !== "null") {
      localStorage.setItem("lastViewedProperty", propertyId);
    }
  }, [propertyId]);

  useEffect(() => {

    // 🚫 HARD STOP if id is missing or invalid
    if (!propertyId || propertyId === "null" || propertyId === "undefined") {
      console.error("Invalid property id:", propertyId);
      setLoading(false);
      setProperty(null);
      return;
    }

    fetch(`${API_BASE_URL}/api/forms/${propertyId}`, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error!", err);
        setProperty(null);
        setLoading(false);
      });
  }, [propertyId]);


  if (loading) {
    return <div className="pd-loader">Loading property...</div>;
  }

  // if (!propertyId) {
  //   return <h1 style={{ color: "red" }}>ID NOT RECEIVED</h1>;
  // }


  if (!propertyId || propertyId === "null" || propertyId === "undefined") {
    return (
      <div className="pd-error">
        <h2 className="pd-error-text">
          Invalid or expired property link
        </h2>
      </div>
    );
  }


  if (!property) {
    return <div className="pd-error" style={{ color: "red" }}>Property not found</div>;
  }


  let parsedForm = {};
  try {
    if (property?.formJson) {
      parsedForm =
        typeof property.formJson === "string"
          ? JSON.parse(property.formJson)
          : property.formJson;
    }
  } catch (e) {
    console.error("Invalid formJson", e);
    parsedForm = {}
  }

  const capitalizeFirst = (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  /* Facilities as list */
  const renderValue = (key, value) => {
    if (value === null || value === undefined) return null;

    /* Facilities */
    if (key === "facilities" && Array.isArray(value)) {
      return (
        <ul className="pd-list">
          {value.map((item, i) => (
            <li key={i}>✔ {item}</li>
          ))}
        </ul>
      );
    }


    /* Food timings */
    if (key === "foodTimings" && value && typeof value === "object") {
      return (
        <ul className="pd-list">
          {Object.entries(value).map(([meal, t]) => (
            <li key={meal}>
              <strong>{meal}</strong> : {t.from} – {t.to}
            </li>
          ))}
        </ul>
      );
    }

    /* Food type fix */
    if (key === "foodType" && value === "Both") {
      return "Veg & Non-Veg";
    }

    /* Preferred contact fix */
    if (key === "preferredContact" && value === "Both") {
      return "Call & WhatsApp";
    }

    if (key === "images" && Array.isArray(value)) {
      return <ImageGallery images={value} />;
    }
    /* Arrays fallback */
    if (Array.isArray(value)) return value.map(v => capitalizeFirst(v)).join(", ");
    return capitalizeFirst(value.toString());
  };

  const calculateMonthlyAmount = () => {
    const rent = Number(parsedForm.rent || 0);
    const electricity = parsedForm.electricityCharges === "Included" ? 0 : null;
    const food = parsedForm.foodProvided === "Yes" ? 0 : null;

    return {
      rent,
      electricity,
      food,
      total: rent,
    };
  };

  const generatedDate = property.generatedAt
    ? new Date(property.generatedAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : property.createdAt
      ? new Date(property.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : null;

  const cancelHelperBooking = () => {
    setHelperBooking(null);
  };


  const getBillBreakdown = () => {
    const rent = Number(parsedForm.rent || 0);
    const rows = [];
    let finalPayable = rent;

    if (helperBooking) {
      const perHelperRate = helperBooking.hours === 8 ? 800 : 400;
      const helperCost = helperBooking.helpers * perHelperRate;
      const day =
        helperBooking.hours === 8 ? "Full Day (8 hrs)" : "Half Day (4 hrs)";

     rows.push({
  label: `Helpers – ${day}`,
  amount: helperCost,
  type: "add",
  removable: true
});

      if (helperBooking.tip > 0) {
        rows.push({
          label: "Tip to Helpers",
          amount: helperBooking.tip,
          type: "add",
        });
      }

      finalPayable += helperCost + helperBooking.tip;
    }

    if (parsedForm.foodProvided === "Yes") {
      rows.push({ label: "Food Included", amount: 500, type: "minus" });
      finalPayable -= 500;
    }

    if (parsedForm.electricityCharges === "Included") {
      rows.push({ label: "Electricity Included", amount: 300, type: "minus" });
      finalPayable -= 300;
    }

    if (parsedForm.deposit) {
      rows.push({
        label: "Security Deposit (One-time)",
        amount: Number(parsedForm.deposit),
        type: "info",
      });
    }

    return { rows, finalPayable };
  };



  const getPositivePoints = () => {
    const points = [];

    if (parsedForm.foodProvided === "Yes") {
      points.push("Food included — saves monthly expenses");
    }

    if (parsedForm.electricityCharges === "Included") {
      points.push("Electricity charges included — no surprises");
    }

if (
  Array.isArray(parsedForm.facilities) &&
  parsedForm.facilities.length >= 3
) {
  points.push("Multiple facilities available for daily comfort");
}

    if (parsedForm.preferredContact) {
      points.push("Easy owner contact for quick communication");
    }

    if (parsedForm.deposit && parsedForm.rent) {
      if (Number(parsedForm.deposit) <= Number(parsedForm.rent)) {
        points.push("Low deposit compared to monthly rent");
      }
    }

    // Generic fallback (works for all forms)
    // if (points.length === 0) {
    //   points.push("Well-maintained property with transparent details");
    // }

    return points;
  };


  // const fieldGroups = PROPERTY_FIELD_CONFIG?.[property?.propertyType];

  const bill = calculateMonthlyAmount();

  /* ================= UI ================= */
  return (


    <div className="pd-page mt-10 pt-1">

      {/* HERO */}
      <div className="pd-hero">

        <h1>
          {parsedForm.pgName ||
            parsedForm.apartmentName ||
            parsedForm.shopName ||
            parsedForm.officeName ||
            parsedForm.houseName || //independent house
            parsedForm.flatName ||
            parsedForm.title || //others
            ""}
        </h1>
        {/* <h1>{parsedForm.title}</h1> */}
        <h1 className="text-gray-900">Explore Your Next Perfect Stay</h1>
        <span className="pd-badge">{property.propertyType}</span>

        {generatedDate && (
          <div className="pd-generated">
            Details generated on <strong>{generatedDate}</strong>
          </div>
        )}

      </div>

      <div className="pd-micro">
        <h1 className="bg-yellow-100 text-center p-1">
          ✔ Verified Property Information
        </h1>
      </div>

      <div className="pd-animated-text">
  <span className="line">🏡 Discover your perfect home with ease</span><br />
  <span className="line">✔ Verified details • Transparent pricing</span><br />
  <span className="line highlight">✨ No hidden charges</span>
</div>

{/* ✅ IMAGE SECTION (FINAL CLEAN) */}
{parsedForm.images && parsedForm.images.length > 0 && (
  <div className="pd-card">
    <div className="pd-card-header">
      <h2>Images</h2>
    </div>

    <div className="pd-card-body">
      <ImageGallery images={parsedForm.images} />
    </div>
  </div>
)}


<div className="pd-card">
  <div className="pd-card-header">
    <h2>General Information</h2>
  </div>

  <div className="pd-card-body">
    {Object.entries(parsedForm).map(([key, value]) => {
      if (!value || key === "images") return null;

      return (
        <div key={key} className="pd-row">
          
          <span className="pd-label">
            {key.replace(/([A-Z])/g, " $1")}
          </span>
          <span className="pd-value">
            {renderValue(key, value)}
          </span>
        </div>
      );
    })}
  </div>
</div>

{/* 🔹 PRICING */}
<div className="pd-card">
  <div className="pd-card-header">
    <h2>Pricing</h2>
  </div>
  <div className="pd-card-body">
    <div className="pd-value">Rent: ₹ {parsedForm.rent}</div>
    <div className="pd-value">Deposit: ₹ {parsedForm.deposit}</div>
    <div className="pd-value">
      Electricity: {parsedForm.electricityCharges}
    </div>
  </div>
</div>

{/* 🔹 FOOD */}
<div className="pd-card">
  <div className="pd-card-header">
    <h2>Food Details</h2>
  </div>
  <div className="pd-card-body">
    <div className="pd-value">Food: {parsedForm.foodProvided}</div>
    <div className="pd-value">Type: {parsedForm.foodType}</div>

    {parsedForm.foodTimings && (
      <div className="pd-value">
        {Object.entries(parsedForm.foodTimings).map(([meal, t]) => (
          <div key={meal}>
            <b>{meal}</b>: {t.from} - {t.to}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      <div className="pd-trust-item mb-5">
        <span className="pd-trust-icon">🏠</span>
        <p>Property details are shared directly by the owner</p>
      </div>

      <HelperBooking
        onConfirmHelper={(data) => setHelperBooking(data)}
        onCancelHelper={() => setHelperBooking(null)}
      />

      {/* 💳 FRIENDLY MONTHLY SUMMARY */}
      {parsedForm.rent && (() => {
        const billView = getBillBreakdown();

        // 3️⃣ Helper Services (ONLY if confirmed)


        return (
          <div className="pd-bill">

            {/* HEADER (CLICKABLE) */}
            <div
              className="pd-bill-header"
              onClick={() => setShowBillDetails(!showBillDetails)}
            >
              <h3>💳 Monthly Cost Summary</h3>
              <span className="pd-bill-toggle">
                {showBillDetails ? "▲" : "▼"}
              </span>
            </div>

            {/* FINAL PRICE ALWAYS VISIBLE */}
            <div className="pd-bill-total">
              <span>You Pay</span>
              <span>₹ {billView.finalPayable} / month</span>
            </div>

            <p className="pd-bill-note">
              😊 Simple, transparent & stress-free pricing
            </p>

            {/* DROPDOWN DETAILS */}
            {showBillDetails && (
              <div className="pd-bill-details">

                {billView.rows.map((row, i) => {
                  if (row.type === "info") {
                    return (
                      <div key={i} className="pd-bill-row faded">
                        <span className="flex items-center gap-2">
                          {row.label}

                          {row.removable && (
                            <button
                              onClick={cancelHelperBooking}
                              className="text-red-500 text-xs underline"
                            >
                              Remove
                            </button>
                          )}
                        </span>

                        <span>
                          {row.type === "minus" ? "− " : "+ "}
                          ₹ {row.amount}
                        </span>

                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className={`pd-bill-row ${row.type === "minus" ? "success" : row.optional ? "info" : ""
                        }`}
                    >
                      <span>{row.label}</span>
                      <span>
                        {row.type === "minus" ? "− " : "+ "}
                        ₹ {row.amount}
                      </span>
                    </div>
                  );
                })}

                <div className="pd-bill-divider"></div>

                {/* FINAL */}
                <div className="pd-bill-row final">
                  <span>Final Monthly Payable</span>
                  <span>₹ {billView.finalPayable}</span>
                </div>

                {/* META INFO */}
                <p className="pd-bill-note">
                  📅 Billing Period: Monthly <br />
                  ✔ Verified pricing • No hidden charges
                </p>

                <p className="pd-bill-note">
                  💡 No hidden charges. What you see is what you pay.
                </p>
              </div>
            )}
          </div>
        );
      })()}

      <div className="pd-trust-section">

        <div className="pd-trust-item">
          <span className="pd-trust-icon">📞</span>
          <p>You can safely contact the owner for more details</p>
        </div>
      </div>

      {/* STICKY CTA */}
      {parsedForm.mobile && (
        <div className="pd-sticky">
          <a href={`tel:${parsedForm.mobile}`} className="pd-call">
            📞 Call
          </a>
          <a
            href={`https://wa.me/91${parsedForm.mobile}`}
            target="_blank"
            rel="noreferrer"
            className="pd-whatsapp"
          >
            💬 WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}


