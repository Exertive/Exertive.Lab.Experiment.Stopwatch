import { Observable } from 'rxjs';

// Stopwatch Mode Definitions

const StopwatchModes: string[] =
  [
    'CountUp',
    'CountDown'
  ];

export type StopwatchMode = typeof StopwatchModes[number];

export const CountUp: StopwatchMode = StopwatchModes[0];
export const CountDown: StopwatchMode = StopwatchModes[1];

// Stopwatch State Definitions

const StopwatchStates: string[] =
  [
    'Waiting',
    'Timing',
    'Stopped'
  ];

export type StopwatchState = typeof StopwatchStates[number];

export const Waiting: StopwatchState = StopwatchStates[0];
export const Timing: StopwatchState = StopwatchStates[1];
export const Stopped: StopwatchState = StopwatchStates[2];

// The Interface Definition

export interface IStopwatch
{

  // Interface Properties

  mode: StopwatchMode;

  state: StopwatchState;

  interval: number;

  duration?: number;

  start$: Observable<void>;

  tick$: Observable<number>;

  stop$: Observable<number>;

  // Interface Methods

  start(): void;

  restart(): void;

  stop(): number;

  countsUp(): boolean;

  countsDown(): boolean;

}
