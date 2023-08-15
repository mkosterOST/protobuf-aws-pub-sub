/**
 * A script which acts as a device connected to the AWS IoT Core MQTT Broker. Code has been adapted from the AWS Device SDK JS V2 (https://github.com/aws/aws-iot-device-sdk-js-v2),
 * and modified under the Apache 2.0 license.
 * 
 * Args (* = required):
 *   ca_file: [string] Path to the CA files used for this connection, if necessary.
 *   *cert: [string] Path to the certificate public key used for this connection.
 *   count: [number] Publish this many messages. After receiving this many messages, close the program.
 *   *endpoint: [string] Connect to this AWS IoT Core MQTT Broker URL.
 *   *key: [string] Path to the private key file used to encrypt messages during this connection.
 *   message_type: [string] The type of messsage to send. Options below.
 *      json: (default) Send a predefined JSON message, or the "message" arg (if provided).
 *      proto: Send a predefined ProtoBuf message.  
 *   message: [string] Publish this message.
 *   topic: [string] Subscribe to this MQTT topic.
 * 
 * To run:
 *  1. If not existing, create a "certs" folder in the project root.
 *  2. Register a Thing in AWS IoT Core. Download the cert and private key. Name the cert "certificate.pem" and the private key "private.key".
 *  3. Execute one of the following commands:
 *      a. npm run start
 *      b. npm run start-proto
 */

// Constants
const DEFAULT_PROTO_MESSAGE = {
    id: '12',
    name: 'Gon Jriesen',
    ageInYears: 30,
    netWorth: 3141592653,
    isBrave: true,
    favorite: 'GREEN'
};
const MESSAGE_TYPES = {
    JSON: 'json',
    PROTO: 'proto'
};

// Libraries
const person = require( './proto/person' );
const iotsdk = require( 'aws-iot-device-sdk-v2' );
const { exit } = require( 'process' );
const mqtt = iotsdk.mqtt;
const TextDecoder = require( 'util' ).TextDecoder;
const yargs = require( 'yargs' );
const common_args = require( './util/cli_args' );

// Parse and validate CLI args.
const argv = yargs.command( '*', false, ( yargs ) => {
    common_args.add_direct_connection_establishment_arguments( yargs );
    common_args.add_topic_message_arguments( yargs );
    yargs.option( 'message_type', {
        alias: 'mt',
        description: 'The type of message to send to the broker. Must be one of "cli", "json", or "proto".',
        type: 'string',
        default: MESSAGE_TYPES.JSON,
        choices: [ MESSAGE_TYPES.JSON, MESSAGE_TYPES.PROTO ]
    } );
} ).parse();

/**
 * Create and encode a message to send to an AWS MQTT Broker.
 * @param {String} messageType The type of messsage. One of [json, proto].
 * @param {*} payload 
 */
function _encodeMessage( messageType, message, sequence ) {
    switch ( messageType ) {
        case MESSAGE_TYPES.PROTO:
            return person
                .Person
                .encode(
                    person
                        .Person
                        .fromJSON( DEFAULT_PROTO_MESSAGE )
                )
                .finish();
        case MESSAGE_TYPES.JSON:
        default:
            return JSON.stringify( {
                msg: message,
                sequence,
            } );
    }
}

/**
 * Decode a payload sent from an AWS MQTT Broker.
 * @param {String} messageType The type of messsage. One of [json, proto].
 * @param {String | ArrayBuffer} payload Message payload from AWS.
 * @returns {String} Decoded message payload as stringified JSON.
 */
function _decodePayload( messageType, payload ) {
    switch ( messageType ) {
        case MESSAGE_TYPES.PROTO:
            return JSON.stringify(
                person
                    .Person
                    .decode( new Uint8Array( payload ) )
            );
        case MESSAGE_TYPES.JSON:
        default:
            const decoder = new TextDecoder( 'utf8' );
            return decoder.decode( payload );
    }
}

/**
 * Execute the pre-defined session: using an established AWS connection, subscribe to a topic,
 * and then publish to it.
 * @param {Object} connection An existing connection to an AWS MQTT Broker.
 * @param {Object} argv CLI inputs (yargs) 
 * @returns {Promise} Fulfilled when publishes and subscriptions have completed.
 */
async function execute_session( connection, argv ) {
    return new Promise( async ( resolve, reject ) => {
        try {
            let published = false;
            let subscribed = false;

            let receivedCount = 0;
            const on_publish = async ( topic, payload, dup, qos, retain ) => {
                receivedCount++;
                console.log( `Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}` );

                const decodedPayload = _decodePayload( argv.message_type, payload );
                console.log( `Payload: ${decodedPayload}` );
                try {
                    if ( receivedCount >= argv.count ) {
                        subscribed = true;
                        if ( subscribed && published ) {
                            resolve();
                        }
                    }
                }
                catch ( error ) {
                    console.log( `Warning: Could not properly decode message (${argv.message_type})...` );
                }
            };

            await connection.subscribe( argv.topic, mqtt.QoS.AtLeastOnce, on_publish );
            let published_counts = 0;
            for ( let op_idx = 0; op_idx < argv.count; ++op_idx ) {
                const publish = async () => {
                    const msg = _encodeMessage( argv.message_type, argv.message, op_idx + 1 );
                    connection.publish( argv.topic, msg, mqtt.QoS.AtLeastOnce ).then( () => {
                        ++published_counts;
                        if ( published_counts >= argv.count ) {
                            published = true;
                            if ( subscribed && published ) {
                                resolve();
                            }
                        }
                    } );
                };
                setTimeout( publish, op_idx * 1000 );
            }
        }
        catch ( error ) {
            reject( error );
        }
    } );
}

/**
 * Execute the program.
 * @param {Object} argv CLI inputs (yargs) 
 */
async function main( argv ) {
    common_args.apply_sample_arguments( argv );

    const connection = common_args.build_connection_from_cli_args( argv );

    // force node to wait 90 seconds before killing itself, promises do not keep node alive
    const timer = setInterval( () => { }, 90 * 1000 );

    await connection.connect().catch( ( error ) => { console.log( "Connect error: " + error ); exit( -1 ); } );
    await execute_session( connection, argv ).catch( ( error ) => { console.log( "Session error: " + error ); exit( -1 ); } );
    await connection.disconnect().catch( ( error ) => { console.log( "Disconnect error: " + error ), exit( -1 ); } );

    // Allow node to die if the promise above resolved
    clearTimeout( timer );
}

main( argv );