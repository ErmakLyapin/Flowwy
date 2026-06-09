const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    console.log('=== AuthMiddleware ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    
    if (req.method === "OPTIONS") {
        console.log('OPTIONS request, skipping auth');
        next()
    }
    try {
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);
        
        if (!authHeader) {
            console.log('No authorization header!');
            return res.status(401).json({ message: "Не авторизован" })
        }
        
        const token = authHeader.split(' ')[1];
        console.log('Token extracted:', token ? 'present' : 'missing');
        
        if (!token) {
            console.log('No token after Bearer!');
            return res.status(401).json({ message: "Не авторизован" })
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded token:', decoded);
        req.user = decoded
        next()
    } catch (e) {
        console.error('Auth error:', e.message);
        return res.status(401).json({ message: "Не авторизован" })
    }
}