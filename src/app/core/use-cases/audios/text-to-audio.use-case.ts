import { environment } from 'environments/environment';

export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const resp = await fetch(
      `${environment.backendAPI}/gpt/text-to-audio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, voice }),
      }
    );

    if (!resp.ok) {
      throw new Error(
        'An error occurred while trying to generate voice'
      );
    }

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);




    return {
      ok: true,
      message: prompt,
      audioUrl: audioUrl
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'An error occurred while trying to generate voice',
      audioUrl: ''
    };
  }
};
