import React, { useState } from "react";
import {
  Calculator,
  CalendarDays,
  Sparkles,
  Gem,
  Ticket,
  Settings2,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// --- CONFIGURAÇÕES PADRÃO (Baseado em HSR) ---
const DEFAULT_PULL_COST = 160;
const DEFAULT_DAILY_REWARD = 60;
const DEFAULT_MONTHLY_PASS = 90;

export default function App() {
  // --- ESTADOS DA CALCULADORA ---
  const [currentGems, setCurrentGems] = useState(0);
  const [currentPulls, setCurrentPulls] = useState(0);
  const [targetDays, setTargetDays] = useState(30);
  const [hasMonthlyPass, setHasMonthlyPass] = useState(false);
  const [hasBattlePass, setHasBattlePass] = useState(false); // BP dá aprox 4 tiros e 680 gemas por patch (42 dias)
  const [extraGems, setExtraGems] = useState(0); // Eventos, abismo, etc.

  // --- LÓGICA DE CÁLCULO ---
  const calculateResources = () => {
    let totalGems = currentGems + Number(extraGems);

    // Ganhos diários
    const dailyIncome =
      DEFAULT_DAILY_REWARD + (hasMonthlyPass ? DEFAULT_MONTHLY_PASS : 0);
    totalGems += dailyIncome * targetDays;

    // Ganhos do Passe de Batalha (Simplificado: assumindo 1 BP a cada 42 dias)
    let bpGems = 0;
    let bpPulls = 0;
    if (hasBattlePass) {
      const patches = targetDays / 42;
      bpGems = Math.floor(patches * 680);
      bpPulls = Math.floor(patches * 4);
    }
    totalGems += bpGems;

    const totalPulls =
      currentPulls + bpPulls + Math.floor(totalGems / DEFAULT_PULL_COST);
    const remainingGems = totalGems % DEFAULT_PULL_COST;

    return { totalGems, totalPulls, remainingGems };
  };

  const { totalPulls, totalGems, remainingGems } = calculateResources();

  // Avaliação de Probabilidade (Pity System)
  const getPityStatus = (pulls) => {
    if (pulls >= 180)
      return {
        text: "Garantia Absoluta (Hard Pity + 50/50)",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
      };
    if (pulls >= 150)
      return {
        text: "Altíssima Chance (Soft Pity + Garantido)",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
      };
    if (pulls >= 90)
      return {
        text: "Garantia de 5 Estrelas (Pode perder o 50/50)",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
      };
    if (pulls >= 75)
      return {
        text: "Soft Pity Alcançado (Boas chances)",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
      };
    return {
      text: "Chances Baixas (Depende de Sorte)",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    };
  };

  const pityStatus = getPityStatus(totalPulls);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              GachaPlanner Pro
            </h1>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-indigo-400 rounded-md border border-slate-700/50">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculadora</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Painel de Entradas */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-indigo-400" />
                  Seus Recursos Atuais
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Stellar Jades
                    </label>
                    <div className="relative">
                      <Gem className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={currentGems}
                        onChange={(e) => setCurrentGems(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Pulls Salvos
                    </label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={currentPulls}
                        onChange={(e) =>
                          setCurrentPulls(Number(e.target.value))
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Dias até o Banner Alvo
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={targetDays}
                        onChange={(e) => setTargetDays(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Stellar Jades Extras Previstos (Eventos, Abismo)
                    </label>
                    <div className="relative">
                      <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={extraGems}
                        onChange={(e) => setExtraGems(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 text-slate-200">
                  Assinaturas Ativas
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border border-slate-800 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <span className="text-sm">Passe Mensal (+90/dia)</span>
                    <input
                      type="checkbox"
                      checked={hasMonthlyPass}
                      onChange={(e) => setHasMonthlyPass(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 rounded bg-slate-900 border-slate-700"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-slate-800 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <span className="text-sm">Passe de Batalha Pago</span>
                    <input
                      type="checkbox"
                      checked={hasBattlePass}
                      onChange={(e) => setHasBattlePass(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 rounded bg-slate-900 border-slate-700"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Painel de Resultados */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                  Projeção de Acúmulo ({targetDays} dias)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <Ticket className="w-4 h-4" /> Total de Pulls Estimados
                    </div>
                    <div className="text-5xl font-bold text-white">
                      {totalPulls}{" "}
                      <span className="text-lg text-slate-500 font-normal">
                        pulls
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
                    <div className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <Gem className="w-4 h-4" /> Total de Stellar Jades
                    </div>
                    <div className="text-3xl font-bold text-indigo-200">
                      {totalGems.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Sobra: {remainingGems} Stellar Jades
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${pityStatus.bg} ${pityStatus.border} flex items-start gap-3 transition-colors duration-300`}
                >
                  <AlertCircle
                    className={`w-6 h-6 shrink-0 mt-0.5 ${pityStatus.color}`}
                  />
                  <div>
                    <h3 className={`font-semibold ${pityStatus.color}`}>
                      Análise de Probabilidade
                    </h3>
                    <p className="text-slate-300 text-sm mt-1">
                      Com base nos recursos projetados, seu status no banner
                      será: <strong>{pityStatus.text}</strong>. (Considerando
                      Hard Pity em 90 e Soft Pity a partir de 75).
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo de Ganhos Diários */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Composição da Renda
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Missões Diárias</span>
                    <span className="font-medium">
                      +{DEFAULT_DAILY_REWARD * targetDays} Stellar Jades
                    </span>
                  </div>
                  {hasMonthlyPass && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">
                        Passe Mensal (Supply Pass)
                      </span>
                      <span className="font-medium text-indigo-300">
                        +{DEFAULT_MONTHLY_PASS * targetDays} Stellar Jades
                      </span>
                    </div>
                  )}
                  {hasBattlePass && (
                    <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-4 mt-2">
                      <span className="text-slate-300">
                        Passe de Batalha (Estimativa)
                      </span>
                      <span className="font-medium text-purple-300">
                        +{Math.floor((targetDays / 42) * 680)} Stellar Jades / +
                        {Math.floor((targetDays / 42) * 4)} pulls
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
