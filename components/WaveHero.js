"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => t * t * (3 - 2 * t);

function waveY(x, W, tick, baseY, amp, spd, phase, ripple) {
    const t = x / W;
    const r = ripple ?? 0;
    return (
        baseY +
        Math.sin(t * Math.PI * 3.0 + tick * spd + phase) * amp +
        Math.cos(t * Math.PI * 1.8 - tick * spd * 0.5) * (amp * 0.8) +
        Math.sin(t * Math.PI * 4.2 + tick * spd * 0.9) * (amp * 0.4 * (1.0 + r))
    );
}

function drawLayer(ctx, W, H, tick, baseYFrac, amp, spd, phase, ripple, stops, step = 2) {
    const baseY = H * baseYFrac;
    const crestY = baseY - amp * 2.0;
    const grad = ctx.createLinearGradient(0, crestY, 0, H);
    stops.forEach(([p, c]) => grad.addColorStop(p, c));
    
    ctx.save();
    ctx.shadowBlur = 0; // நோ க்ளோ / நோ ஷேடோ
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += step) {
        ctx.lineTo(x, waveY(x, W, tick, baseY, amp, spd, phase, ripple));
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
}

// ═══════════════════════════════════════════════
//  WaveCanvas — எப்போதும் நிலையான Pure White Top
// ═══════════════════════════════════════════════
function WaveCanvas({ isTyping, isComplete }) {
    const canvasRef = useRef(null);
    const isTypingRef = useRef(isTyping);
    const isCompleteRef = useRef(isComplete);
    const rafRef = useRef(null);
    const s = useRef({ tick: 0, blend: 0, energy: 0, breathPhase: 0, breathAmp: 0 }).current;

    useEffect(() => {
        isTypingRef.current = isTyping;
        isCompleteRef.current = isComplete;
        if (isTyping && !isComplete) s.energy = clamp(s.energy + 0.10, 0, 0.60);
    }, [isTyping, isComplete]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const isMobile = window.innerWidth < 768;
            canvas.width  = window.innerWidth  * (isMobile ? 1 : dpr);
            canvas.height = window.innerHeight * (isMobile ? 1 : dpr);
            canvas.style.width  = window.innerWidth  + 'px';
            canvas.style.height = window.innerHeight + 'px';
            if (!isMobile) ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener('resize', resize);

        function animate() {
            const typing = isTypingRef.current;
            const completed = isCompleteRef.current;
            const W = canvas.width, H = canvas.height;

            s.blend = lerp(s.blend, (typing && !completed) ? 1 : 0, typing ? 0.028 : 0.016);
            s.energy = lerp(s.energy, 0, 0.036);
            s.breathAmp = lerp(s.breathAmp, (typing && !completed) ? 1 : 0, typing ? 0.022 : 0.014);

            const targetBreathSpeed = completed ? 0 : lerp(0.006, 0.042, ease(s.blend));
            s.breathPhase += targetBreathSpeed;
            const targetTickSpeed = completed ? 0 : lerp(0.048, 0.095, ease(s.blend));
            s.tick += targetTickSpeed;

            const eb = ease(s.blend), eA = ease(s.breathAmp), swing = eA * 0.035;
            const isMob = (typeof window !== 'undefined' && window.innerWidth < 768);
            const base1 = (isMob ? 0.82 : 0.72) + Math.sin(s.breathPhase) * swing;
            const base2 = (isMob ? 0.85 : 0.75) - Math.sin(s.breathPhase) * swing;
            const amp = lerp(isMob ? 14 : 20, isMob ? 22 : 32, eb) + s.energy * 5;

            const isMobile = W < 768;
            const step = isMobile ? 4 : 2;
            const W_logical = isMobile ? W : W / Math.min(window.devicePixelRatio || 1, 2);
            const H_logical = isMobile ? H : H / Math.min(window.devicePixelRatio || 1, 2);

            ctx.clearRect(0, 0, W, H);
            
            // 1. Pure White Background Only
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, W, H);

            // 2. Wave Layer 2 (Back Wave) - மேல்பகுதியில் வெள்ளையாக மட்டுமே இருக்கும்
            drawLayer(ctx, W_logical, H_logical, s.tick, base2, amp * 0.82, 0.4, Math.PI, s.energy * 0.5,
                [
                    [0, '#ffffff'], 
                    [0.15, 'rgba(180, 220, 255, 0.8)'], 
                    [0.4, 'rgba(40, 110, 210, 0.85)'], 
                    [1, 'rgba(5, 18, 72, 0.95)']
                ],
                step
            );

            // 3. Wave Layer 1 (Front Wave) - மேல்பகுதியில் வெள்ளையாக மட்டுமே இருக்கும்
            drawLayer(ctx, W_logical, H_logical, s.tick, base1, amp, 0.56, 0, s.energy,
                [
                    [0, '#ffffff'], 
                    [0.1, '#ffffff'], 
                    [0.25, 'rgba(100, 180, 250, 0.9)'], 
                    [0.5, 'rgba(28, 98, 215, 0.95)'], 
                    [1, 'rgba(3, 12, 58, 1)']
                ],
                step
            );

            rafRef.current = requestAnimationFrame(animate);
        }
        animate();
        return () => { window.removeEventListener('resize', resize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}

// ═══════════════════════════════════════════════
//  MP3 Audio phases — ElevenLabs pre-recorded
// ═══════════════════════════════════════════════
const AUDIO_PHASES = [
    '/audio/hero-phase-1.mp3',
    '/audio/hero-phase-2.mp3',
    '/audio/hero-phase-3.mp3',
];

// ═══════════════════════════════════════════════
//  Typewriter — 4 rotating display lines
// ═══════════════════════════════════════════════
const DISPLAY_LINES = [
    'Welcome to Open Intelligence',
    "Built by Madurai's AI Community",
    'Discover. Contribute. Build Together.',
    'Open Source AI — For Everyone',
];

function Typewriter({ onTypingChange, started }) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (!started) return;
        let lineIdx = 0;
        let charIdx = 0;
        let timeoutId;
        let running = true;

        function typeNext() {
            if (!running) return;
            const line = DISPLAY_LINES[lineIdx % DISPLAY_LINES.length];
            charIdx++;
            setDisplayText(line.slice(0, charIdx));
            onTypingChange(true);

            if (charIdx < line.length) {
                timeoutId = setTimeout(typeNext, 72 + Math.random() * 44);
            } else {
                onTypingChange(false);
                timeoutId = setTimeout(() => {
                    if (!running) return;
                    let eraseIdx = line.length;
                    function eraseNext() {
                        if (!running) return;
                        eraseIdx--;
                        setDisplayText(line.slice(0, eraseIdx));
                        if (eraseIdx > 0) {
                            timeoutId = setTimeout(eraseNext, 26);
                        } else {
                            lineIdx++;
                            charIdx = 0;
                            timeoutId = setTimeout(typeNext, 420);
                        }
                    }
                    eraseNext();
                }, 2400);
            }
        }

        timeoutId = setTimeout(typeNext, 900);
        return () => { running = false; clearTimeout(timeoutId); };
    }, [started]);

    return (
        <div style={{ minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <span className="oi-typewriter-text" style={{
                fontSize: 'clamp(18px, 4.5vw, 34px)',
                fontWeight: 300,
                letterSpacing: '2px',
                color: '#0f172a',
            }}>
                {displayText}
                <span style={{
                    display: 'inline-block', width: '2px', height: '1.1em',
                    background: '#2563eb',
                    marginLeft: '3px', verticalAlign: 'middle',
                    animation: 'oiCursorBlink 1s step-end infinite',
                }} />
            </span>
        </div>
    );
}

const PHASE_LABELS = ['Platform Intro', 'Call to Action', 'Community Events'];

export default function WaveHero() {
    const [isTyping, setIsTyping] = useState(false);
    const [started, setStarted] = useState(false);
    const [audioStarted, setAudioStarted] = useState(false);
    const [phase, setPhase] = useState(0);
    const [speaking, setSpeaking] = useState(false);
    const [audioDone, setAudioDone] = useState(false);
    const audioRef = useRef(null);
    const phaseRef = useRef(0);
    const cancelledRef = useRef(false);

    useEffect(() => {
        const t = setTimeout(() => setStarted(true), 600);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!audioStarted) return;
        cancelledRef.current = false;
        phaseRef.current = 0;

        function playPhase(idx) {
            if (cancelledRef.current || idx >= AUDIO_PHASES.length) {
                setSpeaking(false);
                setAudioDone(true);
                return;
            }
            setPhase(idx);
            setSpeaking(true);
            setAudioDone(false);

            const audio = new Audio(AUDIO_PHASES[idx]);
            audioRef.current = audio;
            audio.volume = 1.0;

            audio.addEventListener('ended', () => {
                if (cancelledRef.current) return;
                setTimeout(() => playPhase(idx + 1), 1600);
            });

            audio.addEventListener('error', () => {
                console.warn('Audio phase', idx, 'failed to load');
                if (!cancelledRef.current) setTimeout(() => playPhase(idx + 1), 500);
            });

            audio.play().catch(err => {
                console.warn('Audio play error:', err);
                if (!cancelledRef.current) setTimeout(() => playPhase(idx + 1), 500);
            });
        }

        playPhase(0);

        return () => {
            cancelledRef.current = true;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioStarted]);

    function handleAudioClick() {
        if (audioDone) {
            setAudioStarted(false);
            setAudioDone(false);
            setSpeaking(false);
            setTimeout(() => setAudioStarted(true), 100);
        } else {
            setAudioStarted(true);
        }
    }

    return (
        <>
            <style>{`
                @keyframes oiCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes oiFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes oiBar0 { from{height:4px} to{height:18px} }
                @keyframes oiBar1 { from{height:6px} to{height:26px} }
                @keyframes oiBar2 { from{height:3px} to{height:22px} }
                @keyframes oiBar3 { from{height:8px} to{height:14px} }
                @keyframes oiPulseRing {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.9); opacity: 0; }
                }
                @keyframes oiSpeakerPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(100,180,255,0.4); }
                    50% { box-shadow: 0 0 0 12px rgba(100,180,255,0); }
                }
                @media (max-width: 640px) {
                    .oi-hero-content { gap: 16px !important; padding: 0 1rem !important; }
                    .oi-typewriter-text { font-size: clamp(16px,5vw,22px) !important; letter-spacing: 1px !important; }
                    .oi-action-buttons { gap: 8px !important; }
                    .oi-action-btn { padding: 8px 14px !important; font-size: 11px !important; }
                    .oi-audio-btn { padding: 8px 16px !important; font-size: 10px !important; }
                }
                @media (min-width: 641px) and (max-width: 1024px) {
                    .oi-hero-content { gap: 20px !important; }
                    .oi-typewriter-text { font-size: clamp(20px,3.5vw,28px) !important; }
                }
            `}</style>

            <section style={{
                position: 'relative', width: '100%', height: '100svh',
                minHeight: '100dvh', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingBottom: '18vh', background: '#ffffff',
            }}>
                <WaveCanvas isTyping={isTyping} isComplete={false} />

                <div className="oi-hero-content" style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '24px',
                    padding: '0 1.5rem', textAlign: 'center',
                    animation: 'oiFadeUp 1s ease both',
                    width: '100%', maxWidth: '600px',
                }}>
                    <p className="oi-phase-label" style={{
                        color: '#64748b',
                        fontWeight: 300, fontSize: '11px',
                        letterSpacing: '6px', textTransform: 'uppercase',
                        margin: 0, minHeight: '16px',
                    }}>
                        {speaking ? PHASE_LABELS[phase] : 'Open Intelligence'}
                    </p>

                    <Typewriter onTypingChange={setIsTyping} started={started} />

                    {!speaking && (
                        <button
                            className="oi-audio-btn"
                            onClick={handleAudioClick}
                            style={{
                                position: 'relative',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 22px',
                                borderRadius: '40px',
                                background: 'rgba(241,245,249,0.7)',
                                border: '1px solid rgba(59,130,246,0.3)',
                                color: '#334155',
                                fontSize: '11px', fontWeight: 500,
                                letterSpacing: '4px', textTransform: 'uppercase',
                                cursor: 'pointer', backdropFilter: 'blur(10px)',
                                animation: !audioStarted ? 'oiSpeakerPulse 2.4s ease-in-out infinite' : 'none',
                                transition: 'all 0.3s ease', outline: 'none',
                            }}
                        >
                            {!audioStarted && (
                                <span style={{
                                    position: 'absolute', inset: 0, borderRadius: '40px',
                                    border: '1px solid rgba(100,170,255,0.3)',
                                    animation: 'oiPulseRing 2.4s ease-out infinite',
                                    pointerEvents: 'none',
                                }} />
                            )}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                            {audioDone ? 'Replay Story' : 'Tap to hear our story'}
                        </button>
                    )}

                    {speaking && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            animation: 'oiFadeUp 0.4s ease both',
                        }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{
                                    width: '3px', borderRadius: '2px',
                                    background: '#2563eb',
                                    animation: `oiBar${i} ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                                }} />
                            ))}
                            <p style={{
                                fontSize: '10px',
                                color: '#64748b',
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                margin: '0 6px',
                            }}>
                                {PHASE_LABELS[phase]}
                            </p>
                            {[3, 2, 1, 0].map(i => (
                                <div key={`r${i}`} style={{
                                    width: '3px', borderRadius: '2px',
                                    background: '#2563eb',
                                    animation: `oiBar${i} ${0.6 + (3 - i) * 0.15}s ease-in-out infinite alternate`,
                                }} />
                            ))}
                        </div>
                    )}


                </div>
            </section>
        </>
    );
}