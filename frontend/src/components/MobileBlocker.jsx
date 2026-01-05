import { useEffect, useState } from 'react';

/**
 * MobileBlocker Component (Turkish Version)
 * Blocks access to the application on mobile devices and small screens.
 * Displays a high-contrast, "access denied" style warning in Turkish.
 */
export const MobileBlocker = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // Check for mobile user agent
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
            const isMobileDevice = mobileRegex.test(userAgent);

            // Check for small screen width (standard mobile breakpoint)
            // < 1024px covers most tablets and all phones
            const isSmallScreen = window.innerWidth < 1024;

            const shouldBlock = isMobileDevice || isSmallScreen;
            setIsMobile(shouldBlock);

            if (shouldBlock) {
                setTimeout(() => setShowWarning(true), 100);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isMobile) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden transition-opacity duration-1000 ${showWarning ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Background Glitch & Grid */}
            <div className="absolute inset-0 mobile-blocker-grid opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse"></div>

            {/* Content Container */}
            <div className="relative z-10 max-w-md w-full border-2 border-red-600 bg-black/90 p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] backdrop-blur-xl">

                {/* Warning Icon/Header */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center mobile-blocker-ping relative">
                        <span className="text-6xl absolute">⚠️</span>
                        <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                <h1
                    className="font-bold text-4xl text-red-500 mb-2 tracking-widest uppercase mobile-blocker-glitch"
                    data-text="ERİŞİM ENGELLENDİ"
                >
                    ERİŞİM ENGELLENDİ
                </h1>

                <div className="h-0.5 w-full bg-red-600 mb-6 shadow-[0_0_10px_#dc2626]"></div>

                <h2 className="text-xl text-white mb-6 font-bold tracking-wide">
                    SİSTEM UYUMSUZ
                </h2>

                <p className="text-gray-300 mb-8 leading-relaxed text-sm font-mono">
                    <span className="text-red-400 font-bold block mb-2">[HATA_KODU: MOBİL_TESPİT_EDİLDİ]</span>
                    Bu uygulama, yalnızca <span className="text-white font-bold">MASAÜSTÜ (PC)</span> cihazları için tasarlanmıştır.
                    Mobil cihaz mimarisi bu uygulamayı çalıştırmak için yetersizdir.
                </p>

                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded mb-8">
                    <p className="text-xs text-red-300 font-mono">
                        GEREKLİ_PLATFORM: MASAÜSTÜ_WIN/MAC/LINUX<br />
                        TESPİT_EDİLEN_PLATFORM: MOBİL_CİHAZ<br />
                        DURUM: <span className="animate-pulse font-bold">KİLİTLENDİ</span>
                    </p>
                </div>

                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                    WebCraft Studio
                </div>
            </div>

            {/* Scan lines overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-[100]"
                style={{
                    background: `
            linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
            linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))
          `,
                    backgroundSize: '100% 2px, 3px 100%'
                }}
            ></div>
        </div>
    );
};

export default MobileBlocker;
