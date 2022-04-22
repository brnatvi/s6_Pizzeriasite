module.exports = (req, res, next) => {
    if (req.session.user!==undefined && req.session.user.mobile===undefined)next();
    else res.writeHead(302, {'Location': '/error'}).end();
};