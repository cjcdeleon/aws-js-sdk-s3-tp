
import { describe, it, expect} from "vitest";

import {GetObjectCommand, S3Client, S3ServiceException} from '@aws-sdk/client-s3';
import {sdkStreamMixin} from '@smithy/util-stream';
import {mockClient} from 'aws-sdk-client-mock';
import {Readable} from 'stream';
import {createReadStream} from 'fs';
import {getObject} from "./get-object.js";

const s3Mock = mockClient(S3Client);

async function testWithOwnS3Client() {
  const s3 = new S3Client({});
  const getObjectResult = await s3.send(new GetObjectCommand({Bucket: '', Key: ''}));
  const str = await getObjectResult.Body?.transformToString();
  expect(str).toBe('hello world');

}

describe('s3', () => {
  it('retryS3', async () => {
    // create Stream from string
    const stream = new Readable();
    stream.push('hello world');
    stream.push(null); // end of stream
    // wrap the Stream with SDK mixin
    const sdkStream = sdkStreamMixin(stream);
    // s3Mock.on(GetObjectCommand).resolves({Body: sdkStream});
    s3Mock.on(GetObjectCommand).rejects(new S3ServiceException({message: 'some error', $retryable: {throttling: true} }));
    // s3Mock.on(GetObjectCommand).rejects(new S3ServiceException('some error'));
    // const s3GetObjectStub = s3Mock.commandCalls(GetObjectCommand)

    console.log('before')


    //await testWithOwnS3Client()
    await getObject('tp-sandbox-ap2','tp-sandbox-s3.txt')
    //console.log(s3GetObjectStub)
    //expect(s3GetObjectStub[0].args[0].input).toEqual({Bucket: 'foo', Key: 'path/to/file.csv'});

    console.log('after')
  })
});