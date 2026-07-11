// Genereert het certificaat als PDF (A4 liggend), visueel gebaseerd op
// context/Voorbeeld_certificaat.html: een donkere saliegroene zijbalk,
// een dun binnenkader en een hoofdvlak met naam, prestatietekst en datum.
// Alleen de naam en de datum zijn dynamisch, de rest ligt vast.
// jsPDF wordt pas geladen op het moment van downloaden, zodat de forse
// bibliotheek niet in de initiële bundle van de cursus zit.
export async function genereerCertificaatPdf(naam, certificaatData) {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = 297
  const pageH = 210

  const sageInk = [58, 74, 56]
  const sageDeep = [107, 128, 104]
  const sage = [139, 162, 135]
  const sageSoft = [200, 212, 196]
  const sageMist = [238, 242, 236]
  const cream = [250, 248, 244]
  const text = [45, 53, 44]
  const muted = [107, 114, 104]

  const bandW = 62

  // Achtergrond
  doc.setFillColor(...cream)
  doc.rect(0, 0, pageW, pageH, 'F')

  // ─── Donkere zijbalk ───────────────────────────────────────────
  doc.setFillColor(...sageInk)
  doc.rect(0, 0, bandW, pageH, 'F')

  // Icoon: cirkel met vinkje, bovenin de balk
  const iconCx = bandW / 2
  const iconCy = 26
  doc.setDrawColor(...sageSoft)
  doc.setLineWidth(0.4)
  doc.circle(iconCx, iconCy, 9, 'S')
  doc.setDrawColor(...cream)
  doc.setLineWidth(0.9)
  doc.line(iconCx - 4, iconCy, iconCx - 1, iconCy + 3.5)
  doc.line(iconCx - 1, iconCy + 3.5, iconCx + 4.5, iconCy - 3.5)

  // Verticale labeltekst in het midden van de balk
  doc.setTextColor(...sageMist)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('W E R K E N   M E T   A I', iconCx, pageH / 2, { angle: 90, align: 'center' })

  // Onderin de balk: website en jaar
  doc.setTextColor(...sageSoft)
  doc.setFontSize(8)
  doc.text('TIMONKOOL.NL', iconCx, pageH - 34, { angle: 90, align: 'center' })
  const jaar = String(new Date().getFullYear())
  doc.setTextColor(...sageSoft)
  doc.text(jaar, iconCx, pageH - 16, { align: 'center' })

  // ─── Diagonaal hoekaccent rechtsboven ──────────────────────────
  doc.setFillColor(...sageInk)
  doc.triangle(pageW - 34, 0, pageW, 0, pageW, 34, 'F')
  doc.setDrawColor(...cream)
  doc.setLineWidth(0.8)
  doc.line(pageW - 12, 9, pageW - 9, 12.5)
  doc.line(pageW - 9, 12.5, pageW - 4, 6)

  // ─── Binnenkader ────────────────────────────────────────────────
  const frameX = bandW + 5
  const frameY = 6
  const frameW = pageW - frameX - 6
  const frameH = pageH - 12
  doc.setDrawColor(...sageSoft)
  doc.setLineWidth(0.25)
  doc.rect(frameX, frameY, frameW, frameH, 'S')

  doc.setDrawColor(...sageDeep)
  doc.setLineWidth(0.5)
  // hoekje rechtsboven
  doc.line(frameX + frameW - 16, frameY + 4, frameX + frameW - 4, frameY + 4)
  doc.line(frameX + frameW - 4, frameY + 4, frameX + frameW - 4, frameY + 16)
  // hoekje rechtsonder
  doc.line(frameX + frameW - 16, frameY + frameH - 4, frameX + frameW - 4, frameY + frameH - 4)
  doc.line(frameX + frameW - 4, frameY + frameH - 4, frameX + frameW - 4, frameY + frameH - 16)

  // ─── Hoofdinhoud ────────────────────────────────────────────────
  const contentX = bandW + 14
  const contentR = pageW - 16

  // Bovenblok: eyebrow + titel
  doc.setTextColor(...sageDeep)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text(certificaatData.eyebrow.toUpperCase(), contentX, 24)

  doc.setTextColor(...sageInk)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(certificaatData.hoofdtitel, contentX, 33)

  doc.setDrawColor(221, 227, 218)
  doc.setLineWidth(0.3)
  doc.line(contentX, 38, contentR, 38)

  // Middenblok: bevestiging + naam + prestatietekst
  doc.setFont('times', 'italic')
  doc.setFontSize(12)
  doc.setTextColor(...muted)
  doc.text(certificaatData.bevestigt_regel, contentX, 56)

  const weergaveNaam = (naam || '').trim() || 'Naam van de deelnemer'
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.setTextColor(...sageInk)
  doc.text(weergaveNaam, contentX, 72)

  doc.setDrawColor(...sageDeep)
  doc.setLineWidth(1)
  doc.line(contentX, 76, contentX + 34, 76)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...text)
  const prestatieRegels = doc.splitTextToSize(certificaatData.prestatie_tekst, contentR - contentX)
  doc.text(prestatieRegels, contentX, 85)

  // Modulepillen
  let pillY = 85 + prestatieRegels.length * 5.6 + 6
  let pillX = contentX
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  certificaatData.modules_labels.forEach((label) => {
    const labelW = doc.getTextWidth(label)
    const pillW = labelW + 10
    if (pillX + pillW > contentR) {
      pillX = contentX
      pillY += 9
    }
    doc.setFillColor(...sageMist)
    doc.setDrawColor(...sageSoft)
    doc.setLineWidth(0.25)
    doc.roundedRect(pillX, pillY - 5.5, pillW, 8, 4, 4, 'FD')
    doc.setTextColor(...sageInk)
    doc.text(label, pillX + 5, pillY)
    pillX += pillW + 4
  })

  // Onderblok: handtekening, zegel, datum
  const bottomY = pageH - 24
  doc.setDrawColor(221, 227, 218)
  doc.setLineWidth(0.3)
  doc.line(contentX, bottomY - 12, contentR, bottomY - 12)

  doc.setDrawColor(...sageSoft)
  doc.setLineWidth(0.3)
  doc.line(contentX, bottomY - 4, contentX + 24, bottomY - 4)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...sageInk)
  doc.text(certificaatData.handtekening_naam, contentX, bottomY + 2)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...muted)
  doc.text(certificaatData.handtekening_rol, contentX, bottomY + 7)

  // Zegel in het midden
  const sealCx = contentX + (contentR - contentX) / 2
  doc.setFillColor(...sageMist)
  doc.setDrawColor(...sageDeep)
  doc.setLineWidth(0.5)
  doc.circle(sealCx, bottomY - 4, 7, 'FD')
  doc.setDrawColor(...sageInk)
  doc.setLineWidth(0.7)
  doc.line(sealCx - 3, bottomY - 4, sealCx - 1, bottomY - 1.5)
  doc.line(sealCx - 1, bottomY - 1.5, sealCx + 3.5, bottomY - 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...muted)
  doc.text('VOLTOOID', sealCx, bottomY + 8, { align: 'center' })

  // Datum rechts
  const datumTekst = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...muted)
  doc.text('DATUM', contentR, bottomY - 4, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...sageInk)
  doc.text(datumTekst, contentR, bottomY + 2, { align: 'right' })

  return doc
}

// Genereert het certificaat en start direct de download, met een
// bestandsnaam op basis van de deelnemersnaam. Gedeeld door het
// certificaatscherm en de "Download opnieuw"-knop op het eindscherm.
export async function downloadCertificaat(naam, certificaatData) {
  const doc = await genereerCertificaatPdf(naam, certificaatData)
  doc.save(`certificaat-werken-met-ai-${naam.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
