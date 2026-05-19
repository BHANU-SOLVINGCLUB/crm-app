import { Search, X, BookOpen, MessageSquare, ExternalLink, PlayCircle, FileText } from 'lucide-react'

export default function HelpSupportDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 border-l border-line"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-slate-50">
          <h2 className="font-semibold text-slate-800 text-[16px]">Help & Support</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="p-6 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles and guides..."
                className="w-full rounded-lg pl-9 pr-4 py-2.5 text-[13.5px] border border-line bg-slate-50 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-6 py-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Popular Topics</h3>
            <div className="space-y-2">
              {[
                { icon: PlayCircle, title: 'Getting Started Guide', desc: 'Learn the basics in 5 minutes' },
                { icon: BookOpen, title: 'Managing the Sales Pipeline', desc: 'How to move deals to won' },
                { icon: FileText, title: 'Invoicing & Payments', desc: 'Setting up your finance module' },
              ].map((item, i) => (
                <button key={i} className="w-full text-left p-3 rounded-xl border border-line hover:border-brand-blue/30 hover:bg-blue-50/30 transition-all flex items-start gap-3 group">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-brand-blue transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-slate-800 group-hover:text-brand-blue">{item.title}</div>
                    <div className="text-[12px] text-slate-500">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="p-6 border-t border-line">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Need more help?</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-line">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-[14px]">Contact Support</div>
                  <div className="text-[12px] text-slate-500">We typically reply within 2 hours.</div>
                </div>
              </div>
              <button className="w-full py-2 bg-white border border-line rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                Submit a Ticket
              </button>
            </div>
          </div>
          
          <div className="px-6 pb-6">
             <a href="#" className="flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-brand-blue hover:underline">
               Visit Community Forum <ExternalLink className="h-3 w-3" />
             </a>
          </div>
        </div>
      </div>
    </>
  )
}
