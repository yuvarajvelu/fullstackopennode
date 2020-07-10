const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('data',(req,res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/',(req,res) => {
    res.send("<h1>Hello</h1>")
})

app.get('/api/persons',(req,res) => {
    res.json(persons)
})

app.get('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info',(req,res) => {
    const date = new Date().toString()
    res.send(`<p>Phonebook has info for ${persons.length} persons</p><p>${date}</p>`)
})

app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

let generateId = () => {
    const id = Math.floor(Math.random() * 50)
    const idCheck = persons.find(person => person.id === id) 
    if(idCheck) {
      generateId()
    } else {
      return id
    }
  }
app.post('/api/persons',(req,res) => {
    const body = req.body
    console.log(body)
    const checkName = persons.find(person => person.name === body.name)

    if(!body.name) {
        return res.status(400).json({"error": "name is missing"})
    } else if(!body.number) {
        return res.status(400).json({"error": "number is missing"})
    } else if(checkName) {
        return res.status(400).json({"error": "name already exists"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const unknownEndpoint = (req,res) => {
    res.status(404).send({
        error: "Unknown Endpoint."
    })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})