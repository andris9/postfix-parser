# PostfixQueueParser

Parses email message from a Postfix queue file.

## Usage

### Free, AGPL-licensed version

First install the module from npm:

```
$ npm install postfix-queue-parser
```

next import the `postfixQueueParser` function into your script:

```js
const { postfixQueueParser } = require('postfix-queue-parser');
```

### MIT version

MIT-licensed version is available for [Postal Systems subscribers](https://postalsys.com/).

First install the module from Postal Systems private registry:

```
$ npm install @postalsys/postfix-queue-parser
```

next import the `postfixQueueParser` function into your script:

```js
const { postfixQueueParser } = require('@postalsys/postfix-queue-parser');
```

If you have already built your application using the free version of postfix-queue-parser and do not want to modify require statements in your code, you can install the MIT-licensed version as an alias for "postfix-queue-parser".

```
$ npm install postfix-queue-parser@npm:@postalsys/postfix-queue-parser
```

This way you can keep using the old module name

```js
const { postfixQueueParser } = require('postfix-queue-parser');
```

### Parsing message

```
async postfixQueueParser(buffer) -> MessageObject
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
const { postfixQueueParser } = require('postfix-queue-parser');

const queueFile = await readFile('A2B13FC0031');
const message = await postfixQueueParser(queueFile);

process.stdout.write(message.content);
```

## License

&copy; 2020 Andris Reinman

Licensed under GNU Affero General Public License v3.0 or later.

MIT-licensed version of postfix-queue-parser is available for [Postal Systems subscribers](https://postalsys.com/).
