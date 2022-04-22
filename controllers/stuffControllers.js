exports.GetError = (req, res) => {
    res.status(404).render('error',{
        params: {
            title: 'error'
        }
    })
}

//TODO: change location
exports.GetCommande = (req, res) => {
    res.status(404).render('commande',{
        params: {
            title: 'commande',
            isClient: (req.session.user===undefined || req.session.user.mobile!==undefined),
            isLogued: req.session.user!==undefined
        }
    })
}