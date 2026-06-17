import React from 'react'

// De signature "kleurwissel-kop" uit het Saliegroen-designsysteem.
// Een grote titel op de naad tussen een groene band en cream: witte letters
// in het groen, een zachte groen-op-groen overlap, daaronder groene letters
// op cream. Eén `size`-waarde stuurt alle verhoudingen via calc(), zodat de
// clip nooit kan verschuiven. `size` mag een getal (px) of een CSS-lengte zijn
// (bv. een clamp() voor responsieve schaling).
//
// Props:
// - children   de koptekst (houd het bij één korte regel)
// - eyebrow     klein uppercase label in de groene band
// - size        font-size; stuurt alle verhoudingen. Houd >= 32px. Default 64.
// - as          kop-tag ('h1' | 'h2' | 'h3'). Default 'h1'.
// - align       'left' | 'center'. Default 'left'.
export default function ColorSwitchKop({
  children,
  eyebrow,
  meta,
  size = 64,
  split = 57.0,
  bandShift = 0.667,
  as: Tag = 'h1',
  bandColor = 'var(--sage-deep)',
  greenColor = 'var(--sage-deep)',
  whiteColor = 'var(--cream)',
  cream = 'var(--cream)',
  align = 'left',
  style,
  ...rest
}) {
  const px = (v) => (typeof v === 'number' ? `${v}px` : v)
  const bandH = `calc(${px(size)} * 1.5)`
  const padX = `calc(${px(size)} * 0.36)`

  const bandInhoud =
    eyebrow || meta ? (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: meta
            ? 'space-between'
            : align === 'center'
            ? 'center'
            : 'flex-start',
          gap: 16,
          width: '100%',
        }}
      >
        {eyebrow ? (
          <span className="label" style={{ color: 'var(--sage-soft)', display: 'block' }}>
            {eyebrow}
          </span>
        ) : <span />}
        {meta ? (
          <span
            className="label"
            style={{ color: 'var(--sage-soft)', opacity: 0.85, display: 'block' }}
          >
            {meta}
          </span>
        ) : null}
      </div>
    ) : null

  const textBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 0,
    width: '100%',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: px(size),
    lineHeight: 1, // CRUCIAAL — houdt glyphs gecentreerd zodat de clip klopt
    letterSpacing: 'var(--ls-display)',
    whiteSpace: 'nowrap',
    textAlign: align,
  }

  return (
    <div style={{ background: cream, paddingBottom: `calc(${px(size)} * 0.4)`, ...style }} {...rest}>
      <div
        style={{
          background: bandColor,
          height: bandH,
          padding: `0 ${padX}`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {bandInhoud}
      </div>
      <div
        style={{
          position: 'relative',
          height: px(size),
          margin: `calc(${px(size)} * ${-bandShift}) ${padX} 0`,
        }}
      >
        <Tag
          aria-hidden="true"
          style={{ ...textBase, color: whiteColor, clipPath: `inset(0 0 ${100 - split}% 0)` }}
        >
          {children}
        </Tag>
        <Tag style={{ ...textBase, color: greenColor, clipPath: `inset(${split}% 0 0 0)` }}>
          {children}
        </Tag>
      </div>
    </div>
  )
}
