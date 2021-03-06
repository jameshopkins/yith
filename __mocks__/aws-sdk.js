const objects = {
  'private-foo/index.json': new Buffer('{"name":"private-foo","dist-tags":{"latest":"1.0.0"}}'),
};

export default {
  S3: class S3 {
    getObject({ Key }) { // eslint-disable-line class-methods-use-this
      if (objects[Key]) {
        return { promise: () => Promise.resolve({ Body: objects[Key] }) };
      }
      const err = new Error('Could not find key');
      err.code = Key === 'uknown-error/index.json' ? '' : 'NoSuchKey';
      return { promise: () => Promise.reject(err) };
    }

    putObject({ Key, Body }) { // eslint-disable-line class-methods-use-this
      if (objects[Key]) {
        return { promise: () => Promise.resolve({ Body }) };
      }
      const err = new Error('Could put object');
      err.code = Key === 'uknown-error/index.json' ? '' : 'NoSuchKey';
      return { promise: () => Promise.reject(err) };
    }
  },
};
