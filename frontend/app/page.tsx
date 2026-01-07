import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold text-indigo-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          TodoApp
        </div>
        <div className="flex space-x-4">
          <Link href="/signin" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Organize Your Life with <span className="text-indigo-600">TodoApp</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A simple and powerful todo application to help you manage your tasks, stay organized, and boost your productivity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started - It's Free
            </Link>
            <Link
              href="/signin"
              className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition duration-300"
            >
              Sign In to Your Account
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
              <p className="text-gray-600">Create, update, and organize your tasks with a simple interface.</p>
            </div>
            <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected with industry-standard security measures.</p>
            </div>
            <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
              <p className="text-gray-600">Sync your tasks across all your devices seamlessly.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p>&copy; 2026 TodoApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}