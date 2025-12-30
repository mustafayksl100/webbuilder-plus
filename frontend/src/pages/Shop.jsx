import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import {
    Zap,
    Gift,
    Sparkles,
    Check,
    Coins,
    Rocket,
    TestTube,
    ArrowRight
} from 'lucide-react';

const Shop = () => {
    const { user, updateCredits } = useAuthStore();
    const [claimingPackage, setClaimingPackage] = useState(null);
    const [claimedPackages, setClaimedPackages] = useState([]);

    // Demo paketleri - Gerçek ödeme yok
    const packages = [
        {
            id: 'site-complete',
            name: 'Site Tamamlama Bonusu',
            description: 'Web sitenizi tamamladığınızda kazanın',
            credits: 1000,
            icon: Rocket,
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-500',
            features: [
                '1000 kredi anında hesabınıza',
                '5 export hakkı',
                'Sınırsız düzenleme',
                'Tüm şablonlara erişim'
            ],
            buttonText: 'Bonusu Al',
            successMessage: '🎉 Site Tamamlama Bonusu eklendi!'
        },
        {
            id: 'demo-mode',
            name: 'Deneme Modu',
            description: 'Test için ekstra kredi',
            credits: 1000,
            icon: TestTube,
            color: 'teal',
            gradient: 'from-teal-500 to-emerald-500',
            features: [
                '1000 test kredisi',
                'Tüm özellikleri deneyin',
                'Ücretsiz ve sınırsız',
                'Geliştirici modu'
            ],
            buttonText: 'Deneme Kredisi Al',
            successMessage: '🧪 Deneme kredileri eklendi!'
        }
    ];

    const handleClaimPackage = async (pkg) => {
        setClaimingPackage(pkg.id);

        // Simüle edilmiş bekleme
        await new Promise(resolve => setTimeout(resolve, 800));

        // Kredi güncelle
        const newBalance = (user?.credits || 0) + pkg.credits;
        updateCredits(newBalance);

        // Paketi talep edildi olarak işaretle
        setClaimedPackages(prev => [...prev, pkg.id]);

        toast.success(pkg.successMessage);
        setClaimingPackage(null);
    };

    const isPackageClaimed = (pkgId) => claimedPackages.includes(pkgId);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-10 font-[Manrope]">

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 text-emerald-400 mb-4">
                    <Coins className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-widest">Kredi Merkezi</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold font-[Sora] mb-4">
                    Kredi Yükle
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto mb-8">
                    Bu demo sürümünde gerçek ödeme alınmaz. Aşağıdaki paketlerden ücretsiz kredi alabilirsiniz.
                </p>

                {/* Current Balance Card */}
                <div className="inline-flex items-center gap-4 px-8 py-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Zap className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-slate-500 font-mono uppercase">Mevcut Bakiye</div>
                        <div className="text-3xl font-bold font-[Sora] text-white">
                            {user?.credits || 0} <span className="text-lg text-slate-500">kredi</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
                {packages.map((pkg) => {
                    const Icon = pkg.icon;
                    const isClaimed = isPackageClaimed(pkg.id);
                    const isClaiming = claimingPackage === pkg.id;

                    return (
                        <div
                            key={pkg.id}
                            className={`
                                relative bg-slate-900 border rounded-3xl p-8 transition-all duration-300
                                ${isClaimed
                                    ? 'border-green-500/30 opacity-75'
                                    : 'border-slate-800 hover:border-slate-700 hover:shadow-2xl'
                                }
                            `}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-5 rounded-3xl`} />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-2 font-[Sora]">
                                    {pkg.name}
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    {pkg.description}
                                </p>

                                {/* Credits Amount */}
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-5xl font-bold font-[Sora] text-white">
                                        +{pkg.credits.toLocaleString()}
                                    </span>
                                    <span className="text-slate-500 text-lg">kredi</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.gradient} flex items-center justify-center flex-shrink-0`}>
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Button */}
                                {isClaimed ? (
                                    <div className="flex items-center justify-center gap-2 py-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-medium">
                                        <Check className="w-5 h-5" />
                                        Alındı
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleClaimPackage(pkg)}
                                        disabled={isClaiming}
                                        className={`
                                            w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                                            bg-gradient-to-r ${pkg.gradient} text-white
                                            hover:shadow-lg hover:shadow-${pkg.color}-500/20
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {isClaiming ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                İşleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <Gift className="w-5 h-5" />
                                                {pkg.buttonText}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Section */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-xl font-bold text-white font-[Sora]">Kredi Kullanımı</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-emerald-400 font-semibold font-mono text-sm uppercase tracking-wide">Harcama</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-3">
                                    <ArrowRight className="w-4 h-4 text-red-400" />
                                    <span>Export işlemi: <span className="text-white font-medium">-200 kredi</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <ArrowRight className="w-4 h-4 text-orange-400" />
                                    <span>Proje düzenleme: <span className="text-white font-medium">-200 kredi</span></span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-emerald-400 font-semibold font-mono text-sm uppercase tracking-wide">Kazanma</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-3">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span>Site tamamlama: <span className="text-white font-medium">+1000 kredi</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <ArrowRight className="w-4 h-4 text-purple-400" />
                                    <span>Deneme modu: <span className="text-white font-medium">+1000 kredi</span></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-amber-400 text-sm">
                            ⚠️ <strong>Demo Modu:</strong> Bu uygulama test amaçlıdır. Gerçek ödeme alınmaz, tüm krediler simülasyondur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
