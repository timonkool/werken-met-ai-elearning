import React from 'react'

export default function LesBlok({ les }) {
  if (!les) return null

  return (
    <article style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>{les.titel}</h2>
    </article>
  )
}
