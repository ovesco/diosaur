# Installing
Diosaur is available for both Node and Deno.

## Modifying your tsconfig.json
In your `tsconfig.json` file you'll need to enable those two flags for Diosaur to work:
```json
{
    "compilerOptions": {
        // ...
        "lib": ["ES2017"],
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,

        // This will be necessary for attribute injection
        // Not necessary if you only inject dependencies through constructor
        "strictPropertyInitialization": false,
    }
}
```
This is required for Diosaur to infer and detect types of your objects and reference correct
dependencies.

## Using with node
To use Diosaur with node, first install the library along with `reflect-metadata` which is required:
```
npm install --save diosaur reflect-metadata
```

Then you can initialize it like this:
```typescript
// Load reflect-metadata
import 'reflect-metadata';

// Load library essentials
import { Service, Inject, getContainer } from 'diosaur';
```

## Using with Deno
Using Diosaur with Deno is as simple as doing
```typescript
// index.ts

// Import reflect-metadata
import 'https://raw.githubusercontent.com/rbuckton/reflect-metadata/master/Reflect.js';

// Load library essentials
import { Service, Inject, getContainer } from 'https://deno.land/x/diosaur@master/mod.ts';
```

You can then run it with
```
deno run -c tsconfig.json index.ts
```