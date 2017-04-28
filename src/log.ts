import * as util from 'util';
import { EOL } from 'os';

export function getFormatter(width: number, prefix: string) {
	return function (format: any, ...param: any[]) {
		const message = util.format(format, ... param);
		const messageLines = message.split(EOL);
		const lines = [];
		let line = messageLines.shift();
		while (line != null) {
			if (line.length - prefix.length <= width) {
				lines.push(prefix + line);
				line = messageLines.shift();
			}
			else {
				const shortLine = line.slice(0, width - prefix.length);
				const start = shortLine.search(/\S/);
				let space = shortLine.lastIndexOf(' ');
				if (space === -1 || space < start) {
					space = line.indexOf(' ', start);
				}

				if (space !== -1) {
					lines.push(prefix + line.slice(0, space));
					line = line.slice(space + 1);
				}
				else {
					lines.push(prefix + line);
					line = messageLines.shift();
				}
			}
		}

		return lines.join(EOL);
	}
}

export const format = getFormatter(80, '  ');

export interface Logger {
	(... args: any[]): void;
}

export function getLogger(verbose: boolean = false): Logger {
	if (verbose) {
		return function (format: any, ... args: any[]) {
			const message = util.format(format, ... args);
			process.stderr.write(`>> ${ message }${ EOL }`)
		};
	}
	return function () { };
}

/**
 * Prints a message to the console
 */
export function print(message?: any, ... args: any[]) {
	if (args.length === 0 && Array.isArray(message)) {
		console.log(format(message.join('\n')));
	}
	else {
		console.log(format(message, ... args));
	}
}
