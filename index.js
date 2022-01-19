const express = require('express');
const app = express();
const cors = require('cors')
const { pool: pool } = require('./db');
const path = require('path')
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

//recommit this project



if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
}
app.get('/', (req, res) => {
    res.json({ message: 'Adam' })
})

//create a todo
app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            'INSERT INTO todo (description) VALUES($1) RETURNING *', [description])
        res.json(newTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }

})
//get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await pool.query('SELECT * FROM todo')
        res.json(todos.rows)
    } catch (error) {
        console.error(error.message)
    }
})
// get a todo
app.get('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id])
        res.json(todo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { description } = req.body;
        const { id } = req.params;
        const updatedTodo = await pool.query(
            'UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *', [description, id])
        res.json(updatedTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            'DELETE FROM todo WHERE todo_id = $1 RETURNING *', [id])
        res.json(`The todo: ${deleteTodo.rows[0]} was deleted.`)
    } catch (error) {
        console.error(error.message)
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})


app.listen(PORT, () => console.log(`listening on port: ${PORT}`))