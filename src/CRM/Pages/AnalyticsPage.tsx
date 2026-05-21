import { MoreVertical, RotateCw, ArrowUp } from 'lucide-react'
import PageHeader from '../Components/PageHeader'

// Helper component for the metric cards matching Zoho style
function ZohoMetricCard({ 
  title, 
  value, 
  trend, 
  trendPositive = true, 
  footer 
}: { 
  title: string, 
  value: string | number, 
  trend?: string, 
  trendPositive?: boolean, 
  footer?: string 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative h-[140px]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          {title}
          <RotateCw className="h-3 w-3 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
        </h3>
        <MoreVertical className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors absolute top-4 right-4" />
      </div>
      
      <div className="flex items-end gap-3 flex-1">
        <div className="text-[26px] font-medium text-slate-800 leading-none">{value}</div>
        {trend && (
          <div className={`flex items-center text-[13px] font-bold mb-1 ${trendPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            <ArrowUp className="h-3 w-3 mr-0.5" /> {trend}
          </div>
        )}
      </div>

      {footer && (
        <div className="text-[12px] text-slate-500 mt-4 border-t border-slate-100 pt-3">
          {footer}
        </div>
      )}
    </div>
  )
}

// Custom SVG Gauge Chart
function LeadGaugeChart({ current, target }: { current: number, target: number }) {
  const radius = 120
  const stroke = 32
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * Math.PI
  const strokeDashoffset = circumference - (current / target) * circumference

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[320px]">
      <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-8">
        LEAD GENERATION TARGET - THIS YEAR
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <svg
          height={radius}
          width={radius * 2}
          className="overflow-visible"
        >
          {/* Background track */}
          <path
            stroke="#e2e8f0"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="butt"
            d={`M ${stroke},${radius} A ${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke},${radius}`}
          />
          {/* Progress track */}
          <path
            stroke="#94a3b8" // Slate 400 for the dark gray progress
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            d={`M ${stroke},${radius} A ${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke},${radius}`}
          />
        </svg>
        
        {/* Labels positioned relative to the gauge */}
        <div className="absolute bottom-0 w-full flex justify-between px-8 translate-y-6">
          <span className="text-[12px] font-medium text-slate-600">0</span>
          <span className="text-[12px] font-medium text-slate-600">Target: {target}</span>
        </div>
        
        {/* Needle/Value indicator (simplified as text for clean look) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-[14px] font-bold text-slate-700">Remaining : {target - current}</div>
          {/* Mock needle line pointing to current */}
          <div 
            className="w-16 h-1 bg-slate-600 rounded-full origin-right mt-2 shadow-sm"
            style={{ transform: `rotate(${-180 + (current / target) * 180}deg) translateX(-100%)` }}
          />
        </div>
      </div>
    </div>
  )
}

// Custom Bullet Chart
function RevenueBulletChart() {
  const target = 10000
  const achieved = 700000
  // Since achieved > target in the screenshot, we'll cap the visual bar width at 100% or scale appropriately.
  // In the screenshot, the bar goes up to ~80% of the container, labeled 700,000, while target is 10,000.
  // It seems the axis goes from 0 to 900,000. Let's scale based on a max of 900,000.
  const maxScale = 900000
  const targetPct = (target / maxScale) * 100
  const achievedPct = (achieved / maxScale) * 100

  const axisLabels = [0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[320px]">
      <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-8">
        REVENUE TARGET - THIS YEAR
      </h3>
      
      <div className="flex-1 flex flex-col justify-center px-4 relative mt-10">
        <div className="relative h-[80px] w-full flex items-center">
          {/* Background Bar */}
          <div className="absolute w-full h-[60px] bg-slate-100 rounded-sm" />
          
          {/* Achieved Bar (Green) */}
          <div 
            className="absolute h-[40px] bg-[#a7f3d0] rounded-sm flex items-center justify-center transition-all duration-1000 z-10"
            style={{ width: `${achievedPct}%` }}
          >
            <span className="text-[13px] font-medium text-slate-800 ml-4">
              Rs. {achieved.toLocaleString('en-IN')}.00
            </span>
          </div>

          {/* Target Line (Dark Vertical line) */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-20"
            style={{ left: `${targetPct}%` }}
          >
            <div className="absolute -top-6 left-2 whitespace-nowrap text-[11px] text-slate-600 font-medium">
              Target : Rs. {target.toLocaleString('en-IN')}.00
            </div>
          </div>
          
          {/* Label indicating this is Entire Org */}
          <div className="absolute -left-16 text-[11px] text-slate-500 font-medium">
            Entire Org
          </div>
        </div>

        {/* Axis */}
        <div className="relative h-6 mt-4 border-t border-slate-200 w-full">
          {axisLabels.map((val) => {
            const pct = (val / maxScale) * 100
            return (
              <div 
                key={val} 
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                <div className="h-1.5 w-px bg-slate-300" />
                <span className="text-[10px] text-slate-400 mt-1">{val}</span>
              </div>
            )
          })}
        </div>
        
        <div className="text-center text-[12px] font-medium text-slate-600 mt-6">
          Sum of Amount
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <div className="w-2.5 h-2.5 bg-[#a7f3d0] rounded-sm" /> Achieved
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 space-y-6 bg-slate-50 min-h-full">
      <PageHeader
        eyebrow="Reports"
        title="Analytics"
        subtitle="Track organization overview, leads, revenue, and targets."
      />

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ZohoMetricCard 
          title="LEADS THIS MONTH"
          value="10"
          trend="100%"
          footer="Last Month Relative: 0"
        />
        <ZohoMetricCard 
          title="REVENUE THIS MONTH"
          value="Rs. 35,000.00"
          trend="100%"
          footer="Last Month Relative: 0"
        />
        <ZohoMetricCard 
          title="DEALS IN PIPELINE"
          value="8"
        />
        <ZohoMetricCard 
          title="ACCOUNTS THIS MONTH"
          value="10"
          trend="100%"
          footer="Last Month Relative: 0"
        />
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LeadGaugeChart current={10} target={1000} />
        <RevenueBulletChart />
      </div>
    </div>
  )
}


