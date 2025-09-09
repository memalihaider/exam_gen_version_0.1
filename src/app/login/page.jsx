import { AuthForm } from "@/components/auth-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/5088008/pexels-photo-5088008.jpeg"
            alt="Education Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Largify Solutions          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-6">
            <p className="text-xl leading-relaxed">
              "This platform has revolutionized how we create and manage tests. The intuitive interface and powerful features have made test generation a breeze."
            </p>
            <footer className="text-sm text-gray-300">
              - Dr. Sarah Johnson, Education Director
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px] p-8 rounded-2xl bg-white/5 backdrop-blur-sm">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              Welcome Back
            </h1>
            <p className="text-base text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <AuthForm />
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact our support team at support@largifysolutions.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// In your login handler
const handleLogin = async (credentials) => {
  try {
    const response = await loginAPI(credentials); // Your login API call
    if (response.success) {
      login({
        ...response.user,
        token: response.token
      });
      router.push('/dashboard');
    }
  } catch (error) {
    // Handle error
  }
};