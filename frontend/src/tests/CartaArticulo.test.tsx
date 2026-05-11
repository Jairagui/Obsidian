import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CartaArticulo } from '../components/CartaArticulo'

describe('CartaArticulo', () => {
    it('debe mostrar la info del articulo', () => {
        render(
            <CartaArticulo
                articulo={{ _id: '1', nombre: 'Jordan 1', marca: 'Nike', categoria: 'Sneakers', anio: 2015, condicion: 'Nuevo', precio: 3500, imagen: '' }}
                alBorrar={vi.fn()}
                alEditar={vi.fn()}
            />
        )

        expect(screen.getByText('Jordan 1')).toBeInTheDocument()
        expect(screen.getByText(/Nike/)).toBeInTheDocument()
        expect(screen.getByText(/3,500/)).toBeInTheDocument()
    })
})