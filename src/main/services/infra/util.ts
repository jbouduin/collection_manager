export function runSerial<T>(taskParameters: Array<T>, task: (t: T, index: number, total: number) => Promise<void>): Promise<void> {
  let result = Promise.resolve();
  const total = taskParameters.length;
  taskParameters.forEach((taskParameter: T, idx: number) => {
    result = result.then(async () => {
      console.log(`executing task ${idx + 1} of ${total}`);
      await task(taskParameter, idx, total);
    });
  });
  return result;
}
