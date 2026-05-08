import { create, all, type MathJsInstance, type MathNode } from 'mathjs';

const math: MathJsInstance = create(all, {
  number: 'number',
  precision: 14,
});

const allowedNodeTypes = new Set([
  'OperatorNode',
  'ConstantNode',
  'ParenthesisNode',
  'FunctionNode',
  'SymbolNode',
  'UnaryMinusNode',
]);

const allowedSymbols = new Set([
  'pi', 'e',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'log', 'log10', 'log2',
  'sqrt', 'cbrt', 'abs', 'exp', 'pow',
  'floor', 'ceil', 'round',
]);

const TRIG_INPUT = new Set(['sin', 'cos', 'tan']);
const TRIG_OUTPUT = new Set(['asin', 'acos', 'atan']);

function assertSafe(node: MathNode): void {
  if (!allowedNodeTypes.has(node.type)) {
    throw new Error(`Token no permitido: ${node.type}`);
  }
  if (node.type === 'SymbolNode' && 'name' in node) {
    const name = (node as { name: string }).name;
    if (!allowedSymbols.has(name)) {
      throw new Error(`Símbolo no permitido: ${name}`);
    }
  }
  node.forEach((child) => assertSafe(child));
}

export type AngleMode = 'rad' | 'deg';

export type EvalResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function evaluateExpression(
  expression: string,
  angleMode: AngleMode = 'rad',
): EvalResult {
  const trimmed = expression.trim();
  if (!trimmed) return { ok: false, error: 'Expresión vacía' };

  try {
    let node = math.parse(trimmed);
    assertSafe(node);
    if (angleMode === 'deg') node = transformForDegrees(node);

    const value = node.evaluate();

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return { ok: false, error: 'Resultado inválido' };
    }

    return { ok: true, value: formatNumber(value) };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de sintaxis';
    return { ok: false, error: message };
  }
}

function transformForDegrees(node: MathNode): MathNode {
  return node.transform((current) => {
    if (current.type !== 'FunctionNode') return current;
    const fnNode = current as MathNode & { fn: { name: string }; args: MathNode[] };
    const name = fnNode.fn?.name;
    if (!name) return current;

    if (TRIG_INPUT.has(name) && fnNode.args.length === 1) {
      const factor = math.parse('pi/180');
      const wrapped = new math.OperatorNode('*', 'multiply', [fnNode.args[0], factor]);
      return new math.FunctionNode(name, [wrapped]);
    }

    if (TRIG_OUTPUT.has(name) && fnNode.args.length === 1) {
      const factor = math.parse('180/pi');
      const inner = new math.FunctionNode(name, fnNode.args);
      return new math.OperatorNode('*', 'multiply', [inner, factor]);
    }

    return current;
  });
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  const fixed = Number(value.toPrecision(12));
  return fixed.toString();
}
