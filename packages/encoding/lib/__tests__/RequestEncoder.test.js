import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import fastmatter from 'fastmatter';
import { buildSchema } from 'graphql';
import RequestEncoder from '../RequestEncoder';
import * as baselineImpl from '../impl/json';
var FIXTURES = ['minimal'];
function getPercentageChange(oldNumber, newNumber) {
    var decreaseValue = oldNumber - newNumber;
    return ((decreaseValue / oldNumber) * 100).toFixed(2) + '%';
}
describe('encoding', function () {
    FIXTURES.forEach(function (fixtureSet) {
        var schema = buildSchema(fs.readFileSync(path.join(__dirname, 'fixtures', fixtureSet, 'schema.graphql'), 'utf8'));
        var baselineEncoder = new RequestEncoder(schema, baselineImpl);
        var testEncoder = new RequestEncoder(schema);
        var files = fs.readdirSync(path.join(__dirname, 'fixtures', fixtureSet, 'queries'));
        describe(fixtureSet, function () {
            files.forEach(function (filename) {
                it("encoding query \"" + filename + "\"", function () {
                    var queryFile = fs.readFileSync(path.join(__dirname, 'fixtures', fixtureSet, 'queries', filename), 'utf8');
                    var _a = fastmatter(queryFile), query = _a.body, attributes = _a.attributes;
                    var baselineEncoding = baselineEncoder.encode(query, attributes.variables);
                    var testEncoding = testEncoder.encode(query, attributes.variables);
                    expect({
                        baselineSize: baselineEncoding.length,
                        size: testEncoding.length,
                        difference: getPercentageChange(baselineEncoding.length, testEncoding.length),
                        optimizedDifference: getPercentageChange(Math.min(zlib.gzipSync(baselineEncoding).length, baselineEncoding.length), Math.min(zlib.gzipSync(testEncoding).length, testEncoding.length))
                    }).toMatchSnapshot();
                });
            });
        });
    });
});
