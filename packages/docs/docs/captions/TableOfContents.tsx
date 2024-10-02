import React from 'react';
import {Grid} from '../../components/TableOfContents/Grid';
import {TOCItem} from '../../components/TableOfContents/TOCItem';

export const TableOfContents: React.FC = () => {
	return (
		<div>
			<Grid>
				<TOCItem link="/docs/captions/create-tiktok-style-captions">
					<strong>{'createTikTokStyleCaptions()'}</strong>
					<div>Structure the captions for TikTok-style display</div>
				</TOCItem>
			</Grid>
		</div>
	);
};
