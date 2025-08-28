"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActionState } from "react";
import createSession from "../actions/createSession";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";

const LoginPage = () => {
  const [state, formAction] = useActionState(createSession, {});

  const { setIsAuthenticated, setCurrentUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success && state.user) {
      toast.success("Login successful!");
      setIsAuthenticated(true);
      setCurrentUser(state.user);
      router.push("/");
    }
  }, [state, setIsAuthenticated, setCurrentUser, router]);

  return (
    <div className="flex justify-center items-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-8 w-full max-w-sm">
        {" "}
        {/* Refined shadow and added border */}
        <form action={formAction}>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            Login
          </h2>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              required
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              required
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>

            <p className="mt-2 text-center text-sm text-gray-600">
              No account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
