import React, { useState } from 'react';
import { 
  X, Share2, Copy, Check, Globe, QrCode, 
  Sparkles, ExternalLink 
} from 'lucide-react';
import { PopulatedTrip } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: PopulatedTrip | null;
  onNavigateToPublicView: (tripId: string) => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  trip,
  onNavigateToPublicView,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const publicUrl = `${window.location.origin}/#trip/${trip.shareSlug || trip.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    success('Link Copied!', 'Public itinerary link copied to clipboard.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-coral-400" />
            <h3 className="font-extrabold text-base">Share Itinerary</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <img src={trip.coverImage} alt={trip.title} className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <div className="font-extrabold text-slate-900 text-sm">{trip.title}</div>
              <div className="text-xs text-slate-500">{trip.stops.length} Cities · {trip.days.length} Days Itinerary</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Public Sharable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl shrink-0 transition-colors shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Public & Forkable:</strong> Anyone with this link can view this itinerary and clone it into their GlobeTrotter workspace with 1-click.
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <button
              onClick={() => {
                onNavigateToPublicView(trip.id);
                onClose();
              }}
              className="text-xs font-bold text-slate-700 hover:text-coral-600 flex items-center gap-1 transition-colors"
            >
              <span>Preview Public Web Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
