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
    // SECTIONS (12 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'hero', label: 'Hero Section', icon: Sparkles, category: 'sections' },
    { type: 'cta', label: 'CTA (Aksiyon)', icon: Target, category: 'sections' },
    { type: 'banner', label: 'Banner', icon: Award, category: 'sections' },
    { type: 'about', label: 'Hakkımızda', icon: FileText, category: 'sections' },
    { type: 'stats', label: 'İstatistikler', icon: BarChart3, category: 'sections' },
    { type: 'timeline', label: 'Zaman Çizelgesi', icon: Activity, category: 'sections' },
    { type: 'faq', label: 'SSS', icon: MessageSquare, category: 'sections' },
    { type: 'team', label: 'Ekip', icon: Users, category: 'sections' },
    { type: 'testimonials', label: 'Yorumlar', icon: Quote, category: 'sections' },
    { type: 'clients', label: 'Ortaklar', icon: Heart, category: 'sections' },
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
    { type: 'search', label: 'Arama Kutusu', icon: Search, category: 'content' },

    // ═══════════════════════════════════════════════════════════════
    // MEDIA (10 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'image', label: 'Resim', icon: Image, category: 'media' },
    { type: 'gallery', label: 'Galeri', icon: Grid, category: 'media' },
    { type: 'video', label: 'Video', icon: Video, category: 'media' },
    { type: 'slider', label: 'Slider', icon: Film, category: 'media' },
    { type: 'mediatext', label: 'Medya + Metin', icon: Columns, category: 'media' },
    { type: 'audio', label: 'Ses Oynatıcı', icon: Music, category: 'media' },

    // ═══════════════════════════════════════════════════════════════
    // WIDGETS (Removed mostly, kept internal logic)
    // ═══════════════════════════════════════════════════════════════
    // { type: 'socialicons', label: 'Sosyal İkonlar', icon: Share2, category: 'widgets' },
    // { type: 'calendar', label: 'Takvim', icon: Calendar, category: 'widgets' },
    // { type: 'archives', label: 'Arşivler', icon: Archive, category: 'widgets' },
    // { type: 'categories', label: 'Kategoriler', icon: List, category: 'widgets' },
    // { type: 'latestposts', label: 'Son Yazılar', icon: FileText, category: 'widgets' },
    // { type: 'customhtml', label: 'Özel HTML', icon: FileCode, category: 'widgets' },
    // { type: 'weather', label: 'Hava Durumu', icon: Globe, category: 'widgets' },

    // ═══════════════════════════════════════════════════════════════
    // E-COMMERCE (5 components)
    // ═══════════════════════════════════════════════════════════════
    { type: 'pricing', label: 'Fiyatlandırma', icon: Coins, category: 'commerce' },
    { type: 'products', label: 'Ürünler', icon: ShoppingBag, category: 'commerce' },
    { type: 'productcard', label: 'Ürün Kartı', icon: ShoppingCart, category: 'commerce' },
    { type: 'productgrid', label: 'Ürün Grid', icon: Grid, category: 'commerce' },
    { type: 'pricedisplay', label: 'Fiyat Göster', icon: Tag, category: 'commerce' },
    { type: 'salebadge', label: 'İndirim Rozeti', icon: Percent, category: 'commerce' },


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

        addComponent: addComponentStore,
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

    // Sidebar State
    const [expandedCategories, setExpandedCategories] = useState({
        layout: true,
        sections: true,
        media: false,
        content: false,
        widgets: false,
        commerce: false,
        forms: false
    });

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Enhanced addComponent with auto-scroll
    const addComponent = (component) => {
        addComponentStore(component);

        // Auto-scroll to the new component
        setTimeout(() => {
            const element = document.getElementById(component.id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Briefly flash the element to highlight it
                element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2', 'ring-offset-dark-900');
                setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2', 'ring-offset-dark-900');
                }, 1000);
            }
        }, 100);
    };

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
                    { name: 'Ali Öztürk', text: 'Harika bir ekip! Projemizi zamanında ve mükemmel bir şekilde teslim ettiler.', rating: 5 },
                    { name: 'Fatma Korkmaz', text: 'Profesyonel yaklaşımları ve yaratıcı çözümleri ile beklentilerimizi aştılar.', rating: 5 },
                    { name: 'Burak Şahin', text: 'E-ticaret sitemiz sayesinde satışlarımız %200 arttı. Teşekkürler!', rating: 5 }
                ]
            },
            clients: {
                title: 'Güvenilir İş Ortaklarımız',
                partners: [
                    { name: 'Google', logo: '' },
                    { name: 'Microsoft', logo: '' },
                    { name: 'Amazon', logo: '' },
                    { name: 'Apple', logo: '' },
                    { name: 'Meta', logo: '' }
                ]
            },

            // Widgets Defaults
            search: {
                placeholder: 'Sitede ara...',
                buttonText: 'Ara',
                style: 'minimal' // minimal, rounded, classic
            },
            socialicons: {
                style: 'circle', // circle, square, minimal
                color: 'brand', // brand, custom
                icons: [
                    { network: 'facebook', url: '#' },
                    { network: 'twitter', url: '#' },
                    { network: 'instagram', url: '#' },
                    { network: 'linkedin', url: '#' }
                ]
            },
            calendar: {
                title: 'Takvim',
                events: [
                    { day: 15, title: 'Toplantı' },
                    { day: 22, title: 'Proje Teslimi' }
                ]
            },
            archives: {
                title: 'Arşivler',
                style: 'list',
                items: [
                    { label: 'Mart 2024', count: 12 },
                    { label: 'Şubat 2024', count: 8 },
                    { label: 'Ocak 2024', count: 15 },
                    { label: 'Aralık 2023', count: 22 }
                ]
            },
            categories: {
                title: 'Kategoriler',
                style: 'badges', // list, badges
                items: [
                    { label: 'Teknoloji', count: 45 },
                    { label: 'Tasarım', count: 28 },
                    { label: 'Yazılım', count: 32 },
                    { label: 'Pazarlama', count: 15 }
                ]
            },
            latestposts: {
                title: 'Son Yazılar',
                showImage: true,
                count: 3,
                posts: [
                    { title: 'Modern Web Tasarım Trendleri', date: '12 Mart 2024', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150' },
                    { title: 'SEO İpuçları 2024', date: '08 Mart 2024', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=150' },
                    { title: 'React Performance Optimizasyonu', date: '01 Mart 2024', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150' }
                ]
            },
            customhtml: {
                title: 'Özel HTML',
                code: '<div style="padding: 20px; background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; color: #15803d; text-align: center;">\n  <strong>🎉 Özel HTML Alanı</strong>\n  <p>Buraya kendi HTML/CSS kodlarınızı ekleyebilirsiniz.</p>\n</div>'
            },
            weather: {
                city: 'Istanbul',
                unit: 'C',
                style: 'card' // card, minimal
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
            audio: {
                title: 'Podcast Bölüm 1',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            },
            mediatext: {
                title: 'Görsel ve Metin',
                content: 'Buraya görselinizle ilgili etkileyici bir açıklama metni ekleyin. Ürünlerinizi veya hizmetlerinizi detaylıca tanıtmak için harika bir alan.',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
                imagePos: 'left'
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

                            <div className="space-y-2">
                                {COMPONENT_CATEGORIES.map((category) => (
                                    <div key={category.id} className="rounded-lg overflow-hidden bg-dark-800/30 border border-dark-700/50">
                                        <button
                                            onClick={() => toggleCategory(category.id)}
                                            className="w-full flex items-center justify-between p-3 hover:bg-dark-800 transition-colors"
                                        >
                                            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${category.color}`}>
                                                <category.icon className="w-3.5 h-3.5" />
                                                {category.label}
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-dark-400 transition-transform duration-200 ${expandedCategories[category.id] ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {expandedCategories[category.id] && (
                                            <div className="p-2 border-t border-dark-700/50 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                                                {COMPONENT_TYPES.filter(c => c.category === category.id).map((comp) => (
                                                    <div
                                                        key={comp.type}
                                                        draggable
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.setData('componentType', comp.type);
                                                        }}
                                                        className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:border-dark-500 group relative text-center"
                                                        onClick={() => {
                                                            const newComponent = {
                                                                id: `${comp.type}-${Date.now()}`,
                                                                type: comp.type,
                                                                data: getDefaultComponentData(comp.type)
                                                            };
                                                            addComponent(newComponent);
                                                        }}
                                                    >
                                                        <comp.icon className={`w-6 h-6 mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity ${category.color.replace('text-', 'text-')}`} />
                                                        <span className="text-[10px] sm:text-xs text-dark-300 font-medium block truncate">
                                                            {comp.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
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
        console.log('🔍 PropertyEditor - Component Type:', component.type, 'Data:', component.data);
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
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
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
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Müşteri Yorumları"
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
                            <label className="block text-xs text-dark-400 mb-2">Müşteri Yorumları</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Yorum {index + 1}</span>
                                            <button
                                                onClick={() => removeArrayItem('items', index)}
                                                className="text-red-400 hover:text-red-300 text-xs"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => updateArrayItem('items', index, { ...item, name: e.target.value })}
                                            placeholder="Müşteri Adı"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <input
                                            type="text"
                                            value={item.company || ''}
                                            onChange={(e) => updateArrayItem('items', index, { ...item, company: e.target.value })}
                                            placeholder="Şirket / Ünvan"
                                            className="hidden" // Hiding entirely as requested
                                        />
                                        <textarea
                                            value={item.text || ''}
                                            onChange={(e) => updateArrayItem('items', index, { ...item, text: e.target.value })}
                                            placeholder="Yorum metni..."
                                            rows={2}
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white resize-none"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { name: '', text: '' })}
                                    className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                                >
                                    + Yorum Ekle
                                </button>
                            </div>
                        </div>
                    </>
                );



            case 'faq':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Sıkça Sorulan Sorular"
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
                            <label className="block text-xs text-dark-400 mb-2">Sorular</label>
                            <div className="space-y-3">
                                {(component.data?.items || []).map((item, index) => (
                                    <div key={index} className="p-3 bg-dark-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-dark-400">Soru {index + 1}</span>
                                            <button
                                                onClick={() => removeArrayItem('items', index)}
                                                className="text-red-400 hover:text-red-300 text-xs"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.question || ''}
                                            onChange={(e) => updateArrayItem('items', index, { ...item, question: e.target.value })}
                                            placeholder="Soru"
                                            className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                        <textarea
                                            value={item.answer || ''}
                                            onChange={(e) => updateArrayItem('items', index, { ...item, answer: e.target.value })}
                                            placeholder="Cevap"
                                            rows={2}
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white resize-none"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { question: '', answer: '' })}
                                    className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                                >
                                    + Soru Ekle
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
                                        <input
                                            type="text"
                                            value={item.link || ''}
                                            onChange={(e) => {
                                                const newItems = [...(component.data?.items || [])];
                                                newItems[index] = { ...newItems[index], link: e.target.value };
                                                updateField('items', newItems);
                                            }}
                                            placeholder="Ürün/Sepet Linki"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('items', { name: '', price: '', image: '', link: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Ürün Ekle
                                </button>
                            </div>
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🛒 Sepet Ayarları</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                                    <input
                                        type="text"
                                        value={component.data?.subtitle || ''}
                                        onChange={(e) => updateField('subtitle', e.target.value)}
                                        placeholder="En popüler ürünlerimiz..."
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                                    <input
                                        type="text"
                                        value={component.data?.buttonText || ''}
                                        onChange={(e) => updateField('buttonText', e.target.value)}
                                        placeholder="Sepete Ekle"
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Varsayılan Sepet Linki</label>
                                    <input
                                        type="text"
                                        value={component.data?.cartLink || ''}
                                        onChange={(e) => updateField('cartLink', e.target.value)}
                                        placeholder="https://shop.com/cart"
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
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
                                value={component.data?.style || 'solid'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="solid">Düz Çizgi</option>
                                <option value="dashed">Kesikli</option>
                                <option value="dotted">Noktalı</option>
                                <option value="double">Çift Çizgi</option>
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
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Kalınlık (px)</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={component.data?.thickness || 2}
                                onChange={(e) => updateField('thickness', parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-xs text-dark-500 text-center">{component.data?.thickness || 2}px</div>
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

            case 'columns':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sütun Sayısı</label>
                            <select
                                value={component.data?.count || 2}
                                onChange={(e) => updateField('count', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value={2}>2 Sütun</option>
                                <option value={3}>3 Sütun</option>
                                <option value={4}>4 Sütun</option>
                                <option value={5}>5 Sütun</option>
                                <option value={6}>6 Sütun</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Sütun Arası Boşluk</label>
                            <select
                                value={component.data?.gap || 'normal'}
                                onChange={(e) => updateField('gap', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="none">Yok</option>
                                <option value="small">Küçük (8px)</option>
                                <option value="normal">Normal (16px)</option>
                                <option value="large">Büyük (32px)</option>
                            </select>
                        </div>
                        <div className="p-3 bg-dark-800/50 rounded-lg">
                            <p className="text-xs text-dark-400">
                                📌 Grid düzeni ile içerikleri düzenleyebilirsiniz.
                            </p>
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
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🛒 Sepet Ayarları</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                                    <input
                                        type="text"
                                        value={component.data?.buttonText || ''}
                                        onChange={(e) => updateField('buttonText', e.target.value)}
                                        placeholder="Sepete Ekle"
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Sepet Linki</label>
                                    <input
                                        type="text"
                                        value={component.data?.cartLink || ''}
                                        onChange={(e) => updateField('cartLink', e.target.value)}
                                        placeholder="https://shop.com/cart?add=..."
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
                            </div>
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
                                        <input
                                            type="text"
                                            value={product.link || ''}
                                            onChange={(e) => {
                                                const newProducts = [...(component.data?.products || [])];
                                                newProducts[index] = { ...newProducts[index], link: e.target.value };
                                                updateField('products', newProducts);
                                            }}
                                            placeholder="Ürün/Sepet Linki"
                                            className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addArrayItem('products', { name: '', price: '', image: '', link: '' })}
                                    className="w-full py-2 text-xs text-primary-400 hover:bg-primary-500/10 border border-dashed border-dark-600 rounded-lg"
                                >
                                    + Ürün Ekle
                                </button>
                            </div>
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🛒 Sepet Ayarları</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                                    <input
                                        type="text"
                                        value={component.data?.subtitle || ''}
                                        onChange={(e) => updateField('subtitle', e.target.value)}
                                        placeholder="En çok satanlar..."
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                                    <input
                                        type="text"
                                        value={component.data?.buttonText || ''}
                                        onChange={(e) => updateField('buttonText', e.target.value)}
                                        placeholder="Sepete Ekle"
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Varsayılan Sepet Linki</label>
                                    <input
                                        type="text"
                                        value={component.data?.cartLink || ''}
                                        onChange={(e) => updateField('cartLink', e.target.value)}
                                        placeholder="https://shop.com/cart"
                                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                    />
                                </div>
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
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🔗 Link Ayarları</p>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Sepet/Ürün Linki</label>
                                <input
                                    type="text"
                                    value={component.data?.link || ''}
                                    onChange={(e) => updateField('link', e.target.value)}
                                    placeholder="https://shop.com/cart"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
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
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">⏱️ Geri Sayım Kontrolü</p>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (!component.data?.targetDate) {
                                                // Set target to 24 hours from now if no date set
                                                const target = new Date(Date.now() + 24 * 60 * 60 * 1000);
                                                updateField('targetDate', target.toISOString());
                                            }
                                            updateField('isActive', true);
                                        }}
                                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${component.data?.isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                                            }`}
                                    >
                                        ▶️ Başlat
                                    </button>
                                    <button
                                        onClick={() => updateField('isActive', false)}
                                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${!component.data?.isActive
                                            ? 'bg-red-600 text-white'
                                            : 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white'
                                            }`}
                                    >
                                        ⏸️ Durdur
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const target = new Date(Date.now() + 1 * 60 * 60 * 1000);
                                            updateField('targetDate', target.toISOString());
                                            updateField('isActive', true);
                                        }}
                                        className="py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded-lg text-xs transition-colors"
                                    >
                                        1 Saat
                                    </button>
                                    <button
                                        onClick={() => {
                                            const target = new Date(Date.now() + 24 * 60 * 60 * 1000);
                                            updateField('targetDate', target.toISOString());
                                            updateField('isActive', true);
                                        }}
                                        className="py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded-lg text-xs transition-colors"
                                    >
                                        24 Saat
                                    </button>
                                    <button
                                        onClick={() => {
                                            const target = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                                            updateField('targetDate', target.toISOString());
                                            updateField('isActive', true);
                                        }}
                                        className="py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded-lg text-xs transition-colors"
                                    >
                                        1 Hafta
                                    </button>
                                </div>
                                {component.data?.isActive && component.data?.targetDate && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                        <p className="text-xs text-emerald-400">
                                            ✓ Geri sayım aktif: {new Date(component.data.targetDate).toLocaleString('tr-TR')} tarihine kadar
                                        </p>
                                    </div>
                                )}
                            </div>
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
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🎨 Renk Ayarları</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Arkaplan</label>
                                    <input
                                        type="color"
                                        value={component.data?.bgColor || '#f8fafc'}
                                        onChange={(e) => updateField('bgColor', e.target.value)}
                                        className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Buton Rengi</label>
                                    <input
                                        type="color"
                                        value={component.data?.buttonColor || '#4f46e5'}
                                        onChange={(e) => updateField('buttonColor', e.target.value)}
                                        className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🔗 Link Ayarları</p>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Buton Linki (Form Action)</label>
                                <input
                                    type="text"
                                    value={component.data?.buttonLink || ''}
                                    onChange={(e) => updateField('buttonLink', e.target.value)}
                                    placeholder="https://yoursite.com/login"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showRegisterLink !== false}
                                    onChange={(e) => updateField('showRegisterLink', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Kayıt Bağlantısı Göster
                            </label>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showForgotPassword !== false}
                                    onChange={(e) => updateField('showForgotPassword', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Şifremi Unuttum Bağlantısı Göster
                            </label>
                        </div>
                    </>
                );

            case 'contact':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Bize Ulaşın"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <input
                                type="text"
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                placeholder="Size yardımcı olmaktan mutluluk duyarız"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                placeholder="Gönder"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🎨 Renk Ayarları</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Arkaplan</label>
                                    <input
                                        type="color"
                                        value={component.data?.bgColor || '#1f2937'}
                                        onChange={(e) => updateField('bgColor', e.target.value)}
                                        className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Buton Rengi</label>
                                    <input
                                        type="color"
                                        value={component.data?.buttonColor || '#3b82f6'}
                                        onChange={(e) => updateField('buttonColor', e.target.value)}
                                        className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🔗 Link Ayarları</p>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Form Gönderim Linki</label>
                                <input
                                    type="text"
                                    value={component.data?.buttonLink || ''}
                                    onChange={(e) => updateField('buttonLink', e.target.value)}
                                    placeholder="https://formspree.io/yourform"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showForm !== false}
                                    onChange={(e) => updateField('showForm', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Form Göster
                            </label>
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
                                placeholder="Bültene Abone Ol"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Açıklama</label>
                            <input
                                type="text"
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                placeholder="En son haberler ve güncellemeler için..."
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                placeholder="Abone Ol"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={component.data?.placeholder || ''}
                                onChange={(e) => updateField('placeholder', e.target.value)}
                                placeholder="E-posta adresiniz"
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🎨 Renk Ayarları</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Arkaplan</label>
                                    <input
                                        type="color"
                                        value={component.data?.bgColor || '#4f46e5'}
                                        onChange={(e) => updateField('bgColor', e.target.value)}
                                        className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-dark-400 mb-1">Buton Rengi</label>
                                    <input
                                        type="color"
                                        value={component.data?.buttonColor || '#ffffff'}
                                        onChange={(e) => updateField('buttonColor', e.target.value)}
                                        className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-dark-700 pt-4 mt-4">
                            <p className="text-xs text-primary-400 font-medium mb-3">🔗 Link Ayarları</p>
                            <div>
                                <label className="block text-xs text-dark-400 mb-1">Form Gönderim Linki</label>
                                <input
                                    type="text"
                                    value={component.data?.buttonLink || ''}
                                    onChange={(e) => updateField('buttonLink', e.target.value)}
                                    placeholder="https://mailchimp.com/yourlist"
                                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                />
                            </div>
                        </div>
                    </>
                );

            // ═══════════════════════════════════════════════════════════════
            // SECTIONS - CTA, Banner, Features, Portfolio
            // ═══════════════════════════════════════════════════════════════
            case 'cta':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Harekete Geçin!"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arkaplan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#3b82f6'}
                                onChange={(e) => updateField('bgColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <input
                                type="text"
                                value={component.data?.subtitle || ''}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Hemen başlamak için tıklayın"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Metni</label>
                            <input
                                type="text"
                                value={component.data?.buttonText || ''}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Şimdi Başla"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Buton Linki</label>
                            <input
                                type="text"
                                value={component.data?.buttonLink || ''}
                                onChange={(e) => updateField('buttonLink', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="https://..."
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
                    </>
                );

            case 'banner':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Banner Metni</label>
                            <input
                                type="text"
                                value={component.data?.text || ''}
                                onChange={(e) => updateField('text', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Önemli duyuru metni..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Link Metni</label>
                            <input
                                type="text"
                                value={component.data?.linkText || ''}
                                onChange={(e) => updateField('linkText', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Daha fazla bilgi"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Link URL</label>
                            <input
                                type="text"
                                value={component.data?.linkUrl || ''}
                                onChange={(e) => updateField('linkUrl', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Banner Tipi</label>
                            <select
                                value={component.data?.type || 'info'}
                                onChange={(e) => updateField('type', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="info">Bilgi (Mavi)</option>
                                <option value="success">Başarı (Yeşil)</option>
                                <option value="warning">Uyarı (Sarı)</option>
                                <option value="error">Hata (Kırmızı)</option>
                                <option value="promo">Promosyon (Mor)</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.dismissible || false}
                                    onChange={(e) => updateField('dismissible', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Kapatılabilir (Metni Gizle)
                            </label>
                        </div>
                    </>
                );

            case 'about':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.sectionTitle || ''}
                                onChange={(e) => updateField('sectionTitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Biz Kimiz?"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık Rengi</label>
                            <input
                                type="color"
                                value={component.data?.titleColor || '#1f2937'}
                                onChange={(e) => updateField('titleColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">İçerik Metni</label>
                            <textarea
                                value={component.data?.content || ''}
                                onChange={(e) => updateField('content', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500 resize-none"
                                placeholder="Şirketiniz hakkında bilgi..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Resim URL</label>
                            <input
                                type="text"
                                value={component.data?.image || ''}
                                onChange={(e) => updateField('image', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="https://..."
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
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showTitle !== false}
                                    onChange={(e) => updateField('showTitle', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Başlığı Göster
                            </label>
                        </div>
                    </>
                );

            case 'stats':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.sectionTitle || ''}
                                onChange={(e) => updateField('sectionTitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Rakamlarla Biz"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Arkaplan Rengi</label>
                            <input
                                type="color"
                                value={component.data?.bgColor || '#1e40af'}
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
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">İstatistikler</label>
                            {(component.data?.stats || []).map((stat, index) => (
                                <div key={index} className="mb-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-dark-400">İstatistik {index + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('stats', index)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={stat.value || ''}
                                        onChange={(e) => updateArrayItem('stats', index, { ...stat, value: e.target.value })}
                                        placeholder="Değer (örn: 100+)"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={stat.label || ''}
                                        onChange={(e) => updateArrayItem('stats', index, { ...stat, label: e.target.value })}
                                        placeholder="Etiket (örn: Mutlu Müşteri)"
                                        className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('stats', { value: '', label: '' })}
                                className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                            >
                                + İstatistik Ekle
                            </button>
                        </div>
                    </>
                );

            case 'timeline':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.sectionTitle || ''}
                                onChange={(e) => updateField('sectionTitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Tarihçemiz"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Yıl/Tarih Rengi</label>
                            <input
                                type="color"
                                value={component.data?.yearColor || '#3b82f6'}
                                onChange={(e) => updateField('yearColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Nokta/Çizgi Rengi</label>
                            <input
                                type="color"
                                value={component.data?.dotColor || '#3b82f6'}
                                onChange={(e) => updateField('dotColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
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
                            <label className="block text-xs text-dark-400 mb-2">Zaman Çizelgesi Öğeleri</label>
                            {(component.data?.items || []).map((item, index) => (
                                <div key={index} className="mb-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-dark-400">Öğe {index + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('items', index)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={item.year || ''}
                                        onChange={(e) => updateArrayItem('items', index, { ...item, year: e.target.value })}
                                        placeholder="Yıl (örn: 2020)"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={item.title || ''}
                                        onChange={(e) => updateArrayItem('items', index, { ...item, title: e.target.value })}
                                        placeholder="Başlık"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <textarea
                                        value={item.description || ''}
                                        onChange={(e) => updateArrayItem('items', index, { ...item, description: e.target.value })}
                                        placeholder="Açıklama"
                                        rows={2}
                                        className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white resize-none"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('items', { year: '', title: '', description: '' })}
                                className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                            >
                                + Zaman Öğesi Ekle
                            </button>
                        </div>
                    </>
                );

            case 'clients':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.sectionTitle || ''}
                                onChange={(e) => updateField('sectionTitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Güvenilir İş Ortaklarımız"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık Rengi</label>
                            <input
                                type="color"
                                value={component.data?.titleColor || '#1f2937'}
                                onChange={(e) => updateField('titleColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Ortak/Logo Metin Rengi</label>
                            <input
                                type="color"
                                value={component.data?.partnerTextColor || '#6b7280'}
                                onChange={(e) => updateField('partnerTextColor', e.target.value)}
                                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer"
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
                            <label className="block text-xs text-dark-400 mb-2">Ortaklar</label>
                            {(component.data?.partners || []).map((partner, index) => (
                                <div key={index} className="mb-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-dark-400">Ortak {index + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('partners', index)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={partner.name || ''}
                                        onChange={(e) => updateArrayItem('partners', index, { ...partner, name: e.target.value })}
                                        placeholder="Ortak Adı"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={partner.logo || ''}
                                        onChange={(e) => updateArrayItem('partners', index, { ...partner, logo: e.target.value })}
                                        placeholder="Logo URL (Boş bırakılabilir)"
                                        className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('partners', { name: '', logo: '' })}
                                className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                            >
                                + Ortak Ekle
                            </button>
                        </div>
                    </>
                );

            case 'portfolio':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Bölüm Başlığı</label>
                            <input
                                type="text"
                                value={component.data?.sectionTitle || ''}
                                onChange={(e) => updateField('sectionTitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Portfolyo"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Alt Başlık</label>
                            <input
                                type="text"
                                value={component.data?.sectionSubtitle || ''}
                                onChange={(e) => updateField('sectionSubtitle', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="Son projelerimiz"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Grid Sütun Sayısı</label>
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
                            <label className="block text-xs text-dark-400 mb-2">Projeler</label>
                            {(component.data?.projects || []).map((project, index) => (
                                <div key={index} className="mb-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-dark-400">Proje {index + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('projects', index)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={project.title || ''}
                                        onChange={(e) => updateArrayItem('projects', index, { ...project, title: e.target.value })}
                                        placeholder="Proje Adı"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={project.category || ''}
                                        onChange={(e) => updateArrayItem('projects', index, { ...project, category: e.target.value })}
                                        placeholder="Kategori (örn: Web Tasarım)"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={project.image || ''}
                                        onChange={(e) => updateArrayItem('projects', index, { ...project, image: e.target.value })}
                                        placeholder="Resim URL"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={project.link || ''}
                                        onChange={(e) => updateArrayItem('projects', index, { ...project, link: e.target.value })}
                                        placeholder="Proje Linki"
                                        className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('projects', { title: '', category: '', image: '', link: '' })}
                                className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                            >
                                + Proje Ekle
                            </button>
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
                        <div>
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showFilter || false}
                                    onChange={(e) => updateField('showFilter', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Kategori Filtresi Göster
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
            case 'slider':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-2">Slayt Görselleri</label>
                            {(component.data?.images || []).map((img, index) => (
                                <div key={index} className="mb-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-dark-400">Slayt {index + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('images', index)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={img.src || ''}
                                        onChange={(e) => updateArrayItem('images', index, { ...img, src: e.target.value })}
                                        placeholder="Görsel URL"
                                        className="w-full px-2 py-1.5 mb-2 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <input
                                        type="text"
                                        value={img.title || ''}
                                        onChange={(e) => updateArrayItem('images', index, { ...img, title: e.target.value })}
                                        placeholder="Başlık (Opsiyonel)"
                                        className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('images', { src: '', title: '' })}
                                className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                            >
                                + Slayt Ekle
                            </button>
                        </div>
                        <div className="pt-2 border-t border-dark-700">
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

            case 'mediatext':
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
                            <label className="block text-xs text-dark-400 mb-1">Görsel URL</label>
                            <input
                                type="text"
                                value={component.data?.image || ''}
                                onChange={(e) => updateField('image', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Görsel Konumu</label>
                            <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
                                <button
                                    onClick={() => updateField('imagePos', 'left')}
                                    className={`flex-1 py-1.5 text-xs rounded transition-colors ${component.data?.imagePos !== 'right' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'}`}
                                >
                                    Sol
                                </button>
                                <button
                                    onClick={() => updateField('imagePos', 'right')}
                                    className={`flex-1 py-1.5 text-xs rounded transition-colors ${component.data?.imagePos === 'right' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'}`}
                                >
                                    Sağ
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'audio':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Ses Dosyası URL</label>
                            <input
                                type="text"
                                value={component.data?.url || ''}
                                onChange={(e) => updateField('url', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={component.data?.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            />
                        </div>
                    </>
                );

            // Widgets Editors
            case 'search':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Yer Tutucu Metni</label>
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
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'minimal'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="minimal">Minimal</option>
                                <option value="rounded">Yuvarlak</option>
                                <option value="classic">Klasik</option>
                            </select>
                        </div>
                    </>
                );

            case 'socialicons':
                return (
                    <>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'circle'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="circle">Daire</option>
                                <option value="square">Kare</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Renk</label>
                            <select
                                value={component.data?.color || 'brand'}
                                onChange={(e) => updateField('color', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="brand">Marka Renkleri</option>
                                <option value="custom">Özel (Siyah/Beyaz)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs text-dark-400">İkonlar</label>
                            {(component.data?.icons || []).map((icon, index) => (
                                <div key={index} className="flex gap-2">
                                    <select
                                        value={icon.network}
                                        onChange={(e) => updateArrayItem('icons', index, { ...icon, network: e.target.value })}
                                        className="w-1/3 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    >
                                        <option value="facebook">Facebook</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="linkedin">LinkedIn</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={icon.url}
                                        onChange={(e) => updateArrayItem('icons', index, { ...icon, url: e.target.value })}
                                        placeholder="URL"
                                        className="flex-1 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                                    />
                                    <button
                                        onClick={() => removeArrayItem('icons', index)}
                                        className="p-1.5 text-red-400 hover:bg-dark-600 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => addArrayItem('icons', { network: 'facebook', url: '#' })}
                                className="w-full py-2 border border-dashed border-dark-600 rounded-lg text-dark-400 hover:text-white hover:border-primary-500 text-sm transition-colors"
                            >
                                + İkon Ekle
                            </button>
                        </div>
                    </>
                );

            case 'calendar':
                return (
                    <div>
                        <label className="block text-xs text-dark-400 mb-1">Başlık</label>
                        <input
                            type="text"
                            value={component.data?.title || ''}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                        />
                    </div>
                );

            case 'archives':
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
                            <label className="block text-xs text-dark-400 mb-1">Görünüm</label>
                            <select
                                value={component.data?.style || 'list'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="list">Liste</option>
                                <option value="badges">Etiketler</option>
                            </select>
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
                            <label className="block text-xs text-dark-400 mb-1">Gösterilecek Sayı: {component.data?.count || 3}</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={component.data?.count || 3}
                                onChange={(e) => updateField('count', parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="pt-2">
                            <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={component.data?.showImage !== false}
                                    onChange={(e) => updateField('showImage', e.target.checked)}
                                    className="rounded border-dark-600"
                                />
                                Görselleri Göster
                            </label>
                        </div>
                    </>
                );

            case 'customhtml':
                return (
                    <div>
                        <label className="block text-xs text-dark-400 mb-1">HTML Kodu</label>
                        <textarea
                            value={component.data?.code || ''}
                            onChange={(e) => updateField('code', e.target.value)}
                            rows={10}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white font-mono focus:border-primary-500 resize-y"
                            placeholder="<div>...</div>"
                        />
                        <p className="text-xs text-dark-500 mt-1">Güvenlik uyarısı: Sadece güvenilir kaynaklardan kod ekleyin.</p>
                    </div>
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
                            <label className="block text-xs text-dark-400 mb-1">Stil</label>
                            <select
                                value={component.data?.style || 'card'}
                                onChange={(e) => updateField('style', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:border-primary-500"
                            >
                                <option value="card">Kart (Görsel)</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>
                    </>
                );


        }
    };

    return (
        <aside className="hidden lg:block w-80 bg-dark-900 border-l border-dark-800 overflow-y-auto flex-shrink-0">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Özellikler</h3>
                    <button onClick={onClose} className="p-1 text-dark-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

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

                <div className="space-y-4">
                    {renderFields()}
                </div>

                <div className="mt-6 pt-4 border-t border-dark-700">
                    <button
                        onClick={() => {
                            if (window.confirm('Bu bileşeni silmek istediğinizden emin misiniz?')) {
                                deleteComponent(component.id);
                                onClose();
                            }
                        }}
                        className="w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                        Bileşeni Sil
                    </button>
                </div>
            </div>
        </aside>
    );
};

// ==========================================
// INTERACTIVE WIDGET COMPONENTS
// ==========================================

const WidgetSearch = ({ data }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Mock search logic
    useEffect(() => {
        if (query.length > 1) {
            setIsSearching(true);
            const debounce = setTimeout(() => {
                setResults([
                    `Sonuç: ${query} hakkında makale`,
                    `Ürün: ${query} Pro`,
                    `Kategori: ${query} Listesi`
                ]);
                setIsSearching(false);
                setShowResults(true);
            }, 600);
            return () => clearTimeout(debounce);
        } else {
            setResults([]);
            setShowResults(false);
        }
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`"${query}" için tüm sonuçlar listeleniyor... (Demo)`);
        setShowResults(false);
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative z-20">
            <form
                onSubmit={handleSearch}
                className={`relative flex items-center ${data?.style === 'rounded' ? 'rounded-full' : data?.style === 'classic' ? 'rounded-none' : 'rounded-lg'} overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 transition-all`}
                onClick={(e) => e.stopPropagation()} // Stop propagation on container
            >
                <Search className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    placeholder={data?.placeholder || 'Ara...'}
                    className="w-full py-3 pl-10 pr-4 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isSearching}
                    className={`px-6 py-3 font-medium text-white transition-colors ${data?.style === 'rounded' ? 'rounded-full my-1 mr-1' : ''} bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                    {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        data?.buttonText || 'Ara'
                    )}
                </button>
            </form>

            {/* Mock Dropdown Results */}
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                    <ul>
                        {results.map((res, i) => (
                            <li
                                key={i}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    alert(`"${res}" seçildi.`);
                                    setQuery('');
                                    setShowResults(false);
                                }}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2 border-b border-gray-50 last:border-0 transition-colors"
                            >
                                <Search className="w-3 h-3 text-gray-400" />
                                {res}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const WidgetSocial = ({ data }) => {
    return (
        <div className="p-4 flex gap-3 flex-wrap justify-center bg-white/50 rounded-xl backdrop-blur-sm">
            {(data?.icons || []).map((icon, i) => (
                <a
                    key={i}
                    href={icon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Optional: Simulating link click behavior for demo if href is '#'
                        if (icon.url === '#' || !icon.url) {
                            e.preventDefault();
                            alert(`${icon.network} bağlantısına tıklandı.`);
                        }
                    }}
                    className={`flex items-center justify-center w-10 h-10 transition-all transform hover:scale-110 active:scale-95 duration-200 shadow-sm hover:shadow-md ${data?.style === 'circle' ? 'rounded-full' : data?.style === 'square' ? 'rounded-lg' : 'rounded-none'} ${data?.color === 'brand' ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white'}`}
                >
                    {icon.network === 'facebook' && <span className="font-bold">f</span>}
                    {icon.network === 'twitter' && <span className="font-bold">t</span>}
                    {icon.network === 'instagram' && <span className="font-bold">ig</span>}
                    {icon.network === 'linkedin' && <span className="font-bold">in</span>}
                </a>
            ))}
        </div>
    );
};

const WidgetCalendar = ({ data }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    // Generate real days for current month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Turkish (Mon=0) logic if needed, but let's stick to standard grid

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate)); // Create new Date object to force re-render
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                >
                    ←
                </button>
                <h3 className="font-bold text-lg text-gray-800 cursor-pointer select-none" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date()); }}>
                    {data?.title || currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                    onClick={(e) => { e.stopPropagation(); changeMonth(1); }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                >
                    →
                </button>
                {/* Traffic Lights Decoration */}
                {/* <div className="flex gap-1 ml-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                </div> */}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2 select-none">
                {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => (
                    <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty cells for start of month */}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    // Check if is Today
                    const isToday = day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    const isSelected = selectedDay === day;

                    const hasEvent = data?.events?.some(e => e.day === day);

                    return (
                        <div
                            key={day}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDay(day);
                            }}
                            className={`text-sm w-8 h-8 mx-auto flex items-center justify-center rounded-full relative cursor-pointer transition-all duration-200
                                ${isSelected ? 'bg-primary-600 text-white font-bold shadow-md transform scale-110' :
                                    isToday ? 'bg-primary-100 text-primary-700 font-bold box-border border-2 border-primary-200' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {day}
                            {hasEvent && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full"></span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const WidgetList = ({ data, type }) => {
    const isBadges = data?.style === 'badges';
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2">{data?.title}</h3>
            <div className={isBadges ? "flex flex-wrap gap-2" : "space-y-2"}>
                {(data?.items || []).map((item, i) => (
                    isBadges ? (
                        <span
                            key={i}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                alert(`${item.label} (${item.count}) filtrelendi.`);
                            }}
                            className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-medium hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors border border-gray-100 select-none"
                        >
                            {item.label} <span className="text-gray-400 text-xs ml-1">({item.count})</span>
                        </span>
                    ) : (
                        <div
                            key={i}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                alert(`${item.label} arşivine gidiliyor.`);
                            }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors select-none"
                        >
                            <span className="text-gray-600 group-hover:text-primary-600 font-medium transition-colors">{item.label}</span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">{item.count}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

const WidgetPosts = ({ data }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-4">{data?.title}</h3>
            <div className="space-y-4">
                {(data?.posts || []).slice(0, data?.count || 3).map((post, i) => (
                    <div
                        key={i}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`"${post.title}" yazısı açılıyor...`);
                        }}
                        className="flex gap-4 group cursor-pointer bg-transparent hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
                    >
                        {data?.showImage && (
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden relative shadow-sm">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="text-xs text-primary-600 font-medium mb-1">{post.date}</div>
                            <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WidgetWeather = ({ data }) => {
    const [time, setTime] = useState(new Date());
    const [unit, setUnit] = useState('C'); // C or F

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000); // Live seconds
        return () => clearInterval(timer);
    }, []);

    const toggleUnit = (e) => {
        e.stopPropagation();
        setUnit(prev => prev === 'C' ? 'F' : 'C');
    };

    const isCard = data?.style === 'card';
    const formattedTime = time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Values
    const tempC = 24;
    const tempF = Math.round((tempC * 9 / 5) + 32);
    const displayTemp = unit === 'C' ? tempC : tempF;

    return isCard ? (
        <div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-white shadow-xl group cursor-pointer"
            onClick={toggleUnit}
        >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors duration-500"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">{data?.city}</h3>
                        <p className="text-blue-100 text-sm font-medium font-mono">{formattedTime} • Parçalı Bulutlu</p>
                    </div>
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl group-hover:bg-white/30 transition-colors shadow-lg">
                        <Globe className="w-8 h-8 text-white animate-pulse" />
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-6xl font-bold tracking-tighter transition-all duration-300">
                            {displayTemp}<span className="text-4xl align-top">°{unit}</span>
                        </span>
                        <span className="text-blue-100 text-sm mt-1">Hissedilen: {unit === 'C' ? 26 : Math.round((26 * 9 / 5) + 32)}°</span>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="text-sm text-blue-100">Nem: %45</div>
                        <div className="text-sm text-blue-100">Rüzgar: 12 km/s</div>
                        <div className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full inline-block mt-2">Birim için tıkla</div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors cursor-pointer"
            onClick={toggleUnit}
        >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                <Globe className="w-6 h-6" />
            </div>
            <div>
                <div className="font-bold text-gray-900">{data?.city}</div>
                <div className="text-sm text-gray-500 font-mono">{formattedTime}</div>
            </div>
            <div className="ml-auto text-2xl font-bold text-gray-900 flex flex-col items-end">
                <span>{displayTemp}°{unit}</span>
                <span className="text-[10px] text-gray-400 font-normal">Tıkla: {unit === 'C' ? 'F' : 'C'}</span>
            </div>
        </div>
    );
};





// Component Preview in Canvas
const ComponentPreview = ({ component, isSelected, onSelect, onDelete }) => {
    // State for content add modal
    const [showContentModal, setShowContentModal] = useState(false);
    const [contentType, setContentType] = useState(null);
    const [contentData, setContentData] = useState({});
    const [columnIndex, setColumnIndex] = useState(null);

    // State for added contents - container uses null as key, columns use index
    const [addedContents, setAddedContents] = useState({});

    // Handle opening content modal
    const openContentModal = (type, colIndex = null) => {
        setContentType(type);
        setColumnIndex(colIndex);
        setContentData({});
        setShowContentModal(true);
    };

    // Handle saving content - ACTUALLY STORES THE CONTENT NOW
    const saveContent = () => {
        const key = columnIndex !== null ? `col_${columnIndex}` : 'container';
        const newContent = {
            id: Date.now(),
            type: contentType,
            data: { ...contentData }
        };

        setAddedContents(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), newContent]
        }));

        setShowContentModal(false);
        setContentType(null);
        setContentData({});
    };

    // Render a single added content item
    const renderContentItem = (item) => {
        switch (item.type) {
            case 'text':
                return (
                    <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100" style={{ textAlign: item.data.align || 'left' }}>
                        <p className="text-gray-800">{item.data.content || 'Metin içeriği'}</p>
                    </div>
                );
            case 'heading':
                const HeadingTag = item.data.level || 'h2';
                const headingSizes = { h1: 'text-3xl', h2: 'text-2xl', h3: 'text-xl', h4: 'text-lg' };
                return (
                    <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <HeadingTag className={`font-bold text-gray-900 ${headingSizes[HeadingTag]}`}>
                            {item.data.text || 'Başlık'}
                        </HeadingTag>
                    </div>
                );
            case 'image':
                return (
                    <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <img
                            src={item.data.src || 'https://via.placeholder.com/400x200'}
                            alt={item.data.alt || 'Resim'}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                );
            case 'button':
                const btnStyles = {
                    primary: 'bg-blue-600 text-white hover:bg-blue-700',
                    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
                    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                };
                return (
                    <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
                        <a
                            href={item.data.link || '#'}
                            className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${btnStyles[item.data.style] || btnStyles.primary}`}
                        >
                            {item.data.text || 'Buton'}
                        </a>
                    </div>
                );
            case 'list':
                const listItems = (item.data.items || 'Öğe 1\nÖğe 2').split('\n').filter(i => i.trim());
                const listStyles = { bullet: '•', number: '', check: '✓' };
                return (
                    <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <ul className={item.data.listStyle === 'number' ? 'list-decimal pl-6' : 'space-y-2'}>
                            {listItems.map((li, i) => (
                                <li key={i} className="text-gray-800">
                                    {item.data.listStyle !== 'number' && <span className="mr-2 text-blue-500">{listStyles[item.data.listStyle] || '•'}</span>}
                                    {li}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'quote':
                return (
                    <div key={item.id} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-800 italic text-lg">"{item.data.text || 'Alıntı metni'}"</p>
                        {item.data.author && <p className="text-gray-600 mt-2 font-medium">— {item.data.author}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    // Content modal form fields based on type
    const renderContentForm = () => {
        switch (contentType) {
            case 'text':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Metin İçeriği</label>
                            <textarea
                                value={contentData.content || ''}
                                onChange={(e) => setContentData({ ...contentData, content: e.target.value })}
                                placeholder="Metninizi buraya yazın..."
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Hizalama</label>
                            <div className="flex gap-2">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        type="button"
                                        key={align}
                                        onClick={() => setContentData({ ...contentData, align })}
                                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${contentData.align === align
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        {align === 'left' ? '⬅️ Sol' : align === 'center' ? '⬛ Orta' : '➡️ Sağ'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'heading':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Başlık Metni</label>
                            <input
                                type="text"
                                value={contentData.text || ''}
                                onChange={(e) => setContentData({ ...contentData, text: e.target.value })}
                                placeholder="Başlık yazın..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xl font-bold text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Başlık Seviyesi</label>
                            <div className="flex gap-2">
                                {['h1', 'h2', 'h3', 'h4'].map((level) => (
                                    <button
                                        type="button"
                                        key={level}
                                        onClick={() => setContentData({ ...contentData, level })}
                                        className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${contentData.level === level
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        {level.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Resim URL</label>
                            <input
                                type="text"
                                value={contentData.src || ''}
                                onChange={(e) => setContentData({ ...contentData, src: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        {contentData.src && (
                            <div className="p-4 bg-gray-100 rounded-xl border-2 border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">📷 Önizleme:</p>
                                <img src={contentData.src} alt="Preview" className="max-h-40 rounded-lg mx-auto shadow-md" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Alt Metin</label>
                            <input
                                type="text"
                                value={contentData.alt || ''}
                                onChange={(e) => setContentData({ ...contentData, alt: e.target.value })}
                                placeholder="Resim açıklaması..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                );
            case 'button':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Buton Metni</label>
                            <input
                                type="text"
                                value={contentData.text || ''}
                                onChange={(e) => setContentData({ ...contentData, text: e.target.value })}
                                placeholder="Buton metni..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Link</label>
                            <input
                                type="text"
                                value={contentData.link || ''}
                                onChange={(e) => setContentData({ ...contentData, link: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Stil</label>
                            <div className="flex gap-2">
                                {['primary', 'secondary', 'outline'].map((style) => (
                                    <button
                                        type="button"
                                        key={style}
                                        onClick={() => setContentData({ ...contentData, style })}
                                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${contentData.style === style
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        {style === 'primary' ? '🔵 Birincil' : style === 'secondary' ? '⚪ İkincil' : '⭕ Çerçeveli'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'list':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Liste Öğeleri (Her satır bir öğe)</label>
                            <textarea
                                value={contentData.items || ''}
                                onChange={(e) => setContentData({ ...contentData, items: e.target.value })}
                                placeholder="Öğe 1&#10;Öğe 2&#10;Öğe 3"
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Liste Stili</label>
                            <div className="flex gap-2">
                                {['bullet', 'number', 'check'].map((style) => (
                                    <button
                                        type="button"
                                        key={style}
                                        onClick={() => setContentData({ ...contentData, listStyle: style })}
                                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${contentData.listStyle === style
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        {style === 'bullet' ? '• Nokta' : style === 'number' ? '1. Numara' : '✓ Onay'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'quote':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Alıntı Metni</label>
                            <textarea
                                value={contentData.text || ''}
                                onChange={(e) => setContentData({ ...contentData, text: e.target.value })}
                                placeholder="Alıntı metnini yazın..."
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none italic text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Yazar</label>
                            <input
                                type="text"
                                value={contentData.author || ''}
                                onChange={(e) => setContentData({ ...contentData, author: e.target.value })}
                                placeholder="Yazar adı..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Get content type labels
    const getContentLabel = (type) => {
        const labels = {
            text: { icon: '📝', label: 'Metin Bloğu' },
            heading: { icon: '🔤', label: 'Başlık' },
            image: { icon: '🖼️', label: 'Resim' },
            button: { icon: '🔘', label: 'Buton' },
            list: { icon: '📋', label: 'Liste' },
            quote: { icon: '💬', label: 'Alıntı' },
        };
        return labels[type] || { icon: '📦', label: 'İçerik' };
    };

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
                    <div className="py-16 px-8 text-center" style={{ backgroundColor: component.data?.bgColor || '#3b82f6', color: component.data?.textColor || '#ffffff' }}>
                        <h2 className="text-3xl font-bold mb-4">{component.data?.title || 'Projenizi Hayata Geçirin'}</h2>
                        <p className="text-lg opacity-90 mb-6">{component.data?.subtitle || 'Hemen başlayın'}</p>
                        <a
                            href={component.data?.buttonLink || '#'}
                            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {component.data?.buttonText || 'İletişime Geçin'}
                        </a>
                    </div>
                );

            case 'banner':
                const bannerColors = {
                    info: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    success: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    warning: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    error: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    promo: 'linear-gradient(135deg, #a855f7, #ec4899)'
                };
                const bannerType = component.data?.type || 'info';
                return (
                    <div
                        className="relative py-4 px-8 text-center text-white overflow-hidden"
                        style={{ background: bannerColors[bannerType] }}
                    >
                        <div className="flex items-center justify-center gap-4">
                            {!component.data?.dismissible && (
                                <span className="text-lg font-medium">{component.data?.text || '📢 Önemli duyuru metni'}</span>
                            )}
                            {!component.data?.dismissible && component.data?.linkText && (
                                <a
                                    href={component.data?.linkUrl || '#'}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                                >
                                    {component.data.linkText}
                                </a>
                            )}
                            {component.data?.dismissible && (
                                <button className="ml-auto text-white/80 hover:text-white">✕</button>
                            )}
                        </div>
                    </div>
                );


            case 'about':
                return (
                    <div className="py-16 px-8" style={{ backgroundColor: component.data?.bgColor || '#f9fafb' }}>
                        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                {component.data?.showTitle !== false && (
                                    <h2 className="text-3xl font-bold mb-4" style={{ color: component.data?.titleColor || '#1f2937' }}>
                                        {component.data?.sectionTitle || 'Biz Kimiz?'}
                                    </h2>
                                )}
                                <p className="text-gray-600 leading-relaxed">{component.data?.content || 'Şirketiniz hakkında bilgi...'}</p>
                            </div>
                            {component.data?.image && (
                                <img src={component.data.image} alt="About" className="rounded-xl shadow-lg" />
                            )}
                        </div>
                    </div>
                );





            case 'stats':
                const stats = component.data?.stats || [{ value: '500+', label: 'Müşteri' }, { value: '1000+', label: 'Proje' }, { value: '50+', label: 'Ülke' }, { value: '10+', label: 'Yıl' }];
                return (
                    <div className="py-16 px-8" style={{ backgroundColor: component.data?.bgColor || '#1e40af', color: component.data?.textColor || '#ffffff' }}>
                        <h2 className="text-3xl font-bold text-center mb-12">{component.data?.sectionTitle || 'Rakamlarla Biz'}</h2>
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
                const yearColor = component.data?.yearColor || '#3b82f6';
                const dotColor = component.data?.dotColor || '#3b82f6';
                return (
                    <div className="py-16 px-8" style={{ backgroundColor: component.data?.bgColor || '#ffffff' }}>
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{component.data?.sectionTitle || 'Tarihçemiz'}</h2>
                        <div className="max-w-3xl mx-auto space-y-8">
                            {timelineItems.map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-20 text-right font-bold" style={{ color: yearColor }}>{item.year}</div>
                                    <div className="w-4 h-4 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: dotColor }} />
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
                    <div className="py-16 px-8" style={{ backgroundColor: component.data?.bgColor || '#f9fafb' }}>
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
                                            {/* Company removed */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'clients':
                const partners = component.data?.partners || [
                    { name: 'Google' },
                    { name: 'Microsoft' },
                    { name: 'Amazon' },
                    { name: 'Apple' },
                    { name: 'Meta' }
                ];
                return (
                    <div className="py-12 px-8" style={{ backgroundColor: component.data?.bgColor || '#f9fafb' }}>
                        <h2 className="text-xl font-semibold text-center mb-8" style={{ color: component.data?.titleColor || '#1f2937' }}>
                            {component.data?.sectionTitle || 'Güvenilir İş Ortaklarımız'}
                        </h2>
                        <div className="flex justify-center gap-12">
                            {partners.map((partner, i) => (
                                <div key={i} style={{ color: component.data?.partnerTextColor || '#6b7280' }}>
                                    {partner.logo ? (
                                        <img src={partner.logo} alt={partner.name} className="h-12 object-contain" />
                                    ) : (
                                        <div className="text-xl font-bold opacity-60">{partner.name}</div>
                                    )}
                                </div>
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
                const nlBgColor = component.data?.bgColor || '#4f46e5';
                const nlBtnColor = component.data?.buttonColor || '#ffffff';
                return (
                    <div
                        className="py-16 px-8 text-white"
                        style={{ backgroundColor: nlBgColor }}
                    >
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">{component.data?.title || 'Bültene Abone Olun'}</h2>
                            <p className="opacity-90 mb-6">{component.data?.subtitle || 'Haberdar olun'}</p>
                            <form
                                action={component.data?.buttonLink || '#'}
                                method="POST"
                                className="flex gap-3 max-w-md mx-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="email"
                                    placeholder={component.data?.placeholder || 'E-posta adresiniz'}
                                    className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                                    style={{ backgroundColor: nlBtnColor, color: nlBgColor }}
                                >
                                    {component.data?.buttonText || 'Abone Ol'}
                                </button>
                            </form>
                            {component.data?.buttonLink && (
                                <p className="mt-3 text-xs opacity-60">Form: {component.data.buttonLink}</p>
                            )}
                        </div>
                    </div>
                );

            case 'contact':
                const ctBgColor = component.data?.bgColor || '#1f2937';
                const ctBtnColor = component.data?.buttonColor || '#3b82f6';
                return (
                    <div
                        className="py-16 px-8 text-white"
                        style={{ backgroundColor: ctBgColor }}
                    >
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
                                <form
                                    action={component.data?.buttonLink || '#'}
                                    method="POST"
                                    className="space-y-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input className="w-full p-3 bg-gray-800 rounded-lg" placeholder="Adınız" />
                                    <input className="w-full p-3 bg-gray-800 rounded-lg" placeholder="E-posta" />
                                    <textarea className="w-full p-3 bg-gray-800 rounded-lg" placeholder="Mesajınız" rows={3} />
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                                        style={{ backgroundColor: ctBtnColor }}
                                    >
                                        {component.data?.buttonText || 'Gönder'}
                                    </button>
                                    {component.data?.buttonLink && (
                                        <p className="text-xs text-gray-500 text-center">Form: {component.data.buttonLink}</p>
                                    )}
                                </form>
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
                const dividerStyle = component.data?.style || 'solid';
                const dividerColor = component.data?.color || '#e5e7eb';
                const dividerThickness = component.data?.thickness || 2;
                return (
                    <div className="py-4 px-8">
                        <hr
                            style={{
                                borderStyle: dividerStyle === 'line' ? 'solid' : dividerStyle,
                                borderColor: dividerColor,
                                borderWidth: `${dividerThickness}px 0 0 0`,
                                margin: 0
                            }}
                        />
                    </div>
                );

            case 'spacer':
                return <div style={{ height: component.data?.height || 60 }} className="bg-transparent" />;

            case 'container':
                const containerMaxWidth = {
                    narrow: '800px',
                    container: '1200px',
                    full: '100%'
                }[component.data?.maxWidth || 'container'];
                const containerPadding = {
                    none: '0',
                    small: '1rem',
                    normal: '2rem',
                    large: '4rem'
                }[component.data?.padding || 'normal'];
                const containerContents = addedContents['container'] || [];
                return (
                    <div
                        className="mx-auto"
                        style={{
                            maxWidth: containerMaxWidth,
                            padding: containerPadding,
                            backgroundColor: component.data?.bgColor || '#ffffff'
                        }}
                    >
                        <div className="group relative border-2 border-dashed border-blue-300 rounded-xl p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 min-h-[120px] transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
                            {/* Header Badge */}
                            <div className="absolute -top-3 left-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                📦 Container ({containerContents.length} içerik)
                            </div>

                            {/* Added Content Display */}
                            {containerContents.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {containerContents.map(item => renderContentItem(item))}
                                </div>
                            )}

                            {/* Add Content Button */}
                            <div className="relative flex justify-center">
                                <button
                                    className="group/btn flex items-center gap-2 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 text-blue-600 px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdown = e.currentTarget.nextElementSibling;
                                        dropdown.classList.toggle('hidden');
                                    }}
                                >
                                    <span className="w-5 h-5 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold group-hover/btn:bg-blue-600 transition-colors">+</span>
                                    <span className="text-sm">İçerik Ekle</span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50">
                                    <div className="text-[10px] text-gray-400 px-3 py-1.5 font-medium uppercase tracking-wider">Eklenecek İçerik</div>
                                    {[
                                        { icon: '📝', label: 'Metin', type: 'text' },
                                        { icon: '🔤', label: 'Başlık', type: 'heading' },
                                        { icon: '🖼️', label: 'Resim', type: 'image' },
                                        { icon: '🔘', label: 'Buton', type: 'button' },
                                        { icon: '📋', label: 'Liste', type: 'list' },
                                        { icon: '💬', label: 'Alıntı', type: 'quote' },
                                    ].map((item, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all text-left text-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.currentTarget.closest('.relative').querySelector('div').classList.add('hidden');
                                                openContentModal(item.type, null);
                                            }}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'columns':
                const columnCount = component.data?.count || 2;
                const columnGap = {
                    none: '0',
                    small: '0.5rem',
                    normal: '1rem',
                    large: '2rem'
                }[component.data?.gap || 'normal'];
                return (
                    <div
                        className="py-6 px-6"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                            gap: columnGap
                        }}
                    >
                        {Array.from({ length: columnCount }, (_, i) => {
                            const colContents = addedContents[`col_${i}`] || [];
                            return (
                                <div key={i} className="group relative border-2 border-dashed border-purple-300 rounded-xl p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 min-h-[100px] transition-all duration-300 hover:border-purple-400 hover:shadow-lg">
                                    {/* Column Badge */}
                                    <div className="absolute -top-2.5 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        Sütun {i + 1} ({colContents.length})
                                    </div>

                                    {/* Added Content Display */}
                                    {colContents.length > 0 && (
                                        <div className="space-y-2 mb-3 mt-2">
                                            {colContents.map(item => renderContentItem(item))}
                                        </div>
                                    )}

                                    {/* Add Content Button */}
                                    <div className="relative flex justify-center">
                                        <button
                                            className="group/btn flex items-center gap-1.5 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 text-purple-600 px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const dropdown = e.currentTarget.nextElementSibling;
                                                document.querySelectorAll('.column-dropdown').forEach(el => {
                                                    if (el !== dropdown) el.classList.add('hidden');
                                                });
                                                dropdown.classList.toggle('hidden');
                                            }}
                                        >
                                            <span className="w-4 h-4 bg-purple-500 text-white rounded flex items-center justify-center text-xs font-bold">+</span>
                                            <span>Ekle</span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div className="column-dropdown hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-50">
                                            <div className="text-[9px] text-gray-400 px-2 py-1 font-medium uppercase tracking-wider">İçerik Seç</div>
                                            {[
                                                { icon: '📝', label: 'Metin', type: 'text' },
                                                { icon: '🔤', label: 'Başlık', type: 'heading' },
                                                { icon: '🖼️', label: 'Resim', type: 'image' },
                                                { icon: '🔘', label: 'Buton', type: 'button' },
                                                { icon: '📋', label: 'Liste', type: 'list' },
                                                { icon: '💬', label: 'Alıntı', type: 'quote' },
                                            ].map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all text-left text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.currentTarget.closest('.relative').querySelector('.column-dropdown').classList.add('hidden');
                                                        openContentModal(item.type, i);
                                                    }}
                                                >
                                                    <span className="text-sm">{item.icon}</span>
                                                    <span className="font-medium">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

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
                    <div className="py-16 px-8 bg-gradient-to-b from-slate-50 to-white">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{component.data?.title || 'Ürünler'}</h2>
                        {component.data?.subtitle && (
                            <p className="text-center text-gray-500 mb-12">{component.data.subtitle}</p>
                        )}
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {(products.length > 0 ? products : [
                                { name: 'Premium Ürün', price: '₺999', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', link: '#' },
                                { name: 'Özel Koleksiyon', price: '₺1.299', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', link: '#' },
                                { name: 'Sınırlı Seri', price: '₺1.599', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300', link: '#' }
                            ]).map((product, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                    <div className="relative overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                                        <p className="text-2xl font-black text-indigo-600 mb-4">{product.price}</p>
                                        <a
                                            href={product.link || component.data?.cartLink || '#'}
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                                        >
                                            🛒 {component.data?.buttonText || 'Sepete Ekle'}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            // ═══════════════════════════════════════════════════════════════
            // E-COMMERCE COMPONENTS
            // ═══════════════════════════════════════════════════════════════

            case 'productcard':
                return (
                    <div className="py-8 px-8 bg-gray-50">
                        <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                            <div className="relative overflow-hidden">
                                <img
                                    src={component.data?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                                    alt={component.data?.name || 'Ürün'}
                                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                {component.data?.badge && (
                                    <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                        {component.data.badge}
                                    </div>
                                )}
                                {component.data?.inStock === false && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">Tükendi</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{component.data?.name || 'Premium Ürün'}</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={`text-sm ${star <= Math.round(component.data?.rating || 4.5) ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                                    ))}
                                    <span className="text-xs text-gray-400 ml-1">({component.data?.rating || 4.5})</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-gray-900">{component.data?.price || '₺999'}</span>
                                    {component.data?.oldPrice && (
                                        <span className="text-sm text-gray-400 line-through">{component.data.oldPrice}</span>
                                    )}
                                </div>
                                <a
                                    href={component.data?.cartLink || '#'}
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="mt-4 w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    🛒 {component.data?.buttonText || 'Sepete Ekle'}
                                </a>
                            </div>
                        </div>
                    </div>
                );

            case 'productgrid':
                const gridProducts = component.data?.products || [];
                const gridCols = component.data?.columns || 3;
                return (
                    <div className="py-16 px-8 bg-gradient-to-b from-white to-slate-50">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">{component.data?.title || 'Popüler Ürünler'}</h2>
                        {component.data?.subtitle && (
                            <p className="text-center text-gray-500 mb-12">{component.data.subtitle}</p>
                        )}
                        <div className={`grid gap-6 max-w-5xl mx-auto`} style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
                            {(gridProducts.length > 0 ? gridProducts : [
                                { name: 'Akıllı Saat', price: '₺2.499', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', link: '#' },
                                { name: 'Kablosuz Kulaklık', price: '₺1.299', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', link: '#' },
                                { name: 'Güneş Gözlüğü', price: '₺899', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300', link: '#' }
                            ]).map((product, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                                    <div className="relative overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                                        <p className="text-xl font-black text-indigo-600 mb-4">{product.price}</p>
                                        <a
                                            href={product.link || component.data?.cartLink || '#'}
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="block w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium text-center hover:bg-gray-800 transition-colors text-sm"
                                        >
                                            🛒 {component.data?.buttonText || 'Sepete Ekle'}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'cartbutton':
                const btnStyle = component.data?.style || 'primary';
                const btnSize = component.data?.size || 'medium';
                const sizeClasses = { small: 'px-4 py-2 text-sm', medium: 'px-6 py-3', large: 'px-8 py-4 text-lg' };
                const styleClasses = {
                    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
                    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                };
                return (
                    <div className="py-8 px-8 flex justify-center">
                        <a
                            href={component.data?.link || '#'}
                            onClick={(e) => { e.stopPropagation(); }}
                            className={`${sizeClasses[btnSize]} ${styleClasses[btnStyle]} ${component.data?.fullWidth ? 'w-full' : ''} rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg no-underline`}
                        >
                            <span>{component.data?.icon || '🛒'}</span>
                            <span>{component.data?.text || 'Sepete Ekle'}</span>
                        </a>
                    </div>
                );

            case 'pricedisplay':
                const savings = component.data?.oldPrice ?
                    Math.round(((parseFloat(component.data.oldPrice.replace(/[^0-9.]/g, '')) - parseFloat(component.data.price.replace(/[^0-9.]/g, ''))) / parseFloat(component.data.oldPrice.replace(/[^0-9.]/g, ''))) * 100) : 0;
                return (
                    <div className="py-8 px-8 flex justify-center">
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-3">
                                <span className="text-5xl font-black text-gray-900">{component.data?.price || '₺1.499'}</span>
                                {component.data?.period && <span className="text-gray-400">{component.data.period}</span>}
                            </div>
                            {component.data?.oldPrice && (
                                <div className="mt-2 flex items-center justify-center gap-3">
                                    <span className="text-xl text-gray-400 line-through">{component.data.oldPrice}</span>
                                    {component.data?.showSavings && savings > 0 && (
                                        <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2 py-1 rounded">
                                            %{savings} Tasarruf
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'salebadge':
                const badgeType = component.data?.type || 'sale';
                const badgeColors = {
                    sale: 'bg-rose-500 text-white',
                    new: 'bg-emerald-500 text-white',
                    hot: 'bg-orange-500 text-white',
                    limited: 'bg-purple-500 text-white'
                };
                return (
                    <div className="py-8 px-8 flex justify-center">
                        <div className={`inline-block ${badgeColors[badgeType]} text-sm font-bold px-4 py-2 rounded-full ${component.data?.animated ? 'animate-pulse' : ''}`}>
                            {component.data?.text || '%30 İndirim'}
                        </div>
                    </div>
                );

            case 'countdown':
                // Calculate countdown values from targetDate
                const getCountdownValues = () => {
                    if (!component.data?.isActive || !component.data?.targetDate) {
                        return { days: 23, hours: 12, minutes: 45, seconds: 59 }; // Demo values
                    }
                    const target = new Date(component.data.targetDate).getTime();
                    const now = Date.now();
                    const diff = Math.max(0, target - now);
                    return {
                        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((diff % (1000 * 60)) / 1000)
                    };
                };
                const countdownVals = getCountdownValues();
                return (
                    <div
                        className="py-10 px-8"
                        style={{
                            backgroundColor: component.data?.bgColor || '#dc2626',
                            color: component.data?.textColor || '#ffffff'
                        }}
                    >
                        <h3 className="text-xl font-bold text-center mb-6">{component.data?.title || 'Kampanya Bitiyor!'}</h3>
                        {component.data?.isActive && (
                            <div className="text-xs text-center mb-4 opacity-80">
                                ⏱️ Geri sayım aktif
                            </div>
                        )}
                        <div className="flex justify-center gap-4">
                            {component.data?.showDays !== false && (
                                <div className="text-center bg-black/20 rounded-xl px-5 py-4 min-w-[80px]">
                                    <div className="text-4xl font-black">{String(countdownVals.days).padStart(2, '0')}</div>
                                    <div className="text-xs opacity-80">GÜN</div>
                                </div>
                            )}
                            {component.data?.showHours !== false && (
                                <div className="text-center bg-black/20 rounded-xl px-5 py-4 min-w-[80px]">
                                    <div className="text-4xl font-black">{String(countdownVals.hours).padStart(2, '0')}</div>
                                    <div className="text-xs opacity-80">SAAT</div>
                                </div>
                            )}
                            {component.data?.showMinutes !== false && (
                                <div className="text-center bg-black/20 rounded-xl px-5 py-4 min-w-[80px]">
                                    <div className="text-4xl font-black">{String(countdownVals.minutes).padStart(2, '0')}</div>
                                    <div className="text-xs opacity-80">DAKİKA</div>
                                </div>
                            )}
                            {component.data?.showSeconds !== false && (
                                <div className="text-center bg-black/20 rounded-xl px-5 py-4 min-w-[80px]">
                                    <div className="text-4xl font-black">{String(countdownVals.seconds).padStart(2, '0')}</div>
                                    <div className="text-xs opacity-80">SANİYE</div>
                                </div>
                            )}
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
                const [slideIndex, setSlideIndex] = useState(0);
                const slides = component.data?.images || [];

                // Add autoplay support using useEffect if needed, or simple buttons

                return (
                    <div className="relative h-[500px] overflow-hidden group bg-gray-900">
                        {slides.length > 0 ? (
                            <>
                                <div
                                    className="absolute inset-0 transition-transform duration-500 ease-out flex"
                                    style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                                >
                                    {slides.map((slide, idx) => (
                                        <div key={idx} className="w-full h-full flex-shrink-0 relative">
                                            <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                                            {slide.title && (
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <h3 className="text-4xl font-bold text-white tracking-tight">{slide.title}</h3>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSlideIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSlideIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    →
                                </button>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); setSlideIndex(idx); }}
                                            className={`w-2 h-2 rounded-full transition-all ${slideIndex === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Slayt görseli ekleyin
                            </div>
                        )}
                    </div>
                );

            case 'mediatext':
                const isRight = component.data?.imagePos === 'right';
                return (
                    <div className="py-16 px-8 bg-white overflow-hidden">
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                            <div className={`flex-1 ${isRight ? 'md:order-2' : ''}`}>
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                                    <img
                                        src={component.data?.image || 'https://via.placeholder.com/800x600'}
                                        alt="Media"
                                        className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                                    {component.data?.title || 'Etkileyici Başlık Alanı'}
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {component.data?.content || 'Buraya görselinizle ilgili açıklayıcı metin gelecek. Kullanıcıları etkilemek için burayı en iyi şekilde kullanın.'}
                                </p>
                                <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                                    Devamını Oku
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'audio':
                return (
                    <div className="py-8 px-8 bg-gray-50">
                        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-600">
                                <Music className="w-8 h-8" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate mb-2">{component.data?.title || 'Ses Dosyası'}</h3>
                                <audio
                                    controls
                                    src={component.data?.url}
                                    className="w-full h-10 accent-indigo-600"
                                >
                                    Tarayıcınız ses elementini desteklemiyor.
                                </audio>
                            </div>
                        </div>
                    </div>
                );

            case 'search':
                return <WidgetSearch data={component.data} />;

            case 'socialicons':
                return <WidgetSocial data={component.data} />;

            case 'calendar':
                return <WidgetCalendar data={component.data} />;

            case 'archives':
            case 'categories':
                return <WidgetList data={component.data} />;

            case 'latestposts':
                return <WidgetPosts data={component.data} />;

            case 'customhtml':
                return (
                    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">HTML Önizleme</div>
                        <div
                            dangerouslySetInnerHTML={{ __html: component.data?.code }}
                            className="prose prose-sm max-w-none"
                        />
                    </div>
                );

            case 'weather':
                return <WidgetWeather data={component.data} />;

            case 'loginform':
                const lfBgColor = component.data?.bgColor || '#f8fafc';
                const lfBtnColor = component.data?.buttonColor || '#4f46e5';
                return (
                    <div
                        className="py-16 px-8"
                        style={{ backgroundColor: lfBgColor }}
                    >
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                {/* Header with dynamic color */}
                                <div
                                    className="px-8 py-10 text-center"
                                    style={{ background: `linear-gradient(135deg, ${lfBtnColor}, ${lfBtnColor}dd)` }}
                                >
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <span className="text-3xl">🔐</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">{component.data?.title || 'Hoş Geldiniz'}</h2>
                                    <p className="text-white/70 mt-2">{component.data?.subtitle || 'Hesabınıza giriş yapın'}</p>
                                </div>

                                {/* Form */}
                                <form
                                    action={component.data?.buttonLink || '#'}
                                    method="POST"
                                    className="px-8 py-8 space-y-5"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                                        <input
                                            type="email"
                                            placeholder="ornek@email.com"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                            <input type="checkbox" className="rounded border-gray-300 text-indigo-600" />
                                            Beni hatırla
                                        </label>
                                        {component.data?.showForgotPassword !== false && (
                                            <a href="#" className="font-medium hover:opacity-80" style={{ color: lfBtnColor }}>Şifremi unuttum</a>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3.5 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300"
                                        style={{ backgroundColor: lfBtnColor }}
                                    >
                                        {component.data?.buttonText || 'Giriş Yap'}
                                    </button>

                                    {component.data?.buttonLink && (
                                        <p className="text-xs text-gray-400 text-center">Form: {component.data.buttonLink}</p>
                                    )}

                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-white text-gray-400">veya</span>
                                        </div>
                                    </div>

                                    {/* Social Login */}
                                    <div className="flex gap-3">
                                        <button type="button" className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                            <span className="text-xl">🔵</span>
                                            <span className="text-sm font-medium text-gray-600">Google</span>
                                        </button>
                                        <button type="button" className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                            <span className="text-xl">⚫</span>
                                            <span className="text-sm font-medium text-gray-600">GitHub</span>
                                        </button>
                                    </div>

                                    {/* Register Link */}
                                    {component.data?.showRegisterLink !== false && (
                                        <p className="text-center text-gray-600 mt-6">
                                            Hesabınız yok mu?{' '}
                                            <a href="#" className="font-semibold hover:opacity-80" style={{ color: lfBtnColor }}>Kayıt Ol</a>
                                        </p>
                                    )}
                                </form>
                            </div>
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
            id={component.id}
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

            {/* Content Add Modal */}
            {showContentModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowContentModal(false);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{getContentLabel(contentType).icon}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{getContentLabel(contentType).label} Ekle</h3>
                                    <p className="text-blue-100 text-sm">
                                        {columnIndex !== null ? `Sütun ${columnIndex + 1}'e ekle` : 'Container içine ekle'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {renderContentForm()}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowContentModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={saveContent}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl"
                            >
                                ✓ Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Builder;

