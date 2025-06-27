import globals from 'globals';
import pluginJS from '@eslint/js';
import pluginTS from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */

export default pluginTS.config(
	pluginJS.configs.recommended,
	pluginTS.configs.strict,
	pluginTS.configs.stylistic,
	{
		files: ['**/*'],
		languageOptions: {
			globals: {
				...globals.browser,
			},

			ecmaVersion: 'latest',
			sourceType: 'module',
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: pluginTS.parser,
			parserOptions: {
				tsconfigRootDir: './',
			},
		},
	},
	{
		files: ['**/*.{js,mjs}'],
		plugins: {
			style: stylistic,
		},
		rules: {
			curly: ['error', 'multi-line', 'consistent'],
			'max-nested-callbacks': ['error', { max: 4 }],
			'no-inline-comments': 'error',
			'no-lonely-if': 'error',
			'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
			yoda: 'error',
			'style/arrow-spacing': ['error', { before: true, after: true }],
			'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'style/comma-dangle': ['error', 'always-multiline'],
			'style/comma-spacing': 'error',
			'style/comma-style': 'error',
			'style/dot-location': ['error', 'property'],
			'style/indent': ['error', 'tab'],
			'style/keyword-spacing': 'error',
			'style/max-statements-per-line': ['error', { max: 2 }],
			'style/no-floating-decimal': 'error',
			'style/no-multi-spaces': 'error',
			'style/no-multiple-empty-lines': [
				'error',
				{ max: 2, maxEOF: 1, maxBOF: 0 },
			],
			'style/no-trailing-spaces': 'error',
			'style/object-curly-spacing': ['error', 'always'],
			'style/quotes': ['error', 'single'],
			'style/semi': ['error', 'always'],
			'style/space-before-blocks': 'error',
			'style/space-before-function-paren': [
				'error',
				{ anonymous: 'never', named: 'never', asyncArrow: 'always' },
			],
			'style/space-in-parens': 'error',
			'style/space-infix-ops': 'error',
			'style/space-unary-ops': 'error',
			'style/spaced-comment': 'error',
		},
	}
);
