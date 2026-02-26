import { TrendingUp, DollarSign, CheckCircle, Info } from 'lucide-react';

export default function CommissionInfoPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Commission Info</h1>
        <p className="text-richpay-muted text-sm mt-0.5">Your earnings and commission structure</p>
      </div>

      {/* Hero Commission Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-richpay-primary via-richpay-darker to-richpay-accent rounded-2xl p-8 border border-richpay-accent/30 shadow-2xl shadow-richpay-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <TrendingUp size={40} className="text-white" />
          </div>
          <div>
            <p className="text-white/70 text-sm uppercase tracking-widest font-medium mb-2">Your Commission Rate</p>
            <h2 className="text-6xl font-black text-white drop-shadow-lg">30%</h2>
            <p className="text-white/90 text-xl font-bold mt-2">Commission on all Savings Accounts</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Info size={18} className="text-richpay-accent" />
            How It Works
          </h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-richpay-muted text-sm leading-relaxed">
            As a Rich Pay employee, you earn a <span className="text-richpay-accent font-semibold">30% commission</span> on
            every Savings Account you successfully submit and get approved by the admin. This is our way of rewarding
            your contribution to growing our banking network.
          </p>

          <div className="flex flex-col gap-3 mt-2">
            {[
              {
                icon: DollarSign,
                title: 'Submit a Savings Account',
                desc: 'Add a new Savings Account via the "Add Bank Account" section with all required details.',
              },
              {
                icon: CheckCircle,
                title: 'Get Admin Approval',
                desc: 'The admin reviews your submission. Once approved, your commission is calculated automatically.',
              },
              {
                icon: TrendingUp,
                title: 'Earn 30% Commission',
                desc: 'You receive 30% commission on the approved Savings Account. Current accounts are not eligible.',
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 bg-richpay-darker border border-richpay-border/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-richpay-primary/20 border border-richpay-primary/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-richpay-accent" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{step.title}</p>
                    <p className="text-richpay-muted text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
        <h3 className="text-amber-400 font-semibold text-sm flex items-center gap-2 mb-3">
          <Info size={16} />
          Important Notes
        </h3>
        <ul className="flex flex-col gap-2">
          {[
            'Commission applies only to Savings Accounts, not Current Accounts.',
            'Accounts must be approved by the admin to qualify for commission.',
            'Rejected accounts do not earn any commission.',
            'Contact your admin for any commission-related queries.',
          ].map((note, idx) => (
            <li key={idx} className="text-amber-300/80 text-xs flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
