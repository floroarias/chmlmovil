import { combineReducers } from "redux";
import { initialState } from "./initialState";

function reducerContribuyenteLogin(state = initialState, action) {
        switch (action.type) {
            case 'CONTRIBUYENTE_LOGIN':
                //console.log('REDUCER CONTRIBUYENTE_LOGIN - STATE:')
                //console.log(action)
                let nuevoEstado = {
                    ...state,
                    //contribuyente: action.payload.contribuyente,
                    contribuyenteLogueado: true,
                    documento: action.payload.documento
                }
                //console.log(nuevoEstado)
                return nuevoEstado
            default:
                return state
        }
};

function reducerContribuyenteCargaDatos(state = initialState, action) {
    switch (action.type) {
        case 'CONTRIBUYENTE_CARGA_DATOS':
            let nuevoEstado = {
                ...state,
                contribuyente: action.payload.contribuyente,
            }
            return nuevoEstado
        default:
            return state
    }
};

function reducerContribuyenteLogout(state = initialState, action) {
        switch (action.type) {
            case 'CONTRIBUYENTE_LOGOUT':
                return {
                    ...state,
                    contribuyenteLogueado: false,
                    documento: null,
                    contribuyente: null,
                }
            default:
                return state
        }
};

function reducerSeleccionarCuenta(state = initialState, action) {
    switch (action.type) {
        case 'SELECCIONAR_CUENTA':
            return {
                ...state,
                cuentaSeleccionada: action.payload.cuenta
            }
        default:
            return state
    }
};

function reducerLogInOut(state = initialState, action) {
        switch (action.type) {
            case 'LOGIN':
                return {
                    ...state,
                    usuario: action.payload.usuario,
                    usuarioRegistrado: true,
                }
            case 'LOGOUT':
                return {
                    ...state,
                    usuario: null,
                    usuarioRegistrado: false,
                }
            default:
                return state
        }
};

/* function reducerLogOut(state = initialState, action) {
    switch (action.type) {
        case 'LOGOUT':
            console.log('ESTOY EN REDUCER LOGOUT')
            return {
                ...state,
                usuario: null,
                usuarioRegistrado: false,
            }
        default:
            return state
    }
}; */

function reducerVerificaMail(state = initialState, action) {
    switch (action.type) {
        case 'VERIFICA_MAIL':
            return {
                ...state,
                respuestaServerMailExiste: action.payload.respuesta,
                mailOlvidoPass: action.payload.mail,
            }
        default:
            return state
    }
};

function reducerResetRespuestaServer(state = initialState, action) {
    switch (action.type) {
        case 'RESET_RESPUESTA_SERVER':
            return {
                ...state,
                respuestaServerMailExiste: null,
            }
        default:
            return state
    }
};

function reducerResetVerificacionCodigo(state = initialState, action) {
    switch (action.type) {
        case 'RESET_VERIFICA_CODIGO':
            return {
                ...state,
                resultadoChequeoDeCodigo: null,
            }
        default:
            return state
    }
};

function reducerVerificaCodigo(state = initialState, action) {
    switch (action.type) {
        case 'VERIFICA_CODIGO':
            return {
                ...state,
                resultadoChequeoDeCodigo: action.payload.respuesta,
                mailOlvidoPass: action.payload.mail,
            }
        default:
            return state
    }
};

const rootReducer = combineReducers({
    contribuyenteLogin: reducerContribuyenteLogin,
    contribuyenteLogout: reducerContribuyenteLogout,
    usuarioLogInOut: reducerLogInOut,
    seleccionarCuenta: reducerSeleccionarCuenta,
    cargarDatosContribuyente: reducerContribuyenteCargaDatos,
    verificarMail: reducerVerificaMail,
    resetearRespuestaServer: reducerResetRespuestaServer,
    resetVerificacionCodigo: reducerResetVerificacionCodigo,
    verificarCodigo: reducerVerificaCodigo
});

export default rootReducer;