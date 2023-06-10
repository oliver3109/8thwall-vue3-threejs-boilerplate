/**
 * XR8.stop()
 * While stopped, the camera feed is closed and device motion is not tracked.
 * Must call [XR8.run()](https://www.8thwall.com/docs/api/xr8/run/) to restart after the engine is stopped.
 * https://www.8thwall.com/docs/api/xr8/stop/
 */

export type stop = () => void
