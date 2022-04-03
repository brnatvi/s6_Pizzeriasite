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
            title: 'commande'
        }
    })
}