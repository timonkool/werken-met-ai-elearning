import { useState, useCallback } from 'react'

export function useVoortgang() {
  const [_, setTick] = useState(0)

  const getLesVoortgang = useCallback((lesId) => {
    const raw = localStorage.getItem(`voortgang_${lesId}`)
    return raw ? JSON.parse(raw) : { afgerond: false, antwoord: '' }
  }, [])

  const setLesVoortgang = useCallback((lesId, data) => {
    localStorage.setItem(`voortgang_${lesId}`, JSON.stringify(data))
    setTick(t => t + 1)
  }, [])

  const isModuleVoltooid = useCallback((moduleId) => {
    return localStorage.getItem(`module_${moduleId}_voltooid`) === 'true'
  }, [])

  const setModuleVoltooid = useCallback((moduleId) => {
    localStorage.setItem(`module_${moduleId}_voltooid`, 'true')
    setTick(t => t + 1)
  }, [])

  return { getLesVoortgang, setLesVoortgang, isModuleVoltooid, setModuleVoltooid }
}
