"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/image.png";
import {
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaBuilding,
  FaUserShield,
  FaUserCog,
} from "react-icons/fa";
import { toast } from "react-toastify";
import destroySession from "@/app/actions/destroySession";
import { useAuth } from "@/context/authContext";

const Header = () => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();
  const isAdmin = currentUser?.role?.includes("admin");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <header className="bg-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                className="h-12 w-12"
                src={logo}
                alt="Bookit"
                priority={true}
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Conference Room
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      href="/bookings"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Bookings
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          href="/rooms/add"
                          className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                        >
                          Add Conference Room
                        </Link>
                        <Link
                          href="/Requests"
                          className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                        >
                          New Requests
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="mr-3 text-gray-800 hover:text-gray-600"
                  >
                    <FaSignInAlt className="inline mr-1" /> Login
                  </Link>
                  <Link
                    href="/register"
                    className="mr-3 text-gray-800 hover:text-gray-600"
                  >
                    <FaUser className="inline mr-1" /> Register
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUserCog className="inline mr-2" /> My Profile
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                      {/* <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUserCog className="inline mr-2" /> Manage Profile
                      </Link> */}

                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/users"
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
        </div>
      </nav>

      <div className="md:hidden">
        {/* ... mobile menu content remains unchanged ... */}
      </div>
    </header>
  );
};

export default Header;

// "use client";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/assets/images/image.png";
// import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from "react-icons/fa";
// import { toast } from "react-toastify";
// import destroySession from "@/app/actions/destroySession";
// import { useAuth } from "@/context/authContext";

// const Header = () => {
//   const router = useRouter();
//   const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
//     useAuth();
//   const isAdmin = currentUser?.role?.includes("admin");

//   console.log(isAdmin);
//   console.log(currentUser);
//   const handleLogout = async () => {
//     const { success, error } = await destroySession();

//     if (success) {
//       setIsAuthenticated(false);
//       router.push("/login");
//     } else {
//       toast.error(error);
//     }
//   };

//   return (
//     <header className="bg-gray-100">
//       <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center">
//             <Link href="/">
//               <Image
//                 className="h-12 w-12"
//                 src={logo}
//                 alt="Bookit"
//                 priority={true}
//               />
//             </Link>
//             <div className="hidden md:block">
//               <div className="ml-10 flex items-baseline space-x-4">
//                 <Link
//                   href="/"
//                   className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//                 >
//                   Conference Room
//                 </Link>
//                 {/* <!-- Logged In Only --> */}
//                 {isAuthenticated && (
//                   <>
//                     <Link
//                       href="/bookings"
//                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//                     >
//                       Bookings
//                     </Link>
//                     {isAdmin && (
//                       <>
//                         <Link
//                           href="/rooms/add"
//                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//                         >
//                           Add Conference Room
//                         </Link>

//                         <Link
//                           href="/Requests"
//                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//                         >
//                           New Requests
//                         </Link>
//                       </>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* <!-- Right Side Menu --> */}
//           <div className="ml-auto">
//             <div className="ml-4 flex items-center md:ml-6">
//               {/* <!-- Logged Out Only --> */}
//               {!isAuthenticated && (
//                 <>
//                   <Link
//                     href="/login"
//                     className="mr-3 text-gray-800 hover:text-gray-600"
//                   >
//                     <FaSignInAlt className="inline mr-1" /> Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     className="mr-3 text-gray-800 hover:text-gray-600"
//                   >
//                     <FaUser className="inline mr-1" /> Register
//                   </Link>
//                 </>
//               )}
//               {isAdmin && (
//                 <Link
//                   href="/rooms/my"
//                   className="mr-3 text-gray-800 hover:text-gray-600"
//                 >
//                   <FaBuilding className="inline mr-1" /> My Conference Rooms
//                 </Link>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="mx-3 text-gray-800 hover:text-gray-600"
//               >
//                 <FaSignOutAlt className="inline mr-1" /> Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* <!-- Mobile menu --> */}
//       <div className="md:hidden">
//         <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
//           <Link
//             href="/"
//             className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//           >
//             Rooms
//           </Link>
//           {/* <!-- Logged In Only --> */}
//           {isAuthenticated && (
//             <>
//               <Link
//                 href="/bookings"
//                 className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//               >
//                 Bookings
//               </Link>
//               <Link
//                 href="/rooms/add"
//                 className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
//               >
//                 Add Room
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
