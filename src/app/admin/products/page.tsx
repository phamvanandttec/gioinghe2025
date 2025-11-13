'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Company } from '@/types/company';
import styles from './products.module.css';

interface ProductWithCompany extends Product {
  company_name?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithCompany[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    company_id: '',
    status: 'SHOW'
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter.search) params.append('search', filter.search);
      if (filter.company_id) params.append('company_id', filter.company_id);
      if (filter.status) params.append('status', filter.status);

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        
        setProducts(data.map((product: any) => ({
              gtin: product.GTIN || '',
              name: product.Name || '',
              name_french: product['Name in French'] || '',
              description: product.Description || '',
              description_french: product['Description in French'] || '',
              brand_name: product['Brand Name'] || '',
              country_of_origin: product['Country of Origin'] || '',
              gross_weight_kg: product['Gross Weight (kg)'] || 0,
              net_weight_kg: product['Net Weight (kg)'] || 0,
              weight_unit: product['Weight Unit'] || 'kg',
              image_url: `/images/${Math.floor(Math.random() * 8) + 1}.jpg`,
              status: product.Status || 'SHOW',
              company_name: product['Company Name'] || ''
        } as ProductWithCompany)));
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Fetch companies for filter dropdown
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        
        setCompanies(data.data.map((company: any) => ({
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
        } as Company)));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };



  const handleHideProduct = async (gtin: string) => {
    try {
      const response = await fetch(`/api/products/${gtin}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'HIDDEN' }),
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
      } else {
        setError('Failed to hide product');
      }
    } catch (error) {
      console.error('Error hiding product:', error);
      setError('Error hiding product');
    }
  };

  const handleShowProduct = async (gtin: string) => {
    try {
      const response = await fetch(`/api/products/${gtin}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'SHOW' }),
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
      } else {
        setError('Failed to show product');
      }
    } catch (error) {
      console.error('Error showing product:', error);
      setError('Error showing product');
    }
  };

  const handleDeleteProduct = async (gtin: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${gtin}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error deleting product');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Product Management</h1>
        <div className={styles.actions}>
          <Link href="/admin/products/new" className={styles.addButton}>
            Add New Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className={styles.searchInput}
        />
        
        <select
          value={filter.company_id}
          onChange={(e) => setFilter({ ...filter, company_id: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="">All Companies</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="SHOW">Visible Products</option>
          <option value="HIDDEN">Hidden Products</option>
          <option value="">All Products</option>
        </select>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.productsGrid}>
          {products.length === 0 ? (
            <div className={styles.noProducts}>
              No products found. <Link href="/admin/products/new">Add the first product</Link>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.gtin} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.image_url ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.name}
                      width={300}
                      height={200}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      No Image
                    </div>
                  )}
                </div>
                
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>
                    {product.name}
                    <span className={styles.productNameFrench}>
                      / {product.name_french}
                    </span>
                  </h3>
                  
                  <p className={styles.productGtin}>GTIN: {product.gtin}</p>
                  
                  <p className={styles.productCompany}>
                    Company: {product.company_name || 'Unknown'}
                  </p>
                  
                  {product.brand_name && (
                    <p className={styles.productBrand}>Brand: {product.brand_name}</p>
                  )}
                  
                  {product.description && (
                    <p className={styles.productDescription}>
                      {product.description}
                    </p>
                  )}
                  
                   <div className={styles.productStatus}>
                    Status: <span className={`${styles.status} ${styles[product.status.toLowerCase()]}`}>
                      {product.status}
                    </span>
                  </div> 
                  
                  <div className={styles.productActions}>
                    <Link 
                      href={`/admin/products/${product.gtin}`}
                      className={styles.viewButton}
                    >
                      View/Edit
                    </Link>
                    
                    {product.status === 'SHOW' ? (
                      <button
                        onClick={() => handleHideProduct(product.gtin)}
                        className={styles.hideButton}
                      >
                        Hide
                      </button>
                    ) : (
                      <button
                        onClick={() => handleShowProduct(product.gtin)}
                        className={styles.showButton}
                      >
                        Show
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteProduct(product.gtin)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}