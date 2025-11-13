-- Create products table with all required fields
CREATE TABLE IF NOT EXISTS products (
  gtin VARCHAR(14) PRIMARY KEY,
  company_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_french VARCHAR(255) NOT NULL,
  description TEXT,
  description_french TEXT,
  brand_name VARCHAR(255),
  country_of_origin VARCHAR(255),
  gross_weight_kg DECIMAL(10,3),
  net_weight_kg DECIMAL(10,3),
  weight_unit VARCHAR(20) DEFAULT 'kg',
  image_url VARCHAR(255),
  status ENUM('SHOW', 'HIDDEN') DEFAULT 'SHOW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_company_id (company_id),
  INDEX idx_status (status),
  INDEX idx_name (name),
  INDEX idx_brand (brand_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update the trigger to handle product hiding when company is deactivated
DROP TRIGGER IF EXISTS company_deactivate_trigger;
DELIMITER //
CREATE TRIGGER company_deactivate_trigger
    AFTER UPDATE ON companies
    FOR EACH ROW
BEGIN
    IF OLD.status = 'ACTIVE' AND NEW.status = 'DEACTIVE' THEN
        UPDATE products SET status = 'HIDDEN' WHERE company_id = NEW.id;
    ELSEIF OLD.status = 'DEACTIVE' AND NEW.status = 'ACTIVE' THEN
        UPDATE products SET status = 'SHOW' WHERE company_id = NEW.id;
    END IF;
END//
DELIMITER ;

-- Insert sample products
INSERT IGNORE INTO products (gtin, company_id, name, name_french, description, description_french, brand_name, country_of_origin, gross_weight_kg, net_weight_kg, weight_unit) VALUES
('1234567890123', 1, 'Premium Coffee Beans', 'Grains de Café Premium', 'High quality arabica coffee beans from Ethiopia', 'Grains de café arabica de haute qualité d\'Éthiopie', 'CoffeeBrand', 'Ethiopia', 1.200, 1.000, 'kg'),
('1234567890124', 1, 'Organic Green Tea', 'Thé Vert Biologique', 'Organic green tea leaves from Japan', 'Feuilles de thé vert biologique du Japon', 'TeaBrand', 'Japan', 0.150, 0.100, 'kg'),
('2345678901234', 2, 'Solar Panel Kit', 'Kit de Panneau Solaire', '100W solar panel with installation kit', 'Panneau solaire 100W avec kit d\'installation', 'EcoSolar', 'Germany', 15.500, 12.000, 'kg'),
('3456789012345', 3, 'Design Portfolio Book', 'Livre Portfolio Design', 'Professional design portfolio showcase', 'Vitrine de portfolio de design professionnel', 'CreativePress', 'USA', 0.800, 0.750, 'kg');

-- Add GTIN validation function
DELIMITER //
CREATE FUNCTION validate_gtin(gtin_value VARCHAR(14)) 
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE gtin_length INT;
    SET gtin_length = CHAR_LENGTH(gtin_value);
    
    -- Check if GTIN is 13 or 14 digits and contains only numbers
    IF gtin_length IN (13, 14) AND gtin_value REGEXP '^[0-9]+$' THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END//
DELIMITER ;