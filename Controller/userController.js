const jwt = require("jsonwebtoken");
const ApiError = require("../Error/ApiError");
const User = require("../Model/User");
const bcrypt = require('bcrypt')

const generateJwt = (id, email, role, name, secondName, time)=>{
    return jwt.sign({id, email, role, name, secondName}, process.env.SECRET_KEY, {
        expiresIn: time || '30m'
    })
}

class UserController {
    
    async registration(req, res){
        try{
            const {email, password, name, secondName} = req.body;

            const candidate = await User.findOne({email})
            console.log(req.body);
            if(candidate) {
                return ApiError.conflict("Email уже занят")
            }
            const hashPassword = await bcrypt.hash(password, 5)
            await User.create({
                email,
                name,
                secondName,
                password: hashPassword,
                role: 'USER'
            })
            return res.json({message: "Зарегистрирован", status: true})
        } catch(e){
            return ApiError.internal(e)
        }
    }

    async login(req,res){
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email})
            const compare = bcrypt.compareSync(password, user.password)
            if(!compare){
                return ApiError.unauth('Не верный логин или пароль')
            }

            const access_token = generateJwt(
                user._id,
                user.email,
                user.role,
                user.name,
                user.secondName,
                '30m'
            );
            const refresh_token = generateJwt(
                user._id,
                user.email,
                user.role,
                user.name,
                user.secondName,
                '30d'
            );
            console.log(user);

            res.cookie("refresh_token", refresh_token, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json({ access_token });
        } catch(e){
            return ApiError.internal(e)
        }
    }


    async refresh(req, res) {
        try {
            const decoded = jwt.verify(
                req.headers.cookie.replace("refresh_token=", ""),
                process.env.SECRET_KEY
            );
            const user = await User.findOne({_id: decoded.id})
            const access_token = generateJwt(
                user.id,
                user.email,
                user.role,
                user.name,
                user.secondName,
            );
            return res.json({ access_token });
        } catch (e) {
            return ApiError.badRequest(e.message);
        }
    }
}


module.exports = new UserController()