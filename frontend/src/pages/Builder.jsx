import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useBuilderStore } from '../store/builderStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    ArrowLeft,
    Save,
    Download,
    Eye,
    Monitor,
    Tablet,
    Smartphone,
    Undo2,
    Redo2,
    PanelLeft,
    PanelRight,
    Settings,
    Loader2,
    Coins,
    Layout,
    Type,
    Image,
    Box,
    FileText,
    Users,
    Star,
    MessageSquare,
    Mail,
    Menu,
    X,
    // New icons for expanded component library
    Code,
    Table,
    AlignLeft,
    Quote,
    ListOrdered,
    ChevronDown,
    Columns,
    MoreHorizontal,
    Play,
    Music,
    FileDown,
    Boxes,
    Grid,
    Layers,
    SeparatorHorizontal,
    PanelTop,
    Calendar,
    Search,
    Share2,
    Archive,
    List,
    FileCode,
    ShoppingCart,
    ShoppingBag,
    Tag,
    Clock,
    Percent,
    CreditCard,
    Youtube,
    Twitter,
    Instagram,
    MapPin,
    ExternalLink,
    FormInput,
    Send,
    Heart,
    Bookmark,
    Globe,
    Video,
    Mic,
    Film,
    Award,
    Zap,
    Target,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Sparkles,
    Palette,
    Brush,
    Wand2,
    ChevronRight
} from 'lucide-react';


// Component categories for organized sidebar
const COMPONENT_CATEGORIES = [
    { id: 'layout', label: 'Düzen', icon: Layout, color: 'text-blue-400' },
    { id: 'sections', label: 'Bölümler', icon: Box, color: 'text-purple-400' },
    { id: 'content', label: 'İçerik', icon: Type, color: 'text-amber-400' },
    { id: 'media', label: 'Medya', icon: Image, color: 'text-green-400' },
    { id: 'widgets', label: 'Widgetlar', icon: Settings, color: 'text-cyan-400' },
    { id: 'commerce', label: 'E-Ticaret', icon: ShoppingCart, color: 'text-pink-400' },
    { id: 'forms', label: 'Formlar', icon: FormInput, color: 'text-teal-400' }
];

// Component types for the builder - WordPress style (72 components)
const COMPONENT_TYPES = [
    // ═══════════════════════════════════════════════════════════════
    // LAYOUT (8 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'header', label: 'Header', icon: Layout, category: 'layout' },
    { type: 'footer', label: 'Footer', icon: Layout, category: 'layout' },
    { type: 'divider', label: 'Ayırıcı', icon: SeparatorHorizontal, category: 'layout' },
    { type: 'spacer', label: 'Boşluk', icon: Box, category: 'layout' },
    { type: 'container', label: 'Container', icon: Boxes, category: 'layout' },
    { type: 'columns', label: 'Sütunlar', icon: Columns, category: 'layout' },


    // ═══════════════════════════════════════════════════════════════
    // SECTIONS (15 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'hero', label: 'Hero Section', icon: Sparkles, category: 'sections' },
    { type: 'cta', label: 'CTA (Aksiyon)', icon: Target, category: 'sections' },
    { type: 'banner', label: 'Banner', icon: Award, category: 'sections' },
    { type: 'about', label: 'Hakkımızda', icon: FileText, category: 'sections' },
    { type: 'features', label: 'Özellikler', icon: Star, category: 'sections' },
    { type: 'services', label: 'Hizmetler', icon: Zap, category: 'sections' },
    { type: 'stats', label: 'İstatistikler', icon: BarChart3, category: 'sections' },
    { type: 'timeline', label: 'Zaman Çizelgesi', icon: Activity, category: 'sections' },
    { type: 'faq', label: 'SSS', icon: MessageSquare, category: 'sections' },
    { type: 'team', label: 'Ekip', icon: Users, category: 'sections' },
    { type: 'testimonials', label: 'Yorumlar', icon: Quote, category: 'sections' },
    { type: 'clients', label: 'Müşteriler/Logolar', icon: Heart, category: 'sections' },
    { type: 'blog', label: 'Blog Yazıları', icon: FileText, category: 'sections' },
    { type: 'portfolio', label: 'Portfolyo', icon: Palette, category: 'sections' },


    // ═══════════════════════════════════════════════════════════════
    // CONTENT (13 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'text', label: 'Metin Bloğu', icon: AlignLeft, category: 'content' },
    { type: 'heading', label: 'Başlık', icon: Type, category: 'content' },
    { type: 'button', label: 'Buton', icon: Box, category: 'content' },
    { type: 'list', label: 'Liste', icon: List, category: 'content' },
    { type: 'quote', label: 'Alıntı', icon: Quote, category: 'content' },
    { type: 'code', label: 'Kod Bloğu', icon: Code, category: 'content' },

    // ═══════════════════════════════════════════════════════════════
    // MEDIA (10 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'image', label: 'Resim', icon: Image, category: 'media' },
    { type: 'gallery', label: 'Galeri', icon: Grid, category: 'media' },
    { type: 'video', label: 'Video', icon: Video, category: 'media' },
    { type: 'slider', label: 'Slider', icon: Film, category: 'media' },
    { type: 'mediatext', label: 'Medya + Metin', icon: Columns, category: 'media' },
    { type: 'audio', label: 'Ses Oynatıcı', icon: Music, category: 'media' },
    { type: 'file', label: 'Dosya İndirme', icon: FileDown, category: 'media' },
    { type: 'iconbox', label: 'İkon Kutusu', icon: Boxes, category: 'media' },

    // ═══════════════════════════════════════════════════════════════
    // WIDGETS (8 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'search', label: 'Arama Kutusu', icon: Search, category: 'widgets' },
    { type: 'socialicons', label: 'Sosyal İkonlar', icon: Share2, category: 'widgets' },
    { type: 'calendar', label: 'Takvim', icon: Calendar, category: 'widgets' },
    { type: 'archives', label: 'Arşivler', icon: Archive, category: 'widgets' },
    { type: 'categories', label: 'Kategoriler', icon: List, category: 'widgets' },
    { type: 'latestposts', label: 'Son Yazılar', icon: FileText, category: 'widgets' },
    { type: 'customhtml', label: 'Özel HTML', icon: FileCode, category: 'widgets' },
    { type: 'weather', label: 'Hava Durumu', icon: Globe, category: 'widgets' },

    // ═══════════════════════════════════════════════════════════════
    // E-COMMERCE (8 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'pricing', label: 'Fiyatlandırma', icon: Coins, category: 'commerce' },
    { type: 'products', label: 'Ürünler', icon: ShoppingBag, category: 'commerce' },
    { type: 'productcard', label: 'Ürün Kartı', icon: ShoppingCart, category: 'commerce' },
    { type: 'productgrid', label: 'Ürün Grid', icon: Grid, category: 'commerce' },
    { type: 'cartbutton', label: 'Sepet Butonu', icon: ShoppingCart, category: 'commerce' },
    { type: 'pricedisplay', label: 'Fiyat Göster', icon: Tag, category: 'commerce' },
    { type: 'salebadge', label: 'İndirim Rozeti', icon: Percent, category: 'commerce' },
    { type: 'countdown', label: 'Geri Sayım', icon: Clock, category: 'commerce' },


    // ═══════════════════════════════════════════════════════════════
    // FORMS (4 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'contact', label: 'İletişim Formu', icon: Mail, category: 'forms' },
    { type: 'newsletter', label: 'Bülten Formu', icon: Send, category: 'forms' },
    { type: 'map', label: 'Harita', icon: MapPin, category: 'forms' },
    { type: 'loginform', label: 'Giriş Formu', icon: FormInput, category: 'forms' },
];


// Pre-built color themes
const COLOR_THEMES = [
    {
        id: 'modern-blue',
        name: 'Modern Mavi',
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
        bg: '#ffffff',
        text: '#1f2937'
    },
    {
        id: 'elegant-purple',
        name: 'Zarif Mor',
        primary: '#8b5cf6',
        secondary: '#6d28d9',
        accent: '#a78bfa',
        bg: '#faf5ff',
        text: '#1f2937'
    },
    {
        id: 'fresh-green',
        name: 'Taze Yeşil',
        primary: '#22c55e',
        secondary: '#15803d',
        accent: '#4ade80',
        bg: '#f0fdf4',
        text: '#1f2937'
    },
    {
        id: 'warm-orange',
        name: 'Sıcak Turuncu',
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        bg: '#fff7ed',
        text: '#1f2937'
    },
    {
        id: 'professional-dark',
        name: 'Profesyonel Koyu',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#818cf8',
        bg: '#0f172a',
        text: '#f1f5f9'
    },
    {
        id: 'minimal-gray',
        name: 'Minimal Gri',
        primary: '#6b7280',
        secondary: '#374151',
        accent: '#9ca3af',
        bg: '#f9fafb',
        text: '#111827'
    },
    {
        id: 'rose-gold',
        name: 'Altın Gül',
        primary: '#f43f5e',
        secondary: '#be123c',
        accent: '#fda4af',
        bg: '#fff1f2',
        text: '#1f2937'
    },
    {
        id: 'ocean-teal',
        name: 'Okyanus',
        primary: '#14b8a6',
        secondary: '#0d9488',
        accent: '#5eead4',
        bg: '#f0fdfa',
        text: '#1f2937'
    },
];


const Builder = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user, updateCredits } = useAuthStore();
    const { fetchProject, updateProject, currentProject } = useProjectStore();
    const {
        components,
        setComponents,
        addComponent,
        updateComponent,
        deleteComponent,
        moveComponent,
        selectedComponent,
        selectComponent,
        clearSelection,
        previewMode,
        setPreviewMode,
        showComponentPanel,
        showPropertyPanel,
        toggleComponentPanel,
        togglePropertyPanel,
        undo,
        redo,
        canUndo,
        canRedo,
        hasUnsavedChanges,
        isSaving,
        setSaving,
        markAsSaved,
        initializeFromProject,
        reset
    } = useBuilderStore();

    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadProject();
        return () => reset();
    }, [projectId]);

    const loadProject = async () => {
        try {
            const project = await fetchProject(projectId);
            initializeFromProject(project);
        } catch (error) {
            toast.error('Proje yüklenemedi');
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = useCallback(async () => {
        if (!currentProject) return;

        setSaving(true);
        try {
            await updateProject(projectId, {
                content: { components }
            });
            markAsSaved();
            toast.success('Proje kaydedildi!');
        } catch (error) {
            toast.error('Kaydetme başarısız');
        } finally {
            setSaving(false);
        }
    }, [components, projectId, currentProject]);

    const handleExport = async (framework = 'tailwind') => {
        if (user.credits < 200) {
            toast.error('Yetersiz kredi! Export için 200 kredi gerekli.');
            setShowExportModal(false);
            return;
        }

        setIsExporting(true);
        try {
            // First save the project
            await updateProject(projectId, { content: { components } });

            // Then export
            const response = await api.post(`/export/${projectId}`, { framework }, {
                responseType: 'blob'
            });

            // Download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${currentProject.name.replace(/[^a-z0-9]/gi, '_')}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            // Update credits
            updateCredits(user.credits - 200);
            toast.success('Proje başarıyla export edildi!');
            setShowExportModal(false);
        } catch (error) {
            toast.error(error.message || 'Export başarısız');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // If dragging from component panel to canvas
        if (active.id.startsWith('panel-')) {
            const componentType = active.id.replace('panel-', '');
            const newComponent = {
                id: `${componentType}-${Date.now()}`,
                type: componentType,
                data: getDefaultComponentData(componentType)
            };
            addComponent(newComponent);
            return;
        }

        // If reordering within canvas
        if (active.id !== over.id) {
            const oldIndex = components.findIndex(c => c.id === active.id);
            const newIndex = components.findIndex(c => c.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                setComponents(arrayMove(components, oldIndex, newIndex));
            }
        }
    };


    const getDefaultComponentData = (type) => {
        const defaults = {
            // Layout
            header: {
                logo: 'WebBuilder',
                links: ['Ana Sayfa', 'Hakkımızda', 'Hizmetler', 'Ürünler', 'Blog', 'İletişim'],
                bgColor: '#ffffff',
                sticky: true
            },
            footer: {
                copyright: '© 2024 WebBuilder Plus. Tüm hakları saklıdır.',
                links: ['Gizlilik', 'Kullanım Şartları', 'İletişim'],
                facebook: '#', twitter: '#', instagram: '#', linkedin: '#'
            },
            divider: { style: 'line', color: '#e5e7eb' },
            spacer: { height: 60 },

            // Hero & CTA
            hero: {
                title: 'Dijital Dünyada Fark Yaratın',
                subtitle: 'Modern ve etkileyici web siteleri ile işletmenizi bir üst seviyeye taşıyın. Profesyonel tasarım, hızlı geliştirme.',
                cta: 'Ücretsiz Başlayın',
                ctaLink: '#',
                secondaryCta: 'Daha Fazla Bilgi',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                gradientStart: '#3b82f6',
                gradientEnd: '#8b5cf6'
            },
            cta: {
                title: 'Projenizi Hayata Geçirmeye Hazır mısınız?',
                subtitle: 'Hemen iletişime geçin ve ücretsiz danışmanlık alın.',
                buttonText: 'Bize Ulaşın',
                buttonLink: '#contact',
                bgColor: '#3b82f6'
            },
            banner: {
                text: '🎉 Yeni yıl kampanyası! Tüm planlarda %30 indirim',
                buttonText: 'İncele',
                bgColor: '#f59e0b'
            },

            // Content Sections
            about: {
                title: 'Hakkımızda',
                subtitle: 'Biz Kimiz?',
                content: '10 yılı aşkın deneyimimizle, işletmelerin dijital dönüşümüne öncülük ediyoruz. Müşteri odaklı yaklaşımımız ve yenilikçi çözümlerimizle sektörde fark yaratıyoruz.',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
                stats: [
                    { value: '500+', label: 'Mutlu Müşteri' },
                    { value: '1000+', label: 'Tamamlanan Proje' },
                    { value: '10+', label: 'Yıllık Deneyim' }
                ]
            },
            features: {
                title: 'Özelliklerimiz',
                subtitle: 'Neden bizi seçmelisiniz?',
                items: [
                    { title: 'Hızlı Geliştirme', description: 'Projelerinizi hızla hayata geçiriyoruz', icon: '⚡' },
                    { title: 'Modern Tasarım', description: 'Trend tasarımlarla öne çıkın', icon: '🎨' },
                    { title: '7/24 Destek', description: 'Her zaman yanınızdayız', icon: '💬' },
                    { title: 'SEO Optimizasyonu', description: 'Arama motorlarında üst sıralara çıkın', icon: '📈' },
                    { title: 'Mobil Uyumlu', description: 'Tüm cihazlarda mükemmel görünüm', icon: '📱' },
                    { title: 'Güvenli Altyapı', description: 'SSL ve güvenlik sertifikaları', icon: '🔒' }
                ]
            },
            services: {
                title: 'Hizmetlerimiz',
                subtitle: 'Size nasıl yardımcı olabiliriz?',
                items: [
                    { title: 'Web Tasarım', description: 'Özel tasarım web siteleri', price: '₺5.000\'den başlayan', icon: '🌐' },
                    { title: 'E-Ticaret', description: 'Online mağaza çözümleri', price: '₺10.000\'den başlayan', icon: '🛒' },
                    { title: 'Mobil Uygulama', description: 'iOS ve Android uygulamalar', price: '₺15.000\'den başlayan', icon: '📱' },
                    { title: 'SEO Danışmanlık', description: 'Arama motoru optimizasyonu', price: '₺2.000/ay', icon: '📊' }
                ]
            },
            stats: {
                title: 'Rakamlarla Biz',
                items: [
                    { value: '500+', label: 'Mutlu Müşteri' },
                    { value: '1.200+', label: 'Tamamlanan Proje' },
                    { value: '50+', label: 'Ekip Üyesi' },
                    { value: '15+', label: 'Ödül' }
                ]
            },
            timeline: {
                title: 'Tarihçemiz',
                items: [
                    { year: '2015', title: 'Kuruluş', description: 'Şirketimiz küçük bir ekiple kuruldu' },
                    { year: '2017', title: 'Büyüme', description: 'İlk 100 müşterimize ulaştık' },
                    { year: '2020', title: 'Genişleme', description: 'Uluslararası pazarlara açıldık' },
                    { year: '2024', title: 'Liderlik', description: 'Sektör lideri konumuna geldik' }
                ]
            },
            faq: {
                title: 'Sıkça Sorulan Sorular',
                items: [
                    { question: 'Proje süreci nasıl işliyor?', answer: 'İhtiyaç analizi, tasarım, geliştirme ve test aşamalarından oluşur. Her aşamada sizinle iletişim halindeyiz.' },
                    { question: 'Ödeme koşulları nelerdir?', answer: '%50 başlangıç, %50 teslimatta ödeme yapabilirsiniz. Taksit seçenekleri mevcuttur.' },
                    { question: 'Destek hizmeti var mı?', answer: 'Evet, 7/24 teknik destek ve 1 yıl ücretsiz bakım hizmeti sunuyoruz.' },
                    { question: 'Revizyon hakkı var mı?', answer: 'Her projede 3 ücretsiz revizyon hakkınız bulunmaktadır.' }
                ]
            },

            // Team & Social
            team: {
                title: 'Ekibimiz',
                subtitle: 'Başarının arkasındaki ekip',
                members: [
                    { name: 'Ahmet Yılmaz', role: 'Kurucu & CEO', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
                    { name: 'Elif Demir', role: 'Tasarım Direktörü', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
                    { name: 'Mehmet Kaya', role: 'Baş Geliştirici', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
                    { name: 'Zeynep Aksoy', role: 'Proje Müdürü', image: 'https://randomuser.me/api/portraits/women/4.jpg' }
                ]
            },
            testimonials: {
                title: 'Müşteri Yorumları',
                subtitle: 'Müşterilerimiz ne diyor?',
                items: [
                    { name: 'Ali Öztürk', company: 'ABC Şirketi', text: 'Harika bir ekip! Projemizi zamanında ve mükemmel bir şekilde teslim ettiler.', rating: 5, image: 'https://randomuser.me/api/portraits/men/10.jpg' },
                    { name: 'Fatma Korkmaz', company: 'XYZ Ltd.', text: 'Profesyonel yaklaşımları ve yaratıcı çözümleri ile beklentilerimizi aştılar.', rating: 5, image: 'https://randomuser.me/api/portraits/women/11.jpg' },
                    { name: 'Burak Şahin', company: 'Tech Start', text: 'E-ticaret sitemiz sayesinde satışlarımız %200 arttı. Teşekkürler!', rating: 5, image: 'https://randomuser.me/api/portraits/men/12.jpg' }
                ]
            },
            clients: {
                title: 'Güvenilir İş Ortaklarımız',
                logos: [
                    { name: 'Google', url: '#' },
                    { name: 'Microsoft', url: '#' },
                    { name: 'Amazon', url: '#' },
                    { name: 'Apple', url: '#' },
                    { name: 'Meta', url: '#' }
                ]
            },

            // Media
            gallery: {
                title: 'Galeri',
                subtitle: 'Projelerimizden örnekler',
                columns: 3,
                images: [
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400',
                    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400'
                ]
            },
            video: {
                title: 'Tanıtım Videosu',
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800'
            },
            image: { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', alt: 'Resim', width: 'full', rounded: true },
            slider: {
                images: [
                    { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200', title: 'Slide 1' },
                    { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200', title: 'Slide 2' },
                    { src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200', title: 'Slide 3' }
                ],
                autoplay: true
            },

            // Commerce & Pricing
            pricing: {
                title: 'Fiyatlandırma',
                subtitle: 'Size uygun planı seçin',
                plans: [
                    { name: 'Başlangıç', price: '₺299', period: '/ay', features: ['5 Sayfa', 'SSL Sertifikası', 'E-posta Desteği'], popular: false, buttonText: 'Başla' },
                    { name: 'Profesyonel', price: '₺599', period: '/ay', features: ['15 Sayfa', 'SSL Sertifikası', '7/24 Destek', 'SEO Araçları', 'Analitik'], popular: true, buttonText: 'En Popüler' },
                    { name: 'Kurumsal', price: '₺999', period: '/ay', features: ['Sınırsız Sayfa', 'SSL Sertifikası', 'Öncelikli Destek', 'Gelişmiş SEO', 'Özel Entegrasyonlar'], popular: false, buttonText: 'İletişime Geç' }
                ]
            },
            products: {
                title: 'Ürünlerimiz',
                items: [
                    { name: 'Web Sitesi Paketi', price: '₺4.999', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300' },
                    { name: 'E-Ticaret Paketi', price: '₺9.999', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300' },
                    { name: 'SEO Paketi', price: '₺1.999/ay', image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300' }
                ]
            },

            // Contact & Forms
            contact: {
                title: 'İletişim',
                subtitle: 'Bizimle iletişime geçin',
                email: 'info@webcraft.com',
                phone: '+90 555 123 4567',
                address: 'Levent, İstanbul, Türkiye',
                showForm: true,
                showMap: true
            },
            newsletter: {
                title: 'Bültenimize Abone Olun',
                subtitle: 'En son haberler ve fırsatlardan ilk siz haberdar olun.',
                buttonText: 'Abone Ol',
                placeholder: 'E-posta adresiniz'
            },
            map: {
                title: 'Konumumuz',
                address: 'Levent, Büyükdere Cad. No:123, İstanbul',
                embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2461899671!2d29.0!3d41.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzQ4LjAiTiAyOcKwMDAnMDAuMCJF!5e0!3m2!1str!2str!4v1'
            },

            // Content
            text: { content: 'Buraya metin içeriğinizi yazabilirsiniz. Metin bloğu çeşitli stillerde görüntülenebilir.', align: 'left', fontSize: 'base' },
            heading: { text: 'Başlık Metni', level: 'h2', align: 'center' },
            button: { text: 'Buton', link: '#', style: 'primary', size: 'medium' },
            list: {
                title: 'Öne Çıkanlar',
                items: ['Profesyonel tasarım', 'Hızlı geliştirme', '7/24 destek', 'Uygun fiyat'],
                style: 'check'
            },
            quote: {
                text: 'Başarı, hazırlık ve fırsatın buluştuğu noktadır.',
                author: 'Bobby Unser',
                style: 'modern'
            },
            blog: {
                title: 'Blog Yazıları',
                posts: [
                    { title: 'Web Tasarım Trendleri 2024', excerpt: 'Bu yılın en popüler tasarım trendlerini keşfedin...', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400', date: '15 Ocak 2024' },
                    { title: 'SEO İpuçları', excerpt: 'Arama motorlarında üst sıralara çıkmanın yolları...', image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400', date: '10 Ocak 2024' },
                    { title: 'E-Ticaret Stratejileri', excerpt: 'Online satışlarınızı artırmanın etkili yolları...', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', date: '5 Ocak 2024' }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENTS - Layout
            // ═══════════════════════════════════════════════════════════════
            container: {
                maxWidth: 'container',
                padding: 'normal',
                bgColor: '#ffffff'
            },
            columns: {
                count: 2,
                gap: 'normal',
                content: [
                    { title: 'Sol Sütun', text: 'Sol sütun içeriği...' },
                    { title: 'Sağ Sütun', text: 'Sağ sütun içeriği...' }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENTS - Sections
            // ═══════════════════════════════════════════════════════════════
            portfolio: {
                title: 'Portfolyo',
                subtitle: 'Son projelerimiz',
                items: [
                    { title: 'E-Ticaret Sitesi', category: 'Web Tasarım', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
                    { title: 'Mobil Uygulama', category: 'Uygulama', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
                    { title: 'Kurumsal Site', category: 'Web Tasarım', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400' },
                    { title: 'Dashboard UI', category: 'UI/UX', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400' }
                ],
                columns: 2
            },


            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENTS - Content
            // ═══════════════════════════════════════════════════════════════
            code: {
                language: 'javascript',
                code: '// Örnek JavaScript kodu\nconst greeting = "Merhaba Dünya!";\nconsole.log(greeting);',
                showLineNumbers: true,
                theme: 'dark'
            },

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENTS - Widgets
            // ═══════════════════════════════════════════════════════════════
            search: {
                placeholder: 'Ara...',
                buttonText: 'Ara',
                showButton: true,
                bgColor: '#f9fafb'
            },
            socialicons: {
                title: 'Bizi Takip Edin',
                icons: [
                    { platform: 'facebook', url: '#', color: '#1877f2' },
                    { platform: 'twitter', url: '#', color: '#1da1f2' },
                    { platform: 'instagram', url: '#', color: '#e4405f' },
                    { platform: 'linkedin', url: '#', color: '#0077b5' },
                    { platform: 'youtube', url: '#', color: '#ff0000' }
                ],
                size: 'medium',
                style: 'circle'
            },
            calendar: {
                title: 'Etkinlik Takvimi',
                events: [
                    { date: '2024-01-15', title: 'Webinar' },
                    { date: '2024-01-20', title: 'Workshop' }
                ],
                locale: 'tr'
            },
            archives: {
                title: 'Arşivler',
                items: [
                    { month: 'Ocak 2024', count: 5 },
                    { month: 'Aralık 2023', count: 8 },
                    { month: 'Kasım 2023', count: 12 }
                ],
                showCount: true
            },
            categories: {
                title: 'Kategoriler',
                items: [
                    { name: 'Web Tasarım', count: 15 },
                    { name: 'SEO', count: 8 },
                    { name: 'E-Ticaret', count: 12 },
                    { name: 'Mobil', count: 6 }
                ],
                showCount: true
            },
            latestposts: {
                title: 'Son Yazılar',
                count: 3,
                showThumbnail: true,
                showDate: true,
                showExcerpt: false
            },
            customhtml: {
                code: '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">\n  <h3>Özel HTML İçerik</h3>\n  <p>Buraya özel HTML kodunuzu yazabilirsiniz.</p>\n</div>',
                sandbox: false
            },
            weather: {
                city: 'İstanbul',
                units: 'metric',
                showIcon: true,
                showForecast: false
            },

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENTS - E-Commerce
            // ═══════════════════════════════════════════════════════════════
            productcard: {
                name: 'Premium Ürün',
                price: '₺999',
                oldPrice: '₺1.299',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                badge: 'İndirim',
                rating: 4.5,
                inStock: true
            },
            productgrid: {
                title: 'Popüler Ürünler',
                products: [
                    { name: 'Ürün 1', price: '₺299', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300' },
                    { name: 'Ürün 2', price: '₺499', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300' },
                    { name: 'Ürün 3', price: '₺799', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300' }
                ],
                columns: 3
            },
            cartbutton: {
                text: 'Sepete Ekle',
                icon: '🛒',
                style: 'primary',
                size: 'medium',
                fullWidth: false
            },
            pricedisplay: {
                price: '₺1.499',
                oldPrice: '₺1.999',
                currency: '₺',
                period: '/ay',
                showSavings: true
            },
            salebadge: {
                text: '%30 İndirim',
                type: 'sale',
                position: 'top-right',
                animated: true
            },
            countdown: {
                title: 'Kampanya Bitiyor!',
                targetDate: '2025-12-31T23:59:59',
                showDays: true,
                showHours: true,
                showMinutes: true,
                showSeconds: true,
                bgColor: '#dc2626',
                textColor: '#ffffff'
            },

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENTS - Forms
            // ═══════════════════════════════════════════════════════════════
            loginform: {
                title: 'Giriş Yap',
                subtitle: 'Hesabınıza giriş yapın',
                showRegisterLink: true,
                showForgotPassword: true,
                buttonText: 'Giriş Yap',
                bgColor: '#ffffff'
            }
        };
        return defaults[type] || {};
    };


    const getPreviewWidth = () => {
        switch (previewMode) {
            case 'mobile': return 'max-w-[375px]';
            case 'tablet': return 'max-w-[768px]';
            default: return 'max-w-full';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-dark-400">Proje yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-dark-950 flex flex-col">
                {/* Top Toolbar */}
                <header className="h-14 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-4 flex-shrink-0">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="hidden sm:block">
                            <h1 className="font-semibold text-white truncate max-w-[200px]">
                                {currentProject?.name}
                            </h1>
                            {hasUnsavedChanges && (
                                <span className="text-xs text-amber-500">Kaydedilmemiş değişiklikler</span>
                            )}
                        </div>
                    </div>

                    {/* Center - Device Preview */}
                    <div className="hidden md:flex items-center gap-1 bg-dark-800 rounded-lg p-1">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('tablet')}
                            className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                        >
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {/* Undo/Redo */}
                        <div className="hidden sm:flex items-center gap-1">
                            <button
                                onClick={undo}
                                disabled={!canUndo()}
                                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Undo2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={!canRedo()}
                                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Redo2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="w-px h-6 bg-dark-700 hidden sm:block" />

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Kaydet</span>
                        </button>

                        {/* Export */}
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* Mobile menu */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-dark-400 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Main Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Components Panel (Left) */}
                    <aside className={`
            ${showComponentPanel ? 'w-64' : 'w-0'}
            ${mobileMenuOpen ? 'absolute inset-y-14 left-0 z-40 w-64' : 'hidden md:block'}
            bg-dark-900 border-r border-dark-800 overflow-y-auto transition-all flex-shrink-0
          `}>
                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">
                                Bileşenler
                            </h3>

                            {/* Layout */}
                            <div className="mb-4">
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <Layout className="w-3 h-3" /> Layout
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPONENT_TYPES.filter(c => c.category === 'layout').map((comp) => (
                                        <div
                                            key={comp.type}
                                            id={`panel-${comp.type}`}
                                            className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors text-center"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                                            <span className="text-xs text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sections */}
                            <div className="mb-4">
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <Box className="w-3 h-3" /> Bölümler
                                </div>
                                <div className="space-y-1 max-h-[250px] overflow-y-auto">
                                    {COMPONENT_TYPES.filter(c => c.category === 'sections').map((comp) => (
                                        <div
                                            key={comp.type}
                                            className="flex items-center gap-3 p-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-4 h-4 text-primary-400" />
                                            <span className="text-sm text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Media */}
                            <div className="mb-4">
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <Image className="w-3 h-3" /> Medya
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPONENT_TYPES.filter(c => c.category === 'media').map((comp) => (
                                        <div
                                            key={comp.type}
                                            className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors text-center"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                            <span className="text-xs text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <Type className="w-3 h-3" /> İçerik
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPONENT_TYPES.filter(c => c.category === 'content').map((comp) => (
                                        <div
                                            key={comp.type}
                                            className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors text-center"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                                            <span className="text-xs text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Widgets */}
                            <div className="mb-4">
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <Settings className="w-3 h-3" /> Widgetlar
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPONENT_TYPES.filter(c => c.category === 'widgets').map((comp) => (
                                        <div
                                            key={comp.type}
                                            className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors text-center"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                                            <span className="text-xs text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* E-Commerce */}
                            <div className="mb-4">
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <ShoppingCart className="w-3 h-3" /> E-Ticaret
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPONENT_TYPES.filter(c => c.category === 'commerce').map((comp) => (
                                        <div
                                            key={comp.type}
                                            className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors text-center"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                                            <span className="text-xs text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Forms */}
                            <div className="mb-4">
                                <div className="text-xs text-dark-500 mb-2 flex items-center gap-1">
                                    <FormInput className="w-3 h-3" /> Formlar
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMPONENT_TYPES.filter(c => c.category === 'forms').map((comp) => (
                                        <div
                                            key={comp.type}
                                            className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-colors text-center"
                                            onClick={() => {
                                                const newComponent = {
                                                    id: `${comp.type}-${Date.now()}`,
                                                    type: comp.type,
                                                    data: getDefaultComponentData(comp.type)
                                                };
                                                addComponent(newComponent);
                                            }}
                                        >
                                            <comp.icon className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                                            <span className="text-xs text-dark-300">{comp.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </aside>


                    {/* Canvas (Center) */}
                    <main className="flex-1 overflow-auto bg-dark-950 p-4 md:p-8">
                        <div className={`mx-auto ${getPreviewWidth()} transition-all duration-300`}>
                            <div className="bg-white rounded-lg shadow-2xl overflow-hidden min-h-[600px]">
                                {/* Canvas Content */}
                                <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                    {components.length === 0 ? (
                                        <div className="h-[600px] flex flex-col items-center justify-center text-dark-500 p-8">
                                            <Box className="w-16 h-16 mb-4 opacity-30" />
                                            <h3 className="text-lg font-medium text-dark-400 mb-2">Canvas boş</h3>
                                            <p className="text-sm text-dark-500 text-center max-w-sm">
                                                Sol panelden bileşenleri sürükleyip buraya bırakın veya tıklayarak ekleyin.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="builder-canvas">
                                            {components.map((component) => (
                                                <ComponentPreview
                                                    key={component.id}
                                                    component={component}
                                                    isSelected={selectedComponent?.id === component.id}
                                                    onSelect={() => selectComponent(component)}
                                                    onDelete={() => deleteComponent(component.id)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </SortableContext>
                            </div>
                        </div>
                    </main>

                    {/* Properties Panel (Right) */}
                    {selectedComponent && showPropertyPanel && (
                        <PropertyEditor
                            component={selectedComponent}
                            onClose={clearSelection}
                            updateComponent={updateComponent}
                            selectComponent={selectComponent}
                            deleteComponent={deleteComponent}
                        />
                    )}

                </div>

                {/* Export Modal */}
                {showExportModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6 animate-scale-in">
                            <h3 className="text-xl font-bold text-white mb-2">Projeyi Export Et</h3>
                            <p className="text-dark-400 mb-6">
                                HTML, CSS ve JS dosyalarını indirin.
                            </p>

                            {/* Credit Info */}
                            <div className="mb-6 p-4 bg-dark-700/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-dark-400">Mevcut Bakiye:</span>
                                    <span className="font-bold text-white">{user?.credits} kredi</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-dark-400">Export Maliyeti:</span>
                                    <span className="font-bold text-amber-400">200 kredi</span>
                                </div>
                            </div>

                            {/* Framework Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    CSS Framework
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleExport('tailwind')}
                                        disabled={isExporting || user?.credits < 200}
                                        className="p-4 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="text-2xl mb-1">🌊</div>
                                        <div className="text-sm font-medium text-white">Tailwind CSS</div>
                                    </button>
                                    <button
                                        onClick={() => handleExport('bootstrap')}
                                        disabled={isExporting || user?.credits < 200}
                                        className="p-4 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="text-2xl mb-1">🅱️</div>
                                        <div className="text-sm font-medium text-white">Bootstrap 5</div>
                                    </button>
                                </div>
                            </div>

                            {user?.credits < 200 && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">
                                        Yetersiz kredi! Export için 200 kredi gerekli.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                            </div>

                            {isExporting && (
                                <div className="absolute inset-0 bg-dark-800/90 flex items-center justify-center rounded-xl">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-2" />
                                        <p className="text-dark-300">Export hazırlanıyor...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DndContext>
    );
};

// Property Editor Panel
const PropertyEditor = ({ component, onClose, updateComponent, selectComponent, deleteComponent }) => {
    // State for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Update a single field in component data
    const updateField = (field, value) => {
        const newData = { ...component.data, [field]: value };
        updateComponent(component.id, { data: newData });
        // Also update the selected component reference
        selectComponent({ ...component, data: newData });
    };

    // Update an item in an array field
    const updateArrayItem = (field, index, value) => {
        const currentArray = component.data?.[field] || [];
        const newArray = [...currentArray];
        newArray[index] = value;
        updateField(field, newArray);
    };

    // Add item to array field
    const addArrayItem = (field, defaultValue = '') => {
        const currentArray = component.data?.[field] || [];
        updateField(field, [...currentArray, defaultValue]);
    };

    // Remove item from array field
    const removeArrayItem = (field, index) => {
        const currentArray = component.data?.[field] || [];
        updateField(field, currentArray.filter((_, i) => i !== index));
    };

    // Handle delete
    const handleDelete = () => {
        deleteComponent(component.id);
        setShowDeleteModal(false);
        onClose();
    };

    const renderFields = () => {
        switch (component.type) {
            // Grid System Property Editors
            case 'container':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Maksimum Genişlik</label>
                            <select
                                value={component.data?.maxWidth || 'container'}
                                onChange={(e) => updateField('maxWidth', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white"
                            >
                                <option value="narrow">Dar (800px)</option>
                                <option value="container">Normal (1200px)</option>
                                <option value="full">Tam Genişlik</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">İç Boşluk</label>
                            <select
                                value={component.data?.padding || 'normal'}
                                onChange={(e) => updateField('padding', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white"
                            >
                                <option value="none">Yok</option>
                                <option value="small">Küçük</option>
                                <option value="normal">Normal</option>
                                <option value="large">Büyük</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arka Plan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#ffffff'}
                                onChange={(e) => updateField('bgColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                    </>
                );

            case 'row-2':
            case 'row-3':
            case 'row-4':
                return (
                    <>
                        <div className="p-3 bg-dark-800/50 rounded-lg mb-3">
                            <p className="text-xs text-dark-400 mb-2">📌 Izgara Yapısı</p>
                            <p className="text-sm text-white font-medium">
                                {component.type === 'row-2' ? '2 Sütunlu' : component.type === 'row-3' ? '3 Sütunlu' : '4 Sütunlu'} Izgara
                            </p>
                            <p className="text-xs text-dark-500 mt-1">
                                Bileşenleri doğrudan sütunlara sürükleyebilirsiniz
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sütun Arası Boşluk</label>
                            <select
                                value={component.data?.gap || 'normal'}
                                onChange={(e) => updateField('gap', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white"
                            >
                                <option value="none">Yok</option>
                                <option value="small">Küçük (8px)</option>
                                <option value="normal">Normal (16px)</option>
                                <option value="large">Büyük (32px)</option>
                            </select>
                        </div>
                    </>
                );

            case 'row-sidebar':
                return (
                    <>
                        <div className="p-3 bg-dark-800/50 rounded-lg mb-3">
                            <p className="text-xs text-dark-400 mb-2">📌 Kenar Çubuğu Düzeni</p>
                            <p className="text-sm text-white font-medium">Ana İçerik + Sidebar</p>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Kenar Çubuğu Konumu</label>
                            <select
                                value={component.data?.layout || 'sidebar-right'}
                                onChange={(e) => updateField('layout', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white"
                            >
                                <option value="sidebar-right">Sağda (70/30)</option>
                                <option value="sidebar-left">Solda (30/70)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sütun Arası Boşluk</label>
                            <select
                                value={component.data?.gap || 'normal'}
                                onChange={(e) => updateField('gap', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white"
                            >
                                <option value="none">Yok</option>
                                <option value="small">Küçük (8px)</option>
                                <option value="normal">Normal (16px)</option>
                                <option value="large">Büyük (32px)</option>
                            </select>
                        </div>
                    </>
                );

            case 'header':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Logo Metni</label>
                            <input
                                type="text"
                                value={component.data?.logo || ''}
                                onChange={(e) => updateField('logo', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Menü Linkleri</label>
                            <div className="space-y-2">
                                {(component.data?.links || []).map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={link}
                                            onChange={(e) => updateArrayItem('links', index, e.target.value)}
                                            className="flex-1 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                        />
                                        <button
                                            onClick={() => removeArrayItem('links', index)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('links', 'Yeni Link')}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Link Ekle
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arka Plan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#ffffff'}
                                onChange={(e) => updateField('bgColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Logo Resmi (URL)</label>
                            <input
                                type="text"
                                value={component.data?.logoImage || ''}
                                onChange={(e) => updateField('logoImage', e.target.value)}
                                placeholder="https://example.com/logo.png"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">CTA Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.ctaButton || ''}
                                onChange={(e) => updateField('ctaButton', e.target.value)}
                                placeholder="Hemen Başla"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                    </>
                );


            case 'hero':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Rozet (Üst Etiket)</label>
                            <input
                                type="text"
                                value={component.data?.badge || ''}
                                onChange={(e) => updateField('badge', e.target.value)}
                                placeholder="🚀 Yeni Özellik"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Ana Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <textarea
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                            />
                        </div>
                        <div className="p-3 bg-dark-800/50 rounded-lg space-y-3">
                            <p className="text-xs text-dark-400 font-medium">Birincil Buton</p>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                                <input
                                    type="text"
                                    value={component.data?.cta || ''}
                                    onChange={(e) => updateField('cta', e.target.value)}
                                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Buton Linki</label>
                                <input
                                    type="text"
                                    value={component.data?.ctaLink || ''}
                                    onChange={(e) => updateField('ctaLink', e.target.value)}
                                    placeholder="#contact veya https://..."
                                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                                />
                            </div>
                        </div>
                        <div className="p-3 bg-dark-800/50 rounded-lg space-y-3">
                            <p className="text-xs text-dark-400 font-medium">İkincil Buton (Opsiyonel)</p>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                                <input
                                    type="text"
                                    value={component.data?.secondaryCta || ''}
                                    onChange={(e) => updateField('secondaryCta', e.target.value)}
                                    placeholder="Video İzle"
                                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showPlayButton || false}
                                    onChange={(e) => updateField('showPlayButton', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Play İkonu Göster
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Gradient Renk 1</label>
                                <input
                                    type="color"
                                    value={component.data?.gradientStart || '#1e3a8a'}
                                    onChange={(e) => updateField('gradientStart', e.target.value)}
                                    className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Gradient Renk 2</label>
                                <input
                                    type="color"
                                    value={component.data?.gradientEnd || '#7c3aed'}
                                    onChange={(e) => updateField('gradientEnd', e.target.value)}
                                    className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={component.data?.showTrustBadges || false}
                                onChange={(e) => updateField('showTrustBadges', e.target.checked)}
                                className="rounded border-dark-600"
                            />
                            Güvenilen Markalar Göster
                        </label>
                    </>
                );


            case 'about':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">İçerik</label>
                            <textarea
                                value={component.data?.content || ''}
                                onChange={(e) => updateField('content', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Resim URL (opsiyonel)</label>
                            <input
                                type="text"
                                value={component.data?.image || ''}
                                onChange={(e) => updateField('image', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                    </>
                );

            case 'features':
            case 'services':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">{component.type === 'features' ? 'Özellikler' : 'Hizmetler'}</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">#{index + 1}</span>
                                            <button
                                                onClick={() => removeArrayItem('items', index)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.title || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], title: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Başlık"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.description || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], description: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Açıklama"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { title: 'Yeni Öğe', description: 'Açıklama...' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + {component.type === 'features' ? 'Özellik' : 'Hizmet'} Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'contact':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">E-posta</label>
                            <input
                                type="email"
                                value={component.data?.email || ''}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Telefon</label>
                            <input
                                type="tel"
                                value={component.data?.phone || ''}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Adres</label>
                            <textarea
                                value={component.data?.address || ''}
                                onChange={(e) => updateField('address', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showForm !== false}
                                    onChange={(e) => updateField('showForm', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                İletişim Formu Göster
                            </label>
                        </div>
                    </>
                );

            case 'footer':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Copyright Metni</label>
                            <input
                                type="text"
                                value={component.data?.copyright || ''}
                                onChange={(e) => updateField('copyright', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sosyal Medya</label>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={component.data?.facebook || ''}
                                    onChange={(e) => updateField('facebook', e.target.value)}
                                    placeholder="Facebook URL"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                                <input
                                    type="text"
                                    value={component.data?.twitter || ''}
                                    onChange={(e) => updateField('twitter', e.target.value)}
                                    placeholder="Twitter URL"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                                <input
                                    type="text"
                                    value={component.data?.instagram || ''}
                                    onChange={(e) => updateField('instagram', e.target.value)}
                                    placeholder="Instagram URL"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'text':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">İçerik</label>
                            <textarea
                                value={component.data?.content || ''}
                                onChange={(e) => updateField('content', e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Hizalama</label>
                            <select
                                value={component.data?.align || 'left'}
                                onChange={(e) => updateField('align', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="left">Sol</option>
                                <option value="center">Orta</option>
                                <option value="right">Sağ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Font Boyutu</label>
                            <select
                                value={component.data?.fontSize || 'base'}
                                onChange={(e) => updateField('fontSize', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="sm">Küçük</option>
                                <option value="base">Normal</option>
                                <option value="lg">Büyük</option>
                                <option value="xl">Çok Büyük</option>
                            </select>
                        </div>
                    </>
                );

            case 'image':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Resim URL</label>
                            <input
                                type="text"
                                value={component.data?.src || ''}
                                onChange={(e) => updateField('src', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Metin</label>
                            <input
                                type="text"
                                value={component.data?.alt || ''}
                                onChange={(e) => updateField('alt', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Genişlik</label>
                            <select
                                value={component.data?.width || 'full'}
                                onChange={(e) => updateField('width', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="full">Tam Genişlik</option>
                                <option value="half">Yarım</option>
                                <option value="third">Üçte Bir</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.rounded || false}
                                    onChange={(e) => updateField('rounded', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Yuvarlatılmış Köşeler
                            </label>
                        </div>
                    </>
                );

            case 'gallery':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sütun Sayısı</label>
                            <select
                                value={component.data?.columns || 3}
                                onChange={(e) => updateField('columns', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value={2}>2 Sütun</option>
                                <option value={3}>3 Sütun</option>
                                <option value={4}>4 Sütun</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Resimler</label>
                            <div className="space-y-2">
                                {(component.data?.images || []).map((img, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={img}
                                            onChange={(e) => updateArrayItem('images', index, e.target.value)}
                                            placeholder="Resim URL"
                                            className="flex-1 px-2 py-1.5 bg-dark-800 border border-dark-700 rounded text-sm text-white"
                                        />
                                        <button
                                            onClick={() => removeArrayItem('images', index)}
                                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('images', '')}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Resim Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'pricing':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Fiyat Planları</label>
                            <div className="space-y-3">
                                {(component.data?.plans || []).map((plan, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Plan #{index + 1}</span>
                                            <button
                                                onClick={() => removeArrayItem('plans', index)}
                                                className="text-red-400"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={plan.name || ''}
                                            onChange={(e) => {
                                                const newPlans = [...(component.data?.plans || [])];
                                                newPlans[index] = { ...newPlans[index], name: e.target.value };
                                                updateField('plans', newPlans);
                                            }}
                                            placeholder="Plan Adı"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={plan.price || ''}
                                                onChange={(e) => {
                                                    const newPlans = [...(component.data?.plans || [])];
                                                    newPlans[index] = { ...newPlans[index], price: e.target.value };
                                                    updateField('plans', newPlans);
                                                }}
                                                placeholder="Fiyat (₺299)"
                                                className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                            />
                                            <input
                                                type="text"
                                                value={plan.period || ''}
                                                onChange={(e) => {
                                                    const newPlans = [...(component.data?.plans || [])];
                                                    newPlans[index] = { ...newPlans[index], period: e.target.value };
                                                    updateField('plans', newPlans);
                                                }}
                                                placeholder="Periyot (/ay)"
                                                className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={plan.buttonText || ''}
                                                onChange={(e) => {
                                                    const newPlans = [...(component.data?.plans || [])];
                                                    newPlans[index] = { ...newPlans[index], buttonText: e.target.value };
                                                    updateField('plans', newPlans);
                                                }}
                                                placeholder="Buton Metni"
                                                className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                            />
                                            <input
                                                type="text"
                                                value={plan.buttonLink || ''}
                                                onChange={(e) => {
                                                    const newPlans = [...(component.data?.plans || [])];
                                                    newPlans[index] = { ...newPlans[index], buttonLink: e.target.value };
                                                    updateField('plans', newPlans);
                                                }}
                                                placeholder="Buton Linki"
                                                className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-xs text-dark-300 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={plan.popular || false}
                                                onChange={(e) => {
                                                    const newPlans = [...(component.data?.plans || [])];
                                                    newPlans[index] = { ...newPlans[index], popular: e.target.checked };
                                                    updateField('plans', newPlans);
                                                }}
                                                className="rounded border-dark-600"
                                            />
                                            Popüler Plan
                                        </label>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('plans', { name: 'Yeni Plan', price: '₺0', period: '/ay', buttonText: 'Seç', buttonLink: '#', features: [], popular: false })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Plan Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );


            case 'team':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Ekip Üyeleri</label>
                            <div className="space-y-3">
                                {(component.data?.members || []).map((member, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Üye #{index + 1}</span>
                                            <button
                                                onClick={() => removeArrayItem('members', index)}
                                                className="text-red-400"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={member.name || ''}
                                            onChange={(e) => {
                                                const newMembers = [...(component.data?.members || [])];
                                                newMembers[index] = { ...newMembers[index], name: e.target.value };
                                                updateField('members', newMembers);
                                            }}
                                            placeholder="İsim"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={member.role || ''}
                                            onChange={(e) => {
                                                const newMembers = [...(component.data?.members || [])];
                                                newMembers[index] = { ...newMembers[index], role: e.target.value };
                                                updateField('members', newMembers);
                                            }}
                                            placeholder="Pozisyon"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={member.image || ''}
                                            onChange={(e) => {
                                                const newMembers = [...(component.data?.members || [])];
                                                newMembers[index] = { ...newMembers[index], image: e.target.value };
                                                updateField('members', newMembers);
                                            }}
                                            placeholder="Fotoğraf URL"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('members', { name: '', role: '', image: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Üye Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'testimonials':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Müşteri Yorumları</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Yorum #{index + 1}</span>
                                            <button
                                                onClick={() => removeArrayItem('items', index)}
                                                className="text-red-400"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], name: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Müşteri Adı"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <textarea
                                            value={item.text || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], text: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Yorum metni..."
                                            rows={2}
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white resize-none"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { name: '', text: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Yorum Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'cta':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <input
                                type="text"
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arka Plan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#3b82f6'}
                                onChange={(e) => updateField('bgColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                    </>
                );

            case 'banner':
                return (
                    <>
                        <p className="text-sm text-dark-400 mb-3">Kayan Banner Öğeleri</p>
                        <div className="space-y-4">
                            {(component.data?.items || []).map((item, index) => (
                                <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2 relative">
                                    <button
                                        onClick={() => removeArrayItem('items', index)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-500/10 rounded"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div>
                                        <label className="block text-xs text-dark-400 mb-1">Banner Metni</label>
                                        <input
                                            type="text"
                                            value={item.text || ''}
                                            onChange={(e) => {
                                                const items = [...(component.data?.items || [])];
                                                items[index] = { ...items[index], text: e.target.value };
                                                updateField('items', items);
                                            }}
                                            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                                            <input
                                                type="text"
                                                value={item.buttonText || ''}
                                                onChange={(e) => {
                                                    const items = [...(component.data?.items || [])];
                                                    items[index] = { ...items[index], buttonText: e.target.value };
                                                    updateField('items', items);
                                                }}
                                                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-dark-400 mb-1">Buton Linki</label>
                                            <input
                                                type="text"
                                                value={item.link || ''}
                                                onChange={(e) => {
                                                    const items = [...(component.data?.items || [])];
                                                    items[index] = { ...items[index], link: e.target.value };
                                                    updateField('items', items);
                                                }}
                                                placeholder="#veya https://..."
                                                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('items', { text: '🎉 Yeni Kampanya!', buttonText: 'İncele', link: '#' })}
                                className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                            >
                                + Banner Öğesi Ekle
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Gradient Renk 1</label>
                                <input
                                    type="color"
                                    value={component.data?.bgColor || '#3b82f6'}
                                    onChange={(e) => updateField('bgColor', e.target.value)}
                                    className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Gradient Renk 2</label>
                                <input
                                    type="color"
                                    value={component.data?.bgColorEnd || '#8b5cf6'}
                                    onChange={(e) => updateField('bgColorEnd', e.target.value)}
                                    className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                />
                            </div>
                        </div>
                    </>
                );


            case 'stats':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">İstatistikler</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">#{index + 1}</span>
                                            <button onClick={() => removeArrayItem('items', index)} className="text-red-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.value || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], value: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Değer (örn: 500+)"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.label || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], label: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Etiket (örn: Müşteri)"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { value: '0', label: 'Yeni' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + İstatistik Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'timeline':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Zaman Çizelgesi</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">#{index + 1}</span>
                                            <button onClick={() => removeArrayItem('items', index)} className="text-red-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.year || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], year: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Yıl"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.title || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], title: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Başlık"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.description || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], description: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Açıklama"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { year: '2024', title: '', description: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Olay Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'faq':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Sorular</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Soru #{index + 1}</span>
                                            <button onClick={() => removeArrayItem('items', index)} className="text-red-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.question || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], question: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Soru"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <textarea
                                            value={item.answer || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], answer: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Cevap"
                                            rows={2}
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white resize-none"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { question: '', answer: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Soru Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'clients':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Müşteri/Logo İsimleri</label>
                            <div className="space-y-2">
                                {(component.data?.logos || []).map((logo, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={logo.name || ''}
                                            onChange={(e) => {
                                                const newLogos = [...(component.data?.logos || [])];
                                                newLogos[index] = { ...newLogos[index], name: e.target.value };
                                                updateField('logos', newLogos);
                                            }}
                                            placeholder="Şirket Adı"
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <button onClick={() => removeArrayItem('logos', index)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('logos', { name: 'Yeni Müşteri' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Müşteri Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'video':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Video URL (YouTube Embed)</label>
                            <input
                                type="text"
                                value={component.data?.url || ''}
                                onChange={(e) => updateField('url', e.target.value)}
                                placeholder="https://www.youtube.com/embed/..."
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                    </>
                );

            case 'newsletter':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <input
                                type="text"
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={component.data?.placeholder || ''}
                                onChange={(e) => updateField('placeholder', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                    </>
                );

            case 'map':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Adres</label>
                            <textarea
                                value={component.data?.address || ''}
                                onChange={(e) => updateField('address', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                            />
                        </div>
                    </>
                );

            case 'heading':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık Metni</label>
                            <input
                                type="text"
                                value={component.data?.text || ''}
                                onChange={(e) => updateField('text', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Seviye</label>
                            <select
                                value={component.data?.level || 'h2'}
                                onChange={(e) => updateField('level', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="h1">H1 - En Büyük</option>
                                <option value="h2">H2 - Büyük</option>
                                <option value="h3">H3 - Orta</option>
                                <option value="h4">H4 - Küçük</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Hizalama</label>
                            <select
                                value={component.data?.align || 'center'}
                                onChange={(e) => updateField('align', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="left">Sol</option>
                                <option value="center">Orta</option>
                                <option value="right">Sağ</option>
                            </select>
                        </div>
                    </>
                );

            case 'button':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.text || ''}
                                onChange={(e) => updateField('text', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Link</label>
                            <input
                                type="text"
                                value={component.data?.link || ''}
                                onChange={(e) => updateField('link', e.target.value)}
                                placeholder="#section veya https://..."
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'primary'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="primary">Birincil (Mavi)</option>
                                <option value="secondary">İkincil (Gri)</option>
                                <option value="outline">Çerçeveli</option>
                            </select>
                        </div>
                    </>
                );

            case 'list':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Liste Öğeleri</label>
                            <div className="space-y-2">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateArrayItem('items', index, e.target.value)}
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <button onClick={() => removeArrayItem('items', index)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', 'Yeni öğe')}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Öğe Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'quote':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alıntı Metni</label>
                            <textarea
                                value={component.data?.text || ''}
                                onChange={(e) => updateField('text', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Yazar</label>
                            <input
                                type="text"
                                value={component.data?.author || ''}
                                onChange={(e) => updateField('author', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                    </>
                );

            case 'blog':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Blog Yazıları</label>
                            <div className="space-y-3">
                                {(component.data?.posts || []).map((post, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Yazı #{index + 1}</span>
                                            <button onClick={() => removeArrayItem('posts', index)} className="text-red-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={post.title || ''}
                                            onChange={(e) => {
                                                const newPosts = [...(component.data?.posts || [])];
                                                newPosts[index] = { ...newPosts[index], title: e.target.value };
                                                updateField('posts', newPosts);
                                            }}
                                            placeholder="Yazı Başlığı"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={post.excerpt || ''}
                                            onChange={(e) => {
                                                const newPosts = [...(component.data?.posts || [])];
                                                newPosts[index] = { ...newPosts[index], excerpt: e.target.value };
                                                updateField('posts', newPosts);
                                            }}
                                            placeholder="Özet"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={post.image || ''}
                                            onChange={(e) => {
                                                const newPosts = [...(component.data?.posts || [])];
                                                newPosts[index] = { ...newPosts[index], image: e.target.value };
                                                updateField('posts', newPosts);
                                            }}
                                            placeholder="Resim URL"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('posts', { title: '', excerpt: '', image: '', date: new Date().toLocaleDateString('tr-TR') })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Yazı Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'products':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Ürünler</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Ürün #{index + 1}</span>
                                            <button onClick={() => removeArrayItem('items', index)} className="text-red-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], name: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Ürün Adı"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.price || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], price: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Fiyat"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.image || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], image: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Resim URL"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { name: '', price: '', image: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Ürün Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'slider':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Slide Resimleri</label>
                            <div className="space-y-2">
                                {(component.data?.images || []).map((img, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={img.src || ''}
                                            onChange={(e) => {
                                                const newImages = [...(component.data?.images || [])];
                                                newImages[index] = { ...newImages[index], src: e.target.value };
                                                updateField('images', newImages);
                                            }}
                                            placeholder="Resim URL"
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <button onClick={() => removeArrayItem('images', index)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('images', { src: '', title: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Slide Ekle
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.autoplay || false}
                                    onChange={(e) => updateField('autoplay', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Otomatik Oynat
                            </label>
                        </div>
                    </>
                );

            case 'divider':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'line'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="line">Düz Çizgi</option>
                                <option value="dashed">Kesikli</option>
                                <option value="dotted">Noktalı</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Renk</label>
                            <input
                                type="color"
                                value={component.data?.color || '#e5e7eb'}
                                onChange={(e) => updateField('color', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                    </>
                );

            case 'spacer':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Yükseklik (px)</label>
                            <input
                                type="number"
                                value={component.data?.height || 60}
                                onChange={(e) => updateField('height', parseInt(e.target.value))}
                                min={10}
                                max={300}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div className="text-xs text-dark-500">
                            Bölümler arasında boşluk eklemek için kullanın.
                        </div>
                    </>
                );

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENT EDITORS - Content
            // ═══════════════════════════════════════════════════════════════
            case 'code':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Programlama Dili</label>
                            <select
                                value={component.data?.language || 'javascript'}
                                onChange={(e) => updateField('language', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="php">PHP</option>
                                <option value="sql">SQL</option>
                                <option value="bash">Bash</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Kod</label>
                            <textarea
                                value={component.data?.code || ''}
                                onChange={(e) => updateField('code', e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 font-mono resize-none"
                                placeholder="// Kod yazın..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Tema</label>
                            <select
                                value={component.data?.theme || 'dark'}
                                onChange={(e) => updateField('theme', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="dark">Koyu</option>
                                <option value="light">Açık</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showLineNumbers || false}
                                    onChange={(e) => updateField('showLineNumbers', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Satır Numaralarını Göster
                            </label>
                        </div>
                    </>
                );

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENT EDITORS - Widgets
            // ═══════════════════════════════════════════════════════════════
            case 'search':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={component.data?.placeholder || ''}
                                onChange={(e) => updateField('placeholder', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arkaplan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#f9fafb'}
                                onChange={(e) => updateField('bgColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showButton || false}
                                    onChange={(e) => updateField('showButton', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Butonu Göster
                            </label>
                        </div>
                    </>
                );

            case 'socialicons':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Boyut</label>
                            <select
                                value={component.data?.size || 'medium'}
                                onChange={(e) => updateField('size', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="small">Küçük</option>
                                <option value="medium">Orta</option>
                                <option value="large">Büyük</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'circle'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="circle">Yuvarlak</option>
                                <option value="square">Kare</option>
                                <option value="rounded">Oval</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Sosyal Medya Hesapları</label>
                            <div className="space-y-2">
                                {(component.data?.icons || []).map((icon, index) => (
                                    <div key={index} className="p-2 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">{icon.platform}</span>
                                            <button onClick={() => removeArrayItem('icons', index)} className="text-red-400 text-xs">Sil</button>
                                        </div>
                                        <input
                                            type="text"
                                            value={icon.url || ''}
                                            onChange={(e) => {
                                                const newIcons = [...(component.data?.icons || [])];
                                                newIcons[index] = { ...newIcons[index], url: e.target.value };
                                                updateField('icons', newIcons);
                                            }}
                                            placeholder="URL"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case 'calendar':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Dil</label>
                            <select
                                value={component.data?.locale || 'tr'}
                                onChange={(e) => updateField('locale', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="tr">Türkçe</option>
                                <option value="en">İngilizce</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Etkinlikler</label>
                            <div className="space-y-2">
                                {(component.data?.events || []).map((event, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="date"
                                            value={event.date || ''}
                                            onChange={(e) => {
                                                const newEvents = [...(component.data?.events || [])];
                                                newEvents[index] = { ...newEvents[index], date: e.target.value };
                                                updateField('events', newEvents);
                                            }}
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={event.title || ''}
                                            onChange={(e) => {
                                                const newEvents = [...(component.data?.events || [])];
                                                newEvents[index] = { ...newEvents[index], title: e.target.value };
                                                updateField('events', newEvents);
                                            }}
                                            placeholder="Etkinlik Adı"
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <button onClick={() => removeArrayItem('events', index)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('events', { date: '', title: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Etkinlik Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'archives':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showCount || false}
                                    onChange={(e) => updateField('showCount', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Sayıları Göster
                            </label>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Arşiv Öğeleri</label>
                            <div className="space-y-2">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item.month || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], month: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Ay (ör: Ocak 2024)"
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="number"
                                            value={item.count || 0}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], count: parseInt(e.target.value) };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Sayı"
                                            className="w-16 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <button onClick={() => removeArrayItem('items', index)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { month: '', count: 0 })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Arşiv Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'categories':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showCount || false}
                                    onChange={(e) => updateField('showCount', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Sayıları Göster
                            </label>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Kategoriler</label>
                            <div className="space-y-2">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], name: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Kategori Adı"
                                            className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="number"
                                            value={item.count || 0}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], count: parseInt(e.target.value) };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Sayı"
                                            className="w-16 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <button onClick={() => removeArrayItem('items', index)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { name: '', count: 0 })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Kategori Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'latestposts':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Gösterilecek Yazı Sayısı</label>
                            <input
                                type="number"
                                value={component.data?.count || 3}
                                onChange={(e) => updateField('count', parseInt(e.target.value))}
                                min={1}
                                max={10}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showThumbnail || false}
                                    onChange={(e) => updateField('showThumbnail', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Küçük Resim Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showDate || false}
                                    onChange={(e) => updateField('showDate', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Tarih Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showExcerpt || false}
                                    onChange={(e) => updateField('showExcerpt', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Özet Göster
                            </label>
                        </div>
                    </>
                );

            case 'customhtml':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">HTML Kodu</label>
                            <textarea
                                value={component.data?.code || ''}
                                onChange={(e) => updateField('code', e.target.value)}
                                rows={8}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 font-mono resize-none"
                                placeholder="<div>...</div>"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.sandbox || false}
                                    onChange={(e) => updateField('sandbox', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Sandbox Modunda Çalıştır
                            </label>
                        </div>
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <p className="text-xs text-amber-400">⚠️ Özel HTML kullanırken dikkatli olun. Güvenlik açıklarına neden olabilir.</p>
                        </div>
                    </>
                );

            case 'weather':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Şehir</label>
                            <input
                                type="text"
                                value={component.data?.city || ''}
                                onChange={(e) => updateField('city', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Birim</label>
                            <select
                                value={component.data?.units || 'metric'}
                                onChange={(e) => updateField('units', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="metric">Celsius (°C)</option>
                                <option value="imperial">Fahrenheit (°F)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showIcon || false}
                                    onChange={(e) => updateField('showIcon', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                İkon Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showForecast || false}
                                    onChange={(e) => updateField('showForecast', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Tahmin Göster
                            </label>
                        </div>
                    </>
                );

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENT EDITORS - E-Commerce
            // ═══════════════════════════════════════════════════════════════
            case 'productcard':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Ürün Adı</label>
                            <input
                                type="text"
                                value={component.data?.name || ''}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Fiyat</label>
                                <input
                                    type="text"
                                    value={component.data?.price || ''}
                                    onChange={(e) => updateField('price', e.target.value)}
                                    placeholder="₺999"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Eski Fiyat</label>
                                <input
                                    type="text"
                                    value={component.data?.oldPrice || ''}
                                    onChange={(e) => updateField('oldPrice', e.target.value)}
                                    placeholder="₺1.299"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Resim URL</label>
                            <input
                                type="text"
                                value={component.data?.image || ''}
                                onChange={(e) => updateField('image', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Rozet</label>
                            <input
                                type="text"
                                value={component.data?.badge || ''}
                                onChange={(e) => updateField('badge', e.target.value)}
                                placeholder="İndirim, Yeni, vb."
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Puan (0-5)</label>
                            <input
                                type="number"
                                value={component.data?.rating || 0}
                                onChange={(e) => updateField('rating', parseFloat(e.target.value))}
                                min={0}
                                max={5}
                                step={0.5}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.inStock || false}
                                    onChange={(e) => updateField('inStock', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Stokta Var
                            </label>
                        </div>
                    </>
                );

            case 'productgrid':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sütun Sayısı</label>
                            <select
                                value={component.data?.columns || 3}
                                onChange={(e) => updateField('columns', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value={2}>2 Sütun</option>
                                <option value={3}>3 Sütun</option>
                                <option value={4}>4 Sütun</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Ürünler</label>
                            <div className="space-y-3">
                                {(component.data?.products || []).map((product, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Ürün #{index + 1}</span>
                                            <button onClick={() => removeArrayItem('products', index)} className="text-red-400"><X className="w-3 h-3" /></button>
                                        </div>
                                        <input
                                            type="text"
                                            value={product.name || ''}
                                            onChange={(e) => {
                                                const newProducts = [...(component.data?.products || [])];
                                                newProducts[index] = { ...newProducts[index], name: e.target.value };
                                                updateField('products', newProducts);
                                            }}
                                            placeholder="Ürün Adı"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={product.price || ''}
                                            onChange={(e) => {
                                                const newProducts = [...(component.data?.products || [])];
                                                newProducts[index] = { ...newProducts[index], price: e.target.value };
                                                updateField('products', newProducts);
                                            }}
                                            placeholder="Fiyat"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={product.image || ''}
                                            onChange={(e) => {
                                                const newProducts = [...(component.data?.products || [])];
                                                newProducts[index] = { ...newProducts[index], image: e.target.value };
                                                updateField('products', newProducts);
                                            }}
                                            placeholder="Resim URL"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('products', { name: '', price: '', image: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Ürün Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'cartbutton':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.text || ''}
                                onChange={(e) => updateField('text', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">İkon</label>
                            <input
                                type="text"
                                value={component.data?.icon || ''}
                                onChange={(e) => updateField('icon', e.target.value)}
                                placeholder="🛒"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'primary'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="primary">Birincil</option>
                                <option value="secondary">İkincil</option>
                                <option value="outline">Çerçeveli</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Boyut</label>
                            <select
                                value={component.data?.size || 'medium'}
                                onChange={(e) => updateField('size', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="small">Küçük</option>
                                <option value="medium">Orta</option>
                                <option value="large">Büyük</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.fullWidth || false}
                                    onChange={(e) => updateField('fullWidth', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Tam Genişlik
                            </label>
                        </div>
                    </>
                );

            case 'pricedisplay':
                return (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Fiyat</label>
                                <input
                                    type="text"
                                    value={component.data?.price || ''}
                                    onChange={(e) => updateField('price', e.target.value)}
                                    placeholder="₺1.499"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Eski Fiyat</label>
                                <input
                                    type="text"
                                    value={component.data?.oldPrice || ''}
                                    onChange={(e) => updateField('oldPrice', e.target.value)}
                                    placeholder="₺1.999"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Para Birimi</label>
                                <input
                                    type="text"
                                    value={component.data?.currency || ''}
                                    onChange={(e) => updateField('currency', e.target.value)}
                                    placeholder="₺"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Dönem</label>
                                <input
                                    type="text"
                                    value={component.data?.period || ''}
                                    onChange={(e) => updateField('period', e.target.value)}
                                    placeholder="/ay"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showSavings || false}
                                    onChange={(e) => updateField('showSavings', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Tasarruf Miktarını Göster
                            </label>
                        </div>
                    </>
                );

            case 'salebadge':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Metin</label>
                            <input
                                type="text"
                                value={component.data?.text || ''}
                                onChange={(e) => updateField('text', e.target.value)}
                                placeholder="%30 İndirim"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Tip</label>
                            <select
                                value={component.data?.type || 'sale'}
                                onChange={(e) => updateField('type', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="sale">İndirim</option>
                                <option value="new">Yeni</option>
                                <option value="hot">Popüler</option>
                                <option value="limited">Sınırlı</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Konum</label>
                            <select
                                value={component.data?.position || 'top-right'}
                                onChange={(e) => updateField('position', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="top-left">Sol Üst</option>
                                <option value="top-right">Sağ Üst</option>
                                <option value="bottom-left">Sol Alt</option>
                                <option value="bottom-right">Sağ Alt</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.animated || false}
                                    onChange={(e) => updateField('animated', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Animasyonlu
                            </label>
                        </div>
                    </>
                );

            case 'countdown':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Hedef Tarih</label>
                            <input
                                type="datetime-local"
                                value={component.data?.targetDate?.slice(0, 16) || ''}
                                onChange={(e) => updateField('targetDate', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Arkaplan Rengi</label>
                                <input
                                    type="color"
                                    value={component.data?.bgColor || '#dc2626'}
                                    onChange={(e) => updateField('bgColor', e.target.value)}
                                    className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Metin Rengi</label>
                                <input
                                    type="color"
                                    value={component.data?.textColor || '#ffffff'}
                                    onChange={(e) => updateField('textColor', e.target.value)}
                                    className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showDays || false}
                                    onChange={(e) => updateField('showDays', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Gün Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showHours || false}
                                    onChange={(e) => updateField('showHours', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Saat Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showMinutes || false}
                                    onChange={(e) => updateField('showMinutes', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Dakika Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showSeconds || false}
                                    onChange={(e) => updateField('showSeconds', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Saniye Göster
                            </label>
                        </div>
                    </>
                );

            // ═══════════════════════════════════════════════════════════════
            // NEW COMPONENT EDITORS - Forms
            // ═══════════════════════════════════════════════════════════════
            case 'loginform':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <input
                                type="text"
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arkaplan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#ffffff'}
                                onChange={(e) => updateField('bgColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showRegisterLink || false}
                                    onChange={(e) => updateField('showRegisterLink', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Kayıt Bağlantısı Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showForgotPassword || false}
                                    onChange={(e) => updateField('showForgotPassword', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Şifremi Unuttum Bağlantısı Göster
                            </label>
                        </div>
                    </>
                );

            default:
                return (
                    <div className="p-3 bg-dark-800/50 rounded-lg">
                        <p className="text-xs text-dark-500">
                            Bu bileşen için özel düzenleme seçenekleri henüz eklenmedi.
                        </p>
                    </div>
                );
        }
    };


    return (
        <aside className="hidden lg:block w-80 bg-dark-900 border-l border-dark-800 overflow-y-auto flex-shrink-0">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Özellikler</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-dark-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Component Info */}
                <div className="mb-4 p-3 bg-dark-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-primary-500/20 rounded flex items-center justify-center">
                            <Box className="w-3 h-3 text-primary-400" />
                        </div>
                        <span className="text-sm font-medium text-white">
                            {COMPONENT_TYPES.find(c => c.type === component.type)?.label || component.type}
                        </span>
                    </div>
                    <div className="text-xs text-dark-500 font-mono">{component.id}</div>
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4">
                    {renderFields()}
                </div>

                {/* Delete Button */}
                <div className="mt-6 pt-4 border-t border-dark-700">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-2 text-sm text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors"
                    >
                        Bileşeni Sil
                    </button>
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
                    <div
                        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-sm overflow-hidden animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 text-center">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Bileşeni Sil</h3>
                            <p className="text-sm text-dark-400 mb-4">
                                Bu bileşeni silmek istediğinize emin misiniz?
                            </p>
                        </div>
                        <div className="p-4 border-t border-dark-700 flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};


// Component Preview in Canvas
const ComponentPreview = ({ component, isSelected, onSelect, onDelete }) => {

    const getPreviewContent = () => {
        switch (component.type) {
            case 'header':

                return (
                    <div
                        className="bg-white/95 backdrop-blur-md border-b shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50"
                        style={{ backgroundColor: component.data?.bgColor }}
                    >
                        <div className="flex items-center gap-3">
                            {component.data?.logoImage ? (
                                <img src={component.data.logoImage} alt="Logo" className="h-8" />
                            ) : (
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {component.data?.logo || 'WebBuilder'}
                                </span>
                            )}
                        </div>
                        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                            {(component.data?.links || ['Ana Sayfa', 'Hizmetler', 'Hakkımızda', 'İletişim']).map((link, i) => (
                                <a
                                    key={i}
                                    href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                                    className="relative hover:text-blue-600 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:after:w-full cursor-pointer"
                                >
                                    {link}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            {component.data?.ctaButton && (
                                <button className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                    {component.data.ctaButton}
                                </button>
                            )}
                            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );


            case 'hero':
                return (
                    <div
                        className="relative text-white py-24 px-8 text-center overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${component.data?.gradientStart || '#1e3a8a'}, ${component.data?.gradientEnd || '#7c3aed'})`
                        }}
                    >
                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            {component.data?.badge && (
                                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
                                    {component.data.badge}
                                </span>
                            )}
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                {component.data?.title || 'Dijital Dünyada Fark Yaratın'}
                            </h1>
                            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                {component.data?.subtitle || 'Modern ve profesyonel web siteleri ile işletmenizi bir üst seviyeye taşıyın'}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <a
                                    href={component.data?.ctaLink || '#contact'}
                                    className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                                >
                                    {component.data?.cta || 'Ücretsiz Başlayın'}
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                {component.data?.secondaryCta && (
                                    <a
                                        href={component.data?.secondaryCtaLink || '#about'}
                                        className="border-2 border-white/50 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center gap-2"
                                    >
                                        {component.data?.showPlayButton && (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                        {component.data.secondaryCta}
                                    </a>
                                )}
                            </div>

                            {/* Trust Badges */}
                            {component.data?.showTrustBadges && (
                                <div className="mt-12 flex items-center justify-center gap-8 opacity-60">
                                    <span className="text-sm">Güvenilen Markalar:</span>
                                    <div className="flex gap-6">
                                        {['Google', 'Microsoft', 'Meta'].map((brand, i) => (
                                            <span key={i} className="font-semibold">{brand}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                            <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                );


            case 'cta':
                return (
                    <div className="py-16 px-8 text-center text-white" style={{ backgroundColor: component.data?.bgColor || '#3b82f6' }}>
                        <h2 className="text-3xl font-bold mb-4">{component.data?.title || 'Projenizi Hayata Geçirin'}</h2>
                        <p className="text-lg opacity-90 mb-6">{component.data?.subtitle || 'Hemen başlayın'}</p>
                        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold">
                            {component.data?.buttonText || 'İletişime Geçin'}
                        </button>
                    </div>
                );

            case 'banner':
                const bannerItems = component.data?.items || [
                    { text: '🎉 Büyük Yaz İndirimi! Tüm ürünlerde %50 indirim', buttonText: 'Alışverişe Başla', link: '#shop' },
                    { text: '🚀 Yeni koleksiyonumuz çıktı! Hemen keşfedin', buttonText: 'Keşfet', link: '#collection' },
                    { text: '💰 İlk alışverişe özel %20 indirim kodu: HOSGELDIN', buttonText: 'Kodu Kullan', link: '#discount' }
                ];
                return (
                    <div
                        className="relative py-4 overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${component.data?.bgColor || '#3b82f6'}, ${component.data?.bgColorEnd || '#8b5cf6'})` }}
                    >
                        {/* Sliding Container */}
                        <div className="flex animate-marquee whitespace-nowrap">
                            {[...bannerItems, ...bannerItems].map((item, i) => (
                                <div key={i} className="inline-flex items-center gap-8 mx-12 text-white">
                                    <span className="text-lg font-medium">{item.text}</span>
                                    <a
                                        href={item.link || '#'}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        {item.buttonText || 'İncele'}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <style>{`
                            @keyframes marquee {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .animate-marquee {
                                animation: marquee 20s linear infinite;
                            }
                            .animate-marquee:hover {
                                animation-play-state: paused;
                            }
                        `}</style>
                    </div>
                );


            case 'about':
                return (
                    <div className="py-16 px-8 bg-gray-50">
                        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-600 mb-2">{component.data?.subtitle || 'Biz Kimiz?'}</h3>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">{component.data?.title || 'Hakkımızda'}</h2>
                                <p className="text-gray-600 leading-relaxed">{component.data?.content || 'Şirketiniz hakkında bilgi...'}</p>
                            </div>
                            {component.data?.image && (
                                <img src={component.data.image} alt="About" className="rounded-xl shadow-lg" />
                            )}
                        </div>
                    </div>
                );

            case 'features':
                const features = component.data?.items || [];
                return (
                    <div className="py-16 px-8 bg-white">
                        <div className="text-center mb-12">
                            <h3 className="text-sm font-semibold text-blue-600 mb-2">{component.data?.subtitle || 'Özellikler'}</h3>
                            <h2 className="text-3xl font-bold text-gray-800">{component.data?.title || 'Özelliklerimiz'}</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {(features.length > 0 ? features : [1, 2, 3].map(i => ({ icon: '⚡', title: `Özellik ${i}`, description: 'Açıklama...' }))).map((item, i) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-lg transition-shadow">
                                    <div className="text-3xl mb-4">{item.icon || '⚡'}</div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'services':
                const services = component.data?.items || [];
                return (
                    <div className="py-16 px-8 bg-gray-50">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800">{component.data?.title || 'Hizmetlerimiz'}</h2>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {(services.length > 0 ? services : [1, 2, 3, 4].map(i => ({ icon: '🌐', title: `Hizmet ${i}`, description: 'Açıklama', price: '₺999' }))).map((item, i) => (
                                <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="text-2xl mb-3">{item.icon || '🌐'}</div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                    {item.price && <p className="text-blue-600 font-medium text-sm">{item.price}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'stats':
                const stats = component.data?.items || [{ value: '500+', label: 'Müşteri' }, { value: '1000+', label: 'Proje' }, { value: '50+', label: 'Ülke' }, { value: '10+', label: 'Yıl' }];
                return (
                    <div className="py-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <h2 className="text-3xl font-bold text-center mb-12">{component.data?.title || 'Rakamlarla Biz'}</h2>
                        <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                            {stats.map((item, i) => (
                                <div key={i}>
                                    <div className="text-4xl font-bold mb-2">{item.value}</div>
                                    <div className="text-sm opacity-80">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'timeline':
                const timelineItems = component.data?.items || [{ year: '2020', title: 'Başlangıç', description: 'Kuruluş' }];
                return (
                    <div className="py-16 px-8 bg-white">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'Tarihçemiz'}</h2>
                        <div className="max-w-3xl mx-auto space-y-8">
                            {timelineItems.map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-20 text-right font-bold text-blue-600">{item.year}</div>
                                    <div className="w-4 h-4 bg-blue-600 rounded-full mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'faq':
                const faqs = component.data?.items || [{ question: 'Soru 1?', answer: 'Cevap 1' }];
                return (
                    <div className="py-16 px-8 bg-gray-50">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'SSS'}</h2>
                        <div className="max-w-2xl mx-auto space-y-4">
                            {faqs.map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">{item.question}</h3>
                                    <p className="text-gray-600 text-sm">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'team':
                const members = component.data?.members || [];
                return (
                    <div className="py-16 px-8 bg-white">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'Ekibimiz'}</h2>
                        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {(members.length > 0 ? members : [1, 2, 3, 4].map(i => ({ name: `Kişi ${i}`, role: 'Pozisyon', image: `https://randomuser.me/api/portraits/men/${i}.jpg` }))).map((member, i) => (
                                <div key={i} className="text-center">
                                    <img src={member.image || `https://randomuser.me/api/portraits/men/${i + 1}.jpg`} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'testimonials':
                const testimonials = component.data?.items || [];
                return (
                    <div className="py-16 px-8 bg-gray-50">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'Müşteri Yorumları'}</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {(testimonials.length > 0 ? testimonials : [1, 2, 3].map(i => ({ name: `Müşteri ${i}`, text: 'Harika hizmet!', rating: 5 }))).map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                                    <div className="text-yellow-400 mb-4">{'★'.repeat(item.rating || 5)}</div>
                                    <p className="text-gray-600 mb-4 italic">"{item.text}"</p>
                                    <div className="flex items-center gap-3">
                                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full" />}
                                        <div>
                                            <div className="font-semibold text-gray-800">{item.name}</div>
                                            {item.company && <div className="text-sm text-gray-500">{item.company}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'clients':
                return (
                    <div className="py-12 px-8 bg-gray-100">
                        <h2 className="text-xl font-semibold text-center text-gray-600 mb-8">{component.data?.title || 'İş Ortaklarımız'}</h2>
                        <div className="flex justify-center gap-12 opacity-60">
                            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'].map((name, i) => (
                                <div key={i} className="text-xl font-bold text-gray-400">{name}</div>
                            ))}
                        </div>
                    </div>
                );

            case 'pricing':
                const plans = component.data?.plans || [];
                const defaultPlans = [
                    { name: 'Başlangıç', price: '₺299', period: '/ay', features: ['5 Proje', '10GB Depolama', 'E-posta Desteği'], buttonText: 'Başla' },
                    { name: 'Profesyonel', price: '₺599', period: '/ay', popular: true, features: ['Sınırsız Proje', '100GB Depolama', '7/24 Destek', 'Özel API'], buttonText: 'Hemen Başla' },
                    { name: 'Kurumsal', price: '₺999', period: '/ay', features: ['Her Şey Dahil', 'Sınırsız Depolama', 'Öncelikli Destek', 'SLA Garantisi', 'Özel Geliştirme'], buttonText: 'İletişime Geç' }
                ];
                return (
                    <div className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
                        <div className="text-center mb-16">
                            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                                💰 {component.data?.subtitle || 'Fiyatlandırma'}
                            </span>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">{component.data?.title || 'Size Uygun Planı Seçin'}</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Her bütçeye uygun esnek fiyatlandırma seçeneklerimizle tanışın</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                            {(plans.length > 0 ? plans : defaultPlans).map((plan, i) => (
                                <div
                                    key={i}
                                    className={`relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${plan.popular
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30 scale-105 z-10'
                                        : 'bg-white border border-gray-200 hover:shadow-xl hover:border-blue-200'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                ⭐ En Popüler
                                            </span>
                                        </div>
                                    )}
                                    <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className={`text-sm ${plan.popular ? 'text-blue-200' : 'text-gray-500'}`}>{plan.period}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {(plan.features || ['Özellik 1', 'Özellik 2', 'Özellik 3']).map((feature, fi) => (
                                            <li key={fi} className={`flex items-center gap-2 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={plan.buttonLink || '#contact'}
                                        className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all duration-300 ${plan.popular
                                            ? 'bg-white text-blue-600 hover:shadow-lg hover:shadow-white/25'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                            }`}
                                    >
                                        {plan.buttonText || 'Seç'}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                );


            case 'gallery':
                const images = component.data?.images || [];
                const cols = component.data?.columns || 3;
                return (
                    <div className="py-16 px-8 bg-white">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'Galeri'}</h2>
                        <div className={`grid grid-cols-${cols} gap-4 max-w-5xl mx-auto`}>
                            {(images.length > 0 ? images : [1, 2, 3, 4, 5, 6].map(i => `https://picsum.photos/400/300?random=${i}`)).map((img, i) => (
                                <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity" />
                            ))}
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="py-16 px-8 bg-gray-900">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">{component.data?.title || 'Video'}</h2>
                        <div className="max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden">
                            <iframe
                                src={component.data?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    </div>
                );

            case 'newsletter':
                return (
                    <div className="py-16 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">{component.data?.title || 'Bültene Abone Olun'}</h2>
                            <p className="opacity-90 mb-6">{component.data?.subtitle || 'Haberdar olun'}</p>
                            <div className="flex gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder={component.data?.placeholder || 'E-posta adresiniz'}
                                    className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                                />
                                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">
                                    {component.data?.buttonText || 'Abone Ol'}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="py-16 px-8 bg-gray-900 text-white">
                        <h2 className="text-3xl font-bold text-center mb-4">{component.data?.title || 'İletişim'}</h2>
                        <p className="text-center text-gray-400 mb-12">{component.data?.subtitle || 'Bizimle iletişime geçin'}</p>
                        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">E-posta</div>
                                    <div className="font-medium">{component.data?.email || 'info@example.com'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Telefon</div>
                                    <div className="font-medium">{component.data?.phone || '+90 555 123 4567'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Adres</div>
                                    <div className="font-medium">{component.data?.address || 'İstanbul, Türkiye'}</div>
                                </div>
                            </div>
                            {component.data?.showForm !== false && (
                                <div className="space-y-4">
                                    <input className="w-full p-3 bg-gray-800 rounded-lg" placeholder="Adınız" />
                                    <input className="w-full p-3 bg-gray-800 rounded-lg" placeholder="E-posta" />
                                    <textarea className="w-full p-3 bg-gray-800 rounded-lg" placeholder="Mesajınız" rows={3} />
                                    <button className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Gönder</button>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'footer':
                return (
                    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 pt-16 pb-8 px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Top Section */}
                            <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
                                {/* Brand */}
                                <div className="md:col-span-1">
                                    <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        {component.data?.logo || 'WebBuilder'}
                                    </h3>
                                    <p className="text-sm leading-relaxed mb-6">
                                        {component.data?.description || 'Modern ve profesyonel web çözümleri ile işletmenizi dijital dünyada öne çıkarıyoruz.'}
                                    </p>
                                    {/* Social Icons */}
                                    <div className="flex gap-4">
                                        {[
                                            { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                                            { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                                            { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z' },
                                            { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z' }
                                        ].map((social, i) => (
                                            <a
                                                key={i}
                                                href={`#${social.name.toLowerCase()}`}
                                                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
                                    <ul className="space-y-3">
                                        {(component.data?.quickLinks || ['Ana Sayfa', 'Hakkımızda', 'Hizmetler', 'Blog', 'İletişim']).map((link, i) => (
                                            <li key={i}>
                                                <a href={`#${link.toLowerCase().replace(/\s/g, '-')}`} className="hover:text-white transition-colors duration-200 flex items-center gap-2">
                                                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div>
                                    <h4 className="text-white font-semibold mb-4">İletişim</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3">
                                            <span className="text-blue-500">📍</span>
                                            {component.data?.address || 'İstanbul, Türkiye'}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="text-blue-500">📧</span>
                                            <a href={`mailto:${component.data?.email || 'info@webcraft.com'}`} className="hover:text-white transition-colors">
                                                {component.data?.email || 'info@webcraft.com'}
                                            </a>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="text-blue-500">📞</span>
                                            <a href={`tel:${component.data?.phone || '+90 555 123 4567'}`} className="hover:text-white transition-colors">
                                                {component.data?.phone || '+90 555 123 4567'}
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* Newsletter */}
                                <div>
                                    <h4 className="text-white font-semibold mb-4">Bültene Abone Ol</h4>
                                    <p className="text-sm mb-4">En son haberler ve güncellemeler için abone olun.</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="E-posta adresiniz"
                                            className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                        <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                            →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-sm">{component.data?.copyright || '© 2024 WebBuilder Plus. Tüm hakları saklıdır.'}</p>
                                <div className="flex gap-6 text-sm">
                                    <a href="#privacy" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                                    <a href="#terms" className="hover:text-white transition-colors">Kullanım Şartları</a>
                                    <a href="#cookies" className="hover:text-white transition-colors">Çerez Politikası</a>
                                </div>
                            </div>
                        </div>
                    </footer>
                );


            case 'divider':
                return <hr className="border-gray-200 my-4" style={{ borderColor: component.data?.color }} />;

            case 'spacer':
                return <div style={{ height: component.data?.height || 60 }} />;

            case 'text':
                return (
                    <div className={`py-8 px-8 text-${component.data?.align || 'left'}`}>
                        <p className={`text-gray-700 text-${component.data?.fontSize || 'base'}`}>
                            {component.data?.content || 'Metin içeriği...'}
                        </p>
                    </div>
                );

            case 'heading':
                const HeadingTag = component.data?.level || 'h2';
                return (
                    <div className={`py-8 px-8 text-${component.data?.align || 'center'}`}>
                        <HeadingTag className="text-3xl font-bold text-gray-800">
                            {component.data?.text || 'Başlık'}
                        </HeadingTag>
                    </div>
                );

            case 'button':
                return (
                    <div className="py-6 px-8 text-center">
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            {component.data?.text || 'Buton'}
                        </button>
                    </div>
                );

            case 'image':
                return (
                    <div className="py-4 px-8">
                        <img
                            src={component.data?.src || 'https://via.placeholder.com/800x400'}
                            alt={component.data?.alt || 'Image'}
                            className={`w-full ${component.data?.rounded ? 'rounded-xl' : ''}`}
                        />
                    </div>
                );

            case 'quote':
                return (
                    <div className="py-12 px-8 bg-gray-50">
                        <blockquote className="max-w-2xl mx-auto text-center">
                            <p className="text-2xl text-gray-700 italic mb-4">"{component.data?.text || 'Alıntı metni...'}"</p>
                            <cite className="text-gray-500">— {component.data?.author || 'Yazar'}</cite>
                        </blockquote>
                    </div>
                );

            case 'list':
                const listItems = component.data?.items || ['Öğe 1', 'Öğe 2', 'Öğe 3'];
                return (
                    <div className="py-8 px-8">
                        <h3 className="font-semibold text-gray-800 mb-4">{component.data?.title || 'Liste'}</h3>
                        <ul className="space-y-2">
                            {listItems.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-700">
                                    <span className="text-green-500">✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            case 'blog':
                const posts = component.data?.posts || [];
                return (
                    <div className="py-16 px-8 bg-white">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'Blog'}</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {(posts.length > 0 ? posts : [1, 2, 3].map(i => ({ title: `Blog ${i}`, excerpt: 'İçerik özeti...', image: `https://picsum.photos/400/250?random=${i}`, date: '1 Ocak 2024' }))).map((post, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <div className="text-sm text-gray-400 mb-2">{post.date}</div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
                                        <p className="text-sm text-gray-600">{post.excerpt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'products':
                const products = component.data?.items || [];
                return (
                    <div className="py-16 px-8 bg-gray-50">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.title || 'Ürünler'}</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {(products.length > 0 ? products : [1, 2, 3].map(i => ({ name: `Ürün ${i}`, price: '₺999', image: `https://picsum.photos/300/300?random=${i}` }))).map((product, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                        <p className="text-blue-600 font-bold">{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'map':
                const addressQuery = encodeURIComponent(component.data?.address || 'İstanbul, Türkiye');
                return (
                    <div className="py-16 px-8 bg-gray-100">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{component.data?.title || 'Konumumuz'}</h2>
                            <p className="text-center text-gray-600 mb-8">{component.data?.address || 'İstanbul, Türkiye'}</p>
                            <div className="rounded-2xl overflow-hidden shadow-lg">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${addressQuery}`}
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                );


            case 'slider':
                return (
                    <div className="relative h-96 bg-gray-900 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                            Slider / Carousel
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="py-8 px-8 bg-gray-100 text-center text-gray-500">
                        <div className="text-3xl mb-2">📦</div>
                        {component.type} bileşeni
                    </div>
                );
        }
    };


    return (
        <div
            className={`component-wrapper relative ${isSelected ? 'selected' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {getPreviewContent()}

            {/* Component Controls */}
            <div className="component-controls absolute top-2 right-2 flex gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default Builder;
