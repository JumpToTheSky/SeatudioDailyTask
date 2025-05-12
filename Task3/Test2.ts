interface Person {
    Name: string;
    Age: number;
    Address?: string;
}

let A: Person = {
    Name: "John",
    Age: 30
};

if (A.Address) {
    console.log(A.Address);
}
