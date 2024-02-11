import { environment } from 'environments/environment';

export async function* prosConsStreamUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${environment.backendAPI}/gpt/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );

    if (!resp.ok) {
      throw new Error('An error occurred while trying to compare');
    }

    // Allow us to read the response as a stream
    const reader = resp.body?.getReader();
    if (!reader) {
      console.log('Reader is not working');
      throw new Error('An error occurred with the Reader');
    }

    const decoder = new TextDecoder();
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = decoder.decode(value, { stream: true });
      text += decoder.decode(value);
      yield text;
    }

    return text;
  } catch (error) {
    return null;
  }
}
