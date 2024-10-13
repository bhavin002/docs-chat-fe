import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useParams } from 'react-router-dom';
import apiClient from '../utils/axiosInstance';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFChat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfFile, setPdfFile] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [isLoading, setIsLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const { documentId } = useParams();

    useEffect(() => {
        const getSignedUrl = async () => {
            try {
                const response = await apiClient().get(`/api/get-signed-url/${documentId}`);
                setPdfFile(response.data.url);
            } catch (error) {
                console.error(error);
            }
        };
        const getChatHistory = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient().get(`/api/chat-history/${documentId}`);
                setChatHistory(response.data.chats);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        getSignedUrl();
        getChatHistory();
    }, [documentId]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const MessageSkeleton = () => (
        <div className="animate-pulse flex space-x-4 mb-4">
            <div className="rounded-full bg-gray-300 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
                <div className="h-2 bg-gray-300 rounded"></div>
                <div className="space-y-2">
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="h-2 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            sendMessage();
        }
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + offset, numPages)));
    };

    const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 2));
    const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.5));

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const tempMessage = {
            query: inputMessage,
            isTemp: true
        };

        setChatHistory(prev => [...prev, tempMessage]);
        setIsMessageLoading(true);
        setInputMessage('');

        try {
            const response = await apiClient().post(`/api/chat`, {
                query: inputMessage,
                documentId
            });

            setChatHistory(prev => [
                ...prev.filter(msg => !msg.isTemp),
                response.data.chat
            ]);
        } catch (error) {
            console.error(error && error.response);
            // Optionally, you can add an error message to the chat history here
        } finally {
            setIsMessageLoading(false);
        }
    }

    return (
        <div className="flex responsive-height bg-[#f1f0ea]">
            <div className="hidden md:w-1/2 md:p-4 md:flex md:flex-col">
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
                <div ref={chatContainerRef} className="flex-grow overflow-auto p-4 space-y-4">
                    {isLoading ? (
                        <>
                            <MessageSkeleton />
                            <MessageSkeleton />
                            <MessageSkeleton />
                        </>
                    ) : (
                        chatHistory?.map((message, index) => (
                            <React.Fragment key={index}>
                                <div className="flex justify-end">
                                    <div className="flex">
                                        <Icon
                                            icon="uim:user-md"
                                            className="w-8 h-8 rounded-full border-2 mr-1 border-blue-500 bg-blue-200 p-1"
                                        />
                                        <div className="max-w-[50rem] px-4 py-2 rounded-lg bg-blue-500 text-white">
                                            {message.query}
                                        </div>
                                    </div>
                                </div>
                                {!message.isTemp && (
                                    <div className="flex justify-start">
                                        <div className="flex">
                                            <Icon
                                                icon="mingcute:ai-line"
                                                className="w-8 h-8 rounded-full border-2 mr-1 border-gray-300 bg-gray-100 p-1"
                                            />
                                            <div className="max-w-[50rem] px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                                                {message.answer}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    )}
                    {isMessageLoading && (
                        <div className="flex justify-start">
                        <div className="flex">
                            <Icon
                                icon="mingcute:ai-line"
                                className="w-8 h-8 rounded-full border-2 mr-1 border-gray-300 bg-gray-100 p-1"
                            />
                            <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                                <div className="jumping-dots">
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    )}
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