module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "standard",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": [2, "always"],
        "indent": ["error", 4],
        "max-len": ["warn", { "code": 120 }]
    }
};