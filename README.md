# PostfixParser

Parses email message from a Postfix queue file.

## Usage

### Free, AGPL-licensed version

First install the module from npm:

```
$ npm install postfix-parser
```

next import the `postfixParser` generator function into your script:

```js
const { postfixParser } = require('postfix-parser');
```

### MIT version

MIT-licensed version is available for [Postal Systems subscribers](https://postalsys.com/).

First install the module from Postal Systems private registry:

```
$ npm install @postalsys/postfix-parser
```

next import the `postfixParser` generator function into your script:

```js
const { postfixParser } = require('@postalsys/postfix-parser');
```

If you have already built your application using the free version of postfix-parser and do not want to modify require statements in your code, you can install the MIT-licensed version as an alias for "postfix-parser".

```
$ npm install postfix-parser@npm:@postalsys/postfix-parser
```

This way you can keep using the old module name

```js
const { postfixParser } = require('postfix-parser');
```

### Parsing message

```
async postfixParser(buffer) -> MessageObject
```

Where

-   **buffer** is a Buffer representing the queue file

**MessageObject** {Object} includes the following properties:

-   **content** Email message as a Buffer
-   **envelope** Message ebvelope object
-   **arrivalTime** {Date} queue time
-   **sender** {String} MAIL FROM address
-   **originalRecipient** {String} RCPT TO address
-   **recipient** {String} Usually RCPT TO address but might have been overwritten by Postfix to something else
-   **attributes** {Object} message attributes

**Example**

Example reads queue file contents from disk and writes email message to console.

```js
const { readFile } = require('fs').promises;
const { postfixParser } = require('postfix-parser');

const queueFile = await readFile('A2B13FC0031');
const message = await postfixParser(queueFile);

process.stdout.write(message.content);
```

## License

&copy; 2020 Andris Reinman

Licensed under GNU Affero General Public License v3.0 or later.

MIT-licensed version of postfix-parser is available for [Postal Systems subscribers](https://postalsys.com/).
