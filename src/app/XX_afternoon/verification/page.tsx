'use client';
import { useState } from 'react';
import styles from './verification.module.css';

interface GTINValidationResult {
  gtin: string;
  isValid: boolean;
  productName?: string;
}

export default function GTINBulkVerificationPage() {
  const [gtinInput, setGtinInput] = useState('');
  const [results, setResults] = useState<GTINValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateGTINs = async () => {
    if (!gtinInput.trim()) return;

    setLoading(true);
    setSubmitted(true);
    
    // Split GTINs by line breaks and clean up
    const gtins = gtinInput
      .split('\n')
      .map(gtin => gtin.trim())
      .filter(gtin => gtin.length > 0);

    const validationResults: GTINValidationResult[] = [];

    // Check each GTIN
    for (const gtin of gtins) {
      try {
        const response = await fetch(`/XX_afternoon/products.json/${gtin}`);
        
        if (response.ok) {
          const product = await response.json();
          validationResults.push({
            gtin,
            isValid: true,
            productName: product.name?.en || 'Unknown Product'
          });
        } else {
          validationResults.push({
            gtin,
            isValid: false
          });
        }
      } catch (error) {
        console.error(`Error validating GTIN ${gtin}:`, error);
        validationResults.push({
          gtin,
          isValid: false
        });
      }
    }

    setResults(validationResults);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateGTINs();
  };

  const handleReset = () => {
    setGtinInput('');
    setResults([]);
    setSubmitted(false);
  };

  const allValid = results.length > 0 && results.every(result => result.isValid);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>GTIN Bulk Verification</h1>
        <p className={styles.subtitle}>
          Verify multiple GTIN numbers at once. Enter one GTIN per line.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="gtin-input" className={styles.label}>
            GTIN Numbers (one per line)
          </label>
          <textarea
            id="gtin-input"
            value={gtinInput}
            onChange={(e) => setGtinInput(e.target.value)}
            placeholder="Enter GTIN numbers, one per line:&#10;9780012345696&#10;9780012345831&#10;..."
            className={styles.textarea}
            rows={8}
            disabled={loading}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading || !gtinInput.trim()}
            className={styles.submitButton}
          >
            {loading ? 'Verifying...' : 'Verify GTINs'}
          </button>
          
          {submitted && (
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              New Verification
            </button>
          )}
        </div>
      </form>

      {submitted && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Verification Results</h2>
          
          {results.length > 0 && allValid && (
            <div className={styles.allValidBanner}>
              <span className={styles.checkmark}>✓</span>
              <span className={styles.allValidText}>All Valid</span>
            </div>
          )}

          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div
                key={index}
                className={`${styles.resultItem} ${result.isValid ? styles.valid : styles.invalid}`}
              >
                <div className={styles.gtinNumber}>{result.gtin}</div>
                <div className={styles.validationStatus}>
                  {result.isValid ? (
                    <>
                      <span className={styles.statusIcon}>✓</span>
                      <span className={styles.statusText}>Valid</span>
                      {result.productName && (
                        <span className={styles.productName}>
                          - {result.productName}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className={styles.statusIcon}>✗</span>
                      <span className={styles.statusText}>Invalid</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <p>
              <strong>
                {results.filter(r => r.isValid).length} of {results.length} GTINs are valid
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}