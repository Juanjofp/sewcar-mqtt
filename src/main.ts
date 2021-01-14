import readLine from 'readline';
import { createSewParser } from '@sensoreverywhere/sew-parser';
import { createSewMQTT, SewMQTT } from './sew-mqtt';
import {
    forwardCommand,
    backwardCommand,
    stopCommand,
    leftCommand,
    rightCommand,
    redAlarm,
    blueAlarm
} from './sewmqtt-commands';

const FORWARD_KEY = 'w';
const BACKWARD_KEY = 's';
const TURNRIGHT_KEY = 'd';
const TURNLEFT_KEY = 'a';
const STOP_KEY = 'p';

const RED_ON_KEY = '1';
const RED_OFF_KEY = '2';
const BLUE_ON_KEY = '3';
const BLUE_OFF_KEY = '4';

const sewCarId = '7C:9E:BD:06:0D:64';
const sewAlarmId = 'F4:CF:A2:E3:C6:93';

function handleKeywordActions(sewMQTT: SewMQTT) {
    function sendCommand(deviceId: string, cmd: Buffer) {
        console.log('Command', cmd);
        sewMQTT.publish(deviceId, cmd);
    }

    function processKey(key: string) {
        switch (key) {
            case FORWARD_KEY:
                sendCommand(sewCarId, forwardCommand(sewCarId));
                break;
            case BACKWARD_KEY:
                sendCommand(sewCarId, backwardCommand(sewCarId));
                break;
            case TURNLEFT_KEY:
                sendCommand(sewCarId, leftCommand(sewCarId));
                break;
            case TURNRIGHT_KEY:
                sendCommand(sewCarId, rightCommand(sewCarId));
                break;
            case STOP_KEY:
                sendCommand(sewCarId, stopCommand(sewCarId));
                break;
            case RED_ON_KEY:
                sendCommand(sewAlarmId, redAlarm(sewAlarmId, 1));
                break;
            case RED_OFF_KEY:
                sendCommand(sewAlarmId, redAlarm(sewAlarmId, 0));
                break;
            case BLUE_ON_KEY:
                sendCommand(sewAlarmId, blueAlarm(sewAlarmId, 1));
                break;
            case BLUE_OFF_KEY:
                sendCommand(sewAlarmId, blueAlarm(sewAlarmId, 0));
                break;
            default:
                break;
        }
    }

    if (process.stdin.setRawMode) process.stdin.setRawMode(true);
    readLine.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            sewMQTT.close(() => {
                process.exit(0);
            });
        } else {
            processKey(key.name);
        }
    });
}

export const main = async () => {
    const parser = createSewParser(data => {
        console.log('SewMQTT>', data.sensorId, data.type, data.payload);
    });
    const sewMQTT = await createSewMQTT(parser);
    handleKeywordActions(sewMQTT);
    process.on('SIGINT', () => {
        sewMQTT.close(() => {
            process.exit(0);
        });
    });
};

main();
