import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          {/* Hero Section */}
          <div className="text-center space-y-8 animate-slide-up">
            {/* Logo/Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full shadow-medium hover-glow transition-all duration-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Phase II - GIAIC Hackathon
              </span>
            </div>

            {/* Title with Gradient */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black">
                <span className="text-gradient">Todo</span>
                <span className="text-gray-900 dark:text-white">
                  {" "}
                  Reimagined
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                A premium task management experience crafted with modern design
                and blazing performance
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                {
                  label: "Next.js 15",
                  color: "bg-gradient-to-r from-blue-500 to-blue-600",
                },
                {
                  label: "FastAPI",
                  color: "bg-gradient-to-r from-green-500 to-emerald-600",
                },
                {
                  label: "PostgreSQL",
                  color: "bg-gradient-to-r from-purple-500 to-indigo-600",
                },
                {
                  label: "TypeScript",
                  color: "bg-gradient-to-r from-blue-600 to-cyan-600",
                },
              ].map((tech, i) => (
                <div
                  key={tech.label}
                  className="px-4 py-2 glass rounded-xl shadow-base hover-lift hover-glow animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {tech.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-scale-in"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                href="/login"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-bold text-lg shadow-large hover:shadow-glow hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/signup"
                className="px-8 py-4 glass rounded-2xl font-bold text-lg text-gray-900 dark:text-white shadow-base hover:shadow-large hover-lift transition-all duration-300 border-2 border-transparent hover:border-primary-500/30"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            {[
              {
                icon: "✓",
                title: "Smart Task Management",
                description:
                  "Create, edit, and organize tasks with an intuitive interface",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description:
                  "Optimized performance with instant updates and smooth animations",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description:
                  "Enterprise-grade security with JWT authentication",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: "🎨",
                title: "Beautiful UI",
                description:
                  "Crafted with premium glassmorphism and modern aesthetics",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: "📱",
                title: "Fully Responsive",
                description:
                  "Perfect experience across all devices and screen sizes",
                gradient: "from-indigo-500 to-blue-500",
              },
              {
                icon: "🌙",
                title: "Dark Mode Ready",
                description: "Seamless theme switching for comfortable viewing",
                gradient: "from-violet-500 to-purple-500",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group glass-card p-6 hover-lift hover-glow cursor-pointer animate-scale-in"
                style={{ animationDelay: `${500 + i * 100}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} text-white text-2xl mb-4 shadow-medium group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Badge */}
          <div
            className="mt-16 text-center animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with ❤️ for GIAIC Hackathon Phase II
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
