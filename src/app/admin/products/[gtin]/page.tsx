'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Company, validateGTIN } from '@/types/company';
import ImageUploader from '@/components/ImageUploader';
import styles from './page.module.css';

interface ProductWithCompany extends Product {
  company_name?: string;
}

interface ProductDetailPageProps {
  params: Promise<{ gtin: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { gtin } = use(params);
  const [product, setProduct] = useState<ProductWithCompany | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_french: '',
    description: '',
    description_french: '',
    brand_name: '',
    country_of_origin: '',
    gross_weight_kg: 0,
    net_weight_kg: 0,
    weight_unit: 'kg',
    image: '',
    status: 'SHOW' as 'SHOW' | 'HIDDEN'
  });

  useEffect(() => {
    if (validateGTIN(gtin)) {
      fetchProduct();
      fetchCompanies();
    } else {
      setError('Invalid GTIN format');
      setLoading(false);
    }
  }, [gtin]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${gtin}`);
      if (response.ok) {
        const data = await response.json();
        setProduct({
          gtin: data.gtin || gtin,
          company_id: data['Company Id'] || '',
          company_name: data['Company Name'] || '',
          name: data['Name'] || '',
          name_french: data['Name in French'] || '',
          description: data['Description'] || '',
          description_french: data['Description in French'] || '',
          brand_name: data['Brand Name'] || '',
          country_of_origin: data['Country of Origin'] || '',
          gross_weight_kg: data['Gross Weight (kg)'] || 0,
          net_weight_kg: data['Net Weight (kg)'] || 0,
          weight_unit: data['Weight Unit'] || 'kg',
          image: data['Image'] || '',
          status: data['Status'] || 'SHOW'
        });
        setFormData({
          name: data['Name'] || '',
          name_french: data['Name in French'] || '',
          description: data['Description'] || '',
          description_french: data['Description in French'] || '',
          brand_name: data['Brand Name'] || '',
          country_of_origin: data['Country of Origin'] || '',
          gross_weight_kg: data['Gross Weight (kg)'] || 0,
          net_weight_kg: data['Net Weight (kg)'] || 0,
          weight_unit: data['Weight Unit'] || 'kg',
          image: data.Image || '',
          status: data.Status || 'SHOW'
        });
      } else if (response.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('weight') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/api/products/${gtin}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProduct({
          gtin: data.gtin || gtin,
          company_id: data['Company Id'] || '',
          company_name: data['Company Name'] || '',
          name: data['Name'] || '',
          name_french: data['Name in French'] || '',
          description: data['Description'] || '',
          description_french: data['Description in French'] || '',
          brand_name: data['Brand Name'] || '',
          country_of_origin: data['Country of Origin'] || '',
          gross_weight_kg: data['Gross Weight (kg)'] || 0,
          net_weight_kg: data['Net Weight (kg)'] || 0,
          weight_unit: data.weight_unit || 'kg',
          image: data.image || '',
          status: data.Status || 'SHOW'
        });
        setIsEditing(false);
        alert('Product updated successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (product) {
      setFormData({
        name: product.name || '',
        name_french: product.name_french || '',
        description: product.description || '',
        description_french: product.description_french || '',
        brand_name: product.brand_name || '',
        country_of_origin: product.country_of_origin || '',
        gross_weight_kg: product.gross_weight_kg || 0,
        net_weight_kg: product.net_weight_kg || 0,
        weight_unit: product.weight_unit || 'kg',
        image: product.image || '',
        status: product.status || 'SHOW'
      });
    }
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${gtin}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error deleting product');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Link href="/admin/products" className={styles.backButton}>
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isEditing ? 'Edit Product' : 'Product Details'}</h1>
        <div className={styles.actions}>
          <Link href="/admin/products" className={styles.backButton}>
            Back to Products
          </Link>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {product && (
        <div className={styles.productContent}>
          <div className={styles.productImage}>
            {isEditing ? (
              <ImageUploader
                currentImage={formData.image || '/images/placeholder.svg'}
                onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                onImageRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
              />
            ) : (
              <>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src="/images/placeholder.svg"
                    alt="No image available"
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </>
            )}
          </div>

          <div className={styles.productDetails}>
            <div className={styles.formGroup}>
              <label>GTIN:</label>
              <div className={styles.gtinDisplay}>{product.gtin}</div>
            </div>

            <div className={styles.formGroup}>
              <label>Company:</label>
              <div className={styles.companyDisplay}>
                {product.company_name || 'Unknown Company'}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Product Name (English) *:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.name}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name_french">Product Name (French) *:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name_french"
                    name="name_french"
                    value={formData.name_french}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.name_french}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description (English):</label>
                {isEditing ? (
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.description || 'Not provided'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description_french">Description (French):</label>
                {isEditing ? (
                  <textarea
                    id="description_french"
                    name="description_french"
                    value={formData.description_french}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.description_french || 'Not provided'}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="brand_name">Brand Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="brand_name"
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.brand_name || 'Not provided'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country_of_origin">Country of Origin:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="country_of_origin"
                    name="country_of_origin"
                    value={formData.country_of_origin}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.country_of_origin || 'Not provided'}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="gross_weight_kg">Gross Weight (kg):</label>
                {isEditing ? (
                  <input
                    type="number"
                    id="gross_weight_kg"
                    name="gross_weight_kg"
                    value={formData.gross_weight_kg}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.gross_weight_kg || 'Not provided'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="net_weight_kg">Net Weight (kg):</label>
                {isEditing ? (
                  <input
                    type="number"
                    id="net_weight_kg"
                    name="net_weight_kg"
                    value={formData.net_weight_kg}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <div className={styles.fieldValue}>{product.net_weight_kg || 'Not provided'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="weight_unit">Weight Unit:</label>
                {isEditing ? (
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
                ) : (
                  <div className={styles.fieldValue}>{product.weight_unit}</div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Status:</label>
              {isEditing ? (
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="SHOW">Visible (SHOW)</option>
                  <option value="HIDDEN">Hidden (HIDDEN)</option>
                </select>
              ) : (
                <div className={`${styles.fieldValue} ${styles.statusValue}`}>
                  <span className={`${styles.status} ${styles[product.status?.toLowerCase()]}`}>
                    {product.status}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.actionButtons}>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className={styles.cancelButton}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                  >
                    Delete Product
                  </button>
                </>
              )}
            </div>

            {product.created_at && (
              <div className={styles.metadata}>
                <small>Created: {new Date(product.created_at).toLocaleString()}</small>
                {product.updated_at && (
                  <small>Updated: {new Date(product.updated_at).toLocaleString()}</small>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}