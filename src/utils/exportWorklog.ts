/**
 * Export a worklog review record as PDF, Word (.doc) or Excel (.xls).
 * Pure client-side generation — no backend endpoint required.
 */
import { jsPDF } from 'jspdf'
import type { Worklog } from '@/types/worklog'

function safe(v: unknown): string {
  if (v == null || v === '') return '—'
  return String(v)
}

function fmtDate(d?: string): string {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return safe(d)
  return (
    dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' +
    dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  )
}

function baseFilename(w: Worklog): string {
  const name = (w.student?.name || 'worklog').toString().replace(/[^\w-]+/g, '_')
  return `worklog_${w.id}_week${w.week_number}_${name}`
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** ---------------- PDF ---------------- */
export function exportWorklogPDF(w: Worklog): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 40
  const contentW = pageW - margin * 2
  let y = margin

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage()
      y = margin
    }
  }

  const header = (t: string) => {
    ensure(34)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text(t, margin, y)
    y += 7
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, y, pageW - margin, y)
    y += 16
  }

  const label = (l: string, val: string) => {
    ensure(22)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(130, 140, 160)
    doc.text(l.toUpperCase(), margin, y)
    y += 13
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30, 41, 59)
    const lines = doc.splitTextToSize(val || '—', contentW)
    doc.text(lines, margin, y)
    y += lines.length * 14 + 7
  }

  // Top title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(30, 41, 59)
  doc.text('Worklog Review', margin, y)
  y += 22
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(130, 140, 160)
  doc.text(`Exported ${new Date().toLocaleString()}`, margin, y)
  y += 22

  header('Student Information')
  label('Name', w.student?.name || '')
  label('Email', w.student?.email || '')
  label('Phone', w.student?.phone || '')
  if (w.student?.company_name) label('Company', w.student.company_name)
  if (w.student?.position || w.student?.internship_position)
    label('Position', w.student.position || w.student.internship_position || '')

  header('Worklog Information')
  label('Worklog ID', String(w.id))
  label('Week', String(w.week_number))
  label('Submitted', fmtDate(w.submission_date || w.submitted_at || w.created_at))
  label('Status', w.status)

  header('Content')
  label('Description', w.description)
  if (w.challenges) label('Challenges', w.challenges)

  const atts = w.attachments || []
  if (atts.length) {
    header('Attachments')
    atts.forEach((a) => {
      label(a.filename || a.file_path || 'attachment', a.url || '(no download link)')
    })
  }

  if (w.tutor_review) {
    header('Tutor Review')
    label('Status', w.tutor_review.status || '')
    if (w.tutor_review.tutor_name) label('Reviewed By', w.tutor_review.tutor_name)
    label('Reviewed At', fmtDate(w.tutor_review.reviewed_at))
    if (w.tutor_review.feedback) label('Feedback', w.tutor_review.feedback)
  }

  doc.save(`${baseFilename(w)}.pdf`)
}

/** ---------------- Word (.doc) ---------------- */
export function exportWorklogWord(w: Worklog): void {
  const atts = (w.attachments || [])
    .map(
      (a) =>
        `<li><a href="${safe(a.url).replace(/"/g, '&quot;')}">${safe(
          a.filename || a.file_path,
        )}</a></li>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Worklog Review</title></head>
<body>
  <h1 style="color:#1e293b;font-family:Calibri,sans-serif;">Worklog Review</h1>
  <p style="color:#64748b;font-family:Calibri,sans-serif;font-size:11px;">Exported ${new Date().toLocaleString()}</p>

  <h2 style="color:#1e293b;font-family:Calibri,sans-serif;">Student Information</h2>
  <table style="font-family:Calibri,sans-serif;font-size:12px;border-collapse:collapse;width:100%;">
    <tr><td style="font-weight:bold;padding:4px 8px;width:160px;">Name</td><td style="padding:4px 8px;">${safe(
      w.student?.name,
    )}</td></tr>
    <tr><td style="font-weight:bold;padding:4px 8px;">Email</td><td style="padding:4px 8px;">${safe(
      w.student?.email,
    )}</td></tr>
    <tr><td style="font-weight:bold;padding:4px 8px;">Phone</td><td style="padding:4px 8px;">${safe(
      w.student?.phone,
    )}</td></tr>
    ${
      w.student?.company_name
        ? `<tr><td style="font-weight:bold;padding:4px 8px;">Company</td><td style="padding:4px 8px;">${safe(
            w.student.company_name,
          )}</td></tr>`
        : ''
    }
  </table>

  <h2 style="color:#1e293b;font-family:Calibri,sans-serif;">Worklog Information</h2>
  <table style="font-family:Calibri,sans-serif;font-size:12px;border-collapse:collapse;width:100%;">
    <tr><td style="font-weight:bold;padding:4px 8px;width:160px;">Worklog ID</td><td style="padding:4px 8px;">${safe(
      w.id,
    )}</td></tr>
    <tr><td style="font-weight:bold;padding:4px 8px;">Week</td><td style="padding:4px 8px;">${safe(
      w.week_number,
    )}</td></tr>
    <tr><td style="font-weight:bold;padding:4px 8px;">Submitted</td><td style="padding:4px 8px;">${fmtDate(
      w.submission_date || w.submitted_at || w.created_at,
    )}</td></tr>
    <tr><td style="font-weight:bold;padding:4px 8px;">Status</td><td style="padding:4px 8px;">${safe(
      w.status,
    )}</td></tr>
  </table>

  <h2 style="color:#1e293b;font-family:Calibri,sans-serif;">Content</h2>
  <p style="font-family:Calibri,sans-serif;font-size:12px;"><strong>Description:</strong><br/>${safe(
    w.description,
  ).replace(/\n/g, '<br/>')}</p>
  ${
    w.challenges
      ? `<p style="font-family:Calibri,sans-serif;font-size:12px;"><strong>Challenges:</strong><br/>${safe(
          w.challenges,
        ).replace(/\n/g, '<br/>')}</p>`
      : ''
  }

  ${
    atts
      ? `<h2 style="color:#1e293b;font-family:Calibri,sans-serif;">Attachments</h2><ul style="font-family:Calibri,sans-serif;font-size:12px;">${atts}</ul>`
      : ''
  }

  ${
    w.tutor_review
      ? `<h2 style="color:#1e293b;font-family:Calibri,sans-serif;">Tutor Review</h2>
  <table style="font-family:Calibri,sans-serif;font-size:12px;border-collapse:collapse;width:100%;">
    <tr><td style="font-weight:bold;padding:4px 8px;width:160px;">Status</td><td style="padding:4px 8px;">${safe(
      w.tutor_review.status,
    )}</td></tr>
    ${
      w.tutor_review.tutor_name
        ? `<tr><td style="font-weight:bold;padding:4px 8px;">Reviewed By</td><td style="padding:4px 8px;">${safe(
            w.tutor_review.tutor_name,
          )}</td></tr>`
        : ''
    }
    <tr><td style="font-weight:bold;padding:4px 8px;">Reviewed At</td><td style="padding:4px 8px;">${fmtDate(
      w.tutor_review.reviewed_at,
    )}</td></tr>
    ${
      w.tutor_review.feedback
        ? `<tr><td style="font-weight:bold;padding:4px 8px;vertical-align:top;">Feedback</td><td style="padding:4px 8px;">${safe(
            w.tutor_review.feedback,
          ).replace(/\n/g, '<br/>')}</td></tr>`
        : ''
    }
  </table>`
      : ''
  }
</body>
</html>`

  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  downloadBlob(blob, `${baseFilename(w)}.doc`)
}

/** ---------------- Excel (.xls via HTML table) ---------------- */
export function exportWorklogExcel(w: Worklog): void {
  const atts = (w.attachments || []).map((a) => safe(a.filename || a.file_path)).join('; ')

  const rows: Array<[string, string]> = [
    ['Worklog Review', ''],
    ['Exported', new Date().toLocaleString()],
    ['', ''],
    ['Student Information', ''],
    ['Name', safe(w.student?.name)],
    ['Email', safe(w.student?.email)],
    ['Phone', safe(w.student?.phone)],
    ['Company', safe(w.student?.company_name)],
    ['', ''],
    ['Worklog Information', ''],
    ['Worklog ID', safe(w.id)],
    ['Week', safe(w.week_number)],
    ['Submitted', fmtDate(w.submission_date || w.submitted_at || w.created_at)],
    ['Status', safe(w.status)],
    ['', ''],
    ['Content', ''],
    ['Description', safe(w.description)],
    ['Challenges', safe(w.challenges)],
    ['', ''],
    ['Attachments', atts || '—'],
    ['', ''],
    ['Tutor Review', ''],
    ['Status', safe(w.tutor_review?.status)],
    ['Reviewed By', safe(w.tutor_review?.tutor_name)],
    ['Reviewed At', fmtDate(w.tutor_review?.reviewed_at)],
    ['Feedback', safe(w.tutor_review?.feedback)],
  ]

  const cell = (v: string) =>
    `<td style="border:1px solid #e2e8f0;padding:4px 8px;font-family:Calibri,sans-serif;font-size:12px;mso-number-format:\\@;">${v
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</td>`
  const sectionCell = (v: string) =>
    `<td colspan="2" style="border:1px solid #e2e8f0;padding:4px 8px;font-family:Calibri,sans-serif;font-size:13px;font-weight:bold;background:#f1f5f9;mso-number-format:\\@;">${v}</td>`

  const body = rows
    .map(([a, b]) =>
      a && b === '' && (a === 'Student Information' || a === 'Worklog Information' || a === 'Content' || a === 'Attachments' || a === 'Tutor Review' || a === 'Worklog Review')
        ? `<tr>${sectionCell(a)}</tr>`
        : `<tr>${cell(a)}${cell(b)}</tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table>${body}</table></body></html>`

  const blob = new Blob(['﻿', html], { type: 'application/vnd.ms-excel' })
  downloadBlob(blob, `${baseFilename(w)}.xls`)
}
