import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackForm({ onSubmitFeedback }) {
  const [rating, setRating] = useState(5);
  const [wasResolved, setWasResolved] = useState(true);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback({ rating, was_resolved: wasResolved, comment });
    toast.success('Thank you for rating our resolution service!');
  };

  return (
    <div className="bg-teal-50 dark:bg-teal-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-none p-6 shadow-md space-y-4">
      <h3 className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center space-x-2">
        <CheckCircle className="w-5 h-5 text-emerald-600" />
        <span>Incident Resolved — Rate Our Emergency Response</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Was your incident hazard satisfactorily resolved?
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setWasResolved(true)}
              className={`px-4 py-2 rounded-xl font-bold border transition ${
                wasResolved
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-900 border-slate-300 text-slate-700'
              }`}
            >
              Yes, Resolved
            </button>
            <button
              type="button"
              onClick={() => setWasResolved(false)}
              className={`px-4 py-2 rounded-xl font-bold border transition ${
                !wasResolved
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white dark:bg-slate-900 border-slate-300 text-slate-700'
              }`}
            >
              No, Issue Persists
            </button>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Satisfaction Rating (1 to 5 Stars)
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Feedback Comments (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details regarding team response time and professionalism..."
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition"
        >
          Submit Resolution Feedback
        </button>
      </form>
    </div>
  );
}
