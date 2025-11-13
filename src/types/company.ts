export interface Company {
  id?: number;
  name: string;
  address: string;
  telephone: string;
  email: string;
  
  // Owner information
  owner_name: string;
  owner_mobile: string;
  owner_email: string;
  
  // Contact information
  contact_name: string;
  contact_mobile: string;
  contact_email: string;
  
  // Status
  status: 'ACTIVE' | 'DEACTIVE';
}

export interface Product {
  gtin: string; // Primary key - 13 or 14 digit number
  company_id: number;
  name: string;
  name_french: string;
  description?: string;
  description_french?: string;
  brand_name?: string;
  country_of_origin?: string;
  gross_weight_kg?: number;
  net_weight_kg?: number;
  weight_unit: string;
  image?: string;
  status: 'SHOW' | 'HIDDEN';
}

// GTIN validation function
export const validateGTIN = (gtin: string): boolean => {
  // Check if GTIN is 13 or 14 digits and contains only numbers
  const gtinRegex = /^\d{13,14}$/;
  return gtinRegex.test(gtin);
};
