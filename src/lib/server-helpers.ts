export const delayServerResponse = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}