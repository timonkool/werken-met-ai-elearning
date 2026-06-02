import React from 'react'

export default function Navigatie({ modules, actieveModule, onSelecteer }) {
  return (
    <nav style={{
      width: '260px',
      minHeight: '100vh',
      background: 'var(--sage-mist)',
      borderRight: '1px solid var(--sage-soft)',
      padding: '32px 16px',
      flexShrink: 0,
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        marginBottom: '24px',
        paddingLeft: '8px',
      }}>
        Modules
      </p>
      <ul style={{ listStyle: 'none' }}>
        {modules.map((module) => (
          <li key={module.id}>
            <button
              onClick={() => onSelecteer(module.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: actieveModule === module.id ? 'var(--sage-soft)' : 'transparent',
                color: actieveModule === module.id ? 'var(--sage-ink)' : 'var(--text)',
                borderRadius: 'var(--radius-md)',
                minHeight: 'auto',
                padding: '10px 12px',
                fontSize: '14px',
                fontWeight: actieveModule === module.id ? 600 : 400,
                border: 'none',
                marginBottom: '4px',
              }}
            >
              {module.titel}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
