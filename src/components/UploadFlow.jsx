import { useState, useRef } from 'react'

const categories = [
  { key: 'tshirt', label: 'T‑Shirt' },
  { key: 'shirt', label: 'Shirt' },
  { key: 'hoodie', label: 'Hoodie' },
  { key: 'jacket', label: 'Jacket' },
  { key: 'pants', label: 'Pants' },
  { key: 'jeans', label: 'Jeans' },
  { key: 'dress', label: 'Dress' },
  { key: 'skirt', label: 'Skirt' },
]

export default function UploadFlow() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [height, setHeight] = useState('')
  const [category, setCategory] = useState('tshirt')
  const [consent, setConsent] = useState(false)
  const [brand, setBrand] = useState('generic')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef()

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onPick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const onCapture = () => inputRef.current?.click()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setResult(null)

    try {
      const form = new FormData()
      form.append('image', file)
      if (height) form.append('height_cm', height)
      form.append('brand', brand)
      form.append('category', category)
      form.append('consent', String(consent))

      const res = await fetch(`${backend}/analyze`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-sm text-white/80 mb-2">Full‑body photo</label>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPick}
            className="block w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
          {preview && (
            <img src={preview} alt="preview" className="mt-3 w-full rounded-lg object-contain max-h-96" />
          )}
          <p className="text-xs text-white/60 mt-2">Photos are processed in memory and not stored. Enable consent below to save derived measurements.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block text-sm text-white/80 mb-2">Your height (cm)</label>
            <input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              inputMode="decimal"
              placeholder="e.g. 172"
              className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white placeholder-white/40"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block text-sm text-white/80 mb-2">Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white">
              {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-sm text-white/80 mb-2">Brand (optional)</label>
          <input value={brand} onChange={(e)=>setBrand(e.target.value)} placeholder="generic" className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white placeholder-white/40" />
        </div>

        <label className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
          <input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} className="mt-1" />
          <span className="text-sm text-white/80">I agree to the processing of this photo solely to compute measurements and receive size recommendations. Save derived measurements to improve future suggestions. You can request deletion at any time.</span>
        </label>

        <button disabled={loading || !file} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 transition">
          {loading ? 'Analyzing…' : 'Get my size'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 text-white">
          {result.error ? (
            <p className="text-red-300">{result.error}</p>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-semibold">Suggested size: {result.recommendation?.suggested_size}</div>
              <div className="text-sm text-white/80">Confidence: {(result.recommendation?.confidence*100)?.toFixed(0)}%</div>
              <div className="text-sm text-white/60">Metric used: {result.recommendation?.details?.metric} = {result.recommendation?.details?.value_cm} cm</div>
              <div className="text-sm text-white/60">Range matched: {result.recommendation?.details?.range_cm?.join(' – ')} cm</div>
              <div className="text-sm text-white/60">Privacy: image stored: {String(result.privacy?.image_stored)}, derived saved: {String(result.privacy?.derived_data_stored)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
