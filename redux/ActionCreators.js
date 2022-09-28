//Aquí creamos todas las posibles acciones que se puedan realizar sobre el store de redux.
//Algunas llevan carga de datos y otras no.
//Algunas son síncronas y otras asíncronas (usan redux thunk).

//Iniciar sesión no persistente (contribuyentes NO registrados).
//Sólo para la sesión actual, para que cualquier persona pueda consultar sus impuestos.
//Esta función devuelve una función, un thunk, ya que es asíncrona.
//El objeto documento es tipoDoc (integer) y nroDoc (string).
export const contribuyenteLoginAction = (documento) => {
    return (dispatch) => {
        //Convierto el tipo de documento pasado como texto en un número (el id_tipoDoc).
        let tipoDoc
        switch (documento.tipoDoc) {
            case 'DNI':
                tipoDoc = 1
            case 'CUIT':
                tipoDoc = 2
            case 'CUIL':
                tipoDoc = 3
            case 'CI':
                tipoDoc = 4
            case 'LC':
                tipoDoc = 5
            case 'LE':
                tipoDoc = 6
            case 'PAS':
                tipoDoc = 7

            default:
                tipoDoc = 1
        }

        var formData = new FormData()
        formData.append('tipo_documento', tipoDoc)
        formData.append('nro_documento', documento.nroDoc)

        fetch('http://mobileapp.chosmalal.gob.ar/obtener_cuentas_contribuyente.php', {
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
        })

        .then(response => response.json())
        .then (responseJson => {
            let usuarioDevuelto = responseJson
            //console.log(usuarioDevuelto)
            dispatch(contribuyenteLoginActionSync(usuarioDevuelto))
        })

        .catch((err) => {
            alert('Error. Verifique si tiene acceso a internet y si los datos son correctos.')
        });
    }
};

//Iniciar sesión (usuarios no registrados, para consulta de impuestos).
//dni es tipodoc y nrodoc.
export const contribuyenteLoginActionSync_STANDBY = (contribuyente) => {
    return {
        type: 'CONTRIBUYENTE_LOGIN',
        payload: {
            contribuyente: contribuyente
        }
    }
};

//Iniciar sesión (usuarios no registrados, para consulta de impuestos).
//dni es tipodoc y nrodoc.
export const contribuyenteLoginActionSync = (doc) => {
    //Convierto el tipo de documento pasado como texto en un número (el id_tipoDoc).
    let tipoDoc
    switch (doc.tipoDoc) {
        case 'DNI':
            tipoDoc = 1
        case 'CUIT':
            tipoDoc = 2
        case 'CUIL':
            tipoDoc = 3
        case 'CI':
            tipoDoc = 4
        case 'LC':
            tipoDoc = 5
        case 'LE':
            tipoDoc = 6
        case 'PAS':
            tipoDoc = 7

        default:
            tipoDoc = 1
    }

    return {
        type: 'CONTRIBUYENTE_LOGIN',
        payload: {
            documento: {
                tipoDoc: tipoDoc,
                nroDoc: doc.nroDoc
            }
        }
    }
};

//Iniciar sesión (usuarios no registrados, para consulta de impuestos).
//dni es tipodoc y nrodoc.
export const contribuyenteCargaDatosActionSync = (contribuyente) => {
    return {
        type: 'CONTRIBUYENTE_CARGA_DATOS',
        payload: {
            contribuyente: contribuyente
        }
    }
}


//Cerrar sesión (usuarios no registrados).
export const contribuyenteLogoutAction = () => {
    return {
        type: 'CONTRIBUYENTE_LOGOUT',
    }
};

//Guarda la cuenta que está seleccionada para ver.
export const seleccionarCuentaAction = (cuenta) => {
    return {
        type: 'SELECCIONAR_CUENTA',
        payload: {
            cuenta: cuenta
        }
    }
};

/* export const fetchLogin = (user) => {
    //console.log(user)
    var formData = new FormData()
    formData.append('mail', user.mail)
    formData.append('password', user.password)

    return fetch('http://chmlmobile.chosmalal.net.ar/autenticar_usuario.php', {
      method: 'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
}; */

//Iniciar sesión (usuarios registrados).
//Esta función devuelve una función, un thunk, ya que es asíncrona.
export const usuarioLogInAction = (user) => {
    //console.log(user)
    return (dispatch) => {
        var formData = new FormData()
        formData.append('mail', user.mail)
        formData.append('password', user.password)

        //Ver nueva versión de esta API.
        fetch('https://chmlmobile.chosmalal.net.ar/autenticar_usuario.php', {
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
        })

        .then(response => response.json())
        .then (responseJson => {
            let usuarioDevuelto = responseJson
            usuarioDevuelto = {
                ...usuarioDevuelto,
                password: user.password
            }
            //console.log(usuarioDevuelto)
            dispatch(usuarioLogInActionSync(usuarioDevuelto))
        })

        .catch((err) => {
            alert('Error. Verifique si tiene acceso a internet y si los datos son correctos.')
        });
    }
};

//Esta función, una vez que ya se han traído del server los datos del usuario, 
//actualiza el global state de redux con ellos.
export const usuarioLogInActionSync = (datosUsuario) => {
    return {
        type: 'LOGIN',
        payload: {
            usuario: datosUsuario
        }
    }
};

//Finalizar sesión (usuarios registrados).
export const usuarioLogOutAction = () => {
    return {
        type: 'LOGOUT'
    }
};

//Verificar si existe el correo, para el caso de olvido de password.
//Esta función devuelve una función, un thunk, ya que es asíncrona.
export const verificarExisteMailAction = (mail) => {
    //console.log(mail)
    return (dispatch) => {
        var formData = new FormData()
        formData.append('mail', mail)
        
        fetch('https://chmlmobile.chosmalal.net.ar/apiusuarios/v3/cambio_password/verifica_existe_mail.php', {
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
        })

        .then(response => response.json())
        .then (responseJson => {
            let respuesta = responseJson
            //console.log(respuesta)
            dispatch(verificarExisteMailActionSync(respuesta, mail))
        })

        .catch((err) => {
            alert('Error. Verifique si tiene acceso a internet.')
        });
    }
};

//Esta función, una vez que se verificó si el mail existe o no,
//actualiza el global state de redux con la respuesta obtenida.
export const verificarExisteMailActionSync = (respuesta, mail) => {
    return {
        type: 'VERIFICA_MAIL',
        payload: {
            mail: mail,
            respuesta: respuesta
        }
    }
};

//Esta función, una vez que ya se pasó a la pantalla de cambio de password,
//resetea en el global state de redux el valor de respuesta del servidor.
export const resetearRespuestaServerAction = () => {
    return {
        type: 'RESET_RESPUESTA_SERVER'
    }
};

//Esta función, una vez que ya se pasó a la pantalla de cambio de password,
//resetea en el global state de redux el valor de respuesta del servidor.
export const resetVerificaCodigoAction = () => {
    return {
        type: 'RESET_VERIFICA_CODIGO'
    }
};

//Verificar si el código ingresado es igual que el que se mandó al mail, para el caso de olvido de password.
//Esta función devuelve una función, un thunk, ya que es asíncrona.
export const verificarCodigoCorrectoAction = (mail, codigo) => {
    //console.log(mail)
    return (dispatch) => {
        var formData = new FormData()
        formData.append('mail', mail)
        formData.append('codigo', codigo)
        
        fetch('https://chmlmobile.chosmalal.net.ar/apiusuarios/v3/cambio_password/chequeo_codigo_cambio_pass.php', {
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
        })

        .then(response => response.json())
        .then (responseJson => {
            let respuesta = responseJson
            //console.log(respuesta)
            dispatch(verificarCodigoCorrectoActionSync(respuesta, mail))
        })

        .catch((err) => {
            alert('Error. Verifique si tiene acceso a internet.')
        });
    }
};

//Esta función, una vez que se verificó si el mail existe o no,
//actualiza el global state de redux con la respuesta obtenida.
export const verificarCodigoCorrectoActionSync = (respuesta, mail) => {
    return {
        type: 'VERIFICA_CODIGO',
        payload: {
            mail: mail,
            respuesta: respuesta
        }
    }
};