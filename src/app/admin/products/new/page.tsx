'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Company, validateGTIN } from '@/types/company';
import ImageUploader from '@/components/ImageUploader';
import styles from './new-product.module.css';

export default function NewProductPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    gtin: '',
    company_id: '',
    name: '',
    name_french: '',
    description: '',
    description_french: '',
    brand_name: '',
    country_of_origin: '',
    gross_weight_kg: 0,
    net_weight_kg: 0,
    weight_unit: 'kg',
    image: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        const companies: Company[] = data.data.map((company: any) => ({
                id: company.Id || 0,
                name: company['Company Name'] ||'',
                address: company['Company Address'] || '',
                telephone: company['Company Telephone Number'] || '',
                email: company['Company Email Address'] || '',
                owner_name: company['Owner Name'] || '',
                owner_mobile: company['Owner Mobile Number'] || '',
                owner_email: company['Owner Email Address'] || '',
                contact_name: company['Contact Name'] || '',
                contact_mobile: company['Contact Mobile Number'] || '',
                contact_email: company['Contact Email Address'] || '',
                status: company.Status || ''
        }));
        
        setCompanies(companies.filter((company: Company) => company.status === 'ACTIVE'));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('weight') || name === 'company_id' ? 
        (parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.gtin || !formData.company_id || !formData.name || !formData.name_french) {
      setError('GTIN, Company, English Name, and French Name are required');
      return;
    }

    if (!validateGTIN(formData.gtin)) {
      setError('GTIN must be 13 or 14 digits');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          company_id: Number.parseInt(formData.company_id.toString())
        }),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        alert('Product created successfully!');
        router.push(`/admin/products/${createdProduct.GTIN}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      gtin: '',
      company_id: '',
      name: '',
      name_french: '',
      description: '',
      description_french: '',
      brand_name: '',
      country_of_origin: '',
      gross_weight_kg: 0,
      net_weight_kg: 0,
      weight_unit: 'kg',
      image: ''
    });
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add New Product</h1>
        <div className={styles.actions}>
          <Link href="/admin/products" className={styles.backButton}>
            Back to Products
          </Link>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formSection}>
            <h2>Basic Information</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="gtin">GTIN (13-14 digits) *:</label>
                <input
                  type="text"
                  id="gtin"
                  name="gtin"
                  value={formData.gtin}
                  onChange={handleInputChange}
                  placeholder="1234567890123"
                  pattern="\d{13,14}"
                  maxLength={14}
                  required
                />
                <small>Enter a 13 or 14-digit Global Trade Item Number</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company_id">Company *:</label>
                <select
                  id="company_id"
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Product Name (English) *:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name in English"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name_french">Product Name (French) *:</label>
                <input
                  type="text"
                  id="name_french"
                  name="name_french"
                  value={formData.name_french}
                  onChange={handleInputChange}
                  placeholder="Enter product name in French"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description (English):</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description in English"
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description_french">Description (French):</label>
                <textarea
                  id="description_french"
                  name="description_french"
                  value={formData.description_french}
                  onChange={handleInputChange}
                  placeholder="Enter product description in French"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Product Details</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="brand_name">Brand Name:</label>
                <input
                  type="text"
                  id="brand_name"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country_of_origin">Country of Origin:</label>
                <input
                  type="text"
                  id="country_of_origin"
                  name="country_of_origin"
                  value={formData.country_of_origin}
                  onChange={handleInputChange}
                  placeholder="Enter country of origin"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="gross_weight_kg">Gross Weight (kg):</label>
                <input
                  type="number"
                  id="gross_weight_kg"
                  name="gross_weight_kg"
                  value={formData.gross_weight_kg || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="net_weight_kg">Net Weight (kg):</label>
                <input
                  type="number"
                  id="net_weight_kg"
                  name="net_weight_kg"
                  value={formData.net_weight_kg || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="weight_unit">Weight Unit:</label>
                <select
                  id="weight_unit"
                  name="weight_unit"
                  value={formData.weight_unit}
                  onChange={handleInputChange}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Product Image</h2>
            
            <div className={styles.formGroup}>
              <ImageUploader
                currentImage={formData.image || '/images/placeholder.svg'}
                onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                onImageRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
              disabled={loading}
            >
              Reset Form
            </button>
            
            <Link href="/admin/products" className={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}