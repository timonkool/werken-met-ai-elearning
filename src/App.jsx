import React, { useState, useEffect } from 'react'
import cursusData from './data/cursus.json'
import Navigatie from './components/Navigatie.jsx'
import ModuleWeergave from './components/ModuleWeergave.jsx'
import ColorSwitchKop from './components/ColorSwitchKop.jsx'
import { useVoortgang } from './hooks/useVoortgang.js'

const OPSLAG_KEY = 'actieve_module'

export default function App() {
  const modules = cursusData.modules
  const { isModuleVoltooid, getLesVoortgang } = useVoortgang()

  // Herstel actieve module uit localStorage; terugkerende bezoekers slaan de startpagina over
  const [actieveModuleId, setActieveModuleId] = useState(
    () => localStorage.getItem(OPSLAG_KEY) || null
  )

  // Bij elke modulewissel terug naar de bovenkant, zodat je niet
  // onderaan de volgende module begint.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [actieveModuleId])

  function navigeerNaar(moduleId) {
    setActieveModuleId(moduleId)
    localStorage.setItem(OPSLAG_KEY, moduleId)
  }

  function navigeerVolgende() {
    const huidigIndex = modules.findIndex(m => m.id === actieveModuleId)
    const volgende = modules[huidigIndex + 1]
    if (volgende) navigeerNaar(volgende.id)
  }

  if (!actieveModuleId) {
    return <Startpagina onStart={() => navigeerNaar('module-0')} />
  }

  const actieveModule = modules.find(m => m.id === actieveModuleId)

  return (
    <div className="app-layout">
      <Navigatie
        modules={modules}
        actieveModuleId={actieveModuleId}
        onSelecteer={navigeerNaar}
        isModuleVoltooid={isModuleVoltooid}
        getLesVoortgang={getLesVoortgang}
      />
      <main className="app-inhoud">
        <ModuleWeergave
          module={actieveModule}
          modules={modules}
          onVolgende={navigeerVolgende}
        />
      </main>
    </div>
  )
}

function Startpagina({ onStart }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <ColorSwitchKop
        eyebrow="E-learning"
        size="clamp(40px, 9vw, 76px)"
        align="center"
        style={{ width: '100%' }}
      >
        Werken met AI
      </ColorSwitchKop>

      <div style={{ textAlign: 'center', padding: '8px 24px 0' }}>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'var(--fs-lead)',
          lineHeight: 1.6,
          color: 'var(--sage-ink)',
          maxWidth: '480px',
          margin: '0 auto 36px',
        }}>
          Praktische e-learning voor medewerkers en vrijwilligers
        </p>

        <button className="primary" style={{ fontSize: '15px', padding: '0 36px', height: '52px' }} onClick={onStart}>
          Begin de cursus
        </button>
      </div>
    </div>
  )
}
