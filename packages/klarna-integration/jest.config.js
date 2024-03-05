module.exports = {
    displayName: 'klarna-integration',
    preset: '../../jest.preset.js',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            diagnostics: false,
        },
    },
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['../../jest-setup.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../coverage/packages/klarna-integration',
};
