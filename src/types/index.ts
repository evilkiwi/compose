export type ANSI = 'never'|'always'|'auto';

export interface DockerComposeOptions {
  projectName?: string;
  parallel?: number;
  envFile?: string;
  ansi?: ANSI;
}

export interface ComposeOptions {
  v1?: boolean;
  env?: NodeJS.ProcessEnv;
  cwd?: string;
  path?: string|string[];
  config?: string;
  debug?: boolean;
  options?: DockerComposeOptions;
}

export interface ExecuteOptions extends ComposeOptions {
  command: string;
  args?: string[];
}
