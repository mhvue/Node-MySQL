CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT;
    product_name VARCHAR(50) NULL,
    department_name VARCHAR(50) NULL,
    price DEC(10,2) NULL,
    stock_quatity INT NULL,
    PRIMARY KEY(item_id)
);

ALTER TABLE products CHANGE stock_quatity stock_quantity INT NULL; --fixed spelling of quantity from original table

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("Gental face wash-unbranded", "personal care", 7.99, 15);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("Dove body wash -No fragrance", "personal care", 5.59, 25);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("unbranded black eyeliner", "beauty", 6.89, 10);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("BSB t-shirt", "clothing", 35.99, 5);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("PINK  fuzzy winter hat", "clothing", 10.99, 10);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("PINK fuzzy winter gloves", "clothing", 10.99, 10);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("unicorn slippers", "shoe", 13.99, 20);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("On Wisconsin blanket 60x72", "home", 8.99, 15);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("cooling eye drops", "personal care", 1.99, 25);

INSERT INTO products(product_name, department_name, price, stock_quatity)
VALUE ("8oz hand lotion-cotton candy scent", "personal care", 3.99, 15);

SELECT * FROM products;