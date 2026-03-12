import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const WHEEL_PRIZES = [
  { label: "+2 ГБ", emoji: "📶", color: "#FF2D78", bg: "#2a0a15" },
  { label: "50 ₽", emoji: "💰", color: "#FFE600", bg: "#2a2500" },
  { label: "+5 ГБ", emoji: "🚀", color: "#00F5FF", bg: "#002a2d" },
  { label: "Билет", emoji: "🎫", color: "#BF00FF", bg: "#1a002a" },
  { label: "+1 ГБ", emoji: "📡", color: "#00FF88", bg: "#002a1a" },
  { label: "100 ₽", emoji: "💎", color: "#FF6B00", bg: "#2a1500" },
  { label: "+3 ГБ", emoji: "⚡", color: "#FF2D78", bg: "#2a0a15" },
  { label: "Джекпот!", emoji: "🏆", color: "#FFE600", bg: "#2a2500" },
];

const LOTTERY_PRIZES = [
  { place: "1", prize: "Квартира в Москве", desc: "60 м² в ЖК Звёздный", emoji: "🏠", color: "#FFE600" },
  { place: "2", prize: "Автомобиль", desc: "Kia Rio 2024 года", emoji: "🚗", color: "#C0C0C0" },
  { place: "3", prize: "Путешествие", desc: "Тур на двоих в Дубай", emoji: "✈️", color: "#CD7F32" },
  { place: "4-10", prize: "iPhone 16 Pro", desc: "Смартфон Apple", emoji: "📱", color: "#00F5FF" },
];

const MONEY_RATE = 5;

function WheelOfFortune({ gbBalance, setGbBalance }: { gbBalance: number; setGbBalance: (v: number) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<null | typeof WHEEL_PRIZES[0]>(null);
  const [showResult, setShowResult] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef(0);

  const segmentAngle = 360 / WHEEL_PRIZES.length;

  const drawWheel = (rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(cx, cy, r - 10, cx, cy, r + 8);
    gradient.addColorStop(0, "rgba(255,45,120,0.8)");
    gradient.addColorStop(0.5, "rgba(0,245,255,0.4)");
    gradient.addColorStop(1, "rgba(255,230,0,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.stroke();

    WHEEL_PRIZES.forEach((prize, i) => {
      const startAngle = ((i * segmentAngle + rot - 90) * Math.PI) / 180;
      const endAngle = (((i + 1) * segmentAngle + rot - 90) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      const segGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      segGrad.addColorStop(0, "rgba(255,255,255,0.05)");
      segGrad.addColorStop(1, prize.bg);
      ctx.fillStyle = segGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = "right";
      ctx.font = "bold 13px Rubik, sans-serif";
      ctx.fillStyle = prize.color;
      ctx.shadowColor = prize.color;
      ctx.shadowBlur = 8;
      ctx.fillText(prize.label, r - 12, 5);
      ctx.font = "18px sans-serif";
      ctx.shadowBlur = 0;
      ctx.fillText(prize.emoji, r - 58, 7);
      ctx.restore();
    });

    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    centerGrad.addColorStop(0, "#ffffff");
    centerGrad.addColorStop(0.4, "#FF2D78");
    centerGrad.addColorStop(1, "#BF00FF");
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 11px Rubik";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.fillText("КРУТИ", cx, cy - 3);
    ctx.fillText("УДАЧУ", cx, cy + 11);
  };

  useEffect(() => {
    drawWheel(0);
  }, []);

  const spin = () => {
    if (spinning || gbBalance < 1) return;
    setSpinning(true);
    setShowResult(false);
    setResult(null);
    setGbBalance(parseFloat((gbBalance - 1).toFixed(1)));

    const extraSpins = 5 + Math.random() * 5;
    const winIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const startRot = rotRef.current;
    const targetAngle = startRot + extraSpins * 360 + (360 - winIndex * segmentAngle - segmentAngle / 2);

    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startRot + (targetAngle - startRot) * eased;
      rotRef.current = current;
      drawWheel(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setResult(WHEEL_PRIZES[winIndex]);
        setShowResult(true);
        setTimeout(() => setShowResult(false), 4000);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border neon-border-pink">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-oswald text-2xl font-bold text-white tracking-wide">🎡 Колесо Фортуны</h2>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
          <span className="text-[#00F5FF] font-bold text-sm">−1 ГБ</span>
          <span className="text-white/50 text-xs">за кручение</span>
        </div>
      </div>

      <div className="relative flex justify-center items-center mb-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div
            className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#FFE600]"
            style={{ filter: "drop-shadow(0 0 8px #FFE600)" }}
          />
        </div>
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onClick={spin}
          className="cursor-pointer rounded-full"
          style={{ filter: spinning ? "brightness(1.1)" : "brightness(1)" }}
        />
      </div>

      {showResult && result && (
        <div
          className="mb-4 rounded-2xl p-4 text-center border-2"
          style={{ borderColor: result.color, background: result.bg, boxShadow: `0 0 20px ${result.color}50` }}
        >
          <div className="text-4xl mb-1">{result.emoji}</div>
          <div className="font-oswald text-xl font-bold" style={{ color: result.color }}>Вы выиграли!</div>
          <div className="text-white font-bold text-lg">{result.label}</div>
        </div>
      )}

      <button
        onClick={spin}
        disabled={spinning || gbBalance < 1}
        className="w-full btn-neon-pink rounded-2xl py-4 font-oswald font-bold text-xl text-white tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {spinning ? "🎡 Крутим..." : "🎰 Крутить! (−1 ГБ)"}
      </button>

      {gbBalance < 1 && (
        <p className="text-center text-white/40 text-sm mt-2">Недостаточно гигабайт для кручения</p>
      )}
    </div>
  );
}

function TrafficStats({ gbBalance }: { gbBalance: number }) {
  const total = 30;
  const used = total - gbBalance;
  const pct = Math.min((used / total) * 100, 100);

  const getColor = () => {
    if (pct > 80) return "#FF2D78";
    if (pct > 60) return "#FF6B00";
    return "#00FF88";
  };

  return (
    <div className="glass-card rounded-3xl p-6 border neon-border-cyan">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-oswald text-2xl font-bold text-white tracking-wide">📶 Мой Тариф</h2>
        <div className="bg-[#00F5FF]/10 rounded-full px-3 py-1 border border-[#00F5FF]/30">
          <span className="text-[#00F5FF] text-sm font-bold">Активен</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div
          className="font-oswald font-black leading-none mb-1"
          style={{
            fontSize: "72px",
            background: "linear-gradient(135deg, #00F5FF, #00FF88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(0,245,255,0.5))",
          }}
        >
          {gbBalance.toFixed(1)}
        </div>
        <div className="text-white/60 font-rubik text-lg">ГБ осталось из {total} ГБ</div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Использовано</span>
          <span className="font-bold" style={{ color: getColor() }}>
            {used.toFixed(1)} ГБ ({Math.round(pct)}%)
          </span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #00FF88, ${getColor()})`,
              boxShadow: `0 0 12px ${getColor()}80`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: "Download", label: "Скачано", val: `${used.toFixed(1)} ГБ`, color: "#00FF88" },
          { icon: "Upload", label: "Загружено", val: "3.1 ГБ", color: "#00F5FF" },
          { icon: "Zap", label: "Скорость", val: "75 Мбит", color: "#FFE600" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
            <Icon name={s.icon as "Download"} size={18} className="mx-auto mb-1" style={{ color: s.color }} />
            <div className="font-bold text-sm" style={{ color: s.color }}>{s.val}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5">
        <Icon name="RefreshCw" size={14} className="text-white/40" />
        <span className="text-white/50 text-sm">Обновление пакета через</span>
        <span className="text-white font-bold text-sm">18 дней</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="btn-neon-cyan rounded-2xl py-3 font-bold text-sm text-black">
          ⚡ Добавить ГБ
        </button>
        <button className="glass-card rounded-2xl py-3 font-bold text-sm text-white border border-white/10">
          📊 Детали
        </button>
      </div>
    </div>
  );
}

function LotterySection({
  gbBalance,
  setGbBalance,
  tickets,
  setTickets,
}: {
  gbBalance: number;
  setGbBalance: (v: number) => void;
  tickets: number;
  setTickets: (v: number) => void;
}) {
  const [buyMode, setBuyMode] = useState<"gb" | "money">("gb");
  const [amount, setAmount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const maxTicketsGb = Math.floor(gbBalance);
  const priceInMoney = amount * MONEY_RATE;

  const handleBuy = () => {
    if (buyMode === "gb" && gbBalance < amount) return;
    if (buyMode === "gb") {
      setGbBalance(parseFloat((gbBalance - amount).toFixed(1)));
    }
    setTickets(tickets + amount);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const progress = Math.min((tickets / 100) * 100, 100);

  return (
    <div className="glass-card rounded-3xl p-6 border neon-border-yellow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-oswald text-2xl font-bold text-white tracking-wide">🏠 Розыгрыш</h2>
        <div className="animate-pulse bg-[#FFE600]/20 border border-[#FFE600]/50 rounded-full px-3 py-1">
          <span className="text-[#FFE600] text-xs font-bold">● LIVE</span>
        </div>
      </div>

      <div className="text-center mb-5 bg-gradient-to-r from-[#FFE600]/10 via-[#FF6B00]/10 to-[#FFE600]/10 rounded-2xl py-3 border border-[#FFE600]/20">
        <div className="text-white/60 text-xs mb-1">До розыгрыша</div>
        <div className="font-oswald font-black text-3xl text-[#FFE600]" style={{ textShadow: "0 0 20px rgba(255,230,0,0.6)" }}>
          47 дней
        </div>
        <div className="text-white/50 text-xs">Розыгрыш 28 апреля 2025</div>
      </div>

      <div className="space-y-2 mb-5">
        {LOTTERY_PRIZES.map((p) => (
          <div key={p.place} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
            <span className="text-2xl">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white">{p.prize}</div>
              <div className="text-white/40 text-xs truncate">{p.desc}</div>
            </div>
            <div className="text-xs font-bold rounded-lg px-2 py-1" style={{ color: p.color, background: `${p.color}20` }}>
              #{p.place}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FFE600]/10 rounded-2xl p-4 mb-5 border border-[#FFE600]/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm">Мои билеты</span>
          <div className="flex items-center gap-1">
            <span className="text-[#FFE600] font-oswald font-black text-2xl">{tickets}</span>
            <span className="text-white/50 text-sm">шт.</span>
          </div>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FFE600, #FF6B00)",
              boxShadow: "0 0 10px rgba(255,230,0,0.5)",
            }}
          />
        </div>
        <div className="text-white/30 text-xs mt-1 text-right">{tickets} из 100 целевых</div>
      </div>

      <div className="flex bg-white/5 rounded-2xl p-1 mb-4 border border-white/10">
        <button
          onClick={() => setBuyMode("gb")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${buyMode === "gb" ? "bg-[#FFE600] text-black shadow-lg" : "text-white/50 hover:text-white"}`}
        >
          📡 За гигабайты
        </button>
        <button
          onClick={() => setBuyMode("money")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${buyMode === "money" ? "bg-[#00FF88] text-black shadow-lg" : "text-white/50 hover:text-white"}`}
        >
          💳 За деньги
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/70 text-sm">Количество билетов</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{amount} шт.</span>
            {buyMode === "gb" ? (
              <span className="text-[#FFE600] text-sm font-bold">= {amount} ГБ</span>
            ) : (
              <span className="text-[#00FF88] text-sm font-bold">= {priceInMoney} ₽</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {[1, 3, 5, 10].map((n) => (
            <button
              key={n}
              onClick={() => setAmount(n)}
              disabled={buyMode === "gb" && n > maxTicketsGb}
              className={`flex-1 rounded-xl py-2.5 font-bold text-sm transition-all border disabled:opacity-30 ${amount === n ? "border-[#FFE600] bg-[#FFE600]/20 text-[#FFE600]" : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"}`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="mt-2 text-xs text-white/40 text-center">
          {buyMode === "gb"
            ? `Доступно ${maxTicketsGb} ГБ → ${maxTicketsGb} билетов`
            : `1 билет = ${MONEY_RATE} ₽ | ${amount} билет(а) = ${priceInMoney} ₽`}
        </div>
      </div>

      {showSuccess && (
        <div className="mb-3 bg-[#00FF88]/20 border border-[#00FF88]/50 rounded-2xl py-3 px-4 text-center">
          <span className="text-[#00FF88] font-bold">✅ Куплено {amount} билет(а)! Удачи!</span>
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={buyMode === "gb" && gbBalance < amount}
        className="w-full btn-neon-yellow rounded-2xl py-4 font-oswald font-black text-xl tracking-wider disabled:opacity-40 disabled:cursor-not-allowed text-black"
      >
        🎫 Купить {amount} билет{amount > 1 ? "а" : ""} {buyMode === "gb" ? `(−${amount} ГБ)` : `(${priceInMoney} ₽)`}
      </button>
    </div>
  );
}

function BottomNav({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const items = [
    { id: "stats", icon: "BarChart2", label: "Трафик" },
    { id: "wheel", icon: "CircleDot", label: "Фортуна" },
    { id: "lottery", icon: "Ticket", label: "Лотерея" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-sm mx-4 mb-4">
        <div
          className="glass-card rounded-3xl px-2 py-2 flex border border-white/10"
          style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.5)" }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${active === item.id ? "bg-white/10" : ""}`}
            >
              <Icon
                name={item.icon as "BarChart2"}
                size={22}
                style={{
                  color:
                    active === item.id
                      ? item.id === "stats"
                        ? "#00F5FF"
                        : item.id === "wheel"
                        ? "#FF2D78"
                        : "#FFE600"
                      : "rgba(255,255,255,0.3)",
                }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: active === item.id ? "#ffffff" : "rgba(255,255,255,0.3)" }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TickerBanner() {
  const items = [
    "🏆 Иван К. выиграл 5 ГБ",
    "🎫 Анна М. купила 10 билетов",
    "⚡ Петр С. выиграл 100 ₽",
    "🚀 Елена Р. сорвала Джекпот!",
    "🏠 До розыгрыша квартиры 47 дней",
  ];
  return (
    <div className="overflow-hidden bg-[#FF2D78]/10 border-y border-[#FF2D78]/20 py-2 mb-4">
      <div className="flex animate-ticker whitespace-nowrap gap-8">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-sm text-white/70 px-4 shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [tab, setTab] = useState("stats");
  const [gbBalance, setGbBalance] = useState(14.2);
  const [tickets, setTickets] = useState(3);

  return (
    <div
      className="min-h-screen font-rubik overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0d1a 60%, #0a1628 100%)" }}
    >
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.4 + 0.1,
              animation: `float ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: Math.random() * 4 + "s",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-4 px-4 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white/50 text-xs mb-0.5">Добро пожаловать,</div>
            <h1 className="font-oswald font-black text-2xl text-white tracking-wide">
              Алексей <span className="gradient-text-game">Иванов</span>
            </h1>
          </div>
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF2D78] to-[#BF00FF] flex items-center justify-center text-xl font-bold text-white">
              АИ
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00FF88] border-2 border-background flex items-center justify-center">
              <span className="text-[7px] font-black text-black">3</span>
            </div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
          <div className="text-2xl">📡</div>
          <div className="flex-1">
            <div className="text-white/50 text-xs">Остаток трафика</div>
            <div className="font-oswald font-black text-xl text-[#00F5FF]">{gbBalance.toFixed(1)} ГБ</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-white/50 text-xs">Билетов</div>
            <div className="font-oswald font-black text-xl text-[#FFE600]">{tickets} 🎫</div>
          </div>
        </div>
      </div>

      <TickerBanner />

      {/* Content */}
      <div className="relative z-10 px-4 max-w-sm mx-auto pb-32">
        {tab === "stats" && <TrafficStats gbBalance={gbBalance} />}
        {tab === "wheel" && <WheelOfFortune gbBalance={gbBalance} setGbBalance={setGbBalance} />}
        {tab === "lottery" && (
          <LotterySection
            gbBalance={gbBalance}
            setGbBalance={setGbBalance}
            tickets={tickets}
            setTickets={setTickets}
          />
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}