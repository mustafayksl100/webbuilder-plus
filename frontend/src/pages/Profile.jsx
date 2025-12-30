import { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
    User,
    Mail,
    Lock,
    Camera,
    Loader2,
    Check,
    X,
    CreditCard,
    Clock
} from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error('Ad soyad gerekli');
            return;
        }

        setIsUpdating(true);
        try {
            const response = await api.put('/auth/profile', { fullName: fullName.trim() });
            updateUser({ fullName: response.data.data.fullName });
            toast.success('Profil güncellendi');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasyon (Max 2MB, Resim)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Dosya boyutu 2MB\'dan küçük olmalı');
            return;
        }
        if (!file.type.startsWith('image/')) {
            toast.error('Lütfen geçerli bir resim dosyası seçin');
            return;
        }

        setIsUploadingAvatar(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                // Backend'e gönder
                const response = await api.put('/auth/profile', { avatarUrl: base64String });

                // Store güncelle
                updateUser({ avatarUrl: response.data.data.avatarUrl });
                toast.success('Profil fotoğrafı güncellendi');
            } catch (error) {
                console.error('Avatar upload failed:', error);
                toast.error('Fotoğraf yüklenemedi');
            } finally {
                setIsUploadingAvatar(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Tüm alanları doldurun');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Yeni şifre en az 6 karakter olmalı');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }

        setIsChangingPassword(true);
        try {
            await api.put('/auth/password', { currentPassword, newPassword });
            toast.success('Şifre değiştirildi');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Güvenlik', icon: Lock },
        { id: 'credits', label: 'Krediler', icon: CreditCard },
    ];

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Hesap Ayarları</h1>
                <p className="text-dark-400">Profil ve güvenlik ayarlarınızı yönetin.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden mb-6">
                <div className="p-6 bg-gradient-to-r from-primary-500/20 to-purple-500/20 border-b border-dark-700">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-4 border-dark-800 shadow-xl relative group" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    user?.fullName?.charAt(0) || 'U'
                                )}

                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-dark-700 hover:bg-emerald-500 border-2 border-dark-800 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-lg text-emerald-400 hover:text-white"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Info */}
                        <div>
                            <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
                            <p className="text-dark-400">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded">
                                    {user?.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                                </span>
                                <span className="text-xs text-dark-500">
                                    Kayıt: {new Date(user?.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-dark-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'text-primary-400 border-b-2 border-primary-400 bg-primary-500/5'
                                : 'text-dark-400 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
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
                                        className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    E-posta
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-dark-400 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-dark-500 mt-1">E-posta değiştirilemez</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Kaydet
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Mevcut Şifre
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Yeni Şifre
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Yeni Şifre Tekrar
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Değiştiriliyor...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Şifreyi Değiştir
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Credits Tab */}
                    {activeTab === 'credits' && (
                        <div className="space-y-6">
                            {/* Current Balance */}
                            <div className="p-6 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-xl">
                                <div className="text-sm text-dark-400 mb-1">Mevcut Bakiye</div>
                                <div className="text-4xl font-bold text-gradient">{user?.credits || 0}</div>
                                <div className="text-dark-400 mt-1">kredi</div>
                            </div>

                            {/* Info */}
                            <div className="p-4 bg-dark-700/50 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Kredi Kullanımı</h4>
                                <ul className="space-y-1 text-sm text-dark-400">
                                    <li>• Her export işlemi 200 kredi kullanır</li>
                                    <li>• Krediler sınırsız süre geçerlidir</li>
                                    <li>• Shop sayfasından kredi yükleyebilirsiniz</li>
                                </ul>
                            </div>

                            {/* Recent Transactions (placeholder) */}
                            <div>
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Son İşlemler
                                </h4>
                                <div className="text-sm text-dark-500 text-center py-8 bg-dark-700/30 rounded-lg">
                                    İşlem geçmişi burada görünecek
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
