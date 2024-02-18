# My TypeScript Journey: Earned Badges 🏆

## Badges Overview

Here is a collection of badges I earned from completing Microsoft Learn's TypeScript modules:

1. **Getting Started with TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/4S2N8LEK?sharingId=1E2CC95861031AD9)
2. **Declare Variable Types in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/andrejkautsevich-2407/8R6BLBKW?sharingId=1E2CC95861031AD9)

## Reflections

1. **Getting Started with TypeScript**: In this module I got an overview of TypeScript and its key features. I learned how to install the TypeScript compiler and set up projects in Visual Studio Code. TypeScript addresses the limitations of JavaScript, doing so without compromising the key value proposition of JavaScript: the ability to run your code anywhere and on every platform, browser, or host.
2. **Declare Variable Types in TypeScript**: The main benefit of TypeScript is that it enables to add static types to JavaScript code, which enhances code clarity and helps prevent unexpected errors. To declare an explicit type, the syntax `variableName: type` is used. All types in TypeScript are subtypes of a single top type called the any type. Types are categorized as primitive types, object types, or type parameters. A helpful addition to the standard set of datatypes from JavaScript is the enumeration type, or enum. Using enumerations:

    > * Helps reduce errors caused by transposing or mistyping numbers.
    > * Makes it easy to change values in the future.
    > * Makes code easier to read, which means it's less likely that errors will creep into it.
    > * Ensures forward compatibility. With enumerations, your code is less likely to fail if someone changes the values corresponding to the member names in the future.

    A union type describes a value that can be one of several types. This flexibility can be helpful when a value isn't under control. It uses the vertical bar or pipe (|) to separate each type. An intersection type combines two or more types to create a new type that has all properties of the existing types. It uses the ampersand (&) to separate each type, or you can use lyteral types to provide exact values to variables. Object type such as array declare syntax: `primitive[]` or `Array<'type'>`. TypeScript provides the Tuple type for array that contains values of mixed types. To declare a Tuple, use the syntax `variableName: [type, type, ...]`. All this provide reducing the likelihood of runtime errors and improving overall code quality.
