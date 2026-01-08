import type { CardFormRef, CardTokenPayload } from '@/domain/checkout/interfaces/types'
import { TokenizeReasons } from '@/domain/checkout/types/reasons'

// Resultado de tokenización más expresivo (usar constantes del dominio)
export type TokenizeOk = { ok: true; payload: CardTokenPayload }
export type TokenizeFail = { ok: false; reason: typeof TokenizeReasons[keyof typeof TokenizeReasons]; error?: any }
export type TokenizeResult = TokenizeOk | TokenizeFail

// Tokeniza tarjeta si el método es 'card'. Requiere explícitamente la ref del formulario.
export async function autoTokenizeCard(form: CardFormRef): Promise<TokenizeResult> {
  if (!form?.tokenizePayload) return { ok: false, reason: TokenizeReasons.NO_FORM }
  try {
    const res = await form.tokenizePayload()
    if (!res) return { ok: false, reason: TokenizeReasons.NO_TOKEN }
    if ('error' in res) return { ok: false, reason: TokenizeReasons.FAILED, error: res.error }
    return { ok: true, payload: res as CardTokenPayload }
  } catch (err: any) {
    return { ok: false, reason: TokenizeReasons.FAILED, error: err }
  }
}
