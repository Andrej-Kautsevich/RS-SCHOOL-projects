# My TypeScript Journey: Earned Badges 🏆

## Badges Overview

Here is a collection of badges I earned from completing Microsoft Learn's TypeScript modules:

1. **Getting Started with TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/4S2N8LEK?sharingId=1E2CC95861031AD9)
2. **Declare Variable Types in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/8R6BLBKW?sharingId=1E2CC95861031AD9)
3. **Implement Interfaces in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/J6EAUV4T?sharingId=1E2CC95861031AD9)
4. **Develop Typed Functions in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/3XLKMFZH?sharingId=1E2CC95861031AD9)
5. **Declare and Instantiate Classes in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/3XLJTGGH?sharingId=1E2CC95861031AD9)
6. **Generics in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/EJ7YDMAP?sharingId=1E2CC95861031AD9)
7. **Work with External Libraries in TypeScript**: [Badge]([badge-link](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/FZUCHAHX?sharingId=1E2CC95861031AD9))


## Reflections

1. **Getting Started with TypeScript**: In this module I got an overview of TypeScript and its key features. I learned how to install the TypeScript compiler and set up projects in Visual Studio Code. TypeScript addresses the limitations of JavaScript, doing so without compromising the key value proposition of JavaScript: the ability to run your code anywhere and on every platform, browser, or host.

2. **Declare Variable Types in TypeScript**: The main benefit of TypeScript is that it enables to add static types to JavaScript code, which enhances code clarity and helps prevent unexpected errors. To declare an explicit type, the syntax `variableName: type` is used. All types in TypeScript are subtypes of a single top type called the any type. Types are categorized as primitive types, object types, or type parameters. A helpful addition to the standard set of datatypes from JavaScript is the enumeration type, or enum. Using enumerations:

    > * Helps reduce errors caused by transposing or mistyping numbers.
    > * Makes it easy to change values in the future.
    > * Makes code easier to read, which means it's less likely that errors will creep into it.
    > * Ensures forward compatibility. With enumerations, your code is less likely to fail if someone changes the values corresponding to the member names in the future.

    A union type describes a value that can be one of several types. This flexibility can be helpful when a value isn't under control. It uses the vertical bar or pipe (|) to separate each type. An intersection type combines two or more types to create a new type that has all properties of the existing types. It uses the ampersand (&) to separate each type, or you can use lyteral types to provide exact values to variables. Object type such as array declare syntax: `primitive[]` or `Array<'type'>`. TypeScript provides the Tuple type for array that contains values of mixed types. To declare a Tuple, use the syntax `variableName: [type, type, ...]`. All this provide reducing the likelihood of runtime errors and improving overall code quality.

3. **Implement Interfaces in TypeScript**: From this module, I got an overview of interfaces in TypeScript. Interfaces are used to:

    > * Create shorthand names for commonly used types and get the benefit of Intellisense and type checking.
    > * Drive consistency across a set of objects because every object that implements the interface operates under the same type definitions.
    > * Describe existing JavaScript APIs and clarify function parameters and return types.

    So, interfaces are useful when working with a team of developers to ensure that proper values are being passed into properties, constructors, or functions. Interfaces are also useful when working with JavaScript libraries like jQuery.

4. **Develop Typed Functions in TypeScript**: In JavaScript function parameters are always optional. TypeScript allows to add the logic for checking data types for parameters, perform type checking on the passed arguments, or check the number of arguments received. Like in JS you may use function expression, declaration, arrow functions. In TS you can also use deconstruction and rest parameters. Typed functions are especially important when you're working with larger code bases or functions developed by others. TypeScript helps ensure the correct value types as you develop your code. In addition, when creating the function logic you'll have full autocomplete support.

5. **Declare and Instantiate Classes in TypeScript**: From this module, I’ve gained an understanding of TypeScript classes. They are similar to JS with some specific features. As with all TypeScript functions, the constructor parameters in can be required or optional, have default values, or be rest parameters. Accessors (get & set) are required to set or return the value of the object's members from code. In typescript, interfaces are used to establish a "code contract" that describe the required properties of an object and their types. So, you can use an interface to ensure class instance shape. Classes enable you to express common object-oriented patterns in a standard way, making features like inheritance more readable and interoperable.

6. **Generics in TypeScript**: Generics are a feature in TypeScript that are not supported in JavaScript. Generics are code templates that you can define and reuse throughout your codebase. They provide a way to tell functions, classes, or interfaces what type you want to use when you call it. It has syntax `< >`. Generics provides more flexibility when working with types, enable code reuse, reduce the need to use the any type.

7. **Work with External Libraries in TypeScript**: From this module, I’ve learned how to organize code using modules and import an external type library. Modules have been a feature of JavaScript since ES6, so they are also supported by TypeScript. Modules provide a way to organize and categorize your code, enabling you to group related code together. In real projects third-party libraries are often used. However, the JavaScript library may not have type definitions. As static typing is a primary reason to use TypeScript, it's possible to use external type for almost all common libraries, many of them can be found in a open-source project `DefinitelyTyped` and others.
