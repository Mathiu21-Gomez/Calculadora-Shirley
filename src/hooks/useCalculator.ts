import { useCallback, useReducer, useRef } from 'react';
import { evaluateExpression, type AngleMode } from '../engine/calculator';

export type CalcMode = 'BASIC' | 'SCIENTIFIC';

export type CalcState = {
  expression: string;
  result: string | null;
  error: string | null;
  mode: CalcMode;
  angleMode: AngleMode;
  justEvaluated: boolean;
};

export type EvaluationOutcome =
  | { ok: true; expression: string; value: string }
  | { ok: false; error: string }
  | { ok: false; error: 'EMPTY' };

type Action =
  | { type: 'INPUT'; token: string }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR' }
  | { type: 'EVALUATE_OK'; value: string }
  | { type: 'EVALUATE_ERR'; error: string }
  | { type: 'SET_MODE'; mode: CalcMode }
  | { type: 'TOGGLE_ANGLE' }
  | { type: 'LOAD'; expression: string };

const INITIAL: CalcState = {
  expression: '',
  result: null,
  error: null,
  mode: 'BASIC',
  angleMode: 'deg',
  justEvaluated: false,
};

const OPERATORS = new Set(['+', '-', '*', '/', '^', '%']);
const NUMBER_BREAK = /[+\-*/^%(),]/;

function reducer(state: CalcState, action: Action): CalcState {
  switch (action.type) {
    case 'INPUT': {
      const token = action.token;
      let base = state.expression;

      if (state.justEvaluated) {
        if (state.result && OPERATORS.has(token)) {
          base = state.result;
        } else {
          base = '';
        }
      }

      if (token === '.') {
        const tail = base.split(NUMBER_BREAK).pop() ?? '';
        if (tail.includes('.')) return { ...state, justEvaluated: false };
      }

      return {
        ...state,
        expression: base + token,
        result: null,
        error: null,
        justEvaluated: false,
      };
    }
    case 'BACKSPACE':
      return {
        ...state,
        expression: state.expression.slice(0, -1),
        error: null,
        justEvaluated: false,
      };
    case 'CLEAR':
      return { ...INITIAL, mode: state.mode, angleMode: state.angleMode };
    case 'EVALUATE_OK':
      return { ...state, result: action.value, error: null, justEvaluated: true };
    case 'EVALUATE_ERR':
      return { ...state, result: null, error: action.error, justEvaluated: false };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'TOGGLE_ANGLE':
      return { ...state, angleMode: state.angleMode === 'deg' ? 'rad' : 'deg' };
    case 'LOAD':
      return {
        ...state,
        expression: action.expression,
        result: null,
        error: null,
        justEvaluated: false,
      };
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Keep latest state accessible to stable callbacks without re-creating them.
  const stateRef = useRef(state);
  stateRef.current = state;

  const evaluate = useCallback((): EvaluationOutcome => {
    const { expression, angleMode } = stateRef.current;
    if (!expression.trim()) return { ok: false, error: 'EMPTY' };

    const out = evaluateExpression(expression, angleMode);
    if (out.ok) {
      dispatch({ type: 'EVALUATE_OK', value: out.value });
      return { ok: true, expression, value: out.value };
    }
    dispatch({ type: 'EVALUATE_ERR', error: out.error });
    return { ok: false, error: out.error };
  }, []);

  return {
    state,
    input: useCallback((token: string) => dispatch({ type: 'INPUT', token }), []),
    backspace: useCallback(() => dispatch({ type: 'BACKSPACE' }), []),
    clear: useCallback(() => dispatch({ type: 'CLEAR' }), []),
    evaluate,
    setMode: useCallback((mode: CalcMode) => dispatch({ type: 'SET_MODE', mode }), []),
    toggleAngle: useCallback(() => dispatch({ type: 'TOGGLE_ANGLE' }), []),
    load: useCallback((expression: string) => dispatch({ type: 'LOAD', expression }), []),
  };
}
