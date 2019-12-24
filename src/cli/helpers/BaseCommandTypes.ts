import { AlphabetLowercase, AlphabetUppercase } from './alphabet'

export interface IArg<T = string> {
  name: string
  description?: string
  required?: boolean
  hidden?: boolean
  default?: T | (() => T)
  options?: string[]
}

export type FlagOutput<Flags extends FlagInput> = {
  [FlagName in keyof Flags]: Flags[FlagName]['type'] extends 'boolean'
    ? boolean | undefined
    : Flags[FlagName]['type'] extends 'string'
    ? string | undefined
    : Flags[FlagName]['type']
}
export type FlagInput = { [flagName: string]: FlagDefinition }

export interface IFlag {
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
}

export type FlagDefinition = IFlag & {
  type: 'boolean' | 'string'
}

export type ArgsInput = IArg<any>[]

export type ParserInput<
  TFlags extends {
    [name: string]: any
  }
> = {
  flags?: TFlags
  args?: ArgsInput
  strict?: boolean
  context?: any
  '--'?: boolean
}

export type ParserOutput<F extends any> = {
  flags: any
}
