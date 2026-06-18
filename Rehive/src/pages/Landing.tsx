import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Recycle, Gift, Wrench, Lightbulb, Leaf, Users, Package, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const stats = [
  { label: 'Waste Prevented', value: 12500, suffix: ' kg', icon: Leaf, color: 'emerald' },
  { label: 'CO2 Saved', value: 8500, suffix: ' kg', icon: Cloud, color: 'mint' },
  { label: 'Items Shared', value: 3200, suffix: '', icon: Package, color: 'amber' },
  { label: 'Donations', value: 1850, suffix: '', icon: Gift, color: 'ruby' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-700/80" />

        <motion.div style={{ opacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6">
              <Recycle className="w-4 h-4 text-emerald-300" />
              <span className="text-sm text-white/90">Circular Economy Platform</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-300 via-mint-300 to-white bg-clip-text text-transparent">
                ReHive
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 font-light mb-2 font-display">
              Har Cheez Ko Ek Aur Mauka
            </p>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Give everything a second chance. Rent, donate, repair, or upcycle your way to a sustainable future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary text-lg px-8 py-4"
              >
                Login
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/60 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">How ReHive Works</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Divert your unused items from waste streams through four sustainable pathways
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Recycle,
                title: 'Rent',
                description: 'Monetize idle assets by renting them to nearby users. Earn passive income while preventing waste.',
                color: 'emerald',
              },
              {
                icon: Gift,
                title: 'Donate',
                description: 'Give items a second life by donating to verified NGOs. Track your community impact real-time.',
                color: 'amber',
              },
              {
                icon: Wrench,
                title: 'Repair',
                description: 'Find local repair shops and extend item lifespan. Use coins for exclusive discounts.',
                color: 'blue',
              },
              {
                icon: Lightbulb,
                title: 'Reuse',
                description: 'Transform items with DIY upcycling guides. Creative ideas for every skill level.',
                color: 'teal',
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 card-hover"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  card.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  card.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                  card.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-teal-100 text-teal-600'
                }`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Our Environmental Impact</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Real-time community metrics tracking our collective sustainability achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stat-card text-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  stat.color === 'mint' ? 'bg-teal-100 text-teal-600' :
                  stat.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                  'bg-rose-100 text-rose-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-16 h-16 text-emerald-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Join the Circular Revolution
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Every item you share, repair, or upcycle creates ripples of positive change. Start your journey today and earn rewards for sustainable choices.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all inline-flex items-center gap-2"
            >
              Start Making Impact
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-display font-bold text-white">ReHive</div>
            <div className="text-sm">Har Cheez Ko Ek Aur Mauka</div>
            <div className="text-sm">2024 ReHive. Built with sustainability in mind.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
