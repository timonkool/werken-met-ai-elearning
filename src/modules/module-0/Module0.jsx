import React, { useState } from 'react'
import Welkom from './Welkom.jsx'
import ApiKoppeling from './ApiKoppeling.jsx'

// Module 0 heeft drie sub-schermen: welkom, api-koppeling, api-succes
// ApiSucces wordt in een volgende stap gebouwd

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

  if (scherm === 'api-koppeling') {
    return (
      <ApiKoppeling
        onVerbonden={() => setScherm('api-succes')}
      />
    )
  }

  // Tijdelijke placeholder voor api-succes
  return (
    <div style={{ padding: '48px', color: 'var(--muted)', fontStyle: 'italic' }}>
      Verbinding gelukt. ApiSucces volgt binnenkort.
    </div>
  )
}
