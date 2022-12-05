import {
  parseDocument, Scalar, YAMLMap, YAMLSeq,
} from 'yaml';
import { insertStep, stepExists } from '../yaml';

const TEST_STEP = { name: 'TESTSTEP' };

function checkTestStep(maybeStep: unknown, commentBefore?: string) {
  expect(maybeStep instanceof YAMLMap).toBe(true);
  if (!(maybeStep instanceof YAMLMap)) return;

  expect(maybeStep.commentBefore).toBe(commentBefore ?? null);

  expect(maybeStep.items).toHaveLength(1);
  if (!maybeStep.items[0]) return;

  const { key, value } = maybeStep.items[0] as { key: unknown, value: unknown };
  expect(key).toBeInstanceOf(Scalar);
  expect(value).toBeInstanceOf(Scalar);
  if (!(key instanceof Scalar) || !(value instanceof Scalar)) return;

  expect(key.value).toBe('name');
  expect(value.value).toBe(TEST_STEP.name);
}

let doc: ReturnType<typeof parseDocument>;
let steps: YAMLSeq;

beforeEach(() => {
  doc = parseDocument(`
    steps:
      - name: First
        uses: something
      - name: Second
        run: echo a command
      - name: Third
        run: echo done
  `);
  steps = doc.get('steps') as YAMLSeq;
});

describe('insertStep', () => {
  it('should insert before the beginning of a steps array', () => {
    const inserted = insertStep(doc, steps, 'before', 'First', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[0]);
  });

  it('should insert after the beginning of a steps array', () => {
    const inserted = insertStep(doc, steps, 'after', 'First', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[1]);
  });

  it('should before the middle of a steps array', () => {
    const inserted = insertStep(doc, steps, 'before', 'Second', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[1]);
  });

  it('should after the middle of a steps array', () => {
    const inserted = insertStep(doc, steps, 'after', 'Second', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[2]);
  });

  it('should before the end of a steps array', () => {
    const inserted = insertStep(doc, steps, 'before', 'Third', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[2]);
  });

  it('should after the end of a steps array', () => {
    const inserted = insertStep(doc, steps, 'after', 'Third', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[3]);
  });

  it('should properly add a comment on the inserted step', () => {
    const comment = 'Some comment';
    const inserted = insertStep(doc, steps, 'after', 'Third', TEST_STEP, comment);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[3], comment);
  });

  it('should do nothing and report failure if the step to insert by is not found', () => {
    const inserted = insertStep(doc, steps, 'after', 'fake step', TEST_STEP);
    expect(inserted).toBe(false);
    expect(steps.items).toHaveLength(3);
  });

  it('should insert on the correct node when passed a name matcher', () => {
    const inserted = insertStep(doc, steps, 'after', (name) => name === 'Second', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[2]);
  });

  it('should insert on the correct node when differing in case', () => {
    const inserted = insertStep(doc, steps, 'after', 'second', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[2]);
  });

  it('should insert on the correct node when differing in whitespace', () => {
    const inserted = insertStep(doc, steps, 'after', ' second ', TEST_STEP);
    expect(inserted).toBe(true);
    expect(steps.items).toHaveLength(4);
    checkTestStep(steps.items[2]);
  });

  it('should do nothing and report failure if the step to insert by is not found with a name matcher', () => {
    const inserted = insertStep(doc, steps, 'after', (name) => name === 'fake step', TEST_STEP);
    expect(inserted).toBe(false);
    expect(steps.items).toHaveLength(3);
  });
});

describe('stepExists', () => {
  it('should return true if a step exists', () => {
    expect(stepExists(steps, 'First')).toBe(true);
    expect(stepExists(steps, 'Second')).toBe(true);
    expect(stepExists(steps, 'Third')).toBe(true);
  });

  it('should return false if a step does not exist', () => {
    expect(stepExists(steps, 'Fake step')).toBe(false);
  });

  it('should match with different casing', () => {
    expect(stepExists(steps, 'first')).toBe(true);
  });

  it('should match with differing whitespace', () => {
    expect(stepExists(steps, ' first ')).toBe(true);
  });
});
