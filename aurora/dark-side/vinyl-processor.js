class VinylProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'rate', defaultValue: 0, minValue: -3, maxValue: 3, automationRate: 'k-rate' }];
  }

  constructor() {
    super();
    this.channels = [];
    this.length = 0;
    this.position = 0;
    this.gain = 0;
    this.blocksUntilPositionUpdate = 0;
    this.port.onmessage = ({ data }) => {
      if (data.type === 'load') {
        this.channels = data.channels;
        this.length = this.channels[0]?.length || 0;
        this.position = 0;
      } else if (data.type === 'seek' && this.length) {
        this.position = ((data.seconds * sampleRate) % this.length + this.length) % this.length;
      }
    };
  }

  process(_inputs, outputs, parameters) {
    const output = outputs[0];
    const rate = parameters.rate[0] || 0;
    const audible = this.length > 0 && Math.abs(rate) > 0.002;
    const targetGain = audible ? 1 : 0;

    for (let frame = 0; frame < output[0].length; frame += 1) {
      this.gain += (targetGain - this.gain) * 0.035;
      const base = Math.floor(this.position);
      const fraction = this.position - base;
      const previous = (base - 1 + this.length) % Math.max(1, this.length);
      const next = (base + 1) % Math.max(1, this.length);
      const afterNext = (base + 2) % Math.max(1, this.length);

      for (let channel = 0; channel < output.length; channel += 1) {
        if (!audible) {
          output[channel][frame] = 0;
          continue;
        }
        const source = this.channels[Math.min(channel, this.channels.length - 1)];
        const p0 = source[previous];
        const p1 = source[base];
        const p2 = source[next];
        const p3 = source[afterNext];
        const t2 = fraction * fraction;
        const t3 = t2 * fraction;
        const sample = 0.5 * (
          (2 * p1)
          + (-p0 + p2) * fraction
          + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
          + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        );
        output[channel][frame] = sample * this.gain;
      }

      if (audible) {
        this.position = ((this.position + rate) % this.length + this.length) % this.length;
      }
    }

    this.blocksUntilPositionUpdate -= 1;
    if (this.blocksUntilPositionUpdate <= 0 && this.length) {
      this.port.postMessage({ type: 'position', seconds: this.position / sampleRate });
      this.blocksUntilPositionUpdate = 6;
    }
    return true;
  }
}

registerProcessor('vinyl-processor', VinylProcessor);
