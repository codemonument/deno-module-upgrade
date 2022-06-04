import { DenoCommandShim } from "./deno-command-shim.type.ts";
import { parseExecCommand } from "./parse-exec-command.ts";
import { DenoModuleUrlSegments } from "../deno-module-registries/deno-module-url-segments.type.ts";
import { DenoModuleRegistry } from "../deno-module-registries/deno-module-registry.type.ts";
import { detectModuleRegistry } from "../deno-module-registries/detect-module-registry.ts";
import { DenoShimExecCommand } from "./deno-shim-exec-command.type.ts";

export interface ParseDenoCommandShimOptions {
  /**
   * Default: true
   * If set to false, parsing function will not validate,
   * whether it was passed a deno shim or not.
   */
  validateDenoShim: boolean;
}

const defaultOptions: ParseDenoCommandShimOptions = {
  validateDenoShim: true,
};

/**
 * @param shimPath the path of the command shim
 * @param shimContent the content of the command shim as string
 * (so that this parser does not need to load the file itself - better for testing)
 */
export function parseDenoCommandShim(
  shimPath: string,
  shimContent: string | string[],
  options: Partial<ParseDenoCommandShimOptions> = {},
): DenoCommandShim {
  const { validateDenoShim } = { ...defaultOptions, ...options };

  const shimLines = (typeof shimContent === "string")
    ? shimContent.split("\n")
    : shimContent;
  const [_shebang, denoComment, commandString] = shimLines;

  if (validateDenoShim && denoComment !== "# generated by deno install") {
    throw new Deno.errors.InvalidData(
      `Command Shim "${shimPath}" may not have been generated by "deno install"! 
      Force proceed by running again with --validateDenoShim=false. 
    
      File Content: 
 
      ${shimContent}`,
    );
  }

  const execCommand: DenoShimExecCommand = parseExecCommand(commandString);
  const moduleRegistry: DenoModuleRegistry = detectModuleRegistry(
    execCommand.moduleURL,
  );

  const moduleUrlSegments: DenoModuleUrlSegments = moduleRegistry
    .parseModuleUrlSegments(execCommand.moduleURL);

  return {
    path: shimPath,
    lines: shimLines,
    commandString,
    execCommand,
    moduleUrlSegments,
  };
}
