interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-200/90 pb-5 mb-8">
      <div className="min-w-0">
        <h1 className="text-[1.375rem] font-semibold text-slate-900 tracking-tight leading-snug">{title}</h1>
        {subtitle && <p className="text-[13px] text-slate-600 mt-1.5 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0 flex flex-wrap gap-2 sm:justify-end">{actions}</div>}
    </div>
  )
}
