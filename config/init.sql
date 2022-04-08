DROP DATABASE IF EXISTS pizzeria;
CREATE DATABASE pizzeria;

DROP TABLE IF EXISTS client cascade;
DROP TABLE IF EXISTS livreur cascade;
DROP TABLE IF EXISTS commande cascade;
DROP TABLE IF EXISTS livraison cascade;
DROP TABLE IF EXISTS contenu_commande cascade;

CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    adr_client TEXT NOT NULL
);

CREATE TABLE livreur (
    id_livr SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    log_in VARCHAR(255) NOT NULL,
    pass_word VARCHAR(255) NOT NULL
);

CREATE TABLE contenu_commande (
    id_contenu SERIAL PRIMARY KEY,
    id_plat INT,
    quantite INT
);

CREATE TABLE commande (
    id_commande SERIAL PRIMARY KEY,
    date_commande DATE NOT NULL,
    client INT REFERENCES client(id_client),
    id_contenu INT REFERENCES contenu_commande(id_contenu),
    prix_commande MONEY NOT NULL         
);

CREATE TABLE livraison (
    id_livraison SERIAL PRIMARY KEY,
    date_livraison DATE NOT NULL,
    id_commande INT REFERENCES commande(id_commande),
    livreur INT REFERENCES livreur(id_livr),
    prix_livraison MONEY DEFAULT 0,
    effectue BOOLEAN DEFAULT FALSE
);