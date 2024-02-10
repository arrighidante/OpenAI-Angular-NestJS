import { ProsConsResponse } from '@interfaces/pros-cons.response';
import { environment } from 'environments/environment';

export const prosConsUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${environment.backendAPI}/gpt/pros-cons-discusser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) {
      throw new Error('An error occurred while trying to compare');
    }

    const data = (await resp.json()) as ProsConsResponse;
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      errors: '',
      content: 'An error occurred while trying to compare.',
    };
  }
};
