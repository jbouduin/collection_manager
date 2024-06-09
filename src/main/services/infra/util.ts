export function runSerial<T>(
  taskParameters: Array<T>,
  progressMessageBuilder: (t: T) => string, // LATER remove this one or replace by ProgressCallback
  task: (t: T, index: number, total: number) => Promise<void>): Promise<void> {
  let result = Promise.resolve();
  const total = taskParameters.length;
  taskParameters.forEach((taskParameter: T, idx: number) => {
    result = result.then(async () => {
      console.log(`${progressMessageBuilder(taskParameter)} (${idx + 1}/${total})`);
      await task(taskParameter, idx, total);
    });
  });
  return result;
}
