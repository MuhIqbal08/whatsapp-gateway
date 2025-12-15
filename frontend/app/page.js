'use client'

import React, { useState, useEffect } from 'react';
import { MessageCircle, Zap, Shield, Code, CheckCircle, ArrowRight, Menu, X, Star, Users, Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
// import { assets } from '@/public/assets';
import Link from 'next/link';
import { assets } from '@/lib/assets';

export default function JustwaLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('send');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Kirim pesan dalam hitungan milidetik dengan infrastruktur cloud terdistribusi"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enkripsi end-to-end dengan uptime 99.9% SLA guarantee"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Developer Friendly",
      description: "RESTful API dengan dokumentasi lengkap dan SDK untuk berbagai bahasa"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Device",
      description: "Kelola multiple WhatsApp number dalam satu dashboard terpusat"
    }
  ];

  const codeExamples = {
    send: `// Send WhatsApp Message
const response = await fetch('https://api.justwa.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '628123456789',
    message: 'Hello from Justwa! 🚀'
  })
});

const data = await response.json();
console.log(data);`,
    media: `// Send Media Message
const formData = new FormData();
formData.append('to', '628123456789');
formData.append('media', fileInput.files[0]);
formData.append('caption', 'Check this out!');

const response = await fetch('https://api.justwa.com/v1/media', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});`,
    webhook: `// Handle Webhook
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'message.received') {
    console.log('New message:', data.message);
    // Process incoming message
  }
  
  res.status(200).send('OK');
});`
  };

  const stats = [
    { icon: <MessageCircle />, value: "10M+", label: "Pesan Terkirim" },
    { icon: <Users />, value: "5000+", label: "Pengguna Aktif" },
    { icon: <Clock />, value: "99.9%", label: "Uptime" },
    { icon: <TrendingUp />, value: "<100ms", label: "Avg Response" }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "99K",
      period: "/bulan",
      features: ["5,000 pesan/bulan", "1 WhatsApp number", "API Access", "Email Support", "Webhook"],
      popular: false
    },
    {
      name: "Professional",
      price: "299K",
      period: "/bulan",
      features: ["50,000 pesan/bulan", "5 WhatsApp numbers", "Priority API", "24/7 Support", "Webhook + Analytics", "Custom Integration"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited messages", "Unlimited numbers", "Dedicated Infrastructure", "99.99% SLA", "Advanced Analytics", "Personal Account Manager"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
      `}</style>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* <MessageCircle className="w-8 h-8 text-emerald-400" /> */}
              <Image src={assets.logo} alt="ChatDash Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold bg-liniear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                ChatDash
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-emerald-400 transition">Features</a>
              <a href="#docs" className="hover:text-emerald-400 transition">Docs</a>
              <a href="#pricing" className="hover:text-emerald-400 transition">Pricing</a>
              <Link href="/register" className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                Get Started
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <a href="#features" className="block py-2 hover:text-emerald-400">Features</a>
              <a href="#docs" className="block py-2 hover:text-emerald-400">Docs</a>
              <a href="#pricing" className="block py-2 hover:text-emerald-400">Pricing</a>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2 rounded-full font-semibold mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
              <Star className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Trusted by 5000+ Developers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
              WhatsApp API Gateway
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                untuk Developer Modern
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Integrasikan WhatsApp ke aplikasi Anda dalam hitungan menit. API yang powerful, dokumentasi lengkap, dan support terbaik.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-slate-600 px-8 py-4 rounded-full font-semibold text-lg hover:border-emerald-400 hover:bg-emerald-400/10 transition-all">
                View Documentation
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-all">
                <div className="flex justify-center text-emerald-400 mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Kenapa Pilih Justwa?</h2>
            <p className="text-xl text-slate-300">Fitur-fitur yang dibutuhkan developer modern</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all">
                <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple & Powerful API</h2>
            <p className="text-xl text-slate-300">Mulai kirim pesan dalam hitungan menit</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex space-x-4">
              {Object.keys(codeExamples).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm text-emerald-400">{codeExamples[activeTab]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Harga yang Transparan</h2>
            <p className="text-xl text-slate-300">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 transform scale-105 shadow-2xl'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="bg-white text-slate-900 text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-slate-300">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-semibold transition ${
                    plan.popular
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">Siap untuk Memulai?</h2>
            <p className="text-xl mb-8 opacity-90">
              Dapatkan akses API gratis dan kirim 1000 pesan pertama tanpa biaya
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105">
              Mulai Gratis Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src={assets.logo} alt="Justwa Logo" width={24} height={24} />
                <span className="text-xl font-bold">ChatDash</span>
              </div>
              <p className="text-slate-400">WhatsApp Gateway API untuk developer modern</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400">About</a></li>
                <li><a href="#" className="hover:text-emerald-400">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Justwa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}