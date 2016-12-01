export const capabilities = {};

export const environments = [ { browserName: 'chrome' } ];

export const maxConcurrency = 2;

export const tunnel = 'NullTunnel';

export const loaderOptions = {
	packages: [ { name: 'app', location: '_build' } ]
};

export const loaders = {
	'host-browser': 'node_modules/dojo-loader/loader.js',
	'host-node': 'dojo-loader'
};

export const suites = [
	'app/tests/unit/*'
];

export const functionalSuites: string[] = [
];

export const excludeInstrumentation = /^(?:tests|node_modules)\//;
