import { cwd as nodeCwd } from 'node:process';
import { spawn } from 'node:child_process';
import type { ComposeOptions, ExecuteOptions } from './types';
import { camelToSnakeCase } from './helpers';

export const compose = (options: ComposeOptions = {}) => {
  if (options.debug) {
    console.debug(options);
  }

  return {
    up: async (service?: string|string[], interactive = false) => execute({
      ...options,
      command: 'up',
      args: [
        ...(interactive ? [] : ['-d']),
        ...(service ? Array.isArray(service) ? service : [service] : []),
      ],
    }),
    stop: async (service?: string|string[]) => execute({
      ...options,
      command: 'stop',
      ...(service ? {
        args: Array.isArray(service) ? service : [service],
      } : {}),
    }),
    build: async (service?: string|string[]) => execute({
      ...options,
      command: 'build',
      ...(service ? {
        args: Array.isArray(service) ? service : [service],
      } : {}),
    }),
    pull: async (service?: string|string[]) => execute({
      ...options,
      command: 'pull',
      ...(service ? {
        args: Array.isArray(service) ? service : [service],
      } : {}),
    }),
    exec: async (service: string, command: string|string[]) => execute({
      ...options,
      command: 'exec',
      args: [
        '-T', service,
        ...(Array.isArray(command) ? command : [command]),
      ],
    }),
    run: async (service: string, command: string|string[]) => execute({
      ...options,
      command: 'run',
      args: [
        '-T', service,
        ...(Array.isArray(command) ? command : [command]),
      ],
    }),
    restart: async (service?: string|string[]) => execute({
      ...options,
      command: 'restart',
      ...(service ? {
        args: Array.isArray(service) ? service : [service],
      } : {}),
    }),
    rm: async (services: string[]) => execute({
      ...options,
      command: 'rm',
      args: ['-f', ...services],
    }),
    pause: async (service: string) => execute({
      ...options,
      command: 'pause',
      args: [service],
    }),
    unpause: async (service: string) => execute({
      ...options,
      command: 'unpause',
      args: [service],
    }),
    down: async () => execute({
      ...options,
      command: 'down',
    }),
    kill: async () => execute({
      ...options,
      command: 'kill',
    }),
    version: async () => {
      const result = await execute({
        ...options,
        command: 'version',
        args: ['--short'],
      });

      return result.replaceAll(/\n/g, '');
    },
  };
};

export const execute = async (options: ExecuteOptions) => {
  if (options.debug) {
    console.debug(`running command ${options.command}`);
  }

  // Assign some defaults.
  const composeOptions = options.options ?? {};
  const env = options.env ?? process.env;
  const cwd = options.cwd ?? nodeCwd();

  if (options.config) {
    options.path = undefined;
  }

  // Build the raw `docker compose` command arguments.
  const args: string[] = options.v1 ? [] : ['compose'];

  // Append the config arguments.
  if (options.config) {
    args.push('-f', '-');
  } else if (Array.isArray(options.path)) {
    args.push(...options.path.reduce<string[]>((args, path) => [...args, '-f', path], []));
  } else if (typeof options.path === 'string') {
    args.push('-f', options.path);
  }

  // Append any custom arguments.
  Object.keys(composeOptions).forEach(key => {
    args.push(`--${camelToSnakeCase(key)}`, (composeOptions as any)[key]);
  });

  // Append the command to execute.
  args.push(options.command, ...(options.args ?? []));

  if (options.debug) {
    console.debug(`using args:`, args);
  }

  // Execute the command.
  const result = await new Promise<string>((resolve, reject) => {
    // Spawn the docker process!
    const child = spawn(options.v1 ? 'docker-compose' : 'docker', args, { cwd, env });

    // Buffer output from the process.
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => stdout = `${stdout}${data.toString()}`);
    child.stderr.on('data', data => stderr = `${stdout}${data.toString()}`);

    // Instantly reject if we fail to run the command.
    child.on('error', e => reject(e));

    // Once the process has finished, we can safely resolve/reject.
    child.on('close', code => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });

    // If compose config was provided, write it to stdin.
    if (options.config) {
      child.stdin.write(options.config);
      child.stdin.end();
    }
  });

  if (options.debug) {
    console.debug('command output', result);
  }

  return result;
};
