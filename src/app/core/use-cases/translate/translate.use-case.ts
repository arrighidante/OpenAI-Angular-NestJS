import type { TranslateResponse } from '@interfaces/translate.response';
import { environment } from 'environments/environment';

export const translateTextUseCase = async (prompt: string, lang: string) => {
  try {
    const resp = await fetch(`${environment.backendAPI}/gpt/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) {
      throw new Error('An error occurred while trying to translate');
    }

    const { message } = (await resp.json()) as TranslateResponse;
    return {
      ok: true,
      message: message,
    };
  } catch (error) {
    return {
      userScore: 0,
      errors: [],
      message: 'An error occurred while trying to translate',
    };
  }
};
