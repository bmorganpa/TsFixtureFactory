# Fixture Factory

This module contains functions for creating fixture factories for typescript
interfaces (with sane defaults) similar to the
[factory_boy](http://factoryboy.readthedocs.io/en/latest/) python library.


## Basic usage

Simply pass a set of default properties to the 'createFixtureFactory' method.
Note that if you do not supply all of the required properties for the interface
that typescript will throw a compiler error.

### Example
    interface Product {
      id: string
      name: string
      other?: number
    }
    const productFactory = createFixtureFactory<Product>({
      id: 'id',
      name: 'my product',
    })

## Using factories inside other factories

You can also supply a factory as a default to another factory to create
nested objects.

### Example
    interface Bar {
      something: string
    }
    interface Foo {
      bar: Bar
    }
    const barFactory = createFixtureFactory<Bar>({
      something: 'my something'
    })
    const fooFactory = createFixtureFactory<Foo>({
      bar: barFactory,
    })

## Using factories to create other factories

You can also supply a factory as the second parameter to 'createFixtureFactory'
to create more specific factories on top of existing factories.

### Example
    interface User {
      name: string
      isAdmin: boolean
    }
    const userFactory = createFixtureFactory<User>({
      name: 'my name',
      isAdmin: false,
    })
    const adminUserFactory = createFixtureFactory<User>({
      isAdmin: true,
    }, userFactory)

