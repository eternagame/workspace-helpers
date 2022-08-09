import path from 'path';
import TsEslintUtils from '@typescript-eslint/utils';
import type JsoncEslintParser from 'jsonc-eslint-parser';
import findPkgUp from '../utils/find-pkg-up';

type DepOptions = {
  root: boolean;
  subPackage: boolean;
};

type Options = [
  {
    dependencies: DepOptions | boolean;
    devDependencies: DepOptions | boolean;
    peerDependencies: DepOptions | boolean;
    optionalDependencies: DepOptions | boolean;
    bundledDependencies: DepOptions | boolean;
  },
];

/**
 * Verify whether or not a dependency node is allowed based on whether the package
 * is the root or a sub-package
 *
 * @param node Node to check
 * @param options Rule options
 * @param type Type of dependency
 * @param isRootPackage Whether or not this package is the root one
 * @returns Whether or not the node is valid
 */
function checkNode(
  node: JsoncEslintParser.AST.JSONProperty,
  options: Options[0],
  type: keyof Options[0],
  isRootPackage: boolean,
): boolean {
  const allowed = options[type];

  // If this node isn't the one we're trying to check, skip
  if (node.key.type !== 'JSONLiteral') return true;
  if (node.key.value !== type) return true;

  // If we allow this dependency type, we're good
  if (allowed === true) return true;
  // If we allow this dependency type based on whether or not this is a root package, we're good
  if (isRootPackage && allowed instanceof Object && allowed.root) return true;
  if (!isRootPackage && allowed instanceof Object && allowed.subPackage) return true;

  return false;
}

type MessageIds = 'depNotAllowed';

export default TsEslintUtils.ESLintUtils.RuleCreator(() => __filename)<
Options,
MessageIds
>({
  name: 'monorepo-dep-location',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'specify which dependency types are allowed in a package.json in a given level of a monorepo',
      recommended: false,
    },
    messages: {
      depNotAllowed:
        '{{dependencyType}} is not allowed for a {{packageType}} package',
    },
    schema: [
      {
        type: 'object',
        properties: {
          dependencies: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  root: { type: 'boolean' },
                  subPackage: { type: 'boolean' },
                },
                required: ['root', 'subPackage'],
              },
            ],
          },
          devDependencies: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  root: { type: 'boolean' },
                  subPackage: { type: 'boolean' },
                },
                required: ['root', 'subPackage'],
              },
            ],
          },
          peerDependencies: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  root: { type: 'boolean' },
                  subPackage: { type: 'boolean' },
                },
                required: ['root', 'subPackage'],
              },
            ],
          },
          optionalDependencies: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  root: { type: 'boolean' },
                  subPackage: { type: 'boolean' },
                },
                required: ['root', 'subPackage'],
              },
            ],
          },
          bundledDependencies: {
            anyOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  root: { type: 'boolean' },
                  subPackage: { type: 'boolean' },
                },
                required: ['root', 'subPackage'],
              },
            ],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      dependencies: { root: false, subPackage: true },
      devDependencies: { root: true, subPackage: false },
      peerDependencies: { root: false, subPackage: true },
      optionalDependencies: { root: true, subPackage: true },
      bundledDependencies: { root: false, subPackage: true },
    },
  ],
  create(context, [options]) {
    if (path.basename(context.getFilename()) !== 'package.json') return {};

    const isRootPackage = findPkgUp(path.dirname(context.getFilename())).length === 0;
    const depTypes = [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies',
      'bundledDependencies',
    ] as const;

    return {
      JSONProperty: function handleJsonNode(
        node: JsoncEslintParser.AST.JSONProperty,
      ) {
        for (const depType of depTypes) {
          if (!checkNode(node, options, depType, isRootPackage)) {
            context.report({
              // This is just due to the idiosyncrasies of using typescript-eslint/utils with a
              // different parser
              // eslint-disable-next-line max-len
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
              node: node as any,
              messageId: 'depNotAllowed',
              data: {
                dependencyType: depType,
                packageType: isRootPackage ? 'root' : 'non-root',
              },
            });
          }
        }
      },
    };
  },
});
