import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Source} from '~/lib/convert-state';
import {useIsNarrow} from '~/lib/is-narrow';
import {AudioTrackOverview} from './AudioTrackOverview';
import {ContainerOverview} from './ContainerOverview';
import {SourceLabel} from './SourceLabel';
import {TrackSwitcher} from './TrackSwitcher';
import {VideoThumbnail, VideoThumbnailRef} from './VideoThumbnail';
import {VideoTrackOverview} from './VideoTrackOverview';
import {SupportedConfigs} from './get-supported-configs';
import {Button} from './ui/button';
import {Card, CardDescription, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Separator} from './ui/separator';
import {Skeleton} from './ui/skeleton';
import {useProbe} from './use-probe';

export const Probe: React.FC<{
	readonly src: Source;
	readonly setProbeDetails: React.Dispatch<React.SetStateAction<boolean>>;
	readonly probeDetails: boolean;
	readonly onSupportedConfigs: (supportedConfigs: SupportedConfigs) => void;
}> = ({src, probeDetails, setProbeDetails, onSupportedConfigs}) => {
	const videoThumbnailRef = useRef<VideoThumbnailRef>(null);

	const onVideoThumbnail = useCallback((frame: VideoFrame) => {
		videoThumbnailRef.current?.draw(frame);
	}, []);

	const {
		audioCodec,
		fps,
		tracks,
		name,
		container,
		dimensions,
		size,
		videoCodec,
		durationInSeconds,
	} = useProbe({src, onVideoThumbnail, onSupportedConfigs});

	const onClick = useCallback(() => {
		setProbeDetails((p) => !p);
	}, [setProbeDetails]);

	const sortedTracks = useMemo(
		() =>
			tracks
				? [...tracks.audioTracks, ...tracks.videoTracks].sort(
						(a, b) => a.trackId - b.trackId,
					)
				: [],
		[tracks],
	);

	const [trackDetails, setTrackDetails] = useState<number | null>(null);
	const isNarrow = useIsNarrow();

	const selectedTrack = useMemo(() => {
		if (!probeDetails || trackDetails === null) {
			return null;
		}

		return sortedTracks[trackDetails];
	}, [probeDetails, sortedTracks, trackDetails]);

	const isCompact = isNarrow && !probeDetails;

	return (
		<Card className="w-full lg:w-[350px] overflow-hidden">
			<div className="flex flex-row lg:flex-col w-full border-b-2 border-black">
				<VideoThumbnail ref={videoThumbnailRef} smallThumbOnMobile />
				<CardHeader className=" p-3 lg:p-4 w-full">
					<CardTitle title={name ?? undefined}>
						{name ? name : <Skeleton className="h-5 w-[220px] inline-block" />}
					</CardTitle>
					<CardDescription className="!mt-0">
						<SourceLabel src={src} />
					</CardDescription>
				</CardHeader>
			</div>
			{sortedTracks.length && probeDetails ? (
				<div className="pr-6 border-b-2 border-black overflow-y-auto">
					<TrackSwitcher
						selectedTrack={trackDetails}
						sortedTracks={sortedTracks}
						onTrack={(track) => {
							setTrackDetails(track);
						}}
					/>
				</div>
			) : null}
			{isCompact ? null : (
				<>
					<ScrollArea height={300} className="flex-1">
						{selectedTrack === null ? (
							<ContainerOverview
								container={container ?? null}
								dimensions={dimensions ?? null}
								videoCodec={videoCodec ?? null}
								size={size ?? null}
								// TODO: webcam1687984133964.webm always shows the skeleton
								durationInSeconds={durationInSeconds}
								// TODO: Test with webcam1687984133964.webm, it always shows the skeleton
								audioCodec={audioCodec ?? null}
								fps={fps}
							/>
						) : selectedTrack.type === 'video' ? (
							<VideoTrackOverview track={selectedTrack} />
						) : selectedTrack.type === 'audio' ? (
							<AudioTrackOverview track={selectedTrack} />
						) : null}
					</ScrollArea>
					<Separator orientation="horizontal" />
				</>
			)}
			<div className="flex flex-row items-center justify-center">
				<Button disabled={!tracks} variant="link" onClick={onClick}>
					{probeDetails ? 'Hide details' : 'Show details'}
				</Button>
			</div>
		</Card>
	);
};
