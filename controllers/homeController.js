
exports.index = function (req, rep) {
    rep.send("index");                          // TODO appel a model
};

exports.carte = function (req, rep) {
    rep.send("main menu page");                    // TODO appel a model
};