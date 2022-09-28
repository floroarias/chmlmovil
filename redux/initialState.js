export const initialState = {
    contribuyenteLogueado: false, //Registrado con tipoDoc y nroDoc para la sesión actual.
    documento: null, //Objeto {tipoDoc,nroDoc} para la sesión actual (contribuyente logueado).
    //El objeto 'contribuyente' carga desde web los datos del contribuyente 'logueado'.
    //El contribuyente logueado no tiene persistencia, es de cada sesión.
    contribuyente: null, //Datos del contribuyente (traídos desde el server) que se corresponde con {tipodoc, nrodoc}.
    cuentaSeleccionada: null, //Cuenta seleccionada actualmente para ser cargada en el detalle.
    
    //A continuación, Usuario registrado de la app.
    usuarioRegistrado: false, //Registrado en la BD y sesión iniciada con mail + password.
    usuario: null, //Objeto {id_usuario, nombres, apellidos, mail, contrasena, telefono, direccion, fechaNacimiento}
    //Agregado 26-06-22:
    tokenSesion: null, //Será usado para autenticar al usuario en el servidor.
    mailOlvidoPass: null, //Para el caso de olvido de pass, mail del usuario registrado.
    claveOlvidoPass: null, //Clave enviada al mail registrado del usuario para poder cambiar la contraseña.
    respuestaServerMailExiste: null, //Para el caso de olvido de pass, respuesta obtenida del servidor sobre si el mail existe o no.
    resultadoChequeoDeCodigo: null, //Para el caso de olvido de pass, si el código enviado al mail es igual al ingresado o no.
};