import { MOCK_STAFF } from '@/lib/mock-data'

/** Organisation-wide payroll line (finance & super-admin view). Demo: March 2026. */
export type PayrollRosterEntry = {
  id: string
  email: string
  name: string
  roleLabel: string
  grossSalary: number
  deductions: number
  netPay: number
  periodLabel: string
}

const PERIOD = 'March 2026'

/** Synthetic leadership & back-office rows not in `MOCK_STAFF`. */
const EXEC_PAYROLL: PayrollRosterEntry[] = [
  {
    id: 'exec-sa',
    email: 'admin@ezracenter.com',
    name: 'Ezra Center Administrator',
    roleLabel: 'Super Admin',
    grossSalary: 285000,
    deductions: 71200,
    netPay: 213800,
    periodLabel: PERIOD,
  },
  {
    id: 'exec-fin',
    email: 'finance@ezracenter.com',
    name: 'Finance Desk',
    roleLabel: 'Finance',
    grossSalary: 125000,
    deductions: 32800,
    netPay: 92200,
    periodLabel: PERIOD,
  },
]

function staffSalaryBand(id: string, role: string): { gross: number; ded: number } {
  if (role === 'MANAGER') {
    const mult = id === 'st-002' ? 1.08 : 1
    return { gross: Math.round(195000 * mult), ded: Math.round(52000 * mult) }
  }
  const base = 52000 + (id.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 18000)
  return { gross: base, ded: Math.round(base * 0.26) }
}

export function getPayrollRoster(): PayrollRosterEntry[] {
  const fromStaff: PayrollRosterEntry[] = MOCK_STAFF.map((s) => {
    const { gross, ded } = staffSalaryBand(s.id, s.role)
    return {
      id: s.id,
      email: s.email,
      name: s.name,
      roleLabel: s.role === 'MANAGER' ? 'Manager' : 'Staff',
      grossSalary: gross,
      deductions: ded,
      netPay: gross - ded,
      periodLabel: PERIOD,
    }
  })

  const merged = [...EXEC_PAYROLL, ...fromStaff]
  merged.sort((a, b) => b.grossSalary - a.grossSalary)
  return merged
}

export function getPayrollTotals(rows: PayrollRosterEntry[]) {
  return rows.reduce(
    (acc, r) => ({
      gross: acc.gross + r.grossSalary,
      deductions: acc.deductions + r.deductions,
      net: acc.net + r.netPay,
    }),
    { gross: 0, deductions: 0, net: 0 }
  )
}

export type PayslipLine = { label: string; amount: number }

export type PayslipDetail = {
  id: string
  employeeEmail: string
  employeeName: string
  jobTitle: string
  period: string
  payDate: string
  earnings: PayslipLine[]
  deductions: PayslipLine[]
  gross: number
  totalDeductions: number
  net: number
}

function buildPayslipFromRoster(entry: PayrollRosterEntry): PayslipDetail {
  const gross = entry.grossSalary
  const d = entry.deductions
  const paye = Math.round(d * 0.5)
  const nhif = Math.round(d * 0.15)
  const nssf = Math.round(d * 0.2)
  const housing = d - paye - nhif - nssf
  const basic = Math.round(gross * 0.75)
  const allowances = gross - basic

  return {
    id: `ps-${entry.id}-${entry.periodLabel.replace(/\s/g, '-')}`,
    employeeEmail: entry.email,
    employeeName: entry.name,
    jobTitle: entry.roleLabel,
    period: entry.periodLabel,
    payDate: '2026-03-28',
    earnings: [
      { label: 'Basic salary', amount: basic },
      { label: 'Allowances & service pay', amount: allowances },
    ],
    deductions: [
      { label: 'PAYE', amount: paye },
      { label: 'NHIF', amount: nhif },
      { label: 'NSSF (Tier I & II)', amount: nssf },
      { label: 'Housing levy', amount: housing },
    ],
    gross,
    totalDeductions: d,
    net: entry.netPay,
  }
}

/** Last few months of payslips for an employee (demo repeats March figures with small variance). */
export function getPayslipsForEmail(email: string): PayslipDetail[] {
  const e = email.trim().toLowerCase()
  const roster = getPayrollRoster()
  const row = roster.find((r) => r.email.toLowerCase() === e)
  if (!row) return []

  const base = buildPayslipFromRoster(row)
  const months = [
    { period: 'March 2026', payDate: '2026-03-28', suffix: '03' },
    { period: 'February 2026', payDate: '2026-02-26', suffix: '02' },
    { period: 'January 2026', payDate: '2026-01-29', suffix: '01' },
  ]

  return months.map((m, i) => {
    const adj = 1 - i * 0.008
    const gross = Math.round(base.gross * adj)
    const ded = Math.round(base.totalDeductions * adj)
    const net = gross - ded
    const scale = (n: number) => Math.round(n * adj)
    const earnings = base.earnings.map((line) => ({ ...line, amount: scale(line.amount) }))
    const eSum = earnings.reduce((s, l) => s + l.amount, 0)
    if (eSum !== gross && earnings.length) {
      earnings[earnings.length - 1] = {
        ...earnings[earnings.length - 1],
        amount: earnings[earnings.length - 1].amount + (gross - eSum),
      }
    }
    const deductions = base.deductions.map((line) => ({ ...line, amount: scale(line.amount) }))
    const dSum = deductions.reduce((s, l) => s + l.amount, 0)
    if (dSum !== ded && deductions.length) {
      deductions[deductions.length - 1] = {
        ...deductions[deductions.length - 1],
        amount: deductions[deductions.length - 1].amount + (ded - dSum),
      }
    }
    return {
      ...base,
      id: `ps-${row.id}-${m.suffix}`,
      period: m.period,
      payDate: m.payDate,
      earnings,
      deductions,
      gross,
      totalDeductions: ded,
      net,
    }
  })
}
