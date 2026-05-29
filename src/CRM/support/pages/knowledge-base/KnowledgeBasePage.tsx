import { Search, Video } from 'lucide-react'
import { useMemo, useState } from 'react'
import { articles } from '../../services/mockSupportData'
import { formatSupportDate } from '../../utils/formatters'

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('')

  const rows = useMemo(() => articles.filter((article) => {
    const q = query.toLowerCase()
    return article.title.toLowerCase().includes(q) || article.category.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q)
  }), [query])

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-9" placeholder="Search articles, FAQs, or categories" />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {rows.map((article) => (
          <section key={article.id} className="card p-5">
            <div className="chip">{article.category}</div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{article.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{article.views} views</span>
              <span>Updated {formatSupportDate(article.updatedAt)}</span>
            </div>
          </section>
        ))}

        <section className="card p-5">
          <div className="icon-tile bg-slate-100 text-slate-700">
            <Video className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Video tutorial placeholders</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Space reserved for guided setup videos, account admin walkthroughs, and product troubleshooting clips.</p>
        </section>
      </div>
    </div>
  )
}
