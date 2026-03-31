
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UploadDocumentModal from '../components/UploadDocumentModal';
import ViewDocumentModal from '../components/ViewDocumentModal';
import api from '../utils/api';
import { Search, Plus, FileText, Download, MoreVertical, Calendar, HardDrive, Trash2 } from 'lucide-react';

const DocumentItem = ({ id, name, type, date, size, color, onView, onDelete }) => {
    return (
        <div
            onClick={onView}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
        >
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`w-12 h-12 rounded-xl ${color || 'bg-indigo-500'} flex items-center justify-center shrink-0`}>
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{name}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(date).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-1">
                            <HardDrive size={14} />
                            {size}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">Download</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const Documents = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // View Modal State
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Pagination & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("All Files");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data.data);
        } catch (err) {
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (newDoc) => {
        setDocuments([newDoc, ...documents]);
        setCurrentPage(1);
    };

    const handleDeleteDocument = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            const res = await api.delete(`/documents/${id}`);
            if (res.data.success) {
                setDocuments(documents.filter(d => d._id !== id));
            }
        } catch (err) {
            console.error('Error deleting document:', err);
        }
    };

    const handleViewDocument = (doc) => {
        setSelectedDoc(doc);
        setIsViewModalOpen(true);
    };

    // Filter Logic
    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = selectedTab === 'All Files' ||
            (selectedTab === 'PDF' && doc.type === 'PDF') ||
            (selectedTab === 'Images' && ['IMG', 'PNG', 'JPG', 'JPEG', 'WEBP'].includes(doc.type?.toUpperCase())) ||
            (selectedTab === 'Contracts' && doc.name.toLowerCase().includes('agreement')) ||
            (selectedTab === doc.category);

        return matchesSearch && matchesTab;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
    const paginatedDocs = filteredDocs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <UploadDocumentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
            />

            <ViewDocumentModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                document={selectedDoc}
            />

            <main className="lg:pl-80 pt-8 pb-12 px-6 sm:px-8 lg:px-10 transition-all duration-300">
                <div className="max-w-5xl mx-auto space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
                            <p className="text-slate-500">Securely store and manage your important files</p>
                        </div>

                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                            <Plus size={20} />
                            <span>Upload Document</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <Search className="w-5 h-5 text-slate-400 ml-3" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="flex-1 py-2 bg-transparent text-sm focus:outline-none text-slate-700 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['All Files', 'PDF', 'Images', 'Personal', 'Work', 'Finance'].map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => { setSelectedTab(tab); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedTab === tab
                                    ? 'bg-indigo-600 text-white shadow-indigo-glow'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-12 text-slate-500">Loading documents...</div>
                        ) : paginatedDocs.length > 0 ? (
                            paginatedDocs.map((doc) => (
                                <DocumentItem
                                    key={doc._id}
                                    id={doc._id}
                                    name={doc.name}
                                    type={doc.type}
                                    date={doc.createdAt}
                                    size={doc.size}
                                    onView={() => handleViewDocument(doc)}
                                    onDelete={handleDeleteDocument}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No documents found.
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            <span className="text-sm font-medium text-slate-600 px-4">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Documents;
