const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.session.user.tokenAuth.split(' ')[1];
        const decodedToken = jwt.verify(token, "VERYSECRETTOKENSESSION");
        const userEmail = decodedToken.email;
        if (req.body.email && req.body.email !== userEmail) {
            res.writeHead(302, {'Location': '/error'});
            res.end();
        } else next();
    } catch {
        res.writeHead(302, {'Location': '/error'});
        res.end();
    }
};