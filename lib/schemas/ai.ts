export const MODELS_FALLBACK_CHAIN = [
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it',
  'gemma-2.5-flash'
] as const

export type GemmaModel = typeof MODELS_FALLBACK_CHAIN[number]