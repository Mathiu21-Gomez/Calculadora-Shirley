import type { HistoryItem } from '../hooks/useHistory';

type HistoryProps = {
  items: HistoryItem[];
  onUse: (expression: string) => void;
  onClear: () => void;
};

const BIAS_AVATAR = '/bias.png';

export function History({ items, onUse, onClear }: HistoryProps) {
  return (
    <aside className="history">
      <div className="history__bias">
        <img
          src={BIAS_AVATAR}
          alt=""
          className="history__avatar"
          width={48}
          height={48}
          loading="eager"
          decoding="async"
        />
        <div className="history__bias-text">
          <span className="history__bias-label">Tu bias</span>
          <span className="history__bias-name">siempre presente</span>
        </div>
      </div>

      <header className="history__header">
        <h2 className="history__title">
          <span>Historial</span>
          <span className="history__count">[{String(items.length).padStart(2, '0')}]</span>
        </h2>
        {items.length > 0 && (
          <button type="button" className="history__clear" onClick={onClear}>
            limpiar
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <p className="history__empty">Todavía no calculaste nada, Bonita</p>
      ) : (
        <ul className="history__list">
          {items.map((item, idx) => (
            <li key={item.id} className="history__item">
              <button
                type="button"
                className="history__entry"
                onClick={() => onUse(item.expression)}
                aria-label={`Reusar ${item.expression} igual a ${item.result}`}
              >
                <span className="history__index" aria-hidden="true">
                  {String(items.length - idx).padStart(2, '0')}
                </span>
                <span className="history__expr">{item.expression}</span>
                <span className="history__result">{item.result}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
