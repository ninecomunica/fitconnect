"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "", especialidade: "", cidade: "", valor: "", whatsapp: "", bio: ""
  });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase
      .from("profissionais")
      .insert([form]);

    setLoading(false);

    if (error) {
      setErro("Erro ao salvar. Tente novamente.");
      console.error(error);
    } else {
      setEnviado(true);
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro recebido!</h2>
          <p className="text-gray-500">Entraremos em contato pelo WhatsApp em breve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center px-8 py-5 bg-white border-b border-gray-100">
        <a href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-gray-900">Fit</span>
          <span className="text-xl font-bold text-green-500">Connect</span>
        </a>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastre seu perfil</h1>
        <p className="text-gray-500 mb-8">Preencha seus dados e comece a receber leads qualificados.</p>

        {erro && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input name="nome" value={form.nome} onChange={handleChange} required
              placeholder="Ex: João Silva"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
            <select name="especialidade" value={form.especialidade} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Selecione...</option>
              <option>Personal trainer</option>
              <option>Nutricionista</option>
              <option>Personal + Nutrição</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input name="cidade" value={form.cidade} onChange={handleChange} required
              placeholder="Ex: Fortaleza, CE"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor da mensalidade (R$)</label>
            <input name="valor" value={form.valor} onChange={handleChange} required
              placeholder="Ex: 300"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} required
              placeholder="Ex: 85999999999"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (opcional)</label>
            <textarea name="bio" value={form.bio} onChange={handleChange}
              placeholder="Fale um pouco sobre você e sua metodologia..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"/>
          </div>

          <button type="submit" disabled={loading}
            className="bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50">
            {loading ? "Salvando..." : "Enviar cadastro"}
          </button>
        </form>
      </main>
    </div>
  );
}