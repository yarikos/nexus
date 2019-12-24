import {
  ParserInput,
  ParserOutput,
  FlagInput,
  IArg,
  IFlag,
  FlagDefinition,
} from './BaseCommandTypes'
import arg from 'arg'

type FlagsBuilder = Record<
  'string' | 'boolean',
  (opt?: IFlag) => FlagDefinition
>

export const _flags: FlagsBuilder = {
  boolean: opt => ({ ...opt, type: 'boolean' }),
  string: opt => ({ ...opt, type: 'string' }),
}

export abstract class BaseCommand {
  /**
   * The tweet-sized description for your class, used in a parent-commands
   * sub-command listing and as the header for the command help
   */
  static description: string | undefined

  /** hide the command from help? */
  static hidden: boolean

  /** An override string (or strings) for the default usage documentation */
  static usage: string | string[] | undefined

  static help: string | undefined

  /** An array of aliases for this command */
  static aliases: string[] = []

  /** A hash of flags for the command */
  static flags?: FlagInput

  /** An order-dependent array of arguments for the command */
  static args?: IArg[]

  /** An array of example strings to show at the end of the command's help */
  static examples: string[] | undefined

  abstract async run(argv: string[]): Promise<void | string | Error>

  protected parse<F>(options: ParserInput<F>): ParserOutput<F> {
    if (!options) {
      options = this.constructor as any
    }

    const convertedFlags = this.convertToArgFlags(options?.flags ?? {})
    const parsedFlags = arg(convertedFlags, { permissive: true })
    const flags = this.convertToNormalFlags(parsedFlags)

    return {
      flags: flags as any,
    }
  }

  private convertToArgFlags<F extends FlagInput>(flags: F) {
    return Object.entries(flags).reduce<arg.Spec>(
      (acc, [flagName, flagValue]) => {
        acc[`--${flagName}`] = flagValue.type === 'boolean' ? Boolean : String

        if (flagValue.char) {
          acc[`-${flagValue.char}`] = `--${flagName}`
        }

        return acc
      },
      {}
    )
  }

  private convertToNormalFlags(result: arg.Result<any>) {
    return Object.entries(result).reduce<Record<string, string | boolean>>(
      (acc, [key, value]) => {
        if (key.startsWith('--')) {
          acc[key.substring(2)] = value
        }

        return acc
      },
      {}
    )
  }

  protected _help() {}
}

class Test extends BaseCommand {
  static flags = {
    help: _flags.boolean({ char: 'h' }),
  }

  static args = [
    {
      name: 'toto',
    },
  ]

  async run() {
    const { flags } = this.parse(Test)

    if (flags.help) {
      flags.help
    }
  }
}

new Test().run()
