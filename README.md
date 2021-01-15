# Pact Provider's first deployment

This single repo contains example Pact Provider and Consumer
to ilustrate CI/CD workflow problems. Normally, they would be
a separate microservices in separate repositories.

Install dependencies:

```bash
yarn install
```

Set environment variables:

```bash
export PACT_BROKER_ENDPOINT ...
export PACT_BROKER_KEY ...
```

## Problem 1 - verification fails

## Problem 1.1

**Scenario:** we create and deploy a new Provider.
There are no deployed consumers yet -
we deploy API before its clients, which seems reasonable.

The CI process runs:

```bash
yarn run provider:pact:verify
```

which fails because the Provider is not defined in the Broker
(see further for details).

Logs:

```
yarn run v1.22.5
$ cd provider && ts-node pactVerifier.ts

[2021-01-15T13:46:15.640Z]  INFO: pact@9.14.0/5449 on Maciejs-MacBook-Pro.local: Verifying provider
[2021-01-15T13:46:15.647Z]  INFO: pact@9.14.0/5449 on Maciejs-MacBook-Pro.local: debug request/response logging enabled
[2021-01-15T13:46:15.649Z]  INFO: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: Verifying Pacts.
[2021-01-15T13:46:15.650Z]  INFO: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: Verifying Pact Files
[2021-01-15T13:46:15.651Z] DEBUG: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: Starting pact binary 'standalone/darwin-1.88.3/pact/bin/pact-provider-verifier', with arguments [--provider-states-setup-url http://localhost:52375/_pactSetup --provider Test Provider --provider-base-url http://localhost:52375 --provider-app-version 1.0.0-999e0b9185e1a25f0aad0ad9ef0b5010cd09e41a --provider-version-tag local --consumer-version-selector {"tag":"staging","latest":true} --consumer-version-selector {"tag":"test","latest":true} --consumer-version-selector {"tag":"stage-name","latest":true} --pact-broker-base-url <removed> --broker-token <removed> --publish-verification-results true --log-level debug], and environment: {<removed>}
[2021-01-15T13:46:15.659Z] DEBUG: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: Created 'standalone/darwin-1.88.3/pact/bin/pact-provider-verifier' process with PID: 5454
[2021-01-15T13:46:19.418Z] DEBUG: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: 
    /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/hal/entity.rb:102:in `assert_success!': Error retrieving <removed>/pacts/provider/Test%20Provider/for-verification status=404  (Pact::Hal::ErrorResponseReturned)
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/hal/link.rb:65:in `post!'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:68:in `pacts_for_verification_entity'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:54:in `pacts_for_verification'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:39:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:33:in `call'
    
[2021-01-15T13:46:19.419Z] DEBUG: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: 
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker.rb:18:in `fetch_pact_uris_for_verification'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:45:in `pacts_for_verification'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:38:in `pacts_urls_from_broker'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:25:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:10:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/app.rb:199:in `all_pact_urls'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/app.rb:40:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/app.rb:34:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/cli/verify.rb:47:in `verify'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor/command.rb:27:in `run'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor/invocation.rb:126:in `invoke_command'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor.rb:387:in `dispatch'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor/base.rb:466:in `start'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/cli/custom_thor.rb:17:in `start'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/app/pact-provider-verifier.rb:33:in `<main>'
    
[2021-01-15T13:46:19.432Z] DEBUG: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: 
    INFO: Fetching pacts for Test Provider from <removed> with the selection criteria: latest for tag staging, latest for tag test, latest for tag stage-name
    
[2021-01-15T13:46:19.446Z]  WARN: pact-node@10.11.1/5449 on Maciejs-MacBook-Pro.local: Pact exited with code 1.
Error: /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/hal/entity.rb:102:in `assert_success!': Error retrieving <removed>/pacts/provider/Test%20Provider/for-verification status=404  (Pact::Hal::ErrorResponseReturned)
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/hal/link.rb:65:in `post!'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:68:in `pacts_for_verification_entity'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:54:in `pacts_for_verification'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:39:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker/fetch_pact_uris_for_verification.rb:33:in `call'

        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-1.51.1/lib/pact/pact_broker.rb:18:in `fetch_pact_uris_for_verification'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:45:in `pacts_for_verification'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:38:in `pacts_urls_from_broker'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:25:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/aggregate_pact_configs.rb:10:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/app.rb:199:in `all_pact_urls'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/app.rb:40:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/app.rb:34:in `call'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/cli/verify.rb:47:in `verify'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor/command.rb:27:in `run'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor/invocation.rb:126:in `invoke_command'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor.rb:387:in `dispatch'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/thor-0.20.3/lib/thor/base.rb:466:in `start'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/vendor/ruby/2.2.0/gems/pact-provider-verifier-1.32.1/lib/pact/provider_verifier/cli/custom_thor.rb:17:in `start'
        from /pact/node_modules/@pact-foundation/pact-node/standalone/darwin-1.88.3/pact/lib/app/pact-provider-verifier.rb:33:in `<main>'

INFO: Fetching pacts for Test Provider from <removed> with the selection criteria: latest for tag staging, latest for tag test, latest for tag stage-name

    at ChildProcess.<anonymous> (/pact/node_modules/@pact-foundation/pact-node/src/verifier.ts:268:55)
    at Object.onceWrapper (events.js:422:26)
    at ChildProcess.emit (events.js:327:22)
    at ChildProcess.EventEmitter.emit (domain.js:482:12)
    at maybeClose (internal/child_process.js:1021:16)
    at Socket.<anonymous> (internal/child_process.js:443:11)
    at Socket.emit (events.js:315:20)
    at Socket.EventEmitter.emit (domain.js:482:12)
    at Pipe.<anonymous> (net.js:674:12)
error Command failed with exit code 1.
```

### Workaround

Create Consumer contract and push it to the broker first
to create Consumer and Provider entities in the Broker:

```bash
yarn run consumer:pact:test
yarn run consumer:pact:publish
```

In CI/CD flow this means we need to push the Consumer first.
Contract will be published, but the build will fail on next steps,
when we will check `can-i-deploy` before the Provider exists.

Contract is now visible in the Broker UI as Unverified
and we can publish the Provider.

```bash
yarn run provider:pact:verify
```

This time it ends successfuly with:

```
[2021-01-15T13:59:12.562Z]  INFO: pact-node@10.11.1/5707 on Maciejs-MacBook-Pro.local: Pact Verification succeeded.
```

## Problem 1.2

**Scenario:** having Consumer pact published to the Broker
(according to the workaround for 1.1 above)
when in Broker UI I "Delete all pacts" and run Provider verify:

```bash
yarn run provider:pact:verify
```

it passes successfuly (even though not having any pacts).

But when I do "Delete integration", effectively going back to the initial clean state,
I'm back to the behaviour described in 1.1.

It seems that the verification fails if there is no Provider entity
in the Broker, and in fact it does not matter if there are any contracts for it.

## Problem 2 - can-i-deploy fails

**Scenario:** check `can-i-deploy` before deploying the Provider.
After workaround from 1.1 and successful Provider verification, run:

```bash
yarn run provider:pact:can-i-deploy
```

It fails as no verifications were done yet for this pact:

```
Computer says no ¯\_(ツ)_/¯ 

No pacts or verifications have been published for version 1.0.0-999e0b9185e1a25f0aad0ad9ef0b5010cd09e41a of Test Provider
```

## Expected behaviour

The CI/CD pipeline should be always the same.

The Provider should be deployed firts, with steps:

1. Pact Verify
1. Pact Broker can-i-deploy
1. Deploy
1. Pact Broker tag version with the stage name

This should suceed as there are no contracts for it yet.

Then the Consumer should be deployed:

1. Run unit tests (which generates pacts)
1. Pact Publish
1. Pact Broker can-i-deploy
1. Pact Broker tag version with the stage name
