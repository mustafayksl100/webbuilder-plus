import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
    CreditCard,
    Star,
    Check,
    Loader2,
    Sparkles,
    Zap,
    Crown,
    Building2
} from 'lucide-react';

const Shop = () => {
    const { user, updateCredits } = useAuthStore();
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await api.get('/credits/packages');
            setPackages(response.data.data);
        } catch (error) {
            toast.error('Paketler yüklenemedi');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedPackage) return;

        // Simple validation
        if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
            toast.error('Lütfen tüm kart bilgilerini doldurun');
            return;
        }

        setPurchasing(selectedPackage.id);
        try {
            const response = await api.post('/credits/purchase', {
                packageId: selectedPackage.id,
                paymentMethod: 'credit_card',
                cardDetails
            });

            updateCredits(response.data.data.newBalance);
            toast.success(`${selectedPackage.credits} kredi başarıyla eklendi!`);
            setShowPaymentModal(false);
            setSelectedPackage(null);
            setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
        } catch (error) {
            toast.error(error.message || 'Ödeme başarısız');
        } finally {
            setPurchasing(null);
        }
    };

    const getPackageIcon = (name) => {
        switch (name.toLowerCase()) {
            case 'starter': return Zap;
            case 'popular': return Star;
            case 'professional': return Crown;
            case 'enterprise': return Building2;
            default: return Sparkles;
        }
    };

    const getPackageGradient = (name, isPopular) => {
        if (isPopular) return 'from-primary-500 to-purple-500';
        switch (name.toLowerCase()) {
            case 'starter': return 'from-emerald-500 to-teal-500';
            case 'professional': return 'from-amber-500 to-orange-500';
            case 'enterprise': return 'from-rose-500 to-pink-500';
            default: return 'from-blue-500 to-cyan-500';
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Kredi Yükle
                </h1>
                <p className="text-dark-400 max-w-2xl mx-auto">
                    Export işlemleri için kredinizi yükleyin. Her export işlemi 200 kredi kullanır.
                </p>

                {/* Current Balance */}
                <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-dark-800 border border-dark-700 rounded-full">
                    <span className="text-dark-400">Mevcut Bakiye:</span>
                    <span className="text-2xl font-bold text-gradient">{user?.credits || 0}</span>
                    <span className="text-dark-400">kredi</span>
                </div>
            </div>

            {/* Packages Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 h-80 skeleton" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => {
                        const Icon = getPackageIcon(pkg.name);
                        const gradient = getPackageGradient(pkg.name, pkg.is_popular);

                        return (
                            <div
                                key={pkg.id}
                                className={`
                  relative bg-dark-800 border rounded-2xl p-6 transition-all card-hover
                  ${pkg.is_popular
                                        ? 'border-primary-500 ring-1 ring-primary-500/20'
                                        : 'border-dark-700'
                                    }
                `}
                            >
                                {/* Popular Badge */}
                                {pkg.is_popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <div className="px-4 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold rounded-full">
                                            EN POPÜLER
                                        </div>
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Package Name */}
                                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>

                                {/* Credits */}
                                <div className="text-3xl font-bold text-white mb-1">
                                    {pkg.credits.toLocaleString()}
                                    <span className="text-sm font-normal text-dark-400 ml-2">kredi</span>
                                </div>

                                {/* Price */}
                                <div className="text-lg text-dark-300 mb-4">
                                    ${pkg.price}
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-dark-300">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {Math.floor(pkg.credits / 200)} export hakkı
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-dark-300">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Sınırsız proje
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-dark-300">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Tüm şablonlar
                                    </li>
                                </ul>

                                {/* Buy Button */}
                                <button
                                    onClick={() => {
                                        setSelectedPackage(pkg);
                                        setShowPaymentModal(true);
                                    }}
                                    className={`
                    w-full py-3 rounded-lg font-semibold transition-all
                    ${pkg.is_popular
                                            ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:from-primary-600 hover:to-purple-600'
                                            : 'bg-dark-700 text-white hover:bg-dark-600'
                                        }
                  `}
                                >
                                    Satın Al
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 p-6 bg-dark-800/50 border border-dark-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Bilgilendirme</h3>
                <ul className="space-y-2 text-dark-400">
                    <li>• Her web sitesi export işlemi <span className="text-white font-medium">200 kredi</span> kullanır.</li>
                    <li>• Krediler hesabınızda sınırsız süre geçerlidir.</li>
                    <li>• Ödeme simülasyondur, gerçek ödeme alınmaz.</li>
                    <li>• Kayıt olduğunuzda <span className="text-primary-400">500 kredi</span> hediye edilir.</li>
                </ul>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPackage && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6 animate-scale-in"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Ödeme</h3>
                        <p className="text-dark-400 mb-6">
                            {selectedPackage.name} - {selectedPackage.credits} kredi (${selectedPackage.price})
                        </p>

                        {/* Demo Notice */}
                        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <p className="text-sm text-amber-400">
                                ⚠️ Bu demo moddur. Gerçek ödeme alınmayacaktır.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Kart Numarası
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="text"
                                        value={cardDetails.number}
                                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className="w-full pl-11 pr-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500"
                                    />
                                </div>
                            </div>

                            {/* Card Name */}
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Kart Üzerindeki İsim
                                </label>
                                <input
                                    type="text"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    placeholder="AD SOYAD"
                                    className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500"
                                />
                            </div>

                            {/* Expiry & CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        Son Kullanma
                                    </label>
                                    <input
                                        type="text"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        placeholder="AA/YY"
                                        maxLength={5}
                                        className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        placeholder="123"
                                        maxLength={4}
                                        className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedPackage(null);
                                }}
                                className="flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handlePurchase}
                                disabled={purchasing}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {purchasing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    `$${selectedPackage.price} Öde`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
