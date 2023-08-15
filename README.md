# protobuf-aws-pub-sub
A script which acts as a device connected to the AWS IoT Core MQTT Broker. Code has been adapted from the AWS Device SDK JS V2 (https://github.com/aws/aws-iot-device-sdk-js-v2), and modified under the Apache 2.0 license.

### Args
_* = required_
```
ca_file: [string] Path to the CA files used for this connection, if necessary.
*cert: [string] Path to the certificate public key used for this connection.
count: [number] Publish this many messages. After receiving this many messages, close the program.
*endpoint: [string] Connect to this AWS IoT Core MQTT Broker URL.
*key: [string] Path to the private key file used to encrypt messages during this connection.
message_type: [string] The type of messsage to send. Options below.
  json: (default) Send a predefined JSON message, or the "message" arg (if provided).
  proto: Send a predefined ProtoBuf message.  
message: [string] Publish this message.
topic: [string] Subscribe to this MQTT topic.
```

### Quick Start
1. If not existing, create a "certs" folder in the project root.
2. Register a Thing in AWS IoT Core. Download the cert and private key. Name the cert "certificate.pem" and the private key "private.key".
3. Execute one of the following commands:
  a. npm run start
  b. npm run start-proto