// Type Assertion Example

// Example 1: Asserting a variable as a specific type
let someValue: unknown = "Hello, TypeScript!";
let strLength: number = (someValue as string).length;

console.log(`The length of the string is: ${strLength}`);

// Example 2: Using angle-bracket syntax for type assertion
let anotherValue: unknown = 42;
let numericValue: number = <number>anotherValue;

console.log(`The numeric value is: ${numericValue}`);