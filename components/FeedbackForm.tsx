'use client';

import { useState, FormEvent } from 'react';

export function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    formData.append('access_key', 'a6b941e5-d568-43d8-800e-9009299100b4');
    formData.append('subject', 'New Feedback from xml2compose.dev');
    formData.append('from_name', 'xml2compose.dev Feedback');
    formData.append('feedback', feedback);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✓ Thanks for your feedback!');
        setFeedback('');
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setMessage('✗ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="feedback"
        placeholder="Your feedback or suggestions..."
        required
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </button>
      {message && (
        <div
          id="feedback-message"
          style={{
            marginTop: '10px',
            padding: '10px',
            borderRadius: '8px',
            background: message.startsWith('✓') ? '#34C759' : '#FF3B30',
            color: 'white',
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
}

