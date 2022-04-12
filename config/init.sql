DROP DATABASE IF EXISTS pizzeria;
CREATE DATABASE pizzeria;

DROP TABLE IF EXISTS security_client cascade;
DROP TABLE IF EXISTS security_livreur cascade;
DROP TABLE IF EXISTS commande cascade;
DROP TABLE IF EXISTS livraison cascade;
DROP TABLE IF EXISTS contenu_commande cascade;
DROP TABLE IF EXISTS client cascade;
DROP TABLE IF EXISTS livreur cascade;

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

CREATE TABLE contenu_commande (
    id_contenu SERIAL PRIMARY KEY,
    id_plat INT,
    quantite INT
);

CREATE TABLE commande (
    id_commande SERIAL PRIMARY KEY,
    date_commande DATE NOT NULL,
    id_client INT,
    id_contenu INT,
    prix_commande MONEY NOT NULL,
    FOREIGN KEY (id_client) REFERENCES client (id_client),      
    FOREIGN KEY (id_contenu) REFERENCES contenu_commande(id_contenu)
);

CREATE TABLE livraison (
    id_livraison SERIAL PRIMARY KEY,
    date_livraison DATE NOT NULL,
    id_commande INT,
    id_livr INT,
    prix_livraison MONEY DEFAULT 0,
    effectue BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_commande) REFERENCES commande(id_commande),
    FOREIGN KEY (id_livr) REFERENCES livreur(id_livr)
);

CREATE TABLE security_client (
    id_client INT,
    email VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    resetToken VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_client) REFERENCES client (id_client)
);

CREATE TABLE security_livreur (
    id_livr INT,
    email VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    resetToken VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_livr) REFERENCES livreur (id_livr)
);