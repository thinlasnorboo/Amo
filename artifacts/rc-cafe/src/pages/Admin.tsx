import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetStats,
  useListBookings,
  useUpdateBooking,
  useDeleteBooking,
  useListContactMessages,
  useListServices,
  useListMenuItems,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "overview" | "bookings" | "messages" | "services" | "menu";
type BookingStatus = "pending" | "confirmed" | "cancelled";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:   "background:rgba(234,179,8,0.15);color:#eab308;border:1px solid rgba(234,179,8,0.3)",
  confirmed: "background:rgba(34,197,94,0.12);color:#22c55e;border:1px solid rgba(34,197,94,0.25)",
  cancelled: "background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.25)",
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status as BookingStatus] ?? STATUS_STYLES.pending;
  return (
    <span style={{ display:"inline-block", padding:"2px 12px", fontSize:"10px", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", ...Object.fromEntries(s.split(";").filter(Boolean).map(p => { const [k,...v] = p.split(":"); return [k.trim().replace(/-([a-z])/g,(_:string,c:string)=>c.toUpperCase()), v.join(":").trim()]; })) }}>
      {status}
    </span>
  );
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: bookings, isLoading: bookingsLoading } = useListBookings();
  const { data: messages, isLoading: msgsLoading } = useListContactMessages();
  const { data: services } = useListServices();
  const { data: menuItems } = useListMenuItems();

  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();

  const filteredBookings = bookings?.filter(b =>
    statusFilter === "all" ? true : b.status === statusFilter
  );

  const css = `
    .adm { min-height:100vh; background:hsl(0 0% 4%); padding-top:80px; font-family:'Inter',sans-serif; }
    .adm-header { border-bottom:1px solid hsl(0 0% 12%); background:hsl(0 0% 6%); padding:32px; }
    .adm-header h1 { font-family:'Playfair Display',serif; font-size:2rem; color:hsl(0 0% 98%); margin-bottom:4px; }
    .adm-header p { font-size:13px; color:hsl(0 0% 60%); }
    .adm-tabs { display:flex; gap:0; border-bottom:1px solid hsl(0 0% 12%); background:hsl(0 0% 6%); overflow-x:auto; }
    .adm-tab { padding:16px 28px; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:hsl(0 0% 60%); border:none; background:none; cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:.25s; }
    .adm-tab:hover { color:hsl(44 55% 54%); }
    .adm-tab.on { color:hsl(44 55% 54%); border-color:hsl(44 55% 54%); }
    .adm-body { padding:40px 32px; max-width:1280px; }
    .stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:40px; }
    .stat-card { background:hsl(0 0% 6%); border:1px solid hsl(0 0% 12%); padding:28px; }
    .stat-card .num { font-family:'Playfair Display',serif; font-size:2.4rem; color:hsl(44 55% 54%); display:block; margin-bottom:6px; }
    .stat-card .lbl { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:hsl(0 0% 60%); }
    .section-title { font-family:'Playfair Display',serif; font-size:1.4rem; color:hsl(0 0% 98%); margin-bottom:24px; }
    .filter-row { display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap; }
    .flt { padding:8px 20px; font-size:10px; letter-spacing:.15em; text-transform:uppercase; background:hsl(0 0% 6%); border:1px solid hsl(0 0% 12%); color:hsl(0 0% 60%); cursor:pointer; transition:.2s; }
    .flt:hover { border-color:hsl(44 55% 54%); color:hsl(44 55% 54%); }
    .flt.on { background:hsl(44 55% 54%); color:hsl(0 0% 9%); border-color:hsl(44 55% 54%); }
    table { width:100%; border-collapse:collapse; }
    th { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:hsl(0 0% 60%); padding:12px 16px; text-align:left; border-bottom:1px solid hsl(0 0% 12%); background:hsl(0 0% 6%); }
    td { padding:14px 16px; font-size:13px; color:hsl(0 0% 80%); border-bottom:1px solid hsl(0 0% 10%); vertical-align:middle; }
    tr:hover td { background:rgba(255,255,255,0.02); }
    .action-btn { padding:6px 14px; font-size:10px; letter-spacing:.12em; text-transform:uppercase; border:1px solid; cursor:pointer; background:none; transition:.2s; margin-right:6px; }
    .btn-confirm { border-color:rgba(34,197,94,0.4); color:#22c55e; }
    .btn-confirm:hover { background:rgba(34,197,94,0.12); }
    .btn-cancel  { border-color:rgba(234,179,8,0.4);  color:#eab308; }
    .btn-cancel:hover  { background:rgba(234,179,8,0.1); }
    .btn-del     { border-color:rgba(239,68,68,0.35);  color:#ef4444; }
    .btn-del:hover     { background:rgba(239,68,68,0.1); }
    .msg-card { background:hsl(0 0% 6%); border:1px solid hsl(0 0% 12%); padding:24px; margin-bottom:12px; }
    .msg-card h4 { font-size:14px; color:hsl(0 0% 98%); margin-bottom:4px; }
    .msg-card .meta { font-size:11px; color:hsl(0 0% 50%); margin-bottom:12px; letter-spacing:.05em; }
    .msg-card p { font-size:13px; color:hsl(0 0% 65%); line-height:1.75; }
    .srv-card { background:hsl(0 0% 6%); border:1px solid hsl(0 0% 12%); padding:24px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
    .srv-card h4 { font-size:15px; color:hsl(0 0% 98%); margin-bottom:4px; }
    .srv-card p  { font-size:12px; color:hsl(0 0% 55%); }
    .price-tag { font-family:'Playfair Display',serif; font-size:1.3rem; color:hsl(44 55% 54%); white-space:nowrap; }
    .empty-state { text-align:center; padding:60px; border:1px solid hsl(0 0% 12%); background:hsl(0 0% 6%); }
    .empty-state p { font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:hsl(0 0% 45%); }
    .skel { background:hsl(0 0% 10%); border-radius:2px; animation:pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.3} }
    .dot-feat { display:inline-block; width:6px; height:6px; border-radius:50%; background:hsl(44 55% 54%); margin-right:8px; vertical-align:middle; }
    @media(max-width:768px) { .stat-grid{grid-template-columns:1fr 1fr} .adm-body{padding:24px 16px} }
    @media(max-width:480px) { .stat-grid{grid-template-columns:1fr} }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="adm">
        {/* Header */}
        <div className="adm-header">
          <div style={{ maxWidth:1280, padding:"0 32px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:"hsl(44 55% 54%)",display:"inline-block" }} />
              <h1>Admin Panel</h1>
            </div>
            <p>RC Track Café — Manage bookings, messages, and venue content</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="adm-tabs">
          {(["overview","bookings","messages","services","menu"] as Tab[]).map(t => (
            <button key={t} className={`adm-tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>
              {t === "overview" ? "Overview" : t === "bookings" ? `Bookings${bookings ? ` (${bookings.length})` : ""}` : t === "messages" ? `Messages${messages ? ` (${messages.length})` : ""}` : t === "services" ? `Services${services ? ` (${services.length})` : ""}` : `Menu${menuItems ? ` (${menuItems.length})` : ""}`}
            </button>
          ))}
        </div>

        <div className="adm-body">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
              <div className="stat-grid">
                {statsLoading ? [...Array(7)].map((_,i)=>(
                  <div key={i} className="stat-card"><div className="skel" style={{height:48,marginBottom:10}} /><div className="skel" style={{height:12,width:100}} /></div>
                )) : stats ? (<>
                  <div className="stat-card"><span className="num">{stats.totalBookings}</span><span className="lbl">Total Bookings</span></div>
                  <div className="stat-card"><span className="num">{stats.confirmedBookings}</span><span className="lbl">Confirmed</span></div>
                  <div className="stat-card"><span className="num">{stats.pendingBookings}</span><span className="lbl">Pending</span></div>
                  <div className="stat-card"><span className="num">{stats.totalTracks}</span><span className="lbl">Pro Tracks</span></div>
                  <div className="stat-card"><span className="num">{stats.memberCount}+</span><span className="lbl">Club Members</span></div>
                  <div className="stat-card"><span className="num">{stats.coffeeVarieties}</span><span className="lbl">Coffee Varieties</span></div>
                  <div className="stat-card"><span className="num">{stats.yearsOpen}</span><span className="lbl">Years Open</span></div>
                </>) : null}
              </div>

              {/* Recent bookings preview */}
              <h3 className="section-title">Recent Bookings</h3>
              {bookingsLoading ? (
                <div>{[...Array(3)].map((_,i)=><div key={i} className="skel" style={{height:56,marginBottom:8}} />)}</div>
              ) : bookings && bookings.length > 0 ? (
                <div style={{overflowX:"auto"}}>
                  <table>
                    <thead><tr><th>Name</th><th>Experience</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {bookings.slice(0,5).map(b=>(
                        <tr key={b.id}>
                          <td style={{color:"hsl(0 0% 98%)",fontWeight:500}}>{b.firstName} {b.lastName}</td>
                          <td>{b.experienceType}</td>
                          <td>{b.date}</td>
                          <td>{b.time}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            {b.status !== "confirmed"  && <button className="action-btn btn-confirm" onClick={()=>updateBooking.mutate({id:b.id, data:{status:"confirmed"}})}>Confirm</button>}
                            {b.status !== "cancelled"  && <button className="action-btn btn-cancel"  onClick={()=>updateBooking.mutate({id:b.id, data:{status:"cancelled"}})}>Cancel</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length > 5 && (
                    <p style={{fontSize:12,color:"hsl(0 0% 50%)",marginTop:12,textAlign:"center",cursor:"pointer",letterSpacing:".1em"}} onClick={()=>setTab("bookings")}>
                      View all {bookings.length} bookings &rarr;
                    </p>
                  )}
                </div>
              ) : (
                <div className="empty-state"><p>No bookings yet</p></div>
              )}
            </motion.div>
          )}

          {/* ── BOOKINGS ── */}
          {tab === "bookings" && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
              <h3 className="section-title">All Reservations</h3>
              <div className="filter-row">
                {["all","pending","confirmed","cancelled"].map(f=>(
                  <button key={f} className={`flt ${statusFilter===f?"on":""}`} onClick={()=>setStatusFilter(f)}>{f}</button>
                ))}
              </div>
              {bookingsLoading ? (
                <div>{[...Array(5)].map((_,i)=><div key={i} className="skel" style={{height:56,marginBottom:8}} />)}</div>
              ) : filteredBookings && filteredBookings.length > 0 ? (
                <div style={{overflowX:"auto"}}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Experience</th>
                        <th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(b=>(
                        <tr key={b.id}>
                          <td style={{color:"hsl(0 0% 45%)",fontSize:12}}>#{b.id}</td>
                          <td style={{color:"hsl(0 0% 98%)",fontWeight:500}}>{b.firstName} {b.lastName}</td>
                          <td style={{color:"hsl(0 0% 55%)",fontSize:12}}>{b.email}</td>
                          <td>{b.experienceType}</td>
                          <td>{b.date}</td>
                          <td>{b.time}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            {b.status !== "confirmed" && (
                              <button className="action-btn btn-confirm" disabled={updateBooking.isPending}
                                onClick={()=>updateBooking.mutate({id:b.id, data:{status:"confirmed"}})}>
                                Confirm
                              </button>
                            )}
                            {b.status !== "cancelled" && (
                              <button className="action-btn btn-cancel" disabled={updateBooking.isPending}
                                onClick={()=>updateBooking.mutate({id:b.id, data:{status:"cancelled"}})}>
                                Cancel
                              </button>
                            )}
                            {b.status === "pending" && (
                              <button className="action-btn btn-del" disabled={deleteBooking.isPending}
                                onClick={()=>{ if(confirm(`Delete booking #${b.id}?`)) deleteBooking.mutate({id:b.id}); }}>
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state"><p>No {statusFilter !== "all" ? statusFilter : ""} bookings found</p></div>
              )}
            </motion.div>
          )}

          {/* ── MESSAGES ── */}
          {tab === "messages" && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
              <h3 className="section-title">Contact Messages</h3>
              {msgsLoading ? (
                <div>{[...Array(4)].map((_,i)=><div key={i} className="skel" style={{height:100,marginBottom:12}} />)}</div>
              ) : messages && messages.length > 0 ? (
                [...messages].reverse().map(m=>(
                  <div key={m.id} className="msg-card">
                    <h4>{m.name} {m.subject ? <span style={{fontWeight:400,color:"hsl(0 0% 55%)"}}>&mdash; {m.subject}</span> : null}</h4>
                    <p className="meta">{m.email} &middot; {new Date(m.createdAt).toLocaleString("en-AE",{dateStyle:"medium",timeStyle:"short"})}</p>
                    <p>{m.message}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state"><p>No messages yet</p></div>
              )}
            </motion.div>
          )}

          {/* ── SERVICES ── */}
          {tab === "services" && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
              <h3 className="section-title">Services</h3>
              {services && services.length > 0 ? (
                services.map(s=>(
                  <div key={s.id} className="srv-card">
                    <div style={{flex:1}}>
                      <h4>
                        {s.featured && <span className="dot-feat" title="Featured" />}
                        {s.name}
                      </h4>
                      <p style={{marginBottom:6}}>{s.description}</p>
                      <p style={{color:"hsl(0 0% 40%)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase"}}>{s.category}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div className="price-tag">AED {s.priceFrom.toLocaleString()}</div>
                      <div style={{fontSize:11,color:"hsl(0 0% 50%)",letterSpacing:".1em",textTransform:"uppercase",marginTop:2}}>/ {s.priceUnit}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state"><p>Loading services...</p></div>
              )}
            </motion.div>
          )}

          {/* ── MENU ── */}
          {tab === "menu" && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
              <h3 className="section-title">Menu Items</h3>
              {menuItems && menuItems.length > 0 ? (
                (["espresso","filter","cold","specialty","food"] as const).map(cat => {
                  const items = menuItems.filter(m=>m.category===cat);
                  if (!items.length) return null;
                  return (
                    <div key={cat} style={{marginBottom:40}}>
                      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20}}>
                        <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",color:"hsl(0 0% 98%)",textTransform:"capitalize",whiteSpace:"nowrap"}}>{cat}</h4>
                        <div style={{flex:1,height:1,background:"hsl(0 0% 12%)"}} />
                        <span style={{fontSize:11,color:"hsl(0 0% 45%)",letterSpacing:".1em"}}>{items.length} items</span>
                      </div>
                      {items.map(item=>(
                        <div key={item.id} className="srv-card">
                          <div style={{flex:1}}>
                            <h4>
                              {item.featured && <span className="dot-feat" title="Featured" />}
                              {item.name}
                            </h4>
                            <p>{item.description}</p>
                          </div>
                          <div className="price-tag">AED {item.price}</div>
                        </div>
                      ))}
                    </div>
                  );
                })
              ) : (
                <div className="empty-state"><p>Loading menu...</p></div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}
