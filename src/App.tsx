/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Star,
  ShieldCheck,
  Hammer,
  CloudLightning,
  Droplets,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Award,
  Users,
  Calendar,
  MapPin,
  Send,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Mountain,
} from 'lucide-react';

// --- Live Toronto Weather Widget ---

interface WeatherData {
  temperature: number;
  weathercode: number;
}

const getWeatherContext = (code: number) => {
  if (code === 0)
    return {
      Icon: Sun,
      label: 'Clear Skies',
      tip: 'Great weather to get ahead of repairs. Most roof problems are invisible until it rains—book your free inspection while conditions are ideal.',
      urgent: false,
    };
  if (code <= 3)
    return {
      Icon: Cloud,
      label: 'Partly Cloudy',
      tip: "Don't wait for the rain to find out if your roof is ready. Book a free assessment today.",
      urgent: false,
    };
  if (code <= 48)
    return {
      Icon: Cloud,
      label: 'Foggy / Overcast',
      tip: 'Persistent moisture can hide early-stage damage. A free inspection takes less than an hour.',
      urgent: false,
    };
  if (code <= 55)
    return {
      Icon: CloudRain,
      label: 'Drizzle',
      tip: "Even light drizzle can reveal weak spots. If you've noticed any water stains inside, call us today.",
      urgent: true,
    };
  if (code <= 67)
    return {
      Icon: CloudRain,
      label: 'Rainy',
      tip: 'Rain in Toronto right now — a leak left unattended can cause thousands in interior damage. Call us.',
      urgent: true,
    };
  if (code <= 77)
    return {
      Icon: CloudSnow,
      label: 'Snow / Ice',
      tip: 'Ice dams and snow load are the #1 cause of winter roof failure in Toronto. Get ahead of it.',
      urgent: true,
    };
  if (code <= 82)
    return {
      Icon: CloudRain,
      label: 'Heavy Showers',
      tip: 'Heavy rain can expose hidden weak points fast. Book a same-day emergency assessment.',
      urgent: true,
    };
  return {
    Icon: Zap,
    label: 'Thunderstorm',
    tip: 'Storm in the GTA — hail damage can be invisible to the eye. Get a free post-storm assessment.',
    urgent: true,
  };
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=43.6532&longitude=-79.3832&current=temperature_2m,weathercode&temperature_unit=celsius'
    )
      .then((res) => res.json())
      .then((data) =>
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weathercode: data.current.weathercode,
        })
      )
      .catch(() => setWeather(null));
  }, []);

  if (!weather) return null;

  const ctx = getWeatherContext(weather.weathercode);
  const { Icon } = ctx;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={`mt-8 p-5 rounded-2xl border max-w-xl ${
        ctx.urgent ? 'bg-gold/15 border-gold/40' : 'bg-white/10 border-white/20'
      } backdrop-blur-sm`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            ctx.urgent ? 'bg-gold/30' : 'bg-white/10'
          }`}
        >
          <Icon size={22} className={ctx.urgent ? 'text-gold' : 'text-white/80'} aria-hidden="true" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Toronto Right Now
            </span>
            <span className="text-white font-bold text-sm">
              {weather.temperature}°C · {ctx.label}
            </span>
          </div>
          <p className="text-white/75 text-sm leading-relaxed">{ctx.tip}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Navbar ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-charcoal/95 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-6'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-gold focus:text-charcoal focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Mountain icon logo — distinct from Veltrix ShieldCheck */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
            <Mountain className="text-charcoal" size={22} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">EVEREST ROOFING</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Services', 'Process', 'Reviews', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-white/80 hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              {item}
            </a>
          ))}
          <a
            href="tel:4164252092"
            className="flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gold/80 hover:shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="Call Everest Roofing at (416) 425-2092"
          >
            <Phone size={16} aria-hidden="true" />
            (416) 425-2092
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-charcoal border-t border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {['Services', 'Process', 'Reviews', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-white hover:text-gold transition-colors duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a
              href="tel:4164252092"
              className="flex items-center justify-center gap-2 bg-gold text-charcoal py-4 rounded-xl font-bold hover:bg-gold/80 transition-colors duration-200 cursor-pointer"
              aria-label="Call Everest Roofing"
            >
              <Phone size={20} aria-hidden="true" />
              (416) 425-2092
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero ---

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1635424710928-0544e8512eae?q=80&w=2071&auto=format&fit=crop"
          alt="Professional roofer on a shingled roof during an East York inspection"
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={13} className="fill-gold text-gold" aria-hidden="true" />
              ))}
              <span className="text-white/80 text-xs font-bold ml-1">4.8 on Google</span>
            </div>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
              Licensed & Insured
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
              East York Based
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-4">
            Built to <br />
            <span className="italic text-gold">Reach the Top.</span> <br />
            Every Time.
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-3 max-w-lg leading-relaxed">
            Everest Roofing delivers premium craftsmanship across Toronto and the GTA—backed by our
            workmanship guarantee on every job.
          </p>

          <p className="text-sm text-white/40 mb-8 font-medium tracking-wide">
            No commission salespeople. No pressure. Just an honest assessment and a fair written quote.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#estimate"
              className="bg-gold text-charcoal px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(231,76,60,0.35)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Get Your Free Inspection
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </a>
            <a
              href="tel:4164252092"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              aria-label="Call (416) 425-2092"
            >
              <Phone size={20} aria-hidden="true" />
              Call Now
            </a>
          </div>

          <WeatherWidget />
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="absolute bottom-12 left-0 right-0 z-10 hidden lg:block">
        <div className="max-w-7xl mx-auto px-12 flex items-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          {[
            { icon: Award, label: 'CertainTeed Certified' },
            { icon: ShieldCheck, label: 'Licensed & Insured' },
            { icon: Users, label: 'BBB Accredited' },
            { icon: Star, label: 'HomeStars Verified' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase"
            >
              <Icon size={20} className="text-gold" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Services ---

const Services = () => {
  const services = [
    {
      title: 'Roof Replacement',
      desc: 'Full tear-off and installation with premium shingles from CertainTeed, IKO, and Owens Corning. Most jobs completed in a single day with full site cleanup.',
      icon: <Hammer className="text-gold" size={32} />,
    },
    {
      title: 'Roof Repairs',
      desc: 'Fixing leaks, missing shingles, and structural damage before a small problem becomes a costly disaster. Transparent pricing, no upsells.',
      icon: <CheckCircle2 className="text-gold" size={32} />,
    },
    {
      title: '24/7 Emergency Service',
      desc: 'Fast-response tarping, storm damage assessment, and emergency repairs. We show up when it matters most—day or night.',
      icon: <CloudLightning className="text-gold" size={32} />,
    },
    {
      title: 'Gutters & Eavestroughs',
      desc: 'Seamless eavestrough installation and siding to protect your entire exterior through Toronto winters and spring thaws.',
      icon: <Droplets className="text-gold" size={32} />,
    },
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">
              Our Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
              Comprehensive Roofing <br />& Exterior Solutions
            </h2>
          </div>
          <p className="text-charcoal/60 max-w-sm text-lg">
            Transparent pricing and expert craftsmanship for every project. No commission salespeople—ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl border border-charcoal/5 bg-stone-50 hover:bg-white hover:shadow-2xl transition-all duration-200 cursor-pointer"
            >
              <div className="mb-6" aria-hidden="true">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-3">{s.title}</h3>
              <p className="text-charcoal/60 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Process ---

const Process = () => {
  const steps = [
    {
      title: 'Free Inspection',
      desc: 'We do a thorough assessment of your roof, attic, drainage, and ventilation system—not just a surface check. Written findings, no obligation.',
      icon: '01',
    },
    {
      title: 'Honest Written Quote',
      desc: 'You get a transparent, line-itemed proposal with material options and financing plans. No vague estimates, no surprise charges.',
      icon: '02',
    },
    {
      title: 'Expert Install',
      desc: 'Most Toronto roofs completed in one day. Full site cleanup and a final walkthrough before we leave your property.',
      icon: '03',
    },
  ];

  return (
    <section id="process" className="section-padding bg-charcoal text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 skew-x-12 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight">The Everest Standard</h2>
          <p className="text-white/40 mt-4 text-lg max-w-xl mx-auto">
            No pushy salespeople. Just experienced tradespeople who treat your home like their own.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="text-8xl font-serif text-white/5 absolute -top-12 -left-4 group-hover:text-gold/10 transition-colors duration-500">
                {step.icon}
              </div>
              <div className="relative pt-12">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-4">
                  <span className="w-8 h-px bg-gold"></span>
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-lg">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <Calendar className="text-gold" size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold">Ready to start?</h4>
              <p className="text-white/50">Mon–Sat 8am–6pm · Emergency line 24/7</p>
            </div>
          </div>
          <a
            href="#estimate"
            className="bg-gold text-charcoal px-10 py-4 rounded-full font-bold text-lg hover:bg-gold/80 hover:shadow-lg transition-all duration-200 cursor-pointer inline-block text-center"
          >
            Book My Free Inspection
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Inline Estimate Form ---

const EstimateForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    address: '',
    timeline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const serviceOptions = [
    'Roof Replacement',
    'Roof Repair',
    'Emergency Service',
    'Gutters & Eavestroughs',
    'Storm Damage Assessment',
    'Other',
  ];

  const timelineOptions = [
    'ASAP / Emergency',
    'Within 1 week',
    'Within 1 month',
    'Just exploring options',
  ];

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-charcoal/10 bg-stone-50 text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm transition-shadow';

  return (
    <section id="contact" className="section-padding bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">
              Free, No-Obligation Quote
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Get Your Free <br />
              Roof Assessment
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              No commission salespeople will call you. Just an experienced Everest assessor who'll give
              you an honest, written quote—at absolutely no charge.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                'Written, itemized quote delivered within 24 hours',
                'No pressure and no follow-up calls if you pass',
                'We work directly with your insurer on storm claims',
                'Financing available — pay as low as $75/month',
                'Same-day emergency response available',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80">
                  <CheckCircle2
                    size={18}
                    className="text-gold mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gold flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Prefer to call?</p>
                  <a
                    href="tel:4164252092"
                    className="text-white font-bold text-xl hover:text-gold transition-colors"
                  >
                    (416) 425-2092
                  </a>
                </div>
              </div>
              <p className="text-white/30 text-sm mt-3 pl-8">
                Mon–Sat 8am–6pm · Emergency line available 24/7
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-3">Request Received!</h3>
                <p className="text-charcoal/60 mb-6 leading-relaxed">
                  An Everest team member will reach out within a few hours to confirm your free
                  inspection time.
                </p>
                <p className="text-sm text-charcoal/40">
                  Need us sooner?{' '}
                  <a
                    href="tel:4164252092"
                    className="font-bold text-charcoal hover:text-gold transition-colors"
                  >
                    Call (416) 425-2092
                  </a>
                </p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-charcoal mb-6">Request Your Free Estimate</h3>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="est-name"
                        className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="est-name"
                        required
                        type="text"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="est-phone"
                        className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block mb-1.5"
                      >
                        Phone *
                      </label>
                      <input
                        id="est-phone"
                        required
                        type="tel"
                        placeholder="(416) 555-0100"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="est-email"
                      className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="est-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="est-service"
                      className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block mb-1.5"
                    >
                      Service Needed *
                    </label>
                    <select
                      id="est-service"
                      required
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select a service...</option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="est-address"
                      className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block mb-1.5"
                    >
                      Property Address
                    </label>
                    <input
                      id="est-address"
                      type="text"
                      placeholder="123 Main St, East York, ON"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="est-timeline"
                      className="text-xs font-bold text-charcoal/50 uppercase tracking-widest block mb-1.5"
                    >
                      When Do You Need This?
                    </label>
                    <select
                      id="est-timeline"
                      value={form.timeline}
                      onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select timeline...</option>
                      {timelineOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold text-charcoal py-4 rounded-xl font-bold text-lg hover:bg-gold/80 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={18} aria-hidden="true" />
                    Send My Free Request
                  </button>
                  <p className="text-xs text-charcoal/35 text-center">
                    No spam. We'll reach out once to confirm your appointment.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Testimonials ---
// ⚠️ DUMMY DATA: Both reviews are placeholder. Replace with real Everest customer reviews.

const Testimonials = () => {
  const reviews = [
    {
      name: 'David K.',
      role: 'Homeowner in Leaside',
      text: "Everest gave me a written quote within hours—no pressure at all. Their crew showed up on time, completed the full replacement in one day, and left my yard spotless. Exceptional from start to finish.",
      img: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1984&auto=format&fit=crop',
    },
    {
      name: 'Maria T.',
      role: 'Homeowner in East York',
      text: "Had a leak the night before a big storm. Everest sent someone out first thing in the morning, had it tarped and assessed within the hour. They handled my insurance claim completely—I didn't have to do a thing.",
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  return (
    <section id="reviews" className="section-padding bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">
            What Toronto Homeowners Say
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
            Trusted by Your Neighbours
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} className="fill-gold text-gold" aria-hidden="true" />
            ))}
            <span className="ml-2 font-bold text-charcoal" aria-label="Rated 4.8 out of 5 on Google">
              4.8 on Google
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col lg:flex-row"
            >
              <div className="lg:w-1/2 h-64 lg:h-auto">
                <img
                  src={r.img}
                  alt={`Completed roofing project for ${r.name}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-charcoal/70 italic mb-8 text-lg leading-relaxed">"{r.text}"</p>
                <div>
                  <h4 className="font-bold text-charcoal">{r.name}</h4>
                  <p className="text-sm text-charcoal/40 uppercase tracking-widest">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Storm Damage Section ---

const StormDamage = () => (
  <section className="section-padding bg-stone-100">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
      <div className="lg:w-1/2">
        <div className="relative">
          <img
            src="/storm-damage.png"
            alt="Storm damage on a residential roof with missing shingles"
            className="rounded-[3rem] shadow-2xl"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute -bottom-8 -right-8 bg-gold p-8 rounded-3xl shadow-xl hidden md:block">
            <CloudLightning size={48} className="text-charcoal mb-4" aria-hidden="true" />
            <p className="text-charcoal font-bold text-xl">
              Storm Damage?
              <br />
              We Can Help.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2">
        <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">
          Insurance Claims
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 leading-tight">
          Your Guide Through <br />
          Storm Restoration
        </h2>
        <p className="text-charcoal/60 text-lg mb-8 leading-relaxed">
          Filing an insurance claim in Ontario can be overwhelming. Our specialists act as your
          advocate—meeting directly with adjusters and ensuring every bit of damage is documented
          and covered.
        </p>
        <ul className="space-y-4 mb-10">
          {[
            'Free damage assessment and documentation',
            'Direct billing to your insurance company',
            'Assistance with claim paperwork',
            'Emergency tarping and same-day mitigation',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-charcoal font-medium">
              <CheckCircle2 size={20} className="text-gold flex-shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <a
          href="#estimate"
          className="flex items-center gap-2 text-charcoal font-bold text-lg group cursor-pointer hover:text-gold transition-colors duration-200"
        >
          Start a storm damage claim
          <ArrowRight
            size={20}
            className="group-hover:translate-x-2 transition-transform"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </section>
);

// --- Service Areas ---
// ⚠️ DUMMY DATA: Neighbourhood list is assumed based on East York address. Confirm with client.

const ServiceAreas = () => {
  const areas = [
    'East York',
    'Leaside',
    'Thorncliffe Park',
    'Flemingdon Park',
    'Pape Village',
    'Danforth',
    'Greektown',
    'North York',
    'Scarborough',
    'Don Mills',
    'Riverdale',
    'Cabbagetown',
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-gold font-bold tracking-widest uppercase text-sm mb-4 block">
          Where We Work
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
          Proudly Serving East York & the GTA
        </h2>
        <p className="text-charcoal/50 mb-12 max-w-xl mx-auto">
          Based on Millwood Rd in East York, we serve homeowners across Toronto and the Greater
          Toronto Area.
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {areas.map((area) => (
            <div
              key={area}
              className="px-6 py-3 rounded-full border border-charcoal/10 text-charcoal/60 font-medium hover:border-gold hover:text-gold transition-colors duration-200 cursor-default"
            >
              {area}
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-center gap-2 text-charcoal/40 text-sm">
          <MapPin size={16} className="text-gold" aria-hidden="true" />
          <span>895 Millwood Rd, East York, ON M4G 1X2</span>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <Mountain className="text-charcoal" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tighter">EVEREST ROOFING</span>
          </div>
          <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
            Serving East York and the GTA with integrity and craftsmanship. No commission sales, no
            pressure—just honest roofing done right.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-200 cursor-pointer"
              aria-label="Follow Everest Roofing on social media"
            >
              <Users size={18} aria-hidden="true" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-200 cursor-pointer"
              aria-label="Read our Google reviews"
            >
              <Star size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gold uppercase tracking-widest text-sm">Services</h4>
          <ul className="space-y-4 text-white/60">
            {[
              'Roof Replacement',
              'Roof Repairs',
              'Storm Restoration',
              'Gutters & Eavestroughs',
              '24/7 Emergency Service',
            ].map((s) => (
              <li key={s}>
                <a
                  href="#services"
                  className="hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="contact-info">
          <h4 className="font-bold mb-6 text-gold uppercase tracking-widest text-sm">Contact</h4>
          <ul className="space-y-4 text-white/60">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold flex-shrink-0" aria-hidden="true" />
              <a href="tel:4164252092" className="hover:text-white transition-colors">
                (416) 425-2092
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
              <address className="not-italic">
                895 Millwood Rd
                <br />
                East York, ON M4G 1X2
              </address>
            </li>
            <li className="mt-2">
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                Mon–Sat 8am–6pm
              </span>
            </li>
            <li>
              <span className="text-xs font-bold text-gold/60 uppercase tracking-widest">
                Emergency: 24/7
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-sm">
        <p>© 2026 Everest Roofing & Construction Co. Ltd. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-gold selection:text-charcoal">
      <Navbar />

      <main id="main-content">
        <Hero />

        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden">
          <a
            href="tel:4164252092"
            className="flex items-center justify-center gap-3 bg-gold text-charcoal py-4 rounded-2xl font-bold shadow-2xl active:scale-95 transition-transform cursor-pointer"
            aria-label="Call Everest Roofing for a free inspection"
          >
            <Phone size={20} aria-hidden="true" />
            Get Free Inspection — Call Now
          </a>
        </div>

        <Services />
        <StormDamage />
        <Process />
        <EstimateForm />
        <ServiceAreas />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
