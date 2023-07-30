const express = require('express')
const cors = require('cors')
const {dbConnection} = require('../database/config')
const https = require('https');
const fs = require('fs');
const path = require('path');



class Server {
    constructor(app) {
        this.app = app;        
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categ: '/api/cat',
            productos: '/api/productos',
            buscar: '/api/buscar',
        }        
        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection()
    }
    
    middlewares() {
        // CORS
        const corsOptions = {
            origin: 'www.frontEnd.com', 
            methods: ['GET', 'POST', 'PUT', 'DELETE'], 
            allowedHeaders: ['Content-Type', 'x-token'], 
            credentials: true, 
          };

          this.app.use( cors(corsOptions) )
        
        // Lectura y parseo del body
        this.app.use( express.json() )
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categ, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
    }

    listen() {
        const options = {
            key: fs.readFileSync(path.join(__dirname, '../certs/server.key')),
            cert: fs.readFileSync(path.join(__dirname, '../certs/server.crt'))
          };
        const httpsServer = https.createServer(options, this.app);
        // Puerto seguro HTTPS predeterminado
        
        httpsServer.listen(this.port, () => {
          console.log(`Servidor HTTPS funcionando en el puerto ${this.port}`);
        });


        /*this.app.listen(this.port, () => {
            console.log('Listening in port ', this.port);
        })*/
    }
}

module.exports = Server;