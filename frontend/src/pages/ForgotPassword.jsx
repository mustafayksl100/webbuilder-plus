import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('E-posta adresi bulunamadı. Lütfen giriş sayfasından tekrar deneyin.');
            return;
        }

        if (!newPassword) {
            toast.error('Lütfen yeni şifrenizi girin');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Şifre en az 6 karakter olmalı');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/reset-password', {
                email,
                newPassword
            });

            if (response.data.success) {
                setIsSubmitted(true);
                toast.success('Şifreniz başarıyla güncellendi!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Şifre sıfırlama başarısız');
        } finally {
            setIsLoading(false);
        }
    };

    // No email provided
    if (!email) {
        return (
            <div className="animate-fade-in text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-6">
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">E-posta Gerekli</h2>
                <p className="text-dark-400 mb-8">
                    Şifre sıfırlamak için önce giriş sayfasından e-posta adresinizi girin,
                    ardından "Şifremi Unuttum" linkine tıklayın.
                </p>
                <Link
                    to="/login"
                    className="block w-full py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all text-center"
                >
                    Giriş Sayfasına Dön
                </Link>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="animate-fade-in text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Şifre Güncellendi!</h2>
                <p className="text-dark-400 mb-8">
                    Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
                </p>
                <Link
                    to="/login"
                    className="block w-full py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all text-center"
                >
                    Giriş Yap
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <Link
                to="/login"
                className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Geri Dön
            </Link>

            <h2 className="text-3xl font-bold text-white mb-2">Şifre Sıfırla</h2>
            <p className="text-dark-400 mb-2">
                Yeni şifrenizi belirleyin.
            </p>
            <p className="text-primary-400 text-sm mb-8">
                {email}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        Yeni Şifre
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                    <p className="text-xs text-dark-500 mt-1">En az 6 karakter</p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        Yeni Şifre (Tekrar)
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
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
                            Şifre Güncelleniyor...
                        </>
                    ) : (
                        'Yeni Şifre Oluştur'
                    )}
                </button>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-dark-400">
                Şifrenizi hatırladınız mı?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
                    Giriş Yap
                </Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
