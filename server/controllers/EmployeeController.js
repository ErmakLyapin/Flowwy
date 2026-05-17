const ApiError = require('../error/ApiError')

class CustomerController {
    async reg(req, res) {

    }

    async login(req, res) {
        
    }

    async check(req, res, next) {
        const {id} = req.query
        if(!id){
            return next(ApiError.badRequest('Не задан ID'))
        }
        res.json(id)
    }

    async Put (req, res) {
        
    }

    async Delet (req, res) {
        
    }
}

module.exports = new CustomerController()