"use client";

export default function WaveHero() {
    return (
        <section style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 68px)', /* Exactly the screen height below navbar */
            overflow: 'hidden',
            background: '#000',
        }}>
            {/* Background Video */}
            <video
                src="/pibif.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', /* Fills the container while preserving aspect ratio */
                    display: 'block'
                }}
            />
        </section>
    );
}