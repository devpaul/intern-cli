import * as semver from 'semver';
import { statSync } from 'fs';
import { mkdirSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';
import { constants } from 'os';
import { format } from './log';

/**
 * Ensures that a semver is contained in a range
 */
export function acceptVersion (version: string, minVersion: string, maxVersion?: string) {
	let range = `>=${ minVersion }`;

	if (maxVersion) {
		range += ` <=${ maxVersion }`;
	}
	const [ basicVersion ] = version.split('-');
	return semver.satisfies(basicVersion, range);
}

/**
 * Collects values into an array
 */
export function collect<T>(val: T, arr: T[]) {
	arr.push(val);
	return arr;
}

/**
 * Synchronously copies files or directories
 */
export function copy(src: string, dst: string) {
	if (statSync(src).isDirectory()) {
		try {
			mkdirSync(dst);
		}
		catch (error) {
			if (error.code !== 'EEXIST') {
				throw error;
			}
		}

		for (const filename of readdirSync(src)) {
			copy(join(src, filename), join(dst, filename));
		}
	}
	else {
		const data = readFileSync(src);
		writeFileSync(dst, data);
	}
}

/**
 * Ensures a value is part of an enum
 */
export function enumArg<T>(choices: T[], val: T) {
	if (choices.indexOf(val) === -1) {
		die(`error: expected "${ val }" to be one of {${ choices.join(', ') }}`)
	}
	return val;
}

/**
 * Get the exit code corresponding to a signal name
 */
export function exitCodeForSignal(signalName: string): number {
	return 128 + Number((<any> constants.signals)[signalName] || 0);
}

/**
 * Ensures that a value is a number and returns its int value
 */
export function intArg(val: any) {
	if (isNaN(val)) {
		exports.die(`error: expected "${ val }" to be a number`);
	}
	return parseInt(val, 10);
}

/**
 * Logs an error message and exits
 */
export function die(message?: any, ... args: any[]) {
	console.error();

	if (args.length === 0 && Array.isArray(message)) {
		console.error(format(message.join('\n')));
	}
	else {
		console.error(format(message, arguments));
	}

	console.error();
	process.exit(1);
}
