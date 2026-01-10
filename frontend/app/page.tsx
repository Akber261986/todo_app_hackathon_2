'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function Home() {
  const [cookies] = useCookies(['token']);
  const [redirectHandled, setRedirectHandled] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');

  const features = [
    {
      title: 'AI-Powered Assistance',
      description: 'Our smart AI helps you manage tasks and boost productivity',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Smart Task Management',
      description: 'Organize your tasks efficiently with our intuitive interface',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Real-time Sync',
      description: 'Access your tasks from anywhere, anytime',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      content: 'This app transformed how I manage my daily tasks. The AI assistant is incredibly helpful!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'The task management features are intuitive and the AI integration saves me hours every week.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Marketing Director',
      content: 'Finally, a productivity app that actually works. The AI assistant understands my needs perfectly.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    }
  ];

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const token = cookies.token;
    if (token) {
      router.push('/dashboard');
    }
    setRedirectHandled(true); // Mark that redirect check is done
  }, [cookies, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! We'll contact you at ${email}`);
    setEmail('');
  };

  // Don't render content until redirect is handled to avoid flickering
  if (!redirectHandled) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">Checking authentication...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="ml-3 text-2xl font-bold text-white">TaskFlow AI</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/signin" className="text-white hover:text-cyan-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Transform Your</span>
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Productivity</span>
                </h1>
                <p className="mt-3 text-base text-blue-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  TaskFlow AI combines intelligent task management with AI-powered assistance to help you achieve more with less effort. Join thousands of productive individuals today.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 md:py-4 md:text-lg md:px-10 transition-all shadow-lg"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-white/10 hover:bg-white/20 md:py-4 md:text-lg md:px-10 transition-all backdrop-blur-sm"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="relative w-4/5 h-4/5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">TaskFlow AI</div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-4 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="bg-blue-500/20 rounded-lg p-3">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                          AI
                        </div>
                        <div>
                          <div className="text-white text-sm">Hey there! How can I help you manage your tasks today?</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 ml-auto max-w-[80%]">
                      <div className="text-white text-sm">Show me my pending tasks please</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                          AI
                        </div>
                        <div>
                          <div className="text-white text-sm">Here are your pending tasks:</div>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-white/80 text-xs">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                              Complete project proposal
                            </div>
                            <div className="flex items-center text-white/80 text-xs">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                              Schedule team meeting
                            </div>
                            <div className="flex items-center text-white/80 text-xs">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                              Review quarterly reports
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-b from-indigo-900/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-cyan-400 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Everything you need to stay organized
            </p>
            <p className="mt-4 max-w-2xl text-xl text-blue-200 mx-auto">
              Our platform combines powerful features with AI intelligence to help you achieve peak productivity.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="mt-4 text-lg font-medium text-white text-center">{feature.title}</h3>
                  <p className="mt-2 text-blue-200 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-blue-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-cyan-400 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              What our users say
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full" src={testimonial.avatar} alt={testimonial.name} />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">{testimonial.name}</h4>
                      <p className="text-blue-200">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-blue-100 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to transform your productivity?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Join thousands of satisfied users who have revolutionized their task management with AI assistance.
              </p>
              <div className="mt-8">
                <form onSubmit={handleSubmit} className="sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="block w-full px-5 py-3 text-base text-gray-900 placeholder-gray-500 rounded-full focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full py-3 px-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      Get Started
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-sm text-white/80">
                  Free 14-day trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-white">TaskFlow AI</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-blue-200">
                &copy; 2026 TaskFlow AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}