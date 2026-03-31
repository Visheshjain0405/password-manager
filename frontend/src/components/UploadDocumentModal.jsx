import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Image, File, CheckCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const UploadDocumentModal = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [category, setCategory] = useState('Personal');
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name.split('.')[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name.split('.')[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', fileName || file.name);
            formData.append('category', category);

            const res = await api.post('/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                onUpload(res.data.data);
                handleClose();
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed: ' + (err.response?.data?.error || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        if (uploading) return;
        setFile(null);
        setFileName('');
        setCategory('Personal');
        onClose();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity" onClick={handleClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Upload Document</h3>
                        <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* File Drop Zone */}
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging
                                ? 'border-indigo-500 bg-indigo-50'
                                : file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => !uploading && fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                disabled={uploading}
                            />

                            {file ? (
                                <div className="flex flex-col items-center gap-3 text-emerald-600">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <CheckCircle size={24} className="text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold">{file.name}</p>
                                        <p className="text-sm opacity-80">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-slate-500">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Upload size={24} className="text-indigo-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-slate-700">Click to upload or drag and drop</p>
                                        <p className="text-sm">PDF, DOCX, JPG, PNG (max 10MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Metadata Fields */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-600">Document Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
                                    placeholder="e.g. Insurance Policy"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    required
                                    disabled={uploading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-600">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Personal', 'Work', 'Finance', 'Medical', 'Legal', 'Other'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => !uploading && setCategory(cat)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${category === cat
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            disabled={uploading}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={uploading}
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-indigo-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    'Upload File'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UploadDocumentModal;
