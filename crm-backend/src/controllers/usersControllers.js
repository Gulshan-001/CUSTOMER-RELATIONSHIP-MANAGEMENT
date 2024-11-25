import users from "../models/user.js";
import Auth from '../common/auth.js'
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const create = async (req, res) => {
    try {
        let user = await users.findOne({ email: req.body.email })
        if (!user) {
            req.body.password = await Auth.hashPassword(req.body.password)
            req.body.role = "admin"
            await users.create(req.body)
            res.status(201).send({
                message: "user Create Sucessfully"
            })
        }
        else {
            res.status(400).send({
                message: `User with ${req.body.email} already extist`
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server error",
            error: error.message
        })

    }
}

const login = async (req, res) => {
    try {
        let user = await users.findOne({ email: req.body.email })
        if (user) {
            let hashCompare = await Auth.hashCompare(req.body.password, user.password)

            if (hashCompare) {
                let token = await Auth.createToken({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status
                })

                let userData = await users.findOne({ email: req.body.email }, { _id: 0, password: 0, createdAt: 0, email: 0 })
                res.status(200).send({
                    message: "login Successfull",
                    token,
                    userData
                })

            }
            else {
                res.status(400).send({
                    message: `Invaild Passsword`
                })
            }
        }
        else {
            res.status(400).send({
                message: `Account with ${req.body.email} does not exists!`
            })
        }


    } catch (error) {
        res.status(500).send({
            message: `Internal Server Error `,
            error: error.message
        })

    }

}



const registerUser = async (req, res) => {
    const { name, email, status, mobile, add, desc, password } = req.body;

    try {
        if (!name || !email || !password || !mobile || !add || !desc || !status) {
            return res.status(400).json({ message: "Please fill in all the required fields." });
        }

        const hashedPassword = await Auth.hashPassword(password);
        const prenumber = await users.findOne({ mobile: mobile });
        const preUser = await users.findOne({ email: email });

        if (preUser) {

            return res.status(400).send({ message: ` ${req.body.email}  is already present.` });
        }
        if (prenumber) {
            return res.status(400).send({ message: ` ${req.body.mobile} is already present.` });
        }
        const newUser = new users({
            name, email, status, mobile, add, desc, password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User Created Successfully", newUser });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Internal Server Error");
    }
};

const getUserData = async (req, res) => {
    try {
        const userData = await users.find();
        const totalUsers = await users.countDocuments({ role: 'user' });
        const activeUsers = await users.countDocuments({ status: 'Active' });
        const inactiveUsers = await users.countDocuments({ status: 'InActive' });

        res.status(200).json({ userData, totalUsers, activeUsers, inactiveUsers });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Internal Server Error");

    }
};
const getIndividualUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userIndividual = await users.findById(id);

        if (!userIndividual) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(userIndividual);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Internal Server Error");
    }
};


const updateUserData = async (req, res) => {
    try {
        const { id } = req.params;

        req.body.password = await Auth.hashPassword(req.body.password)
        const updateduser = await users.findByIdAndUpdate(id, req.body, {
            new: true
        });

        res.status(201).json(updateduser);

    } catch (error) {
        res.status(400).json(error);
    }
}



const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await users.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(deletedUser);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Internal Server Error");
    }
};







export default {
    login,
    create,
    registerUser,
    getUserData,
    getIndividualUser,
    updateUserData,
    deleteUser,
};


