import React from 'react'

export default function ModuleWeergave({ module }) {
  if (!module) return null

  return (
    <main style={{ flex: 1, padding: '48px 40px', maxWidth: '760px' }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        marginBottom: '16px',
      }}>
        MODULE
      </p>
      <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>{module.titel}</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>{module.beschrijving}</p>
      <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
        Inhoud volgt zodra de lessen zijn toegevoegd.
      </p>
    </main>
  )
}
