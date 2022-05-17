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
    mobile VARCHAR(50) NOT NULL
);

CREATE TYPE eStatusCommande AS ENUM ('undelivered', 'inprogress', 'delivered');

CREATE TABLE commande (
    id_commande SERIAL PRIMARY KEY,
    date_commande TIMESTAMP  NOT NULL,
    id_client INT,   
    status_commande eStatusCommande DEFAULT 'undelivered',  
    sum_total NUMERIC(4, 2),
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
