import registerSuite = require('intern!object');
import * as assert from 'intern/chai!assert';
import * as cli from '../../src/lib/cli';
import * as fs from 'fs';
import * as path from 'path';

registerSuite({
	name: 'lib/cli',

	acceptVersion: function () {
		assert.isTrue(cli.acceptVersion('3.3.0-pre', '3.0.0'));
		assert.isTrue(cli.acceptVersion('3.3.2', '3.0.0'));
		assert.isFalse(cli.acceptVersion('2.3.2', '3.0.0'));
	},

	collect: function () {
		const input: string[] = [];
		cli.collect('5', input);
		assert.deepEqual(input, [ '5' ]);

		cli.collect('6', input);
		assert.deepEqual(input, [ '5', '6' ]);
	},

	copy: (function () {
		function rm(name: string) {
			if (fs.statSync(name).isDirectory()) {
				fs.readdirSync(name).forEach(function (filename) {
					rm(path.join(name, filename));
				});
				fs.rmdirSync(name);
			}
			else {
				fs.unlinkSync(name);
			}
		}

		let tempdir: string;

		return {
			setup: function () {
				fs.mkdirSync('.testtmp');
				tempdir = '.testtmp';
			},

			afterEach: function () {
				fs.readdirSync(tempdir).forEach(function (filename: string) {
					rm(path.join(tempdir, filename));
				});
			},

			teardown: function () {
				rm(tempdir);
			},

			'copy file': function () {
				cli.copy('./tests/unit/all.ts', path.join(tempdir, 'all.js'));
				assert.isTrue(fs.statSync(path.join(tempdir, 'all.js')).isFile());
			},

			'copy dir': function () {
				cli.copy('./tests', tempdir);
				assert.isTrue(fs.statSync(path.join(tempdir, 'unit', 'all.ts')).isFile());
			}
		};
	})(),

	enumArg: (function () {
		const oldDie = cli.die;
		let message: string;

		return {
			setup: function () {
				cli._setDieMethod(function (msg: string) {
					message = msg;
				});
			},

			beforeEach: function () {
				message = null;
			},

			teardown: function () {
				cli._setDieMethod(oldDie);
			},

			good: function () {
				assert.strictEqual(cli.enumArg([ 'a', 'b' ], 'a'), 'a');
				assert.isNull(message);
			},

			bad: function () {
				cli.enumArg([ 'a', 'b' ], 'c');
				assert.isNotNull(message);
			}
		};
	})()
});
