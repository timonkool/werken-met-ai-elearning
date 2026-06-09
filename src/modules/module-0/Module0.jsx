import React, { useState } from 'react'
import Welkom from './Welkom.jsx'

// Module 0 heeft drie sub-schermen: welkom, api-koppeling, api-succes
// ApiKoppeling en ApiSucces worden in een volgende stap gebouwd

export default function Module0({ modules, onVolgende }) {
  const [scherm, setScherm] = useState('welkom')

  if (scherm === 'welkom') {
    return (
      <Welkom
        modules={modules}
        onStart={() => setScherm('api-koppeling')}
      />
    )
  }

  // Tijdelijke placeholder voor api-koppeling en api-succes
  return (
    <div style={{ padding: '48px', color: 'var(--muted)', fontStyle: 'italic' }}>
      API-koppeling volgt binnenkort.
    </div>
  )
}
