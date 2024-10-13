import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { format } from 'date-fns';


const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getAllDocuments = async () => {
            try {
                const response = await apiClient().get('/api/all-documents');
                setDocuments(response.data.documents);
            } catch (error) {
                console.error('Error fetching documents:', error);
                toast.error('Error fetching documents');
            }
        }
        getAllDocuments();
    }, [])

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            toast.error('Please select a PDF file');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        try {
            setUploadProgress('Preparing upload');
            const response = await apiClient().post('/api/upload-signed-url', { file: selectedFile.name });
            const preSignedUrl = response.data.preSignedUrl;

            setUploadProgress('Uploading to S3');
            await fetch(preSignedUrl.URL, {
                method: 'PUT',
                body: selectedFile,
                headers: { 'Content-Type': 'application/pdf' },
            });

            const documentDetails = {
                document_name: selectedFile.name,
                size: selectedFile.size,
                s3_key: preSignedUrl.key
            };

            setUploadProgress('Saving file information');
            const res = await apiClient().post('/api/create-document', { ...documentDetails });
            const document = res.data.document;
            const documentId = document._id;

            setUploadProgress('Processing document and storing vector data');
            await apiClient().post('/api/upsert', { key: documentDetails.s3_key, documentId: documentId });
            
            setDocuments(prev => [...prev, {
                _id: documentId,
                document_name: document.document_name,
                s3_key: document.s3_key,
                size: document.size,
                createdAt: document.createdAt
            }]);

            setIsModalOpen(false);
            setSelectedFile(null);
            toast.success('File uploaded and processed successfully');
        } catch (error) {
            console.error('Error uploading and processing file:', error);
            toast.error('Error uploading and processing file');
        } finally {
            setIsUploading(false);
            setUploadProgress('');
        }
    };

    const handleChatRedirect = (documentId) => {
        navigate(`/chat/${documentId}`);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Chat Documents</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                disabled={isUploading}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 sm:px-6 rounded-lg mb-4 sm:mb-6 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Upload New Document
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload PDF Document</h2>
                        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-orange-500 transition duration-300">
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-lg">Drop the PDF file here ...</p>
                            ) : (
                                <div>
                                    <Icon icon="tabler:upload" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-orange-500" />
                                    <p className="text-sm sm:text-lg mb-2">Drag 'n' drop a PDF file here, or click to select</p>
                                    {selectedFile && (
                                        <p className="text-xs sm:text-sm text-gray-600">Selected: {selectedFile.name}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {isUploading && (
                            <div className="mt-4 p-3 sm:p-4 bg-blue-100 rounded-lg">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mr-3"></div>
                                    <p className="text-sm sm:text-base text-blue-800">{uploadProgress}</p>
                                </div>
                            </div>
                        )}
                        <div className="mt-4 sm:mt-6 flex justify-end space-x-3 sm:space-x-4">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedFile(null);
                                }}
                                disabled={isUploading}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 sm:px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 sm:px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
                    <Icon icon="tabler:files-off" className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-gray-400" />
                    <h2 className="text-lg sm:text-xl font-medium mb-2 text-gray-700">No documents uploaded yet</h2>
                    <p className="text-sm sm:text-base text-gray-500">Start by uploading your first document.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.document_name}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {doc.size > 1024 * 1024 ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : `${(doc.size / 1024).toFixed(2)} KB`}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(doc.createdAt), "d MMM")}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleChatRedirect(doc._id)}
                                                className="text-blue-600 hover:text-blue-800 transition duration-300"
                                            >
                                                <Icon icon="tabler:message-circle" className="w-5 h-5 inline-block mr-1" />
                                                Chat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;