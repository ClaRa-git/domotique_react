// babel.config.cjs
// Nécessaire car le projet utilise "type": "module" dans package.json
// Jest a besoin de CommonJS → on utilise .cjs pour ce fichier
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
