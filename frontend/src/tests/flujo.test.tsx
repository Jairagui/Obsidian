import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '../routes/AppRouter'
import { AuthProvider } from '../context/AuthContext'

// simulamos el localStorage
const mockStorage: Record<string, string> = {}
beforeEach(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key])
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => mockStorage[key] || null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { mockStorage[key] = value })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => { delete mockStorage[key] })
})

const renderApp = () => render(<BrowserRouter><AuthProvider><AppRouter /></AuthProvider></BrowserRouter>)

describe('flujo completo de la app', () => {
    it('muestra el nav con login y sign up si no hay sesion', () => {
        renderApp()
        expect(screen.getByText('Login')).toBeInTheDocument()
        expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })

    it('abre login al darle click', () => {
        renderApp()
        fireEvent.click(screen.getByText('Login'))
        expect(screen.getByText('Acceso')).toBeInTheDocument()
    })

    it('abre registro al darle click', () => {
        renderApp()
        fireEvent.click(screen.getByText('Sign Up'))
        expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
    })

    it('puedes cambiar de login a registro y viceversa', () => {
        renderApp()
        fireEvent.click(screen.getByText('Login'))
        fireEvent.click(screen.getByText('Regístrate'))
        expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()

        fireEvent.click(screen.getByText('Inicia sesión'))
        expect(screen.getByText('Acceso')).toBeInTheDocument()
    })

    it('la X cierra el modal', () => {
        renderApp()
        fireEvent.click(screen.getByText('Login'))
        fireEvent.click(screen.getByText('X'))
        expect(screen.queryByText('Acceso')).not.toBeInTheDocument()
    })

    it('la landing tiene el hero y las cards', () => {
        renderApp()
        expect(screen.getByText(/Tu Colección/)).toBeInTheDocument()
        expect(screen.getByText('Ver mi Bóveda')).toBeInTheDocument()
        expect(screen.getByText('Organización')).toBeInTheDocument()
    })

    it('sin sesion el boton de boveda abre registro', () => {
        renderApp()
        fireEvent.click(screen.getByText('Ver mi Bóveda'))
        expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
    })

    it('con sesion muestra el nombre y boton salir', () => {
        mockStorage['obsidian_token'] = 'token123'
        mockStorage['obsidian_usuario'] = JSON.stringify({ id: '1', name: 'Jair', role: 'user' })
        renderApp()
        expect(screen.getByText(/Hola, Jair/)).toBeInTheDocument()
        expect(screen.getByText('Salir')).toBeInTheDocument()
        expect(screen.queryByText('Login')).not.toBeInTheDocument()
    })

    it('si es admin sale el link al panel', () => {
        mockStorage['obsidian_token'] = 'token123'
        mockStorage['obsidian_usuario'] = JSON.stringify({ id: '1', name: 'Admin', role: 'admin' })
        renderApp()
        expect(screen.getByText('Panel Admin')).toBeInTheDocument()
    })
})
