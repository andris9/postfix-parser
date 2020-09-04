/* eslint no-constant-condition: 0, no-bitwise: 0 */
'use strict';

class PostfixQueueParser {
    constructor(buf) {
        this.buf = buf;
        this.pos = 0;
        this.state = 'envelope';
    }

    readUInt8() {
        if (this.pos >= this.buf.length) {
            throw new Error('Invalid read position');
        }
        return this.buf.readUInt8(this.pos++);
    }

    readSlice(length) {
        if (this.pos + length > this.buf.length) {
            throw new Error('Invalid record length');
        }
        let slice = this.buf.slice(this.pos, this.pos + length);
        this.pos += slice.length;

        return slice;
    }

    getNextRecord() {
        if (this.pos >= this.buf.length) {
            return false;
        }

        let record = {
            type: String.fromCharCode(this.readUInt8()),
            length: 0,
            value: null
        };

        let shift = 0;
        while (true) {
            if (shift > 8 * 4) {
                throw new Error('Invalid length byte size');
            }

            let lenByte = this.readUInt8();

            record.length |= (lenByte & 0x7f) << shift;

            if ((lenByte & 0x80) === 0) {
                break;
            }

            shift += 7;
        }

        if (record.length < 0) {
            throw new Error('Invalid record length');
        }

        record.value = this.readSlice(record.length);

        return record;
    }

    async parse() {
        let firstRecord = this.getNextRecord();
        if (firstRecord.type !== 'C') {
            throw new Error('Invalid record type');
        }

        let message = {
            envelope: {
                attributes: {}
            },
            content: null
        };

        let content = [];
        let contentLength = 0;

        let record;
        while ((record = this.getNextRecord())) {
            switch (record.type) {
                case 'M':
                    this.state = 'content';
                    break;

                case 'X':
                    this.state = 'extract';
                    break;

                case 'E':
                    // finish parsing
                    message.content = Buffer.concat(content, contentLength);
                    return message;

                case 'T':
                    message.envelope.arrivalTime = new Date(Number(record.value.toString().split(' ').shift()) * 1000);
                    break;

                case 'S':
                    message.envelope.sender = record.value.toString();
                    break;

                case 'O':
                    message.envelope.originalRecipient = record.value.toString();
                    break;

                case 'R':
                    message.envelope.recipient = record.value.toString();
                    break;

                case 'A':
                    {
                        let parts = record.value.toString().split('=');
                        let key = parts.shift();
                        let val = parts.join('=');
                        if (key === 'create_time') {
                            val = new Date(Number(val) * 1000);
                        }
                        message.envelope.attributes[key.replace(/_(.)/g, (o, c) => c.toUpperCase())] = val;
                    }
                    break;

                case 'N':
                    // normal content record, add with a line break
                    if (this.state === 'content') {
                        content.push(record.value);
                        content.push(Buffer.from('\n'));
                        contentLength += record.value.length + 1;
                    }
                    break;
                case 'L':
                    // long content record
                    if (this.state === 'content') {
                        content.push(record.value);
                        contentLength += record.value.length;
                    }
                    break;
            }

            // have some breathing room
            await new Promise(resolve => setImmediate(resolve));
        }

        // should have enced already, just in case return message
        message.content = Buffer.concat(content, contentLength);
        return message;
    }
}

const postfixQueueParser = async buf => {
    let parser = new PostfixQueueParser(buf);
    return await parser.parse();
};

module.exports = { PostfixQueueParser, postfixQueueParser };
