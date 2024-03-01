import { environment } from 'environments/environment';

export const createThreadUseCase = async () => {
  try {
    const resp = await fetch(`${environment.assistantAPI}/create-thread`, {
      method: 'POST',
    });

    const { id } = (await resp.json()) as { id: string };

    return id;
  } catch (error) {
    throw new Error('Error creating thread ID');
  }
};
