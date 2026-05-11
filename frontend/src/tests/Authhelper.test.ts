import { describe, it, expect } from 'vitest'
import { guardarSesion, obtenerToken, obtenerUsuario, cerrarSesionHelper } from '../helpers/authHelper'

describe('authHelper', () => {
    it('debe guardar la sesion y leerla correctamente', () => {
        guardarSesion('token123', { id: '1', name: 'Jair', role: 'user' })

        expect(obtenerToken()).toBe('token123')
        expect(obtenerUsuario().name).toBe('Jair')

        cerrarSesionHelper()
        expect(obtenerToken()).toBeNull()
    })
})