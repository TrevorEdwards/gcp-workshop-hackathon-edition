var jsonString = '{ "name": "Ezra", "age": 211 }';

var parsedObject = JSON.parse(jsonString);

console.log(`Hello, ${parsedObject.name}! Next year you will be ${parsedObject.age + 1}.`);
