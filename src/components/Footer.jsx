import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null);

  return (
    <footer className="mt-0 border rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-100 border-t">

      {/* TOP FEATURE STRIP */}

      {/* MAIN FOOTER */}

<div className="max-w-7xl mx-auto px-3 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10">

  {/* BRAND / ABOUT */}
  <div>
    <h2 className="text-3xl font-extrabold text-indigo-700 mb-3">
      RentHome
    </h2>
    <p className="text-sm text-gray-700 text-justify leading-relaxed">
  RentHome is a smart rental platform designed to simplify the house hunting process.
  We connect tenants directly with property owners, eliminating brokers,
  reducing costs, and ensuring transparency in every step of renting.
</p>

    <p className="mt-4 text-sm text-green-600 font-semibold">
      🚀 Smart Renting. Zero Commission.
    </p>

  <div className="flex gap-3 mt-4 text-gray-600">
  <span>🌐</span>
  <span>📱</span>
  <span>💬</span>
</div>

  </div>

  {/* FEATURES */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Features
    </h3>
    <ul className="space-y-2 text-sm text-gray-600">
      <li>✔ No Brokerage Listings</li>
      <li>✔ Direct Owner Contact</li>
      <li>✔ QR Code Property Access</li>
      <li>✔ Near Me Search</li>
      <li>✔ Verified Listings</li>
    </ul>
  </div>

{/* ADVANTAGES */}
<div>
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    Why RentHome?
  </h3>
  <ul className="space-y-2 text-sm text-gray-600">
    <li>🚫 Zero Brokerage</li>
    <li>🤝 Direct Owner Deals</li>
    <li>⚡ Instant Property Access</li>
    <li>🔍 Smart Search Filters</li>
    <li>🔐 Trusted Platform</li>
  </ul>
</div>

  {/* TENANTS */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      For Tenants
    </h3>
    <ul className="space-y-2 text-sm text-gray-600">
  <li>🔍 Search homes by pincode, area & city</li>
  <li>📍 Find properties near your location</li>
  <li>⚡ Instant access to property details</li>
  <li>📱 Scan QR code on TO-LET boards</li>
  <li>💬 Directly contact property owners</li>
  <li>🚫 No hidden charges</li>
  <li>🔐 Transparent and secure renting</li>
</ul>
  </div>

{/* TENANTS */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      For Owners
    </h3>
    <ul className="space-y-2 text-sm text-gray-600">
  <li>➕ Post property listings</li>
  <li>📝 Manage and update your listings anytime</li>
  <li>📊 Track views and tenant interest</li>
  <li>📢 Reach tenants directly without brokers</li>
  <li>📱 Generate QR codes for your property</li>
  <li>🏷️ Place QR code on TO-LET boards</li>
  <li>⚡ Faster and smarter tenant connections</li>
</ul>
  </div>


  {/* CONTACT */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Contact Us
    </h3>
    <p className="text-sm text-gray-600 mb-2">📍 Hyderabad, India</p>
    <p className="text-sm text-gray-600 mb-2">📧 support@renthome.com</p>
    <p className="text-sm text-gray-600 mb-4">📞 +91 9XXXXXXXXX</p>

    <Link
      to="/contact"
      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
    >
      Contact Support
    </Link>
  </div>

</div>

<div className="border-t border-gray-200 py-6">
  <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-gray-600">
    <span>✔ 100+ Users</span>
    <span>✔ No Brokerage</span>
    <span>✔ Direct Owner Contact</span>
    <span>✔ Secure Platform</span>
  </div>
</div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-5 px-0.5 flex flex-col sm:flex-row items-center
 justify-between gap-5 text-sm text-gray-700">

        <div className="grid grid-cols-2 gap-4 text-left">
          {
            [
              "Tenant Policy",
              "Owner Policy",
              "Property Listing Policy",
              "Visit & Contact Policy",
              "Safety & Trust Policy",
              "Privacy Policy",
              "Terms & Conditions",
              "Disclaimer",
            ]

              .map((item) => (
                <button
                  key={item}
                  onClick={() => setActivePolicy(item)}
                  className="hover:text-indigo-700 font-medium"
                >
                  {item}
                </button>
              ))}
        </div>

        <p>© 2025 RentHome. All rights reserved.</p>
      </div>


      {/* SCROLL TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full"
      >
        ⬆
      </button>

      {activePolicy && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          onClick={() => setActivePolicy(null)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-indigo-700 mb-3">
              {activePolicy}
            </h2>

            <div className="text-sm text-gray-600 max-h-64 overflow-y-auto leading-relaxed space-y-3">
              {getPolicyContent(activePolicy)}
            </div>

            <button
              className="mt-5 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setActivePolicy(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>

  );
}

function getPolicyContent(type) {
  switch (type) {

    /* ---------- TENANT ---------- */
    case "Tenant Policy":
      return (
        <>
          <p>
            RentHome is a digital platform that allows tenants to view and
            explore rental properties listed by property owners.
          </p>
          <p>
            Tenants are responsible for verifying property details, rental
            terms, pricing, and legal compliance directly with the property
            owner before proceeding.
          </p>
          <p>
            RentHome does not participate in rental agreements, payments,
            or dispute resolution between tenants and owners.
          </p>
        </>
      );

    /* ---------- OWNER ---------- */
    case "Owner Policy":
      return (
        <>
          <p>
            Property owners may list rental properties on RentHome by
            submitting accurate and complete information.
          </p>
          <p>
            Owners are solely responsible for listing authenticity,
            pricing, availability, and compliance with local laws.
          </p>
          <p>
            RentHome reserves the right to remove listings that are
            misleading, duplicated, or reported for misuse.
          </p>
        </>
      );

    /* ---------- LISTING ---------- */
    case "Property Listing Policy":
      return (
        <>
          <p>
            Property listings must accurately reflect the actual
            condition, amenities, location, and rental terms.
          </p>
          <p>
            Any false, outdated, or deceptive information may lead
            to removal of the listing without notice.
          </p>
          <p>
            RentHome does not guarantee occupancy or rental outcomes.
          </p>
        </>
      );

    /* ---------- VISIT ---------- */
    case "Visit & Contact Policy":
      return (
        <>
          <p>
            RentHome enables direct contact between tenants and
            property owners using shared contact details.
          </p>
          <p>
            Property visits and discussions must be scheduled
            mutually and conducted respectfully.
          </p>
          <p>
            RentHome does not monitor, record, or intervene in
            communications or negotiations.
          </p>
        </>
      );

    /* ---------- SAFETY ---------- */
    case "Safety & Trust Policy":
      return (
        <>
          <p>
            RentHome encourages responsible and transparent
            interactions between all users.
          </p>
          <p>
            Users are advised not to make advance payments
            without verifying property ownership and legitimacy.
          </p>
          <p>
            Suspicious activity should be reported for review.
          </p>
        </>
      );

    /* ---------- PRIVACY ---------- */
    case "Privacy Policy":
      return (
        <>
          <p>
            RentHome respects user privacy and collects only the
            minimum information required to operate the platform.
          </p>
          <p>
            Personal information is used solely for platform
            functionality and is not sold to third parties.
          </p>
          <p>
            Contact details shared in listings are visible only
            for rental-related communication.
          </p>
        </>
      );

    /* ---------- TERMS ---------- */
    case "Terms & Conditions":
      return (
        <>
          <p>
            By accessing or using RentHome, users agree to comply
            with platform policies and applicable laws.
          </p>
          <p>
            RentHome acts solely as an information platform and
            does not act as a broker, agent, or legal authority.
          </p>
          <p>
            RentHome may update features or policies without
            prior notice to improve service quality.
          </p>
        </>
      );

    /* ---------- DISCLAIMER ---------- */
    case "Disclaimer":
      return (
        <>
          <p>
            RentHome does not guarantee the accuracy, legality,
            or availability of listed properties.
          </p>
          <p>
            Any rental transaction, agreement, or dispute is
            strictly between the tenant and property owner.
          </p>
          <p>
            RentHome shall not be held liable for losses,
            damages, or misunderstandings arising from usage.
          </p>
        </>
      );

    default:
      return null;
  }
}
