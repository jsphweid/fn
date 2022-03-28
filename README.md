# Fn

### Install

```bash
pip install -r requirements
pip install -r dev-requirements
```

TODO: write a real README.md

tsconfig.json

```
"@fn/*": ["packages/*/src"]
```

original lerna.json... see how `packages` is in two places? I'm not immediately sure which it refers to (probably inner). If I go down more of the JS route, I'll have to investigate this more

```
{
  "packages": [
    "packages/*",
    "examples/*"
  ],
  "version": "independent"
}
```
