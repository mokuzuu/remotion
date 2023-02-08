import type {Codec} from './codec';

export const validAudioCodecs = ['pcm-16', 'aac', 'mp3', 'opus'] as const;

export type AudioCodec = typeof validAudioCodecs[number];

export const supportedAudioCodec: {[key in Codec]: AudioCodec[]} = {
	h264: ['aac'],
	'h264-mkv': ['pcm-16'],
	aac: ['aac'],
	gif: [],
	h265: ['aac'],
	mp3: ['mp3'],
	prores: ['pcm-16', 'aac'],
	vp8: ['opus', 'pcm-16'],
	vp9: ['opus', 'pcm-16'],
	wav: ['pcm-16'],
};

export const audioCodecNames = [
	'pcm_s16le',
	'aac',
	'libmp3lame',
	'libopus',
] as const;

export type FfmpegAudioCodecName = typeof audioCodecNames[number];

export const mapAudioCodecToFfmpegAudioCodecName = (
	audioCodec: AudioCodec
): FfmpegAudioCodecName => {
	if (audioCodec === 'aac') {
		return 'aac';
	}

	if (audioCodec === 'mp3') {
		return 'libmp3lame';
	}

	if (audioCodec === 'opus') {
		return 'libopus';
	}

	if (audioCodec === 'pcm-16') {
		return 'pcm_s16le';
	}

	throw new Error('unknown audio codec: ' + audioCodec);
};

export const defaultAudioCodecs: {
	[key in Codec]: {[k in 'compressed' | 'lossless']: AudioCodec | null};
} = {
	'h264-mkv': {
		lossless: 'pcm-16',
		compressed: 'aac',
	},
	aac: {
		lossless: 'aac',
		compressed: 'aac',
	},
	gif: {
		lossless: null,
		compressed: null,
	},
	h264: {
		lossless: 'pcm-16',
		compressed: 'aac',
	},
	h265: {
		lossless: 'pcm-16',
		compressed: 'aac',
	},
	mp3: {
		lossless: 'mp3',
		compressed: 'mp3',
	},
	prores: {
		lossless: 'pcm-16',
		// V4.0: Make pcm the default
		compressed: 'aac',
	},
	vp8: {
		lossless: 'pcm-16',
		compressed: 'aac',
	},
	vp9: {
		lossless: 'pcm-16',
		compressed: 'aac',
	},
	wav: {
		lossless: 'pcm-16',
		compressed: 'pcm-16',
	},
};

export const getDefaultAudioCodec = (
	codec: Codec,
	preferLossless: boolean
): AudioCodec | null => {
	return defaultAudioCodecs[codec][preferLossless ? 'lossless' : 'compressed'];
};
