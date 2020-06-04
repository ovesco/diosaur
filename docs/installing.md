# Installing
Diosaur is available for both Node and Deno.

## Modifying your tsconfig.json
In your `tsconfig.json` file you'll need to enable those two flags for Diosaur to work:
```json
{
    "compilerOptions": {
        // ...
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
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
import { Service, Parameter, Inject } from 'diosaur';
```