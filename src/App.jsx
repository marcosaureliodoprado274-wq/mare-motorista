import React, { useEffect, useState } from "react";
import { Shield, Wallet, Loader2, LogOut, ToggleLeft, ToggleRight, Car } from "lucide-react";
import { api } from "./api";

const palette = {
  seaDeep: "#0E4B54",
  seaMid: "#1C7C74",
  sand: "#EAF2EF",
  coral: "#FF6F59",
  sun: "#FFB84D",
  ink: "#12262A",
  safety: "#E14B4B",
  white: "#FFFFFF",
};

function PhoneFrame({ children }) {
  return (
    <div className="mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl relative" style={{ width: 380, minHeight: 720, background: palette.ink, padding: 10, fontFamily: "Inter, sans-serif" }}>
      <div className="w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col" style={{ background: palette.white, minHeight: 700 }}>
        {children}
      </div>
    </div>
  );
}

function Pill({ children, tone = "primary", onClick, disabled, icon: Icon }) {
  const styles =
    tone === "coral" ? { background: palette.coral, color: palette.white }
    : tone === "ghost" ? { background: palette.white, color: palette.ink, border: "1px solid #D8E2DF" }
    : { background: palette.seaDeep, color: palette.white };
  return (
    <button onClick={onClick} disabled={disabled} className="rounded-full px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2 w-full transition-transform active:scale-[0.98] disabled:opacity-50" style={styles}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Auth({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ full_name: "", cpf: "", phone: "", password: "", city_id: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.listCities().then(setCities).catch(() => {}); }, []);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      let data;
      if (mode === "login") data = await api.login(form.phone, form.password);
      else data = await api.register({ ...form, role: "driver" });
      api.setToken(data.token);
      onAuthed(data.user, mode === "register");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-7 py-10" style={{ background: `linear-gradient(180deg, ${palette.seaDeep} 0%, ${palette.seaMid} 100%)` }}>
      <p className="text-white text-3xl mb-1" style={{ fontFamily: "Fraunces, serif" }}>Maré Motorista</p>
      <p className="text-white/70 text-sm mb-6">{mode === "login" ? "Entrar na sua conta" : "Criar conta de motorista"}</p>
      <div className="bg-white rounded-2xl p-5 space-y-3">
        {mode === "register" && (
          <>
            <input placeholder="Nome completo" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input placeholder="CPF" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.city_id} onChange={(e) => setForm({ ...form, city_id: e.target.value })}>
              <option value="">Selecione a cidade</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.state}</option>)}
            </select>
          </>
        )}
        <input placeholder="Telefone (só números)" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Senha" type="password" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-xs" style={{ color: palette.safety }}>{error}</p>}
        <Pill tone="coral" onClick={submit} disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : mode === "login" ? "Entrar" : "Criar conta"}</Pill>
        <button className="text-xs w-full text-center pt-1" style={{ color: palette.seaMid }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}

function VehicleForm({ onDone }) {
  const [form, setForm] = useState({ make: "", model: "", plate: "", color: "", vehicle_type: "moto" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      await api.registerVehicle(form);
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-7 py-10">
      <div className="flex items-center gap-2 mb-4">
        <Car size={22} color={palette.seaDeep} />
        <p className="text-xl" style={{ fontFamily: "Fraunces, serif", color: palette.ink }}>Cadastre seu veículo</p>
      </div>
      <div className="space-y-3">
        <input placeholder="Marca (ex: Honda)" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
        <input placeholder="Modelo (ex: CG 160)" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <input placeholder="Placa" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })} />
        <input placeholder="Cor" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}>
          <option value="moto">Moto</option>
          <option value="carro">Carro</option>
        </select>
        {error && <p className="text-xs" style={{ color: palette.safety }}>{error}</p>}
        <Pill tone="coral" onClick={submit} disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : "Salvar veículo"}</Pill>
      </div>
    </div>
  );
}

function Home({ user, onAcceptRide, onLogout }) {
  const [online, setOnline] = useState(false);
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState({ rides: 0, total: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    api.earningsToday().then(setEarnings).catch(() => {});
  }, []);

  useEffect(() => {
    if (!online) return;
    const interval = setInterval(() => {
      api.openRides().then(setRides).catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, [online]);

  async function toggleOnline() {
    try {
      const next = !online;
      await api.setStatus(next);
      setOnline(next);
      if (next) setRides(await api.openRides());
    } catch (e) {
      setError(e.message);
    }
  }

  async function accept(rideId) {
    try {
      const ride = await api.acceptRide(rideId);
      onAcceptRide(ride);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg" style={{ fontFamily: "Fraunces, serif", color: palette.ink }}>Olá, {user.full_name?.split(" ")[0]}</p>
        <button onClick={onLogout}><LogOut size={18} color="#7C8A87" /></button>
      </div>

      <button onClick={toggleOnline} className="flex items-center gap-2 mb-4">
        {online ? <ToggleRight size={30} color={palette.seaMid} /> : <ToggleLeft size={30} color="#B9C4C1" />}
        <span className="text-sm font-semibold" style={{ color: online ? palette.seaMid : "#7C8A87" }}>
          {online ? "Online — recebendo corridas" : "Offline"}
        </span>
      </button>

      <div className="rounded-2xl p-4 mb-4" style={{ background: palette.sand }}>
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={14} color={palette.seaDeep} />
          <span className="text-xs font-semibold" style={{ color: palette.seaDeep }}>Hoje</span>
        </div>
        <p className="text-2xl font-semibold" style={{ color: palette.ink, fontFamily: "Fraunces, serif" }}>R$ {earnings.total}</p>
        <span className="text-xs" style={{ color: "#4C5A57" }}>{earnings.rides} corridas concluídas</span>
      </div>

      {error && <p className="text-xs mb-2" style={{ color: palette.safety }}>{error}</p>}

      {online && (
        <div className="flex-1 overflow-auto space-y-2">
          {rides.length === 0 && <p className="text-xs text-center mt-8" style={{ color: "#7C8A87" }}>Procurando corridas por perto...</p>}
          {rides.map((r) => (
            <div key={r.id} className="rounded-2xl p-4" style={{ border: "1px solid #D8E2DF" }}>
              <p className="text-sm font-semibold" style={{ color: palette.ink }}>R$ {r.driver_payout} <span className="font-normal text-xs" style={{ color: "#7C8A87" }}>pra você</span></p>
              <p className="text-xs mt-1" style={{ color: "#4C5A57" }}>{r.pickup_address} → {r.dropoff_address}</p>
              <div className="mt-2">
                <Pill tone="coral" onClick={() => accept(r.id)}>Aceitar corrida</Pill>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Trip({ ride, onFinish }) {
  const [status, setStatus] = useState(ride.status);
  const [loading, setLoading] = useState(false);

  async function advance(next) {
    setLoading(true);
    try {
      await api.updateRideStatus(ride.id, next);
      setStatus(next);
      if (next === "completed") onFinish();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6" style={{ background: palette.sand }}>
      <p className="text-lg mb-2" style={{ fontFamily: "Fraunces, serif", color: palette.ink }}>Corrida em andamento</p>
      <p className="text-xs mb-4" style={{ color: "#4C5A57" }}>{ride.pickup_address} → {ride.dropoff_address}</p>
      <div className="rounded-2xl p-4 mb-4" style={{ background: palette.white }}>
        <p className="text-sm" style={{ color: palette.ink }}>Você recebe: <strong>R$ {ride.driver_payout}</strong></p>
      </div>
      <div className="mt-auto space-y-2">
        {status !== "in_progress" ? (
          <Pill tone="coral" onClick={() => advance("in_progress")} disabled={loading}>Iniciar viagem</Pill>
        ) : (
          <Pill tone="coral" onClick={() => advance("completed")} disabled={loading}>Concluir corrida</Pill>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [needsVehicle, setNeedsVehicle] = useState(false);
  const [ride, setRide] = useState(null);

  if (!user) {
    return <PhoneFrame><Auth onAuthed={(u, isNew) => { setUser(u); setNeedsVehicle(isNew); }} /></PhoneFrame>;
  }
  if (needsVehicle) {
    return <PhoneFrame><VehicleForm onDone={() => setNeedsVehicle(false)} /></PhoneFrame>;
  }
  if (ride) {
    return <PhoneFrame><Trip ride={ride} onFinish={() => setRide(null)} /></PhoneFrame>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10" style={{ background: "#F3F6F5" }}>
      <PhoneFrame>
        <Home user={user} onAcceptRide={setRide} onLogout={() => { api.setToken(null); setUser(null); }} />
      </PhoneFrame>
    </div>
  );
}
