import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Folder,
    MoreVertical,
    Edit3,
    Trash2,
    Copy,
    Clock,
    Layers,
    FileCode,
    ChevronRight,
    Search,
    X,
    AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
    const { projects, fetchProjects, deleteProject, duplicateProject, isLoading } = useProjectStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewProject, setShowNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const { createProject } = useProjectStore();

    // Silme onay modalı state'leri
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
            const projectData = {
                name: newProjectName.trim()
            };
            const project = await createProject(projectData);
            toast.success('Proje oluşturuldu!');
            navigate(`/builder/${project.id}`);
        } catch (error) {
            toast.error(error.message || 'Proje oluşturulamadı');
        } finally {
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setShowNewProject(false);
        setNewProjectName('');
    };

    // Silme modalını aç
    const openDeleteModal = (project) => {
        setProjectToDelete(project);
        setShowDeleteModal(true);
        setActiveMenu(null);
    };

    // Silme işlemini gerçekleştir
    const handleDeleteProject = async () => {
        if (!projectToDelete) return;

        try {
            await deleteProject(projectToDelete.id);
            toast.success('Proje silindi');
        } catch (error) {
            toast.error(error.message || 'Proje silinemedi');
        } finally {
            setShowDeleteModal(false);
            setProjectToDelete(null);
        }
    };

    // Silme modalını kapat
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setProjectToDelete(null);
    };

    const handleDuplicateProject = async (projectId) => {
        try {
            await duplicateProject(projectId);
            toast.success('Proje kopyalandı');
        } catch (error) {
            toast.error(error.message);
        }
        setActiveMenu(null);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Merhaba, {user?.fullName?.split(' ')[0]} 👋
                </h1>
                <p className="text-dark-400">
                    Projelerinizi yönetin ve yeni web siteleri oluşturun.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <Folder className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="text-dark-400">Toplam Proje</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{projects.length}</div>
                </div>

                <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Layers className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-dark-400">Kredi Bakiyesi</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{user?.credits || 0}</div>
                </div>

                <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <FileCode className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-dark-400">Export Maliyeti</span>
                    </div>
                    <div className="text-3xl font-bold text-white">200 <span className="text-lg text-dark-400">kredi</span></div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl">
                {/* Projects Header */}
                <div className="p-5 border-b border-dark-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h2 className="text-lg font-semibold text-white">Projelerim</h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                            <input
                                type="text"
                                placeholder="Proje ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            />
                        </div>

                        {/* New Project Button */}
                        <button
                            onClick={() => setShowNewProject(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Yeni Proje
                        </button>
                    </div>
                </div>

                {/* Projects List */}
                <div className="divide-y divide-dark-700">
                    {isLoading ? (
                        // Loading skeleton
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-dark-700 rounded-lg skeleton" />
                                <div className="flex-1">
                                    <div className="h-4 bg-dark-700 rounded w-1/3 mb-2 skeleton" />
                                    <div className="h-3 bg-dark-700 rounded w-1/4 skeleton" />
                                </div>
                            </div>
                        ))
                    ) : filteredProjects.length === 0 ? (
                        // Empty state
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Folder className="w-8 h-8 text-dark-500" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">
                                {searchQuery ? 'Proje bulunamadı' : 'Henüz proje yok'}
                            </h3>
                            <p className="text-dark-400 mb-4">
                                {searchQuery
                                    ? 'Arama kriterlerinize uygun proje bulunamadı.'
                                    : 'İlk projenizi oluşturarak başlayın!'
                                }
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setShowNewProject(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Proje Oluştur
                                </button>
                            )}
                        </div>
                    ) : (
                        // Projects list
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="p-5 flex items-center gap-4 hover:bg-dark-700/50 transition-colors group"
                            >
                                {/* Project Icon */}
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileCode className="w-6 h-6 text-primary-400" />
                                </div>

                                {/* Project Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">{project.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-dark-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(project.updated_at)}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${project.status === 'published'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-dark-600 text-dark-300'
                                            }`}>
                                            {project.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/builder/${project.id}`}
                                        className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Düzenle
                                    </Link>

                                    {/* Mobile edit button */}
                                    <Link
                                        to={`/builder/${project.id}`}
                                        className="sm:hidden p-2 text-primary-400 hover:bg-primary-500/10 rounded-lg"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>

                                    {/* More menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === project.id ? null : project.id)}
                                            className="p-2 text-dark-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {activeMenu === project.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setActiveMenu(null)}
                                                />
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-20 py-1">
                                                    <Link
                                                        to={`/builder/${project.id}`}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-dark-600"
                                                        onClick={() => setActiveMenu(null)}
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Düzenle
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDuplicateProject(project.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-dark-600"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        Kopyala
                                                    </button>
                                                    <hr className="my-1 border-dark-600" />
                                                    <button
                                                        onClick={() => openDeleteModal(project)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Sil
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* New Project Modal */}
            {showNewProject && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md overflow-hidden animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-dark-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Yeni Proje Oluştur</h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-dark-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Proje Adı
                                </label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="Örn: Şirket Web Sitesi"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleCreateProject}
                                    className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Oluştur
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md overflow-hidden animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-dark-700 flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Projeyi Sil</h3>
                                <p className="text-sm text-dark-400">Bu işlem geri alınamaz</p>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5">
                            <p className="text-dark-300 mb-4">
                                <span className="font-semibold text-white">"{projectToDelete?.name}"</span> projesini silmek istediğinize emin misiniz?
                            </p>
                            <p className="text-sm text-dark-400">
                                Bu proje ve tüm içeriği kalıcı olarak silinecektir.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-5 border-t border-dark-700 flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
