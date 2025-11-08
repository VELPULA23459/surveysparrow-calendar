import React, { useEffect, useState } from 'react'
import Calendar from './Calendar.jsx'
function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme'); if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    const cl = document.documentElement.classList
    if (dark) { cl.add('dark'); localStorage.setItem('theme','dark') }
    else { cl.remove('dark'); localStorage.setItem('theme','light') }
  }, [dark])
  return [dark, setDark]
}
export default function App() {
  const [dark, setDark] = useTheme()
  return (
    <div className={["min-h-screen", dark ? "bg-[#0B0D0E] text-white" : "bg-gray-100 text-[#111827]"].join(" ")}>
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-[#0B0D0E]/70 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-ss-yellow"></div>
            <div>
              <h1 className="text-lg font-semibold">SurveySparrow — Calendar Pro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Light/Dark · Add/Delete · Export JSON</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 dark:bg-[#0B0D0E] dark:border-gray-700 dark:hover:bg-[#121416]" title="Toggle theme">
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <a href="https://surveysparrow.com/" target="_blank" rel="noreferrer" className="rounded-xl bg-ss-yellow px-3 py-2 text-sm font-medium text-black hover:brightness-95">SurveySparrow</a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6"><Calendar brandYellow /></main>
      <footer className="mx-auto max-w-6xl p-6 text-xs text-gray-500 dark:text-gray-400"><span>© {new Date().getFullYear()} Calendar Pro · Built for assignment demo.</span></footer>
    </div>
  )
}