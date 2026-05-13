import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ModalLogin, ModalRegistro } from '../components/Modales'

const conRouter = (componente: any) => {
    return render(<BrowserRouter>{componente}</BrowserRouter>)
}

describe('ModalLogin', () => {
    it('muestra el form de login con los campos', () => {
        conRouter(<ModalLogin cerrar={vi.fn()} abrirRegistro={vi.fn()} />)
        expect(screen.getByText('Acceso')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument()
        expect(screen.getByText('Entrar')).toBeInTheDocument()
        expect(screen.getByText('Continuar con Google')).toBeInTheDocument()
    })

    it('al dar click en registrate llama la funcion', () => {
        const fn = vi.fn()
        conRouter(<ModalLogin cerrar={vi.fn()} abrirRegistro={fn} />)
        fireEvent.click(screen.getByText('Regístrate'))
        expect(fn).toHaveBeenCalled()
    })
})

describe('ModalRegistro', () => {
    it('muestra el form de registro con los 4 campos', () => {
        conRouter(<ModalRegistro cerrar={vi.fn()} abrirLogin={vi.fn()} />)
        expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
        expect(screen.getByText('Nombre')).toBeInTheDocument()
        expect(screen.getByText('Contraseña')).toBeInTheDocument()
        expect(screen.getByText('Confirmar Contraseña')).toBeInTheDocument()
    })

    it('al dar click en inicia sesion llama la funcion', () => {
        const fn = vi.fn()
        conRouter(<ModalRegistro cerrar={vi.fn()} abrirLogin={fn} />)
        fireEvent.click(screen.getByText('Inicia sesión'))
        expect(fn).toHaveBeenCalled()
    })
})

// validacion de datos antes de agregar articulo
const validarArticulo = (datos: any) => {
    if (!datos.nombre || datos.nombre.trim() === '') return 'El nombre no puede estar vacio'
    if (!datos.marca || datos.marca.trim() === '') return 'La marca no puede estar vacia'
    if (!datos.precio || datos.precio <= 0) return 'El precio tiene que ser mayor a 0'
    return null
}

describe('validacion de articulos', () => {
    it('no deja pasar sin nombre', () => {
        expect(validarArticulo({ nombre: '', marca: 'Nike', precio: 100 })).toBe('El nombre no puede estar vacio')
    })
    it('no deja pasar sin marca', () => {
        expect(validarArticulo({ nombre: 'Jordan', marca: '', precio: 100 })).toBe('La marca no puede estar vacia')
    })
    it('no deja pasar precio 0', () => {
        expect(validarArticulo({ nombre: 'Jordan', marca: 'Nike', precio: 0 })).toBe('El precio tiene que ser mayor a 0')
    })
    it('pasa si todo esta bien', () => {
        expect(validarArticulo({ nombre: 'Jordan 1', marca: 'Nike', precio: 3500 })).toBeNull()
    })
})
