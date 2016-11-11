module.exports = function whereami() {
  return new Promise((fulfill, reject) => {
    const whereami = spawn(__dirname + '/whereami/whereami', ['--export-stdout']);
    const where = {};
    var output = null;

    // concatenate all data from stdout
    whereami.stdout.on('data', (data) => {
      output = output ? output + data : data;
    });

    // on close, parse data from stdout
    whereami.on('close', (code) => {
      // if return code is not successfull
      if (code !== 0) {
        reject(`Return code = ${code}`);
      }

      // split output into lines
      var lines = output.toString('utf8').split("\n").map(function (val) {
        return val;
      });

      // for each line, split key and value separated by '='
      for (var i = 0; i !== lines.length; ++i) {
        const line = lines[i];
        const keyValue = line.split("=").map(function (val) {
          return val;
        });

        // consider parsed key/value invalid
        if (keyValue.length === 2) {
          where[keyValue[0]] = keyValue[1];
        }
      }
      // return parsed keys/values
      fulfill(where);
    });
  });
};
