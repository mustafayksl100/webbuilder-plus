import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import {
    Plus,
    MoreVertical,
    Edit3,
    Trash2,
    Copy,
    Clock,
    Terminal,
    Search,
    X,
    AlertTriangle,
    Zap,
    Database,
    Globe,
    ArrowRight
} from 'lucide-react';

const Dashboard = () => {
    const { projects, fetchProjects, deleteProject, duplicateProject, isLoading, createProject } = useProjectStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [showNewProject, setShowNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            toast.error('Lütfen proje adı girin');
            return;
        }

        try {
            const project = await createProject({ name: newProjectName.trim() });
            toast.success('Proje oluşturuldu');
            navigate(`/builder/${project.id}`);
        } catch (error) {
            console.error('Project creation failed:', error);
            // Show detailed error if available
            if (error.response) {
                toast.error(`Hata: ${error.response.status} - ${error.response.data?.message || error.message}`);
                console.log('Error URL:', error.response.config.url);
            } else {
                toast.error(error.message || 'Proje başlatılamadı');
            }
        } finally {
            setShowNewProject(false);
            setNewProjectName('');
        }
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await deleteProject(projectToDelete.id);
            toast.success('Proje silindi');
        } catch (error) {
            toast.error('Silme işlemi başarısız');
        } finally {
            setShowDeleteModal(false);
            setProjectToDelete(null);
        }
    };

    const openDeleteModal = (project) => {
        setProjectToDelete(project);
        setShowDeleteModal(true);
        setActiveMenu(null);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-10 font-[Manrope]">

            {/* Top Bar / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-800 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-cyan-400 mb-2">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs font-mono uppercase tracking-widest">Aktif Oturum</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold font-[Sora] tracking-tight">
                        Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                            <Zap className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-mono uppercase">Kredi</div>
                            <div className="text-lg font-bold font-[Sora] text-white">{user?.credits || 0}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowNewProject(true)}
                        className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-xl transition-all hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        <span>Yeni Proje</span>
                    </button>
                </div>
            </div>

            {/* Single Stat Card - Total Projects */}
            <div className="mb-10">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all max-w-xs">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database className="w-20 h-20" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-xs text-slate-500 font-mono uppercase mb-2 tracking-wider">Toplam Proje</div>
                        <div className="text-3xl font-bold font-[Sora]">{projects.length}</div>
                    </div>
                </div>
            </div>

            {/* Projects Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-bold font-[Sora]">Aktif Projeler</h2>
                <div className="relative w-full sm:w-auto group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Proje ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-80 pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder-slate-600"
                    />
                </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-3xl p-16 text-center bg-slate-900/30">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Database className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-[Sora]">Veri Bulunamadı</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Sistemde kayıtlı proje yok. İlk projenizi oluşturarak dijital varlığınızı inşa etmeye başlayın.
                    </p>
                    <button
                        onClick={() => setShowNewProject(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-cyan-400 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Proje Oluştur
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-slate-900 border border-slate-800 rounded-2xl p-1 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/10 flex flex-col h-full"
                        >
                            <div className="bg-slate-950 rounded-xl p-6 flex-1 relative overflow-hidden">
                                {/* Decorative Tech Lines */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-800/20 to-transparent rounded-bl-3xl" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                                        <Globe className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === project.id ? null : project.id)}
                                            className="p-2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {activeMenu === project.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                                                    <button onClick={() => duplicateProject(project.id)} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                                                        <Copy className="w-4 h-4" /> Kopyala
                                                    </button>
                                                    <button onClick={() => openDeleteModal(project)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                                        <Trash2 className="w-4 h-4" /> Sil
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 font-[Sora] group-hover:text-cyan-400 transition-colors">
                                    {project.name}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mt-4">
                                    <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(project.updated_at)}
                                    </span>
                                    <span className={`px-2 py-1 rounded border ${project.status === 'published'
                                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                        : 'bg-slate-800 border-slate-700 text-slate-400'
                                        }`}>
                                        {project.status === 'published' ? 'Yayında' : 'Taslak'}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/builder/${project.id}`}
                                className="mt-1 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-sm"
                            >
                                <Edit3 className="w-4 h-4" /> Düzenle
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {(showNewProject || showDeleteModal) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-8 relative overflow-hidden animate-scale-in shadow-2xl">
                        {/* Modal Shine Effect */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                        {showNewProject ? (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-2 font-[Sora]">Yeni Proje</h3>
                                <p className="text-slate-400 mb-6">Projenize bir isim verin.</p>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">Proje Adı</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-lg"
                                            placeholder="Örn: Şirket Web Sitesi"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowNewProject(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors">İptal</button>
                                        <button onClick={handleCreateProject} className="flex-1 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold transition-colors shadow-[0_0_16px_rgba(6,182,212,0.2)]">Oluştur</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/20">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-[Sora] text-center">Dikkat: Veri Kaybı</h3>
                                <p className="text-slate-400 mb-8 text-center">
                                    <span className="text-white font-bold">{projectToDelete?.name}</span> projesini silmek üzeresiniz. Bu işlem geri alınamaz ve tüm veriler yok edilir.
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold transition-colors">İPTAL</button>
                                    <button onClick={handleDeleteProject} className="flex-1 py-4 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold transition-colors shadow-[0_0_20px_rgba(239,68,68,0.2)]">SİL VE YOK ET</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
