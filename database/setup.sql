-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Owner information
  owner_name VARCHAR(255) NOT NULL,
  owner_mobile VARCHAR(50) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  
  -- Contact information
  contact_name VARCHAR(255),
  contact_mobile VARCHAR(50),
  contact_email VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_company_id (company_id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for companies
INSERT INTO companies (name, address, telephone, email, owner_name, owner_mobile, owner_email, contact_name, contact_mobile, contact_email) VALUES
('Tech Solutions Inc', '123 Tech Street, San Francisco, CA 94102', '(415) 555-0100', 'info@techsolutions.com', 'John Smith', '(415) 555-0101', 'john.smith@techsolutions.com', 'Jane Doe', '(415) 555-0102', 'jane.doe@techsolutions.com'),
('Green Energy Co', '456 Eco Avenue, Portland, OR 97201', '(503) 555-0200', 'contact@greenenergy.com', 'Mike Johnson', '(503) 555-0201', 'mike.johnson@greenenergy.com', 'Sarah Williams', '(503) 555-0202', 'sarah.williams@greenenergy.com'),
('Creative Designs Ltd', '789 Art Boulevard, New York, NY 10001', '(212) 555-0300', 'hello@creativedesigns.com', 'Emily Brown', '(212) 555-0301', 'emily.brown@creativedesigns.com', NULL, NULL, NULL);

-- Insert sample products
INSERT INTO products (company_id, name, description, price) VALUES
(1, 'Cloud Hosting Service', 'Reliable cloud hosting with 99.9% uptime guarantee', 99.99),
(1, 'Website Development', 'Custom website development services', 2999.00),
(1, 'Mobile App Development', 'iOS and Android app development', 4999.00),
(2, 'Solar Panel Installation', 'Residential solar panel installation and maintenance', 15000.00),
(2, 'Energy Audit Service', 'Comprehensive home energy audit', 299.00),
(3, 'Logo Design', 'Professional logo design service', 499.00),
(3, 'Brand Identity Package', 'Complete brand identity including logo, colors, and guidelines', 1999.00);
