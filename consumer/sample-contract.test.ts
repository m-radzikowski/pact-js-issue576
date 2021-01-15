import {pactWith} from 'jest-pact';
import {like} from '@pact-foundation/pact/dsl/matchers';
import axios from 'axios';
import {Interaction} from '@pact-foundation/pact';

pactWith({consumer: 'Test Consumer', provider: 'Test Provider', pactfileWriteMode: 'merge'}, provider => {

    describe('make request', () => {

        beforeEach(() => provider.addInteraction(new Interaction()
            .uponReceiving('a request')
            .withRequest({
                method: 'GET',
                path: '/'
            })
            .willRespondWith({
                status: 200,
                body: like('OK!'),
            })
        ));

        it('returns 200', async () => {
            const response = await axios.get(provider.mockService.baseUrl);
            expect(response.status).toBe(200);
        });

    });

});
