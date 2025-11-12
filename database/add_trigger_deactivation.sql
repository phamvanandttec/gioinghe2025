
-- Create a trigger to hide products when company is deactivated
DROP TRIGGER IF EXISTS company_deactivate_trigger;
DELIMITER //
BEGIN
    IF OLD.status = 'ACTIVE' AND NEW.status = 'DEACTIVE' THEN
        UPDATE product SET status = 'HIDDEN' WHERE `Company Id` = NEW.id;
    ELSEIF OLD.status = 'DEACTIVE' AND NEW.status = 'ACTIVE' THEN
        UPDATE product SET status = 'SHOW' WHERE `Company Id` = NEW.id;
    END IF;
END//
DELIMITER ;
