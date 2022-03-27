
exports.index = function (req, rep) {    
    rep.render('../views/index');
};

exports.showCarte = function (req, rep) {
    rep.send("HOME: main menu page");
};
