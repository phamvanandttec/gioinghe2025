-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2025 at 10:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `Id` int(11) NOT NULL,
  `Company Name` text NOT NULL,
  `Company Address` text NOT NULL,
  `Company Telephone Number` text NOT NULL,
  `Company Email Address` text NOT NULL,
  `Owner Name` text NOT NULL,
  `Owner Mobile Number` text NOT NULL,
  `Owner Email Address` text NOT NULL,
  `Contact Name` text NOT NULL,
  `Contact Mobile Number` text NOT NULL,
  `Contact Email Address` text NOT NULL,
  `Status` enum('ACTIVE','DEACTIVE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`Id`, `Company Name`, `Company Address`, `Company Telephone Number`, `Company Email Address`, `Owner Name`, `Owner Mobile Number`, `Owner Email Address`, `Contact Name`, `Contact Mobile Number`, `Contact Email Address`, `Status`) VALUES
(2, 'Solutions Vertes SAS 222', '456 Parc Éco 69002 Lyon', '+33 4 56 78 90 12', 'contact@solutionsvertes.fr', 'Sarah Lefevre', '+33 6 23 45 67 89', 'sarah.lefevre@solutionsvertes.fr', 'Tom Dubois', '+33 6 87 65 43 21', 'tom.dubois@solutionsvertes.fr', 'DEACTIVE'),
(3, 'Designs Urbains SARL', '789 Avenue Métropolitaine 13001 Marseille', '+33 4 12 34 56 78', 'support@designsurbains.fr', 'Michael Petit', '+33 6 34 56 78 90', 'michael.petit@designsurbains.fr', 'Emily Moreau', '+33 6 54 32 10 98', 'emily.moreau@designsurbains.fr', 'DEACTIVE'),
(4, 'Cuisine Innovante SARL', '22 Rue de la Cuisine 75005 Paris', '+33 1 40 20 30 40', 'info@cuisineinnovante.fr', 'Jean Martin', '+33 6 11 22 33 44', 'jean.martin@cuisineinnovante.fr', 'Chloe Dubois', '+33 6 55 44 33 22', 'chloe.dubois@cuisineinnovante.fr', 'ACTIVE'),
(5, 'Énergies Renouvelables SAS', '15 Chemin Vert 31000 Toulouse', '+33 5 61 23 45 67', 'contact@energiesrenouvelables.fr', 'Louise Garnier', '+33 6 77 88 99 00', 'louise.garnier@energiesrenouvelables.fr', 'Paul Leroy', '+33 6 66 77 88 99', 'paul.leroy@energiesrenouvelables.fr', 'ACTIVE'),
(6, 'Technologie Avancée SARL', '9 Rue de la Science 59800 Lille', '+33 3 20 15 25 35', 'support@technologieavancee.fr', 'Luc Bernard', '+33 6 33 44 55 66', 'luc.bernard@technologieavancee.fr', 'Isabelle Thomas', '+33 6 44 55 66 77', 'isabelle.thomas@technologieavancee.fr', 'ACTIVE');

--
-- Triggers `company`
--
DELIMITER $$
CREATE TRIGGER `company_deactivate_trigger` AFTER UPDATE ON `company` FOR EACH ROW BEGIN
    IF OLD.status = 'ACTIVE' AND NEW.status = 'DEACTIVE' THEN
        UPDATE product SET status = 'HIDDEN' WHERE `Company Id` = NEW.id;
    ELSEIF OLD.status = 'DEACTIVE' AND NEW.status = 'ACTIVE' THEN
        UPDATE product SET status = 'SHOW' WHERE `Company Id` = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `GTIN` varchar(15) NOT NULL,
  `Company Id` int(11) DEFAULT NULL,
  `Name` text NOT NULL,
  `Description` text NOT NULL,
  `Description in French` text NOT NULL,
  `Name in French` text NOT NULL,
  `Brand Name` text NOT NULL,
  `Country of Origin` text NOT NULL,
  `Gross Weight (with packaging)` float NOT NULL,
  `Net Content Weight` float NOT NULL,
  `Weight Unit` text NOT NULL,
  `Status` enum('SHOW','HIDDEN') NOT NULL,
  `Image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`GTIN`, `Company Id`, `Name`, `Description`, `Description in French`, `Name in French`, `Brand Name`, `Country of Origin`, `Gross Weight (with packaging)`, `Net Content Weight`, `Weight Unit`, `Status`, `Image`) VALUES
('37900123458228', 2, 'French Herb and Lemon Infused Olive Oil', 'Add a touch of freshness to your dishes with our French herb and lemon infused olive oil, featuring a blend of fragrant herbs and citrus.', 'Ajoutez une touche de fraîcheur à vos plats avec notre huile d\'olive infusée aux herbes françaises et au citron, composée d\'un mélange d\'herbes parfumées et d\'agrumes.', 'Huile d\'olive infusée aux herbes et au citron français', 'Huiles de France', 'France', 0.5, 0.4, 'g', 'SHOW', '/images/7.jpg'),
('37900123458345', 2, 'Artisanal French Quiche Lorraine Tartlets', 'Indulge in the rich flavors of France with our artisanal quiche Lorraine tartlets, featuring a blend of creamy eggs and cheese.', 'Laissez-vous tenter par les riches saveurs de la France avec nos tartelettes artisanales à la quiche lorraine, composées d\'un mélange d\'œufs crémeux et de fromage.', 'Tartelettes de quiche lorraine artisanale française', 'Pâtisseries Artisanales', 'France', 1.2, 0.8, 'g', '', '/images/1.jpg'),
('37900123458462', 4, 'French Lavender and Honey Body Scrub', 'Exfoliate your skin with our French lavender and honey body scrub, featuring a soothing blend of fragrant herbs and citrus.', 'Exfoliez votre peau avec notre gommage corporel à la lavande française et au miel, composé d\'un mélange apaisant d\'herbes parfumées et d\'agrumes.', 'Exfoliant corporel à la lavande et au miel français', 'Soins Corporels de France', 'France', 0.6, 0.5, 'g', 'SHOW', '/images/6.jpg'),
('37900123458579', 4, 'French Apple and Cinnamon Crumble Mix', 'Warm up with our French apple and cinnamon crumble mix, featuring a blend of fresh spices perfect for a comforting dessert.', 'Réchauffez-vous avec notre mélange de crumble aux pommes et à la cannelle française, composé d\'un mélange d\'épices fraîches, parfait pour un dessert réconfortant.', 'Mélange de crumble aux pommes et au cannelle français', 'Dessertès de France', 'France', 0.8, 0.6, 'g', 'SHOW', '/images/5.jpg'),
('37900123458696', 3, 'Artisanal French Creamy Garlic Dip 223344', 'Savor the rich flavors of France with our artisanal creamy garlic dip, featuring a blend of fresh herbs and spices.', 'Savourez les riches saveurs de la France avec notre trempette crémeuse à l\'ail artisanale, composée d\'un mélange d\'herbes fraîches et d\'épices.', 'Mélange de dip aux aromes et à la crème française', 'Fromages Artisanales ', 'France', 0, 0, 'kg', 'SHOW', '/uploads/1763015593630_Screenshot_2025-11-03_103321.png'),
('37900123458713', 3, 'French Berry Jam', 'Enjoy the sweetness of France with our French berry jam, featuring a blend of juicy fruits.', 'Appréciez la douceur de la France avec notre confiture de baies françaises, composée d\'un mélange de fruits juteux.', 'Confiture de fruits rouges français', 'Jams de France', 'France', 0.7, 0.55, 'g', 'SHOW', '/images/2.jpg'),
('37900123458830', 3, 'Artisanal French Feta Cheese', 'Savor the rich flavors of Greece in France with our artisanal feta cheese, featuring a blend of creamy milk and herbs.', 'Savourez les riches saveurs de la Grèce en France avec notre fromage feta artisanal, composé d\'un mélange de lait crémeux et d\'herbes.', 'Fromage feta artisanale français', 'Fromages Artisanales', 'France', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900123458947', 3, 'French Herb and Garlic Sausages', 'Indulge in the rich flavors of France with our French herb and garlic sausages, featuring a blend of fragrant herbs and spices.', 'Laissez-vous tenter par les riches saveurs de la France avec nos saucisses françaises aux herbes et à l\'ail, composées d\'un mélange d\'herbes parfumées et d\'épices.', 'Saucisses aux herbes et à l\'ail français', 'Charcuterie de France', 'France', 1.2, 0.9, 'g', 'SHOW', '/images/2.jpg'),
('37900123459064', 3, 'French Apple Tart', 'Enjoy the sweetness of France with our French apple tart, featuring a blend of juicy fruits and creamy pastry.', 'Savourez la douceur de la France avec notre tarte aux pommes française, composée d\'un mélange de fruits juteux et de pâtisserie crémeuse.', 'Tarte tatin aux pommes française', 'Pâtisseries Artisanales', 'France', 1, 0.85, 'g', 'SHOW', '/images/8.jpg'),
('37900123459171', 3, 'Artisanal French Cream Cheese', 'Savor the rich flavors of France with our artisanal cream cheese, featuring a blend of creamy milk and herbs.', 'Savourez les riches saveurs de la France avec notre fromage à la crème artisanal, composé d\'un mélange de lait crémeux et d\'herbes.', 'Fromage à la crème artisanale français', 'Fromages Artisanales', 'France', 0.6, 0.5, 'g', 'HIDDEN', '/images/1.jpg'),
('37900123459288', 3, 'French Herb and Lemon Marmalade', 'Enjoy the sweetness of France with our French herb and lemon marmalade, featuring a blend of fragrant herbs and citrus.', 'Savourez la douceur de la France avec notre marmelade d\'herbes et de citron française, composée d\'un mélange d\'herbes parfumées et d\'agrumes.', 'Marmelade aux herbes et au citron français', 'Jams de France', 'France', 0.7, 0.55, 'g', 'SHOW', '/images/1.jpg'),
('37900123459395', 3, 'Artisanal French Goat Cheese', 'Savor the rich flavors of France with our artisanal goat cheese, featuring a blend of creamy milk and herbs.', 'Savourez les riches saveurs de la France avec notre fromage de chèvre artisanal, composé d\'un mélange de lait crémeux et d\'herbes.', 'Fromage chèvre artisanale français', 'Fromages Artisanales', 'France', 0, 0, 'kg', 'SHOW', '/images/1.jpg'),
('37900123459412', 3, 'French Apple Cider', 'Enjoy the sweetness of France with our French apple cider, featuring a blend of juicy fruits and spices.', 'Savourez la douceur de la France avec notre cidre de pomme français, composé d\'un mélange de fruits juteux et d\'épices.', 'Cidre aux pommes français', 'Bieres de France', 'France', 0.8, 0.6, 'g', 'SHOW', '/images/1.jpg'),
('37900123459529', 3, 'Artisanal French Creamy Cheese Dip', 'Savor the rich flavors of France with our artisanal creamy cheese dip, featuring a blend of fresh herbs and spices.', 'Savourez les riches saveurs de la France avec notre trempette au fromage crémeuse artisanale, composée d\'un mélange d\'herbes fraîches et d\'épices.', 'Mélange de dip à la crème française', 'Fromages Artisanales', 'France', 0.6, 0.5, 'g', 'HIDDEN', '/images/1.jpg'),
('37900123459646', 3, 'French Herb and Garlic Sauce', 'Enjoy the richness of France with our French herb and garlic sauce, featuring a blend of fragrant herbs and spices.', 'Savourez la richesse de la France avec notre sauce aux herbes et à l\'ail française, composée d\'un mélange d\'herbes parfumées et d\'épices.', 'Sauce aux herbes et à l\'ail française', 'Charcuterie de France', 'France', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900123459763', 3, 'Artisanal French Cream Cheese Spread', 'Savor the rich flavors of France with our artisanal cream cheese spread, featuring a blend of creamy milk and herbs.', 'Savourez les riches saveurs de la France avec notre tartinade de fromage à la crème artisanale, composée d\'un mélange de lait crémeux et d\'herbes.', 'Fromage à la crème artisanale française pour tartiner', 'Fromages Artisanales', 'France', 0.6, 0.5, 'g', 'HIDDEN', '/images/1.jpg'),
('37900123459870', 3, 'French Apple Compote', 'Enjoy the sweetness of France with our French apple compote, featuring a blend of juicy fruits and spices.', 'Savourez la douceur de la France avec notre compote de pommes française, composée d\'un mélange de fruits juteux et d\'épices.', 'Compote de pommes française', 'Dessertès de France', 'France', 0.7, 0.55, 'g', 'SHOW', '/images/1.jpg'),
('37900234567890', 3, 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated and reduce plastic waste with our eco-friendly reusable water bottle, featuring a BPA-free design.', 'Restez hydraté et réduisez les déchets plastiques avec notre bouteille d\'eau réutilisable respectueuse de l\'environnement, dotée d\'une conception sans BPA.', 'Bouteille d\'eau réutilisable et écologique', 'HydroFlow', 'USA', 0.3, 0.2, 'g', 'SHOW', '/images/1.jpg'),
('37900234567907', 3, 'Artisanal Handmade Soap Set', 'Nourish your skin with our artisanal handmade soap set, featuring a blend of natural ingredients and essential oils.', 'Nourrissez votre peau avec notre ensemble de savons artisanaux faits à la main, contenant un mélange d\'ingrédients naturels et d\'huiles essentielles.', 'Ensemble de savons artisanaux faits à la main', 'Purezza', 'Italy', 0.6, 0.5, 'g', 'SHOW', '/images/1.jpg'),
('37900234568024', 3, 'French Luxury Candles Set', 'Illuminate your space with our French luxury candles set, featuring a collection of scented candles in elegant packaging.', 'Illuminez votre espace avec notre coffret de bougies de luxe françaises, comprenant une collection de bougies parfumées dans un emballage élégant.', 'Ensemble de bougies de luxe françaises', 'Cierges de France', 'France', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900234568141', 3, 'Eco-Friendly Bamboo Toothbrush Set', 'Brush your teeth and reduce waste with our eco-friendly bamboo toothbrush set, featuring a set of biodegradable toothbrushes and replaceable heads.', 'Brossez-vous les dents et réduisez les déchets avec notre ensemble de brosses à dents en bambou respectueux de l\'environnement, comprenant un ensemble de brosses à dents biodégradables et des têtes remplaçables.', 'Ensemble de brosses à dents en bambou écologiques', 'Teeth & Smile', 'Indonesia', 0.2, 0.1, 'g', 'SHOW', '/images/1.jpg'),
('37900234568258', 3, 'Artisanal Handmade Jewelry Box', 'Store your treasured jewelry in style with our artisanal handmade jewelry box, featuring a beautifully crafted wooden design.', 'Rangez vos précieux bijoux avec style grâce à notre boîte à bijoux artisanale faite à la main, dotée d\'un design en bois magnifiquement conçu.', 'Coffret à bijoux artisanal fait à la main', 'JewelBox', 'Mexico', 0.5, 0.4, 'g', 'SHOW', '/images/1.jpg'),
('37900234568375', 3, 'Luxury Essential Oil Diffuser', 'Pamper yourself with the scent of luxury essential oils using our luxury essential oil diffuser, featuring a stylish and modern design.', 'Faites-vous plaisir avec le parfum des huiles essentielles de luxe en utilisant notre diffuseur d\'huiles essentielles de luxe, doté d\'un design élégant et moderne.', 'Diffuseur d\'huiles essentielles de luxe', 'Aromaflo', 'Australia', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900234568492', 3, 'Eco-Friendly Reusable Shopping Bag Set', 'Reduce plastic waste and go green with our eco-friendly reusable shopping bag set, featuring a set of durable cotton bags and recycled material handles.', 'Réduisez les déchets plastiques et passez au vert avec notre ensemble de sacs de courses réutilisables respectueux de l\'environnement, comprenant un ensemble de sacs en coton durables et des poignées en matériaux recyclés.', 'Ensemble de sacs de courses réutilisables et écologiques', 'GreenEarth', 'UK', 0.5, 0.4, 'g', 'SHOW', '/images/1.jpg'),
('37900234568509', 3, 'Artisanal Handmade Home Fragrance Spray', 'Freshen up your home with our artisanal handmade home fragrance spray, featuring a blend of natural ingredients and essential oils.', 'Rafraîchissez votre maison avec notre spray parfumé d\'intérieur artisanal fait à la main, contenant un mélange d\'ingrédients naturels et d\'huiles essentielles.', 'Spray de parfum d\'ambiance artisanal fait à la main', 'Purezza', 'Italy', 0.2, 0.1, 'g', 'SHOW', '/images/1.jpg'),
('37900234568626', 3, 'French Luxury Aromatherapy Set', 'Pamper yourself with the scent of luxury aromatherapy using our French luxury aromatherapy set, featuring a collection of scented candles and essential oils.', 'Faites-vous plaisir avec le parfum de l\'aromathérapie de luxe grâce à notre coffret d\'aromathérapie de luxe français, comprenant une collection de bougies parfumées et d\'huiles essentielles.', 'Ensemble d\'aromathérapie de luxe français', 'Cierges de France', 'France', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900234568733', 3, 'Eco-Friendly Reusable Lunch Box Set', 'Pack your lunch in style and reduce waste with our eco-friendly reusable lunch box set, featuring a set of durable cotton bags and recycled material handles.', 'Emballez votre déjeuner avec style et réduisez les déchets grâce à notre coffret à lunch réutilisable respectueux de l\'environnement, comprenant un ensemble de sacs en coton durables et des poignées en matériaux recyclés.', 'Ensemble de boîtes à lunch réutilisables et écologiques', 'GreenEarth', 'UK', 0.5, 0.4, 'g', 'SHOW', '/images/1.jpg'),
('37900234568850', 3, 'Artisanal Handmade Stationery Set', 'Stay organized and creative with our artisanal handmade stationery set, featuring a collection of handmade notebooks, pens, and pencils.', 'Restez organisé et créatif avec notre ensemble de papeterie artisanale faite à la main, comprenant une collection de cahiers, de stylos et de crayons faits à la main.', 'Ensemble de papeterie artisanale faite à la main', 'PaperCraft', 'USA', 0.3, 0.2, 'g', 'SHOW', '/images/1.jpg'),
('37900234568967', 3, 'Luxury Wall Art Print Set', 'Add some style to your walls with our luxury wall art print set, featuring a collection of high-quality prints from around the world.', 'Ajoutez du style à vos murs avec notre ensemble d\'impressions murales de luxe, comprenant une collection d\'impressions de haute qualité du monde entier.', 'Ensemble d\'impressions murales de luxe', 'ArtScene', 'Canada', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900234569084', 3, 'Eco-Friendly Reusable Phone Case Set', 'Protect your phone and reduce waste with our eco-friendly reusable phone case set, featuring a set of durable cotton cases and recycled material inserts.', 'Protégez votre téléphone et réduisez les déchets avec notre ensemble de coques de téléphone réutilisables respectueuses de l\'environnement, comprenant un ensemble de coques en coton durables et d\'inserts en matériaux recyclés.', 'Ensemble de coques de téléphone réutilisables et écologiques', 'GreenEarth', 'UK', 0.5, 0.4, 'g', 'SHOW', '/images/1.jpg'),
('37900234569101', 3, 'Artisanal Handmade Bookmarks Set', 'Mark your favorite pages in style with our artisanal handmade bookmarks set, featuring a collection of handmade bookmarks and book lights.', 'Marquez vos pages préférées avec style avec notre ensemble de marque-pages artisanaux faits à la main, comprenant une collection de marque-pages et de lampes de lecture faits à la main.', 'Ensemble de marque-pages artisanaux faits à la main', 'PageTurner', 'Mexico', 0.2, 0.1, 'g', 'SHOW', '/images/1.jpg'),
('37900234569218', 3, 'French Luxury Desk Accessory Set', 'Elevate your workspace with our French luxury desk accessory set, featuring a collection of scented candles, essential oils, and handmade stationery.', 'Améliorez votre espace de travail avec notre ensemble d\'accessoires de bureau de luxe français, comprenant une collection de bougies parfumées, d\'huiles essentielles et de papeterie faite à la main.', 'Ensemble d\'accessoires de bureau de luxe français', 'Cierges de France', 'France', 1, 0.85, 'g', 'SHOW', '/images/1.jpg'),
('37900234569335', 3, 'Eco-Friendly Reusable Travel Bag Set', 'Travel in style and reduce waste with our eco-friendly reusable travel bag set, featuring a set of durable cotton bags and recycled material handles.', 'Voyagez avec style et réduisez les déchets avec notre ensemble de sacs de voyage réutilisables respectueux de l\'environnement, comprenant un ensemble de sacs en coton durables et de poignées en matériaux recyclés.', 'Ensemble de sacs de voyage réutilisables et écologiques', 'GreenEarth', 'UK', 0.5, 0.4, 'g', 'SHOW', '/images/1.jpg'),
('37900234569452', 3, 'Artisanal Handmade Wall Hanging Set', 'Add some handmade charm to your walls with our artisanal handmade wall hanging set, featuring a collection of hand-painted ceramics and natural fibers.', 'Ajoutez un peu de charme artisanal à vos murs avec notre ensemble de tentures murales artisanales faites à la main, comprenant une collection de céramiques peintes à la main et de fibres naturelles.', 'Ensemble de tentures murales artisanales faites à la main', 'WallDecor', 'Italy', 1, 0.85, 'g', 'SHOW', '/images/1.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`GTIN`),
  ADD KEY `PK_Company_Id` (`Company Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `PK_Company_Id` FOREIGN KEY (`Company Id`) REFERENCES `company` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
