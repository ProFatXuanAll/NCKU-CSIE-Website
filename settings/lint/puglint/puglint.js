const indentation = 2;

module.exports = {
<<<<<<< HEAD

    // no attribute concatenation
=======
>>>>>>> b4b4ea7ba87c57ede4347792b0db82a907b94792
    disallowAttributeConcatenation: true,

    // no block expansion
    disallowBlockExpansion: true,

    // id literals must before class literals
    disallowClassLiteralsBeforeIdLiterals: true,
<<<<<<< HEAD

    // no duplicate attributes
=======
>>>>>>> b4b4ea7ba87c57ede4347792b0db82a907b94792
    disallowDuplicateAttributes: true,

    // no html texts
    disallowHtmlText: true,

    // no global id literal
    disallowIdLiterals: true,

    // no old mixin usage
    disallowLegacyMixinCall: true,

    // no multiple empty lines
    disallowMultipleLineBreaks: true,

    // pug must not use these specified tags
    disallowSpecificTags: [ 'div', 'font', 'embed', 'strike', 's',
        'u', 'applet', 'basefont', 'center', 'dir',
        'isindex', 'listing', 'menu', 'plaintext', 'xmp',
        'b', 'i', ],

    // no string concatenation
    disallowStringConcatenation: true,

    // no multiple space at the end of line
    disallowTrailingSpaces: true,

    // define maximum line length
    maximumLineLength: 160,

    // class literals must before attributes
    requireClassLiteralsBeforeAttributes: true,

    // id literals must before attributes
    requireIdLiteralsBeforeAttributes: true,

    // need new line at the file end
    requireLineFeedAtFileEnd: true,

    // attribute must use lowercase
    requireLowerCaseAttributes: true,

    // tag must use lowercase
    requireLowerCaseTags: true,

    // need space after operator
    requireSpaceAfterCodeOperator: true,

    // need to use !== and === as equal and nonequal
    requireStrictEqualityOperators: true,

    // use specified quote as attribute quotemark
    validateAttributeQuoteMarks: '\'',

    // use specified operator as attribute operator
    validateAttributeSeparator: {
        'separator': ', ',
        'multiLineSeparator': ',\n  ',
    },

    // pug template muse use proper file extensions
    validateExtensions: true,

    // use 2 space as indentation
    validateIndentation: indentation,

    // use LF as line breaks
    validateLineBreaks: 'LF',

    // must not contain any unnecessary self colsing tags
    validateSelfClosingTags: true,
<<<<<<< HEAD

    // must use ES6 string concatenation
=======
>>>>>>> b4b4ea7ba87c57ede4347792b0db82a907b94792
    validateTemplateString: [ 'concatenation', ],
};
