/**
 * User Feedback Widget
 * Collects user feedback and ratings
 */
'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = async () => {
    if (!feedback.trim() || rating === 0) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback,
          rating,
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setFeedback('');
        setRating(0);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center z-50 transition-all hover:scale-110"
        aria-label="Donner votre avis"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">âœ“</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Merci pour votre retour!
                </h3>
                <p className="text-sm text-gray-600">
                  Votre avis nous aide à améliorer AgriLogistic
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Votre Avis</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Comment évaluez-vous votre expérience?
                  </p>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-3xl transition-transform hover:scale-110"
                      >
                        {star <= rating ? 'â­' : 'â˜†'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 font-medium mb-2">
                    Partagez votre expérience (optionnel)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Qu'avez-vous aimé? Qu'est-ce qui pourrait être amélioré?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{feedback.length}/500</p>
                </div>

                <button
                  onClick={submitFeedback}
                  disabled={rating === 0 || isSubmitting}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
