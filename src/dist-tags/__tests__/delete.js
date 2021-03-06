jest.mock('node-fetch');
jest.mock('aws-sdk');

const handler = require('../delete');

describe('DELETE registry/-/package/{name}/dist-tags/{tag}', () => {
  let callback;
  let subject;

  beforeEach(() => {
    callback = jest.fn();
    subject = handler.default;
    process.env = {
      registry: 'https://example.com/',
      bucket: 'foo',
      region: 'bar',
    };
  });

  describe('package is in private registry', () => {
    let event;

    beforeEach(() => {
      event = {
        pathParameters: {
          name: 'private-foo',
          tag: 'latest',
        },
      };
    });

    it('should remove dist-tag and return updated package json', async () => {
      await subject(event, jest.fn(), callback);

      expect(callback)
      .toHaveBeenCalledWith(null, {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          id: 'private-foo',
          'dist-tags': {},
        }),
      });
    });
  });

  describe('private registry storage throws uknown error', () => {
    let event;

    beforeEach(() => {
      event = {
        pathParameters: {
          name: 'uknown-error',
        },
      };
    });

    it('should return correct error response', async () => {
      await subject(event, jest.fn(), callback);

      expect(callback)
      .toHaveBeenCalledWith(null, {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: 'Could not find key',
        }),
      });
    });
  });
});
