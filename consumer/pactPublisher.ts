/* eslint-disable no-console */
import publisher, {PublisherOptions} from '@pact-foundation/pact-node';
import {resolve} from 'path';
import childProcess from 'child_process';

const main = async (): Promise<void> => {
    const brokerEndpoint = process.env.PACT_BROKER_ENDPOINT || '';
    const brokerKey = process.env.PACT_BROKER_KEY || '';
    const versionNumber = '1.0.0';
    const commit = exec('git rev-parse HEAD');
    const env = process.env.CI ? 'CI' : 'local';

    const publisherOptions: PublisherOptions = {
        pactFilesOrDirs: [resolve(process.cwd(), 'pact', 'pacts')],
        pactBroker: brokerEndpoint,
        pactBrokerToken: brokerKey,
        consumerVersion: versionNumber + '-' + commit,
        tags: [env],
    };

    await performPublish(publisherOptions);
};

const exec = (command: string): string =>
    childProcess
        .execSync(command)
        .toString()
        .trim();

const performPublish = async (options: PublisherOptions): Promise<void> => {
    try {
        await publisher.publishPacts(options);
        console.log('Successfully published pacts')
    } catch (e) {
        console.log('Failed to publish pacts');
        throw e;
    }
};

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
