import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "wouter";
import {
  useGetStats,
  useListBookings,
  useUpdateBooking,
  useDeleteBooking,
  useCreateBooking,
  useListContactMessages,
  useListMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "@workspace/api-client-react";

type Tab = "overview" | "bookings" | "messages" | "menu";

interface MenuForm {
  name: string;
  description: string;
  price: string;
  category: string;
  featured: boolean;
}

const EMPTY_MENU_FORM: MenuForm = {
  name: "", description: "", price: "", category: "espresso", featured: false,
};

const MENU_CATEGORIES = [
  { value: "espresso",  label: "Espresso" },
  { value: "filter",    label: "Filter Coffee" },
  { value: "cold",      label: "Cold Drinks" },
  { value: "specialty", label: "Specialty" },
  { value: "food",      label: "Food" },
];
type BookingStatus = "pending" | "confirmed" | "cancelled";

interface BookingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  experienceType: string;
  specialRequests: string;
}

const EMPTY_FORM: BookingForm = {
  firstName: "", lastName: "", email: "", phone: "",
  date: "", time: "", experienceType: "", specialRequests: "",
};

const RED = "hsl(0 84% 60%)";
const BG = "hsl(0 0% 4%)";
const CARD = "hsl(0 0% 7%)";
const BORDER = "hsl(0 0% 14%)";
const FG = "hsl(0 0% 98%)";
const MUTED = "hsl(0 0% 55%)";

const STATUS_COLORS: Record<BookingStatus, { bg: string; color: string; border: string }> = {
  pending:   { bg: "rgba(234,179,8,0.12)",  color: "#eab308", border: "rgba(234,179,8,0.3)" },
  confirmed: { bg: "rgba(34,197,94,0.1)",   color: "#22c55e", border: "rgba(34,197,94,0.25)" },
  cancelled: { bg: "rgba(239,68,68,0.1)",   color: "#ef4444", border: "rgba(239,68,68,0.25)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status as BookingStatus] ?? STATUS_COLORS.pending;
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>{status}</span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: CARD, border: `1px solid ${BORDER}`,
        width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto",
        position: "relative",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 2, background: RED }} />
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 28px 0",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: FG }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: MUTED,
            cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>
        <div style={{ padding: 28 }}>{children}</div>
      </div>
    </div>
  );
}

function BookingFormFields({ form, onChange }: {
  form: BookingForm;
  onChange: (k: keyof BookingForm, v: string) => void;
}) {
  const inputStyle = {
    width: "100%", background: BG, border: `1px solid ${BORDER}`,
    color: FG, fontFamily: "'Inter',sans-serif", fontSize: 13,
    padding: "11px 14px", outline: "none", boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block" as const, fontSize: 10, fontWeight: 600 as const,
    letterSpacing: "0.18em", textTransform: "uppercase" as const,
    color: MUTED, marginBottom: 7,
  };
  const grp = (mb = 20) => ({ marginBottom: mb });

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={grp()}>
          <label style={labelStyle}>First Name *</label>
          <input style={inputStyle} value={form.firstName} required
            onChange={e => onChange("firstName", e.target.value)} />
        </div>
        <div style={grp()}>
          <label style={labelStyle}>Last Name *</label>
          <input style={inputStyle} value={form.lastName} required
            onChange={e => onChange("lastName", e.target.value)} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={grp()}>
          <label style={labelStyle}>Email *</label>
          <input type="email" style={inputStyle} value={form.email} required
            onChange={e => onChange("email", e.target.value)} />
        </div>
        <div style={grp()}>
          <label style={labelStyle}>Phone / Contact</label>
          <input type="tel" style={inputStyle} value={form.phone} placeholder="+91..."
            onChange={e => onChange("phone", e.target.value)} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={grp()}>
          <label style={labelStyle}>Booking Date *</label>
          <input type="date" style={inputStyle} value={form.date} required
            onChange={e => onChange("date", e.target.value)} />
        </div>
        <div style={grp()}>
          <label style={labelStyle}>Time *</label>
          <select style={{ ...inputStyle, height: 44 }} value={form.time} required
            onChange={e => onChange("time", e.target.value)}>
            <option value="">Select Time</option>
            {["10:00","12:00","14:00","16:00","18:00","20:00"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={grp()}>
        <label style={labelStyle}>Experience *</label>
        <select style={{ ...inputStyle, height: 44 }} value={form.experienceType} required
          onChange={e => onChange("experienceType", e.target.value)}>
          <option value="">Select Experience</option>
          <option value="open_practice">Open Practice</option>
          <option value="rental_basic">Basic Rental Package</option>
          <option value="rental_pro">Pro Telemetry Package</option>
          <option value="vip_pit">VIP Pit Reservation</option>
          <option value="private_event">Private Event / Corporate</option>
        </select>
      </div>
      <div style={grp(0)}>
        <label style={labelStyle}>Special Requests</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "none" }} value={form.specialRequests}
          onChange={e => onChange("specialRequests", e.target.value)} />
      </div>
    </>
  );
}

function MenuItemFormFields({ form, onChange }: {
  form: MenuForm;
  onChange: (k: keyof MenuForm, v: string | boolean) => void;
}) {
  const inputStyle = {
    width: "100%", background: BG, border: `1px solid ${BORDER}`,
    color: FG, fontFamily: "'Inter',sans-serif", fontSize: 13,
    padding: "11px 14px", outline: "none", boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block" as const, fontSize: 10, fontWeight: 600 as const,
    letterSpacing: "0.18em", textTransform: "uppercase" as const,
    color: MUTED, marginBottom: 7,
  };
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Item Name *</label>
        <input style={inputStyle} value={form.name} required
          onChange={e => onChange("name", e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 72, resize: "none" }} value={form.description}
          onChange={e => onChange("description", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Price (₹) *</label>
          <input type="number" min="0" style={inputStyle} value={form.price} required
            onChange={e => onChange("price", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Category *</label>
          <select style={{ ...inputStyle, height: 44 }} value={form.category} required
            onChange={e => onChange("category", e.target.value)}>
            {MENU_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input type="checkbox" id="featured-chk" checked={form.featured}
          onChange={e => onChange("featured", e.target.checked)}
          style={{ width: 16, height: 16, accentColor: RED, cursor: "pointer" }} />
        <label htmlFor="featured-chk" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>
          Mark as Featured (★ shown on menu)
        </label>
      </div>
    </>
  );
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editBooking, setEditBooking] = useState<null | { id: number; form: BookingForm }>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<null | number>(null);
  const [addForm, setAddForm] = useState<BookingForm>(EMPTY_FORM);

  const { data: stats } = useGetStats();
  const { data: bookings, isLoading: bookingsLoading } = useListBookings();
  const { data: messages, isLoading: msgsLoading } = useListContactMessages();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editMenuItem, setEditMenuItem] = useState<null | { id: number; form: MenuForm }>(null);
  const [deleteMenuConfirm, setDeleteMenuConfirm] = useState<null | number>(null);
  const [addMenuForm, setAddMenuForm] = useState<MenuForm>(EMPTY_MENU_FORM);
  const [menuCatFilter, setMenuCatFilter] = useState("all");

  const { data: menuItems, isLoading: menuLoading } = useListMenuItems();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("rc_admin_token");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("rc_admin_token");
    navigate("/admin/login");
  };

  const filteredBookings = bookings?.filter(b => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || `${b.firstName} ${b.lastName} ${b.email} ${b.phone ?? ""}`.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    createBooking.mutate({ data: addForm }, {
      onSuccess: () => { setShowAdd(false); setAddForm(EMPTY_FORM); },
    });
  };

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;
    updateBooking.mutate({ id: editBooking.id, data: editBooking.form }, {
      onSuccess: () => setEditBooking(null),
    });
  };

  const handleDelete = (id: number) => {
    deleteBooking.mutate({ id }, { onSuccess: () => setDeleteConfirm(null) });
  };

  const css = `
    .adm-wrap * { box-sizing: border-box; }
    .adm-wrap table { width:100%; border-collapse:collapse; font-size:13px; }
    .adm-wrap th { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:${MUTED}; padding:12px 14px; text-align:left; border-bottom:1px solid ${BORDER}; background:${BG}; white-space:nowrap; }
    .adm-wrap td { padding:13px 14px; color:hsl(0 0% 78%); border-bottom:1px solid hsl(0 0% 10%); vertical-align:middle; }
    .adm-wrap tr:hover td { background:rgba(255,255,255,0.02); }
    .adm-wrap .ab { padding:6px 12px; font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:1px solid; cursor:pointer; background:none; font-family:'Inter',sans-serif; transition:.2s; }
    .adm-wrap .ab-ed { border-color:rgba(239,68,68,0.4); color:${RED}; }
    .adm-wrap .ab-ed:hover { background:rgba(239,68,68,0.1); }
    .adm-wrap .ab-cn { border-color:rgba(34,197,94,0.4); color:#22c55e; }
    .adm-wrap .ab-cn:hover { background:rgba(34,197,94,0.08); }
    .adm-wrap .ab-cl { border-color:rgba(234,179,8,0.4); color:#eab308; }
    .adm-wrap .ab-cl:hover { background:rgba(234,179,8,0.08); }
    .adm-wrap .ab-dl { border-color:rgba(239,68,68,0.5); color:#ef4444; }
    .adm-wrap .ab-dl:hover { background:rgba(239,68,68,0.12); }
    .adm-wrap .sc { animation:pulse 1.5s ease-in-out infinite; background:hsl(0 0% 11%); border-radius:2px; }
    @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:.25} }
    .adm-wrap input:focus, .adm-wrap select:focus, .adm-wrap textarea:focus { border-color:${RED} !important; }
    @media(max-width:768px) {
      .adm-wrap .stat-g { grid-template-columns:1fr 1fr !important; }
      .adm-wrap .desk-only { display:none !important; }
      .adm-wrap .mob-scroll { overflow-x:auto; }
    }
    @media(max-width:480px) {
      .adm-wrap .stat-g { grid-template-columns:1fr !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="adm-wrap" style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter',sans-serif" }}>

        {/* Header */}
        <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "0 24px" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${RED}`, flexShrink: 0 }}>
                <img src="/logo.jpeg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: FG, lineHeight: 1.2 }}>Admin Panel</div>
                <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase" }}>LA RC Hub & Cafe</div>
              </div>
            </div>
            <button onClick={logout} style={{
              background: "none", border: `1px solid ${BORDER}`, color: MUTED,
              padding: "8px 20px", fontSize: 11, letterSpacing: "0.15em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter',sans-serif",
              transition: ".2s",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = RED; (e.target as HTMLElement).style.color = RED; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = BORDER; (e.target as HTMLElement).style.color = MUTED; }}>
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex" }}>
            {(["overview", "bookings", "messages", "menu"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "15px 28px", fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", background: "none", border: "none",
                cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap",
                color: tab === t ? RED : MUTED,
                borderBottom: `2px solid ${tab === t ? RED : "transparent"}`,
                transition: ".2s",
              }}>
                {t === "bookings"  ? `Bookings${bookings ? ` (${bookings.length})` : ""}` :
                 t === "messages"  ? `Messages${messages ? ` (${messages.length})` : ""}` :
                 t === "menu"      ? `Menu${menuItems ? ` (${menuItems.length})` : ""}` :
                 "Overview"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "36px 24px" }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              <div className="stat-g" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 40 }}>
                {[
                  { num: stats?.totalBookings ?? "–", lbl: "Total Bookings" },
                  { num: stats?.confirmedBookings ?? "–", lbl: "Confirmed" },
                  { num: stats?.pendingBookings ?? "–", lbl: "Pending" },
                  { num: `${stats?.memberCount ?? "–"}+`, lbl: "Club Members" },
                ].map((s, i) => (
                  <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 24, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: RED, opacity: i === 0 ? 1 : 0.35 }} />
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", color: RED, marginBottom: 6 }}>{s.num}</div>
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>{s.lbl}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", color: FG }}>Recent Reservations</h3>
                <button onClick={() => setTab("bookings")} style={{
                  background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                  padding: "7px 18px", fontSize: 10, letterSpacing: "0.15em",
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>View All &rarr;</button>
              </div>
              <div className="mob-scroll">
                <table>
                  <thead>
                    <tr><th>Customer</th><th>Contact</th><th>Experience</th><th>Booking Date</th><th>Submitted On</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {bookings?.slice(0, 6).map(b => (
                      <tr key={b.id}>
                        <td style={{ color: FG, fontWeight: 500 }}>{b.firstName} {b.lastName}</td>
                        <td style={{ color: MUTED, fontSize: 12 }}>{b.phone || b.email}</td>
                        <td>{b.experienceType}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{b.date}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{new Date(b.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</td>
                        <td><StatusBadge status={b.status} /></td>
                        <td>
                          {b.status !== "confirmed" && <button className="ab ab-cn" style={{ marginRight: 6 }} onClick={() => updateBooking.mutate({ id: b.id, data: { status: "confirmed" } })}>✓</button>}
                          {b.status !== "cancelled" && <button className="ab ab-cl" onClick={() => updateBooking.mutate({ id: b.id, data: { status: "cancelled" } })}>✕</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!bookings || bookings.length === 0) && !bookingsLoading && (
                  <div style={{ textAlign: "center", padding: 48, border: `1px solid ${BORDER}`, background: CARD, marginTop: 12 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>No bookings yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab === "bookings" && (
            <div>
              {/* Toolbar */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => { setAddForm(EMPTY_FORM); setShowAdd(true); }} style={{
                  background: RED, color: "#fff", border: "none", padding: "11px 24px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>+ Add Booking</button>

                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, phone..."
                  style={{
                    background: CARD, border: `1px solid ${BORDER}`, color: FG,
                    padding: "10px 16px", fontSize: 13, fontFamily: "'Inter',sans-serif",
                    outline: "none", width: 240,
                  }} />

                <div style={{ display: "flex", gap: 6 }}>
                  {["all", "pending", "confirmed", "cancelled"].map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)} style={{
                      padding: "8px 16px", fontSize: 10, fontWeight: 600,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      background: statusFilter === f ? RED : CARD,
                      border: `1px solid ${statusFilter === f ? RED : BORDER}`,
                      color: statusFilter === f ? "#fff" : MUTED,
                      cursor: "pointer", fontFamily: "'Inter',sans-serif",
                      transition: ".2s",
                    }}>{f}</button>
                  ))}
                </div>

                <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto" }}>
                  {filteredBookings?.length ?? 0} record{filteredBookings?.length !== 1 ? "s" : ""}
                </span>
              </div>

              {bookingsLoading ? (
                <div>{[...Array(5)].map((_, i) => <div key={i} className="sc" style={{ height: 52, marginBottom: 8 }} />)}</div>
              ) : filteredBookings && filteredBookings.length > 0 ? (
                <div className="mob-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Experience</th>
                        <th>Booking Date</th>
                        <th>Submitted On</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr key={b.id}>
                          <td style={{ color: MUTED, fontSize: 11 }}>#{b.id}</td>
                          <td style={{ color: FG, fontWeight: 500 }}>{b.firstName} {b.lastName}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 12 }}>{b.phone || <span style={{ color: MUTED }}>—</span>}</td>
                          <td style={{ fontSize: 12, color: MUTED }}>{b.email}</td>
                          <td style={{ fontSize: 12 }}>{b.experienceType}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 12 }}>{b.date}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 11 }}>{new Date(b.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <button className="ab ab-ed" style={{ marginRight: 5 }} onClick={() => setEditBooking({
                              id: b.id,
                              form: {
                                firstName: b.firstName, lastName: b.lastName,
                                email: b.email, phone: b.phone ?? "",
                                date: b.date, time: b.time,
                                experienceType: b.experienceType,
                                specialRequests: b.specialRequests ?? "",
                              }
                            })}>Edit</button>
                            {b.status !== "confirmed" && <button className="ab ab-cn" style={{ marginRight: 5 }} onClick={() => updateBooking.mutate({ id: b.id, data: { status: "confirmed" } })}>Confirm</button>}
                            {b.status !== "cancelled" && <button className="ab ab-cl" style={{ marginRight: 5 }} onClick={() => updateBooking.mutate({ id: b.id, data: { status: "cancelled" } })}>Cancel</button>}
                            <button className="ab ab-dl" onClick={() => setDeleteConfirm(b.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 64, border: `1px solid ${BORDER}`, background: CARD }}>
                  <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>
                    {search ? "No matching bookings found" : `No ${statusFilter !== "all" ? statusFilter : ""} bookings`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === "messages" && (
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", color: FG, marginBottom: 24 }}>Contact Messages</h3>
              {msgsLoading ? (
                <div>{[...Array(4)].map((_, i) => <div key={i} className="sc" style={{ height: 100, marginBottom: 12 }} />)}</div>
              ) : messages && messages.length > 0 ? (
                [...messages].reverse().map(m => (
                  <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 12, borderLeft: `3px solid ${RED}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 600, color: FG }}>{m.name}</span>
                        {m.subject && <span style={{ fontSize: 12, color: MUTED, marginLeft: 12 }}>— {m.subject}</span>}
                      </div>
                      <span style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }}>
                        {new Date(m.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>{m.email}</div>
                    <p style={{ fontSize: 14, color: "hsl(0 0% 72%)", lineHeight: 1.75, margin: 0 }}>{m.message}</p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: 64, border: `1px solid ${BORDER}`, background: CARD }}>
                  <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>No messages yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── MENU EDITOR ── */}
          {tab === "menu" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => { setAddMenuForm(EMPTY_MENU_FORM); setShowAddMenu(true); }} style={{
                  background: RED, color: "#fff", border: "none", padding: "11px 24px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>+ Add Item</button>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["all", ...MENU_CATEGORIES.map(c => c.value)].map(f => (
                    <button key={f} onClick={() => setMenuCatFilter(f)} style={{
                      padding: "8px 14px", fontSize: 10, fontWeight: 600, letterSpacing: "0.15em",
                      textTransform: "uppercase", background: menuCatFilter === f ? RED : CARD,
                      border: `1px solid ${menuCatFilter === f ? RED : BORDER}`,
                      color: menuCatFilter === f ? "#fff" : MUTED,
                      cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: ".2s",
                    }}>
                      {f === "all" ? "All" : MENU_CATEGORIES.find(c => c.value === f)?.label ?? f}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto" }}>
                  {(menuItems?.filter(m => menuCatFilter === "all" || m.category === menuCatFilter) ?? []).length} items
                </span>
              </div>

              {menuLoading ? (
                <div>{[...Array(6)].map((_, i) => <div key={i} className="sc" style={{ height: 52, marginBottom: 8 }} />)}</div>
              ) : menuItems && menuItems.length > 0 ? (
                <div className="mob-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Name</th><th>Category</th><th>Description</th>
                        <th>Price (₹)</th><th>Featured</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.filter(m => menuCatFilter === "all" || m.category === menuCatFilter).map(m => (
                        <tr key={m.id}>
                          <td style={{ color: MUTED, fontSize: 11 }}>#{m.id}</td>
                          <td style={{ color: FG, fontWeight: 500 }}>{m.name}</td>
                          <td>
                            <span style={{
                              display: "inline-block", padding: "3px 10px", fontSize: 10,
                              fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                              background: "rgba(239,68,68,0.1)", color: RED,
                              border: "1px solid rgba(239,68,68,0.25)",
                            }}>{m.category}</span>
                          </td>
                          <td style={{ fontSize: 12, color: MUTED, maxWidth: 280 }}>
                            <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
                              {m.description}
                            </span>
                          </td>
                          <td style={{ fontFamily: "monospace", fontWeight: 600, color: FG }}>₹{m.price}</td>
                          <td>
                            {m.featured
                              ? <span style={{ color: "#22c55e", fontSize: 13 }}>★ Yes</span>
                              : <span style={{ color: MUTED, fontSize: 12 }}>—</span>}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <button className="ab ab-ed" style={{ marginRight: 6 }} onClick={() => setEditMenuItem({
                              id: m.id,
                              form: { name: m.name, description: m.description, price: String(m.price), category: m.category, featured: m.featured ?? false },
                            })}>Edit</button>
                            <button className="ab ab-dl" onClick={() => setDeleteMenuConfirm(m.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 64, border: `1px solid ${BORDER}`, background: CARD }}>
                  <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>No menu items</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── ADD MENU ITEM MODAL ── */}
        {showAddMenu && (
          <Modal title="Add Menu Item" onClose={() => setShowAddMenu(false)}>
            <form onSubmit={(e: FormEvent) => {
              e.preventDefault();
              createMenuItem.mutate({ data: {
                name: addMenuForm.name, description: addMenuForm.description,
                price: Number(addMenuForm.price),
                category: addMenuForm.category as "espresso"|"filter"|"cold"|"food"|"specialty",
                featured: addMenuForm.featured,
              }}, { onSuccess: () => { setShowAddMenu(false); setAddMenuForm(EMPTY_MENU_FORM); } });
            }}>
              <MenuItemFormFields form={addMenuForm} onChange={(k, v) => setAddMenuForm(f => ({ ...f, [k]: v }))} />
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button type="submit" disabled={createMenuItem.isPending} style={{
                  flex: 1, background: RED, color: "#fff", border: "none", height: 48,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>{createMenuItem.isPending ? "Adding..." : "Add Item"}</button>
                <button type="button" onClick={() => setShowAddMenu(false)} style={{
                  background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                  padding: "0 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>Cancel</button>
              </div>
            </form>
          </Modal>
        )}

        {/* ── EDIT MENU ITEM MODAL ── */}
        {editMenuItem && (
          <Modal title={`Edit: ${editMenuItem.form.name}`} onClose={() => setEditMenuItem(null)}>
            <form onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (!editMenuItem) return;
              updateMenuItem.mutate({ id: editMenuItem.id, data: {
                name: editMenuItem.form.name, description: editMenuItem.form.description,
                price: Number(editMenuItem.form.price),
                category: editMenuItem.form.category as "espresso"|"filter"|"cold"|"food"|"specialty",
                featured: editMenuItem.form.featured,
              }}, { onSuccess: () => setEditMenuItem(null) });
            }}>
              <MenuItemFormFields
                form={editMenuItem.form}
                onChange={(k, v) => setEditMenuItem(em => em ? { ...em, form: { ...em.form, [k]: v } } : em)}
              />
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button type="submit" disabled={updateMenuItem.isPending} style={{
                  flex: 1, background: RED, color: "#fff", border: "none", height: 48,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>{updateMenuItem.isPending ? "Saving..." : "Save Changes"}</button>
                <button type="button" onClick={() => setEditMenuItem(null)} style={{
                  background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                  padding: "0 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>Cancel</button>
              </div>
            </form>
          </Modal>
        )}

        {/* ── DELETE MENU ITEM CONFIRM ── */}
        {deleteMenuConfirm !== null && (
          <Modal title="Delete Menu Item" onClose={() => setDeleteMenuConfirm(null)}>
            <p style={{ fontSize: 14, color: "hsl(0 0% 70%)", marginBottom: 28, lineHeight: 1.75 }}>
              Are you sure you want to delete this menu item? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => deleteMenuItem.mutate({ id: deleteMenuConfirm }, { onSuccess: () => setDeleteMenuConfirm(null) })}
                disabled={deleteMenuItem.isPending} style={{
                flex: 1, background: RED, color: "#fff", border: "none", height: 48,
                fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
              }}>{deleteMenuItem.isPending ? "Deleting..." : "Yes, Delete"}</button>
              <button onClick={() => setDeleteMenuConfirm(null)} style={{
                background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                padding: "0 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
              }}>Cancel</button>
            </div>
          </Modal>
        )}

        {/* ── ADD BOOKING MODAL ── */}
        {showAdd && (
          <Modal title="Add New Booking" onClose={() => setShowAdd(false)}>
            <form onSubmit={handleAdd}>
              <BookingFormFields form={addForm} onChange={(k, v) => setAddForm(f => ({ ...f, [k]: v }))} />
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button type="submit" disabled={createBooking.isPending} style={{
                  flex: 1, background: RED, color: "#fff", border: "none", height: 48,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>
                  {createBooking.isPending ? "Adding..." : "Add Booking"}
                </button>
                <button type="button" onClick={() => setShowAdd(false)} style={{
                  background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                  padding: "0 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>Cancel</button>
              </div>
            </form>
          </Modal>
        )}

        {/* ── EDIT BOOKING MODAL ── */}
        {editBooking && (
          <Modal title={`Edit Booking #${editBooking.id}`} onClose={() => setEditBooking(null)}>
            <form onSubmit={handleEdit}>
              <BookingFormFields
                form={editBooking.form}
                onChange={(k, v) => setEditBooking(eb => eb ? { ...eb, form: { ...eb.form, [k]: v } } : eb)}
              />
              <div style={{ marginTop: 20 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: 7 }}>Status</label>
                <select value={editBooking.form.experienceType}
                  onChange={e => updateBooking.mutate({ id: editBooking.id, data: { status: e.target.value as BookingStatus } })}
                  style={{ background: BG, border: `1px solid ${BORDER}`, color: FG, fontFamily: "'Inter',sans-serif", fontSize: 13, padding: "11px 14px", width: "100%", height: 44 }}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button type="submit" disabled={updateBooking.isPending} style={{
                  flex: 1, background: RED, color: "#fff", border: "none", height: 48,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>
                  {updateBooking.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditBooking(null)} style={{
                  background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                  padding: "0 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}>Cancel</button>
              </div>
            </form>
          </Modal>
        )}

        {/* ── DELETE CONFIRM ── */}
        {deleteConfirm !== null && (
          <Modal title="Delete Booking" onClose={() => setDeleteConfirm(null)}>
            <p style={{ fontSize: 14, color: "hsl(0 0% 70%)", marginBottom: 28, lineHeight: 1.75 }}>
              Are you sure you want to delete booking <strong style={{ color: FG }}>#{deleteConfirm}</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleteBooking.isPending} style={{
                flex: 1, background: "hsl(0 84% 60%)", color: "#fff", border: "none", height: 48,
                fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
              }}>
                {deleteBooking.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
              <button onClick={() => setDeleteConfirm(null)} style={{
                background: "none", border: `1px solid ${BORDER}`, color: MUTED,
                padding: "0 24px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Inter',sans-serif",
              }}>Cancel</button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
