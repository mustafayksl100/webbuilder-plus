import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Loader2, Eye, EyeOff, Check, X, Shield, Code, ArrowRight, Sparkles } from 'lucide-react';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailValid, setEmailValid] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { register } = useAuthStore();
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
        if (password.length >= 8) strength++; // En az 8 karakter
        if (/[a-zA-Z]/.test(password)) strength++; // Harf
        if (/\d/.test(password)) strength++; // Sayı
        if (/[@$!%*?&]/.test(password)) strength++; // Özel karakter
        setPasswordStrength(strength);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password || !confirmPassword) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        if (emailValid === false) {
            toast.error('Geçerli bir e-posta adresi girin');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }

        if (passwordStrength < 2) {
            toast.error('Daha güçlü bir şifre seçin');
            return;
        }

        if (!termsAccepted) {
            toast.error('Kullanım şartlarını kabul etmelisiniz');
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, fullName);
            toast.success('Kayıt başarılı! 500 kredi hesabınıza eklendi. 🎉');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Kayıt başarısız');
        } finally {
            setIsLoading(false);
        }
    };

    const strengthColors = ['#374151', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
    const strengthLabels = ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü'];

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
                    <div
                        className="absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
                    />
                </div>

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
                        Aramıza
                        <br />
                        <span className="text-emerald-400">Katıl</span>
                    </h1>

                    <p
                        className="text-lg text-slate-400 mb-12 max-w-md leading-relaxed"
                        style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                    >
                        Binlerce geliştirici ve tasarımcı arasına sen de katıl.
                        Hemen ücretsiz hesabını oluştur.
                    </p>

                    {/* Bonus Card */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 p-6 rounded-2xl max-w-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-emerald-500/30" />

                        <div className="flex items-start gap-4 reltive z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Sora, system-ui, sans-serif' }}>
                                    500 Kredi Hediye 🎁
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                                    Kayıt olduğunda hesabına anında 500 kredi tanımlanır.
                                    Projelerini hemen oluşturmaya başla!
                                </p>
                            </div>
                        </div>
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

                    <div className="mb-8">
                        <h2
                            className="text-3xl font-bold text-white mb-2"
                            style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
                        >
                            Hesap Oluştur
                        </h2>
                        <p
                            className="text-slate-500"
                            style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                        >
                            Ücretsiz kayıt ol, hemen başla
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                                Ad Soyad
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Adınız Soyadınız"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                    style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                                E-posta
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@email.com"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                />
                                {emailValid !== null && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {emailValid ? (
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
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

                            {/* Strength Meter */}
                            {password && (
                                <div className="mt-2 flex gap-1 h-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className="flex-1 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: passwordStrength >= level
                                                    ? strengthColors[passwordStrength]
                                                    : '#1e293b',
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                                Şifre Tekrar
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${confirmPassword && password !== confirmPassword
                                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                                        }`}
                                    style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group mt-2">
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-5 h-5 rounded border-2 border-slate-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all flex items-center justify-center">
                                    {termsAccepted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                            </div>
                            <span className="text-sm text-slate-400 leading-snug" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                                <Link to="/terms" className="text-emerald-400 hover:underline">Kullanım Şartları</Link>'nı ve <Link to="/terms#privacy" className="text-emerald-400 hover:underline">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01]"
                            style={{
                                fontFamily: 'Sora, system-ui, sans-serif',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Kayıt yapılıyor...</span>
                                </>
                            ) : (
                                <>
                                    <span>Hesap Oluştur</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p
                        className="mt-8 text-center text-slate-500"
                        style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
                    >
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            Giriş yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
