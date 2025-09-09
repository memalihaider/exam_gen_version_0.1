"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

export default function PaymentPage() {
  // Add filePreview state at the top with other states
  const [formData, setFormData] = useState({
    name: '',
    institute: '',
    email: '',
    password: '',
    package: '', // Default empty to force selection
    paymentMethod: 'meezan',
    paymentProof: null,
  });
  const [filePreview, setFilePreview] = useState(null);

  // Add handleFileChange with other handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, paymentProof: file });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const packages = {
    pro: {
      name: 'Pro Plan',
      price: '$19.99/month',
      features: [
        'Unlimited exams per month',
        '200-question limit per exam',
        'Advanced question types',
        'Custom PDF templates',
        'Priority support'
      ]
    },
    business: {
      name: 'Business Plan',
      price: '$49.99/month',
      features: [
        'Everything in Pro, plus:',
        'Multiple teacher accounts',
        'Advanced analytics',
        'Custom branding',
        'API access',
        '24/7 dedicated support'
      ]
    }
  };

  // Add package selection handler
  const handlePackageSelect = (packageType) => {
    setFormData(prev => ({ ...prev, package: packageType }));
  };

  // Add this helper function for image compression
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Reduce max width to ensure smaller file size
          const MAX_WIDTH = 1024;
          const MAX_FILE_SIZE = 48 * 1024; // 48KB to stay under EmailJS 50KB limit

          let width = img.width;
          let height = img.height;

          // Calculate scaling
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Start with medium quality
          let quality = 0.7;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Reduce quality until file size is acceptable
          while (dataUrl.length > MAX_FILE_SIZE && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // If still too large, reduce dimensions
          if (dataUrl.length > MAX_FILE_SIZE) {
            const scale = Math.sqrt(MAX_FILE_SIZE / dataUrl.length);
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          }

          resolve(dataUrl);
        };
      };
    });
  };

  // Update the file preview display
  // Add this state for status message at the top with other states
  const [submitStatus, setSubmitStatus] = useState({ show: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageData = '';
      if (formData.paymentProof) {
        imageData = await compressImage(formData.paymentProof);
      }

      // Initialize EmailJS
      emailjs.init('wEwrCShqLZuAxP23f');

      const templateParams = {
        to_name: 'Admin',
        from_name: formData.name,
        user_email: formData.email,
        institute: formData.institute,
        package_name: packages[formData.package].name,
        package_price: packages[formData.package].price,
        payment_method: formData.paymentMethod,
        // Remove the message property since we're using structured data
        payment_proof: imageData
      };

      const response = await emailjs.send(
        'service_fg08p6p',
        'template_vvlosau',
        templateParams,
        'wEwrCShqLZuAxP23f'
      );

      if (response.status === 200) {
        setSubmitStatus({
          show: true,
          message: 'Registration submitted successfully! Your account will be activated within 24 hours. Please check your email for confirmation.'
        });

        // Increased timeout for the longer message
        setTimeout(() => {
          setSubmitStatus({ show: false, message: '' });
          setFormData({
            name: '',
            institute: '',
            email: '',
            password: '',
            package: '',
            paymentMethod: 'meezan',
            paymentProof: null
          });
          setFilePreview(null);
        }, 5000); // Increased to 5 seconds for better readability
      }
    } catch (error) {
      console.error('Error processing form:', error);
      setSubmitStatus({
        show: true,
        message: 'Error sending form. Please try again.'
      });
    }
  };

  // Add this right before the closing </div> of the main container
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Keep existing background elements */}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto relative z-10 px-4"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 lg:p-16 border border-gray-100">
          <h2 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Package
          </h2>

          {/* Package Selection */}
          {!formData.package && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {Object.entries(packages).map(([key, pack]) => (
                <div
                  key={key}
                  onClick={() => handlePackageSelect(key)}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105 h-full"
                >
                  <div className="bg-white/70 rounded-xl p-8 shadow-lg border-2 border-transparent hover:border-blue-500 h-full flex flex-col">
                    <h3 className="text-3xl font-bold mb-4">{pack.name}</h3>
                    <p className="text-2xl font-semibold text-blue-600 mb-6">{pack.price}</p>
                    <ul className="space-y-3 flex-grow">
                      {pack.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                      {/* Add invisible items to balance height if needed */}
                      {pack.features.length < 6 && [...Array(6 - pack.features.length)].map((_, i) => (
                        <li key={`spacer-${i}`} className="invisible">Spacer</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show payment details only after package selection */}
          {formData.package && (
            <>
              <div className="mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    Selected Package: {packages[formData.package].name}
                  </h3>
                  <p className="text-xl text-blue-600">
                    Price: {packages[formData.package].price}
                  </p>
                </div>
              </div>

              {/* Guide Section */}
              <div className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                <h3 className="text-3xl font-semibold mb-6 text-gray-800 text-center">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                    <h4 className="text-xl font-semibold mb-2">Choose Payment Method</h4>
                    <p className="text-gray-600">Select your preferred payment method from the options below</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                    <h4 className="text-xl font-semibold mb-2">Make Payment</h4>
                    <p className="text-gray-600">Transfer the amount using the provided payment details</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                    <h4 className="text-xl font-semibold mb-2">Submit Proof</h4>
                    <p className="text-gray-600">Fill the form and upload your payment screenshot</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-inner relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">₨</div>
                  <h3 className="text-2xl font-semibold mb-6 text-blue-800">Bank Transfer</h3>
                  <div className="space-y-4">
                    <div className="bg-white/70 p-6 rounded-lg">
                      <p className="font-semibold text-blue-900 text-2xl mb-3">Meezan Bank</p>
                      <p className="text-lg text-gray-700 font-mono">Account: <span className="font-bold">00300109180495</span></p>
                      <p className="text-lg text-gray-700 font-mono">IBAN: <span className="font-bold">PK27MEZN0000300109180495</span></p>
                      <p className="text-lg font-medium text-gray-800 mt-2">Name: MUHAMMAD ALI HAIDER</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 shadow-inner relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">₨</div>
                  <h3 className="text-2xl font-semibold mb-6 text-purple-800">Mobile Payments</h3>
                  <div className="space-y-4">
                    {['JazzCash', 'EasyPaisa', 'NayaPay'].map((method) => (
                      <div key={method} className="bg-white/70 p-6 rounded-lg">
                        <p className="font-semibold text-purple-900 text-2xl mb-3">{method}</p>
                        <p className="text-lg text-gray-700 font-mono">Number: <span className="font-bold">{method === 'NayaPay' ? '03106207245' : '+923096993535'}</span></p>
                        <p className="text-lg font-medium text-gray-800">Name: Muhammad Ali Haider</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-10 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Full Name', type: 'text', key: 'name' },
                    { label: 'Institute Name', type: 'text', key: 'institute' },
                    { label: 'Email Address', type: 'email', key: 'email' },
                    { label: 'Create Password', type: 'password', key: 'password' }
                  ].map((field) => (
                    <div key={field.key} className="relative group">
                      <label className="block text-base font-medium text-gray-700 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        required
                        className="block w-full rounded-lg border-gray-200 border px-6 py-4 text-lg bg-white/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                      />
                    </div>
                  ))}
                  {/* Add Selected Package Display with Change Option */}
                  <div className="relative group col-span-2 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-xl font-semibold text-gray-700">Selected Package</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, package: '' }))}
                        className="flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        Change Package
                      </button>
                    </div>
                    <div className="block w-full rounded-xl border-2 border-blue-100 px-8 py-6 text-lg bg-gradient-to-r from-blue-50 to-purple-50 shadow-inner">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{packages[formData.package].name}</h3>
                          <p className="text-xl font-semibold text-blue-600">{packages[formData.package].price}</p>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-md">
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="relative group">
                  <label className="block text-base font-medium text-gray-700 mb-2">Payment Proof</label>
                  <div className="mt-2 flex justify-center px-8 py-8 border-3 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200 bg-white/70">
                    {filePreview ? (
                      <div className="space-y-4 text-center">
                        <img 
                          src={filePreview} 
                          alt="Payment proof" 
                          className="max-w-2xl w-full mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 cursor-zoom-in" 
                          onClick={(e) => {
                            if (e.target.classList.contains('zoomed')) {
                              e.target.classList.remove('zoomed', 'fixed', 'inset-0', 'w-auto', 'h-auto', 'max-w-none', 'max-h-screen', 'object-contain', 'z-50', 'bg-black/50');
                            } else {
                              e.target.classList.add('zoomed', 'fixed', 'inset-0', 'w-auto', 'h-auto', 'max-w-none', 'max-h-screen', 'object-contain', 'z-50', 'bg-black/50');
                            }
                          }}
                        />
                        <div className="flex items-center justify-center gap-4">
                          <p className="text-gray-600">{formData.paymentProof.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setFilePreview(null);
                              setFormData({ ...formData, paymentProof: null });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-lg text-gray-600 justify-center">
                          <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              required
                              accept="image/*,.pdf"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-2">or drag and drop</p>
                        </div>
                        <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-base text-amber-700">
                        Your package will be activated within 24 hours after payment verification.
                        You'll receive a confirmation email once activated.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg py-6 px-8 font-semibold text-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Registration
                </button>
              </form>
            </>
          )}

          {/* Keep the rest of your existing code */}
        </div>
      </motion.div>
    </div>
  );
}