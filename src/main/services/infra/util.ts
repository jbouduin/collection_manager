export function runSerial<T>(taskParameters: Array<T>, task: (t: T) => Promise<void>): Promise<void> {
  let result = Promise.resolve();
  taskParameters.forEach((taskParameter: T, idx: number) => {
    result = result.then(async () => {
      console.log(`executing task ${idx + 1} of ${taskParameters.length}`);
      await task(taskParameter);
    });
  });
  return result;
}
