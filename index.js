require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data',(req,res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

const Contact = require('./models/contact')
const { response } = require('express')


// let persons = [
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": 1
//     },
//     {
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523",
//       "id": 2
//     },
//     {
//       "name": "Dan Abramov",
//       "number": "12-43-234345",
//       "id": 3
//     },
//     {
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122",
//       "id": 4
//     }
// ]

app.get('/',(req,res) => {
    res.send("<h1>Hello</h1>")
})

app.get('/api/persons',(req,res) => {
    Contact.find({}).then(contact => {
        res.json(contact)
    })
})

app.get('/api/persons/:id',(req,res,next) => {
    // const id = Number(req.params.id)
    // const person = persons.find(person => person.id === id)
    Contact.findById(req.params.id).then(contact => {
        if(contact) {
            res.json(contact)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/info',(req,res) => {
    const date = new Date().toString()
    Contact.countDocuments({},(err,count) => {
        res.send(`<p>Phonebook has info for ${count} persons</p><p>${date}</p>`)
    })
    
})

app.delete('/api/persons/:id',(req,res,next) => {
    Contact
        .findByIdAndDelete(req.params.id)
            .then(result => {
                res.status(204).end()
            })
            .catch(error => next(error))
})

// let generateId = () => {
//     const id = Math.floor(Math.random() * 50)
//     const idCheck = persons.find(person => person.id === id) 
//     if(idCheck) {
//       generateId()
//     } else {
//       return id
//     }
//   }
app.post('/api/persons',(req,res,next) => {
    const body = req.body
    //console.log(body)
   // const checkName = persons.find(person => person.name === body.name)

    if(!body.contact_name) {
        return res.status(400).json({"error": "name is missing"})
    } else if(!body.contact_number) {
        return res.status(400).json({"error": "number is missing"})
    }
    //  else if(checkName) {
    //     return res.status(400).json({"error": "name already exists"})
    // }

    const contact = new Contact ({
        contact_name:body.contact_name,
        contact_number:body.contact_number,
    })

    contact.save().then(savedContact => {
        res.json(savedContact)
    })
    .catch(error => next(error))


    // persons = persons.concat(person)

    // res.json(person)
})

app.put('/api/persons/:id',(req,res,next) => {
    const body = req.body

    const contact = {
        contact_name : body.contact_name,
        contact_number : body.contact_number
    }

    Contact.findByIdAndUpdate(req.params.id, contact , {new : true, runValidators: true, context: true})
                .then(updatedContact => {
                    res.json(updatedContact)
                })
                .catch(error => next(error))

    
})


const unknownEndpoint = (req,res) => {
    res.status(404).send({
        error: "Unknown Endpoint."
    })
}

app.use(unknownEndpoint)

const errorHandler = (error,req,res,next) => {
    console.log(error)
    if(error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted data'})
    } else if(error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})