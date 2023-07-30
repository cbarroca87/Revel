const request = require('supertest');
const app = require('../app');
const {borrarTodosUsuarios} = require('../controllers/usuarios');
const {borrarTodasCategorias} = require('../controllers/categorias');
const {borrarTodosProductos} = require('../controllers/productos');
let userId = '';


describe('GET /api/usuarios', () => {
  test('SHOULD RETURN USERS AND STATUS 200', async () => {
    const response = await request(app).get('/api/usuarios');
    expect(response.status).toBe(200);
  });
});

describe('POST /api/usuarios', () => {
  beforeAll(async () => {
    await borrarTodosUsuarios();
  });

  test('SHOULD RETURN STATUS 201 WHEN USER IS CREATED', async () => {
    const newUser = {
      nombre: "test",
      correo: "test@test.com",
      password: "123456",
      rol: "USER_ROLE"
    }

    const response = await request(app).post('/api/usuarios').send(newUser);
    expect(response.status).toBe(201);
  });
});

// Prueba para actualizar un usuario
describe('PUT /api/usuarios/:id', () => {
  test('SHOULD UPDATE USER AND RETURN 200', async () => {
    const newUser = {
      nombre: "test2",
      correo: "test2@test.com",
      password: "123456",
      rol: "USER_ROLE"
    }
    const response = await request(app).post('/api/usuarios').send(newUser);
    userId = response.body.usuario.uid;

    const resp = await request(app)
      .put(`/api/usuarios/${userId}`)
      .send({ nombre: 'test3', rol: "ADMIN_ROLE" });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.usuarioDB.nombre).toBe('test3');
    expect(resp.body.usuarioDB.rol).toBe('ADMIN_ROLE');
  });
});

describe('DELETE /users/:id', () => {
  test('should delete a user', async () => {
    const newUser = {
      nombre: "test4",
      correo: "test4@test.com",
      password: "123456",
      rol: "ADMIN_ROLE"
    }
    const response = await request(app).post('/api/usuarios').send(newUser);
    userId = response.body.usuario.uid;
    expect(response.statusCode).toBe(201);

    const userLogin = {
      correo: "test2@test.com",
      password: "123456"
    }

    const responseLogin = await request(app).post('/api/auth/login').send(userLogin);
    expect(responseLogin.status).toBe(200);

    const jwt = responseLogin.body.token;
    const resp = await request(app).delete(`/api/usuarios/${userId}`).set('x-token', jwt);

    expect(resp.statusCode).toBe(200);
  });
});

describe('LOGIN AND CREATE NEW CATEGORY AND PRODUCT', () => {

  beforeAll( async () => {
     await borrarTodasCategorias();
     await borrarTodosProductos();
  });
  test('should return status 200 when user is login and jwt and create category', async () => {
    const newUser = {
      nombre: "test5",
      correo: "test5@test.com",
      password: "123456",
      rol: "ADMIN_ROLE"
    }
    const responseNewUser = await request(app).post('/api/usuarios').send(newUser);
    expect(responseNewUser.status).toBe(201);

    const userLogin = {
      correo: "test5@test.com",
      password: "123456"
    }

    const responseLogin = await request(app).post('/api/auth/login').send(userLogin);
    expect(responseLogin.status).toBe(200);

    const jwt = responseLogin.body.token;

    const newCategory = {
      nombre: 'Categoria_' + Math.floor(Math.random() * (1000 - 1) + 1)
    }

    const responseNewCategory = await request(app).post('/api/cat').send(newCategory).set('x-token', jwt);
    expect(responseNewCategory.status).toBe(201);

    const idCategory = responseNewCategory.body._id;
    const newProduct = {
      nombre: "Nuevo producto",
      descripcion: "Descripción del nuevo producto",
      categoria: idCategory,
      precio: 3
    }
    const responseNewProduct = await request(app).post('/api/productos').send(newProduct).set('x-token', jwt);
    expect(responseNewProduct.status).toBe(201);

  });
});

describe('LOGIN AND CREATE NEW CATEGORY WITHOUT PRIVILEGES', () => {
  test('should return status 401 when user is login and jwt and not create category', async () => {
    const newUser = {
      nombre: "test6",
      correo: "test6@test.com",
      password: "123456",
      rol: "USER_ROLE"
    }
    const responseNewUser = await request(app).post('/api/usuarios').send(newUser);
    expect(responseNewUser.status).toBe(201);

    const userLogin = {
      correo: "test6@test.com",
      password: "123456"
    }

    const responseLogin = await request(app).post('/api/auth/login').send(userLogin);
    expect(responseLogin.status).toBe(200);

    const jwt = responseLogin.body.token;

    const newCategory = {
      nombre: 'Categoria_' + Math.floor(Math.random() * (1000 - 1) + 1)
    }

    const responseNewCategory = await request(app).post('/api/cat').send(newCategory).set('x-token', jwt);
    expect(responseNewCategory.status).toBe(401);
  });
});


