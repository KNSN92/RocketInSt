import Image, { ImageProps } from "next/image";

type NonSrcImageProps = Omit<Omit<ImageProps, "src">, "alt">

export function RocketInStWhiteTextLogo(props: NonSrcImageProps) {
	return (
		<Image src="/logo/text_white.png" alt="RocketIn.st Logo" {...props} />
	);
};

export function RocketInStBlackTextLogo(props: NonSrcImageProps) {
	return (
		<Image src="/logo/text_black.png" alt="RocketIn.st Logo" {...props} />
	);
};