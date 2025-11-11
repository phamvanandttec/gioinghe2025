'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Company } from '@/types/company';

export default function AdminPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/companies');
            const result = await response.json();
            
            if (result.success) {
                setCompanies(result.data);
            } else {
                setError(result.error || 'Failed to fetch companies');
            }
        } catch (err) {
            setError('An error occurred while fetching companies');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this company?')) {
            return;
        }

        try {
            const response = await fetch(`/api/companies/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            
            if (result.success) {
                setCompanies(companies.filter(c => c.id !== id));
            } else {
                alert(result.error || 'Failed to delete company');
            }
        } catch (err) {
            alert('An error occurred while deleting the company');
            console.error(err);
        }
    };

    const handleCreate = () => {
        router.push('/admin/companies/new');
    };

    const handleView = (id: number) => {
        router.push(`/admin/companies/${id}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading companies...</div>
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
                <h1 className={styles.title}>Company Management</h1>
                <button onClick={handleCreate} className={styles.createButton}>
                    + Create New Company
                </button>
            </div>
            
            <div className={styles.content}>
                {companies.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No companies found. Create your first company!</p>
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
                                    <tr key={company.Id}>
                                        <td>{company.Id}</td>
                                        <td>{company['Company Name']}</td>
                                        <td>{company['Company Email Address']}</td>
                                        <td>{company['Company Telephone Number']}</td>
                                        <td>{company['Owner Name']}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleView(company.Id!)}
                                                    className={styles.viewButton}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(company.Id!)}
                                                    className={styles.deleteButton}
                                                >
                                                    Delete
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