import { useState } from "react";

export default function Faq() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What exactly is RentHome and how does it work?",
      a: "RentHome is an online rental discovery platform designed to connect tenants and property owners directly. It removes the need for brokers and middlemen, making the rental process more transparent. Property owners list their rentals, and tenants can browse, search, or scan QR codes to view complete details. This ensures faster communication and genuine listings."
    },
    {
      q: "Is RentHome free to use for tenants?",
      a: "Yes, RentHome is completely free for tenants. You can browse properties, search by location, and view details without paying any fees. There are no hidden charges or brokerage costs involved. The goal is to make rental discovery simple and affordable."
    },
    {
      q: "Do tenants need to create an account to browse properties?",
      a: "No, tenants can browse and search properties without creating an account. However, certain features like saving properties, contacting owners, or accessing QR-based listings may require login. Creating an account improves the overall experience but is optional."
    },
    {
      q: "Why should I create an account on RentHome?",
      a: "Creating an account allows you to save properties for later, contact owners securely, and manage your activity. It also helps ensure safe communication between tenants and owners. Logged-in users get a more personalized and reliable experience."
    },
    {
      q: "How does the ‘Near Me’ feature work?",
      a: "The Near Me feature uses your device location to find rental homes close to you. Once you allow location access, RentHome shows nearby listings within a certain distance. This helps users quickly find homes without manually entering areas. Location data is used only for search purposes."
    },

    /* ===================== QR CODE ===================== */

    {
      q: "What is the QR code feature in RentHome?",
      a: "RentHome provides a QR code for each listed property. Owners can place this QR code on TO-LET boards or share it digitally. When tenants scan the QR code, they are redirected to the property’s detail page instantly. This avoids phone calls and fake listings."
    },
    {
      q: "Is scanning QR codes safe on RentHome?",
      a: "Yes, QR scanning on RentHome is safe. The QR codes only redirect to verified property pages within the platform. No personal data is collected during scanning. This ensures a secure and trustworthy experience."
    },
    {
      q: "Do I need a separate app to scan RentHome QR codes?",
      a: "No separate app is required. You can scan QR codes using your mobile camera or any standard QR scanner. The scanned code opens directly in your browser. This makes access quick and convenient."
    },
    {
      q: "Can QR codes become invalid or expired?",
      a: "Yes, QR codes can be disabled if a property is removed or marked unavailable. This prevents outdated or fake listings. Owners have full control over their property status. Tenants always see updated information."
    },
    {
      q: "What should I do if a QR code does not work?",
      a: "If a QR code does not open, it may be expired or disabled by the owner. You can report the issue through the platform. RentHome monitors such cases to maintain listing quality. Alternative listings can be searched easily."
    },

    /* ===================== OWNERS ===================== */

    {
      q: "Who can post properties on RentHome?",
      a: "Only registered property owners are allowed to post listings on RentHome. This restriction helps reduce fake or misleading advertisements. Owners must log in before adding property details. This ensures genuine and trustworthy listings."
    },
    {
      q: "Is posting a property free for owners?",
      a: "Yes, posting a property on RentHome is completely free. There are no listing fees, commissions, or hidden charges. Owners can add and manage their listings anytime. The platform is built to support transparency."
    },
    {
      q: "Can owners edit or delete property listings?",
      a: "Yes, owners can edit or remove their listings whenever needed. Changes such as rent, availability, or photos can be updated easily. This helps keep property information accurate. Tenants always see the latest details."
    },
    {
      q: "Do owners get analytics or insights?",
      a: "Yes, owners can view basic analytics such as property views and engagement. This helps them understand tenant interest. Analytics assist owners in improving listing details. It is useful for better visibility."
    },
    {
      q: "Can owners manage multiple properties?",
      a: "Yes, RentHome allows owners to manage multiple properties from one dashboard. Each property can be added, updated, or removed independently. This makes management simple and organized. It is especially useful for owners with multiple rentals."
    },

    /* ===================== SAFETY ===================== */

    {
      q: "How does RentHome ensure safety for users?",
      a: "RentHome ensures safety by allowing only registered owners to post listings. User activity is monitored to reduce misuse. Reporting features help flag suspicious content. Privacy-first design protects user information."
    },
    {
      q: "Can I report a fake or suspicious listing?",
      a: "Yes, RentHome provides a report option for suspicious listings. Users can raise concerns directly through the platform. The support team reviews reported content. Necessary actions are taken to maintain trust."
    },
    {
      q: "Is my personal data secure on RentHome?",
      a: "Yes, RentHome follows privacy-focused practices. User data is not shared with third parties. Only essential information is stored for platform functionality. Security is a key priority."
    },
    {
      q: "Does RentHome show owner phone numbers publicly?",
      a: "No, owner contact details are shared securely within the platform. This prevents misuse of personal information. Communication is controlled and intentional. Privacy is respected for both parties."
    },
    {
      q: "Is RentHome suitable for first-time renters?",
      a: "Yes, RentHome is designed to be simple and beginner-friendly. Clear listings, FAQs, and support help new renters. The platform avoids complicated steps. First-time users can easily understand the process."
    },

    /* ===================== ACCOUNT ===================== */

    {
      q: "How do I create an account on RentHome?",
      a: "You can create an account by clicking the Signup option and entering basic details. The process is simple and quick. Once registered, you can access additional features. Account creation improves user experience."
    },
    {
      q: "Can I use the same account as a tenant and owner?",
      a: "Accounts are role-based to maintain clarity and security. Tenant and owner functionalities are separated. This avoids confusion during usage. Role separation helps manage platform features effectively."
    },
    {
      q: "What if I forget my password?",
      a: "Password recovery options will be available through the login page. Users can reset their password securely. This ensures continued access to accounts. Account recovery is handled safely."
    },
    {
      q: "Can I delete my account permanently?",
      a: "Yes, users can request account deletion through support. Once deleted, personal data is removed as per policy. This gives users control over their data. The process is handled responsibly."
    },
    {
      q: "Can I update my account information later?",
      a: "Yes, account details can be updated through profile settings. Users can change contact information or preferences. Keeping details updated improves communication. Changes are reflected immediately."
    },

    /* ===================== TECHNICAL ===================== */

    {
      q: "Is RentHome mobile-friendly?",
      a: "Yes, RentHome is fully responsive and works well on mobile devices. The interface adapts to different screen sizes. Users can browse and search easily on phones. Mobile usability is a priority."
    },
    {
      q: "Do I need to install any software to use RentHome?",
      a: "No installation is required. RentHome works directly in your web browser. This makes access easy on any device. Just open the website and start using it."
    },
    {
      q: "Which technologies are used to build RentHome?",
      a: "RentHome is built using modern web technologies like React and Tailwind CSS. The backend uses Spring Boot for stability. These technologies ensure performance and scalability. It is designed as a real-world project."
    },
    {
      q: "Does RentHome work on all browsers?",
      a: "Yes, RentHome supports modern browsers like Chrome, Edge, and Firefox. Regular updates ensure compatibility. Users are advised to use updated browsers. This ensures the best experience."
    },
    {
      q: "Is internet required to use RentHome?",
      a: "Yes, an active internet connection is required. Property listings and QR features depend on live data. Offline usage is not supported. Internet access ensures updated information."
    },

    /* ===================== SUPPORT ===================== */

    {
      q: "How can I contact RentHome support?",
      a: "Users can contact support through the Contact page. A support form is provided to raise issues or queries. This avoids sharing personal contact details. Support requests are handled professionally."
    },
    {
      q: "How long does support take to respond?",
      a: "Support requests are usually answered within 24 to 48 hours. Response time may vary based on issue type. Users are informed once the request is submitted. The goal is timely assistance."
    },
    {
      q: "Can I suggest new features for RentHome?",
      a: "Yes, feature suggestions are welcome. Users can submit feedback through support. Suggestions help improve the platform. User input is valued."
    },
    {
      q: "Where can I learn how to use RentHome?",
      a: "Users can refer to the FAQ section for guidance. Step-by-step explanations are provided. This reduces confusion and support dependency. FAQs are designed to be user-friendly."
    },
    {
      q: "Is RentHome a real company or a project?",
      a: "RentHome is a full-stack project designed to simulate a real rental platform. It demonstrates real-world features and workflows. The goal is practical learning and usability. It follows real product design principles."
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const highlight = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(
      regex,
      `<mark class="bg-yellow-300 px-1 rounded">$1</mark>`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 px-4 py-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-extrabold text-center mt-5 text-green-600 mb-6">
          Frequently Asked Questions
        </h1>

        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpenIndex(null);
          }}
          className="w-full px-5 py-4 rounded-xl border shadow mb-8"
        />

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border shadow">
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex justify-between px-5 py-4 text-left font-semibold"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight(faq.q),
                  }}
                />
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <div
                  className="px-5 pb-4 text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: highlight(faq.a),
                  }}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
