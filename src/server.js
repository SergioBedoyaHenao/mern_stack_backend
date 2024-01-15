const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Prueba API",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:8080/"
            }
        ]
    },
    apis: ['./server.js'],
}

const swaggerSpec = swaggerJsDoc(options)
app.use('/app-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "",
    database:"crud"
});

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Añadir un cliente
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 */
app.post("/create",(req,res)=>{
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;

    db.query('INSERT INTO clientes(nombre,apellido,correo) VALUES(?,?,?)',[nombre,apellido,correo],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    }
    );
});

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Ver la lista de clientes
 *     responses:
 *       '200':
 *         description: Successful operation
 */
app.get("/clientes",(req,res)=>{
    db.query('SELECT * FROM clientes',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    }
    );
});

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Actualizar datos de un cliente
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 */
app.put("/update",(req,res)=>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;

    db.query('UPDATE clientes SET nombre=?,apellido=?,correo=? WHERE id=?',[nombre,apellido,correo,id],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    }
    );
});

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Eliminar un cliente por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 */
app.delete("/delete/:id",(req,res)=>{
    const id = req.params.id;

    db.query('DELETE FROM clientes WHERE id=?',id,
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    }
    );
});

app.listen(8080,()=>{
    console.log("Port 8080")
})