// Add "use client" directive at the top
"use client";

export default function SaaSPlans() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 text-gray-800">
        {/* Hero Section with Image */}
        <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center text-white py-24">
            <h1 className="text-6xl font-extrabold mb-4">Discover Your Perfect Plan</h1>
            <p className="text-xl max-w-2xl mx-auto">Empower your educational journey with our tailored plans.</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Choose Your Plan
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-gray-600">
              Discover the perfect plan tailored to your educational journey.
            </p>
          </div>
          
          {/* 2x2 Grid Layout with Glassy Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Basic Plan - keeping the same structure but removing link wrapper */}
            <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg text-gray-900 rounded-2xl p-10 shadow-2xl hover:shadow-3xl transition-transform duration-500 transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Basic Plan (Free)</h2>
              <p className="text-lg mb-4 text-gray-600">For: Individual educators, tutors, and small coaching centers.</p>
              <ul className="text-lg space-y-3">
                <li>✅ Create up to 5 exams per month</li>
                <li>✅ 50-question limit per exam</li>
                <li>✅ Basic question types: MCQs, True/False, Short Answer</li>
                <li>✅ Randomized question selection from a question bank</li>
                <li>✅ Basic PDF export</li>
                <li>✅ Email support</li>
              </ul>
            </div>
            
            {/* Pro Plan - removing link wrapper */}
            <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg text-gray-900 rounded-2xl p-10 shadow-2xl hover:shadow-3xl transition-transform duration-500 transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Pro Plan (Most Popular)</h2>
              <p className="text-lg mb-4 text-gray-600">For: Schools, coaching institutes, and professional educators.</p>
              <p className="text-xl font-bold mb-4 text-blue-600">💲 $19.99/month</p>
              <ul className="text-lg space-y-3">
                <li>✅ Unlimited exam creation</li>
                <li>✅ 500-question limit per exam</li>
                <li>✅ Advanced question types: Fill in the Blanks, Descriptive, Matching</li>
                <li>✅ AI-powered question shuffling for different difficulty levels</li>
                <li>✅ Automated grading for MCQs & True/False</li>
                <li>✅ Custom branding (logo, institute name)</li>
                <li>✅ Google Classroom & LMS Integration</li>
                <li>✅ Detailed analytics & reports</li>
                <li>✅ Priority email & chat support</li>
              </ul>
            </div>

            {/* Business Plan - removing link wrapper */}
            <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg text-gray-900 rounded-2xl p-10 shadow-2xl hover:shadow-3xl transition-transform duration-500 transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Business Plan</h2>
              <p className="text-lg mb-4 text-gray-600">For: Universities, large institutions, corporate training.</p>
              <p className="text-xl font-bold mb-4 text-blue-600">💲 $49.99/month</p>
              <ul className="text-lg space-y-3">
                <li>✅ All Pro Plan features +</li>
                <li>✅ Team collaboration (multiple instructors can create & edit exams)</li>
                <li>✅ AI-powered difficulty balancing</li>
                <li>✅ Bulk question import (CSV, Word, Google Docs)</li>
                <li>✅ Question tagging & categorization</li>
                <li>✅ Timed exams & proctoring integration</li>
                <li>✅ Customizable grading system</li>
                <li>✅ API access for integration</li>
                <li>✅ Live support (chat & email)</li>
              </ul>
            </div>

            {/* Enterprise Plan - removing link wrapper */}
            <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg text-gray-900 rounded-2xl p-10 shadow-2xl hover:shadow-3xl transition-transform duration-500 transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Enterprise Plan</h2>
              <p className="text-lg mb-4 text-gray-600">For: Governments, educational boards, and large-scale assessment providers.</p>
              <p className="text-xl font-bold mb-4 text-blue-600">💲 Custom Pricing (Contact Us)</p>
              <ul className="text-lg space-y-3">
                <li>✅ All Business Plan features +</li>
                <li>✅ Dedicated account manager</li>
                <li>✅ On-premise deployment option</li>
                <li>✅ AI-generated question bank from provided documents</li>
                <li>✅ Advanced security (2FA, encryption, role-based access control)</li>
                <li>✅ Custom workflow automation & integrations</li>
                <li>✅ 24/7 premium support</li>
                <li>✅ White-label solution</li>
                <li>✅ Custom development & feature requests</li>
              </ul>
            </div>
          </div>
          
          {/* Adding Call-to-Action Section */}
          <div className="mt-16 text-center space-y-8">
            <a 
              href="/payment/basic" 
              className="inline-block px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </a>
            
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Interested in Enterprise Plan?</h3>
              <p className="text-gray-600 mb-6">Let's discuss how we can customize our solution for your organization</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="https://wa.me/923176333055?text=Hi,%20I'm%20interested%20in%20discussing%20the%20Enterprise%20Plan" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact Us
                </a>
                <a 
                  href="https://wa.me/923176333055?text=Hi,%20I'd%20like%20to%20schedule%20a%20demo%20for%20the%20Enterprise%20Plan" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Schedule a Demo
                </a>
              </div>
            </div>
          </div>
          
          <footer className="text-center mt-20 pb-12">
            <div className="max-w-4xl mx-auto">

              <div className="border-t border-gray-200 pt-8">
                <p className="text-gray-600">© 2025 Largiy Solutions Pakistan</p>
                <p className="text-gray-500 mt-2">Empowering Education Through Technology</p>
                <div className="flex justify-center space-x-6 mt-6">
                  {/* <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  </a> */}
                  {/* Add more social icons similarly */}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* CSS for LED-like border animation */}
      <style jsx>{`
        @keyframes ledBorderAnimation {
          0% { border-image-source: linear-gradient(90deg, red, orange); }
          25% { border-image-source: linear-gradient(90deg, orange, yellow); }
          50% { border-image-source: linear-gradient(90deg, yellow, green); }
          75% { border-image-source: linear-gradient(90deg, green, blue); }
          100% { border-image-source: linear-gradient(90deg, blue, indigo); }
        }
        .animate-led-border {
          border-image-slice: 1;
          border-width: 4px;
          animation: ledBorderAnimation 5s infinite linear;
        }
      `}</style>
    </>
  );
}
