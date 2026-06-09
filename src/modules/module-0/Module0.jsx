import React, { useState, useEffect } from 'react'
import Welkom from './Welkom.jsx'
import ApiKoppeling from './ApiKoppeling.jsx'
import ApiSucces from './ApiSucces.jsx'
import { useVoortgang } from '../../hooks/useVoortgang.js'

export default function Module0({ modules, onVolgende }) {
  const [scherm, setScherm] = useState('welkom')
  const { setModuleVoltooid } = useVoortgang()

  // Markeer module-0 als voltooid zodra het successcherm wordt getoond
  useEffect(() => {
    if (scherm === 'api-succes') {
      setModuleVoltooid('module-0')
    }
  }, [scherm])

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

  if (scherm === 'api-succes') {
    return (
      <ApiSucces
        onVolgende={onVolgende}
      />
    )
  }

  return null
}
