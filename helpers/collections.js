const coleccionesPermitidas = (coleccion = '', permitidas = []) => {
    console.log('Entra aqui');
    if (!permitidas.includes(coleccion)){
        console.log('Entra en error');
        throw new Error(`La colección ${coleccion} no está permitida: ${permitidas}`);
    }        
}
module.exports = {
    coleccionesPermitidas
}