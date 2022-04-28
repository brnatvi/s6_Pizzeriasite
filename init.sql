DROP DATABASE IF EXISTS pizzeria;
CREATE DATABASE pizzeria;

\connect pizzeria

DROP TABLE IF EXISTS security_client cascade;
DROP TABLE IF EXISTS security_livreur cascade;
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
    link_picture TEXT,    
    prix INT
);            

CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    adr_client TEXT NOT NULL,
    mobile VARCHAR(50) NOT NULL
);

CREATE TABLE livreur (
    id_livr SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL    
);

CREATE TYPE eStatusCommande AS ENUM ('undelivered', 'inprogress', 'delivered');

CREATE TABLE commande (
    id_commande SERIAL PRIMARY KEY,
    date_commande TIMESTAMP  NOT NULL,
    id_client INT,   
    status_commande eStatusCommande DEFAULT 'undelivered',  
    sum_total INT,
    FOREIGN KEY (id_client) REFERENCES client (id_client)
);

CREATE TABLE contenu_commande (
    id_commande INT,
    id_plat INT ,
    quantite INT,
    FOREIGN KEY (id_plat) REFERENCES plats (id_plat), 
    FOREIGN KEY (id_commande) REFERENCES commande (id_commande)
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


\COPY plats(id_plat, type_plat, nom, descript, link_picture, prix) FROM 'model/plats.csv' (DELIMITER ',', FORMAT CSV, NULL '', ENCODING 'UTF8');