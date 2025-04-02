// Disable ESLint for build
module.exports = {
  extends: 'next',
  rules: {
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-no-undef': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'jsx-a11y/role-supports-aria-props': 'off'
  }
}
