export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">Fit</span>
          <span className="text-2xl font-bold text-green-500">Connect</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Entrar
          </a>
          <a href="/cadastro" className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600">
            Sou profissional
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Personal trainers e nutricionistas em Fortaleza
        </span>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-2xl mb-6">
          Encontre o profissional certo para o seu objetivo
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Conectamos você com personal trainers e nutricionistas especializados em emagrecimento e performance.
        </p>
        <div className="flex gap-4">
          <a href="/buscar" className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600">
            Encontrar profissional
          </a>
          <a href="/cadastro" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50">
            Sou profissional
          </a>
        </div>
      </main>

      {/* Cards de categorias */}
      <section className="flex justify-center gap-6 px-8 pb-24 flex-wrap">
        {[
          { titulo: "Emagrecimento", desc: "Perca peso com acompanhamento profissional" },
          { titulo: "Musculação", desc: "Ganhe massa com treinos personalizados" },
          { titulo: "Nutrição", desc: "Dieta sob medida para seu objetivo" },
        ].map((item) => (
          <div key={item.titulo} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 w-64 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">{item.titulo}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}