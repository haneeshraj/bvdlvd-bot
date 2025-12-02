import ping from './ping.js';
import assign from './assign.js';
import autosort from './autosort.js';
import talk from './talk.js';
import countdown from './countdown.js';
import timer from './timer.js';
import announce from './announce.js';
import type { Command } from '../types/command.js';

export const commands: Command[] = [ping, assign, autosort, talk, countdown, timer, announce];

export default commands;