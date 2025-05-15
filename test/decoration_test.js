"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function simpleLog(target, propertyKey, descriptor) {
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
    add(a, b) {
        return a + b;
    }
    sayHello() {
        console.log('Hello');
    }
}
__decorate([
    simpleLog,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Number)
], Example.prototype, "add", null);
__decorate([
    simpleLog,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Example.prototype, "sayHello", null);
const example = new Example();
console.log(example.add(4, 5));
example.sayHello();
