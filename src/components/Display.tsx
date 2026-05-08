type DisplayProps = {
  expression: string;
  result: string | null;
  error: string | null;
  angleMode: 'deg' | 'rad';
  mode: 'BASIC' | 'SCIENTIFIC';
};

const STATUS_LABEL = {
  ready: 'lista',
  ok: 'listo ♥',
  err: 'oops',
} as const;

export function Display({ expression, result, error, angleMode, mode }: DisplayProps) {
  const status: keyof typeof STATUS_LABEL = error ? 'err' : result !== null ? 'ok' : 'ready';
  const showCursor = !result && !error;
  const modeLabel = mode === 'BASIC' ? 'básica' : 'científica';

  return (
    <div className="display" role="region" aria-label="Pantalla de la calculadora">
      <div className="display__meta">
        <div className="display__meta-left">
          <span className="display__angle">{angleMode}</span>
          <span aria-hidden="true">·</span>
          <span>{modeLabel}</span>
        </div>
        <div className="display__meta-right">
          <span className={`display__status display__status--${status}`}>
            {STATUS_LABEL[status]}
          </span>
        </div>
      </div>

      <div className="display__expression">
        <span className="display__expression-text">
          {expression || (
            <span className="display__placeholder" aria-hidden="true">
              Comienza hermosa
            </span>
          )}
          {showCursor && <span className="display__cursor" aria-hidden="true" />}
        </span>
      </div>

      <div className="display__result">
        {error ? (
          <span role="alert" className="display__error">{error}</span>
        ) : result !== null ? (
          <span className="display__value" aria-live="polite" aria-atomic="true">
            {result}
          </span>
        ) : (
          <span className="display__hint" aria-hidden="true">&nbsp;</span>
        )}
      </div>
    </div>
  );
}
