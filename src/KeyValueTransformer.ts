interface Foo {
    key: "fooKeyType",
    value: "fooValueType",
}

interface Bar {
    key: "barKeyType",
    value: "barValueType",
}

interface Baz {
    key: "bazKeyType",
    value: "bazValueType",
}

type FooBarBaz = Foo | Bar | Baz;
type FooBarBazKey = FooBarBaz["key"];
type FooBarBazValue = FooBarBaz["value"];

// Yep. It all boils down to transforming this type:
type KeyValue<K extends string, V> = {
    key: K,
    value: V,
};

// to something like this:
type Desired<K extends string, V> = {
    [key in K]: V;
};

// Ideally we would like to type something like this:
// type TransformKeyValueWrong<T extends KeyValue<T["key"], T["value"]>> = {
//     [key in T["key"]]: T["value"];
// };

// But typescript compiler would yell at us "[ts] Type parameter 'key' has a circular constraint.",
// which is true, but won't stop us, since we have generic parameter defaults!
type TransformKeyValue<T extends KeyValue<K, T["value"]>, K extends string = T["key"]> = {
    [key in K]: T["value"];
};

// All we have to do now is declare intersection type for Foo, Bar, Baz:
type SuperDuperType =
    & TransformKeyValue<Foo>
    & TransformKeyValue<Bar>
    & TransformKeyValue<Baz>
    ;

// Verify it works:
type Test = SuperDuperType["barKeyType"]; // type Test = "barValueType";

// Note that generic parameter defaults require TypeScript version >=2.3