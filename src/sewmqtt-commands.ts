import { createSewFrames, DCMotor, Switch } from '@sensoreverywhere/sew-parser';

export const createDCMotorCommand = (
    motorId: string,
    enabled: boolean = false,
    reverse: boolean = false,
    power: number = 0
): DCMotor => ({
    sensorId: motorId,
    type: 'DCMOTOR',
    payload: { enabled, reverse, power }
});

export const createSwitchCommand = (
    sensorId: string,
    state: 0 | 1
): Switch => ({
    sensorId,
    type: 'SWITCH',
    payload: state
});

export const stopCommand = (deviceId: string) =>
    createSewFrames([
        createDCMotorCommand(deviceId + ':00:01'),
        createDCMotorCommand(deviceId + ':00:02')
    ]);
export const forwardCommand = (deviceId: string) =>
    createSewFrames([
        createDCMotorCommand(deviceId + ':00:01', true, false, 250),
        createDCMotorCommand(deviceId + ':00:02', true, false, 250)
    ]);
export const backwardCommand = (deviceId: string) =>
    createSewFrames([
        createDCMotorCommand(deviceId + ':00:01', true, true, 250),
        createDCMotorCommand(deviceId + ':00:02', true, true, 250)
    ]);
export const leftCommand = (deviceId: string) =>
    createSewFrames([
        createDCMotorCommand(deviceId + ':00:01', true, true, 200),
        createDCMotorCommand(deviceId + ':00:02', true, true, 250)
    ]);
export const rightCommand = (deviceId: string) =>
    createSewFrames([
        createDCMotorCommand(deviceId + ':00:01', true, true, 250),
        createDCMotorCommand(deviceId + ':00:02', true, true, 200)
    ]);

export const redAlarm = (deviceId: string, state: 0 | 1) =>
    createSewFrames([createSwitchCommand(deviceId + ':00:01', state)]);
export const blueAlarm = (deviceId: string, state: 0 | 1) =>
    createSewFrames([createSwitchCommand(deviceId + ':00:02', state)]);
