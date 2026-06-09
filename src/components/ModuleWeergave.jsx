import React from 'react'

const FONT_SIZE = 48

export default function ModuleWeergave({ module, modules, onVolgende }) {
  if (!module) return null

  const index = modules.findIndex(m => m.id === module.id)
  const heeftVolgende = index < modules.length - 1

  return (
    <div className="module-weergave">

      {/* Kleurwissel kop */}
      <div className="module-kop">
        <div
          className="module-kop-band"
          style={{ background: module.kleur }}
        >
          <span className="module-kop-label">Module {index}</span>
          <span className="module-kop-duur">{module.duur} min</span>
        </div>

        <div
          className="module-titel-zone"
          style={{
            height: FONT_SIZE,
            marginTop: -(FONT_SIZE * 2 / 3),
          }}
        >
          <h1
            className="module-titel module-titel--wit"
            style={{ fontSize: FONT_SIZE }}
          >
            {module.titel}
          </h1>
          <h1
            className="module-titel module-titel--kleur"
            style={{ fontSize: FONT_SIZE, color: module.kleur }}
          >
            {module.titel}
          </h1>
        </div>
      </div>

      {/* Beschrijving en inhoud */}
      <div className="module-body">
        <p className="module-beschrijving">{module.beschrijving}</p>

        <div className="module-placeholder">
          <p>Inhoud volgt binnenkort.</p>
        </div>

        {heeftVolgende && (
          <button className="primary" onClick={onVolgende}>
            Volgende module
          </button>
        )}
      </div>

    </div>
  )
}
