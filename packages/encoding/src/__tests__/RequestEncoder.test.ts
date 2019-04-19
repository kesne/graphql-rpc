import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import fastmatter from 'fastmatter';
import { buildSchema } from 'graphql';
import RequestEncoder from '../RequestEncoder';
import * as baselineImpl from '../impl/json';

const FIXTURES = ['minimal'];

function getPercentageChange(oldNumber: number, newNumber: number) {
    var decreaseValue = oldNumber - newNumber;

    return ((decreaseValue / oldNumber) * 100).toFixed(2) + '%';
}

describe('encoding', () => {
    FIXTURES.forEach(fixtureSet => {
        const schema = buildSchema(
            fs.readFileSync(path.join(__dirname, 'fixtures', fixtureSet, 'schema.graphql'), 'utf8')
        );

        const baselineEncoder = new RequestEncoder(schema, baselineImpl);
        const testEncoder = new RequestEncoder(schema);

        const files = fs.readdirSync(path.join(__dirname, 'fixtures', fixtureSet, 'queries'));

        describe(fixtureSet, () => {
            files.forEach(filename => {
                it(`encoding query "${filename}"`, () => {
                    const queryFile = fs.readFileSync(
                        path.join(__dirname, 'fixtures', fixtureSet, 'queries', filename),
                        'utf8'
                    );

                    const { body: query, attributes } = fastmatter(queryFile);

                    const baselineEncoding = baselineEncoder.encode(query, attributes.variables);
                    const testEncoding = testEncoder.encode(query, attributes.variables);

                    expect({
                        baselineSize: baselineEncoding.length,
                        size: testEncoding.length,
                        difference: getPercentageChange(
                            baselineEncoding.length,
                            testEncoding.length
                        ),
                        optimizedDifference: getPercentageChange(
                            Math.min(
                                zlib.gzipSync(baselineEncoding).length,
                                baselineEncoding.length
                            ),
                            Math.min(zlib.gzipSync(testEncoding).length, testEncoding.length)
                        )
                    }).toMatchSnapshot();
                });
            });
        });
    });
});
