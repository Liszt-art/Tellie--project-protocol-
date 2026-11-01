import React from 'react';
import { X } from 'lucide-react';
import { TellieGardenView } from './TellieGardenView';

interface TellieGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TellieGardenModal: React.FC<TellieGardenModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-4 sm:p-6 border border-[#A8D2C4]/25 shadow-2xl my-auto text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors z-20"
          aria-label="Đóng vườn Tellie"
        >
          <X className="w-4 h-4" />
        </button>

        <TellieGardenView />
      </div>
    </div>
  );
};
