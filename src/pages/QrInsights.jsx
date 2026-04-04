import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/config";

export default function QrInsights() {

  const [data,setData] = useState([]);
  const [properties,setProperties] = useState({});
  const [selectedDate,setSelectedDate] = useState("");
  const [propertyType,setPropertyType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading,setLoading] = useState(false);

  const handleRefresh = async () => {

  await loadData();

  setShowToast(true);

  setTimeout(() => {
    setShowToast(false);
  }, 2000);

};

  // load scan history
  const loadData = async () => {

    try{

      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/analytics/history`);
      const json = await res.json();

      if(Array.isArray(json)){
        setData(json);
      }else{
        setData([]);
      }

    }catch(err){
      console.error(err);
      setData([]);
    }
    finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    loadData();
  },[]);


  // fetch property details
  useEffect(()=>{

    const fetchProperties = async () => {

      const uniqueIds = [...new Set(data.map(d=>d.propertyId))];

      const map = {};

      for(const id of uniqueIds){

        try{

          const res = await fetch(`${API_BASE_URL}/api/forms/${id}`);
          const d = await res.json();

          map[id] = {
            title: d.title || d.pgName || d.flatName || "Property",
            type: d.propertyType || d.type || d.formType || "Unknown",
            uploaded: d.createdAt || d.uploadedAt || null
          };

        }catch(e){

          map[id] = {
            title:"Property",
            type:"Unknown",
            uploaded:null
          };

        }

      }

      setProperties(map);

    };

    if(data.length){
      fetchProperties();
    }

  },[data]);


  const formatTimeSpent = (seconds)=>{

    if(!seconds) return "0 sec";

    if(seconds < 60){
      return `${seconds} seconds`;
    }

    const min = Math.floor(seconds/60);
    const sec = seconds % 60;

    if(sec === 0) return `${min} minutes`;

    return `${min} min ${sec} sec`;

  };


  const detectDevice = ()=>{
    return /Mobi|Android/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop";
  };


  const filtered = selectedDate
    ? data.filter(scan=>{

        const scanDate = new Date(scan.createdAt).toDateString();
        const selected = new Date(selectedDate).toDateString();

        const matchDate = scanDate === selected;

        const type = properties[scan.propertyId]?.type?.toLowerCase();

        const matchType =
          !propertyType || type === propertyType.toLowerCase();

        return matchDate && matchType;

      })
    : [];


  const grouped = {};

  filtered.forEach(scan=>{

    const key = scan.propertyId;

    if(!grouped[key]){
      grouped[key] = {
        propertyId:key,
        scans:[]
      };
    }

    grouped[key].scans.push(scan);

  });

  return(

  <div className="pt-24 px-4 min-h-screen bg-gray-50">

    <div className="flex justify-between items-center mb-6">

      <h1 className="text-2xl font-bold text-indigo-600">
        📊 QR Scan Insights
      </h1>

<button
  onClick={handleRefresh}
  className="flex items-center gap-2 text-black border border-blue-300 px-2 py-2 rounded-lg shadow-sm hover:bg-green-300 active:scale-90 transition-transform duration-150"
>
  🔄 Refresh
</button>


  {showToast && (
  <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
    ✅ Data Updated
  </div>
)}


    </div>


    <div className="grid grid-cols-2 gap-3 mb-6">

      <input
        type="date"
        value={selectedDate}
        onChange={(e)=>setSelectedDate(e.target.value)}
        className="border rounded-lg p-2"
      />

      <select
        value={propertyType}
        onChange={(e)=>setPropertyType(e.target.value)}
        className="border rounded-lg p-2"
      >

        <option value="">All Types</option>
        <option value="apartment">Apartment</option>
        <option value="flat">Flat</option>
        <option value="independenthouse">Independent House</option>
        <option value="office">Office</option>
        <option value="pg">PG</option>
        <option value="shop">Shop</option>
        <option value="others">Others</option>

      </select>

    </div>


    {!selectedDate && (

      <div className="flex justify-center items-center h-60">

        <p className="text-lg text-gray-500">
          Select filters for better results
        </p>

      </div>

    )}


    {selectedDate && Object.keys(grouped).length === 0 && (

      <div className="flex justify-center items-center h-60">

        <p className="text-red-500 text-lg">
          No analytics found for selected date
        </p>

      </div>

    )}


    <div className="space-y-6">

      {Object.entries(grouped).map(([propertyId,property])=>{

        const info = properties[propertyId] || {};

        return(

        <div
          key={propertyId}
          className="bg-white rounded-xl shadow p-6"
        >

          <div className="border-b pb-3 mb-4">

            <h2 className="text-lg font-bold text-indigo-600">
              🏠 {info.title}
            </h2>

            <p className="text-sm text-gray-500">
              Property ID: {propertyId}
            </p>

            <p className="text-1xl pt-1 pb-1 text-gray-500">
              Property Type: <strong className="underline">{info.type}</strong>
            </p>

            {info.uploaded && (

              <p className="text-sm text-gray-500">
                Uploaded Date:
                {" "}
                {new Date(info.uploaded).toLocaleDateString()}
              </p>

            )}

            <p className="text-sm font-semibold text-gray-700 mt-1">
              Users Scanned: {property.scans.length}
            </p>

          </div>

          <div className="space-y-4">

          {property.scans.map((scan,i)=>{

            const date = new Date(scan.createdAt);

            return(

            <div
              key={i}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-md"            >

              <h3 className="font-semibold text-green-800 mb-2">
                Visitor {i+1}
              </h3>

              <p className="text-sm text-gray-600">
                📅 Scan Date: {date.toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600">
                ⏰ Scan Time: {date.toLocaleTimeString()}
              </p>

              <p className="text-sm text-gray-600">
                ⏱ Time Spent:
                {" "}
                {formatTimeSpent(scan.timeSpent)}
              </p>

              <p className="text-sm text-gray-600">
                📱 Device:
                {" "}
                {scan.device || detectDevice()}
              </p>

              <p className="text-sm text-gray-600">
                🌐 Visitor IP:
                {" "}
                {scan.ip || "Unknown"}
              </p>

              <p className="text-sm text-gray-600">
                📊 Engagement Score:
                {" "}
                {scan.timeSpent > 60 ? "High" : "Low"}
              </p>

            </div>

            );

          })}

          </div>

        </div>

        );

      })}

    </div>

  </div>

  );

}