import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null);

  return (
    <footer className="mt-10 bg-gradient-to-br from-indigo-300 via-slate-10 to-black/10 text-gray-900">

      {/* TOP FEATURE STRIP */}


      {/* MAIN FOOTER */}

      <div className="max-w-7xl mx-auto px-3 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-extrabold text-purple-800 mb-3 -mt-10">
            RentHome
          </h2>
          <p className="text-sm leading-relaxed text-gray-900">
            RentHome is a smart rental platform that connects tenants and
            property owners directly. It removes brokerage, improves trust,
            and makes house hunting faster using modern features like QR codes.
          </p>

          <p className="mt-4 text-sm text-green-700 font-medium">
            Built for trust, not for commissions.
          </p>
        </div>

        {/* TENANTS */}
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg grid grid-cols-1 font-semibold text-purple-800 mb-4">
              For Tenants
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
              <li><Link to="/properties" className="hover:text-indigo-400">Browse Rental Homes</Link></li>
              <li><Link to="/nearme" className="hover:text-indigo-400">Find Homes Near Me</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400">Login / Signup</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400">FAQs</Link></li>
            </ul>
          </div>

          {/* OWNERS */}
          <div>
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              For Property Owners
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="hover:text-indigo-400">Owner Login</Link></li>
              <li><Link to="/addproperty" className="hover:text-indigo-400">Post Property</Link></li>
              <li><Link to="/myproperties" className="hover:text-indigo-400">Manage Listings</Link></li>
              <li><Link to="/analytics" className="hover:text-indigo-400">View Analytics</Link></li>
              <li><Link to="/report" className="hover:text-indigo-400">Report an Issue</Link></li>
            </ul>
          </div>
        </div>
        {/* HELP & CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">
            For Help & Support
          </h3>

          {/* <p className="text-sm mb-2">📍 Hyderabad, India</p>
          <p className="text-sm mb-2">📧 support@renthome.com</p>
          <p className="text-sm mb-4">📞 +91 9XXXXXXXXX</p> */}

          <div className="flex flex-col gap-3">
            <Link
              to="/faq"
              className="text-center px-4 py-2 rounded-lg bg-indigo-600
               hover:bg-indigo-700 text-white text-sm transition"
            >
              View FAQs
            </Link>

            <Link
              to="/contact"
              className="text-center px-4 py-2 rounded-lg border
               border-indigo-900 text-indigo-900 hover:bg-indigo-500 hover:text-white text-sm transition"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-5 px-0.5 flex flex-col sm:flex-row items-center
 justify-between gap-5 text-sm text-gray-900">

        <div className="grid grid-cols-2 -mt-5 gap-4 text-left">
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
