import React from "react";
const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="bg-white shadow border-t border-gray-200 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-600">
          &copy; {currentYear} Developed at CSIR-IIP, All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
