import React, { useState, useMemo } from 'react';
import { Calculator, Sparkles, TrendingUp, DollarSign, PieChart as PieIcon } from 'lucide-react';
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

  const COLORS = ['#3B82F6', '#D4AF37', '#F59E0B'];

  return (
    <section id="calculator" className="py-24 bg-[#090D14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-3 py-1 rounded-full text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
            <Calculator className="w-3.5 h-3.5" />
            FINANCIAL INTELLIGENCE
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
            Real Estate Investment & EMI Calculator
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Simulate loan cashflows, rental yield rates, and capital appreciation potential before committing capital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="font-heading text-lg font-bold text-white border-b border-white/10 pb-4">
              Financial Assumptions
            </h3>

            {/* Property Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-gray-300 font-medium">Property Price</label>
                <span className="font-bold text-[#D4AF37]">₹{(propertyPrice / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="30000000"
                step="500000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-gray-700 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Down Payment % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-gray-300 font-medium">Down Payment ({downPaymentPercent}%)</label>
                <span className="font-semibold text-white">₹{(calculations.downPayment / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-gray-700 h-1.5 rounded-lg cursor-pointer"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-medium block">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Monthly Rent Expectation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-gray-300 font-medium">Expected Monthly Rent</label>
                <span className="font-semibold text-white">₹{expectedRent.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="2500"
                value={expectedRent}
                onChange={(e) => setExpectedRent(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-gray-700 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Calculations & Visualization Column */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Monthly EMI</span>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  ₹{calculations.monthlyEmi.toLocaleString()}
                </span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Gross Rental Yield</span>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#D4AF37]">
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
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Legend */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Loan: ₹{(calculations.loanAmount / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                <span>Down: ₹{(calculations.downPayment / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Interest: ₹{(calculations.totalInterest / 100000).toFixed(1)}L</span>
              </div>
            </div>

            {/* AI Generated Insight */}
            <div className="bg-[#D4AF37]/10 p-4 rounded-2xl border border-[#D4AF37]/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#D4AF37]">AI Advisory Insight</h4>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
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
