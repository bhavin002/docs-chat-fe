import React from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";


const Documents = () => {
    // Static data for documents
    const documents = [];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Chat Documents</h1>
            <button className="bg-orange-500 text-white py-2 px-4 rounded mb-4">Upload</button>

            {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Icon icon="tabler:files-off" className="w-12 h-12 mb-2" />
                    <h2 className="text-lg font-medium mb-2">No documents</h2>
                    <p className="text-gray-600">Get started by uploading a new document.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Document Name</th>
                                <th className="px-4 py-2 text-left">Size</th>
                                <th className="px-4 py-2 text-left">Uploaded</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{doc.name}</td>
                                    <td className="border px-4 py-2">{doc.size}</td>
                                    <td className="border px-4 py-2">{doc.uploaded}</td>
                                    <td className="border px-4 py-2">
                                        <button className="text-blue-600">Edit</button>
                                        <button className="text-red-600 ml-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Documents;
