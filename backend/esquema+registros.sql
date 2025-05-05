CREATE TABLE tbl_categoria (
  cat_id INT AUTO_INCREMENT PRIMARY KEY,
  cat_nombre VARCHAR(125) NOT NULL,
  cat_descripcion VARCHAR(255) NOT NULL
);

INSERT INTO tbl_categoria (cat_nombre, cat_descripcion) VALUES
('Teléfonos inteligentes', 'Dispositivos móviles avanzados con funciones de comunicación, navegación, entretenimiento y acceso a aplicaciones.'),
('Computadoras portátiles', 'Equipos compactos y transportables ideales para trabajar, estudiar o disfrutar de contenido en cualquier lugar.'),
('Accesorios para PC', 'Complementos como teclados, ratones, monitores y más, diseñados para mejorar la experiencia de uso del computador.'),
('Smartwatches', 'Relojes inteligentes que permiten recibir notificaciones, medir la actividad física y sincronizarse con tu smartphone.'),
('Dispositivos inteligentes para el hogar', 'Equipos conectados que automatizan y facilitan tareas domésticas, como luces, cámaras y asistentes de voz.');

CREATE TABLE tbl_producto (
  pro_id VARCHAR(100) PRIMARY KEY,
  pro_title VARCHAR(255) NOT NULL,
  pro_image VARCHAR(500) NOT NULL,
  pro_url VARCHAR(500) NOT NULL,
  pro_star_rating VARCHAR(50) NOT NULL,
  pro_global_ratings VARCHAR(100),
  pro_bought_in_past_month VARCHAR(100),
  pro_price_symbol VARCHAR(10) NOT NULL,
  pro_price VARCHAR(50) NOT NULL,
  pro_is_prime VARCHAR(10),
  pro_is_climate_pledge_friendly VARCHAR(10),
  pro_is_best_seller VARCHAR(10),
  pro_is_sponsored VARCHAR(10),
  pro_is_limited_time_deal VARCHAR(10),
  pro_originalPrice VARCHAR(50),
  pro_sale VARCHAR(50),
  pro_categoria_id INT NOT NULL,
  CONSTRAINT fk_pro_cat FOREIGN KEY (pro_categoria_id) REFERENCES tbl_categoria(cat_id)
);

INSERT INTO tbl_producto (
  pro_id, pro_title, pro_image, pro_url, pro_star_rating,
  pro_global_ratings, pro_bought_in_past_month, pro_price_symbol, pro_price,
  pro_is_prime, pro_is_climate_pledge_friendly, pro_is_best_seller, pro_is_sponsored,
  pro_is_limited_time_deal, pro_originalPrice, pro_sale, pro_categoria_id
) VALUES
-- 1-4: Teléfonos inteligentes
('B0XYZ1234', 'iPhone 15 Pro Max', 'https://example.com/img1.jpg', 'https://example.com/prod1', '4.8', '10,234', '3,100+', '$', '1199.00', 'Yes', 'Yes', 'Yes', NULL, NULL, NULL, NULL, 1),
('B0XYZ5678', 'Samsung Galaxy S24 Ultra', 'https://example.com/img2.jpg', 'https://example.com/prod2', '4.7', '8,912', '2,800+', '$', '1099.99', 'Yes', NULL, 'Yes', NULL, NULL, NULL, NULL, 1),
('B0XYZ9101', 'Google Pixel 8', 'https://example.com/img3.jpg', 'https://example.com/prod3', '4.6', '5,432', '2,100+', '$', '899.00', 'Yes', 'Yes', NULL, NULL, NULL, NULL, NULL, 1),
('B0XYZ1121', 'OnePlus 12', 'https://example.com/img4.jpg', 'https://example.com/prod4', '4.5', '4,321', NULL, '$', '799.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),

-- 5-8: Computadoras portátiles
('B0ABC1235', 'MacBook Pro M3', 'https://example.com/img5.jpg', 'https://example.com/prod5', '4.9', '6,788', '1,500+', '$', '2499.00', 'Yes', 'Yes', NULL, NULL, NULL, NULL, NULL, 2),
('B0ABC5679', 'Dell XPS 13', 'https://example.com/img6.jpg', 'https://example.com/prod6', '4.6', '3,555', '900+', '$', '1399.00', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, 2),
('B0ABC9102', 'HP Spectre x360', 'https://example.com/img7.jpg', 'https://example.com/prod7', '4.4', '2,900', '800+', '$', '1249.99', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2),
('B0ABC1123', 'Lenovo ThinkPad X1', 'https://example.com/img8.jpg', 'https://example.com/prod8', '4.5', '2,110', NULL, '$', '1549.00', NULL, 'Yes', NULL, NULL, NULL, NULL, NULL, 2),

-- 9-12: Accesorios para PC
('B0DEF1236', 'Logitech MX Master 3 Mouse', 'https://example.com/img9.jpg', 'https://example.com/prod9', '4.9', '12,000', '5,000+', '$', '99.99', 'Yes', 'Yes', 'Yes', NULL, NULL, NULL, NULL, 3),
('B0DEF5680', 'Razer BlackWidow Keyboard', 'https://example.com/img10.jpg', 'https://example.com/prod10', '4.7', '7,000', '3,000+', '$', '129.99', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, 3),
('B0DEF9103','Samsung 32" Curved Monitor', 'https://example.com/img11.jpg', 'https://example.com/prod11', '4.6', '4,500', '1,500+', '$', '249.99', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
('B0DEF1124', 'Elgato Stream Deck', 'https://example.com/img12.jpg', 'https://example.com/prod12', '4.8', '3,800', '1,000+', '$', '149.99', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, 3),

-- 13-16: Smartwatches
('B0GHI1237', 'Apple Watch Series 9', 'https://example.com/img13.jpg', 'https://example.com/prod13', '4.8', '9,123', '2,300+', '$', '429.00', 'Yes', 'Yes', 'Yes', NULL, NULL, NULL, NULL, 4),
('B0GHI5677', 'Samsung Galaxy Watch 6', 'https://example.com/img14.jpg', 'https://example.com/prod14', '4.6', '6,222', '1,800+', '$', '349.99', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, 4),
('B0GHI9104', 'Fitbit Versa 4', 'https://example.com/img15.jpg', 'https://example.com/prod15', '4.3', '3,700', NULL, '$', '229.99', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4),
('B0GHI1125', 'Garmin Forerunner 255', 'https://example.com/img16.jpg', 'https://example.com/prod16', '4.5', '2,980', NULL, '$', '299.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4),

-- 17-20: Dispositivos inteligentes para el hogar
('B0JKL1238','Echo Dot (5ta Gen)', 'https://example.com/img17.jpg', 'https://example.com/prod17', '4.7', '23,000', '8,000+', '$', '49.99', 'Yes', 'Yes', 'Yes', NULL, NULL, NULL, NULL, 5),
('B0JKL5676', 'Google Nest Mini', 'https://example.com/img18.jpg', 'https://example.com/prod18', '4.6', '19,000', '6,500+', '$', '49.99', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5),
('B0JKL9105', 'TP-Link Smart Plug', 'https://example.com/img19.jpg', 'https://example.com/prod19', '4.5', '15,200', '5,000+', '$', '24.99', 'Yes', NULL, NULL, NULL, NULL, NULL, NULL, 5),
('B0JKL1126', 'Ring Video Doorbell', 'https://example.com/img20.jpg', 'https://example.com/prod20', '4.6', '8,600', '3,100+', '$', '99.99', 'Yes', 'Yes', NULL, NULL, NULL, NULL, NULL, 5);

SELECT pro_id, COUNT(*) as repeticiones
FROM tbl_producto
GROUP BY pro_id
HAVING COUNT(*) > 1;

select * from tbl_producto;