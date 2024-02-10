import type { OrthographyResponse } from '@interfaces/orthography.response';
import { environment } from 'environments/environment';

export const orthographyUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${environment.backendAPI}/gpt/orthography-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) {
      throw new Error(
        'An error occurred while trying to correct the orthography'
      );
    }

    const data = (await resp.json()) as OrthographyResponse;
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      userScore: 0,
      errors: [],
      message: 'An error occurred',
    };
  }
};
