
Avant lancement du site.
Initialisation de la base de données :
1. Dans fichier /model/bd.js changer les champs user et password à vos données de connexion en Postgres
2. A partir de root du projet (dossier « pizzeria ») lancer psql dans terminal linux
3. Effectuer \i init.sql
==> Normalement vous êtes connecté à notre BD « pizzeria » qui vient d'être créé

Les routes principals:
     /            home page
     /livraison   espace livreur
     /shop        la carte de la pizzerie

Vous pouvez tester notre site comme:
- client non enregistré
- client enregistré
       login:   dubois@ddddddd.com   mot de pass:  123456789
- livreur enregistré
       login:   martin@ooooooo.com   mot de pass:  123456789
