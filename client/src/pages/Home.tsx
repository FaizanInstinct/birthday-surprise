/*
 * Paper Moon Keepsake direction: tactile stationery, asymmetric intimacy, and motion as affection.
 * This page owns the one-session gift journey; replace the copy in `chapters` to personalize it.
 */
import { useMemo, useState } from "react";
import heroImage from "../assets/nylo-hero.webp";
import finaleImage from "../assets/nylo-finale.webp";
import markImage from "../assets/nylo-mark.webp";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Gift,
  Heart,
  LockKeyhole,
  MailOpen,
  Sparkles,
  Star,
} from "lucide-react";

const chapters = [
  {
    id: 1,
    label: "A little hello",
    type: "envelope",
    eyebrow: "Chapter one",
    title: "Before anything else…",
    message:
      "I made you a tiny place on the internet because one birthday message never felt like quite enough. Start here, and take your time.",
    button: "Open the first note",
    accent: "rose",
  },
  {
    id: 2,
    label: "A memory",
    type: "memory",
    eyebrow: "Chapter two",
    title: "A moment worth keeping",
    message:
      "Some of my favorite memories are the ordinary ones: the little laughs, the strange stories, the plans that started as a joke. You make everyday moments feel like keepsakes.",
    button: "Keep this memory",
    accent: "peach",
  },
  {
    id: 3,
    label: "Pick a pocket",
    type: "choice",
    eyebrow: "Chapter three",
    title: "Choose a tiny surprise",
    message:
      "Three little pockets, one very important birthday decision. Follow the one that feels like it is quietly calling your name.",
    button: "Reveal my pick",
    accent: "berry",
  },
  {
    id: 4,
    label: "A bigger note",
    type: "gift",
    eyebrow: "Chapter four",
    title: "There is more under the ribbon",
    message:
      "Thank you for being the kind of person who makes room for other people to be fully themselves. I hope this year brings you soft mornings, loud laughter, and reasons to feel proud of how far you have come.",
    button: "Untie the ribbon",
    accent: "rose",
  },
  {
    id: 5,
    label: "The finale",
    type: "finale",
    eyebrow: "Chapter five",
    title: "Happy birthday, Nylo",
    message:
      "This is your reminder that you are loved, celebrated, and allowed to make a very big wish. I hope the next chapter feels like it was made especially for you.",
    button: "Celebrate Nylo",
    accent: "berry",
  },
] as const;

const choiceLines = [
  "For every dream you are brave enough to name.",
  "For the version of you that is still becoming.",
  "For all the good surprises still on their way.",
];

function FloatingMarks({ count = 14 }: { count?: number }) {
  const marks = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: `${6 + ((index * 37) % 88)}%`,
        top: `${8 + ((index * 53) % 82)}%`,
        delay: `${(index % 5) * 0.65}s`,
        scale: 0.55 + (index % 4) * 0.18,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {marks.map((mark) => (
        <motion.span
          key={mark.id}
          className="absolute text-nylo-rose/35"
          style={{ left: mark.left, top: mark.top, scale: mark.scale, animationDelay: mark.delay }}
          animate={{ y: [0, -12, 0], rotate: [0, 10, -4, 0], opacity: [0.3, 0.75, 0.3] }}
          transition={{ duration: 5 + (mark.id % 4), repeat: Infinity, ease: "easeInOut", delay: mark.id * 0.16 }}
        >
          {mark.id % 3 === 0 ? <Sparkles size={20} /> : mark.id % 3 === 1 ? <Star size={16} /> : <Heart size={14} />}
        </motion.span>
      ))}
    </div>
  );
}

let birthdayAudioContext: AudioContext | null = null;

function getBirthdayAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  birthdayAudioContext ??= new AudioContextClass();
  return birthdayAudioContext;
}

type BirthdayTone = "slice" | "pop" | "wrong" | "test" | "unwrap-envelope" | "unwrap-memory" | "unwrap-choice" | "unwrap-gift" | "unwrap-finale";

function playBirthdayTone(kind: BirthdayTone) {
  const context = getBirthdayAudioContext();
  if (!context) return;
  void context.resume();
  const palettes: Record<BirthdayTone, { notes: number[]; wave: OscillatorType; step: number; length: number; volume: number }> = {
    slice: { notes: [392, 523, 659], wave: "sine", step: 0.1, length: 0.34, volume: 0.14 },
    pop: { notes: [330, 440, 587], wave: "sine", step: 0.1, length: 0.34, volume: 0.14 },
    wrong: { notes: [220, 175], wave: "triangle", step: 0.1, length: 0.34, volume: 0.14 },
    test: { notes: [660], wave: "sine", step: 0.1, length: 0.34, volume: 0.18 },
    "unwrap-envelope": { notes: [196, 247, 294, 392], wave: "triangle", step: 0.075, length: 0.28, volume: 0.11 },
    "unwrap-memory": { notes: [294, 370, 440, 554], wave: "sine", step: 0.13, length: 0.42, volume: 0.105 },
    "unwrap-choice": { notes: [262, 330, 392, 523, 659], wave: "square", step: 0.07, length: 0.22, volume: 0.075 },
    "unwrap-gift": { notes: [165, 247, 330, 494, 659], wave: "sawtooth", step: 0.1, length: 0.38, volume: 0.07 },
    "unwrap-finale": { notes: [262, 330, 392, 523, 659, 784], wave: "sine", step: 0.11, length: 0.5, volume: 0.12 },
  };
  const palette = palettes[kind];
  const now = context.currentTime + 0.04;
  palette.notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * palette.step;
    oscillator.type = palette.wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(palette.volume, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + palette.length);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + palette.length + 0.02);
  });
}

function enableBirthdaySound() {
  playBirthdayTone("test");
}

function unwrapToneForChapter(type: string): BirthdayTone {
  if (type === "envelope") return "unwrap-envelope";
  if (type === "memory") return "unwrap-memory";
  if (type === "choice") return "unwrap-choice";
  if (type === "gift") return "unwrap-gift";
  return "unwrap-finale";
}

function CelebrationBurst({ message, subline, reduced }: { message: string; subline: string; reduced: boolean | null }) {
  return (
    <motion.div className="choice-celebration" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 14 }}>
      <div className="choice-confetti" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <span key={index} style={{ left: `${(index * 29) % 100}%`, animationDelay: `${(index % 10) * 0.06}s`, animationDuration: `${reduced ? 0.01 : 1.8 + (index % 5) * 0.18}s` }} />)}</div>
      <div className="choice-balloons" aria-hidden="true"><i /><i /><i /><i /></div>
      <p className="choice-celebration-kicker">a little birthday magic</p>
      <h2>{message}</h2>
      <p>{subline}</p>
    </motion.div>
  );
}

function ChoiceSurprise({ choice, onClose, reduced }: { choice: number; onClose: () => void; reduced: boolean | null }) {
  const [sliced, setSliced] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [blows, setBlows] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const completeSlice = () => {
    if (sliced) return;
    setSliced(true);
    setCelebrating(true);
    playBirthdayTone("slice");
  };

  const blowCandle = () => {
    if (celebrating) return;
    const next = blows + 1;
    setBlows(next);
    playBirthdayTone("pop");
    if (next >= 3) setCelebrating(true);
  };

  return (
    <motion.div className="choice-overlay" role="dialog" aria-modal="true" aria-labelledby="choice-surprise-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="surprise-dismiss" onClick={onClose} aria-label="Close choice surprise">×</button>
      <div className="choice-stage">
        {!celebrating && choice === 0 && <>
          <p className="choice-stage-kicker">surprise one · make a clean little swipe</p>
          <h2 id="choice-surprise-title">Slice the cake</h2>
          <p className="choice-stage-hint">Drag across the cake with your finger or mouse. One brave cut is all it takes.</p>
          <div className={`interactive-cake ${sliced ? "is-sliced" : ""}`} onPointerDown={() => setCutting(true)} onPointerMove={(event) => { if (cutting && event.clientX > event.currentTarget.getBoundingClientRect().left + event.currentTarget.getBoundingClientRect().width * 0.58) completeSlice(); }} onPointerUp={() => setCutting(false)} onPointerCancel={() => setCutting(false)} role="button" tabIndex={0} aria-label="Drag across the cake to slice it" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") completeSlice(); }}><div className="cake-top"><span className="cake-berry berry-a" /><span className="cake-berry berry-b" /><span className="cake-cream" /></div><div className="cake-body"><span /></div><div className="cake-knife" aria-hidden="true" /></div>
        </>}
        {!celebrating && choice === 1 && <>
          <p className="choice-stage-kicker">surprise two · make a wish</p>
          <h2 id="choice-surprise-title">Blow out the candle</h2>
          <p className="choice-stage-hint">Tap or click the candle {Math.max(0, 3 - blows)} more {Math.max(0, 3 - blows) === 1 ? "time" : "times"} to send the flame away.</p>
          <button className={`interactive-cake candle-cake ${blows >= 3 ? "is-blown" : ""}`} onClick={blowCandle} aria-label={`Blow out candle, ${blows} of 3 taps complete`}><span className="candle-flame" /><span className="candle-stick" /><div className="cake-top"><span className="cake-berry berry-a" /><span className="cake-cream" /></div><div className="cake-body"><span /></div></button>
          <div className="blow-dots" aria-label={`${blows} of 3 candle taps complete`}>{[0, 1, 2].map((dot) => <i key={dot} className={dot < blows ? "is-done" : ""} />)}</div>
        </>}
        {!celebrating && choice === 2 && <div className="wrong-choice"><div className="sorry-rain" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <motion.span key={index} initial={{ y: -32, opacity: 0, rotate: -8 }} animate={{ y: "42vh", opacity: [0, 0.9, 0.9, 0], rotate: index % 2 ? 9 : -9 }} transition={{ duration: reduced ? 0.01 : 3.8 + index * 0.35, delay: index * 0.7, repeat: Infinity, ease: "easeInOut" }}>sorry</motion.span>)}</div><span>✦</span><p className="choice-stage-kicker">surprise three</p><h2 id="choice-surprise-title">Oooopppsss…</h2><p className="choice-stage-hint">No surprises for you here, try either the first or second pocket. HEHE</p><button onClick={onClose} className="reveal-close">Try another pocket <ArrowRight size={16} /></button></div>}
        {celebrating && <><CelebrationBurst reduced={reduced} message={choice === 0 ? "Happy Birthday!" : "Yaaaayyyy!"} subline={choice === 0 ? "A sweet little slice of joy, made especially for you." : "The candle is out—and your wish is officially in the air."} /><button onClick={onClose} className="reveal-close">Keep the magic <ArrowRight size={16} /></button></>}
      </div>
    </motion.div>
  );
}

function Envelope({ open, small = false }: { open: boolean; small?: boolean }) {
  return (
    <motion.div className={`envelope ${small ? "envelope-small" : ""} ${open ? "is-open" : ""}`} animate={open ? { y: -8, rotate: -1 } : { y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
      <div className="envelope-shadow" />
      <div className="envelope-paper">
        <div className="envelope-flap" />
        <div className="envelope-letter"><Heart size={small ? 16 : 24} fill="currentColor" /></div>
        <div className="envelope-fold envelope-fold-left" />
        <div className="envelope-fold envelope-fold-right" />
      </div>
      <div className="envelope-seal">{open ? <MailOpen size={small ? 15 : 20} /> : <Heart size={small ? 13 : 17} fill="currentColor" />}</div>
    </motion.div>
  );
}

const revealStyles = ["reveal-letter", "reveal-photo", "reveal-pocket", "reveal-note", "reveal-finale"] as const;

function SurpriseReveal({ chapter, onClose, reduced }: { chapter: (typeof chapters)[number]; onClose: () => void; reduced: boolean | null }) {
  const style = revealStyles[chapter.id - 1];
  return (
    <motion.div className="surprise-overlay" role="dialog" aria-modal="true" aria-labelledby="surprise-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.01 : 0.35 }}>
      <div className="rose-rain" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <motion.span key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 8) * 0.17}s`, animationDuration: `${3.8 + (index % 4) * 0.7}s` }} initial={{ y: -40, opacity: 0, rotate: 0 }} animate={{ y: "115vh", opacity: [0, 1, 1, 0], rotate: 360 }} transition={{ duration: reduced ? 0.01 : 4.2 + (index % 4) * 0.7, repeat: Infinity, delay: index * 0.08, ease: "linear" }}>✿</motion.span>)}</div>
      <div className="surprise-box" aria-hidden="true"><div className="surprise-lid"><i /><i /></div><div className="surprise-body"><i /><i /></div><div className="surprise-glow" /></div>
      <div className={`reveal-message ${style}`}>
        <p className="reveal-eyebrow">{chapter.eyebrow} · unwrapped</p>
        <h2 id="surprise-title">{chapter.title}</h2>
        <div className="reveal-rule"><span>✦</span><i /><span>✦</span></div>
        <p className="reveal-copy">{chapter.message}</p>
        {chapter.id === 5 && <p className="reveal-signoff">with all my love, always</p>}
        <button onClick={onClose} autoFocus className="reveal-close">Keep this little surprise <ArrowRight size={16} /></button>
      </div>
      <button className="surprise-dismiss" onClick={onClose} aria-label="Close surprise reveal">×</button>
    </motion.div>
  );
}

function WrappedGift({ open }: { open: boolean }) {
  return (
    <motion.div className={`wrapped-gift ${open ? "is-open" : ""}`} animate={open ? { y: -8, rotate: 1 } : { y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 250, damping: 17 }}>
      <div className="gift-shadow" />
      <div className="gift-lid"><span /><span /></div>
      <div className="gift-body"><span /><span /></div>
      <div className="gift-bow"><i /><i /></div>
      <div className="gift-tag">for<br /><b>N</b></div>
    </motion.div>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [revealChapter, setRevealChapter] = useState<number | null>(null);
  const [choiceSurprise, setChoiceSurprise] = useState<number | null>(null);
  const chapter = chapters[current];
  const isOpen = opened.includes(current);

  const unlock = () => {
    if (!isOpen) {
      setOpened((items) => [...items, current]);
      playBirthdayTone(unwrapToneForChapter(chapter.type));
    }
    setRevealChapter(current);
    if (chapter.type === "finale") setIsCelebrating(true);
  };

  const goNext = () => {
    setIsCelebrating(false);
    if (current < chapters.length - 1) {
      setCurrent((value) => value + 1);
      setSelectedChoice(null);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const goToChapter = (index: number) => {
    if (index <= Math.max(...opened, -1) + 1) {
      setCurrent(index);
      setIsCelebrating(false);
      setSelectedChoice(null);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-nylo-paper text-nylo-ink">
      <AnimatePresence>{revealChapter !== null && <SurpriseReveal chapter={chapters[revealChapter]} reduced={prefersReducedMotion} onClose={() => setRevealChapter(null)} />}</AnimatePresence>
      <AnimatePresence>{choiceSurprise !== null && <ChoiceSurprise choice={choiceSurprise} reduced={prefersReducedMotion} onClose={() => setChoiceSurprise(null)} />}</AnimatePresence>
      <section className="relative min-h-[100svh] border-b border-nylo-rose/15">
        <FloatingMarks count={18} />
        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-6 py-6 sm:px-10 lg:px-16">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={markImage} alt="" className="h-11 w-11 rounded-full object-cover shadow-[0_8px_24px_rgba(185,78,104,0.2)]" />
              <div className="leading-none"><span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-nylo-rose">A birthday keepsake</span><p className="mt-1 font-display text-lg italic text-nylo-ink">for Nylo</p></div>
            </div>
            <div className="hidden items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-nylo-ink/45 sm:flex"><span className="h-2 w-2 rounded-full bg-nylo-rose" /> one little journey</div>
          </header>

          <div className="grid flex-1 items-center gap-12 pb-14 pt-16 lg:grid-cols-[minmax(280px,0.78fr)_minmax(450px,1.22fr)] lg:gap-20 lg:pb-24 lg:pt-12">
            <div className="relative z-10 max-w-xl">
              <motion.div initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
                <div className="mb-7 flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.24em] text-nylo-rose"><span className="h-px w-10 bg-nylo-rose" /> made with a little extra love</div>
                <h1 className="max-w-3xl font-display text-[clamp(3.8rem,9vw,8.4rem)] leading-[0.86] tracking-[-0.065em] text-nylo-ink">A few things I wanted you to <em className="text-nylo-rose">find.</em></h1>
                <p className="mt-8 max-w-md font-sans text-base leading-7 text-nylo-ink/65 sm:text-lg">Hi Nylo. Your birthday has been folded into five small moments. Open them one at a time—there is no rush.</p>
                <button onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" })} className="group mt-9 inline-flex items-center gap-3 rounded-full bg-nylo-rose px-6 py-3.5 font-sans text-sm font-bold text-white shadow-[0_12px_25px_rgba(185,78,104,0.24)] transition duration-200 hover:-translate-y-1 hover:bg-nylo-berry active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry focus-visible:ring-offset-4 focus-visible:ring-offset-nylo-paper">Start unwrapping <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
              </motion.div>
            </div>
            <motion.div className="relative min-h-[330px] sm:min-h-[480px]" initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, rotate: prefersReducedMotion ? 0 : 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}>
              <div className="absolute inset-0 rounded-[42%_58%_54%_46%/44%_40%_60%_56%] bg-nylo-peach/65 blur-3xl" />
              <img src={heroImage} alt="An open pink envelope with ribbon and paper stars" className="relative h-full w-full object-contain drop-shadow-[0_28px_20px_rgba(117,54,67,0.15)]" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-[-5deg] rounded-sm bg-white/75 px-5 py-3 shadow-[0_10px_20px_rgba(117,54,67,0.1)] backdrop-blur-sm"><p className="font-display text-xl italic text-nylo-berry">ps. there’s confetti ahead</p></div>
            </motion.div>
          </div>
          <div className="flex items-center gap-4 border-t border-nylo-rose/15 pt-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-nylo-ink/45"><span className="text-nylo-rose">01</span><span className="h-px flex-1 bg-nylo-rose/20" /><span>scroll to open</span><ChevronLeft size={15} className="-rotate-90 text-nylo-rose" /></div>
        </div>
      </section>

      <section id="journey" className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-20">
          <aside className="chapter-rail lg:sticky lg:top-10 lg:h-fit">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-nylo-rose">The journey</p>
            <div className="mt-5 flex gap-3 lg:block">
              {chapters.map((item, index) => {
                const unlocked = opened.includes(index);
                const available = index <= Math.max(...opened, -1) + 1;
                return <button key={item.id} disabled={!available} onClick={() => goToChapter(index)} aria-label={`${item.label}, chapter ${item.id}`} className={`group flex items-center gap-3 py-1 text-left font-sans text-sm transition ${available ? "text-nylo-ink/75 hover:text-nylo-rose" : "cursor-not-allowed text-nylo-ink/25"} lg:mb-4`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${current === index ? "border-nylo-rose bg-nylo-rose text-white shadow-[0_8px_18px_rgba(185,78,104,0.2)]" : unlocked ? "border-nylo-rose/50 bg-nylo-blush text-nylo-rose" : "border-nylo-ink/15 bg-transparent"}`}>{unlocked ? <Check size={14} /> : available ? item.id : <LockKeyhole size={13} />}</span><span className="hidden lg:inline">{item.label}</span></button>;
              })}
            </div>
            <div className="mt-5 hidden h-px w-full bg-nylo-rose/15 lg:block"><motion.div className="h-full bg-nylo-rose" animate={{ width: `${(Math.max(current, opened.length - 1) / (chapters.length - 1)) * 100}%` }} /></div>
          </aside>

          <div className="min-h-[620px]">
            <AnimatePresence mode="wait">
              <motion.div key={chapter.id} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }} transition={{ duration: 0.42 }}>
                <div className="mb-10 flex flex-col justify-between gap-5 border-b border-nylo-rose/15 pb-6 sm:flex-row sm:items-end"><div><p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-nylo-rose">{chapter.eyebrow}</p><h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.045em] text-nylo-ink sm:text-6xl">{chapter.title}</h2></div><p className="font-display text-2xl italic text-nylo-ink/30">0{chapter.id} / 05</p></div>
                <div className="grid items-center gap-10 xl:grid-cols-[minmax(300px,0.95fr)_minmax(340px,1.05fr)] xl:gap-20">
                  <div className="keepsake-stage relative flex min-h-[360px] items-center justify-center overflow-hidden p-8 sm:min-h-[440px]">
                    <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-nylo-peach/50 blur-2xl" /><div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-nylo-rose/10 blur-2xl" /><span className="paper-tape paper-tape-left" aria-hidden="true" /><span className="paper-tape paper-tape-right" aria-hidden="true" />
                    <AnimatePresence mode="wait">
                      {chapter.type === "envelope" && <motion.button key="envelope" onClick={unlock} aria-label={isOpen ? "Envelope opened" : "Open envelope"} className="relative z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry focus-visible:ring-offset-8 focus-visible:ring-offset-nylo-blush"><Envelope open={isOpen} /></motion.button>}
                      {chapter.type === "memory" && <motion.div key="memory" className="relative w-full max-w-[330px] rotate-[-4deg] rounded-sm bg-[#f9eadf] p-3 shadow-[0_22px_30px_rgba(117,54,67,0.16)]"><div className="relative aspect-[4/3] overflow-hidden bg-nylo-peach"><img src={heroImage} alt="Pink birthday stationery" className="h-full w-full object-cover mix-blend-multiply opacity-80" /><div className="absolute inset-0 bg-nylo-rose/10" /></div><div className="px-3 pb-2 pt-4 font-display text-2xl italic text-nylo-berry">keep the ordinary magic</div><button onClick={unlock} className="absolute inset-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry focus-visible:ring-offset-4" aria-label={isOpen ? "Memory opened" : "Open memory"} /></motion.div>}
                      {chapter.type === "choice" && <div key="choice" className="relative grid w-full max-w-[390px] grid-cols-3 gap-3 sm:gap-5">{choiceLines.map((_, index) => <motion.button key={index} onClick={() => { setSelectedChoice(index); if (!isOpen) { setOpened((items) => [...items, current]); playBirthdayTone(unwrapToneForChapter(chapter.type)); } setChoiceSurprise(index); if (index === 2) window.setTimeout(() => playBirthdayTone("wrong"), 220); }} whileHover={{ y: -10, rotate: index === 1 ? 0 : index === 0 ? -3 : 3 }} whileTap={{ scale: 0.96 }} className={`group relative aspect-[0.72] rounded-[1.2rem] border-2 p-2 shadow-[0_16px_25px_rgba(117,54,67,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry ${selectedChoice === index ? "border-nylo-berry bg-nylo-berry" : "border-nylo-rose/20 bg-[#fff9f2]"}`}><div className={`flex h-full items-center justify-center rounded-[0.85rem] border border-dashed ${selectedChoice === index ? "border-white/35 text-white" : "border-nylo-rose/30 text-nylo-rose"}`}><span className="font-display text-4xl italic">{String.fromCharCode(65 + index)}</span></div><span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm ${selectedChoice === index ? "bg-nylo-berry text-white" : "bg-white text-nylo-rose"}`}>{selectedChoice === index ? "chosen" : "pick me"}</span></motion.button>)}</div>}
                      {chapter.type === "gift" && <motion.button key="gift" onClick={unlock} aria-label={isOpen ? "Gift opened" : "Open gift"} className="relative z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry focus-visible:ring-offset-8 focus-visible:ring-offset-nylo-blush"><WrappedGift open={isOpen} /></motion.button>}
                      {chapter.type === "finale" && <motion.div key="finale" className="relative flex flex-col items-center"><img src={finaleImage} alt="Pink birthday gift with confetti" className="relative z-10 max-h-[350px] w-full object-contain drop-shadow-[0_22px_18px_rgba(117,54,67,0.16)]" /><button onClick={unlock} className="relative z-20 -mt-2 rounded-full bg-nylo-berry px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry focus-visible:ring-offset-4">Make a wish</button></motion.div>}
                    </AnimatePresence>
                    {chapter.type !== "choice" && <p className="absolute bottom-5 left-0 right-0 text-center font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-nylo-rose/60">{isOpen ? "opened with love" : "tap to open"}</p>}
                    {isCelebrating && <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">{Array.from({ length: 28 }, (_, index) => <motion.i key={index} className="absolute h-2 w-1.5 rounded-full" style={{ left: `${(index * 29) % 100}%`, top: "48%", backgroundColor: ["#B94E68", "#F2A6A9", "#E68B6B", "#8E3D55"][index % 4] }} initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }} animate={{ opacity: 0, x: ((index % 2 ? 1 : -1) * (40 + (index * 21) % 150)), y: -(60 + (index * 37) % 240), rotate: (index * 80) % 360 }} transition={{ duration: 1.2 + (index % 4) * 0.12, ease: "easeOut" }} />)}</div>}
                  </div>
                  <div className="max-w-lg">
                    <AnimatePresence mode="wait"><motion.div key={`${chapter.id}-${isOpen}-${selectedChoice}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                      {chapter.type === "choice" && selectedChoice !== null ? <><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-nylo-peach/60 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-nylo-berry"><Sparkles size={13} /> pocket {String.fromCharCode(65 + selectedChoice)} opened</div><p className="font-display text-4xl leading-[1.05] text-nylo-ink sm:text-5xl">{choiceLines[selectedChoice]}</p><p className="mt-6 font-sans text-base leading-7 text-nylo-ink/65">You knew exactly where to look. Keep that little line with you today.</p></> : isOpen ? <><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-nylo-peach/60 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-nylo-berry"><Check size={13} /> unwrapped</div><p className="font-display text-4xl leading-[1.05] text-nylo-ink sm:text-5xl">{chapter.message}</p></> : <><p className="font-display text-4xl leading-[1.05] text-nylo-ink/30 sm:text-5xl">A small surprise is waiting on the other side.</p><p className="mt-6 font-sans text-base leading-7 text-nylo-ink/55">Tap the {chapter.type === "gift" ? "gift" : "envelope"} when you are ready to open this chapter.</p></>}
                    </motion.div></AnimatePresence>
                    {(isOpen || (chapter.type === "choice" && selectedChoice !== null)) && current < chapters.length - 1 && <button onClick={goNext} className="group mt-9 inline-flex items-center gap-3 rounded-full bg-nylo-ink px-5 py-3 font-sans text-sm font-bold text-nylo-paper transition hover:-translate-y-1 hover:bg-nylo-berry active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nylo-berry focus-visible:ring-offset-4"><span>Open the next chapter</span><ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>}
                    {current === chapters.length - 1 && isOpen && <p className="mt-8 font-display text-2xl italic text-nylo-rose">Make a beautiful wish, birthday girl.</p>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <footer className="border-t border-nylo-rose/15 bg-nylo-blush/35 px-6 py-12 text-center sm:px-10"><p className="font-display text-3xl italic text-nylo-berry">made for Nylo, with a little extra magic</p><p className="mt-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-nylo-ink/40">five tiny moments · one very loved birthday</p></footer>
    </main>
  );
}
