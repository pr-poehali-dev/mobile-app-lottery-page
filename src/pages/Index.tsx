import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const GB_TOTAL = 100;
const GB_AVAILABLE = 14.7;

const WHEEL_PRIZES = [
  { label: "+2 ГБ", emoji: "📶", color: "#FFD700", bg: "#1e1a00" },
  { label: "50 ₽", emoji: "💰", color: "#FFD700", bg: "#1e1800" },
  { label: "+5 ГБ", emoji: "🚀", color: "#FFD700", bg: "#1a1e00" },
  { label: "Билет", emoji: "🎫", color: "#FFD700", bg: "#1a1500" },
  { label: "+1 ГБ", emoji: "📡", color: "#FFD700", bg: "#1a1c00" },
  { label: "100 ₽", emoji: "💎", color: "#FFD700", bg: "#1e1700" },
  { label: "50 мин", emoji: "⚡", color: "#FFD700", bg: "#1c1a00" },
  { label: "Джекпот", emoji: "🏆", color: "#FFD700", bg: "#201e00" },
];

// Визуализация ГБ точками как на скриншоте
function GbDots({ available, total }: { available: number; total: number }) {
  const filled = Math.round((available / total) * 80);
  // Рисуем волнообразную сетку точек
  const rows = [
    { count: 12, offset: 0, y: 0 },
    { count: 16, offset: -4, y: 1 },
    { count: 18, offset: -2, y: 2 },
    { count: 16, offset: 0, y: 3 },
    { count: 10, offset: 8, y: 4 },
  ];

  let dotIndex = 0;
  const totalDots = rows.reduce((s, r) => s + r.count, 0);
  const filledCount = Math.round((available / total) * totalDots);

  return (
    <div className="w-full px-2 my-1">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="flex gap-[5px] mb-[5px]"
          style={{ paddingLeft: `${row.offset + 4}px` }}
        >
          {Array.from({ length: row.count }).map((_, ci) => {
            const isFilled = dotIndex++ < filledCount;
            return (
              <div
                key={ci}
                className="rounded-full flex-shrink-0"
                style={{
                  width: 14,
                  height: 14,
                  background: isFilled ? "#FFD700" : "#2a2a35",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Колесо фортуны
function WheelOfFortune({
  gbBalance,
  setGbBalance,
}: {
  gbBalance: number;
  setGbBalance: (v: number) => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<null | (typeof WHEEL_PRIZES)[0]>(null);
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
    const r = cx - 6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Внешнее кольцо
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.stroke();

    WHEEL_PRIZES.forEach((prize, i) => {
      const startAngle = ((i * segmentAngle + rot - 90) * Math.PI) / 180;
      const endAngle = (((i + 1) * segmentAngle + rot - 90) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#1e1e2e" : "#252535";
      ctx.fill();
      ctx.strokeStyle = "#FFD70040";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = "right";
      ctx.font = "bold 11px Rubik, sans-serif";
      ctx.fillStyle = "#FFD700";
      ctx.fillText(prize.label, r - 10, 4);
      ctx.font = "16px sans-serif";
      ctx.fillText(prize.emoji, r - 52, 6);
      ctx.restore();
    });

    // Центр
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.font = "bold 9px Rubik";
    ctx.fillStyle = "#0d0d1a";
    ctx.textAlign = "center";
    ctx.fillText("КРУТИ", cx, cy - 2);
    ctx.fillText("−1 ГБ", cx, cy + 10);
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

    const winIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const extraSpins = 5 + Math.random() * 5;
    const startRot = rotRef.current;
    // Нормализуем текущую позицию, чтобы точно попасть в нужный сектор
    const currentNorm = ((startRot % 360) + 360) % 360;
    const targetNorm = (360 - winIndex * segmentAngle - segmentAngle / 2 + 360) % 360;
    const delta = ((targetNorm - currentNorm) + 360) % 360;
    const targetAngle = startRot + Math.ceil(extraSpins) * 360 + delta;
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
    <div
      className="mx-4 rounded-3xl p-5"
      style={{ background: "#1a1a28", border: "1px solid #FFD70030" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-bold text-base">🎡 Колесо фортуны</span>
        <span className="text-[#FFD700]/60 text-xs">−1 ГБ за кручение</span>
      </div>

      <div className="flex flex-col items-center">
        {/* Колесо */}
        <div className="relative">
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            style={{ filter: "drop-shadow(0 0 4px #FFD700)" }}
          >
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[22px] border-l-transparent border-r-transparent border-t-[#FFD700]" />
          </div>
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            onClick={spin}
            className="cursor-pointer rounded-full"
            style={{ display: "block" }}
          />
        </div>

        {showResult && result && (
          <div
            className="mt-3 w-full rounded-2xl p-3 text-center border"
            style={{ borderColor: "#FFD700", background: "#20200a" }}
          >
            <div className="text-3xl mb-1">{result.emoji}</div>
            <div className="text-[#FFD700] font-bold text-sm">Выигрыш!</div>
            <div className="text-white font-bold">{result.label}</div>
          </div>
        )}
        {gbBalance < 1 && (
          <p className="text-white/40 text-xs text-center mt-2">Нет гигабайт для кручения</p>
        )}
      </div>
    </div>
  );
}

// Плашка розыгрыша квартиры
function LotteryBanner({ gbBalance }: { gbBalance: number }) {
  const tickets = Math.floor(gbBalance);
  const drawDate = new Date("2026-05-01");
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((drawDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div
      className="mx-4 rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1c1500 0%, #201800 60%, #1a1200 100%)",
        border: "1px solid #FFD70050",
      }}
    >
      {/* Декоративные точки фона */}
      <div className="absolute top-2 right-4 flex gap-1 opacity-20">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
        ))}
      </div>
      <div className="absolute bottom-3 right-8 flex gap-1 opacity-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#FFD700]" />
        ))}
      </div>

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏠</span>
            <span className="text-white font-bold text-base">Розыгрыш квартиры</span>
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full inline-block"
            style={{ background: "#FFD70020", color: "#FFD700", border: "1px solid #FFD70040" }}
          >
            ● LIVE · {daysLeft} дней
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/50 text-xs">моих билетов</div>
          <div className="text-[#FFD700] font-black text-3xl leading-none">{tickets}</div>
        </div>
      </div>

      {/* Конвертация */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-3"
        style={{ background: "rgba(255,215,0,0.08)", border: "1px solid #FFD70025" }}
      >
        <span className="text-2xl">📡</span>
        <div className="flex-1">
          <div className="text-[#FFD700] font-bold text-sm">1 ГБ = 1 лотерейный билет</div>
          <div className="text-white/50 text-xs">Тратьте гигабайты на шанс выиграть квартиру</div>
        </div>
        <Icon name="ChevronRight" size={18} className="text-white/30 shrink-0" />
      </div>

      {/* Призы коротко */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { emoji: "🏠", label: "Квартира 60 м²", place: "1 место" },
          { emoji: "🚗", label: "Kia Rio 2025", place: "2 место" },
          { emoji: "✈️", label: "Тур в Дубай", place: "3 место" },
          { emoji: "📱", label: "iPhone 16 Pro", place: "4–10 место" },
        ].map((p) => (
          <div
            key={p.place}
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "#ffffff08" }}
          >
            <span className="text-lg">{p.emoji}</span>
            <div>
              <div className="text-white text-xs font-bold leading-tight">{p.label}</div>
              <div className="text-white/30 text-xs">{p.place}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [gbBalance, setGbBalance] = useState(GB_AVAILABLE);

  const freeApps = [
    { bg: "#25D366", label: "WA", emoji: "💬" },
    { bg: "#229ED9", label: "TG", emoji: "✈️" },
    { bg: "#FFFC00", label: "SC", emoji: "👻", dark: true },
    { bg: "#07C160", label: "WX", emoji: "💚" },
    { bg: "#9B59B6", label: "OK", emoji: "🟣" },
  ];
  const freeApps2 = [
    { bg: "#0077FF", label: "ВК", emoji: "🔵" },
    { bg: "#F97316", label: "ОК", emoji: "🟠" },
  ];
  const freeApps3 = [
    { bg: "#000", label: "TT", emoji: "🎵" },
    { bg: "#E60000", label: "▶", emoji: "▶️" },
    { bg: "#FF0080", label: "R", emoji: "🎤" },
  ];

  return (
    <div
      className="min-h-screen font-rubik"
      style={{ background: "#12121e" }}
    >
      {/* Статус бар */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <span className="text-white font-bold text-base">17:36</span>
        <div className="flex items-center gap-1">
          <span className="text-white/60 text-xs">🔔</span>
          <span className="text-white/60 text-xs font-bold">VoLTE</span>
          <span className="text-white/60 text-xs">▌▌▌</span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ background: "#FFD700", color: "#0d0d1a" }}
          >
            53
          </span>
        </div>
      </div>

      {/* Назад */}
      <div className="px-5 pb-2">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "#1e1e2e" }}
        >
          <Icon name="ChevronLeft" size={20} className="text-white" />
        </button>
      </div>

      {/* Доступно */}
      <div className="text-center px-4 mb-1">
        <div className="text-white/50 text-sm tracking-wider mb-1">доступно</div>
        <div className="flex items-center justify-center gap-2">
          <span
            className="font-black leading-none"
            style={{
              fontSize: 52,
              color: "#FFD700",
              letterSpacing: "-1px",
            }}
          >
            {gbBalance.toFixed(1)}
          </span>
          <span className="text-white font-bold text-3xl mt-2">гб</span>
          <Icon name="ChevronRight" size={22} className="text-white/50 mt-2" />
        </div>
      </div>

      {/* Точки-гигабайты */}
      <GbDots available={gbBalance} total={GB_TOTAL} />

      <div className="text-center text-white/50 text-sm mb-5">из {GB_TOTAL}</div>

      {/* Подключённые приложения */}
      <div className="px-5 mb-6">
        <div className="text-white/50 text-sm text-center mb-3">подключённые не тратят гб</div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Группа 1 */}
          <div className="flex -space-x-1">
            {freeApps.map((app, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#12121e] text-lg"
                style={{ background: app.bg, zIndex: 10 - i }}
              >
                <span style={{ filter: "saturate(0) brightness(10)" }}>{app.emoji}</span>
              </div>
            ))}
          </div>
          {/* Группа 2 */}
          <div className="flex -space-x-1">
            {freeApps2.map((app, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#12121e] text-sm font-black"
                style={{ background: app.bg, zIndex: 10 - i, color: "white" }}
              >
                {app.label}
              </div>
            ))}
          </div>
          {/* Группа 3 */}
          <div className="flex -space-x-1">
            {freeApps3.map((app, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#12121e] text-lg"
                style={{ background: app.bg, zIndex: 10 - i }}
              >
                {app.emoji}
              </div>
            ))}
          </div>
          {/* + */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#12121e] font-bold text-white text-lg"
            style={{ background: "#2a2a3a" }}
          >
            +
          </div>
        </div>
      </div>

      {/* Колесо фортуны */}
      <div className="mb-4">
        <WheelOfFortune gbBalance={gbBalance} setGbBalance={setGbBalance} />
      </div>

      {/* Плашка розыгрыша */}
      <div className="mb-6">
        <LotteryBanner gbBalance={gbBalance} />
      </div>

      {/* Кнопки действий */}
      <div className="px-6 mb-6">
        <div className="flex justify-around">
          {[
            { icon: "Plus", label: "добавить\nгб" },
            { icon: "SlidersHorizontal", label: "настроить\nтариф" },
            { icon: "Globe", label: "интернет\nв роуминге" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "#1e1e2e" }}
              >
                <Icon name={item.icon as "Plus"} size={22} className="text-white" />
              </div>
              <span className="text-white/60 text-xs text-center whitespace-pre-line leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Нижняя кнопка "мои расходы" */}
      <div className="px-4 pb-8">
        <div
          className="w-full rounded-3xl py-5 text-center font-bold text-white text-lg cursor-pointer"
          style={{ background: "#1e1e2e" }}
        >
          мои расходы
        </div>
      </div>
    </div>
  );
}