import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { API_URL } from '../../config'


const ContactUs = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', comment: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="container py-5">
      <Helmet>
        <title>{t('Contact Us')}</title>
        <meta
          name="description"
          content="Get in touch with the MySalon team. We'd love to hear from you."
        />
      </Helmet>
      <h2 className="text-center mb-4">{t('Contact Us')}</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: 500 }}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            {t('Name')}
          </label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            {t('Email')}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="comment">
            {t('Comment')}
          </label>
          <textarea
            id="comment"
            name="comment"
            className="form-control"
            rows="4"
            value={form.comment}
            onChange={handleChange}
            required
          />
        </div>
        {status === 'success' && (
          <div className="alert alert-success" role="alert">
            {t('Message sent successfully!')}
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-danger" role="alert">
            {t('Something went wrong')}
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100">
          {t('Submit')}
        </button>
      </form>
      <div className="mt-5" style={{ maxWidth: 600, margin: '0 auto' }}>
        <iframe
          title="Salon Location"
          src="https://www.google.com/maps?q=New+York+City&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
