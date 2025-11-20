import UploadFlow from './components/UploadFlow'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="px-6 py-5 sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" className="w-8 h-8" />
            <span className="font-semibold tracking-tight">Smart Size</span>
          </div>
          <a href="/test" className="text-sm text-white/70 hover:text-white">System Check</a>
        </div>
      </header>

      <main className="px-6">
        <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 py-10">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Find your perfect size with one photo</h1>
            <p className="text-white/70">Upload a full‑body picture, add your height for accuracy, and get precise clothing sizes instantly. Photos are processed in memory — nothing is stored without consent.</p>
            <ul className="text-white/70 text-sm list-disc pl-5 space-y-1">
              <li>Mobile‑friendly capture</li>
              <li>GDPR/CCPA compliant by design</li>
              <li>Works across categories and brands</li>
            </ul>
          </div>

          <UploadFlow />
        </section>

        <section className="max-w-5xl mx-auto py-10 border-t border-white/10">
          <h2 className="text-xl font-semibold mb-3">Privacy</h2>
          <p className="text-white/70 text-sm">We follow privacy by design. Images never leave your session nor get stored on our servers. With explicit consent, we may save only derived measurements and the recommendation to improve your next visit. You can request deletion anytime.</p>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-white/10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Smart Size · Privacy‑first recommendations
      </footer>
    </div>
  )
}

export default App
