module.exports = {

    async search(req, res) {
        
        res.status(200).json({ data: req.query });
    }
}