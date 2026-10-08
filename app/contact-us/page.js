'use client';

export default function ContactUsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission goes here
    alert("Thank you for contacting us! Our team will get in touch with you shortly.");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 pt-32 pb-24 px-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] pointer-events-none opacity-60"></div>
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Information */}
          <div className="pt-8">
            <h1 className="text-4xl md:text-[2.75rem] font-bold mb-6 leading-[1.2] tracking-tight" style={{ color: '#1f6fb2' }}>
              Let’s Build Intelligent Systems for Your Business
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              Share your challenges with us. Our team will help you design, deploy, and scale AI and Agentic AI solutions that fit your enterprise goals.
            </p>
            
            <div className="space-y-6 text-lg font-medium">
              <div className="flex items-center gap-3 text-[#1f6fb2]">
                <span>(+91) 9597867340</span>
              </div>
              <div className="flex items-center gap-3 text-[#2ec4b6]">
                <span>business@pibitech.com</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white border border-blue-100 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(31,111,178,0.15)] p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">First Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter first name" 
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter last name" 
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="00000 00000" 
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Email ID *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="gmail, outlook...." 
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Industry *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Type your industry" 
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Country *</label>
                <select 
                  required
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
                >
                  <option value="" disabled selected>Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">How can we help you *</label>
                <textarea 
                  required 
                  placeholder="Description" 
                  rows="4"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]/20 focus:border-[#1f6fb2] transition-colors resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
