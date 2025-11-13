'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './public.module.css';

export default function PublicHomePage() {
  const [sampleGTIN, setSampleGTIN] = useState('9780012345696');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Product Information System</h1>
        <p className={styles.subtitle}>
          Access product information and verify GTIN numbers
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔍</div>
          <h2 className={styles.featureTitle}>GTIN Bulk Verification</h2>
          <p className={styles.featureDescription}>
            Verify multiple GTIN numbers at once to check if they are registered and valid in our database.
          </p>
          <Link href="/XX_afternoon/verification" className={styles.featureButton}>
            Start Verification
          </Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📦</div>
          <h2 className={styles.featureTitle}>View Product Information</h2>
          <p className={styles.featureDescription}>
            Look up detailed product information using a GTIN number. View in English or French.
          </p>
          
          <div className={styles.productLookup}>
            <input
              type="text"
              value={sampleGTIN}
              onChange={(e) => setSampleGTIN(e.target.value)}
              placeholder="Enter GTIN number"
              className={styles.gtinInput}
              pattern="\d{13,14}"
              maxLength={14}
            />
            <Link 
              href={`/XX_afternoon/01/${sampleGTIN}`} 
              className={styles.featureButton}
            >
              View Product
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.apiInfo}>
        <h2 className={styles.apiTitle}>Developer API</h2>
        <p className={styles.apiDescription}>
          Access our JSON API endpoints for integration:
        </p>
        
        <div className={styles.apiEndpoints}>
          <div className={styles.endpoint}>
            <code className={styles.endpointUrl}>GET /XX_afternoon/products.json</code>
            <span className={styles.endpointDesc}>List all products with pagination</span>
          </div>
          
          <div className={styles.endpoint}>
            <code className={styles.endpointUrl}>GET /XX_afternoon/products.json?query=keyword</code>
            <span className={styles.endpointDesc}>Search products by keyword</span>
          </div>
          
          <div className={styles.endpoint}>
            <code className={styles.endpointUrl}>GET /XX_afternoon/products.json/[GTIN]</code>
            <span className={styles.endpointDesc}>Get individual product by GTIN</span>
          </div>
        </div>
      </div>
    </div>
  );
}