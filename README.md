# invoice-modern
"test": "jest --config jestconfig.json",
    "prepublishOnly": "npm test && npm run lint",
    "preversion": "npm run lint",
    "version": "git add -A src",
    "postversion": "git push && git push --tags",
    "lint": "tslint -p tsconfig.json"# invoice-modern
