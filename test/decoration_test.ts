function simpleLog(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    // const originalMethod = descriptor.value;
    // descriptor.value = function (...args: any[]) {
    //     console.log(`Calling ${key} with arguments: ${args}`);
    //     console.log('Target:', target);
    //     console.log('Descriptor:', descriptor);
    //     console.log('Original method:', originalMethod);
    //     console.log('This:', this);
    //     console.log('Arguments:', args);
    //     console.log('Result:', originalMethod.apply(this, args));
    //     return originalMethod.apply(this, args);
    // };
    // return originalMethod
    console.log('descriptor', descriptor);
}

class Example {


    @simpleLog
    add(a: number, b: number): number {
        return a + b;
    }
    @simpleLog
    sayHello() {
        console.log('Hello');
    }
}
const example = new Example();
console.log(example.add(4, 5));
example.sayHello();

