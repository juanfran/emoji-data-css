var fs = require('fs');
var CleanCSS = require('clean-css');

var emojiNames = {
    apple: 'ap',
    google: 'gl',
    twitter: 'tw',
    emojione: 'eo'
};

function getSheetByName(name, size) {
    return `sheet_${name}_${size}.png`;
}

function getBasic(shortName, sheetUrl, size) {
    return `
.${shortName} {
    display: inline-block;
    height: ${size}px;
    width: ${size}px;
    background-image: url(${sheetUrl});
    background-repeat: no-repeat;
}
    `;
}

function getEmojiCss(shortName, emoji, size, combinedClass = '') {
    return `
.${shortName}-${emoji.short_name}${combinedClass} {
  background-position: -${emoji.sheet_x * size}px -${emoji.sheet_y * size}px;
}
    `;
}

function writeCss(name, size) {
    var shortName = emojiNames[name];
    var sheetUrl = getSheetByName(name, size);
    var css = getBasic(shortName, sheetUrl, size);

    emojis.forEach(function(emoji) {
        if (emoji['has_img_' + name]) {
            css += getEmojiCss(shortName, emoji, size);
        }
    });

    var minified = new CleanCSS().minify(css).styles;

    fs.writeFileSync(__dirname + `/files/${shortName}-${size}-emoji.css`, css, {
        flag: 'w+'
    });

    fs.writeFileSync(__dirname + `/files/${shortName}-${size}-emoji.min.css`, minified, {
        flag: 'w+'
    });
}

function copySheets(name) {
    [16, 20, 32, 64].forEach(function(size) {
        var sheetName = `sheet_${name}_${size}`;

        fs.createReadStream(emojiPath + `${sheetName}.png`).pipe(fs.createWriteStream(`${__dirname}/files/${sheetName}.png`));
        fs.createReadStream(emojiPath + `${sheetName}.png`).pipe(fs.createWriteStream(`${__dirname}/files/${sheetName}.png`));
        fs.createReadStream(emojiPath + `${sheetName}.png`).pipe(fs.createWriteStream(`${__dirname}/files/${sheetName}.png`));
        fs.createReadStream(emojiPath + `${sheetName}.png`).pipe(fs.createWriteStream(`${__dirname}/files/${sheetName}.png`));
    });
}

function writeAllSizesCss(name) {
    var shortName = emojiNames[name];

    var css = '';
    [16, 20, 32, 64].forEach(function(size) {
        css += getBasic(`${shortName}-${size}`, getSheetByName(name, size), size);
    });

    emojis.forEach(function(emoji) {
        if (emoji['has_img_' + name]) {
            [16, 20, 32, 64].forEach(function(size) {
                css += getEmojiCss(shortName, emoji, size, `.${shortName}-${size}`);
            });
        }
    });

    var minified = new CleanCSS().minify(css).styles;

    fs.writeFileSync(__dirname + `/files/${shortName}-all-emoji.css`, css, {
        flag: 'w+'
    });

    fs.writeFileSync(__dirname + `/files/${shortName}-all-emoji.min.css`, minified, {
        flag: 'w+'
    });
}

var emojiPath = __dirname + '/node_modules/emoji-datasource/';
var emojis = require(emojiPath + "emoji.json");

copySheets('apple');
copySheets('google');
copySheets('twitter');
copySheets('emojione');

[16, 20, 32, 64].forEach(function(size) {
    writeCss('apple', size);
    writeCss('google', size);
    writeCss('twitter', size);
    writeCss('emojione', size);
});

/* all sizes in one file */
writeAllSizesCss('apple');
writeAllSizesCss('google');
writeAllSizesCss('twitter');
writeAllSizesCss('emojione');
