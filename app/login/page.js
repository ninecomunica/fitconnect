"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const OBJETIVOS = ["Emagrecer","Ganhar massa","Melhorar saúde","Performance esportiva","Nutrição clínica","Outro"];

export default function Login() {
  const [etapa, setEtapa] = useState("dados"); // dados → codigo → ok
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "", objetivo: "", cidade: "" });
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleEnviarCodigo(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: { shouldCreateUser: true }
    });

    setLoading(false);

    if (error) {
      setErro("Erro ao enviar código. Verifique o email e tente novamente.");
    } else {
      setEtapa("codigo");
    }
  }

  async function handleVerificarCodigo(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: codigo,
      type: "email"
    });

    if (error) {
      setErro("Código inválido ou expirado. Tente novamente.");
      setLoading(false);
      return;
    }

    await supabase.from("usuarios").upsert([{
      email: form.email,
      nome: form.nome,
      whatsapp: form.whatsapp,
      objetivo: form.objetivo,
      cidade: form.cidade,
    }], { onConflict: "email" });

    setLoading(false);
    setEtapa("ok");

    setTimeout(() => {
      window.location.href = "/buscar";
    }, 1500);
  }

  if (etapa === "ok") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Acesso liberado!</h2>
          <p className="text-gray-400 text-sm mt-1">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center px-8 py-4 bg-white border-b border-gray-100">
        <a href="/" className="flex items-center gap-1">
          <span className="text-lg font-bold text-[#1a1a1a]">Fit</span>
          <span className="text-lg font-bold text-[#4CAF50]">Connect</span>
        </a>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {etapa === "dados" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2" style={{letterSpacing:'-0.02em'}}>
                  Encontre seu profissional
                </h1>
                <p className="text-gray-400 text-sm">Crie sua conta gratuita para ver os profissionais disponíveis.</p>
              </div>

              <form onSubmit={handleEnviarCodigo} className="flex flex-col gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                  <input name="nome" value={form.nome} onChange={handleChange} required
                    placeholder="Ex: Maria Silva"
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="seu@email.com"
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
                  <p className="text-xs text-gray-400 mt-1.5">Enviaremos um código de verificação para este email.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp <span className="text-gray-300">(opcional)</span></label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                    placeholder="Ex: 85999999999"
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Qual seu objetivo?</label>
                  <div className="flex flex-wrap gap-2">
                    {OBJETIVOS.map(o => (
                      <button key={o} type="button" onClick={() => setForm({...form, objetivo: o})}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          form.objetivo === o ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-gray-600 border-gray-200 hover:border-[#4CAF50]/50"
                        }`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade</label>
                  <input name="cidade" value={form.cidade} onChange={handleChange} required
                    placeholder="Ex: Fortaleza, CE"
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
                </div>

                {erro && <p className="text-red-500 text-sm">{erro}</p>}

                <button type="submit" disabled={loading}
                  className="bg-[#1a1a1a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#4CAF50] transition-colors disabled:opacity-50 mt-2">
                  {loading ? "Enviando código..." : "Receber código de verificação →"}
                </button>

              </form>
            </>
          )}

          {etapa === "codigo" && (
            <>
              <div className="mb-8 text-center">
                <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Verifique seu email</h1>
                <p className="text-gray-400 text-sm">Enviamos um código de verificação para <strong className="text-gray-700">{form.email}</strong></p>
              </div>

              <form onSubmit={handleVerificarCodigo} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de verificação</label>
                  <input value={codigo} onChange={e => setCodigo(e.target.value)} required
                    placeholder="Digite o código recebido"
                    maxLength={8}
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-center tracking-widest font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">O código expira em 60 minutos.</p>
                </div>

                {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

                <button type="submit" disabled={loading}
                  className="bg-[#1a1a1a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#4CAF50] transition-colors disabled:opacity-50">
                  {loading ? "Verificando..." : "Confirmar e acessar →"}
                </button>

                <button type="button" onClick={() => setEtapa("dados")}
                  className="text-sm text-gray-400 hover:text-gray-700 text-center transition-colors">
                  Voltar e corrigir email
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}