import { BotMessageSquare, Send } from 'lucide-react'
import { conversationThreads } from '../../services/mockSupportData'
import { formatSupportDateTime } from '../../utils/formatters'
import { pushAppToast } from '../../../store/uiStore'

export default function CustomerConversationsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr] fade-up">
      <section className="card overflow-hidden">
        <div className="border-b border-theme px-5 py-4">
          <h3 className="text-lg font-semibold text-theme-primary">Unified inbox</h3>
        </div>
        <div className="divide-y divide-line">
          {conversationThreads.map((thread) => (
            <button key={thread.id} className="w-full px-5 py-4 text-left transition hover:bg-theme-surface">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-theme-primary">{thread.customer}</div>
                {thread.unread > 0 && <span className="rounded-full bg-brand-blue px-2 py-0.5 text-[11px] font-semibold text-white">{thread.unread}</span>}
              </div>
              <div className="mt-1 text-xs text-theme-secondary">{thread.channel} • {thread.subject}</div>
              <div className="mt-2 text-sm text-theme-secondary">{thread.lastMessage}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between gap-3 border-b border-theme pb-4">
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">{conversationThreads[0].subject}</h3>
            <p className="mt-1 text-sm text-theme-secondary">{conversationThreads[0].customer} • {formatSupportDateTime(conversationThreads[0].updatedAt)}</p>
          </div>
          <div className="chip">{conversationThreads[0].channel}</div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl bg-theme-surface p-4 text-sm text-theme-primary">{conversationThreads[0].lastMessage}</div>
          <div className="rounded-2xl border border-dashed border-brand-blue/20 bg-blue-50/60 p-4 text-sm text-theme-primary">
            <div className="flex items-start gap-3">
              <BotMessageSquare className="mt-0.5 h-4 w-4 text-brand-blue" />
              <span>AI suggestion placeholder: reassure the customer, explain current findings, and give a clear next update time.</span>
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-theme bg-theme-surface p-4">
          <textarea className="input min-h-[120px] resize-none" placeholder="Reply across email, chat, WhatsApp, SMS, or phone note channels..." />
          <div className="mt-3 flex items-center justify-between gap-2">
            <button className="btn-ghost" onClick={() => pushAppToast('Response template browser opened.', 'success')}>Templates</button>
            <button className="btn-primary" onClick={() => pushAppToast('Reply queued in unified inbox.', 'success')}>
              <Send className="h-4 w-4" /> Send reply
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
