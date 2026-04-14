import { useNavigate } from "react-router-dom";
import notFoundImg from "../assets/NotFoundImg.png";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      
      <img
        src={notFoundImg}
        alt="404 Not Found"
        className="w-full h-auto mb-6"
      />

      <h1 className="text-3xl font-bold p-6 text-red-500 text-gray-700">
        Oops..! The Page You are looking for is Not Avalable...
      </h1>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Take me Home 🏠
      </button>
    </div>
  );
}