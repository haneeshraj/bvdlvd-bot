import ping from './ping';
import assign from './assign';
import autosort from './autosort';
import type { Command } from '../types/command';

export const commands: Command[] = [ping, assign, autosort];

export default commands;