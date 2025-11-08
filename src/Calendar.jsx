import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
const defaultEvents = [
  { id: 1, title: "Kickoff Meeting", date: "2025-11-07", time: "10:00", durationMinutes: 60 },
  { id: 2, title: "Client Demo", date: "2025-11-07", time: "10:30", durationMinutes: 45 },
  { id: 3, title: "Code Review", date: "2025-11-08", time: "14:00", durationMinutes: 90 },
  { id: 4, title: "Design Sync", date: "2025-11-12", time: "11:00", durationMinutes: 30 },
  { id: 5, title: "Townhall", date: "2025-11-12", time: "11:15", durationMinutes: 120 },
  { id: 6, title: "1:1", date: "2025-11-20", time: "16:00", durationMinutes: 30 },
];
const laneColorsLight = ["bg-blue-100 border-blue-400","bg-green-100 border-green-400","bg-yellow-100 border-yellow-500","bg-purple-100 border-purple-400","bg-pink-100 border-pink-400","bg-orange-100 border-orange-400","bg-teal-100 border-teal-400"];
const laneColorsDark  = ["bg-blue-900/30 border-blue-400/70","bg-green-900/30 border-green-400/70","bg-yellow-900/30 border-yellow-500/70","bg-purple-900/30 border-purple-400/70","bg-pink-900/30 border-pink-400/70","bg-orange-900/30 border-orange-400/70","bg-teal-900/30 border-teal-400/70"];
function minutesSinceStartOfDay(t){ const [h,m]=t.split(":").map(Number); return h*60+m; }
function assignEventLanes(eventsForDay){ const sorted=[...eventsForDay].sort((a,b)=>minutesSinceStartOfDay(a.time)-minutesSinceStartOfDay(b.time)); const lanesEnd=[]; const placed=sorted.map(ev=>{ const s=minutesSinceStartOfDay(ev.time), e=s+(ev.durationMinutes??60); let lane=0; for(;lane<lanesEnd.length;lane++){ if(s>=lanesEnd[lane]) break; } lanesEnd[lane]=e; return {...ev,_lane:lane,_startMin:s,_endMin:e}; }); return { placed, laneCount:lanesEnd.length }; }
function useIsDark(){ const [dark,setDark]=useState(()=>document.documentElement.classList.contains('dark')); useEffect(()=>{ const obs=new MutationObserver(()=>setDark(document.documentElement.classList.contains('dark'))); obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']}); return ()=>obs.disconnect(); },[]); return dark; }
function DayCell({ d, monthRef, events, today, onSelect }){
  const isCurrentMonth=d.month()===monthRef.month(); const isToday=d.isSame(today,"day"); const {placed,laneCount}=useMemo(()=>assignEventLanes(events),[events]); const overlaps=laneCount>1; const isDark=useIsDark();
  const chipClasses=["size-7 flex items-center justify-center rounded-full text-sm font-medium", isToday?"bg-ss-yellow text-black ring-2 ring-ss-yellow/60":(isDark?"text-gray-200":"text-gray-700"), !isCurrentMonth&&(isDark?"text-gray-500":"text-gray-400")].join(" ");
  return (<button onClick={()=>onSelect(d)} className={["relative h-28 w-full rounded-2xl p-2 text-left transition hover:shadow", isCurrentMonth?"bg-white dark:bg-[#0F1113]":"bg-gray-50 dark:bg-[#0B0D0E]", "border border-gray-200 dark:border-gray-800","focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ss-yellow/50"].join(" ")}>
    <div className="flex items-center justify-between">
      <div className={chipClasses}>{d.date()}</div>
      {overlaps && (<span className="text-[10px] rounded-full px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300/70">Overlap</span>)}
    </div>
    <div className="mt-2 space-y-1">
      {placed.slice(0,3).map(ev=>(<div key={ev.id} className={["truncate rounded-md border px-2 py-0.5 text-[11px]",(isDark?laneColorsDark:laneColorsLight)[ev._lane%laneColorsLight.length],"text-current"].join(" ")} title={`${ev.time} • ${ev.title}`}><span className="font-semibold">{ev.time}</span> {ev.title}</div>))}
      {placed.length>3 && (<div className="text-[11px] text-gray-500 dark:text-gray-400">+{placed.length-3} more…</div>)}
    </div></button>);
}
export default function Calendar({ brandYellow=false }){
  const [current,setCurrent]=useState(dayjs()); const [selectedDay,setSelectedDay]=useState(null); const [events,setEvents]=useState(defaultEvents);
  const [newTitle,setNewTitle]=useState(""); const [newTime,setNewTime]=useState("09:00"); const [newDuration,setNewDuration]=useState(60); const [errorMsg,setErrorMsg]=useState(""); 
  useEffect(()=>{ try{ const raw=localStorage.getItem("calendarEvents"); if(raw){ const parsed=JSON.parse(raw); if(Array.isArray(parsed)) setEvents(parsed);} }catch{} },[]);
  useEffect(()=>{ try{ localStorage.setItem("calendarEvents", JSON.stringify(events)); }catch{} },[events]);
  const today=dayjs(); const monthStart=current.startOf("month"); const gridStart=monthStart.subtract(monthStart.day(),"day"); const days=Array.from({length:42},(_,i)=>gridStart.add(i,"day"));
  const groupedEvents=useMemo(()=>{ const map=new Map(); for(const ev of events){ const key=dayjs(ev.date).format("YYYY-MM-DD"); if(!map.has(key)) map.set(key,[]); map.get(key).push(ev);} return map; },[events]);
  const monthEventsCount=useMemo(()=>{ const start=monthStart.startOf("month"), end=monthStart.endOf("month"); return events.filter(e=>{ const d=dayjs(e.date); return d.isAfter(start.subtract(1,"day"))&&d.isBefore(end.add(1,"day")); }).length; },[events,monthStart]);
  function gotoPrevMonth(){ setCurrent(c=>c.subtract(1,"month")); } function gotoNextMonth(){ setCurrent(c=>c.add(1,"month")); } function gotoPrevYear(){ setCurrent(c=>c.subtract(1,"year")); } function gotoNextYear(){ setCurrent(c=>c.add(1,"year")); } function gotoToday(){ setCurrent(dayjs()); setSelectedDay(dayjs()); }
  function isValidTime(t){ const [hh,mm]=String(t).split(":").map(Number); return Number.isInteger(hh)&&Number.isInteger(mm)&&hh>=0&&hh<24&&mm>=0&&mm<60; }
  function handleAddEvent(){ setErrorMsg(""); if(!selectedDay){ setErrorMsg("Select a date first."); return; } if(!isValidTime(newTime)){ setErrorMsg("Time must be HH:mm (24h)."); return; } const dur=parseInt(String(newDuration),10); if(!(dur>0)){ setErrorMsg("Duration must be a positive number (minutes)."); return; } if(!newTitle.trim()){ setErrorMsg("Title is required."); return; } const dateStr=selectedDay.format("YYYY-MM-DD"); const nextId=(events.reduce((m,e)=>Math.max(m,e.id||0),0)+1)||1; const ev={id:nextId,title:newTitle.trim(),date:dateStr,time:newTime.trim(),durationMinutes:dur}; setEvents(prev=>[...prev,ev]); setNewTitle(""); }
  function handleDeleteEvent(id){ setEvents(prev=>prev.filter(e=>e.id!==id)); }
  function exportJson(){ const blob=new Blob([JSON.stringify(events,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='events.json'; a.click(); URL.revokeObjectURL(url); }
  const weeks=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; const selectedKey=selectedDay?selectedDay.format("YYYY-MM-DD"):null; const selectedEventsRaw=selectedKey?(groupedEvents.get(selectedKey)??[]):[]; const selectedWithLanes=useMemo(()=>assignEventLanes(selectedEventsRaw),[selectedEventsRaw]);
  return (<div className="w-full">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-2xl font-bold flex items-center gap-2"><span className="inline-block size-3 rounded-full" style={{background: brandYellow ? '#FFC107' : '#6366F1'}}></span>Calendar</h2><p className="text-sm text-gray-600 dark:text-gray-400">{current.format("MMMM YYYY")} · {monthEventsCount} events</p></div>
      <div className="flex items-center gap-2">
        <button onClick={gotoPrevYear} className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 dark:bg-[#0B0D0E] dark:border-gray-700">« Year</button>
        <button onClick={gotoPrevMonth} className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 dark:bg-[#0B0D0E] dark:border-gray-700">‹ Month</button>
        <button onClick={gotoToday} className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 dark:bg-[#0B0D0E] dark:border-gray-700">Today</button>
        <button onClick={gotoNextMonth} className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 dark:bg-[#0B0D0E] dark:border-gray-700">Month ›</button>
        <button onClick={gotoNextYear} className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 dark:bg-[#0B0D0E] dark:border-gray-700">Year »</button>
        <button onClick={exportJson} className="rounded-xl bg-ss-yellow px-3 py-2 text-sm font-medium text-black hover:brightness-95">Export JSON</button>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-2">{weeks.map(w=>(<div key={w} className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{w}</div>))}</div>
    <div className="grid grid-cols-7 gap-2">{days.map(d=>{ const key=d.format("YYYY-MM-DD"); const eventsForDay=groupedEvents.get(key)??[]; return (<DayCell key={key} d={d} monthRef={monthStart} events={eventsForDay} today={today} onSelect={setSelectedDay} />); })}</div>
    <div className="mt-6 card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{selectedDay ? selectedDay.format("dddd, MMM D, YYYY") : "Select a date"}</h3>
        {selectedDay && selectedWithLanes.laneCount>1 && (<span className="text-xs rounded-full px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300/70">{selectedWithLanes.laneCount} overlapping lanes</span>)}
      </div>
      {!selectedDay && (<p className="text-sm text-gray-600 dark:text-gray-400">Tip: Click a date to view or add events.</p>)}
      {selectedDay && (<>
        <ul className="space-y-2">
          {selectedWithLanes.placed.length===0 && (<li className="text-sm text-gray-600 dark:text-gray-400">No events.</li>)}
          {selectedWithLanes.placed.map(ev=>(<li key={ev.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-start gap-3">
              <div className="text-sm font-semibold min-w-20">{ev.time}</div>
              <div className="text-sm"><div className="font-medium">{ev.title}</div><div className="text-xs text-gray-600 dark:text-gray-400">Duration: {ev.durationMinutes} min</div></div>
            </div>
            <button onClick={()=>handleDeleteEvent(ev.id)} className="text-xs rounded-md border bg-white/70 px-2 py-1 hover:bg-red-50 text-red-700 border-red-200 dark:bg-[#121416] dark:border-gray-700 dark:hover:bg-[#16181B]">✕</button>
          </li>))}
        </ul>
        <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0E1012] p-3">
          <div className="mb-2 text-sm font-semibold">Add event on {selectedDay.format("YYYY-MM-DD")}</div>
          {errorMsg && (<div className="mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1">{errorMsg}</div>)}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Title" className="col-span-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121416] px-3 py-2 text-sm"/>
            <input value={newTime} onChange={e=>setNewTime(e.target.value)} placeholder="HH:mm" className="col-span-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121416] px-3 py-2 text-sm"/>
            <input type="number" value={newDuration} onChange={e=>setNewDuration(e.target.value)} placeholder="minutes" className="col-span-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121416] px-3 py-2 text-sm"/>
            <button onClick={handleAddEvent} className="col-span-1 rounded-lg bg-ss-yellow px-3 py-2 text-sm font-medium text-black hover:brightness-95">Add</button>
          </div>
        </div>
      </>)}
    </div>
  </div>);
}