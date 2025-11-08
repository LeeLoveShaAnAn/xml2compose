'use client';

import { useState, FormEvent } from 'react';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    formData.append('access_key', 'a6b941e5-d568-43d8-800e-9009299100b4');
    formData.append('subject', 'New Subscription from xml2compose.dev');
    formData.append('from_name', 'xml2compose.dev');
    formData.append('email', email);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✓ Thanks for subscribing! We will notify you at launch.');
        setEmail('');
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
    <>
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Notify Me'}
        </button>
      </form>
      {message && (
        <p 
          id="form-message" 
          className={message.startsWith('✓') ? 'success' : 'error'}
          style={{ 
            marginTop: '10px', 
            padding: '10px', 
            borderRadius: '8px',
            background: message.startsWith('✓') ? '#34C759' : '#FF3B30',
            color: 'white'
          }}
        >
          {message}
        </p>
      )}
    </>
  );
}

