import {getObject} from "./get-object.js";
import { describe, it} from "vitest";

describe('s3', () => {
  it.skip('retryS3 without mock', async () => {
    console.log('before')
    await getObject('tp-sandbox-ap2','tp-sandbox-s3.txt')
    console.log('after')
  })
});