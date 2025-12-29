/**
 * WebCraft Studio - Code Generator Service
 * Generates clean, well-commented HTML/CSS/JS code from project content
 */

// Generate HTML code
function generateHTML(content, settings, framework, projectName) {
    const components = content.components || [];
    const fonts = settings.fonts || { heading: 'Inter', body: 'Inter' };
    const colors = settings.colors || { primary: '#3b82f6', secondary: '#64748b', accent: '#8b5cf6' };

    let frameworkCSS = '';
    let frameworkJS = '';

    if (framework === 'tailwind') {
        frameworkCSS = '<script src="https://cdn.tailwindcss.com"></script>';
    } else if (framework === 'bootstrap') {
        frameworkCSS = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">';
        frameworkJS = '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>';
    }

    const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${projectName}</title>
    <meta name="description" content="${projectName} - WebCraft Studio ile oluşturuldu">
    <meta name="keywords" content="web, site, ${projectName}">
    <meta name="author" content="WebCraft Studio">
    
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="${projectName}">
    <meta property="og:description" content="${projectName} - WebCraft Studio ile oluşturuldu">
    <meta property="og:type" content="website">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${fonts.heading.replace(' ', '+')}:wght@400;500;600;700&family=${fonts.body.replace(' ', '+')}:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- Framework CSS -->
    ${frameworkCSS}
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
</head>
<body>
    <!-- ============================================
         WebCraft Studio Generated Code
         Project: ${projectName}
         Generated: ${new Date().toLocaleDateString('tr-TR')}
         ============================================ -->
    
${generateComponentsHTML(components, framework)}
    
    <!-- Framework JS -->
    ${frameworkJS}
    
    <!-- Custom Scripts -->
    <script src="script.js"></script>
</body>
</html>`;

    return html;
}

// Generate components HTML based on content
function generateComponentsHTML(components, framework) {
    if (!components || components.length === 0) {
        return generateDefaultLayout(framework);
    }

    let html = '';

    components.forEach((component, index) => {
        html += `    <!-- ${component.type || 'Section'} Component -->\n`;
        html += generateComponentHTML(component, framework);
        html += '\n';
    });

    return html;
}

// Generate single component HTML
function generateComponentHTML(component, framework) {
    const type = component.type || 'section';

    switch (type) {
        case 'header':
            return generateHeaderHTML(component, framework);
        case 'hero':
            return generateHeroHTML(component, framework);
        case 'features':
            return generateFeaturesHTML(component, framework);
        case 'about':
            return generateAboutHTML(component, framework);
        case 'services':
            return generateServicesHTML(component, framework);
        case 'testimonials':
            return generateTestimonialsHTML(component, framework);
        case 'pricing':
            return generatePricingHTML(component, framework);
        case 'contact':
            return generateContactHTML(component, framework);
        case 'footer':
            return generateFooterHTML(component, framework);
        default:
            return generateGenericSection(component, framework);
    }
}

// Generate default layout if no components
function generateDefaultLayout(framework) {
    const tw = framework === 'tailwind';

    return `    <!-- Header -->
    <header ${tw ? 'class="bg-white shadow-sm sticky top-0 z-50"' : 'class="header"'}>
        <nav ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="nav-container"'}>
            <div ${tw ? 'class="flex justify-between items-center h-16"' : 'class="nav-wrapper"'}>
                <div ${tw ? 'class="flex-shrink-0"' : 'class="logo"'}>
                    <a href="#" ${tw ? 'class="text-2xl font-bold text-blue-600"' : 'class="logo-link"'}>Logo</a>
                </div>
                <div ${tw ? 'class="hidden md:flex space-x-8"' : 'class="nav-links"'}>
                    <a href="#" ${tw ? 'class="text-gray-700 hover:text-blue-600 transition"' : 'class="nav-link"'}>Ana Sayfa</a>
                    <a href="#about" ${tw ? 'class="text-gray-700 hover:text-blue-600 transition"' : 'class="nav-link"'}>Hakkımızda</a>
                    <a href="#services" ${tw ? 'class="text-gray-700 hover:text-blue-600 transition"' : 'class="nav-link"'}>Hizmetler</a>
                    <a href="#contact" ${tw ? 'class="text-gray-700 hover:text-blue-600 transition"' : 'class="nav-link"'}>İletişim</a>
                </div>
                <button ${tw ? 'class="md:hidden p-2"' : 'class="mobile-menu-btn"'} id="mobile-menu-btn">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section ${tw ? 'class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 lg:py-32"' : 'class="hero"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"' : 'class="hero-container"'}>
            <h1 ${tw ? 'class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"' : 'class="hero-title"'}>
                Web Sitenize Hoş Geldiniz
            </h1>
            <p ${tw ? 'class="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"' : 'class="hero-subtitle"'}>
                Modern ve profesyonel web çözümleri ile işletmenizi dijital dünyaya taşıyın.
            </p>
            <div ${tw ? 'class="flex flex-col sm:flex-row gap-4 justify-center"' : 'class="hero-buttons"'}>
                <a href="#contact" ${tw ? 'class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"' : 'class="btn btn-primary"'}>
                    Hemen Başlayın
                </a>
                <a href="#about" ${tw ? 'class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"' : 'class="btn btn-secondary"'}>
                    Daha Fazla Bilgi
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" ${tw ? 'class="py-20 bg-gray-50"' : 'class="about-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <div ${tw ? 'class="text-center mb-16"' : 'class="section-header"'}>
                <h2 ${tw ? 'class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"' : 'class="section-title"'}>Hakkımızda</h2>
                <p ${tw ? 'class="text-lg text-gray-600 max-w-2xl mx-auto"' : 'class="section-subtitle"'}>
                    Biz, modern web teknolojileri ile işletmelere dijital çözümler sunuyoruz.
                </p>
            </div>
            <div ${tw ? 'class="grid md:grid-cols-2 gap-12 items-center"' : 'class="about-grid"'}>
                <div>
                    <img src="https://via.placeholder.com/600x400" alt="Hakkımızda" ${tw ? 'class="rounded-lg shadow-lg"' : 'class="about-image"'}>
                </div>
                <div>
                    <h3 ${tw ? 'class="text-2xl font-bold text-gray-900 mb-4"' : 'class="about-title"'}>Neden Bizi Tercih Etmelisiniz?</h3>
                    <p ${tw ? 'class="text-gray-600 mb-6"' : 'class="about-text"'}>
                        Yılların deneyimi ve uzman ekibimiz ile projelerinizi hayata geçiriyoruz. 
                        Müşteri memnuniyeti bizim için en önemli önceliktir.
                    </p>
                    <ul ${tw ? 'class="space-y-3"' : 'class="about-list"'}>
                        <li ${tw ? 'class="flex items-center text-gray-700"' : 'class="about-list-item"'}>
                            <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            Profesyonel ekip
                        </li>
                        <li ${tw ? 'class="flex items-center text-gray-700"' : 'class="about-list-item"'}>
                            <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            7/24 Destek
                        </li>
                        <li ${tw ? 'class="flex items-center text-gray-700"' : 'class="about-list-item"'}>
                            <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            Uygun fiyatlar
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" ${tw ? 'class="py-20"' : 'class="services-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <div ${tw ? 'class="text-center mb-16"' : 'class="section-header"'}>
                <h2 ${tw ? 'class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"' : 'class="section-title"'}>Hizmetlerimiz</h2>
                <p ${tw ? 'class="text-lg text-gray-600 max-w-2xl mx-auto"' : 'class="section-subtitle"'}>
                    Geniş hizmet yelpazemiz ile tüm ihtiyaçlarınızı karşılıyoruz.
                </p>
            </div>
            <div ${tw ? 'class="grid md:grid-cols-3 gap-8"' : 'class="services-grid"'}>
                <div ${tw ? 'class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"' : 'class="service-card"'}>
                    <div ${tw ? 'class="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6"' : 'class="service-icon"'}>
                        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <h3 ${tw ? 'class="text-xl font-bold text-gray-900 mb-3"' : 'class="service-title"'}>Web Tasarım</h3>
                    <p ${tw ? 'class="text-gray-600"' : 'class="service-text"'}>
                        Modern ve responsive web siteleri tasarlıyoruz.
                    </p>
                </div>
                <div ${tw ? 'class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"' : 'class="service-card"'}>
                    <div ${tw ? 'class="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6"' : 'class="service-icon"'}>
                        <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                        </svg>
                    </div>
                    <h3 ${tw ? 'class="text-xl font-bold text-gray-900 mb-3"' : 'class="service-title"'}>Web Geliştirme</h3>
                    <p ${tw ? 'class="text-gray-600"' : 'class="service-text"'}>
                        Güçlü ve ölçeklenebilir web uygulamaları geliştiriyoruz.
                    </p>
                </div>
                <div ${tw ? 'class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"' : 'class="service-card"'}>
                    <div ${tw ? 'class="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6"' : 'class="service-icon"'}>
                        <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <h3 ${tw ? 'class="text-xl font-bold text-gray-900 mb-3"' : 'class="service-title"'}>SEO Optimizasyon</h3>
                    <p ${tw ? 'class="text-gray-600"' : 'class="service-text"'}>
                        Arama motorlarında üst sıralara çıkmanızı sağlıyoruz.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" ${tw ? 'class="py-20 bg-gray-900 text-white"' : 'class="contact-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <div ${tw ? 'class="text-center mb-16"' : 'class="section-header"'}>
                <h2 ${tw ? 'class="text-3xl md:text-4xl font-bold mb-4"' : 'class="section-title"'}>İletişim</h2>
                <p ${tw ? 'class="text-lg text-gray-400 max-w-2xl mx-auto"' : 'class="section-subtitle"'}>
                    Projeleriniz için bizimle iletişime geçin.
                </p>
            </div>
            <div ${tw ? 'class="max-w-xl mx-auto"' : 'class="contact-form-container"'}>
                <form id="contact-form" ${tw ? 'class="space-y-6"' : 'class="contact-form"'}>
                    <div>
                        <label ${tw ? 'class="block text-sm font-medium mb-2"' : 'class="form-label"'}>Adınız</label>
                        <input type="text" name="name" required ${tw ? 'class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"' : 'class="form-input"'} placeholder="Adınızı girin">
                    </div>
                    <div>
                        <label ${tw ? 'class="block text-sm font-medium mb-2"' : 'class="form-label"'}>E-posta</label>
                        <input type="email" name="email" required ${tw ? 'class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"' : 'class="form-input"'} placeholder="E-posta adresinizi girin">
                    </div>
                    <div>
                        <label ${tw ? 'class="block text-sm font-medium mb-2"' : 'class="form-label"'}>Mesajınız</label>
                        <textarea name="message" rows="5" required ${tw ? 'class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"' : 'class="form-textarea"'} placeholder="Mesajınızı yazın"></textarea>
                    </div>
                    <button type="submit" ${tw ? 'class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"' : 'class="btn btn-submit"'}>
                        Gönder
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer ${tw ? 'class="bg-gray-950 text-gray-400 py-12"' : 'class="footer"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <div ${tw ? 'class="grid md:grid-cols-4 gap-8"' : 'class="footer-grid"'}>
                <div>
                    <h3 ${tw ? 'class="text-white text-xl font-bold mb-4"' : 'class="footer-title"'}>Logo</h3>
                    <p ${tw ? 'class="text-sm"' : 'class="footer-text"'}>
                        Modern web çözümleri ile işletmenizi dijital dünyaya taşıyoruz.
                    </p>
                </div>
                <div>
                    <h4 ${tw ? 'class="text-white font-semibold mb-4"' : 'class="footer-heading"'}>Hızlı Linkler</h4>
                    <ul ${tw ? 'class="space-y-2 text-sm"' : 'class="footer-links"'}>
                        <li><a href="#" ${tw ? 'class="hover:text-white transition"' : 'class="footer-link"'}>Ana Sayfa</a></li>
                        <li><a href="#about" ${tw ? 'class="hover:text-white transition"' : 'class="footer-link"'}>Hakkımızda</a></li>
                        <li><a href="#services" ${tw ? 'class="hover:text-white transition"' : 'class="footer-link"'}>Hizmetler</a></li>
                        <li><a href="#contact" ${tw ? 'class="hover:text-white transition"' : 'class="footer-link"'}>İletişim</a></li>
                    </ul>
                </div>
                <div>
                    <h4 ${tw ? 'class="text-white font-semibold mb-4"' : 'class="footer-heading"'}>İletişim</h4>
                    <ul ${tw ? 'class="space-y-2 text-sm"' : 'class="footer-contact"'}>
                        <li>info@example.com</li>
                        <li>+90 555 123 4567</li>
                        <li>İstanbul, Türkiye</li>
                    </ul>
                </div>
                <div>
                    <h4 ${tw ? 'class="text-white font-semibold mb-4"' : 'class="footer-heading"'}>Sosyal Medya</h4>
                    <div ${tw ? 'class="flex space-x-4"' : 'class="social-links"'}>
                        <a href="#" ${tw ? 'class="hover:text-white transition"' : 'class="social-link"'}>Facebook</a>
                        <a href="#" ${tw ? 'class="hover:text-white transition"' : 'class="social-link"'}>Twitter</a>
                        <a href="#" ${tw ? 'class="hover:text-white transition"' : 'class="social-link"'}>Instagram</a>
                    </div>
                </div>
            </div>
            <div ${tw ? 'class="border-t border-gray-800 mt-12 pt-8 text-center text-sm"' : 'class="footer-bottom"'}>
                <p>&copy; ${new Date().getFullYear()} Tüm hakları saklıdır. WebCraft Studio ile oluşturuldu.</p>
            </div>
        </div>
    </footer>`;
}

// Component generators
function generateHeaderHTML(component, framework) {
    const tw = framework === 'tailwind';
    const data = component.data || {};

    return `    <header ${tw ? 'class="bg-white shadow-sm sticky top-0 z-50"' : 'class="header"'}>
        <nav ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="nav-container"'}>
            <div ${tw ? 'class="flex justify-between items-center h-16"' : 'class="nav-wrapper"'}>
                <a href="#" ${tw ? 'class="text-2xl font-bold text-blue-600"' : 'class="logo-link"'}>${data.logo || 'Logo'}</a>
                <div ${tw ? 'class="hidden md:flex space-x-8"' : 'class="nav-links"'}>
                    ${(data.links || ['Ana Sayfa', 'Hakkımızda', 'Hizmetler', 'İletişim']).map(link =>
        `<a href="#" ${tw ? 'class="text-gray-700 hover:text-blue-600 transition"' : 'class="nav-link"'}>${link}</a>`
    ).join('\n                    ')}
                </div>
            </div>
        </nav>
    </header>`;
}

function generateHeroHTML(component, framework) {
    const tw = framework === 'tailwind';
    const data = component.data || {};

    return `    <section ${tw ? 'class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 lg:py-32"' : 'class="hero"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"' : 'class="hero-container"'}>
            <h1 ${tw ? 'class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"' : 'class="hero-title"'}>
                ${data.title || 'Hoş Geldiniz'}
            </h1>
            <p ${tw ? 'class="text-xl md:text-2xl mb-8 opacity-90"' : 'class="hero-subtitle"'}>
                ${data.subtitle || 'Alt başlık metni buraya gelecek'}
            </p>
            <a href="#" ${tw ? 'class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"' : 'class="btn btn-primary"'}>
                ${data.cta || 'Hemen Başlayın'}
            </a>
        </div>
    </section>`;
}

function generateFeaturesHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20"' : 'class="features-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>Özellikler</h2>
            <div ${tw ? 'class="grid md:grid-cols-3 gap-8"' : 'class="features-grid"'}>
                <!-- Feature cards here -->
            </div>
        </div>
    </section>`;
}

function generateAboutHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20 bg-gray-50"' : 'class="about-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>Hakkımızda</h2>
        </div>
    </section>`;
}

function generateServicesHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20"' : 'class="services-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>Hizmetlerimiz</h2>
        </div>
    </section>`;
}

function generateTestimonialsHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20 bg-gray-50"' : 'class="testimonials-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>Müşteri Yorumları</h2>
        </div>
    </section>`;
}

function generatePricingHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20"' : 'class="pricing-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>Fiyatlandırma</h2>
        </div>
    </section>`;
}

function generateContactHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20 bg-gray-900 text-white"' : 'class="contact-section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>İletişim</h2>
        </div>
    </section>`;
}

function generateFooterHTML(component, framework) {
    const tw = framework === 'tailwind';
    return `    <footer ${tw ? 'class="bg-gray-950 text-gray-400 py-12"' : 'class="footer"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"' : 'class="container"'}>
            <p>&copy; ${new Date().getFullYear()} Tüm hakları saklıdır.</p>
        </div>
    </footer>`;
}

function generateGenericSection(component, framework) {
    const tw = framework === 'tailwind';
    return `    <section ${tw ? 'class="py-20"' : 'class="section"'}>
        <div ${tw ? 'class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"' : 'class="container"'}>
            <h2 ${tw ? 'class="text-3xl font-bold text-center mb-12"' : 'class="section-title"'}>${component.title || 'Bölüm'}</h2>
        </div>
    </section>`;
}

// Generate CSS
function generateCSS(content, settings, framework) {
    const colors = settings.colors || { primary: '#3b82f6', secondary: '#64748b', accent: '#8b5cf6' };
    const fonts = settings.fonts || { heading: 'Inter', body: 'Inter' };

    const css = `/**
 * WebCraft Studio Generated Styles
 * ================================
 * 
 * Bu CSS dosyası WebCraft Studio tarafından otomatik olarak oluşturulmuştur.
 * Özelleştirmeler için aşağıdaki değişkenleri düzenleyebilirsiniz.
 */

/* ============================================
   CSS Variables (Değişkenler)
   ============================================ */
:root {
    /* Renkler */
    --color-primary: ${colors.primary};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    --color-background: ${colors.background || '#ffffff'};
    --color-text: #1f2937;
    --color-text-light: #6b7280;
    
    /* Fontlar */
    --font-heading: '${fonts.heading}', sans-serif;
    --font-body: '${fonts.body}', sans-serif;
    
    /* Boyutlar */
    --max-width: 1280px;
    --border-radius: 0.5rem;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    /* Geçişler */
    --transition: all 0.3s ease;
}

/* ============================================
   Reset & Base Styles
   ============================================ */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-body);
    color: var(--color-text);
    background-color: var(--color-background);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    line-height: 1.2;
}

a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition);
}

a:hover {
    color: var(--color-accent);
}

img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* ============================================
   Utility Classes (Vanilla CSS için)
   ============================================ */
.container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1rem;
}

.section-title {
    font-size: 2.25rem;
    color: var(--color-text);
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-light);
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    border-radius: var(--border-radius);
    transition: var(--transition);
    cursor: pointer;
    border: none;
}

.btn-primary {
    background-color: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--color-accent);
    color: white;
}

.btn-secondary {
    background-color: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
}

.btn-secondary:hover {
    background-color: var(--color-primary);
    color: white;
}

/* ============================================
   Header Styles
   ============================================ */
.header {
    background: white;
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1rem;
}

.nav-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
}

.logo-link {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: var(--color-text);
    font-weight: 500;
}

.nav-link:hover {
    color: var(--color-primary);
}

/* ============================================
   Hero Section
   ============================================ */
.hero {
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    color: white;
    padding: 5rem 1rem;
}

.hero-container {
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1.5rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* ============================================
   Section Styles
   ============================================ */
.about-section,
.services-section,
.features-section,
.testimonials-section,
.pricing-section {
    padding: 5rem 1rem;
}

.section-header {
    text-align: center;
    margin-bottom: 4rem;
}

/* ============================================
   Cards
   ============================================ */
.service-card,
.feature-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.service-card:hover,
.feature-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-5px);
}

.service-icon {
    width: 3.5rem;
    height: 3.5rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.service-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
}

.service-text {
    color: var(--color-text-light);
}

/* ============================================
   Contact Section
   ============================================ */
.contact-section {
    background: #111827;
    color: white;
    padding: 5rem 1rem;
}

.contact-form-container {
    max-width: 600px;
    margin: 0 auto;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: var(--border-radius);
    color: white;
    font-family: inherit;
    transition: var(--transition);
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.form-textarea {
    resize: none;
}

.btn-submit {
    background: var(--color-primary);
    color: white;
    width: 100%;
}

.btn-submit:hover {
    background: var(--color-accent);
}

/* ============================================
   Footer
   ============================================ */
.footer {
    background: #030712;
    color: #9ca3af;
    padding: 3rem 1rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    max-width: var(--max-width);
    margin: 0 auto;
}

.footer-title {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

.footer-heading {
    color: white;
    font-weight: 600;
    margin-bottom: 1rem;
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 0.5rem;
}

.footer-link {
    color: #9ca3af;
}

.footer-link:hover {
    color: white;
}

.footer-bottom {
    border-top: 1px solid #1f2937;
    margin-top: 3rem;
    padding-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-link {
    color: #9ca3af;
}

.social-link:hover {
    color: white;
}

/* ============================================
   Responsive Design
   ============================================ */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .mobile-menu-btn {
        display: block;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .section-title {
        font-size: 1.75rem;
    }
    
    .about-grid,
    .services-grid,
    .features-grid {
        grid-template-columns: 1fr;
    }
}

/* ============================================
   Animations
   ============================================ */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.6s ease forwards;
}

/* ============================================
   Print Styles
   ============================================ */
@media print {
    .header,
    .footer {
        display: none;
    }
    
    body {
        color: black;
        background: white;
    }
}
`;

    return css;
}

// Generate JavaScript
function generateJS(content, settings) {
    const js = `/**
 * WebCraft Studio Generated JavaScript
 * ====================================
 * 
 * Bu JavaScript dosyası WebCraft Studio tarafından otomatik olarak oluşturulmuştur.
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 WebCraft Studio - Site yüklendi');
    
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Geçerli bir e-posta adresi girin.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            form.reset();
            
            // In production, send to server:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        });
    }
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = \`
        <span>\${message}</span>
        <button class="notification-close">&times;</button>
    \`;
    
    // Add styles
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    \`;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = \`
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        \`;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Scroll Animations
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('section, .service-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Sticky Header Shadow on Scroll
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

/**
 * Utility: Debounce Function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        isValidEmail,
        debounce
    };
}
`;

    return js;
}

module.exports = {
    generateHTML,
    generateCSS,
    generateJS
};
