module.exports = (req, res, next) => {
    console.log("req.session.user")
    console.log(req.session.user)
    console.log(req.session.user.mobile)
    console.log("req.session.user.mobile")
    if (req.session.user===undefined || req.session.user.mobile!==undefined)next();
    else res.writeHead(302, {'Location': '/error'}).end();
};