const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const arguments = process.argv
if ((arguments.length > 3) && (arguments.length < 5)) {
    console.log(`Need contact name and number node mongo.js <password> <contact_name> <contact_number>`)
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${arguments[2]}@cluster0.ukmjg.mongodb.net/contact-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})

const contactSchema = new mongoose.Schema({
    contact_name: {
        type: String,
        required: true,
        unique: true
    },
    contact_number: {
        type: String,
        required: true,
        unique: true
    }
})

mongoose.plugin(uniqueValidator)

const Contact = mongoose.model('Contact',contactSchema)

const contact = new Contact ({
    contact_name : arguments[3],
    contact_number : arguments[4]
})

if (arguments.length === 3) {
    Contact.find({}).then(result => {
        console.log('PhoneBook:')
        result.forEach(contact => {
            console.log(contact.contact_name+" "+contact.contact_number)
        })
        mongoose.connection.close()
    })
} else {
    contact.save().then(result => {
        console.log(`Added ${arguments[3]} ${arguments[4]} to the phonebook`)
        mongoose.connection.close()
    })
}