'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === 'admin') {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ passphrase }),
        });
        
       if (response.ok) {
        router.push('/admin');
      } else {
        setError('Invalid passphrase');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
    } else {
              setError('Invalid passphrase');

    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Password:
            </label>
            <input 
              className={styles.input}
              type="password" 
              name="password" 
              id="password"
              placeholder="Enter your password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
        
        <div className={styles.quickLinks}>
          <h3>Quick Access</h3>
          <div className={styles.linkButtons}>
            <button 
              className={styles.linkButton}
              onClick={() => router.push('/admin')}
              type="button"
            >
              Company Management
            </button>
            <button 
              className={styles.linkButton}
              onClick={() => router.push('/admin/products')}
              type="button"
            >
              Product Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}