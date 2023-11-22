module.exports.reqObject = (req, res) => {
    return {
        decoded: req.decoded,
        query: req.query,
        params: req.params,
        body: req.body,
        flash: req.flash,
        session: {
            cookies: req.session.cookies,
            flash: req.session.flash
        }
        // req
    }
}
