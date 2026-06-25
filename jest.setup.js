// jest.setup.js
// Polyfill TextEncoder / TextDecoder — requis par react-router-dom v7 dans jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Charge les matchers @testing-library/jest-dom (toBeInTheDocument, etc.)
require('@testing-library/jest-dom');