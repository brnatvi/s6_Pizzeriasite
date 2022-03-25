exports.GetError = (req, res) => {
    res.status(404).render('error',{
        params: {
            title: 'error'
        }
    })
}