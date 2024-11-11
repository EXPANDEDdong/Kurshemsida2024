export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): F & { cancel: () => void } {
  let timerId: number | undefined;

  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ) {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(
      () => func.apply(this, args),
      delay
    ) as unknown as number;
  } as F & { cancel: () => void };

  debouncedFunction.cancel = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  };

  return debouncedFunction;
}
