import React from 'react';
import { Header, Footer } from '../components/Layout.tsx';
import shipmentService from '../services/shipmentService';
import { useNavigate } from 'react-router-dom';
import { TrackingForm, TrackingResults } from '../components/Tracking.tsx';
import { ImageCarousel } from '../components/ImageCarousel.tsx';

// CountUp component for animating numbers
const CountUp: React.FC<{ target: number; suffix: string }> = ({ target, suffix }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Tracking Page
export const TrackingPage: React.FC = () => {
  const [trackingData, setTrackingData] = React.useState<any>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const trackingFromUrl = searchParams.get('tracking');

  const handleTrackingResults = (results: any) => {
    if (results.success) {
      setTrackingData(results.data);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Track Your Shipment</h1>
            <p className="text-lg text-blue-100">Real-time tracking for your international cargo</p>
          </div>
        </section>

        {/* Tracking Form Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <TrackingForm onResults={handleTrackingResults} />
          {trackingData && <TrackingResults shipment={trackingData} />}
        </section>
      </main>
      <Footer />
    </>
  );
};

// Services Page
export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeService, setActiveService] = React.useState('air');

  const services = {
    air: {
      title: 'Air Freight',
      icon: '✈️',
      description: 'Fast international delivery for urgent cargo',
      details: 'Transport of goods by aircraft for speed-critical shipments. Perfect for urgent deliveries and high-value items requiring quick transit times.',
      image: '/media/air%20freight.jpeg',
      features: [
        '24-48 hour delivery worldwide',
        'Real-time tracking',
        'Full insurance coverage',
        'Flexible package sizes',
      ],
      pricing: 'Contact for quote',
    },
    sea: {
      title: 'Sea Freight',
      icon: '🚢',
      description: 'Cost-effective bulk shipping solutions',
      details: 'Economical transportation of large volumes. Ideal for scheduled shipments where cost savings are prioritized over speed.',
      image: '/media/sea%20shippment.jpeg',
      features: [
        'Competitive bulk rates',
        '5-15 day delivery',
        'Container options available',
        'Weekly schedules',
      ],
      pricing: 'Contact for quote',
    },
    land: {
      title: 'Land Freight',
      icon: '🚚',
      description: 'Regional ground transport across Africa',
      details: 'Reliable overland transportation covering East and Central Africa. Perfect for regional deliveries with flexible scheduling.',
      image: '/media/Land%20freight.jpeg',
      features: [
        '2-7 day regional delivery',
        'Direct route optimization',
        'Door-to-door service',
        'Affordable rates',
      ],
      pricing: 'Contact for quote',
    },
    clearing: {
      title: 'Clearing & Forwarding',
      icon: '📦',
      description: 'Complete customs and logistics solutions',
      details: 'Expert handling of customs clearance and documentation. We manage all paperwork and regulatory requirements for smooth border crossings.',
      image: '/media/land%20forwarding.jpeg',
      features: [
        'Full customs clearance',
        'Documentation handling',
        'Duty calculation',
        'Fast processing',
      ],
      pricing: 'Contact for quote',
    },
  };

  const handleContactService = (serviceName: string) => {
    navigate(`/contact?service=${serviceName}`);
  };

  const currentService = services[activeService as keyof typeof services];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">Our Logistics Services</h1>
            <p className="text-lg text-blue-100 max-w-2xl">Simple, reliable, and tailored shipping solutions for your international cargo needs</p>
          </div>
        </section>

        {/* Service Navigation */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-widest">Select a Service</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(services).map(([key, service]) => (
                <button
                  key={key}
                  onClick={() => setActiveService(key)}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    activeService === key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {service.icon} {service.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Service Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <img
                src={currentService.image}
                alt={currentService.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div>
                <div className="flex items-start gap-4 mb-8">
                  <span className="text-5xl">{currentService.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold mb-2 text-blue-600">{currentService.title}</h2>
                    <p className="text-lg text-gray-600">{currentService.description}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Overview</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{currentService.details}</p>
                </div>
                <button 
                  onClick={() => handleContactService(activeService)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg"
                >
                  Get a Quote
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Key Features</h3>
                <ul className="space-y-4">
                  {currentService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-2xl text-blue-600 font-bold">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing</h3>
                <p className="text-gray-700 mb-6">{currentService.pricing}</p>
                <button 
                  onClick={() => handleContactService(activeService)}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg"
                >
                  Request Quote Today
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Service Cards Overview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">All Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`p-6 rounded-lg text-center transition duration-300 hover:shadow-lg ${
                  activeService === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                }`}
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className={`text-sm ${activeService === key ? 'text-blue-100' : 'text-gray-600'}`}>{service.description}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

// Contact Page
export const ContactPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');

  const contactOffices = [
    { city: 'Dar es Salaam, Tanzania', phone: '+255 715 961778', email: 'info@dalaliexpress.com' },
    { city: 'Kinshasa, DRC', phone: '+243 977 052 098', email: 'drc@dalaliexpress.com' },
    { city: 'Entebbe, Uganda', phone: '+256 789563653', email: 'uganda@dalaliexpress.com' },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      setSubmitMessage('Thank you! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitMessage(''), 5000);
    } catch (error) {
      setSubmitMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-lg text-blue-100">Get in touch with our team</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-8">Regional Offices</h2>
              <div className="space-y-6">
                {contactOffices.map((office, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                    <p className="font-bold text-lg text-gray-900">{office.city}</p>
                    <a 
                      href={`tel:${office.phone.replace(/\s/g, '')}`}
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                    >
                      📞 {office.phone}
                    </a>
                    <p className="text-gray-600 text-sm mt-1">{office.email}</p>
                    <a 
                      href={`https://wa.me/${office.phone.replace(/[^\d+]/g, '')}?text=Hello%20Dalali%20Express`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium text-sm mt-2 inline-block"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {submitMessage && (
                <div className={`p-4 rounded-lg ${submitMessage.includes('Thank') ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'}`}>
                  {submitMessage}
                </div>
              )}
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Your Name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                required
              />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Your Email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                required
              />
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Your Message" 
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                required
              ></textarea>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

// Home Page
export const HomePage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [trackingResult, setTrackingResult] = React.useState<any>(null);
  const [trackingError, setTrackingError] = React.useState('');
  const [isLoadingTracking, setIsLoadingTracking] = React.useState(false);
  const [serviceType, setServiceType] = React.useState<'air' | 'ocean' | null>(null);
  const navigate = useNavigate();

  // Contact information
  const contactInfo = [
    { city: 'Dar es Salaam, Tanzania', phone: '+255 715 961778' },
    { city: 'Kinshasa, DRC', phone: '+243 977 052 098' },
    { city: 'Entebbe, Uganda', phone: '+256 789563653' },
  ];

  // Handle tracking search
  const handleTrackingSearch = async () => {
    if (!trackingNumber.trim()) {
      setTrackingError('Please enter a tracking number');
      return;
    }
    
    setIsLoadingTracking(true);
    setTrackingError('');
    setTrackingResult(null);
    
    try {
      const response = await shipmentService.trackShipment(trackingNumber);
      if (response.success) {
        setTrackingResult(response.data);
        setTrackingError('');
      } else {
        setTrackingError('Shipment not found');
      }
    } catch (error: any) {
      setTrackingError(error.response?.data?.message || 'Failed to fetch tracking information');
    } finally {
      setIsLoadingTracking(false);
    }
  };

  // Handle call button
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  // Handle WhatsApp button
  const handleWhatsApp = (phone: string) => {
    const message = encodeURIComponent('Hello! I need information about shipping with Dalali Express.');
    const phoneNumber = phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Handle quote request
  const handleRequestQuote = () => {
    navigate('/contact');
  };

  // Handle get quote button in CTA
  const handleGetQuote = () => {
    navigate('/contact');
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Video Strip */}
        <section className="w-full h-48 sm:h-56 bg-gray-200 relative overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/media/Dalali%20Express.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-sm font-bold">🚚 Dalali Express - Africa's Premier Logistics</p>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-4 bg-cover bg-center relative" style={{
          backgroundImage: 'url(/media/Home%20hero.png)',
        }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              Reliable Cargo & Logistics Services
            </h1>
            <p className="text-lg text-gray-100 mb-8">Fast Delivery | Low Cost | High Reliability</p>

            {/* Service Type Selector */}
            <div className="flex justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/services')}
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
              >
                ✈️ Air
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
              >
                🌊 Ocean
              </button>
            </div>

            {/* Tracking Section */}
            <div className="max-w-2xl mx-auto mb-8">
              <label className="block text-lg font-bold text-gray-800 mb-4">Enter Tracking Number</label>
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., DLX-2024-001234"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <button 
                  onClick={handleTrackingSearch}
                  disabled={isLoadingTracking}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                >
                  {isLoadingTracking ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>

              {trackingError && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p className="font-semibold">{trackingError}</p>
                </div>
              )}

              {trackingResult && (
                <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                  <p className="font-semibold mb-2">Shipment Found</p>
                  <p><strong>Tracking:</strong> {trackingResult.tracking_number}</p>
                  <p><strong>From:</strong> {trackingResult.sender_name}</p>
                  <p><strong>To:</strong> {trackingResult.receiver_name}</p>
                  <p><strong>Status:</strong> <span className="bg-green-500 text-white px-3 py-1 rounded">{trackingResult.current_status}</span></p>
                  <p><strong>Destination:</strong> {trackingResult.destination}</p>
                  <button 
                    onClick={() => navigate(`/track?tracking=${trackingNumber}`)}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                  >
                    View Full Details
                  </button>
                </div>
              )}

              <div className="text-gray-600 mb-6 font-medium">OR</div>

              <button 
                onClick={handleRequestQuote}
                className="px-8 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition"
              >
                Request Quote
              </button>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-blue-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">✔ Safe | ✔ Fast | ✔ Professional Logistics</p>
          </div>
        </section>

        {/* Core Services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                <img
                  src="/media/air%20freight.jpeg"
                  alt="Air Freight"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Air Freight</h3>
                  <p className="text-gray-600">Fast delivery worldwide</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                <img
                  src="/media/sea%20shippment.jpeg"
                  alt="Sea Freight"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sea Freight</h3>
                  <p className="text-gray-600">Bulk shipping solutions</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                <img
                  src="/media/Land%20freight.jpeg"
                  alt="Land Freight"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Land Freight</h3>
                  <p className="text-gray-600">Ground transport across Africa</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                <img
                  src="/media/land%20forwarding.jpeg"
                  alt="Clearing & Forwarding"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Clearing & Forwarding</h3>
                  <p className="text-gray-600">Customs handling</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => navigate('/services')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
              >
                View Services
              </button>
            </div>
          </div>
        </section>

        {/* Key Metrics Section */}
        <section className="bg-cover bg-center relative py-6" style={{
          backgroundImage: 'url(/media/Company%20image.png)',
        }}>
          <div className="absolute inset-0 bg-black/80"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)',
              }}>
                Why Businesses Trust Dalali Express
              </h2>
              <p className="text-lg text-yellow-300 max-w-2xl mx-auto font-semibold" style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}>
                Reliable logistics solutions backed by performance and experience
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { number: '15', label: 'Years', suffix: '+' },
                { number: '45', label: 'Countries', suffix: '+' },
                { number: '50K', label: 'Shipments', suffix: '+' },
                { number: '98', label: 'Satisfaction', suffix: '%' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="text-5xl sm:text-6xl font-bold text-blue-400 mb-2" style={{
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(96, 165, 250, 0.5)',
                  }}>
                    {stat.number}<span className="text-3xl">{stat.suffix}</span>
                  </div>
                  <p className="text-white font-bold" style={{
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                  }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Core Advantages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: '🚀', title: 'Fast Delivery', desc: '24–48 hour delivery across major routes' },
                { icon: '💰', title: 'Competitive Rates', desc: 'Transparent pricing with no hidden charges' },
                { icon: '🔒', title: 'Fully Insured Cargo', desc: 'Your shipments are protected at every stage' },
                { icon: '🌍', title: 'Wide Coverage', desc: 'Operations across East & Central Africa' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-blue-600/30 backdrop-blur-lg rounded-lg p-6 border-2 border-blue-400/60 hover:border-blue-300 transition duration-300 transform hover:scale-105"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${400 + idx * 100}ms forwards`,
                    opacity: 0,
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
                  }}>{item.title}</h3>
                  <p className="text-blue-100 text-sm font-medium" style={{
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
                  }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <style>{`
              @keyframes slideInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Simple steps to ship your cargo with us</p>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-300 mx-auto mt-4 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: '📦', step: '1. Drop Cargo', desc: 'Bring your items to us', delay: '0' },
                { icon: '🚚', step: '2. We Ship', desc: 'We handle everything', delay: '100' },
                { icon: '📍', step: '3. Track', desc: 'Monitor your shipment', delay: '200' },
                { icon: '✅', step: '4. Deliver', desc: 'Safe delivery guaranteed', delay: '300' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${item.delay}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <style>{`
                    @keyframes slideInUp {
                      from {
                        opacity: 0;
                        transform: translateY(30px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>

                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-400/10 border border-blue-400/30 rounded-xl p-8 h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-blue-400/60 group">
                    {/* 3D effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

                    {/* Step number badge */}
                    <div className="absolute -top-5 -right-5 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition duration-300">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition duration-500">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition duration-300">
                        {item.step}
                      </h3>
                      <p className="text-gray-300 group-hover:text-gray-100 transition duration-300">
                        {item.desc}
                      </p>
                    </div>

                    {/* Connector line (hidden on mobile) */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent group-hover:from-blue-300 transition duration-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* CTA Section Outside Main */}
      <section className="relative py-6 overflow-hidden w-full m-0 p-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 animate-fadeIn">Ready to Ship with Confidence?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of businesses trusting Dalali Express for their logistics needs. Fast, reliable, and affordable shipping across Africa.</p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button 
              onClick={() => handleCall(contactInfo[0].phone)}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">📞</span> Call Now
            </button>
            <button 
              onClick={() => handleWhatsApp(contactInfo[0].phone)}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">💬</span> WhatsApp
            </button>
            <button 
              onClick={handleGetQuote}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">📋</span> Get Quote
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transform hover:scale-105 transition duration-300">
              <div className="text-4xl mb-3">✔</div>
              <h3 className="text-white font-bold mb-2">Strong Network</h3>
              <p className="text-blue-100 text-sm">15+ branches across Africa</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transform hover:scale-105 transition duration-300">
              <div className="text-4xl mb-3">✔</div>
              <h3 className="text-white font-bold mb-2">Experienced Team</h3>
              <p className="text-blue-100 text-sm">600+ dedicated professionals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transform hover:scale-105 transition duration-300">
              <div className="text-4xl mb-3">✔</div>
              <h3 className="text-white font-bold mb-2">Reliable Delivery</h3>
              <p className="text-blue-100 text-sm">99% on-time delivery rate</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
