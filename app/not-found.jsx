import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      {/* 404 */}
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">
        404
      </h1>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-2">
        Page Not Found
      </h2>

      {/* Message */}
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Button */}
      <Link href="/">
        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;