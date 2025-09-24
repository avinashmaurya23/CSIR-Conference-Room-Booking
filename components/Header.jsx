"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/image.png";
import {
  FiHome,
  FiBookmark,
  FiPlusSquare,
  FiBell,
  FiUsers,
  FiGrid,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiPlus,
} from "react-icons/fi";

import {
  FaUserCog,
  FaSignOutAlt,
  FaBuilding,
  FaUserShield,
  FaPlusSquare,
} from "react-icons/fa"; // Added FaPlusSquare
import { toast } from "react-toastify";
import destroySession from "@/app/actions/destroySession";
import { useAuth } from "@/context/authContext";
import BookRoomButton from "./BookRoomButton";

const Header = () => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();
  const isAdmin = currentUser?.role?.includes("admin");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    const { success, error } = await destroySession();

    if (success) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      router.push("/login");
    } else {
      toast.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" onClick={handleLinkClick}>
              <Image
                className="h-12 w-auto"
                src={logo}
                alt="Bookit"
                priority={true}
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
              >
                Conference Room
              </Link>
              {isAuthenticated && (
                <Link
                  href="/bookings"
                  className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  My Bookings
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/requests"
                  className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  New Requests
                </Link>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Book Room</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-base font-semibold text-gray-600 hover:text-gray-900"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-700"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="flex items-center rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <FaUserCog className="inline mr-2" /> My Profile
                    </button>
                    {isDropdownOpen && (
                      // TWEAK: Slightly widened the dropdown to fit the new link
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                        {isAdmin && (
                          <>
                            {/* THIS LINK HAS BEEN ADDED HERE */}
                            <Link
                              href="/rooms/add"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaPlusSquare className="inline mr-2" /> Add
                              Conference Room
                            </Link>
                            <Link
                              href="/users"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaUserShield className="inline mr-2" /> Manage
                              Users
                            </Link>
                            <Link
                              href="/rooms/my"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaBuilding className="inline mr-2" /> My Rooms
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaSignOutAlt className="inline mr-2" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU PANEL (Unchanged) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
            >
              <FiHome className="h-5 w-5" /> Conference Room
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/bookings"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  <FiBookmark className="h-5 w-5" /> My Bookings
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/requests"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                      <FiBell className="h-5 w-5" /> New Requests
                    </Link>
                    <Link
                      href="/rooms/add"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                      <FiPlusSquare className="h-5 w-5" /> Add Conference Room
                    </Link>
                    <Link
                      href="/users"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                      <FiUsers className="h-5 w-5" /> Manage Users
                    </Link>
                    <Link
                      href="/rooms/my"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                      <FiGrid className="h-5 w-5" /> My Rooms
                    </Link>
                  </>
                )}
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  <FiLogOut className="h-5 w-5" /> Sign Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <hr className="my-2 border-gray-200" />
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  <FiLogIn className="h-5 w-5" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  <FiUserPlus className="h-5 w-5" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <BookRoomButton
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </header>
  );
};

export default Header;

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/assets/images/image.png";
// import {
//   FaUser,
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaBuilding,
//   FaUserShield,
//   FaUserCog,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import destroySession from "@/app/actions/destroySession";
// import { useAuth } from "@/context/authContext";

// const Header = () => {
//   const router = useRouter();
//   const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
//     useAuth();
//   const isAdmin = currentUser?.role?.includes("admin");

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleLogout = async () => {
//     setIsDropdownOpen(false);
//     const { success, error } = await destroySession();

//     if (success) {
//       setIsAuthenticated(false);
//       setCurrentUser(null);
//       router.push("/login");
//     } else {
//       toast.error(error);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLinkClick = () => {
//     setIsMobileMenuOpen(false);
//     setIsDropdownOpen(false);
//   };

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <nav className="mx-auto max-w-7xl px-4 ">
//         <div className="flex h-16 items-center justify-between">
//           {/* LEFT ITEM: Logo */}
//           <div className="flex items-center">
//             <Link href="/" onClick={handleLinkClick}>
//               <Image
//                 className="h-12 w-auto"
//                 src={logo}
//                 alt="Bookit"
//                 priority={true}
//               />
//             </Link>
//           </div>

//           {/* CENTER ITEM: Desktop Menu */}
//           <div className="hidden md:block">
//             <div className="flex items-center space-x-2">
//               {/* FONT-SIZE CHANGE: Updated from 'text-sm' to 'text-base'. */}
//               <Link
//                 href="/"
//                 className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
//               >
//                 Conference Room
//               </Link>
//               {isAuthenticated && (
//                 <>
//                   <Link
//                     href="/bookings"
//                     className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
//                   >
//                     My Bookings
//                   </Link>
//                   {isAdmin && (
//                     <>
//                       <Link
//                         href="/rooms/add"
//                         className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
//                       >
//                         Add Conference Room
//                       </Link>
//                       <Link
//                         href="/Requests"
//                         className="rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-700 hover:text-white"
//                       >
//                         New Requests
//                       </Link>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* RIGHT ITEM: Profile/Login and Hamburger Menu */}
//           <div className="flex items-center">
//             <div className="hidden md:block">
//               <div className="ml-4 flex items-center md:ml-6">
//                 {!isAuthenticated ? (
//                   <div className="flex items-center space-x-4">
//                     {/* FONT-SIZE CHANGE: Updated from 'text-sm' to 'text-base'. */}
//                     <Link
//                       href="/login"
//                       className="text-base font-semibold text-gray-600 hover:text-gray-900"
//                     >
//                       Login
//                     </Link>
//                     {/* FONT-SIZE CHANGE: Updated from 'text-sm' to 'text-base'. */}
//                     <Link
//                       href="/register"
//                       className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-700"
//                     >
//                       Register
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="relative" ref={dropdownRef}>
//                     {/* FONT-SIZE CHANGE: Updated from 'text-sm' to 'text-base'. */}
//                     <button
//                       onClick={() => setIsDropdownOpen((prev) => !prev)}
//                       className="flex items-center rounded-md px-3 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                     >
//                       <FaUserCog className="inline mr-2" /> My Profile
//                     </button>
//                     {isDropdownOpen && (
//                       <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
//                         {isAdmin && (
//                           <>
//                             <Link
//                               href="/users"
//                               onClick={() => setIsDropdownOpen(false)}
//                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                               <FaUserShield className="inline mr-2" /> Manage
//                               Users
//                             </Link>
//                             <Link
//                               href="/rooms/my"
//                               onClick={() => setIsDropdownOpen(false)}
//                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                               <FaBuilding className="inline mr-2" /> My Rooms
//                             </Link>
//                           </>
//                         )}
//                         <button
//                           onClick={handleLogout}
//                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           <FaSignOutAlt className="inline mr-2" /> Sign Out
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Hamburger Button */}
//             <div className="md:hidden ml-4">
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 {isMobileMenuOpen ? (
//                   <svg
//                     className="h-6 w-6"
//                     stroke="currentColor"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="h-6 w-6"
//                     stroke="currentColor"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 6h16M4 12h16M4 18h16"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* MOBILE MENU PANEL (Font size is already 'text-base') */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             <Link
//               href="/"
//               onClick={handleLinkClick}
//               className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//             >
//               Conference Room
//             </Link>
//             {isAuthenticated && (
//               <>
//                 <Link
//                   href="/bookings"
//                   onClick={handleLinkClick}
//                   className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                 >
//                   Bookings
//                 </Link>
//                 {isAdmin && (
//                   <>
//                     <Link
//                       href="/rooms/add"
//                       onClick={handleLinkClick}
//                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                     >
//                       Add Conference Room
//                     </Link>
//                     <Link
//                       href="/Requests"
//                       onClick={handleLinkClick}
//                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                     >
//                       New Requests
//                     </Link>
//                     <Link
//                       href="/users"
//                       onClick={handleLinkClick}
//                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                     >
//                       Manage Users
//                     </Link>
//                     <Link
//                       href="/rooms/my"
//                       onClick={handleLinkClick}
//                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                     >
//                       My Rooms
//                     </Link>
//                   </>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                 >
//                   <FaSignOutAlt className="inline mr-2" /> Sign Out
//                 </button>
//               </>
//             )}
//             {!isAuthenticated && (
//               <>
//                 <Link
//                   href="/login"
//                   onClick={handleLinkClick}
//                   className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                 >
//                   <FaSignInAlt className="inline mr-1" /> Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   onClick={handleLinkClick}
//                   className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-200"
//                 >
//                   <FaUser className="inline mr-1" /> Register
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
