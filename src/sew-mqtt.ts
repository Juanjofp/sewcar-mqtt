import mqtt from 'mqtt';
export type SewMQTTParser = (frame: Buffer) => void;
export type SewMQTT = {
    close: (cb: () => void) => void;
    publish: (deviceId: string, buffer: Buffer) => void;
};
export async function createSewMQTT(parser: SewMQTTParser): Promise<SewMQTT> {
    const subscribeTopic = 'tribeca/+/status';
    const client = mqtt.connect('mqtt://192.168.2.14:1883', {
        clientId: 'sew-mqtt-1'
    });

    client.on('connect', () => {
        console.log('MQTT Connected');
        client.subscribe(subscribeTopic);
    });

    client.on('message', (topic, message) => {
        parser(message);
    });

    return {
        close: (cb: () => void) => {
            client.end(true, cb);
        },
        publish: (deviceId: string, command: Buffer) =>
            client.publish(`tribeca/${deviceId}/action`, command)
    };
}
