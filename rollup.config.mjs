import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/bundle/safe.ts',
    output: {
      format: 'iife',
      name: "safeEyo",
      file: './dist/bundle.safe.js'
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })]
  },
  {
    input: 'src/bundle/notSafe.ts',
    output: {
      format: 'iife',
      name: "notSafeEyo",      
      file: './dist/bundle.notSafe.js'
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })]
  }
];
