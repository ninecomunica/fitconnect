"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SUBESPECIALIDADES = {
  "Personal trainer": ["Emagrecimento","Hipertrofia","Funcional","Esportivo","Corrida","Crossfit","Pilates","Reabilitação","Idosos","Gestantes","Neurodivergente"],
  "Nutricionista": ["Emagrecimento","Hipertrofia","Vegana/Vegetariana","Esportiva","Clínica","Infantil","Gestantes","Idosos","Saúde da Mulher","Neurodivergente"],
  "Personal + Nutrição": ["Emagrecimento","Hipertrofia","Funcional","Esportivo","Corrida","Crossfit","Pilates","Reabilitação","Idosos","Gestantes","Neurodivergente","Vegana/Vegetariana","Esportiva","Clínica","Infantil","Saúde da Mulher"],
};

const DIAS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
const FAIXAS = ["08h-12h","12h-18h","18h-22h"];
const PLANOS = ["Unimed","Hapvida","NotreDame Intermédica","Bradesco Saúde","SulAmérica","Amil","São Francisco Saúde","Particular apenas"];

const isNutri = (e) => e === "Nutricionista";
const isPersonal = (e) => e === "Personal trainer" || e === "Personal + Nutrição";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome:"", especialidade:"", registro:"", cidade:"",
    valor_primeira:"", valor_demais:"", valor_avulsa:"",
    whatsapp:"", instagram:"", bio:""
  });
  const [subs, setSubs] = useState([]);
  const [outra, setOutra] = useState("");
  const [dias, setDias] = useState([]);
  const [faixas, setFaixas] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "especialidade") setSubs([]);
  }

  function toggle(list, setList, item) {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  function handleFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function getRegistroLabel() {
    if (form.especialidade === "Nutricionista") return "CRN (Conselho Regional de Nutrição)";
    if (form.especialidade === "Personal trainer") return "CREF (Conselho Regional de Educação Física)";
    if (form.especialidade === "Personal + Nutrição") return "CREF e CRN";
    return "Número de registro profissional";
  }

  function getRegistroPlaceholder() {
    if (form.especialidade === "Nutricionista") return "Ex: CRN-3 12345";
    if (form.especialidade === "Personal trainer") return "Ex: CREF 037657-G/PR";
    if (form.especialidade === "Personal + Nutrição") return "Ex: CREF 037657-G/PR | CRN-3 12345";
    return "Selecione a especialidade primeiro";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    let foto_url = null;

    if (foto) {
      const ext = foto.name.split(".").pop();
      const filename = `perfis/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("fotos")
       .upload(filename, foto, { contentType: foto.type || 'image/jpeg', upsert: true });

      if (uploadError) {
        setErro("Erro ao enviar foto. Tente novamente.");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("fotos").getPublicUrl(filename);
      foto_url = data.publicUrl;
    }

    const todasSubs = outra.trim() ? [...subs, `Outra: ${outra.trim()}`] : subs;
    const horarios = dias.length && faixas.length
      ? `${dias.join(", ")} | ${faixas.join(", ")}`
      : dias.join(", ") || faixas.join(", ");

    const { error } = await supabase.from("profissionais").insert([{
      ...form,
      subespecialidade: todasSubs.join(", "),
      horarios,
      planos_saude: planos.join(", "),
      foto_url,
      status: "pendente"
    }]);

    setLoading(false);
    if (error) { setErro("Erro ao salvar. Tente novamente."); console.error(error); }
    else setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Cadastro recebido!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Vamos verificar seu registro profissional e entrar em contato pelo WhatsApp em até <strong>24 horas</strong> para ativar seu perfil.
          </p>
        </div>
      </div>
    );
  }

  const opcoesSub = SUBESPECIALIDADES[form.especialidade] || [];
  const nutri = isNutri(form.especialidade);
  const personal = isPersonal(form.especialidade);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center px-8 py-4 bg-white border-b border-gray-100">
        <a href="/" className="flex items-center gap-1">
          <span className="text-lg font-bold text-[#1a1a1a]">Fit</span>
          <span className="text-lg font-bold text-[#4CAF50]">Connect</span>
        </a>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2" style={{letterSpacing:'-0.02em'}}>Cadastre seu perfil</h1>
          <p className="text-gray-400 text-sm leading-relaxed">Após verificação do seu registro profissional, seu perfil será ativado em até 24h.</p>
        </div>

        <div className="flex items-center gap-3 bg-[#4CAF50]/8 border border-[#4CAF50]/20 rounded-xl px-4 py-3 mb-8">
          <svg className="w-5 h-5 text-[#4CAF50] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <p className="text-xs text-[#2e7d32] font-medium">Todos os profissionais são verificados pelo CREF ou CRN antes de aparecer na plataforma.</p>
        </div>

        {erro && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{erro}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto de perfil</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                {fotoPreview
                  ? <img src={fotoPreview} alt="preview" className="w-full h-full object-cover"/>
                  : <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                }
              </div>
              <div>
                <label className="cursor-pointer bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors inline-block">
                  {fotoPreview ? "Trocar foto" : "Escolher foto"}
                  <input type="file" accept="image/*" onChange={handleFoto} className="hidden"/>
                </label>
                <p className="text-xs text-gray-400 mt-1.5">JPG ou PNG · máx. 5MB</p>
              </div>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
            <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: João Silva"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram <span className="text-gray-300">(opcional)</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="seuperfil"
                className="w-full border border-gray-200 bg-white rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
            </div>
          </div>

          {/* Especialidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidade</label>
            <select name="especialidade" value={form.especialidade} onChange={handleChange} required
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]">
              <option value="">Selecione...</option>
              <option>Personal trainer</option>
              <option>Nutricionista</option>
              <option>Personal + Nutrição</option>
            </select>
          </div>

          {/* Sub-especialidades */}
          {opcoesSub.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sub-especialidades <span className="text-gray-400 font-normal">(selecione todas que se aplicam)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {opcoesSub.map(sub => (
                  <button key={sub} type="button" onClick={() => toggle(subs, setSubs, sub)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      subs.includes(sub) ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-gray-600 border-gray-200 hover:border-[#4CAF50]/50"
                    }`}>
                    {sub}
                  </button>
                ))}
              </div>
              <input value={outra} onChange={e => setOutra(e.target.value)} placeholder="Outra (descreva)"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
            </div>
          )}

          {/* Registro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{getRegistroLabel()}</label>
            <input name="registro" value={form.registro} onChange={handleChange} required
              placeholder={getRegistroPlaceholder()} disabled={!form.especialidade}
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] disabled:opacity-40 disabled:cursor-not-allowed"/>
            {form.especialidade && <p className="text-xs text-gray-400 mt-1.5">Será verificado antes da ativação do perfil.</p>}
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade</label>
            <input name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Ex: Fortaleza, CE"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
          </div>

          {/* Valores */}
          {(nutri || personal) && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
              <p className="text-sm font-semibold text-gray-700">Valores</p>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {nutri ? "Valor da primeira consulta (R$)" : "Valor da primeira aula (R$)"}
                </label>
                <input name="valor_primeira" value={form.valor_primeira} onChange={handleChange} required placeholder="Ex: 200"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {nutri ? "Valor das demais consultas (R$)" : "Valor das demais aulas (R$)"}
                </label>
                <input name="valor_demais" value={form.valor_demais} onChange={handleChange} placeholder="Ex: 150"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
              </div>
              {personal && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Valor da aula avulsa (R$)</label>
                  <input name="valor_avulsa" value={form.valor_avulsa} onChange={handleChange} placeholder="Ex: 80"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
                </div>
              )}
            </div>
          )}

          {/* Horários */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-gray-700">Disponibilidade</p>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Dias</label>
              <div className="flex flex-wrap gap-2">
                {DIAS.map(dia => (
                  <button key={dia} type="button" onClick={() => toggle(dias, setDias, dia)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      dias.includes(dia) ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4CAF50]/50"
                    }`}>
                    {dia}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Faixas de horário</label>
              <div className="flex flex-wrap gap-2">
                {FAIXAS.map(f => (
                  <button key={f} type="button" onClick={() => toggle(faixas, setFaixas, f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      faixas.includes(f) ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4CAF50]/50"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Planos de saúde — só para nutricionista */}
          {!personal && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Planos de saúde aceitos <span className="text-gray-400 font-normal">(selecione todos que se aplicam)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLANOS.map(p => (
                <button key={p} type="button" onClick={() => toggle(planos, setPlanos, p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    planos.includes(p) ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-gray-600 border-gray-200 hover:border-[#4CAF50]/50"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp</label>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} required placeholder="Ex: 85999999999"
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"/>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio <span className="text-gray-300">(opcional)</span></label>
            <textarea name="bio" value={form.bio} onChange={handleChange}
              placeholder="Fale sobre você, sua metodologia e resultados..." rows={3}
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] resize-none"/>
          </div>

          <button type="submit" disabled={loading}
            className="bg-[#1a1a1a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#4CAF50] transition-colors disabled:opacity-50 mt-2">
            {loading ? "Enviando..." : "Enviar para verificação"}
          </button>

          <p className="text-xs text-gray-400 text-center">Você receberá uma confirmação no WhatsApp em até 24h.</p>

        </form>
      </main>
    </div>
  );
}