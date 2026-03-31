import React, { useState } from 'react';
import { X, Calendar, HardDrive, FileText, Download, Share2, ExternalLink, AlertCircle, Eye, ShieldCheck } from 'lucide-react';

const ViewDocumentModal = ({ isOpen, onClose, document }) => {
    if (!isOpen || !document) return null;

    // Helper to get a modified URL for forced download or viewing
    const getFileUrl = (mode = 'view') => {
        if (!document.fileUrl) return '';

        // Cloudinary trick: insert 'fl_attachment' after '/upload/' to force download
        if (mode === 'download') {
            return document.fileUrl.replace('/upload/', '/upload/fl_attachment/');
        }

        return document.fileUrl;
    };

    const handleDownload = () => {
        const url = getFileUrl('download');
        window.open(url, '_blank');
    };

    const handleOpenNewTab = () => {
        let url = getFileUrl('view');
        window.open(url, '_blank', 'noreferrer');
    };


    const type = document.type?.toUpperCase();
    const isImage = ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(type);
    const isPDF = type === 'PDF';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 z-[60] pointer-events-none">
                <div
                    className="bg-white rounded-xl w-full max-w-6xl h-[85vh] shadow-2xl border border-slate-200 pointer-events-auto flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">{document.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                            >
                                <Download size={16} />
                                Download
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden bg-slate-50">
                        {/* Main Preview Area */}
                        <div className="flex-1 flex items-center justify-center p-4 md:p-6 h-full overflow-hidden relative">
                            {isImage ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img
                                        src={document.fileUrl}
                                        alt={document.name}
                                        className="max-w-full max-h-full object-contain rounded shadow-sm border border-slate-200 bg-white"
                                    />
                                </div>
                            ) : isPDF ? (
                                <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
                                    <iframe
                                        src={document.fileUrl}
                                        className="w-full h-full"
                                        title="PDF Preview"
                                        frameBorder="0"
                                    />
                                </div>
                            ) : (
                                <div className="text-center space-y-4 max-w-sm">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                        <FileText className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">No preview available</p>
                                        <p className="text-sm text-slate-500 mt-1">This file type cannot be previewed directly in the browser.</p>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm underline underline-offset-4"
                                    >
                                        Download file to view
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Details */}
                        <div className="w-80 border-l border-slate-200 bg-white flex flex-col hidden md:flex">
                            <div className="p-6 overflow-y-auto flex-1">
                                <h4 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-indigo-600" />
                                    File Details
                                </h4>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="group">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uploaded</label>
                                            <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</label>
                                            <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-2">
                                                <HardDrive size={14} className="text-slate-400" />
                                                {document.size}
                                            </p>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                                            <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-2">
                                                <FileText size={14} className="text-slate-400" />
                                                {type}
                                            </p>
                                        </div>

                                        {document.category && (
                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                        {document.category}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                <button
                                    onClick={handleOpenNewTab}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-colors"
                                >
                                    <ExternalLink size={16} />
                                    Open in New Tab
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewDocumentModal;
