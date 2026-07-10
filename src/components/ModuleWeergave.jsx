import React from 'react'
import Module0 from '../modules/module-0/Module0.jsx'
import Module1 from '../modules/module-1/Module1.jsx'
import Module2 from '../modules/module-2/Module2.jsx'
import Module3 from '../modules/module-3/Module3.jsx'
import Module4 from '../modules/module-4/Module4.jsx'
import Module5 from '../modules/module-5/Module5.jsx'
import LesBlok from './LesBlok.jsx'
import ColorSwitchKop from './ColorSwitchKop.jsx'

export default function ModuleWeergave({ module, modules, onVolgende }) {
  if (!module) return null

  // Module 0 heeft een eigen weergave met sub-schermen
  if (module.id === 'module-0') {
    return (
      <Module0
        modules={modules}
        onVolgende={onVolgende}
      />
    )
  }

  // Standaard moduleweergave met kleurwissel-kop
  const index = modules.findIndex(m => m.id === module.id)
  const heeftVolgende = index < modules.length - 1

  // Modules met een eigen lesweergave (bijzondere interacties)
  const eigenWeergave =
    module.id === 'module-1' || module.id === 'module-2' ||
    module.id === 'module-3' || module.id === 'module-4' ||
    module.id === 'module-5'

  return (
    <div className="module-weergave">

      {/* Signature kleurwissel-kop met modulenummer en duur */}
      <ColorSwitchKop
        eyebrow={`Module ${index}`}
        meta={`${module.duur} min`}
        size="clamp(28px, 5.6vw, 44px)"
      >
        {module.titel}
      </ColorSwitchKop>

      {/* Beschrijving en inhoud */}
      <div className="module-body">
        <p className="module-beschrijving">{module.beschrijving}</p>

        {module.id === 'module-1' && (
          <Module1 module={module} onVolgende={onVolgende} />
        )}

        {module.id === 'module-2' && (
          <Module2 module={module} onVolgende={onVolgende} />
        )}

        {module.id === 'module-3' && (
          <Module3 module={module} onVolgende={onVolgende} />
        )}

        {module.id === 'module-4' && (
          <Module4 module={module} onVolgende={onVolgende} />
        )}

        {module.id === 'module-5' && (
          <Module5 module={module} />
        )}

        {!eigenWeergave && (
          module.lessen && module.lessen.length > 0 ? (
            module.lessen.map((les) => <LesBlok key={les.id} les={les} />)
          ) : (
            <div className="module-placeholder">
              <p>Inhoud volgt binnenkort.</p>
            </div>
          )
        )}

        {!eigenWeergave && heeftVolgende && (
          <button className="primary" onClick={onVolgende}>
            Volgende module
          </button>
        )}
      </div>

    </div>
  )
}
