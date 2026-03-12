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
  { place: "2", prize: "Автомобиль", desc: "Kia Rio 2025 года", emoji: "🚗", color: "#C0C0C0" },
  { place: "3", prize: "Путешествие", desc: "Тур на двоих в Дубай", emoji: "✈️", color: "#CD7F32" },
  { place: "4–10", prize: "iPhone 16 Pro", desc: "Смартфон Apple 256 ГБ", emoji: "📱", color: "#00F5FF" },
];

const MONEY_RATE = 5;

// Бегущая строка с событиями
function TickerBanner() {
  const items = [
    "🏆 Иван К. выиграл 5 ГБ на колесе",
    "🎫 Анна М. купила 10 лотерейных билетов",
    "⚡ Пётр С. выиграл 100 ₽",
    "🚀 Елена Р. сорвала Джекпот!",
    "🏠 До розыгрыша квартиры осталось 47 дней",
    "💎 Максим Т. купил 5 билетов за гигабайты",
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

// Статистика трафика
function TrafficStats({ gbBalance }: { gbBalance: number }) {
  const total = 30;
  const used = parseFloat((total - gbBalance).toFixed(1));
  const pct = Math.min((used / total) * 100, 100);

  const getBarColor = () => {
    if (pct > 80) return "#FF2D78";
    if (pct > 60) return "#FF6B00";
    return "#00FF88";
  };

  const usageItems = [
    { label: "Видео", icon: "Youtube", value: 4.8, color: "#FF2D78" },
    { label: "Соцсети", icon: "Instagram", value: 3.2, color: "#BF00FF" },
    { label: "Музыка", icon: "Music", value: 2.1, color: "#00F5FF" },
    { label: "Браузер", icon: "Globe", value: 1.7, color: "#FFE600" },
  ];

  return (
    <div className="space-y-4">
      {/* Главная карточка остатка */}
      <div className="glass-card rounded-3xl p-6 border neon-border-cyan">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-oswald text-2xl font-bold text-white tracking-wide">📶 Мой тариф</h2>
          <div className="bg-[#00F5FF]/10 rounded-full px-3 py-1 border border-[#00F5FF]/30">
            <span className="text-[#00F5FF] text-sm font-bold">Активен</span>
          </div>
        </div>

        {/* Большой остаток */}
        <div className="text-center mb-5">
          <div className="text-white/50 text-sm mb-1">Осталось гигабайт</div>
          <div
            className="font-oswald font-black leading-none mb-1"
            style={{
              fontSize: "80px",
              background: "linear-gradient(135deg, #00F5FF, #00FF88)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(0,245,255,0.4))",
            }}
          >
            {gbBalance.toFixed(1)}
          </div>
          <div className="text-white/40 text-base">из {total} ГБ</div>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Использовано {used} ГБ</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${getBarColor()}, ${getBarColor()}aa)`,
                boxShadow: `0 0 12px ${getBarColor()}70`,
              }}
            />
          </div>
        </div>

        {/* Мини-статы */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Скорость", value: "72 Мбит/с", icon: "Zap", color: "#FFE600" },
            { label: "Пинг", value: "18 мс", icon: "Activity", color: "#00FF88" },
            { label: "Дней", value: "18", icon: "Calendar", color: "#BF00FF" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
              <Icon name={s.icon as "Zap"} size={16} style={{ color: s.color }} className="mx-auto mb-1" />
              <div className="font-bold text-sm text-white">{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-neon-cyan rounded-2xl py-3 font-bold text-sm text-black">
            ⚡ Добавить ГБ
          </button>
          <button className="glass-card rounded-2xl py-3 font-bold text-sm text-white border border-white/10">
            📊 Детали
          </button>
        </div>
      </div>

      {/* Расход по категориям */}
      <div className="glass-card rounded-3xl p-6 border border-white/10">
        <h3 className="font-oswald text-xl font-bold text-white mb-4 tracking-wide">📊 Расход по категориям</h3>
        <div className="space-y-3">
          {usageItems.map((item) => {
            const itemPct = Math.round((item.value / used) * 100);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon name={item.icon as "Youtube"} size={14} style={{ color: item.color }} />
                    <span className="text-white/70 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-bold text-sm">{item.value} ГБ</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${itemPct}%`,
                      background: item.color,
                      boxShadow: `0 0 6px ${item.color}80`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Подсказка про лотерею */}
      <div
        className="rounded-2xl p-4 border cursor-pointer"
        style={{ background: "linear-gradient(135deg, #FFE60015, #FF6B0010)", borderColor: "#FFE60040" }}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎫</div>
          <div>
            <div className="text-[#FFE600] font-bold text-sm">1 ГБ = 1 лотерейный билет</div>
            <div className="text-white/50 text-xs mt-0.5">Трать гигабайты на розыгрыш квартиры!</div>
          </div>
          <Icon name="ChevronRight" size={18} className="text-white/30 ml-auto shrink-0" />
        </div>
      </div>
    </div>
  );
}

// Колесо фортуны
function WheelOfFortune({
  gbBalance,
  setGbBalance,
  setTickets,
}: {
  gbBalance: number;
  setGbBalance: (v: number) => void;
  setTickets: (fn: (prev: number) => number) => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<null | (typeof WHEEL_PRIZES)[0]>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinsTotal, setSpinsTotal] = useState(0);
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

    // Внешнее свечение
    const glowGrad = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + 12);
    glowGrad.addColorStop(0, "rgba(255,45,120,0.8)");
    glowGrad.addColorStop(0.5, "rgba(0,245,255,0.4)");
    glowGrad.addColorStop(1, "rgba(255,230,0,0)");
    ctx.strokeStyle = glowGrad;
    ctx.lineWidth = 14;
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
      segGrad.addColorStop(0, "rgba(255,255,255,0.08)");
      segGrad.addColorStop(1, prize.bg);
      ctx.fillStyle = segGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = "right";
      ctx.font = "bold 13px Rubik, sans-serif";
      ctx.fillStyle = prize.color;
      ctx.shadowColor = prize.color;
      ctx.shadowBlur = 10;
      ctx.fillText(prize.label, r - 12, 5);
      ctx.font = "20px sans-serif";
      ctx.shadowBlur = 0;
      ctx.fillText(prize.emoji, r - 58, 8);
      ctx.restore();
    });

    // Центральный круг
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    centerGrad.addColorStop(0, "#ffffff");
    centerGrad.addColorStop(0.4, "#FF2D78");
    centerGrad.addColorStop(1, "#BF00FF");
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
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
        const won = WHEEL_PRIZES[winIndex];
        setResult(won);
        setShowResult(true);
        setSpinsTotal((p) => p + 1);
        if (won.label === "Билет") setTickets((p) => p + 1);
        setTimeout(() => setShowResult(false), 5000);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-3xl p-6 border neon-border-pink">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-oswald text-2xl font-bold text-white tracking-wide">🎡 Колесо Фортуны</h2>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
            <span className="text-[#FF2D78] font-bold text-sm">−1 ГБ</span>
            <span className="text-white/40 text-xs">за кручение</span>
          </div>
        </div>

        {/* Стрелка и колесо */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div
              className="w-0 h-0 border-l-[11px] border-r-[11px] border-t-[26px] border-l-transparent border-r-transparent border-t-[#FFE600]"
              style={{ filter: "drop-shadow(0 0 10px #FFE600)" }}
            />
          </div>
          <canvas
            ref={canvasRef}
            width={290}
            height={290}
            onClick={spin}
            className="cursor-pointer rounded-full"
            style={{
              filter: spinning ? "brightness(1.15) saturate(1.2)" : "brightness(1)",
              transition: "filter 0.3s",
            }}
          />
        </div>

        {/* Результат */}
        {showResult && result && (
          <div
            className="mb-4 rounded-2xl p-5 text-center border-2 animate-bounce-in"
            style={{
              borderColor: result.color,
              background: result.bg,
              boxShadow: `0 0 30px ${result.color}60`,
            }}
          >
            <div className="text-5xl mb-2">{result.emoji}</div>
            <div className="font-oswald text-xl font-bold" style={{ color: result.color }}>
              Вы выиграли!
            </div>
            <div className="text-white font-bold text-2xl mt-1">{result.label}</div>
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
          <p className="text-center text-white/40 text-sm mt-2">
            Недостаточно гигабайт для кручения
          </p>
        )}
      </div>

      {/* Статистика кручений и призы */}
      <div className="glass-card rounded-3xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-oswald text-lg font-bold text-white tracking-wide">🎁 Призы на колесе</h3>
          <div className="text-white/40 text-sm">Всего кручений: <span className="text-white font-bold">{spinsTotal}</span></div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {WHEEL_PRIZES.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl p-2.5 text-center border"
              style={{ background: p.bg, borderColor: `${p.color}40` }}
            >
              <div className="text-xl mb-1">{p.emoji}</div>
              <div className="font-bold text-xs" style={{ color: p.color }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Лотерея
function LotterySection({
  gbBalance,
  setGbBalance,
  tickets,
  setTickets,
}: {
  gbBalance: number;
  setGbBalance: (v: number) => void;
  tickets: number;
  setTickets: (fn: (prev: number) => number) => void;
}) {
  const [buyMode, setBuyMode] = useState<"gb" | "money">("gb");
  const [amount, setAmount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [moneyInput, setMoneyInput] = useState("");

  const maxTicketsGb = Math.floor(gbBalance);
  const priceInMoney = amount * MONEY_RATE;

  // Подсчёт билетов за введённую сумму
  const moneyAmount = parseFloat(moneyInput) || 0;
  const ticketsForMoney = Math.floor(moneyAmount / MONEY_RATE);

  const handleBuy = () => {
    if (buyMode === "gb" && gbBalance < amount) return;
    if (buyMode === "money" && ticketsForMoney < 1) return;
    if (buyMode === "gb") {
      setGbBalance(parseFloat((gbBalance - amount).toFixed(1)));
      setTickets((p) => p + amount);
    } else {
      setTickets((p) => p + ticketsForMoney);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const progress = Math.min((tickets / 100) * 100, 100);

  // Обратный отсчёт
  const drawDate = new Date("2026-05-01");
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((drawDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-4">
      {/* Главный баннер квартиры */}
      <div
        className="rounded-3xl p-6 border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1200 0%, #2a2000 50%, #1a0a00 100%)",
          borderColor: "#FFE60060",
          boxShadow: "0 0 30px rgba(255,230,0,0.15)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
          style={{ background: "radial-gradient(circle, #FFE600, transparent 70%)" }} />
        
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-oswald text-2xl font-bold text-white tracking-wide">🏠 Розыгрыш квартиры</h2>
          <div className="animate-pulse bg-[#FFE600]/20 border border-[#FFE600]/50 rounded-full px-3 py-1">
            <span className="text-[#FFE600] text-xs font-bold">● LIVE</span>
          </div>
        </div>

        <div className="text-center py-4">
          <div className="text-white/50 text-sm mb-1">До розыгрыша осталось</div>
          <div
            className="font-oswald font-black leading-none mb-1"
            style={{
              fontSize: "64px",
              color: "#FFE600",
              textShadow: "0 0 30px rgba(255,230,0,0.6)",
            }}
          >
            {daysLeft}
          </div>
          <div className="text-white/50 text-base">дней</div>
          <div className="text-white/30 text-xs mt-1">Розыгрыш 1 мая 2026</div>
        </div>

        {/* Мои билеты */}
        <div className="bg-black/30 rounded-2xl p-4 border border-[#FFE600]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Мои билеты</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#FFE600] font-oswald font-black text-3xl">{tickets}</span>
              <span className="text-white/40 text-sm">шт.</span>
            </div>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FFE600, #FF6B00)",
                boxShadow: "0 0 12px rgba(255,230,0,0.6)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="text-white/30">{tickets} из 100 целевых</span>
            <span className="text-[#FFE600]/60">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Призы */}
      <div className="glass-card rounded-3xl p-5 border border-white/10">
        <h3 className="font-oswald text-xl font-bold text-white mb-4 tracking-wide">🏆 Призовой фонд</h3>
        <div className="space-y-2">
          {LOTTERY_PRIZES.map((p) => (
            <div
              key={p.place}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/5"
              style={{ background: `${p.color}10` }}
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white">{p.prize}</div>
                <div className="text-white/40 text-xs">{p.desc}</div>
              </div>
              <div
                className="text-xs font-bold rounded-xl px-2.5 py-1 shrink-0"
                style={{ color: p.color, background: `${p.color}25`, border: `1px solid ${p.color}40` }}
              >
                #{p.place}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Покупка билетов */}
      <div className="glass-card rounded-3xl p-5 border neon-border-yellow">
        <h3 className="font-oswald text-xl font-bold text-white mb-4 tracking-wide">🎫 Купить билеты</h3>

        {/* Переключатель режима */}
        <div className="flex bg-white/5 rounded-2xl p-1 mb-5 border border-white/10">
          <button
            onClick={() => setBuyMode("gb")}
            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
              buyMode === "gb" ? "bg-[#FFE600] text-black shadow-lg" : "text-white/50 hover:text-white"
            }`}
          >
            📡 За гигабайты
          </button>
          <button
            onClick={() => setBuyMode("money")}
            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
              buyMode === "money" ? "bg-[#00FF88] text-black shadow-lg" : "text-white/50 hover:text-white"
            }`}
          >
            💳 За деньги
          </button>
        </div>

        {buyMode === "gb" ? (
          <>
            {/* Курс конвертации */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-[#FFE600]/10 rounded-2xl py-3 border border-[#FFE600]/20">
              <span className="text-white/60 text-sm">1 ГБ</span>
              <Icon name="ArrowRight" size={14} className="text-white/30" />
              <span className="text-[#FFE600] font-bold">1 🎫 билет</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm">Количество билетов</span>
                <span className="text-[#FFE600] font-bold">−{amount} ГБ</span>
              </div>
              <div className="flex gap-2">
                {[1, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setAmount(n)}
                    disabled={n > maxTicketsGb}
                    className={`flex-1 rounded-xl py-3 font-bold text-sm transition-all border disabled:opacity-30 ${
                      amount === n
                        ? "border-[#FFE600] bg-[#FFE600]/20 text-[#FFE600]"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="text-white/30 text-xs mt-2 text-center">
                Доступно {maxTicketsGb} ГБ → {maxTicketsGb} билетов
              </div>
            </div>

            {showSuccess && (
              <div className="mb-3 bg-[#00FF88]/20 border border-[#00FF88]/50 rounded-2xl py-3 px-4 text-center animate-bounce-in">
                <span className="text-[#00FF88] font-bold">✅ Куплено {amount} билет(а)! Удачи!</span>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={gbBalance < amount}
              className="w-full btn-neon-yellow rounded-2xl py-4 font-oswald font-black text-xl tracking-wider disabled:opacity-40 disabled:cursor-not-allowed text-black"
            >
              🎫 Купить {amount} билет{amount > 1 ? "а" : ""} (−{amount} ГБ)
            </button>
          </>
        ) : (
          <>
            {/* Курс за деньги */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-[#00FF88]/10 rounded-2xl py-3 border border-[#00FF88]/20">
              <span className="text-white/60 text-sm">{MONEY_RATE} ₽</span>
              <Icon name="ArrowRight" size={14} className="text-white/30" />
              <span className="text-[#00FF88] font-bold">1 🎫 билет</span>
            </div>

            {/* Ввод суммы */}
            <div className="mb-4">
              <label className="text-white/60 text-sm mb-2 block">Введите сумму в рублях</label>
              <div className="relative">
                <input
                  type="number"
                  value={moneyInput}
                  onChange={(e) => setMoneyInput(e.target.value)}
                  placeholder="Например: 100"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white font-bold text-lg focus:outline-none focus:border-[#00FF88]/60 placeholder-white/30"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">₽</span>
              </div>
              {moneyAmount > 0 && (
                <div className="mt-2 text-center">
                  <span className="text-white/50 text-sm">Вы получите: </span>
                  <span className="text-[#00FF88] font-bold text-lg">{ticketsForMoney} билет{ticketsForMoney !== 1 ? "а" : ""}</span>
                </div>
              )}
            </div>

            {/* Быстрые суммы */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[50, 100, 250, 500].map((sum) => (
                <button
                  key={sum}
                  onClick={() => setMoneyInput(String(sum))}
                  className={`rounded-xl py-2.5 font-bold text-sm border transition-all ${
                    moneyInput === String(sum)
                      ? "border-[#00FF88] bg-[#00FF88]/20 text-[#00FF88]"
                      : "border-white/10 bg-white/5 text-white/60"
                  }`}
                >
                  {sum} ₽
                </button>
              ))}
            </div>

            {showSuccess && (
              <div className="mb-3 bg-[#00FF88]/20 border border-[#00FF88]/50 rounded-2xl py-3 px-4 text-center animate-bounce-in">
                <span className="text-[#00FF88] font-bold">✅ Куплено {ticketsForMoney} билет(а)! Удачи!</span>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={ticketsForMoney < 1}
              className="w-full rounded-2xl py-4 font-oswald font-black text-xl tracking-wider disabled:opacity-40 disabled:cursor-not-allowed text-black"
              style={{
                background: "linear-gradient(135deg, #00FF88, #00F5FF)",
                boxShadow: "0 4px 20px rgba(0,255,136,0.4)",
              }}
            >
              💳 Оплатить {moneyAmount > 0 ? `${moneyAmount} ₽` : ""}
              {ticketsForMoney > 0 ? ` → ${ticketsForMoney} билет${ticketsForMoney !== 1 ? "а" : ""}` : ""}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Нижняя навигация
function BottomNav({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const items = [
    { id: "stats", icon: "BarChart2", label: "Трафик", color: "#00F5FF" },
    { id: "wheel", icon: "CircleDot", label: "Фортуна", color: "#FF2D78" },
    { id: "lottery", icon: "Ticket", label: "Лотерея", color: "#FFE600" },
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
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
                active === item.id ? "bg-white/10" : ""
              }`}
            >
              <Icon
                name={item.icon as "BarChart2"}
                size={22}
                style={{ color: active === item.id ? item.color : "rgba(255,255,255,0.3)" }}
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

export default function Index() {
  const [tab, setTab] = useState("stats");
  const [gbBalance, setGbBalance] = useState(14.2);
  const [tickets, setTickets] = useState(3);

  return (
    <div
      className="min-h-screen font-rubik overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0d1a 60%, #0a1628 100%)" }}
    >
      {/* Звёзды */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
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

      {/* Шапка */}
      <div className="relative z-10 pt-12 pb-4 px-4 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white/40 text-xs mb-0.5">Добро пожаловать,</div>
            <h1 className="font-oswald font-black text-2xl text-white tracking-wide">
              Алексей <span className="gradient-text-game">Иванов</span>
            </h1>
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF2D78] to-[#BF00FF] flex items-center justify-center text-lg font-black text-white">
              АИ
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00FF88] border-2 border-background flex items-center justify-center">
              <span className="text-[7px] font-black text-black">{tickets}</span>
            </div>
          </div>
        </div>

        {/* Быстрые цифры */}
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
          <div className="text-2xl">📡</div>
          <div className="flex-1">
            <div className="text-white/40 text-xs">Остаток трафика</div>
            <div className="font-oswald font-black text-xl text-[#00F5FF]">{gbBalance.toFixed(1)} ГБ</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-white/40 text-xs">Билетов</div>
            <div className="font-oswald font-black text-xl text-[#FFE600]">{tickets} 🎫</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-white/40 text-xs">1 ГБ =</div>
            <div className="font-bold text-sm text-[#00FF88]">1 билет</div>
          </div>
        </div>
      </div>

      <TickerBanner />

      {/* Контент */}
      <div className="relative z-10 px-4 max-w-sm mx-auto pb-32">
        {tab === "stats" && <TrafficStats gbBalance={gbBalance} />}
        {tab === "wheel" && (
          <WheelOfFortune
            gbBalance={gbBalance}
            setGbBalance={setGbBalance}
            setTickets={setTickets}
          />
        )}
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
