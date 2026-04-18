"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ESPECIALIDADES = ["Todos", "Personal trainer", "Nutricionista", "Personal + Nutrição"];
const SUBESPECIALIDADES = [
  "Emagrecimento","Hipertrofia","Funcional","Esportivo","Corrida","Crossfit",
  "Pilates","Reabilitação","Idosos","Gestantes","Neurodivergente",
  "Vegana/Vegetariana","Esportiva","Clínica","Infantil","Saúde da Mulher"
];
const PLANOS = ["Unimed","Hapvida","NotreDame Intermédica","Bradesco Saúde","SulAmérica","Amil","São Francisco Saúde","Particular apenas"];

const AVATAR_COLORS = ["#4CAF50","#2196F3","#FF9800","#9C27B0","#E91E63","#00BCD4"];

export default function Buscar() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState("cards");
  const [filtroEsp, setFiltroEsp] = useState("Todos");
  const [filtroSub, setFiltroSub] = useState("");
  const [filtroPlano, setFiltroPlano] = useState("");

 useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase.from("profissionais").select("*");
      setProfissionais(data || []);
      setLoading(false);
    }
    init();
  }, []);

  const filtrados = profissionais.filter(p => {
    if (filtroEsp !== "Todos" && p.especialidade !== filtroEsp) return false;
    if (filtroSub && !p.subespecialidade?.includes(filtroSub)) return false;
    if (filtroPlano && !p.planos_saude?.includes(filtroPlano)) return false;
    return true;
  });

  function getInicial(nome) {
    return nome?.charAt(0).toUpperCase() || "?";
  }

  function getColor(nome) {
    const i = (nome?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[i];
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <a href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-[#1a1a1a]">Fit</span>
          <span className="text-xl font-bold text-[#4CAF50]">Connect</span>
        </a>
        <a href="/cadastro" className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4CAF50] transition-colors">
          Sou profissional
        </a>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-1" style={{letterSpacing:'-0.02em'}}>
            Encontre seu profissional
          </h1>
          <p className="text-gray-400 text-sm">{filtrados.length} profissionais verificados em Fortaleza</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Especialidade */}
          <div className="flex gap-2 flex-wrap">
            {ESPECIALIDADES.map(e => (
              <button key={e} onClick={() => setFiltroEsp(e)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filtroEsp === e ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {e}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Sub-especialidade */}
            <select value={filtroSub} onChange={e => setFiltroSub(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 bg-white">
              <option value="">Sub-especialidade</option>
              {SUBESPECIALIDADES.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Plano */}
            <select value={filtroPlano} onChange={e => setFiltroPlano(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 bg-white">
              <option value="">Plano de saúde</option>
              {PLANOS.map(p => <option key={p}>{p}</option>)}
            </select>

            {(filtroSub || filtroPlano || filtroEsp !== "Todos") && (
              <button onClick={() => { setFiltroEsp("Todos"); setFiltroSub(""); setFiltroPlano(""); }}
                className="text-sm text-gray-400 hover:text-gray-700 underline">
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Toggle de layout */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">{filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""}</p>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setLayout("cards")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${layout === "cards" ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500"}`}>
              Cards
            </button>
            <button onClick={() => setLayout("marketplace")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${layout === "marketplace" ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500"}`}>
              Grade
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Sem resultados */}
        {!loading && filtrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Nenhum profissional encontrado com esses filtros.</p>
            <button onClick={() => { setFiltroEsp("Todos"); setFiltroSub(""); setFiltroPlano(""); }}
              className="mt-3 text-[#4CAF50] text-sm font-medium hover:underline">
              Limpar filtros
            </button>
          </div>
        )}

        {/* LAYOUT CARDS */}
        {!loading && layout === "cards" && filtrados.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtrados.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex gap-5 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  {p.foto_url
                    ? <img src={p.foto_url} alt={p.nome} className="w-16 h-16 rounded-full object-cover"/>
                    : <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                        style={{backgroundColor: getColor(p.nome)}}>
                        {getInicial(p.nome)}
                      </div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#1a1a1a] text-base">{p.nome}</h3>
                        <span className="flex items-center gap-1 bg-[#4CAF50]/10 text-[#2e7d32] text-xs font-semibold px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                          </svg>
                          Verificado
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{p.especialidade} · {p.cidade}</p>
                      {p.subespecialidade && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.subespecialidade.split(", ").slice(0, 4).map(s => (
                            <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {p.valor_primeira && <p className="text-sm font-bold text-[#1a1a1a]">R$ {p.valor_primeira}</p>}
                      {p.valor_primeira && <p className="text-xs text-gray-400">primeira consulta/aula</p>}
                    </div>
                  </div>

                  {p.bio && <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-2">{p.bio}</p>}

                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <a href={`https://wa.me/55${p.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#43a047] transition-colors">
                      Entrar em contato
                    </a>
                    {p.instagram && (
                      <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                        @{p.instagram}
                      </a>
                    )}
                    {p.horarios && <span className="text-xs text-gray-400">{p.horarios}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT MARKETPLACE */}
        {!loading && layout === "marketplace" && filtrados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Foto grande */}
                <div className="h-48 flex items-center justify-center relative"
                  style={{backgroundColor: p.foto_url ? "transparent" : getColor(p.nome) + "20"}}>
                  {p.foto_url
                    ? <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover"/>
                    : <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                        style={{backgroundColor: getColor(p.nome)}}>
                        {getInicial(p.nome)}
                      </div>
                  }
                  <span className="absolute top-3 right-3 flex items-center gap-1 bg-white text-[#2e7d32] text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    <svg className="w-3 h-3 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    Verificado
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-[#1a1a1a] text-base mb-0.5">{p.nome}</h3>
                  <p className="text-sm text-gray-400 mb-3">{p.especialidade} · {p.cidade}</p>

                  {p.subespecialidade && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.subespecialidade.split(", ").slice(0, 3).map(s => (
                        <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {p.valor_primeira && <p className="text-sm font-bold text-[#1a1a1a]">R$ {p.valor_primeira}</p>}
                      {p.valor_primeira && <p className="text-xs text-gray-400">1ª consulta/aula</p>}
                    </div>
                    <a href={`https://wa.me/55${p.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#43a047] transition-colors">
                      Contato
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}