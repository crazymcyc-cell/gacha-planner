import React, { useState, useEffect } from "react";
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
  History,
  Trophy,
  XCircle,
  Star,
  Trash2,
} from "lucide-react";

// --- CONFIGURAÇÕES PADRÃO ---
const DEFAULT_PULL_COST = 160;
const DEFAULT_DAILY_REWARD = 60;
const DEFAULT_MONTHLY_PASS = 90;

export default function App() {
  // --- ESTADOS DA CALCULADORA ---
  const [currentGems, setCurrentGems] = useState(0);
  const [currentPulls, setCurrentPulls] = useState(0);
  const [targetDays, setTargetDays] = useState(44);
  const [hasMonthlyPass, setHasMonthlyPass] = useState(false);
  const [hasBattlePass, setHasBattlePass] = useState(false);
  const [extraGems, setExtraGems] = useState(9090);

  // --- ESTADOS DO HISTÓRICO DE PITY (Com LocalStorage) ---
  const [pityHistory, setPityHistory] = useState(() => {
    const saved = localStorage.getItem("gachaPityHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [historyName, setHistoryName] = useState("");
  const [historyPity, setHistoryPity] = useState("");
  const [historyResult, setHistoryResult] = useState("won");

  // Salvar no LocalStorage sempre que o histórico mudar
  useEffect(() => {
    localStorage.setItem("gachaPityHistory", JSON.stringify(pityHistory));
  }, [pityHistory]);

  // --- LÓGICA DE CÁLCULO ---
  const calculateResources = () => {
    let totalGems = currentGems + Number(extraGems);

    const dailyIncome =
      DEFAULT_DAILY_REWARD + (hasMonthlyPass ? DEFAULT_MONTHLY_PASS : 0);
    totalGems += dailyIncome * targetDays;

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

  // --- NOVA AVALIAÇÃO DE PROBABILIDADE COM % ---
  const getPityStatus = (pulls) => {
    let percent = 0;
    let text, color, bg, border, barColor;

    if (pulls >= 180) {
      percent = 100;
      text = "Garantia Absoluta (Hard Pity + 50/50)";
      color = "text-emerald-400";
      bg = "bg-emerald-400/10";
      border = "border-emerald-400/20";
      barColor = "bg-emerald-400";
    } else if (pulls >= 150) {
      percent = 90 + Math.floor(((pulls - 150) / 30) * 9); // De 90% a 99%
      text = "Altíssima Chance (Soft Pity + Garantido)";
      color = "text-blue-400";
      bg = "bg-blue-400/10";
      border = "border-blue-400/20";
      barColor = "bg-blue-400";
    } else if (pulls >= 90) {
      percent = 50 + Math.floor(((pulls - 90) / 60) * 39); // De 50% a 89%
      text = "Garantia de 5★ (Sujeito a 50/50)";
      color = "text-yellow-400";
      bg = "bg-yellow-400/10";
      border = "border-yellow-400/20";
      barColor = "bg-yellow-400";
    } else if (pulls >= 75) {
      percent = 30 + Math.floor(((pulls - 75) / 15) * 19); // De 30% a 49%
      text = "Soft Pity Alcançado (Boas chances)";
      color = "text-orange-400";
      bg = "bg-orange-400/10";
      border = "border-orange-400/20";
      barColor = "bg-orange-400";
    } else {
      percent = Math.floor((pulls / 75) * 29); // De 0% a 29%
      text = "Chances Baixas (Depende de Sorte)";
      color = "text-red-400";
      bg = "bg-red-400/10";
      border = "border-red-400/20";
      barColor = "bg-red-400";
    }

    // Limitador de segurança para não mostrar menos de 0 ou mais de 100
    percent = Math.max(0, Math.min(100, percent));

    return { percent, text, color, bg, border, barColor };
  };

  const pityStatus = getPityStatus(totalPulls);

  // --- FUNÇÕES DO HISTÓRICO ---
  const addHistoryEntry = (e) => {
    e.preventDefault();
    if (!historyName.trim() || !historyPity) return;

    const newEntry = {
      id: Date.now(),
      name: historyName,
      pity: Number(historyPity),
      result: historyResult,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setPityHistory([newEntry, ...pityHistory]);
    setHistoryName("");
    setHistoryPity("");
    setHistoryResult("won");
  };

  const deleteHistoryEntry = (id) => {
    setPityHistory(pityHistory.filter((entry) => entry.id !== id));
  };

  const getResultVisuals = (result) => {
    switch (result) {
      case "won":
        return {
          icon: <Trophy className="w-4 h-4" />,
          text: "Ganhou 50/50",
          color: "text-emerald-400",
          bg: "bg-emerald-400/10 border-emerald-400/20",
        };
      case "lost":
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: "Perdeu 50/50",
          color: "text-red-400",
          bg: "bg-red-400/10 border-red-400/20",
        };
      case "guaranteed":
        return {
          icon: <Star className="w-4 h-4" />,
          text: "Garantido",
          color: "text-blue-400",
          bg: "bg-blue-400/10 border-blue-400/20",
        };
      default:
        return { icon: null, text: "", color: "", bg: "" };
    }
  };

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
              GachaPlanner
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* SESSÃO DA CALCULADORA (GRID SUPERIOR) */}
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
                      Jades Extras Previstos (Eventos, etc)
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
                    <span className="text-sm">Passe Mensal (Supply Pass)</span>
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

                {/* NOVO PAINEL DE PROBABILIDADE VISUAL COM BARRA */}
                <div
                  className={`p-6 rounded-xl border ${pityStatus.bg} ${pityStatus.border} transition-colors duration-300`}
                >
                  <div className="flex items-center gap-5 mb-4">
                    {/* Crachá circular de Porcentagem */}
                    <div
                      className={`flex items-center justify-center w-16 h-16 rounded-full border-4 ${pityStatus.border} bg-slate-950/30 shrink-0 shadow-inner`}
                    >
                      <span
                        className={`text-xl font-black ${pityStatus.color}`}
                      >
                        {pityStatus.percent}%
                      </span>
                    </div>

                    {/* Textos */}
                    <div>
                      <h3
                        className={`font-bold text-lg flex items-center gap-2 ${pityStatus.color}`}
                      >
                        <AlertCircle className="w-5 h-5" />
                        {pityStatus.text}
                      </h3>
                      <p className="text-slate-300 text-sm mt-1">
                        Chance estimada de conseguir o{" "}
                        <strong>personagem promocional</strong> no banner.
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-slate-950/50 rounded-full h-3 overflow-hidden border border-slate-800/50">
                    <div
                      className={`h-full ${pityStatus.barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${pityStatus.percent}%` }}
                    ></div>
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

          {/* SESSÃO: HISTÓRICO DE PITY */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <History className="w-6 h-6 text-indigo-400" />
                Histórico de Pulls (5 Estrelas)
              </h2>
            </div>

            {/* Formulário de Adição */}
            <form
              onSubmit={addHistoryEntry}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800"
            >
              <div className="md:col-span-4">
                <label className="block text-sm text-slate-400 mb-1">
                  Personagem
                </label>
                <input
                  type="text"
                  value={historyName}
                  onChange={(e) => setHistoryName(e.target.value)}
                  placeholder="Ex: Acheron"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm text-slate-400 mb-1">
                  Nº do Pity
                </label>
                <input
                  type="number"
                  max="90"
                  min="1"
                  value={historyPity}
                  onChange={(e) => setHistoryPity(e.target.value)}
                  placeholder="Ex: 78"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm text-slate-400 mb-1">
                  Resultado
                </label>
                <select
                  value={historyResult}
                  onChange={(e) => setHistoryResult(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-200"
                >
                  <option value="won">Ganhou 50/50</option>
                  <option value="lost">Perdeu 50/50</option>
                  <option value="guaranteed">Garantido</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>

            {/* Lista do Histórico */}
            <div className="space-y-3">
              {pityHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-950/30 rounded-xl border border-slate-800 border-dashed">
                  Nenhum personagem registrado ainda. Adicione o seu primeiro 5
                  estrelas acima!
                </div>
              ) : (
                pityHistory.map((entry) => {
                  const visuals = getResultVisuals(entry.result);
                  return (
                    <div
                      key={entry.id}
                      className="group flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-lg text-slate-300 border border-slate-800">
                          {entry.pity}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-200 text-lg">
                            {entry.name}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {entry.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${visuals.bg} ${visuals.color}`}
                        >
                          {visuals.icon}
                          <span className="hidden sm:inline">
                            {visuals.text}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteHistoryEntry(entry.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Excluir registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
