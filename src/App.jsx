import React, { useState } from 'react'
import cursusData from './data/cursus.json'
import Navigatie from './components/Navigatie.jsx'
import ModuleWeergave from './components/ModuleWeergave.jsx'
import { useVoortgang } from './hooks/useVoortgang.js'

export default function App() {
  const [actieveModuleId, setActieveModuleId] = useState(null)
  const modules = cursusData.modules
  const { isModuleVoltooid, getLesVoortgang } = useVoortgang()

  if (!actieveModuleId) {
    return <Startpagina onStart={() => setActieveModuleId('module-0')} />
  }

  const actieveModule = modules.find(m => m.id === actieveModuleId)

  return (
    <div className="app-layout">
      <Navigatie
        modules={modules}
        actieveModuleId={actieveModuleId}
        onSelecteer={setActieveModuleId}
        isModuleVoltooid={isModuleVoltooid}
        getLesVoortgang={getLesVoortgang}
      />
      <main className="app-inhoud">
        <ModuleWeergave module={actieveModule} />
      </main>
    </div>
  )
}

function Startpagina({ onStart }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--sage-ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--sage-soft)',
          marginBottom: '32px',
        }}>
          E-LEARNING
        </p>

        <h1 style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: '64px',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.5px',
          color: 'var(--cream)',
          marginBottom: '24px',
        }}>
          Werken met AI
        </h1>

        <p style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '18px',
          lineHeight: 1.6,
          color: 'var(--sage-soft)',
          maxWidth: '480px',
          margin: '0 auto 48px',
        }}>
          Praktische e-learning voor medewerkers en vrijwilligers
        </p>

        <button className="primary" style={{ fontSize: '15px', padding: '0 36px' }} onClick={onStart}>
          Begin de cursus
        </button>
      </div>
    </div>
  )
}
