import { useState, useEffect, useCallback } from 'react'

// Gedeelde luisteraars zodat elke component die useVoortgang gebruikt
// opnieuw rendert zodra de voortgang ergens wijzigt. Zonder dit houdt
// elke component zijn eigen kopie bij en lopen indicatoren achter.
const luisteraars = new Set()

function meldWijziging() {
  luisteraars.forEach((fn) => fn())
}

export function useVoortgang() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const herteken = () => setTick((t) => t + 1)
    luisteraars.add(herteken)
    // 'storage' vangt wijzigingen op vanuit een ander tabblad
    window.addEventListener('storage', herteken)
    return () => {
      luisteraars.delete(herteken)
      window.removeEventListener('storage', herteken)
    }
  }, [])

  const getLesVoortgang = useCallback((lesId) => {
    // Een corrupt opgeslagen item mag nooit de hele app breken;
    // val dan terug op een schone lege voortgang.
    try {
      const raw = localStorage.getItem(`voortgang_${lesId}`)
      return raw ? JSON.parse(raw) : { afgerond: false, antwoord: '' }
    } catch {
      return { afgerond: false, antwoord: '' }
    }
  }, [])

  const setLesVoortgang = useCallback((lesId, data) => {
    localStorage.setItem(`voortgang_${lesId}`, JSON.stringify(data))
    meldWijziging()
  }, [])

  const isModuleVoltooid = useCallback((moduleId) => {
    return localStorage.getItem(`module_${moduleId}_voltooid`) === 'true'
  }, [])

  const setModuleVoltooid = useCallback((moduleId) => {
    localStorage.setItem(`module_${moduleId}_voltooid`, 'true')
    meldWijziging()
  }, [])

  return { getLesVoortgang, setLesVoortgang, isModuleVoltooid, setModuleVoltooid }
}
