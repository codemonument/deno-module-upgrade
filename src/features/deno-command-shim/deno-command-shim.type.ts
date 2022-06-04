import { DenoShimExecCommand } from "./deno-shim-exec-command.type.ts";

/**
 * A data structure which can be used to parse command shim (a.k.a cli-alias) files
 *  which deno creates when using the `deno install` command
 */
export interface DenoCommandShim {
  /**
   * The path where the command shim was found.
   */
  path: string;

  /**
   * The file content of the command shim as array of lines
   */
  lines: string[];

  /**
   * The command which is run when the shim is called
   */
  commandString: string;

  execCommand: DenoShimExecCommand;
}
