DROP DATABASE IF EXISTS pizzeria;
CREATE DATABASE pizzeria;

\connect pizzeria

DROP TABLE IF EXISTS pizza_composition cascade;
DROP TABLE IF EXISTS ingredients cascade;
DROP TABLE IF EXISTS security_client cascade;
DROP TABLE IF EXISTS security_livreur cascade;
DROP TABLE IF EXISTS plat_size cascade;
DROP TABLE IF EXISTS contenu_commande cascade;
DROP TABLE IF EXISTS commande cascade;
DROP TABLE IF EXISTS client cascade;
DROP TABLE IF EXISTS livreur cascade; 
DROP TABLE IF EXISTS plats cascade;

SET lc_monetary TO "en_IE.utf8";

CREATE TYPE eTypePlat AS ENUM ('salade', 'boisson', 'dessert', 'pizza');

CREATE TABLE plats (
    id_plat SERIAL PRIMARY KEY,
    type_plat eTypePlat,
    nom VARCHAR(255) NOT NULL UNIQUE,
    descript TEXT,
    link_picture TEXT
);            

CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    adr_client TEXT NOT NULL,
    autre TEXT,
    mobile VARCHAR(50) NOT NULL
);

CREATE TYPE eStatusCommande AS ENUM ('undelivered', 'inprogress', 'delivered');

CREATE TABLE commande (
    id_commande SERIAL PRIMARY KEY,
    date_commande TIMESTAMP  NOT NULL,
    id_client INT,   
    status_commande eStatusCommande DEFAULT 'undelivered',  
    sum_total NUMERIC(4, 2),
    date_livraison TIMESTAMP,
    FOREIGN KEY (id_client) REFERENCES client (id_client)
);

CREATE TABLE livreur (
    id_livr SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    current_commande INT,
    FOREIGN KEY (current_commande) REFERENCES commande (id_commande)
);

CREATE TYPE eSize AS ENUM ('unique', 'small', 'medium', 'large', '33', '50', '100');

CREATE TABLE contenu_commande (
    id_commande INT,
    id_plat INT,
    quantite INT,
    size eSize,
    FOREIGN KEY (id_plat) REFERENCES plats (id_plat), 
    FOREIGN KEY (id_commande) REFERENCES commande (id_commande)
);

CREATE TABLE plat_size (
    id_plat INT,    
    size eSize,
    prix NUMERIC(4, 2),
    PRIMARY KEY (id_plat, size),
    FOREIGN KEY (id_plat) REFERENCES plats (id_plat)
);

CREATE TABLE security_client (
    id_client INT,
    email VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    resetToken VARCHAR(255),
    FOREIGN KEY (id_client) REFERENCES client (id_client)
);

CREATE TABLE security_livreur (
    id_livr INT,
    email VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    resetToken VARCHAR(255),
    FOREIGN KEY (id_livr) REFERENCES livreur (id_livr)
);

CREATE TYPE eTypeInredient AS ENUM ('legumes', 'base', 'fromage', 'sauses');

CREATE TABLE ingredients (
    id_ingred SERIAL PRIMARY KEY,   
    type_ingred eTypeInredient,
    nom VARCHAR(255),
    prix NUMERIC(4, 2)
);

CREATE TABLE pizza_composition (
    id_plat INT,   
    id_ingred INT,    
    FOREIGN KEY (id_plat) REFERENCES plats(id_plat),
    FOREIGN KEY (id_ingred) REFERENCES ingredients(id_ingred)
);


\COPY plats(id_plat, type_plat, nom, descript, link_picture) FROM 'model/csv/plats_UTF8_no_bom.csv' (DELIMITER ',', FORMAT CSV, ENCODING 'UTF8');
\COPY plat_size(id_plat, size, prix) FROM 'model/csv/size_UTF8_no_bom.csv' (DELIMITER ',', FORMAT CSV, ENCODING 'UTF8');
\COPY ingredients(id_ingred, type_ingred, nom, prix) FROM 'model/csv/ingredients_UTF8_no_bom.csv' (DELIMITER ',', FORMAT CSV, ENCODING 'UTF8');
\COPY pizza_composition(id_plat, id_ingred) FROM 'model/csv/pizza_ingredients.csv' (DELIMITER ',', FORMAT CSV);


INSERT INTO client(nom, prenom, adr_client, mobile) VALUES ('Richard', 'Julie', '30 Rue Gay-Lussac, 75005 Paris', 0189565144);
INSERT INTO client(nom, prenom, adr_client, mobile) VALUES ('Dubois', 'Thomas', '64 Rue Réaumur, 75003 Paris', 0189545671);
INSERT INTO security_client(id_client, email, pw) VALUES (2, 'dubois@ddddddd.com', '$2b$10$VkU6d3m5G.g7vG/cNV.9MeFMfgAdzEgNX4sHNcJdUn7hFa6p3dz32');

INSERT INTO livreur(nom, prenom) VALUES ('Martin', 'Louis');
INSERT INTO security_livreur(id_livr, email, pw) VALUES (1, 'martin@ooooooo.com', '$2b$10$DnUeqkJSx9XB38nlRy.VhOLDBbjAL4UGbyWkIxiemYpHELDTddUkO');

INSERT INTO commande(id_client, date_commande, status_commande, sum_total) VALUES (2, '2022-05-22 00:30:30.041429', 'undelivered', 58.08);
INSERT INTO commande(id_client, date_commande, status_commande, sum_total) VALUES (2, CURRENT_TIMESTAMP, 'undelivered', 35.00);

INSERT INTO contenu_commande VALUES (1, 6, 2, 'medium');
INSERT INTO contenu_commande VALUES (1, 10, 1, 'unique');
INSERT INTO contenu_commande VALUES (1, 19, 2, 'unique');
INSERT INTO contenu_commande VALUES (1, 14, 1, 'unique');

INSERT INTO contenu_commande VALUES (2, 3, 2, 'small');
INSERT INTO contenu_commande VALUES (2, 9, 3, 'large');


/*
SELECT id_plat, (sum(prix) + 3) AS price_small, (sum(prix) + 3)*1.2 AS price_medium, (sum(prix) + 3)*1.5 AS price_large FROM pizza_composition NATURAL JOIN ingredients GROUP BY id_plat ORDER BY id_plat;
*/