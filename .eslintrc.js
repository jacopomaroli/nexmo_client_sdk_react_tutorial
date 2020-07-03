module.exports = {
    "extends": ['standard', 'standard-react'],
    "settings": {
        "react": {
            "version": "16.13.1"
        },
        "rules": {
            // "react/jsx-closing-bracket-location": "off",
            "indent": ["error", 4, {"ignoredNodes": ["JSXElement", "JSXElement *"]}]
        }
    }
}
