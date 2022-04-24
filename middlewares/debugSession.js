module.exports = (req, res, next) => {
    if (req.session.user!==undefined){
        console.log("--------------->"+req.session.user.cartItem.price);
        console.log("--------------->"+req.session.user.cartItem.idQuantity);
    }
    next();
}