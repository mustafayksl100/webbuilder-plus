import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Loader2, Eye, EyeOff, Check } from 'lucide-react';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuthStore();
    const navigate = useNavigate();

    // Password strength check
    const passwordStrength = {
        length: password.length >= 6,
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /\d/.test(password),
    };
    const isStrongPassword = Object.values(passwordStrength).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password || !confirmPassword) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }

        if (!isStrongPassword) {
            toast.error('Lütfen güçlü bir şifre oluşturun');
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, fullName);
            toast.success('Kayıt başarılı! 500 kredi hesabınıza eklendi.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Kayıt başarısız');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-2">Hesap Oluştur</h2>
            <p className="text-dark-400 mb-8">Ücretsiz kayıt ol ve 500 kredi kazan!</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        Ad Soyad
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Adınız Soyadınız"
                            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        E-posta
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@email.com"
                            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        Şifre
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Strength Indicators */}
                    {password && (
                        <div className="mt-3 space-y-1">
                            <div className={`flex items-center gap-2 text-xs ${passwordStrength.length ? 'text-green-500' : 'text-dark-500'}`}>
                                <Check className="w-3 h-3" />
                                En az 6 karakter
                            </div>
                            <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasLetter ? 'text-green-500' : 'text-dark-500'}`}>
                                <Check className="w-3 h-3" />
                                En az bir harf
                            </div>
                            <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasNumber ? 'text-green-500' : 'text-dark-500'}`}>
                                <Check className="w-3 h-3" />
                                En az bir rakam
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        Şifre Tekrar
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-4 py-3 bg-dark-800 border rounded-lg text-white placeholder-dark-500 focus:ring-1 transition-all ${confirmPassword && password !== confirmPassword
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-dark-700 focus:border-primary-500 focus:ring-primary-500'
                                }`}
                        />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">Şifreler eşleşmiyor</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-purple-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Kayıt yapılıyor...
                        </>
                    ) : (
                        'Kayıt Ol'
                    )}
                </button>
            </form>

            {/* Bonus Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-lg">
                <p className="text-sm text-primary-300 text-center">
                    🎉 Kayıt olduğunuzda <span className="font-bold">500 kredi</span> hediye!
                </p>
            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-dark-400">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
                    Giriş Yap
                </Link>
            </p>
        </div>
    );
};

export default Register;
