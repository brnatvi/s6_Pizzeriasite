/**
 * Vérifie que la session actuelle correspond à celle d'un livreur.
 */
module.exports = (req, res, next) => {
    if (req.session.user!==undefined && req.session.user.mobile===undefined)next();
    else res.writeHead(302, {'Location': '/error'}).end();
};