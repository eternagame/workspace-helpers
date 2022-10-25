import {
  Document, Scalar, YAMLMap, YAMLSeq,
} from 'yaml';

function findStep(
  steps: YAMLSeq,
  stepName: string | ((name: string) => boolean),
) {
  return steps.items.findIndex((step: unknown) => {
    if (!(step instanceof YAMLMap)) return false;
    return step.items.some((entry) => {
      if (!(entry.key instanceof Scalar)) return false;
      if (!(entry.key.value === 'name')) return false;
      if (!(entry.value instanceof Scalar)) return false;
      if (!(typeof entry.value.value === 'string')) return false;
      if (typeof stepName === 'string') return entry.value.value.toLowerCase().trim() === stepName.toLowerCase().trim();
      return stepName(entry.value.value);
    });
  });
}

export function insertStep(
  doc: Document,
  steps: YAMLSeq,
  where: 'before' | 'after',
  insertStepName: string | ((name: string) => boolean),
  value: unknown,
  comment?: string,
): boolean {
  const newNode = doc.createNode(value);
  newNode.commentBefore = comment ?? null;

  const insertIndex = findStep(steps, insertStepName);

  if (insertIndex === -1) return false;

  steps.items.splice(insertIndex + (where === 'after' ? 1 : 0), 0, newNode);

  return true;
}

export function stepExists(steps: YAMLSeq, stepName: string) {
  return findStep(steps, stepName) !== -1;
}
