'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';
import { Company, Product } from '@/types/company';

export default function CompanyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const [company, setCompany] = useState<Company | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Company>({
        name: '',
        address: '',
        telephone: '',
        email: '',
        owner_name: '',
        owner_mobile: '',
        owner_email: '',
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (id && id !== 'new') {
            fetchCompany();
            fetchProducts();
        } else if (id === 'new') {
            setIsEditing(true);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchCompany = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/companies/${id}`);
            const result = await response.json();
            
            if (result.success) {
                setCompany({
                    id: result.data.Id || 0,
                    name: result.data['Company Name'] ||'',
                    address: result.data['Company Address'] || '',
                    telephone: result.data['Company Telephone Number'] || '',
                    email: result.data['Company Email Address'] || '',
                    owner_name: result.data['Owner Name'] || '',
                    owner_mobile: result.data['Owner Mobile Number'] || '',
                    owner_email: result.data['Owner Email Address'] || '',
                    contact_name: result.data['Contact Name'] || '',
                    contact_mobile: result.data['Contact Mobile Number'] || '',
                    contact_email: result.data['Contact Email Address'] || '',
                    status: result.data.Status || ''
                });
                // Map API response to formData structure
                setFormData({
                    id: result.data.Id || 0,
                    name: result.data['Company Name'] ||'',
                    address: result.data['Company Address'] || '',
                    telephone: result.data['Company Telephone Number'] || '',
                    email: result.data['Company Email Address'] || '',
                    owner_name: result.data['Owner Name'] || '',
                    owner_mobile: result.data['Owner Mobile Number'] || '',
                    owner_email: result.data['Owner Email Address'] || '',
                    contact_name: result.data['Contact Name'] || '',
                    contact_mobile: result.data['Contact Mobile Number'] || '',
                    contact_email: result.data['Contact Email Address'] || '',
                    status: result.data.Status || ''
                });
            } else {
                setError(result.error || 'Failed to fetch company');
            }
        } catch (err) {
            setError('An error occurred while fetching company');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/companies/${id}/products`);
            const result = await response.json();
            
            if (result.success) {
                const productArray: Product[] = (result.data || []).map((item: any) => ({
                   id: item['GTIN'] || '',
                    company_id: item['Company Id'] || 0,
                    name: item['Name'] || '',
                    description: item['Description'] || '',
                    name_french: item['Name in French'] || '',
                    description_french: item['Description in French'] || '',
                    brand_name: item['Brand Name'] || '',
                    country_of_origin: item['Country of Origin'] || '',
                    gross_weight_kg: item['Gross Weight (with packaging)'] || 0,
                    net_weight_kg: item['Net Content Weight'] || 0,
                    weight_unit: item['Weight Unit'] || '',
                    status: item['Status'] || ''
                }));
                setProducts(productArray);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = id === 'new' ? '/api/companies' : `/api/companies/${id}`;
            const method = id === 'new' ? 'POST' : 'PUT';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                if (id === 'new') {
                    router.push('/admin');
                } else {
                    setCompany(formData);
                    setIsEditing(false);
                    alert('Company updated successfully');
                }
            } else {
                alert(result.error || 'Failed to save company');
            }
        } catch (err) {
            alert('An error occurred while saving company');
            console.error(err);
        }
    };

    const handleCancel = () => {
        if (id === 'new') {
            router.push('/admin');
        } else {
            setFormData(company!);
            setIsEditing(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
                <button onClick={() => router.push('/admin')} className={styles.backButton}>
                    Back to Companies
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => router.push('/admin')} className={styles.backButton}>
                    ← Back to Companies
                </button>
                <h1 className={styles.title}>
                    {id === 'new' ? 'Create New Company' : isEditing ? 'Edit Company' : 'Company Details'}
                </h1>
                {!isEditing && id !== 'new' && (
                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                        Edit Company
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Company Information</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Company Name *</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            ) : (
                                <div className={styles.value}>{company?.name}</div>
                            )}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Email Address *</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            ) : (
                                <div className={styles.value}>{company?.email}</div>
                            )}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Telephone Number *</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    required
                                />
                            ) : (
                                <div className={styles.value}>{company?.telephone}</div>
                            )}
                        </div>
                        
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Address *</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                />
                            ) : (
                                <div className={styles.value}>{company?.address}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Owner Information</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Owner Name *</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="owner_name"
                                    value={formData.owner_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            ) : (
                                <div className={styles.value}>{company?.owner_name}</div>
                            )}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Owner Mobile *</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="owner_mobile"
                                    value={formData.owner_mobile}
                                    onChange={handleInputChange}
                                    required
                                />
                            ) : (
                                <div className={styles.value}>{company?.owner_mobile}</div>
                            )}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Owner Email *</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="owner_email"
                                    value={formData.owner_email}
                                    onChange={handleInputChange}
                                    required
                                />
                            ) : (
                                <div className={styles.value}>{company?.owner_email}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contact Information</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Contact Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="contact_name"
                                    value={formData.contact_name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className={styles.value}>{company?.contact_name || 'N/A'}</div>
                            )}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Contact Mobile</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="contact_mobile"
                                    value={formData.contact_mobile}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className={styles.value}>{company?.contact_mobile || 'N/A'}</div>
                            )}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Contact Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className={styles.value}>{company?.contact_email || 'N/A'}</div>
                            )}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.saveButton}>
                            {id === 'new' ? 'Create Company' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                )}
            </form>

            {!isEditing && id !== 'new' && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Associated Products</h2>
                    {products.length === 0 ? (
                        <p className={styles.noProducts}>No products found for this company.</p>
                    ) : (
                        <div className={styles.productsGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <h3>{product.name}</h3>
                                    {product.description && <p>{product.description}</p>}
                                    {product.country_of_origin && (
                                        <div className={styles.price}>{product.country_of_origin}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
