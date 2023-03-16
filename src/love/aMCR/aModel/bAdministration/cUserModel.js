const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Please enter first name"],
        max_length: [50, "Name cannot exceed 50 characters"],
        min_length: [5, "Name cannot subceed 5 characters"],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, "Please enter last name"],
        max_length: [50, "Name cannot exceed 50 characters"],
        min_length: [5, "Name cannot subceed 5 characters"],
        trim: true
        },
    email: {
        type: String,
        required: [true, "Please enter email"],
        validate: [validator.isEmail, "Please enter valid email"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        max_length: [50, "Name cannot exceed 16 characters"],
        min_length: [5, "Name cannot subceed 8 characters"],
        select: false
    },
    // avatar: {
    //     public_id: {
    //         type: String,
    //         required: true
    //     },
    //     url: {
    //         type: String,
    //         required: true
    //     }
    // },
    reset_password_token: String,
    reset_password_token_expire: Date,
    slug: {
        type: String
    },

    relation_info: {
        role: {
            type: Object,
        },
    },

    personal_info: {
        created_at: {
            type: Date,
            default: Date.now(),
        },    
        created_by: {
            type: Object,
        },    
        updated_at: {
            type: Date,
        },          
        updated_by: {
            type: Object,
        },    
    },

})

// Pre Save
// Encrypt Password Before Saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) next();
    this.password = await bcryptjs.hash(this.password, 10);
})


// Methods
// JWT Token
userSchema.methods.getJWTToken = function() {
    return jsonwebtoken.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE}
    )
}

// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password)
}

// // Generate Password Reset Token
// userSchema.methods.getResetPasswordToken = async function() {
//     // Generate Token
//     const resetToken = crypto.randomBytes(20).toString("hex")

//     // Hash Token
//     this.reset_password_token = crypto.createHash("sha256").update(resetToken).digest("hex")
//     this.reset_password_token_expire = Date.now() + 15*60*1000;

//     return resetToken;
// }


module.exports = mongoose.model("UserModel", userSchema)


