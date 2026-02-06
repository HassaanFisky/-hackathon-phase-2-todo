import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gray-900">Todo App</h1>
          <p className="text-xl text-gray-600">Phase II - GIAIC Hackathon II</p>
          <p className="text-sm text-gray-500">
            Full-Stack Web Application with Authentication
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            Next.js 15
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            FastAPI
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
            PostgreSQL
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
            Better Auth
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-lg hover:shadow-xl"
          >
            Sign Up
          </Link>
        </div>

        {/* Features list */}
        <div className="mt-12 max-w-md mx-auto text-left space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Features:
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Add, edit, and delete tasks
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Mark tasks as complete/incomplete
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Filter by status (all/pending/completed)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Secure authentication with JWT
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              User data isolation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
