import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold text-[#0205B7] mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-[#0205B7] text-white rounded-full hover:bg-opacity-90 transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

export default NotFound;