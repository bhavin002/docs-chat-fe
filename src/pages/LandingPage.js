import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const LandingPage = () => {
    const navigate = useNavigate();
    const [auth] = useAuth();
    console.log('✌️auth --->', auth);

    const getStarted = () => {
        if (auth?.user?.userId) {
            navigate('/documents');
        } else {
            navigate('/auth');
        }
    }

    return (
        <div className="bg-gray-900 text-white responsive-height flex flex-col justify-center items-center">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-5xl font-bold mb-6">Chat with any PDF document</h1>
                <p className="text-xl mb-8">
                    Upload your PDF, ask questions, and get instant answers. Our AI-powered chat brings your documents to life.
                </p>
                <div className="flex justify-center space-x-4 mb-12">
                    <button onClick={getStarted} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center">
                        Get started for free
                    </button>
                </div>
            </div>
        </div>
    );
};


export default LandingPage;