import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
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

        const files = fs.readdirSync(
            path.join(__dirname, 'fixtures', fixtureSet, 'queries')
        );

        describe(fixtureSet, () => {
            files.forEach(filename => {
                it(`encoding query "${filename}"`, () => {
                    const query = fs.readFileSync(
                        path.join(
                            __dirname,
                            'fixtures',
                            fixtureSet,
                            'queries',
                            filename
                        ),
                        'utf8'
                    );

                    const baselineEncoding = baselineEncoder.encode(query);
                    const testEncoding = testEncoder.encode(query);

                    expect({
                        baselineSize: baselineEncoding.length,
                        size: testEncoding.length,
                        difference: getPercentageChange(
                            baselineEncoding.length,
                            testEncoding.length
                        ),
                        compressedDifference: getPercentageChange(
                            zlib.gzipSync(baselineEncoding).length,
                            zlib.gzipSync(testEncoding).length
                        )
                    }).toMatchSnapshot();
                });
            });
        });
    });
});
