import express from 'express'
import UserController from '../controllers/usersControllers.js'
import upload from "../multerconfig/storageConfig.js"
import Auth from "../common/auth.js"
const router = express.Router()

router.post('/signup', UserController.create)
router.post('/login', UserController.login)

router.post("/register", Auth.validate, UserController.registerUser)
router.get("/getdata", UserController.getUserData)
router.get("/getuser/:id", UserController.getIndividualUser)

router.put("/updateuser/:id", UserController.updateUserData)
router.delete("/deleteuser/:id", UserController.deleteUser)

export default router