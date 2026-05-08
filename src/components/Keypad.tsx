import { Button } from './Button';
import type { CalcMode } from '../hooks/useCalculator';

type KeypadProps = {
  mode: CalcMode;
  angleMode: 'deg' | 'rad';
  onInput: (token: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onEvaluate: () => void;
  onToggleMode: () => void;
  onToggleAngle: () => void;
};

export function Keypad({
  mode,
  angleMode,
  onInput,
  onBackspace,
  onClear,
  onEvaluate,
  onToggleMode,
  onToggleAngle,
}: KeypadProps) {
  return (
    <div className="keypad">
      <div className="keypad__toolbar">
        <Button variant="function" onPress={onToggleMode} ariaLabel="Cambiar modo">
          {mode === 'BASIC' ? '✦ científica' : '← básica'}
        </Button>
        <Button variant="function" onPress={onToggleAngle} ariaLabel="Cambiar grados/radianes">
          ángulo · {angleMode}
        </Button>
      </div>

      {mode === 'SCIENTIFIC' && (
        <div className="keypad__grid keypad__grid--scientific">
          <Button variant="function" onPress={() => onInput('sin(')}>sin</Button>
          <Button variant="function" onPress={() => onInput('cos(')}>cos</Button>
          <Button variant="function" onPress={() => onInput('tan(')}>tan</Button>
          <Button variant="function" onPress={() => onInput('^')}>x^y</Button>

          <Button variant="function" onPress={() => onInput('asin(')}>asin</Button>
          <Button variant="function" onPress={() => onInput('acos(')}>acos</Button>
          <Button variant="function" onPress={() => onInput('atan(')}>atan</Button>
          <Button variant="function" onPress={() => onInput('sqrt(')}>sqrt</Button>

          <Button variant="function" onPress={() => onInput('log10(')}>log</Button>
          <Button variant="function" onPress={() => onInput('log(')}>ln</Button>
          <Button variant="function" onPress={() => onInput('pi')}>pi</Button>
          <Button variant="function" onPress={() => onInput('e')}>e</Button>
        </div>
      )}

      <div className="keypad__grid keypad__grid--main">
        <Button variant="danger" onPress={onClear} kbd="esc">AC</Button>
        <Button variant="function" onPress={onBackspace} kbd="⌫" ariaLabel="Borrar último">⌫</Button>
        <Button variant="function" onPress={() => onInput('(')}>(</Button>
        <Button variant="function" onPress={() => onInput(')')}>)</Button>

        <Button onPress={() => onInput('7')} kbd="7">7</Button>
        <Button onPress={() => onInput('8')} kbd="8">8</Button>
        <Button onPress={() => onInput('9')} kbd="9">9</Button>
        <Button variant="operator" onPress={() => onInput('/')} kbd="/">÷</Button>

        <Button onPress={() => onInput('4')} kbd="4">4</Button>
        <Button onPress={() => onInput('5')} kbd="5">5</Button>
        <Button onPress={() => onInput('6')} kbd="6">6</Button>
        <Button variant="operator" onPress={() => onInput('*')} kbd="*">×</Button>

        <Button onPress={() => onInput('1')} kbd="1">1</Button>
        <Button onPress={() => onInput('2')} kbd="2">2</Button>
        <Button onPress={() => onInput('3')} kbd="3">3</Button>
        <Button variant="operator" onPress={() => onInput('-')} kbd="-">−</Button>

        <Button onPress={() => onInput('0')} kbd="0">0</Button>
        <Button onPress={() => onInput('.')} kbd=".">.</Button>
        <Button variant="accent" onPress={onEvaluate} kbd="↵" ariaLabel="Calcular">=</Button>
        <Button variant="operator" onPress={() => onInput('+')} kbd="+">+</Button>
      </div>
    </div>
  );
}
