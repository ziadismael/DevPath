import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LimitReachedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-void-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-void-900 border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center gap-4">

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-electric-500/10 flex items-center justify-center mb-2">
                        <span className="text-3xl">🚀</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                        Free Limit Reached
                    </h3>

                    <p className="text-slate-300">
                        You have used your 1 free "Launch" interview. <br />
                        To continue practicing with unlimited AI interviews, please upgrade to Pro.
                    </p>

                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button
                            onClick={() => navigate('/pricing')}
                            className="w-full py-3 bg-electric-600 hover:bg-electric-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-electric-500/20"
                        >
                            View Pricing & Upgrade
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LimitReachedModal;
