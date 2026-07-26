/**
 * Export the tutor's student list as CSV or PDF.
 *
 * CSV is generated entirely client-side from the store data.
 * PDF uses the already-installed jspdf library.
 */

import { jsPDF } from 'jspdf'
import type { TutorMyStudent } from '@/types/tutorMyStudents'

// ── Helpers ──

function safe(val: unknown): string {
  if (val == null || val === '') return '—'
  return String(val)
}

function escapeCSV(val: string): string {
  if (/[",\n\r]/.test(val)) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

function formatDate(date?: string | null): string {
  if (!date) return '—'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return safe(date)
  }
}

function formatFollowupDate(
  followup: { date_label?: string; time_label?: string } | null | undefined,
): string {
  if (!followup?.date_label) return '—'
  return `${followup.date_label}${followup.time_label ? ` ${followup.time_label}` : ''}`
}

function formatStatus(status?: string): string {
  return status || '—'
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

// ── CSV Export ──

export function exportStudentsCSV(students: TutorMyStudent[]): void {
  const headers = [
    'Student Name',
    'Student Code',
    'Email',
    'Phone',
    'Company',
    'Position',
    'Status',
    'Worklogs',
    'Open Issues',
    'Latest Worklog',
    'Next Follow-up',
    'Feedback Given',
  ]

  const rows = students.map((s) => [
    safe(s.name),
    safe(s.student_code),
    safe(s.email),
    safe(s.phone),
    safe(s.company_name),
    safe(s.position),
    formatStatus(s.assignment_status),
    String(s.total_worklogs ?? 0),
    String(s.open_issues_count ?? 0),
    formatDate(s.last_worklog_at),
    formatFollowupDate(s.next_followup),
    s.feedback_given ? 'Yes' : 'No',
  ])

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\r\n')

  // BOM for Excel compatibility
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `my_students_${new Date().toISOString().slice(0, 10)}.csv`)
}

// ── PDF Export ──

export function exportStudentsPDF(students: TutorMyStudent[]): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })
  const internal = doc.internal
  const pageW = internal?.pageSize.getWidth() ?? 595.28
  const pageH = internal?.pageSize.getHeight() ?? 841.89
  const m = 50
  const contentW = pageW - m * 2

  let y = m
  let pageNum = 1

  // ── Footer on every page ──
  function drawFooter(): void {
    doc.setDrawColor(200, 200, 210)
    doc.line(m, pageH - 30, pageW - m, pageH - 30)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(160, 160, 170)
    doc.text('My Students Report  ·  Internship Follow-up System', m, pageH - 16)
    doc.text(`Page ${pageNum}`, pageW - m, pageH - 16, { align: 'right' })
  }

  // ── Auto page break ──
  function checkSpace(needed: number): void {
    if (y + needed > pageH - 45) {
      drawFooter()
      doc.addPage()
      pageNum++
      y = m
    }
  }

  // ═══════════════════════════════════════════════
  //  HEADER
  // ═══════════════════════════════════════════════

  // Purple accent bar
  doc.setFillColor(79, 70, 229)
  doc.rect(m, y, 36, 4, 'F')
  y += 16

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(17, 24, 39)
  doc.text('My Students', m, y)
  y += 13

  // Subtitle
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 110)
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`Generated ${dateStr}  ·  ${students.length} student(s) assigned to you`, m, y)
  y += 26

  // ═══════════════════════════════════════════════
  //  TABLE
  // ═══════════════════════════════════════════════

  const cols = [
    { label: 'Student', ratio: 0.20 },
    { label: 'Code', ratio: 0.10 },
    { label: 'Email', ratio: 0.20 },
    { label: 'Company', ratio: 0.15 },
    { label: 'Status', ratio: 0.09 },
    { label: 'Worklogs', ratio: 0.08 },
    { label: 'Issues', ratio: 0.08 },
    { label: 'Follow-up', ratio: 0.10 },
  ]
  const colW = cols.map((c) => contentW * c.ratio)

  const purpleLight = [237, 235, 254] as const
  const purple = [79, 70, 229] as const
  const grayBg = [248, 249, 250] as const
  const grayLine = [226, 232, 240] as const
  const darkText = [30, 41, 59] as const

  // ── Header Row ──
  checkSpace(28)
  doc.setFillColor(...purpleLight)
  doc.rect(m, y, contentW, 24, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...purple)
  let cx = m + 8
  cols.forEach((c, i) => {
    doc.text(c.label.toUpperCase(), cx, y + 15)
    cx += colW[i]!
  })
  y += 30

  // ── Body Rows ──
  for (let rowIdx = 0; rowIdx < students.length; rowIdx++) {
    const s = students[rowIdx]!
    const rowH = 24
    checkSpace(rowH + 4)

    // Alternating row background
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...grayBg)
      doc.rect(m, y - 5, contentW, rowH, 'F')
    }

    // Subtle bottom border
    doc.setDrawColor(...grayLine)
    doc.line(m, y + rowH - 5, pageW - m, y + rowH - 5)

    const vals = [
      safe(s.name).slice(0, 26),
      safe(s.student_code).slice(0, 12),
      safe(s.email).slice(0, 28),
      safe(s.company_name).slice(0, 20),
      formatStatus(s.assignment_status).slice(0, 12),
      String(s.total_worklogs ?? 0),
      String(s.open_issues_count ?? 0),
      formatFollowupDate(s.next_followup).slice(0, 14),
    ]

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...darkText)
    cx = m + 8
    vals.forEach((v, i) => {
      doc.text(v, cx, y + 7)
      cx += colW[i]!
    })

    y += rowH
  }

  // ── Last Page Footer ──
  drawFooter()

  doc.save(`my_students_${new Date().toISOString().slice(0, 10)}.pdf`)
}
