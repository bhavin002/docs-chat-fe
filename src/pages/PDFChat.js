import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Icon } from "@iconify/react/dist/iconify.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFChat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfFile, setPdfFile] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [fileName, setFileName] = useState('');

    // Static data for testing UI
    const staticMessages = [
        { text: "What role do elder family members play in protecting women and children?", sender: 'user' },
        { text: "The document contains verses from a spiritual text, discussing the qualifications of leaders in a military context, specifically addressing Arjuna's concerns about the battlefield. It emphasizes the importance of understanding the capabilities of one's allies and the emotional turmoil experienced by Arjuna as he prepares for battle. The text also highlights the distinction between material qualifications and spiritual understanding.", sender: 'bot' },
        { text: "What role do elder family members play in protecting women and children?", sender: 'user' },
        { text: "Elder family members are responsible for protecting women and children by engaging them in religious practices to prevent moral degradation and adultery. They uphold family traditions and purification processes, ensuring spiritual guidance from birth to death. Their presence is crucial in maintaining the family's religious practices and preventing chaos in society.", sender: 'bot' },
        { text: "What role do elder family members play in protecting women and children?", sender: 'user' },
        { text: "The document contains verses from a spiritual text, discussing the qualifications of leaders in a military context, specifically addressing Arjuna's concerns about the battlefield. It emphasizes the importance of understanding the capabilities of one's allies and the emotional turmoil experienced by Arjuna as he prepares for battle. The text also highlights the distinction between material qualifications and spiritual understanding.", sender: 'bot' },
    ];


    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            // In a real application, you would add the new message to the state here
            setInputMessage('');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(URL.createObjectURL(file));
            setFileName(file.name);
        }
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + offset, numPages)));
    };

    const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 2));
    const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.5));

    return (
        <div className="flex responsive-height bg-[#f1f0ea]">
            {/* PDF Viewer (Hidden on small devices) */}
            <div className="hidden md:w-1/2 md:p-4 md:flex md:flex-col">
                <div className="mb-4 flex items-center">
                    <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer">
                        Choose file
                        <input type="file" onChange={handleFileChange} className="hidden" accept="application/pdf" />
                    </label>
                    {fileName && <span className="ml-2">{fileName}</span>}
                </div>
                {pdfFile && (
                    <div className="flex flex-col items-center flex-grow">
                        <div className="shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                            <Document
                                file={pdfFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page pageNumber={pageNumber} scale={scale} />
                            </Document>
                        </div>
                        <div className="flex justify-center items-center mt-4 bg-white p-2 rounded-lg shadow">
                            <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-400 mx-1">
                                <Icon icon="icon-park:left" />
                            </button>
                            <span className="mx-2">{pageNumber} / {numPages}</span>
                            <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-400 mx-1">
                                <Icon icon="icon-park:right" />
                            </button>
                            <button onClick={zoomOut} className="bg-blue-500 text-white p-2 rounded-full mx-1">
                                <Icon icon="ei:minus" />
                            </button>
                            <button onClick={zoomIn} className="bg-blue-500 text-white p-2 rounded-full mx-1">
                                <Icon icon="ei:plus" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Interface */}
            <div className="w-full md:w-1/2 flex flex-col bg-[#faf9f6]">
                <div className="flex-grow overflow-auto p-4 space-y-4">
                    {staticMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex">
                                {/* Icon with styling */}
                                <Icon
                                    icon={message.sender === 'user' ? "uim:user-md" : "mingcute:ai-line"}
                                    className={`w-8 h-8 rounded-full border-2 mr-1 ${message.sender === 'user' ? 'border-blue-500 bg-blue-200' : 'border-gray-300 bg-gray-100'} p-1`}
                                />
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {message.text}
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Hey! Ask me anything about your PDF."
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <Icon icon="lucide:send" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PDFChat;
