/* eslint-disable no-console */
import {Verifier, VerifierOptions} from '@pact-foundation/pact';
import childProcess from 'child_process';
import http from 'http';

const main = async (): Promise<void> => {
    const brokerEndpoint = process.env.PACT_BROKER_ENDPOINT;
    const brokerKey = process.env.PACT_BROKER_KEY;
    const stage = 'stage-name'; // stage name is also a feature-branch name
    const versionNumber = '1.0.0';
    const commit = exec('git rev-parse HEAD');
    const env = process.env.CI ? 'CI' : 'local';

    const verifierOptions: VerifierOptions = {
        provider: 'Test Provider',
        providerBaseUrl: 'http://localhost:8000',
        providerVersion: versionNumber + '-' + commit,
        providerVersionTags: [env],
        consumerVersionSelectors: [
            {tag: 'staging', latest: true},
            {tag: 'test', latest: true},
            {tag: stage, latest: true},
        ],
        pactBrokerUrl: brokerEndpoint,
        pactBrokerToken: brokerKey,
        enablePending: false,
        publishVerificationResult: true,
    };

    const mockServer = startMockServer();
    await new Verifier(verifierOptions).verifyProvider();
    mockServer.close();
};

const exec = (command: string): string =>
    childProcess
        .execSync(command)
        .toString()
        .trim();

const startMockServer = (): http.Server => {
    return http.createServer((req, res) => {
        res.writeHead(200);
        res.write('OK!');
        res.end();
    }).listen(8000);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
