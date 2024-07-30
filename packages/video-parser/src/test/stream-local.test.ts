import {RenderInternals} from '@remotion/renderer';
import {expect, test} from 'bun:test';
import {nodeReader} from '../from-node';
import {parseMedia} from '../get-video-metadata';

test('Should stream ISO base media', async () => {
	const result = await parseMedia(
		RenderInternals.exampleVideos.iphonevideo,
		{
			durationInSeconds: true,
			fps: true,
			boxes: true,
		},
		nodeReader,
	);
	expect(result.durationInSeconds).toBe(12.568333333333333);
	expect(result.fps).toBe(29.99602174777881);
});

test('Should stream WebM with no duration', async () => {
	const result = await parseMedia(
		RenderInternals.exampleVideos.nofps,
		{fps: true, durationInSeconds: true, dimensions: true},
		nodeReader,
	);
	expect(result.durationInSeconds).toBe(6.57);
	expect(result.dimensions).toEqual({
		width: 1470,
		height: 690,
	});
	expect(result.fps).toBeDefined();
});

test('Should stream AV1 with no duration', async () => {
	const parsed = await parseMedia(
		RenderInternals.exampleVideos.av1,
		{
			durationInSeconds: true,
			dimensions: true,
			fps: true,
		},
		nodeReader,
	);

	expect(parsed.durationInSeconds).toBe(1);
	expect(parsed.fps).toBe(null);
	expect(parsed.dimensions).toEqual({
		width: 1920,
		height: 1080,
	});
});

test('Should stream corrupted video', async () => {
	const parsed = await parseMedia(
		RenderInternals.exampleVideos.corrupted,
		{
			durationInSeconds: true,
			dimensions: true,
			fps: true,
		},
		nodeReader,
	);

	expect(parsed.durationInSeconds).toBe(30.03);
	expect(parsed.fps).toBe(23.976023976023978);
	expect(parsed.dimensions).toEqual({
		width: 1920,
		height: 1080,
	});
});

test('Should stream screen recording video', async () => {
	const parsed = await parseMedia(
		RenderInternals.exampleVideos.screenrecording,
		{
			durationInSeconds: true,
			dimensions: true,
			fps: true,
		},
		nodeReader,
	);

	expect(parsed.durationInSeconds).toBe(5.866666666666666);
	expect(parsed.fps).toBe(58.98305084745763);
	expect(parsed.dimensions).toEqual({
		height: 1766,
		width: 2874,
	});
});
