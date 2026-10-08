'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Heart, Leaf, BookOpen, Globe, 
  Accessibility, Building2, Briefcase, TriangleAlert 
} from 'lucide-react';

const sections = [
  {
    id: 'health',
    title: 'AI for Health',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-[#4db8db] to-[#3ca3c5]',
    items: [
      'Preventive health screening',
      'Health-worker copilots',
      'Multilingual health assistants',
      'Patient document intelligence',
      'Public-health intelligence',
      'Elderly care assistants'
    ]
  },
  {
    id: 'agriculture',
    title: 'AI for Agriculture',
    icon: <Leaf className="w-8 h-8" />,
    color: 'from-[#006cb5] to-[#005a96]',
    items: [
      'Crop and pest detection',
      'Soil and irrigation intelligence',
      'Crop-yield prediction',
      'Farmer voice assistants',
      'Livestock monitoring',
      'Food quality and post-harvest intelligence'
    ]
  },
  {
    id: 'learning',
    title: 'AI for Learning',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-[#26c6da] to-[#1fb3c6]',
    items: [
      'AI tutors',
      'Teacher copilots',
      'Personalized learning',
      'Learning-gap detection',
      'Local-language education',
      'Skill and vocational assessment'
    ]
  },
  {
    id: 'climate',
    title: 'AI for Climate & Nature',
    icon: <Globe className="w-8 h-8" />,
    color: 'from-[#6366f1] to-[#4f46e5]',
    items: [
      'Flood and heat alerts',
      'Air and water monitoring',
      'Drought intelligence',
      'Forest and wildfire detection',
      'Waste management intelligence',
      'Biodiversity monitoring'
    ]
  },
  {
    id: 'accessibility',
    title: 'AI for Accessibility',
    icon: <Accessibility className="w-8 h-8" />,
    color: 'from-[#6366f1] to-[#4f46e5]',
    items: [
      'Regional-language AI',
      'Speech and voice assistants',
      'Assistive vision',
      'Sign-language technologies',
      'Accessible document intelligence',
      'Assistive navigation'
    ]
  },
  {
    id: 'communities',
    title: 'AI for Communities',
    icon: <Building2 className="w-8 h-8" />,
    color: 'from-[#26c6da] to-[#1fb3c6]',
    items: [
      'Citizen assistants',
      'Government-service navigation',
      'Scheme and benefit discovery',
      'Form and document assistance',
      'Community information systems',
      'Grievance intelligence'
    ]
  },
  {
    id: 'livelihoods',
    title: 'AI for Livelihoods',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'from-[#006cb5] to-[#005a96]',
    items: [
      'Career and job assistants',
      'Skill-gap intelligence',
      'Small-business copilots',
      'Entrepreneur assistants',
      'MSME intelligence',
      'Local-market intelligence'
    ]
  },
  {
    id: 'humanitarian',
    title: 'AI for Humanitarian Response',
    icon: <TriangleAlert className="w-8 h-8" />,
    color: 'from-[#4db8db] to-[#3ca3c5]',
    items: [
      'Early-warning systems',
      'Emergency assistants',
      'Disaster damage assessment',
      'Crisis communication',
      'Relief coordination',
      'Satellite and drone intelligence'
    ]
  }
];

export default function ProblemsPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header */}
      <div className="pt-40 pb-20 px-4 text-center relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            Problems We Can <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4db8db, #2ec4b6)' }}>Solve</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Explore the vast landscape of challenges where AI can make a real, meaningful difference.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-32">
        {sections.map((section, idx) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-12 items-start"
            >
              {/* Category Header */}
              <div className="md:w-1/3 sticky top-32">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {section.icon}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{section.title}</h2>
                <div className="w-12 h-1.5 bg-[#2ec4b6] rounded-full"></div>
              </div>

              {/* Items Grid */}
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {section.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#2ec4b6]/30 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[#2ec4b6] group-hover:scale-150 transition-transform"></div>
                      <h3 className="font-bold text-lg text-slate-700 group-hover:text-slate-900">{item}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        ))}
      </div>

    </main>
  );
}
