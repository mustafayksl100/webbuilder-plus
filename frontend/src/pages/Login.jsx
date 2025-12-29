import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2, Eye, EyeOff, Check, X, Github, Zap, Shield, Code, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailValid, setEmailValid] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    // Real-time email validation
    useEffect(() => {
        if (!email) {
            setEmailValid(null);
            return;
        }
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setEmailValid(isValid);
    }, [email]);

    // Password strength calculation
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;
        setPasswordStrength(strength);
    }, [password]);

    // Keyboard shortcut (Ctrl/Cmd + Enter)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        if (emailValid === false) {
            toast.error('Geçerli bir e-posta adresi girin');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Giriş başarılı');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Giriş başarısız');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        toast(`${provider} girişi yakında kullanıma sunulacak!`, {
            icon: '🚀',
        });
    };

    const strengthColors = ['#374151', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
    const strengthLabels = ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü'];

    const features = [
        { icon: Zap, title: 'Hızlı Başla', desc: 'Şablonlarla anında başla' },
        { icon: Shield, title: 'Güvenli Altyapı', desc: 'Verileriniz şifrelenmiş' },
        { icon: Code, title: 'Kod Gerekmez', desc: 'Drag & drop ile kolay' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero */}
            <div
                className="hidden lg:flex lg:w-3/5 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute inset-0">
                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '60px 60px'
                        }}
                    />

                    {/* Gradient Orbs */}
                    <div
                        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                        >
                            <Code className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <span
                            className="text-2xl font-bold text-white tracking-tight"
                            style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
                        >
                            WebBuilder Plus
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
                        style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
                    >
                        Hayalindeki siteyi
                        <br />
                        <span className="text-emerald-400">dakikalar içinde</span>
                        <br />
                        oluştur
                    </h1>

                    <p
                        className="text-lg text-slate-400 mb-12 max-w-md leading-relaxed"
                        style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                    >
                        Kod yazmadan profesyonel web siteleri tasarla.
                        Sürükle-bırak ile güçlü özellikler.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-default"
                            >
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                    <feature.icon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3
                                        className="text-white font-semibold"
                                        style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p
                                        className="text-slate-500 text-sm"
                                        style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                                    >
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div
                className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-12"
                style={{ background: '#0f172a' }}
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                        >
                            <Code className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span
                            className="text-xl font-bold text-white"
                            style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
                        >
                            WebBuilder Plus
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2
                            className="text-3xl font-bold text-white mb-2"
                            style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
                        >
                            Tekrar hoş geldin
                        </h2>
                        <p
                            className="text-slate-500"
                            style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                        >
                            Hesabına giriş yap
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                className="block text-sm font-medium text-slate-300 mb-2"
                                style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                            >
                                E-posta
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@email.com"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                />
                                {emailValid !== null && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {emailValid ? (
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <X className="w-4 h-4 text-red-400" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                className="block text-sm font-medium text-slate-300 mb-2"
                                style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                            >
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                    style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {password && (
                                <div className="mt-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: passwordStrength >= level
                                                        ? strengthColors[passwordStrength]
                                                        : '#1e293b',
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p
                                        className="text-xs mt-1.5 transition-colors"
                                        style={{
                                            fontFamily: 'Manrope, system-ui, sans-serif',
                                            color: strengthColors[passwordStrength]
                                        }}
                                    >
                                        {strengthLabels[passwordStrength]}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-5 h-5 rounded border-2 border-slate-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all flex items-center justify-center">
                                        {rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                    </div>
                                </div>
                                <span
                                    className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors"
                                    style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                                >
                                    Beni hatırla
                                </span>
                            </label>

                            <Link
                                to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                            >
                                Şifremi unuttum
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            style={{
                                fontFamily: 'Sora, system-ui, sans-serif',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Giriş yapılıyor...</span>
                                </>
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Keyboard hint */}
                        <p
                            className="text-center text-xs text-slate-600"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                            ⌘ + Enter ile hızlı giriş
                        </p>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-sm text-slate-600" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                            veya
                        </span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="py-3 px-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white font-medium transition-all flex items-center justify-center gap-2"
                            style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7## C1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                            </svg>
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('GitHub')}
                            className="py-3 px-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white font-medium transition-all flex items-center justify-center gap-2"
                            style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                        >
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </button>
                    </div>

                    {/* Register */}
                    <p
                        className="mt-8 text-center text-slate-500"
                        style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                    >
                        Hesabın yok mu?{' '}
                        <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            Kayıt ol
                        </Link>
                    </p>

                    {/* Terms */}
                    <p
                        className="mt-4 text-center text-xs text-slate-600"
                        style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                    >
                        Giriş yaparak{' '}
                        <Link to="/terms" className="text-slate-400 hover:text-slate-300 underline transition-colors">
                            Kullanım Şartları
                        </Link>
                        'nı kabul etmiş olursun
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
