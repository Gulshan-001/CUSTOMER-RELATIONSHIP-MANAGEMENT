import mongoose from "./index.js";

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    status: {
        type: String,
        required: [true, "Status is Required"],
        enum: ['Active', 'InActive'],
        default: 'Active',
    },
    role: {
        type: String,
        default: 'user'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
    },
    add: {
        type: String,
    },
    desc: {
        type: String,
    },

    datecreated: Date,
    dateUpdated: Date

}, {
    collection: 'users',
    versionKey: false,
    timestamps: true
})
const userModel = mongoose.model('users', userSchema)
export default userModel








