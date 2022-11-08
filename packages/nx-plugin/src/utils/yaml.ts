import {
  Document, Scalar, YAMLMap, YAMLSeq,
} from 'yaml';

/**
 * Given some GitHub Actions steps from a YAML workflow configuration, find the index of a step
 * with a given name
 *
 * @param steps The steps section of the parsed document
 * @param stepName The name of the step to look for, or a function which takes the
 *  name and returns whether or not it is the desired step
 * @returns The index of the step if found, otherwise -1
 */
function findStep(
  steps: YAMLSeq,
  stepName: string | ((name: string) => boolean),
) {
  return steps.items.findIndex((step: unknown) => {
    // This item of the steps sequence is not of the correct type
    if (!(step instanceof YAMLMap)) return false;

    // step is a key-value map. We want the key to be "name" and the value to be the name
    // we're looking for
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

/**
 * Given some GitHub Actions steps from a YAML workflow configuration, insert a new step in
 * a specific location
 *
 * @param doc The parsed YAML document for the GitHub Actions workflow
 * @param steps The steps section of the parsed document
 * @param where Whether to insert the new step before or after the step given by insertStepName
 * @param insertStepName The name of the step to insert before/after, or a function which takes the
 *  name and returns whether or not it is the step to insert at
 * @param value The step to insert (eg, as a plain object)
 * @param comment A comment to add before the inserted step
 * @returns Whether or not the step was successfully inserted. Inserts will fail if the step given
 *   by insertStepName is not found
 */
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

/**
 * Given some GitHub Actions steps from YAML workflow configuration, determine whether a step with
 * a given name exists
 *
 * @param steps The steps section of the parsed document
 * @param stepName The name of the step to check for
 */
export function stepExists(steps: YAMLSeq, stepName: string) {
  return findStep(steps, stepName) !== -1;
}
