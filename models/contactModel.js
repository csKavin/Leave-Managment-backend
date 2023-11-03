const mongoose = require("mongoose")

const contactSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        start_date: {
            type: String,
            required: [true, "please add the start date"],
        },
        end_date: {
            type: String,
            required: [true, "please add the end date"],
        },
        leave_type: {
            type: String,
            required: [true, "please add the leave date"],
        },
        description: {
            type: String,
            required: [true, "please add the description date"],
        },
        status: {
            type: String,
            required: [true, "please add the status"],
        },
        user_name: {
            type: String,
            required: [true, "please add the user name"],
        },
        email: {
            type: String,
            required: [true, "please add the email"],
        },
        daysDifference:{
            type:String,
            required: [true, "please add the diffrence"],
        }
       
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("contact", contactSchema)