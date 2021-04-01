export function logInvocation(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const className = target.constructor.name;
  let originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const result = await originalMethod.apply(this, args);
    return result;
  }

  return descriptor;
}

export function deplayResponse(delayMs: number) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      await delay(delayMs);
      return result;
    }

    return descriptor;
  }
}

async function delay(timeout: number) {
  return new Promise<void>((resolve) => setTimeout(() => {
    resolve();
  }, timeout));
}