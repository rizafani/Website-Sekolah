import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, BarChart2, Sparkles, AlertCircle } from 'lucide-react';
import { SchoolPoll } from '../types/index.ts';
import { api } from '../services/api.ts';

interface PollWidgetProps {
  poll: SchoolPoll;
  onPollUpdated?: (freshPoll: SchoolPoll) => void;
}

export const PollWidget: React.FC<PollWidgetProps> = ({ poll, onPollUpdated }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    return localStorage.getItem(`voted_poll_${poll.id}`) === 'true';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<SchoolPoll>(poll);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) {
      setErrorMsg('Pilih salah satu opsi sebelum mengirim suara.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const voterId = 'client_' + (localStorage.getItem('sman1julok_voter_id') || Math.random().toString(36).substring(2, 9));
      localStorage.setItem('sman1julok_voter_id', voterId);

      const res = await api.votePoll(poll.id, selectedOption, voterId);
      if (res.success && res.poll) {
        setCurrentPoll(res.poll);
        setHasVoted(true);
        localStorage.setItem(`voted_poll_${poll.id}`, 'true');
        if (onPollUpdated) onPollUpdated(res.poll);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirimkan suara.');
      setHasVoted(true); // Treat as already voted if server reports so
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>SURVEI & SUARA WARGA SEKOLAH</span>
      </div>

      <h3 className="text-base font-bold text-slate-900 leading-snug">
        {currentPoll.title}
      </h3>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
        {currentPoll.question}
      </p>

      {errorMsg && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {hasVoted ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Suara Anda telah dicatat
            </span>
            <span className="font-mono">{currentPoll.totalVotes} total suara</span>
          </div>

          <div className="space-y-2.5">
            {currentPoll.options.map((opt) => {
              const percentage = currentPoll.totalVotes > 0 
                ? Math.round((opt.votes / currentPoll.totalVotes) * 100) 
                : 0;

              return (
                <div key={opt.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{opt.text}</span>
                    <span className="font-bold text-sky-950 font-mono ml-2 shrink-0">{percentage}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-900 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{opt.votes} pemilih</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleVote} className="mt-4 space-y-3">
          <div className="space-y-2">
            {currentPoll.options.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedOption === opt.id
                    ? 'bg-sky-50/70 border-sky-400 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="radio"
                  name="poll_option"
                  value={opt.id}
                  checked={selectedOption === opt.id}
                  onChange={() => setSelectedOption(opt.id)}
                  className="mt-0.5 text-sky-900 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-800 font-medium leading-relaxed">
                  {opt.text}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              {currentPoll.totalVotes} responden
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !selectedOption}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Suara'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
