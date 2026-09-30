"use client";

export default function WaveHero() {
    return (
        <section className="wave-hero-container">
            <style>{`
                .wave-hero-container {
                    position: relative;
                    width: 100%;
                    height: calc(100vh - 68px);
                    overflow: hidden;
                    background: #000;
                }
                
                .wave-hero-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                @media (max-width: 768px) {
                    .wave-hero-container {
                        height: auto;
                        aspect-ratio: 16 / 9;
                    }
                }
            `}</style>
            {/* Background Video */}
            <video
                src="/pibif.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="wave-hero-video"
            />
        </section>
    );
}