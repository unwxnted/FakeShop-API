CREATE DATABASE IF NOT EXISTS fakeshop;

USE fakeshop;

CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jwt VARCHAR(255),
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  admin BOOLEAN
);

CREATE TABLE Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  stock INT,
  
);

CREATE TABLE `Order` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATETIME,
  productId INT,
  quantity INT NOT NULL,
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(id),
  CONSTRAINT FK_Product_User FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  FOREIGN KEY (productId) REFERENCES Product(id),
  CONSTRAINT FK_Order_Product FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
);
