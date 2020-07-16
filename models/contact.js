const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('Connecting to ',url)

mongoose
    .connect(url, { useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true })
    .then(() => {
        console.log('Connected to Mongo DB')
    })
    .catch(error => {
        console.log('Couldnt connect to MongoDB ',error.message)
    })

const contactSchema = new mongoose.Schema({
    contact_name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    contact_number: {
        type: String,
        required: true,
        unique: true,
        minlength: 8
    }
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON',{
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})


module.exports = mongoose.model('Contact',contactSchema)


