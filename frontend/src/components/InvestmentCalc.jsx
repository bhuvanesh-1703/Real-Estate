import React, { useState, useMemo } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function InvestmentCalc() {
  const [propertyPrice, setPropertyPrice] = useState(7500000); // 75L
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // 20%
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years
  const [expectedRent, setExpectedRent] = useState(25000); // 25k/mo

  const calculations = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    let emi = 0;
    if (monthlyRate > 0) {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      emi = loanAmount / totalMonths;
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    const annualRent = expectedRent * 12;
    const grossRentalYield = ((annualRent / propertyPrice) * 100).toFixed(2);

    return {
      downPayment,
      loanAmount,
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      annualRent,
      grossRentalYield,
      totalCost: Math.round(downPayment + totalPayment)
    };
  }, [propertyPrice, downPaymentPercent, interestRate, tenureYears, expectedRent]);

  const pieData = [
    { name: 'Principal Loan', value: calculations.loanAmount },
    { name: 'Down Payment', value: calculations.downPayment },
    { name: 'Total Interest', value: calculations.totalInterest }
  ];

  const COLORS = ['#38BDF8', '#3B82F6', '#6366F1'];

  return (
    <section id="calculator" className="py-24 bg-[#0F172A] blueprint-grid relative text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 px-3.5 py-1 rounded-full text-xs font-mono font-semibold text-sky-400 border border-sky-500/30">
            <Calculator className="w-3.5 h-3.5" />
            FINANCIAL INTELLIGENCE
          </div>
          <h2 className="font-serif-fraunces text-3xl sm:text-5xl font-extrabold text-white">
            Real Estate Investment & EMI Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Simulate loan cashflows, rental yield rates, and capital appreciation potential before committing capital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-6 bg-[#1E293B]/80">
            <h3 className="font-serif-fraunces text-lg font-bold text-white border-b border-slate-800 pb-4">
              Financial Assumptions
            </h3>

            {/* Property Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="text-slate-300 font-medium">Property Price</label>
                <span className="font-bold text-sky-400">₹{(propertyPrice / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="30000000"
                step="500000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Down Payment % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="text-slate-300 font-medium">Down Payment ({downPaymentPercent}%)</label>
                <span className="font-semibold text-white">₹{(calculations.downPayment / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Interest Rate & Tenure */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <label className="text-slate-300">Interest Rate</label>
                  <span className="font-bold text-sky-400">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="14.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <label className="text-slate-300">Tenure</label>
                  <span className="font-bold text-sky-400">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Expected Monthly Rent */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <label className="text-slate-300 font-medium">Estimated Monthly Rent</label>
                <span className="font-bold text-emerald-400">₹{expectedRent.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="2500"
                value={expectedRent}
                onChange={(e) => setExpectedRent(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 bg-[#1E293B]/80 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A]/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Monthly EMI</span>
                  <span className="font-serif-fraunces font-extrabold text-2xl text-sky-400">
                    ₹{calculations.monthlyEmi.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#0F172A]/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Gross Rental Yield</span>
                  <span className="font-serif-fraunces font-extrabold text-2xl text-emerald-400 flex items-center gap-1">
                    {calculations.grossRentalYield}%
                    <Sparkles className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Breakdown Chart */}
              <div className="h-52 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '12px'
                      }}
                      formatter={(val) => `₹${(val / 100000).toFixed(2)} Lakhs`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 text-xs font-mono border-t border-slate-800 pt-4">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Principal
                </span>
                <span className="flex items-center gap-1.5 text-blue-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Down Payment
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Interest
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
