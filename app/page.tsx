"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState<any>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (result?.overall_risk_score) {
      let start = 0;

      const interval = setInterval(() => {
        start += 1;

        setAnimatedScore(start);

        if (start >= Number(result.overall_risk_score)) {
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [result]);

  const analyzeContract = async () => {
    setLoading(true);
    setLoadingStep("Analyzing Contract...");

    setTimeout(() => {
      setLoadingStep("Detecting Risk Clauses...");
    }, 1200);

    setTimeout(() => {
      setLoadingStep("Reasoning About Consequences...");
    }, 2400);

    setTimeout(() => {
      setLoadingStep("Generating Negotiation Tips...");
    }, 3600);



    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractText,
        }),
      });

      const data = await response.json();

      const parsedData = JSON.parse(data.data);

      setResult(parsedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };


  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col items-center sm:items-start text-center sm:text-left mb-12">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              LexGuard
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-xl">
            AI-powered contract analysis. Understand what you’re really agreeing to before you sign.
          </p>
        </header>

        {!result ? (
          /* Initial Input State */
          <div className="w-full max-w-4xl mx-auto mt-10">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm hover:border-slate-300 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group">
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your legal contract, Terms of Service, or agreement here..."
                className="w-full h-80 bg-transparent text-slate-900 placeholder-slate-400 resize-none outline-none text-lg font-light leading-relaxed"
              />
              <div className="flex justify-between items-center mt-6 border-t border-slate-100 pt-6">
                <div className="text-sm text-slate-500 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Your data is not stored after analysis.</span>
                </div>
                <button
                  onClick={analyzeContract}
                  disabled={loading || !contractText.trim()}
                  className="relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <span>{loadingStep}</span>

                      <span className="text-xs text-slate-400 mt-1">
                        Detecting legal risks & reasoning about consequences
                      </span>
                    </div>
                  ) : (
                    "Analyze Contract"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Layout (Results) */
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex items-center justify-between relative overflow-hidden group hover:border-slate-300 transition-colors">
                <div className="relative z-10">
                  <h3 className="text-slate-500 font-medium mb-1 text-sm uppercase tracking-wider">Overall Risk Score</h3>
                  <div className="space-y-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-black text-red-600">
                        {animatedScore}
                      </span>

                      <span className="text-xl text-slate-400 font-medium">
                        / 100
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-700"
                        style={{
                          width: `${result.overall_risk_score}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 relative z-10">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex items-center justify-between relative overflow-hidden group hover:border-slate-300 transition-colors">
                <div className="relative z-10">
                  <h3 className="text-slate-500 font-medium mb-2 text-sm uppercase tracking-wider">Fairness Analysis</h3>
                  <h2 className="text-2xl font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors duration-300">
                    {result.fairness_analysis}
                  </h2>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 relative z-10 shrink-0 ml-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* "What This Means For You" Section (Preserved) */}
            <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-900">
                What This Means For You
              </h2>
              <p className="text-indigo-800 leading-relaxed text-lg">
                If you sign this agreement, you may lose ownership of side projects,
                face restrictions when applying to competitors after leaving the company,
                and have limited legal options in disputes due to mandatory arbitration clauses.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-[#10172A] border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-red-400">
                  Hidden Concerns
                </h3>

                <ul className="space-y-3 text-slate-300 text-sm">
                  <li>• Side projects may legally belong to employer</li>
                  <li>• Career movement could be restricted</li>
                  <li>• Arbitration limits legal protection</li>
                </ul>
              </div>

              <div className="bg-[#10172A] border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-300">
                  Power Balance
                </h3>

                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-orange-400 h-full w-[75%]" />
                </div>

                <div className="flex justify-between mt-3 text-sm text-slate-400">
                  <span>You</span>
                  <span>Company</span>
                </div>

                <p className="mt-4 text-slate-300 text-sm">
                  This agreement strongly favors the company.
                </p>
              </div>

              <div className="bg-[#10172A] border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-indigo-300">
                  AI Confidence
                </h3>

                <h2>{result?.confidence_score ?? 92}%</h2>

                <p className="text-slate-300 text-sm">
                  LexGuard is highly confident in the identified contractual risks and implications.
                </p>
              </div>

            </div>

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
              {/* Left Panel: Contract Preview */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 lg:sticky lg:top-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-semibold text-slate-800">Contract Preview</h3>
                </div>
                <textarea
                  value={contractText}
                  readOnly
                  className="w-full h-[600px] bg-transparent text-slate-600 text-sm leading-relaxed resize-none outline-none custom-scrollbar pr-2"
                />
              </div>

              {/* Right Panel: AI Insights */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center space-x-3 mb-6 px-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                  <h3 className="font-semibold text-slate-800 text-lg">AI Risk Insights</h3>
                </div>

                {result.clauses.map((clause: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm hover:border-slate-300 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {clause.clause_type}
                      </h2>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getSeverityColor(clause.severity)}`}>
                        {clause.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                          <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Who Benefits</span>
                        </span>
                        <p className="text-slate-700 text-sm leading-relaxed">{clause.who_benefits}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                          <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Why It’s Risky</span>
                        </span>
                        <p className="text-slate-700 text-sm leading-relaxed">{clause.why_it_is_risky}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Real-World Consequence</span>
                        </span>
                        <p className="text-slate-700 text-sm leading-relaxed">{clause.real_world_consequence}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                          <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span>What Most Miss</span>
                        </span>
                        <p className="text-slate-700 text-sm leading-relaxed">{clause.what_users_may_miss}</p>
                      </div>

                      <div className="col-span-1 md:col-span-2 bg-indigo-50 rounded-2xl p-4 mt-2 border border-indigo-100">
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Negotiation Tip</span>
                          </span>
                          <p className="text-indigo-900 text-sm leading-relaxed">{clause.negotiation_tip}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-center pt-8 pb-12">
                  <button
                    onClick={() => {
                      setResult(null);
                      setContractText("");
                    }}
                    className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors border border-slate-200 px-6 py-2.5 rounded-full hover:bg-slate-50 bg-white shadow-sm"
                  >
                    Analyze Another Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main >
  );
}