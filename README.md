# Revel
Proyecto para prueba técnina en Revel. 
El proyecto proporciona una API que realiza CRUD de usuarios, categorías y productos.
Un usuario se registra en la base de datos mediante nombre, correo electrónico, password y rol.
Existen dos tipos de roles (ADMIN_ROLE y USER_ROLE)
Los usuarios de tipo ADMIN_ROLE pueden realizar todo tipo de operaciones CRUD con usuarios, categorías y productos.
Los usuario de tipo USER_ROLE solo pueden hacer operaciones CRUD con recursos que son creados por ellos mismos.
Para el almacenamiento de datos se ha usado MongoDB

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)


## Instalación

Asegúrate de tener Node.js y npm instalados en tu sistema.

1. Clona este repositorio en el enlace: https://github.com/cbarroca87/Revel.git

2. Instala las dependencias ejecutando el siguiente comando en la terminal:
npm install

## Uso
Para usar la aplicación situarse en la carpeta del proyecto descargado y ejecutar: npm run start.
Primero se deben crear usuarios. Una vez creados los usuarios, se realizará un login y se obtendrá un token para hacer uso de las operaciones CRUD sobre categorías y productos.
Las categorías y productos son creados por usuarios logueados. Un producto forma parte de una categoría, por tanto al producto se le debe especificar la categoría a la que pertenece por id de MongoDB.
Además se ha creado un endpoint para búsquedas de categorías y productos.

A continuación se muestran uunos ejemplos de uso de la API:

- USUARIOS
CREACIóN de USUARIOS:
    POST: 
        URL: {{url}}/api/usuarios
        Body: {
            "nombre": "test",
            "correo": "test@test.com",
            "password": "123456",
            "rol": "USER_ROLE"
        }
Obtención de todos los usuarios de la colección usuarios:
    GET: 
        URL: {{url}}/api/usuarios
Nota: Todos los usuarios almacenan su password cifrado en base de datos.

Modificiación de un usuario por id (requiere token JWT para verificar rol de usuario)
    PUT: 
        URL: {{url}}/api/usuarios/:mongoId
        Body: {
            "nombre": "test",
            "rol": "USER_ROLE"
        }
Eliminación de un usuario por id (requiere token JWT para verificar rol de usuario)
    DELETE: 
        URL: {{url}}/api/:mongoId

LOGIN DE USUARIO:
    POST: 
        URL: {{url}}/api/auth/
        
Nota: de la llamada del login se obtiene el TOKEN que será utilizado en la siguientes peticiones

- CATEGORÍAS
CREACIóN DE CATEGORÍAS (Solo pueden ser creadas por usuarios ADMIN_ROLE):
    POST: 
        URL: {{url}}/api/cat
        Headers: {
            "x-token": {{jwt}}
        }
        Body: {
            "nombre": "POSTRES"            
        }
Obtención de categoría por Id
    GET: 
        URL: {{url}}/api/cat/:mongoId

Modificación de categoría (Solo pueden ser creadas por usuarios ADMIN_ROLE)
    PUT: 
        URL: {{url}}/api/cat/:mongoId
        Body: {
            "nombre": "HELADOS",
        }
Eliminación de categoría (Solo pueden ser creadas por usuarios ADMIN_ROLE)
    DELETE: 
        URL: {{url}}/api/cat/:mongoId

- PRODUCTOS
CREACIóN DE PRODUCTOS:
    POST: 
        URL: {{url}}/api/productos
        Headers: {
            "x-token": {{jwt}}
        }
        Body: {
            "nombre": "Helado",
            "descripcion": "Helado de chocolate",
            "categoria": "{{mongoCategoryID}}",
            "precio"
        }
Obtención de productos (Si es un usuario de tipo USER_ROLE solo podrá ver sus productos creados)
    GET: 
        URL: {{url}}/api/productos/:Id

Modificación de producto (ADMIN_ROLE puede modificar todos los productos, USER_ROLE solamente sus productos creados)
    PUT: 
        URL: {{url}}/api/productos/:mongoId
        Body: {
            "nombre": "POSTRES",
        }
Eliminación de producto (ADMIN_ROLE puede modificar todos los productos, USER_ROLE solamente sus productos creados)
    DELETE: 
        URL: {{url}}/api/productos:mongoId

- BÚSQUEDA DE PRODUCTOS Y CATEGORÍAS
Este realiza una búsqeuda en base de datos para las colecciones de categorías y productos. El endpint admite las siguientes entradas - Se añaden ejemplos:

{{url}}/api/buscar/productos/{{caracter o palabra de búsqueda}}
{{url}}/api/buscar/cat/{{caracter o palabra de búsqueda}}



## Estructura del Proyecto
El proyecto está estructurado de la siguiente manera:

├── app.js             # Archivo principal de la aplicación
├── controllers/       # Controladores de la aplicación
├── database/          # Configuración de acceso a base de datos
├── helpers/           # Ficheros de validación, generación de tokens, etc...
├── middlewares/       # Middlewares usados en los distintos endpoints
├── models/            # Modelos de la base de datos
├── routes/            # Rutas y endpoints de la aplicación
├── test/              # Pruebas unitarias y de integración
├── certs/             # Certificados usados para levantar el proyecto en modo seguro
├── .env/              # Fichero environment con variables globales
├── .gitignore         # Fichero donde se especifican los paths de los fichero que no se suben a repositorio
└── package.json       # Archivo de configuración de npm