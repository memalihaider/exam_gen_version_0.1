import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Image 
        src="https://images.pexels.com/photos/5088008/pexels-photo-5088008.jpeg"
        alt="Education Background"
        fill
        className="object-cover filter brightness-75"
        priority
      />
      <div className="min-h-screen bg-gradient-to-b from-black/70 to-black/50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Exam Paper Generator
            </h1>
            <p className="text-xl mb-12 max-w-2xl text-center text-gray-200">
              Revolutionizing education through intelligent test generation
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <Link href="/login" 
                className="group flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🔒</span>
                <span className="font-medium">Login</span>
              </Link>
              
              <Link href="/saas-package"
                className="group flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">➕</span>
                <span className="font-medium">Signup</span>
              </Link>
              
              <Link href="https://docs.google.com/document/d/1V_EV8bJeQpEljABhdf3VYaZ9EYInJSPd465Vy4AUQAg/edit?usp=sharing"
                className="group flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">ℹ️</span>
                <span className="font-medium">Case Study</span>
              </Link>
              
              <Link href="#"
                className="group flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🎥</span>
                <span className="font-medium">Demo Video</span>
              </Link>
            </div>
            
            <p className="text-center text-xl mb-12 max-w-3xl text-gray-200 leading-relaxed">
              We are Creative Developers dedicated to revolutionizing education through innovative solutions. 
              Our platform simplifies test creation and management for educators worldwide.
            </p>
            
            <footer className="text-sm text-center text-gray-300">
              <p>Copyright © 2025 Largify Solutions Pakistan</p>
              <p className="mt-2">Empowering Education Through Technology</p>
              <p className="mt-2">Powered by AI</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
