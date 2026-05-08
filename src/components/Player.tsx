// Spotify BTS artist embed — public, no auth required.
// Uses theme=0 (dark) which matches our glass aesthetic.
const BTS_EMBED =
  'https://open.spotify.com/embed/artist/3Nrfpe0tUJi4K4DXYWgMUX?utm_source=generator&theme=0';

export function Player() {
  return (
    <section className="player" aria-label="Reproductor de música BTS">
      <header className="player__header">
        <h2 className="player__title">
          <span className="player__icon" aria-hidden="true">♪</span>
          <span>Música</span>
        </h2>
        <span className="player__brand">Spotify</span>
      </header>
      <div className="player__frame">
        <iframe
          src={BTS_EMBED}
          title="Reproductor de Spotify — BTS"
          width="100%"
          height="152"
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </section>
  );
}
