'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { validateGTIN } from '@/types/company';
import styles from './product.module.css';

interface ProductPageProps {
  params: Promise<{ gtin: string }>;
}

interface ProductData {
  name: { en: string; fr: string };
    image?: string;
  description: { en: string; fr: string };
  gtin: string;
  brand: string;
  countryOfOrigin: string;
  weight: { gross: number; net: number; unit: string };
  company: {
    companyName: string;
    companyAddress: string;
    companyTelephone: string;
    companyEmail: string;
    owner: { name: string; mobileNumber: string; email: string };
    contact: { name: string; mobileNumber: string; email: string };
  };
}

export default function PublicProductPage({ params }: ProductPageProps) {
  const { gtin } = use(params);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    fetchProduct();
  }, [gtin]);

  const fetchProduct = async () => {
    try {
      if (!validateGTIN(gtin)) {
        setError('Invalid GTIN format');
        setLoading(false);
        return;
      }

      const response = await fetch(`/XX_afternoon/products.json/${gtin}`);
      
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else if (response.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  if (loading) {
    return (
      <div className={styles.container} lang={language}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{language === 'en' ? 'Loading product...' : 'Chargement du produit...'}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container} lang={language}>
        <div className={styles.error}>
          <h1>{language === 'en' ? 'Product Not Found' : 'Produit non trouvé'}</h1>
          <p>
            {language === 'en'
              ? 'The requested product could not be found or is not available.'
              : 'Le produit demandé est introuvable ou non disponible.'
            }
          </p>
          <div className={styles.errorGtin}>GTIN: {gtin}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} lang={language}>
      {/* Language Toggle */}
      <div className={styles.languageToggle}>
        <button
          onClick={toggleLanguage}
          className={styles.langButton}
          aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
        >
          <span className={styles.langText}>
            {language === 'en' ? 'EN' : 'FR'}
          </span>
          <span className={styles.langDivider}>/</span>
          <span className={styles.langInactive}>
            {language === 'en' ? 'FR' : 'EN'}
          </span>
        </button>
      </div>

      {/* Product Card */}
      <div className={styles.productCard}>
        {/* Company Name */}
        <div className={styles.companyName}>
          {product.company.companyName}
        </div>

        {/* Product Image */}
        <div className={styles.imageContainer}>
          <Image
            src={product.image ?? '/images/placeholder.svg'}
            alt={product.name[language] || product.name.en}
            width={400}
            height={300}
            className={styles.productImage}
            onError={(e) => {
              // Fallback to placeholder if image not found
              (e.target as HTMLImageElement).src = '/images/placeholder.svg';
            }}
          />
        </div>

        {/* GTIN */}
        <div className={styles.gtin}>
          <strong>GTIN:</strong> {product.gtin}
        </div>

        {/* Product Name */}
        <h1 className={styles.productName}>
          {product.name[language] || product.name.en}
        </h1>

        {/* Brand (if available) */}
        {product.brand && (
          <div className={styles.brand}>
            <strong>
              {language === 'en' ? 'Brand:' : 'Marque:'}
            </strong>{' '}
            {product.brand}
          </div>
        )}

        {/* Product Description */}
        <div className={styles.description}>
          {product.description[language] || product.description.en || (
            language === 'en' ? 'No description available.' : 'Aucune description disponible.'
          )}
        </div>

        {/* Weight Information */}
        <div className={styles.weightInfo}>
          {product.weight.gross > 0 && (
            <div className={styles.weightItem}>
              <strong>
                {language === 'en' ? 'Weight:' : 'Poids:'}
              </strong>{' '}
              {product.weight.gross}
              {product.weight.unit}
            </div>
          )}
          
          {product.weight.net > 0 && product.weight.net !== product.weight.gross && (
            <div className={styles.weightItem}>
              <strong>
                {language === 'en' ? 'Net Content Weight:' : 'Poids du contenu net:'}
              </strong>{' '}
              {product.weight.net}
              {product.weight.unit}
            </div>
          )}
        </div>

        {/* Country of Origin */}
        {product.countryOfOrigin && (
          <div className={styles.countryOrigin}>
            <strong>
              {language === 'en' ? 'Country of Origin:' : 'Pays d\'origine:'}
            </strong>{' '}
            {product.countryOfOrigin}
          </div>
        )}

        {/* Company Information */}
        <div className={styles.companyInfo}>
          <h2 className={styles.companyInfoTitle}>
            {language === 'en' ? 'Company Information' : 'Informations sur l\'entreprise'}
          </h2>
          
          {product.company.companyAddress && (
            <div className={styles.companyDetail}>
              <strong>
                {language === 'en' ? 'Address:' : 'Adresse:'}
              </strong>
              <span>{product.company.companyAddress}</span>
            </div>
          )}
          
          {product.company.companyTelephone && (
            <div className={styles.companyDetail}>
              <strong>
                {language === 'en' ? 'Telephone:' : 'Téléphone:'}
              </strong>
              <span>{product.company.companyTelephone}</span>
            </div>
          )}
          
          {product.company.companyEmail && (
            <div className={styles.companyDetail}>
              <strong>Email:</strong>
              <span>{product.company.companyEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}