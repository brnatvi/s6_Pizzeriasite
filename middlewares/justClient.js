/**
 * Vérifie que la session actuelle correspond à celle d'un client ou d'un utilisateur non connecté.
 */
module.exports = (req, res, next) => {
    if (req.session.user!==undefined)console.log(req.session.user.cartItem)
    if (req.session.user===undefined || /*req.session.user.mobile!==undefined ||*/ req.session.user.cartItem!==undefined/*si non co*/)next();
    else res.writeHead(302, {'Location': '/error'}).end();
};