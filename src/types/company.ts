export interface Company {
  Id: number;
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
  
  status: string;
}

export interface Product {
  id: string;
  company_id?: number;
  name: string;
  description: string;
  name_french: string;
  description_french: string;
  brand_name: string;
  country_of_origin: string;
  gross_weight_kg: number;
  net_weight_kg: number;
  weight_unit: string;
  status: string;
}
