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

  const COLORS = ['#5C7A63', '#B08D57', '#8A6D3B'];

  return (
    <section id="calculator" className="py-24 bg-[#0D1410] blueprint-grid relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#B08D57]/10 px-3.5 py-1 rounded-full text-xs font-mono font-semibold text-[#B08D57] border border-[#B08D57]/30">
            <Calculator className="w-3.5 h-3.5" />
            FINANCIAL INTELLIGENCE
          </div>
          <h2 className="font-serif-fraunces text-3xl sm:text-5xl font-extrabold text-[#EFEAE1]">
            Real Estate Investment & EMI Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9186] font-light">
            Simulate loan cashflows, rental yield rates, and capital appreciation potential before committing capital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-[#B08D57]/20 space-y-6">
            <h3 className="font-serif-fraunces text-lg font-bold text-[#EFEAE1] border-b border-white/10 pb-4">
              Financial Assumptions
            </h3>

            {/* Property Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="text-gray-300 font-medium">Property Price</label>
                <span className="font-bold text-[#B08D57]">₹{(propertyPrice / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="30000000"
                step="500000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-[#B08D57] bg-gray-700 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Down Payment % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="text-gray-300 font-medium">Down Payment ({downPaymentPercent}%)</label>
                <span className="font-semibold text-[#EFEAE1]">₹{(calculations.downPayment / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#B08D57] bg-gray-700 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Interest Rate & Tenure */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-medium block">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-[#0D1410] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#EFEAE1] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-medium block">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full bg-[#0D1410] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#EFEAE1] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
            </div>

            {/* Monthly Rent Expectation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="text-gray-300 font-medium">Expected Monthly Rent</label>
                <span className="font-semibold text-[#EFEAE1]">₹{expectedRent.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="2500"
                value={expectedRent}
                onChange={(e) => setExpectedRent(Number(e.target.value))}
                className="w-full accent-[#B08D57] bg-gray-700 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Calculations & Visualization Column */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-[#B08D57]/20 flex flex-col justify-between space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0D1410]/80 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">Monthly EMI</span>
                <span className="font-serif-fraunces font-extrabold text-xl sm:text-2xl text-[#EFEAE1]">
                  ₹{calculations.monthlyEmi.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#0D1410]/80 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">Gross Rental Yield</span>
                <span className="font-serif-fraunces font-extrabold text-xl sm:text-2xl text-[#B08D57]">
                  {calculations.grossRentalYield}%
                </span>
              </div>
            </div>

            {/* Recharts Pie Chart */}
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0D1410', borderColor: 'rgba(176,141,87,0.3)', borderRadius: '12px', fontSize: '11px', color: '#EFEAE1' }}
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Legend */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 text-center font-mono">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#5C7A63]"></span>
                <span>Loan: ₹{(calculations.loanAmount / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B08D57]"></span>
                <span>Down: ₹{(calculations.downPayment / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8A6D3B]"></span>
                <span>Interest: ₹{(calculations.totalInterest / 100000).toFixed(1)}L</span>
              </div>
            </div>

            {/* AI Generated Insight */}
            <div className="bg-[#B08D57]/10 p-4 rounded-2xl border border-[#B08D57]/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#B08D57] font-mono uppercase">AI Advisory Insight</h4>
                <p className="text-xs text-[#EFEAE1]/80 mt-0.5 leading-relaxed font-light">
                  "Based on the provided assumptions, this property yields a strong {calculations.grossRentalYield}% rental return and may be more suitable for long-term capital appreciation along Madurai's growth corridor."
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
