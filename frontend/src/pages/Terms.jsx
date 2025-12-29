import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Lock, Eye, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Email Item Component with Copy functionality
const EmailItem = ({ email, name }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    };

    return (
        <div className="flex items-center justify-between bg-dark-700/50 rounded-xl p-4 group hover:bg-dark-700 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <div className="text-white font-medium text-sm">{name}</div>
                    <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                    >
                        {email}
                    </a>
                </div>
            </div>
            <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors text-dark-300 hover:text-white"
                title="E-postayı kopyala"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    );
};

// Contact Section Component
const ContactSection = () => {
    return (
        <section className="bg-dark-800 rounded-2xl p-8 border border-dark-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">İletişim</h2>
            </div>
            <div className="space-y-4 text-dark-300">
                <p>
                    Gizlilik politikamız veya kullanım şartlarımız hakkında sorularınız için
                    bizimle iletişime geçebilirsiniz.
                </p>

                <div className="space-y-3 mt-6">
                    <EmailItem email="kutaytahakaratas@gmail.com" name="Kutay Taha Karataş" />
                    <EmailItem email="yukselmustafa544@gmail.com" name="Mustafa Yüksel" />
                </div>

                <p className="text-white font-medium pt-4 text-center">
                    Designed & Developed by Kutay & Mustafa
                </p>
            </div>
        </section>
    );
};

const Terms = () => {
    return (
        <div className="min-h-screen bg-dark-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Geri Dön
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl mb-6">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Gizlilik ve Kullanım Şartları</h1>
                    <p className="text-dark-400 text-lg">
                        WebBuilder Plus platformunu kullanırken geçerli olan kurallar ve gizlilik politikamız
                    </p>
                </div>

                {/* Content Sections */}
                <div className="bg-dark-800/30 rounded-2xl border border-dark-700/50 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Gizlilik Politikası */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-5 h-5 text-blue-400/70" aria-hidden="true" />
                                <h2 className="text-2xl font-bold text-white">Gizlilik Politikası</h2>
                            </div>
                            <div className="space-y-4 text-dark-300 leading-relaxed">
                                <p>
                                    WebBuilder Plus olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz.
                                    Kişisel verileriniz güvenli bir şekilde saklanmakta ve üçüncü taraflarla paylaşılmamaktadır.
                                </p>
                                <p>
                                    Platformumuzda oluşturduğunuz projeler ve içerikler tamamen size aittir.
                                    Bu verilere yalnızca siz erişebilirsiniz.
                                </p>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="border-t border-dark-700/50"></div>

                        {/* Veri Toplama */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="w-5 h-5 text-purple-400/70" aria-hidden="true" />
                                <h2 className="text-2xl font-bold text-white">Toplanan Veriler</h2>
                            </div>
                            <div className="space-y-4 text-dark-300 leading-relaxed">
                                <ul className="list-disc list-inside space-y-2">
                                    <li>E-posta adresi (hesap oluşturma için)</li>
                                    <li>Kullanıcı adı</li>
                                    <li>Oluşturulan projeler ve içerikleri</li>
                                </ul>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="border-t border-dark-700/50"></div>

                        {/* Kullanım Şartları */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-5 h-5 text-green-400/70" aria-hidden="true" />
                                <h2 className="text-2xl font-bold text-white">Kullanım Şartları</h2>
                            </div>
                            <div className="space-y-4 text-dark-300 leading-relaxed">
                                <p>
                                    WebBuilder Plus platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Platformu yasal amaçlar için kullanacağınızı</li>
                                    <li>Başkalarının haklarına saygı göstereceğinizi</li>
                                    <li>Zararlı içerik oluşturmayacağınızı</li>
                                    <li>Hesap bilgilerinizi güvende tutacağınızı</li>
                                </ul>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="border-t border-dark-700/50"></div>

                        {/* İletişim */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Mail className="w-5 h-5 text-pink-400/70" aria-hidden="true" />
                                <h2 className="text-2xl font-bold text-white">İletişim</h2>
                            </div>
                            <div className="space-y-4 text-dark-300 leading-relaxed">
                                <p>
                                    Gizlilik politikamız veya kullanım şartlarımız hakkında sorularınız için
                                    bizimle iletişime geçebilirsiniz.
                                </p>

                                <div className="space-y-3 mt-6">
                                    <EmailItem email="kutaytahakaratas@gmail.com" name="Kutay Taha Karataş" />
                                    <EmailItem email="yukselmustafa544@gmail.com" name="Mustafa Yüksel" />
                                </div>

                                <p className="text-white font-medium pt-4 text-center">
                                    Designed & Developed by Kutay & Mustafa
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-dark-500 text-sm">
                    Son güncelleme: Aralık 2025
                </div>
            </div>
        </div>
    );
};

export default Terms;
