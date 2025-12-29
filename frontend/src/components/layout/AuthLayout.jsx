import { Outlet, Link } from 'react-router-dom';
import { Boxes, Rocket, Shield, MousePointer2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const AuthLayout = () => {
    // Rotating text animation
    const rotatingTexts = ['dakikalar içinde', 'sürükle-bırak ile', 'tek tıkla', 'kolay ve hızlı'];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
                setIsAnimating(false);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        { icon: MousePointer2, text: 'Sürükle & Bırak', color: 'from-cyan-400 to-blue-500' },
        { icon: Rocket, text: 'Hızlı Yayınla', color: 'from-orange-400 to-pink-500' },
        { icon: Shield, text: 'Güvenli Altyapı', color: 'from-green-400 to-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-dark-900 flex">
            {/* Left Side - Branding with Animations */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-between">
                {/* Multi-layer Animated Background */}
                <div className="absolute inset-0 auth-gradient-bg" />
                <div className="absolute inset-0 auth-mesh-overlay" />

                {/* Visible Background Animations - positioned at edges only */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large orbiting ring at bottom-right corner */}
                    <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] border border-white/10 rounded-full animate-spin-slow" />
                    <div className="absolute -bottom-20 -right-20 w-[280px] h-[280px] border border-dashed border-white/5 rounded-full animate-spin-reverse" />

                    {/* Geometric shapes at corners only */}
                    <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/20 rounded-xl animate-geo-rotate" />
                    <div className="absolute top-20 right-20 w-8 h-8 border border-cyan-400/30 rotate-45" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-white/15 rotate-45 animate-geo-float" />

                    {/* Glowing dots at edges */}
                    <div className="absolute top-1/4 right-8 w-3 h-3 bg-cyan-400/60 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 left-8 w-4 h-4 bg-purple-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-3/4 right-12 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

                    {/* Animated gradient blobs - very blurred in background */}
                    <div className="absolute -top-40 -right-40 w-[450px] h-[450px] bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-[80px] animate-blob" />
                    <div className="absolute -bottom-48 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 rounded-full blur-[80px] animate-blob-delayed" />
                    <div className="absolute top-1/2 -right-32 w-[300px] h-[300px] bg-gradient-to-l from-indigo-500/15 to-purple-500/10 rounded-full blur-[60px] animate-blob-slow" />

                    {/* Vertical neon lines at edges */}
                    <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-purple-500/50 to-transparent" />
                    <div className="absolute bottom-0 left-1/4 w-px h-32 bg-gradient-to-t from-cyan-500/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-6 auth-logo-glow">
                            <Boxes className="w-8 h-8 text-white animate-sparkle" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white transition-all duration-300 group-hover:tracking-wide">WebBuilder Plus</span>
                            <span className="text-xs text-white/50 tracking-widest uppercase">Premium Web Builder</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-lg relative z-10 space-y-8">
                    {/* Main Heading with Rotating Text */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h1 className="text-5xl font-bold text-white mb-2 leading-tight">
                            Hayalindeki web sitesini
                        </h1>
                        <h2 className="text-4xl font-bold">
                            <span className={`inline-block auth-rotating-text ${isAnimating ? 'auth-text-exit' : 'auth-text-enter'}`}>
                                {rotatingTexts[currentTextIndex]}
                            </span>
                            <span className="text-white"> oluştur.</span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <p className="text-lg text-white/60 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s' }}>
                        Türkiye'nin en gelişmiş web site oluşturucusu ile
                        <span className="text-white font-medium"> kodlama bilmeden</span> profesyonel siteler tasarlayın.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="auth-feature-card group"
                                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                    <feature.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm text-white/80 font-medium">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between animate-fade-in" style={{ animationDelay: '1.2s' }}>
                    <div className="text-sm text-white/40">
                        Designed & Developed by Kutay & Mustafa
                    </div>
                    <Link to="/terms" className="text-white/40 hover:text-white/70 transition-colors text-sm">
                        Gizlilik ve Şartlar
                    </Link>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Boxes className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">WebBuilder Plus</span>
                        </Link>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
