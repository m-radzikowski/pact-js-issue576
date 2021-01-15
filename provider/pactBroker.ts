/* eslint-disable no-console */
import childProcess from 'child_process';

const main = async (): Promise<void> => {
    const brokerEndpoint = process.env.PACT_BROKER_ENDPOINT || '';
    const brokerKey = process.env.PACT_BROKER_KEY || '';
    const stage = 'stage-name'; // stage name is also a feature-branch name
    const versionNumber = '1.0.0';
    const commit = exec('git rev-parse HEAD');

    try {
        const result = exec('yarn run pact-broker can-i-deploy' +
            ` -a "Test Provider"` +
            ' -b ' + brokerEndpoint +
            ' -k ' + brokerKey +
            ` --version "${versionNumber}-${commit}"` +
            ' --to ' + stage
        );
        console.log(result);
    } catch (e) {
        console.log((e as Error).message);
        process.exit(1);
    }
};

const exec = (command: string): string => {
    try {
        return childProcess
            .execSync(command)
            .toString()
            .trim();
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        throw new Error(e.stdout.toString().trim());
    }
};

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
