'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Company } from '@/types/company';

export default function DeactivatedCompaniesPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDeactivatedCompanies();
    }, []);

    const fetchDeactivatedCompanies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/companies/deactivated');
            const result = await response.json();
            
            if (result.success) {
                setCompanies(result.data);
            } else {
                setError(result.error || 'Failed to fetch deactivated companies');
            }
        } catch (err) {
            setError('An error occurred while fetching deactivated companies');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReactivate = async (id: number) => {
        if (!confirm('Are you sure you want to reactivate this company? This will also show all associated products.')) {
            return;
        }

        try {
            const response = await fetch(`/api/companies/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reactivate' })
            });
            const result = await response.json();
            
            if (result.success) {
                setCompanies(companies.filter(c => c.id !== id));
                alert('Company reactivated successfully');
            } else {
                alert(result.error || 'Failed to reactivate company');
            }
        } catch (err) {
            alert('An error occurred while reactivating the company');
            console.error(err);
        }
    };

    const handleView = (id: number) => {
        router.push(`/admin/companies/${id}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading deactivated companies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={() => router.push('/admin')} className={styles.backButton}>
                        ← Back to Active Companies
                    </button>
                    <h1 className={styles.title}>Deactivated Companies</h1>
                </div>
            </div>
            
            <div className={styles.content}>
                {companies.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No deactivated companies found.</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Company Name</th>
                                    <th>Email</th>
                                    <th>Telephone</th>
                                    <th>Owner Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) => (
                                    <tr key={company.Id} className={styles.deactivatedRow}>
                                        <td>{company.Id}</td>
                                        <td>{company['Company Name']}</td>
                                        <td>{company['Company Email Address']}</td>
                                        <td>{company['Company Telephone Number']}</td>
                                        <td>{company['Owner Name']}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleView(company.Id)}
                                                    className={styles.viewButton}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleReactivate(company.Id)}
                                                    className={styles.reactivateButton}
                                                >
                                                    Reactivate
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}