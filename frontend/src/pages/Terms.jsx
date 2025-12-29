import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Lock, Eye, Mail, Copy, Check, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Email Item Component with Copy functionality
const EmailItem = ({ email, name }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            toast.success('E-posta kopyalandı!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
            toast.error('Kopyalama başarısız');
        }
    };

    return (
        <div className="flex items-center justify-between bg-[#FAFBFC] border-2 border-[#E1E4E8] p-4 hover:border-[#00FF94] transition-all duration-200 group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0A0E14] flex items-center justify-center text-[#00FF94] text-sm font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <div className="text-[#0A0E14] font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{name}</div>
                    <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6A737D] hover:text-[#00FF94] transition-colors text-sm flex items-center gap-1 group"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                        {email}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
            </div>
            <button
                onClick={handleCopy}
                className="p-2 bg-[#E1E4E8] hover:bg-[#00FF94] transition-all text-[#6A737D] hover:text-[#0A0E14]"
                title="E-postayı kopyala"
                aria-label="Copy email to clipboard"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-[#00FF94]" strokeWidth={3} />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    );
};

const Terms = () => {
    const [activeSection, setActiveSection] = useState('privacy');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Scroll spy with Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5, rootMargin: '-20% 0px -35% 0px' }
        );

        document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const sections = [
        { id: 'privacy', title: 'Gizlilik Politikası', icon: Lock },
        { id: 'data', title: 'Toplanan Veriler', icon: Eye },
        { id: 'terms', title: 'Kullanım Şartları', icon: FileText },
        { id: 'contact', title: 'İletişim', icon: Mail },
    ];

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMobileMenuOpen(false);
    };

    const copyLinkToSection = (sectionId) => {
        const url = `${window.location.origin}/terms#${sectionId}`;
        navigator.clipboard.writeText(url);
        toast.success('Bağlantı kopyalandı!', {
            icon: '🔗',
        });
    };

    return (
        <div className="min-h-screen bg-[#FAFBFC]">

            {/* Header */}
            <div className="bg-[#0A0E14] py-8 px-4 border-b-4 border-[#00FF94]">
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-[#E1E4E8] hover:text-[#00FF94] transition-colors mb-6 group"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Geri Dön
                    </Link>

                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-[#00FF94] flex items-center justify-center flex-shrink-0">
                            <Shield className="w-8 h-8 text-[#0A0E14]" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#FAFBFC] mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                                Gizlilik ve Kullanım Şartları
                            </h1>
                            <p className="text-[#E1E4E8] text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                WebBuilder Plus platformunu kullanırken geçerli olan kurallar ve gizlilik politikamız
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
                {/* Sidebar - Table of Contents */}
                <aside className="lg:w-[20%] lg:sticky lg:top-8 lg:self-start">
                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden w-full py-3 px-4 bg-[#0A0E14] text-[#FAFBFC] font-semibold mb-4 flex items-center justify-between"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                        <span>İçindekiler</span>
                        <span className="text-[#00FF94]">{isMobileMenuOpen ? '−' : '+'}</span>
                    </button>

                    <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block bg-white border-2 border-[#E1E4E8] p-6`}>
                        <h2 className="text-sm font-bold text-[#6A737D] mb-4 uppercase tracking-wider" style={{ fontFamily: 'Sora, sans-serif' }}>
                            İçindekiler
                        </h2>
                        <ul className="space-y-2">
                            {sections.map(({ id, title, icon: Icon }) => (
                                <li key={id}>
                                    <button
                                        onClick={() => scrollToSection(id)}
                                        className={`w-full text-left py-2 px-3 border-l-4 transition-all flex items-center gap-2 ${activeSection === id
                                            ? 'border-[#00FF94] bg-[#FAFBFC] text-[#0A0E14] font-semibold'
                                            : 'border-transparent hover:border-[#E1E4E8] text-[#6A737D] hover:text-[#0A0E14]'
                                            }`}
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm">{title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Print Button */}
                        <button
                            onClick={() => window.print()}
                            className="w-full mt-6 py-2 px-3 bg-[#E1E4E8] hover:bg-[#0A0E14] text-[#0A0E14] hover:text-[#FAFBFC] font-semibold transition-all text-sm"
                            style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                            Yazdır
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="lg:w-[80%] space-y-16">
                    {/* Privacy Policy */}
                    <section id="privacy" data-section className="scroll-mt-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Lock className="w-6 h-6 text-[#6A737D]" />
                                <h2 className="text-3xl font-bold text-[#0A0E14]" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    Gizlilik Politikası
                                </h2>
                            </div>
                            <button
                                onClick={() => copyLinkToSection('privacy')}
                                className="p-2 text-[#6A737D] hover:text-[#00FF94] transition-colors"
                                title="Bağlantıyı kopyala"
                                aria-label="Copy link to this section"
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="border-t-2 border-dashed border-[#E1E4E8] mb-6" />
                        <div className="space-y-4 text-[#24292E] leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            <p>
                                WebBuilder Plus olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz.
                                Kişisel verileriniz güvenli bir şekilde saklanmakta ve üçüncü taraflarla paylaşılmamaktadır.
                            </p>
                            <p>
                                Platformumuzda oluşturduğunuz projeler ve içerikler tamamen size aittir.
                                Bu verilere yalnızca siz erişebilirsiniz.
                            </p>
                            <div className="bg-[#FAFBFC] border-l-4 border-[#3B82F6] p-4 my-4">
                                <p className="text-sm text-[#24292E] font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                    💡 <strong>Önemli:</strong> Verileriniz 256-bit AES şifreleme ile korunmaktadır.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Collection */}
                    <section id="data" data-section className="scroll-mt-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Eye className="w-6 h-6 text-[#6A737D]" />
                                <h2 className="text-3xl font-bold text-[#0A0E14]" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    Toplanan Veriler
                                </h2>
                            </div>
                            <button
                                onClick={() => copyLinkToSection('data')}
                                className="p-2 text-[#6A737D] hover:text-[#00FF94] transition-colors"
                                title="Bağlantıyı kopyala"
                                aria-label="Copy link to this section"
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="border-t-2 border-dashed border-[#E1E4E8] mb-6" />
                        <div className="space-y-4 text-[#24292E] leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            <p className="mb-4">Platformumuzda aşağıdaki veriler toplanmaktadır:</p>
                            <ul className="space-y-3">
                                {[
                                    'E-posta adresi (hesap oluşturma için)',
                                    'Kullanıcı adı',
                                    'Oluşturulan projeler ve içerikleri',
                                    'Kullanım istatistikleri (anonim)',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#00FF94] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-[#0A0E14]" strokeWidth={3} />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Terms of Service */}
                    <section id="terms" data-section className="scroll-mt-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#6A737D]" />
                                <h2 className="text-3xl font-bold text-[#0A0E14]" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    Kullanım Şartları
                                </h2>
                            </div>
                            <button
                                onClick={() => copyLinkToSection('terms')}
                                className="p-2 text-[#6A737D] hover:text-[#00FF94] transition-colors"
                                title="Bağlantıyı kopyala"
                                aria-label="Copy link to this section"
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="border-t-2 border-dashed border-[#E1E4E8] mb-6" />
                        <div className="space-y-4 text-[#24292E] leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            <p className="mb-4">WebBuilder Plus platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız:</p>
                            <ul className="space-y-3">
                                {[
                                    'Platformu yasal amaçlar için kullanacağınızı',
                                    'Başkalarının haklarına saygı göstereceğinizi',
                                    'Zararlı içerik oluşturmayacağınızı',
                                    'Hesap bilgilerinizi güvende tutacağınızı',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#0A0E14] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[#00FF94] text-sm font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                                {idx + 1}
                                            </span>
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Contact */}
                    <section id="contact" data-section className="scroll-mt-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-[#6A737D]" />
                                <h2 className="text-3xl font-bold text-[#0A0E14]" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    İletişim
                                </h2>
                            </div>
                            <button
                                onClick={() => copyLinkToSection('contact')}
                                className="p-2 text-[#6A737D] hover:text-[#00FF94] transition-colors"
                                title="Bağlantıyı kopyala"
                                aria-label="Copy link to this section"
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="border-t-2 border-dashed border-[#E1E4E8] mb-6" />
                        <div className="space-y-4 text-[#24292E] leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            <p className="mb-6">
                                Gizlilik politikamız veya kullanım şartlarımız hakkında sorularınız için
                                bizimle iletişime geçebilirsiniz.
                            </p>

                            <div className="space-y-3">
                                <EmailItem email="kutaytahakaratas@gmail.com" name="Kutay Taha Karataş" />
                                <EmailItem email="yukselmustafa544@gmail.com" name="Mustafa Yüksel" />
                            </div>

                            <div className="mt-8 pt-8 border-t-2 border-dashed border-[#E1E4E8] text-center">
                                <p className="text-[#0A0E14] font-bold text-lg mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    Designed & Developed by Kutay & Mustafa
                                </p>
                                <p className="text-[#6A737D] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                    with ❤️ and lots of ☕
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-[#0A0E14] py-6 px-4 mt-16 border-t-4 border-[#00FF94]">
                <div className="max-w-7xl mx-auto text-center text-[#E1E4E8]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <p className="text-sm">
                        Son güncelleme: {new Date().toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </footer>

            {/* Print Styles */}
            <style>{`
                @media print {
                    aside, .no-print, button { display: none !important; }
                    body { background: white !important; color: black !important; }
                    h2 { page-break-after: avoid; }
                    section { page-break-inside: avoid; }
                }

                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Terms;
