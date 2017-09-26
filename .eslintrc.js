module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "impliedStrict": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "ignoredNodes": ["JSXAttribute", "JSXSpreadAttribute"]
            }
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "no-console": ["error", {
            "allow": ["time", "timeEnd"]
        }],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "react/prop-types": ["off"], // Next time!
        "react/jsx-indent-props": [0]
    }
};