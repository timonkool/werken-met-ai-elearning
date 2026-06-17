import React, { useState } from 'react'

export default function Navigatie({ modules, actieveModuleId, onSelecteer, isModuleVoltooid, getLesVoortgang }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function berekenVoortgang(module) {
    if (!module.lessen || module.lessen.length === 0) return 0
    const afgerond = module.lessen.filter(les => {
      const v = getLesVoortgang(les.id)
      return v.afgerond
    }).length
    return Math.round((afgerond / module.lessen.length) * 100)
  }

  function sluitMenu() {
    setMenuOpen(false)
  }

  const navInhoud = (
    <nav className="navigatie">
      <p className="navigatie-koplabel">Werken met AI</p>
      <ul className="navigatie-lijst">
        {modules.map((module, index) => {
          const actief = actieveModuleId === module.id
          const voltooid = isModuleVoltooid(module.id)
          const voortgang = berekenVoortgang(module)

          return (
            <li key={module.id}>
              <button
                className={
                  'navigatie-item' +
                  (actief ? ' navigatie-item--actief' : '') +
                  (voltooid ? ' navigatie-item--voltooid' : '')
                }
                onClick={() => {
                  onSelecteer(module.id)
                  sluitMenu()
                }}
              >
                <div className="navigatie-item-rij">
                  <span className="navigatie-nummer">
                    {voltooid
                      ? <i className="ph-bold ph-check navigatie-vinkje" aria-hidden="true" />
                      : index
                    }
                  </span>
                  <span className="navigatie-titel">{module.titel}</span>
                </div>
                <div className="navigatie-balk-wrap">
                  <div
                    className="navigatie-balk-vulling"
                    style={{ width: `${voortgang}%` }}
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Hamburger knop — alleen zichtbaar op mobiel */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(true)}
        aria-label="Menu openen"
      >
        <span className="hamburger-streep" />
        <span className="hamburger-streep" />
        <span className="hamburger-streep" />
      </button>

      {/* Navigatie op desktop */}
      <div className="navigatie-desktop">
        {navInhoud}
      </div>

      {/* Navigatie als overlay op mobiel */}
      {menuOpen && (
        <>
          <div
            className="navigatie-backdrop"
            onClick={sluitMenu}
            aria-hidden="true"
          />
          <div className="navigatie-overlay">
            <button
              className="navigatie-sluit"
              onClick={sluitMenu}
              aria-label="Menu sluiten"
            >
              <i className="ph-bold ph-x" aria-hidden="true" />
            </button>
            {navInhoud}
          </div>
        </>
      )}
    </>
  )
}
