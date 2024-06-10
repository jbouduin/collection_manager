export function runSerial<T>(
  taskParameters: Array<T>,
  // NEXT remove this parameter
  progressMessageBuilder: (t: T) => string,
  task: (t: T, index: number, total: number) => Promise<void>): Promise<void> {
  let result = Promise.resolve();
  const total = taskParameters.length;
  taskParameters.forEach((taskParameter: T, idx: number) => {
    result = result.then(async () => {
      console.log(`${progressMessageBuilder(taskParameter)} (${idx + 1}/${total})`);
      await task(taskParameter, idx, total);
    }).catch((reason) => {
      throw reason;
    });
  });
  return result;
}
