export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-[#1a1a1a]">Fit</span>
          <span className="text-xl font-bold text-[#4CAF50]">Connect</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Como funciona</a>
          <a href="#profissionais" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Para profissionais</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
            Entrar
          </a>
          <a href="/cadastro" className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4CAF50] transition-colors">
            Sou profissional
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-8 py-24 text-center bg-white">
        <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#2e7d32] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full"></span>
          Plataforma #1 de profissionais fitness em Fortaleza
        </div>
        <h1 className="text-6xl font-bold text-[#1a1a1a] leading-tight max-w-3xl mb-6" style={{letterSpacing: '-0.03em'}}>
          O profissional certo para a sua transformação
        </h1>
        <p className="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed font-normal">
          Encontre personal trainers e nutricionistas verificados, veja avaliações reais e conecte-se em segundos.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <a href="/buscar" className="bg-[#4CAF50] text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-[#43a047] transition-colors shadow-sm">
            Encontrar profissional →
          </a>
          <a href="/cadastro" className="bg-gray-50 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
            Cadastrar perfil grátis
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-6 mt-12 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['#4CAF50','#2196F3','#FF9800','#E91E63'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{backgroundColor: c}}></div>
              ))}
            </div>
            <span className="text-sm text-gray-500">+200 profissionais</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-sm text-gray-500">4.9 de avaliação média</span>
          </div>
        </div>
      </main>

      {/* Logos bar */}
      <div className="border-y border-gray-100 py-6 bg-gray-50">
        <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest mb-4">Profissionais de todas as especialidades</p>
        <div className="flex justify-center gap-10 flex-wrap px-8">
          {['Personal Trainer','Nutricionista','Emagrecimento','Musculação','Pilates','Crossfit'].map((item) => (
            <span key={item} className="text-sm text-gray-400 font-medium">{item}</span>
          ))}
        </div>
      </div>

      {/* Como funciona */}
      <section id="como-funciona" className="py-24 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#4CAF50] font-bold uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a]" style={{letterSpacing: '-0.02em'}}>
              Simples, rápido e eficiente
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { passo: "01", titulo: "Diga seu objetivo", desc: "Emagrecimento, ganho de massa ou saúde. Você escolhe o foco e filtramos os melhores." },
              { passo: "02", titulo: "Veja os perfis", desc: "Profissionais verificados com avaliações, especialidades, fotos e valores transparentes." },
              { passo: "03", titulo: "Conecte em segundos", desc: "Entre em contato direto pelo WhatsApp e comece sua transformação hoje." },
            ].map((item) => (
              <div key={item.passo} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <span className="text-3xl font-bold text-[#4CAF50]/30 mb-4 block">{item.passo}</span>
                <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">{item.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark section */}
      <section className="bg-[#0f0f0f] px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-[#4CAF50] font-bold uppercase tracking-widest mb-3">Para profissionais</p>
            <h2 className="text-4xl font-bold text-white" style={{letterSpacing: '-0.02em'}}>
              Receba leads qualificados todo mês
            </h2>
            <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Cadastre seu perfil e apareça para centenas de pessoas buscando exatamente o que você oferece.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { numero: "200+", label: "Profissionais cadastrados" },
              { numero: "1.200+", label: "Conexões realizadas" },
              { numero: "R$0", label: "Para começar" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
                <div className="text-4xl font-bold text-white mb-1">{item.numero}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="/cadastro" className="bg-[#4CAF50] text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-[#43a047] transition-colors inline-block">
              Cadastrar perfil grátis →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-8 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-[#1a1a1a]">Fit</span>
            <span className="text-sm font-bold text-[#4CAF50]">Connect</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 FitConnect · Fortaleza, CE</p>
          <div className="flex gap-6">
            <a href="/cadastro" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Para profissionais</a>
            <a href="/buscar" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Encontrar profissional</a>
          </div>
        </div>
      </footer>

    </div>
  );
}