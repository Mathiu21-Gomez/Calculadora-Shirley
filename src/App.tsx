import { useCallback, useEffect } from 'react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { History } from './components/History';
import { Player } from './components/Player';
import { useCalculator } from './hooks/useCalculator';
import { useHistory } from './hooks/useHistory';
import { useHaptics } from './hooks/useHaptics';
import { useSound } from './hooks/useSound';
import './App.css';

function App() {
  const calc = useCalculator();
  const { items: historyItems, push: pushHistory, clear: clearHistory } = useHistory();
  const haptic = useHaptics();
  const sound = useSound();

  const handleInput = useCallback(
    (token: string) => {
      haptic('tap');
      sound('click');
      calc.input(token);
    },
    [calc, haptic, sound],
  );

  const handleBackspace = useCallback(() => {
    haptic('tap');
    sound('click');
    calc.backspace();
  }, [calc, haptic, sound]);

  const handleClear = useCallback(() => {
    haptic('tap');
    sound('click');
    calc.clear();
  }, [calc, haptic, sound]);

  const handleEvaluate = useCallback(() => {
    const out = calc.evaluate();
    if (out.ok) {
      haptic('success');
      sound('result');
      pushHistory(out.expression, out.value);
    } else if (out.error !== 'EMPTY') {
      haptic('error');
      sound('error');
    }
  }, [calc, haptic, sound, pushHistory]);

  // Physical keyboard support — desktop is unusable without it.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const k = e.key;
      if (/^[0-9.+\-*/()^%]$/.test(k)) {
        e.preventDefault();
        handleInput(k);
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (k === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (k === 'Escape' || k.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleInput, handleEvaluate, handleBackspace, handleClear]);

  const handleUseHistory = useCallback(
    (expr: string) => {
      haptic('tap');
      calc.load(expr);
    },
    [calc, haptic],
  );

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">
          <span className="app__heart" aria-hidden="true" />
          Para mi amor
        </h1>
        <span className="app__author">Calculadora Shirley Preciosa</span>
      </header>

      <section className="app__calc" aria-label="Calculadora">
        <Display
          expression={calc.state.expression}
          result={calc.state.result}
          error={calc.state.error}
          angleMode={calc.state.angleMode}
          mode={calc.state.mode}
        />
        <Keypad
          mode={calc.state.mode}
          angleMode={calc.state.angleMode}
          onInput={handleInput}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onEvaluate={handleEvaluate}
          onToggleMode={() =>
            calc.setMode(calc.state.mode === 'BASIC' ? 'SCIENTIFIC' : 'BASIC')
          }
          onToggleAngle={calc.toggleAngle}
        />
      </section>

      <History
        items={historyItems}
        onUse={handleUseHistory}
        onClear={clearHistory}
      />

      <Player />
    </main>
  );
}

export default App;
