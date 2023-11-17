import esbuild from 'esbuild'

const build: esbuild.BuildOptions = {
    entryPoints: ['./src/gas/entry.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    target: 'es2019',
    format: 'esm',
    treeShaking: false
}

await esbuild.build(build)
