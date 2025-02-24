import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { JSX, SVGProps } from "react";

type NonSrcImageProps = Omit<Omit<ImageProps, "src">, "alt">;

export function RocketInStWhiteTextLogo(props: NonSrcImageProps) {
  return <Image src="/logo/text_white.png" alt="RocketIn.st Logo" {...props} />;
}

export function RocketInStBlackTextLogo(props: NonSrcImageProps) {
  return <Image src="/logo/text_black.png" alt="RocketIn.st Logo" {...props} />;
}

export function RocketInStLogo(props: NonSrcImageProps) {
  return <Image src="/logo/logo.png" alt="RocketIn.st Logo" {...props} />;
}

export function RocketInStLoadingLogo({
  className,
}: {
  className?: HTMLDivElement["className"];
}) {
  return (
    <div
      className={clsx(
        className,
        "flex aspect-square items-center justify-center bg-[url(/logo/loading_back.png)] bg-contain",
      )}
    >
      <Image
        src="/logo/loading_needle.png"
        alt="RocketIn.st Loading Needle"
        width={47}
        height={367}
        className="h-[80%] w-fit rotate-45 animate-[loading-spin_1s_ease-in-out_infinite]"
      />
    </div>
  );
}

export function RocketInStSvgLogo(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 114.386 114.386"
      {...props}
    >
      <g>
        <circle
          cx="57.193"
          cy="57.193"
          r="56.693"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit={10}
        />
        <circle cx="57.193" cy="57.193" r="51.834" />
        <path
          d="M69.922,50.037c13.728,13.728,13.39,22.292,7.899,27.783-5.491,5.491-14.056,5.829-27.783-7.899-13.728-13.728-21.928-41.813-21.928-41.813,0,0,28.086,8.201,41.813,21.928Z"
          fill="#fff"
        />
        <polygon
          points="73.48 95.702 63.538 105.644 53.006 95.113 53.595 75.817 73.48 95.702"
          fill="#fff"
        />
        <polygon
          points="105.644 63.538 95.702 73.48 75.817 53.595 95.113 53.006 105.644 63.538"
          fill="#fff"
        />
        <path
          d="M93.734,78.82s-9.804-5.11-14.914,0c-5.11,5.11,0,14.914,0,14.914l14.914-14.914Z"
          fill="#fff"
        />
        <g className="logo-needle">
          <polygon
            points="89.588 24.798 53.117 53.117 24.798 89.588 61.269 61.269 89.588 24.798"
            fill="#fff"
            style={{ mixBlendMode: "difference" }}
          />
          <polygon points="87.976 26.41 53.32 53.32 57.193 57.193 87.976 26.41" />
          <polygon points="26.41 87.976 61.066 61.066 57.193 57.193 26.41 87.976" />
          <polygon
            points="26.41 87.976 53.32 53.32 57.193 57.193 26.41 87.976"
            fill="#fff"
          />
          <polygon
            points="87.976 26.41 61.066 61.066 57.193 57.193 87.976 26.41"
            fill="#fff"
          />
          <circle
            cx="57.193"
            cy="57.193"
            r="1.62"
            fill="#fff"
            stroke="#000"
            strokeMiterlimit={10}
            strokeWidth=".5px"
          />
        </g>
      </g>
    </svg>
  );
}

export function RocketInStSvgTextLogo(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 382.628 87.98"
      {...props}
    >
      <g>
        <path
          className="textlogo-R1 fill-black dark:fill-white"
          d="M86.866,61.485l-11.664-25.703h-11.952l-4.536,25.703h-1.584l9-50.975h11.88c1.728,0,3.456.18,5.184.54,1.728.359,3.299.948,4.716,1.764,1.415.816,2.556,1.92,3.42,3.312.864,1.394,1.296,3.121,1.296,5.185,0,2.977-.529,5.389-1.584,7.235-1.056,1.849-2.376,3.301-3.96,4.356s-3.301,1.776-5.148,2.159c-1.848.385-3.564.602-5.148.648l11.808,25.775h-1.728ZM91.041,21.517c0-1.836-.385-3.37-1.152-4.602-.769-1.231-1.776-2.234-3.024-3.007-1.249-.773-2.7-1.316-4.356-1.63-1.656-.314-3.348-.472-5.076-.472h-10.008l-3.96,22.68h11.52c2.448,0,4.655-.241,6.624-.725,1.967-.482,3.66-1.256,5.076-2.318,1.416-1.062,2.495-2.416,3.24-4.059.743-1.643,1.116-3.599,1.116-5.868Z"
        />
        <path
          className="textlogo-c3 fill-black dark:fill-white"
          d="M156.379,61.594c-2.041.792-4.188,1.188-6.444,1.188-2.544,0-4.728-.372-6.552-1.116-1.825-.743-3.337-1.774-4.536-3.096-1.2-1.319-2.088-2.867-2.664-4.644-.576-1.775-.864-3.672-.864-5.688,0-2.735.479-5.352,1.44-7.848.96-2.495,2.304-4.716,4.032-6.659,1.728-1.944,3.78-3.492,6.156-4.645,2.376-1.151,4.979-1.728,7.812-1.728,2.112,0,4.164.349,6.156,1.044,1.991.696,3.539,1.764,4.644,3.204l-1.008,1.079c-1.056-1.392-2.473-2.411-4.248-3.06-1.776-.647-3.576-.972-5.4-.972-2.592,0-4.993.541-7.2,1.623-2.208,1.082-4.116,2.525-5.724,4.33-1.609,1.805-2.856,3.861-3.744,6.169-.889,2.31-1.332,4.715-1.332,7.216,0,1.877.263,3.62.792,5.231.528,1.612,1.332,3.02,2.412,4.222,1.08,1.203,2.436,2.152,4.068,2.85,1.631.697,3.575,1.047,5.832,1.047,2.016,0,3.996-.372,5.939-1.116,1.944-.744,3.611-1.788,5.004-3.132l.792,1.08c-1.537,1.488-3.324,2.628-5.364,3.42Z"
        />
        <path
          className="textlogo-k4 fill-black dark:fill-white"
          d="M174.198,43.558l19.583-15.191h2.448l-20.16,15.479,16.272,17.64h-2.232l-15.984-17.495h-.144l-3.096,17.495h-1.584l9.576-54.431h1.584l-6.408,36.503h.144Z"
        />
        <path
          className="textlogo-e5 fill-black dark:fill-white"
          d="M202.205,44.565c-.145.966-.217,1.81-.217,2.531,0,4.484,1.199,7.955,3.601,10.413,2.399,2.459,5.76,3.688,10.079,3.688,2.736,0,5.148-.576,7.236-1.728,2.088-1.152,3.899-2.64,5.436-4.464l.864,1.008c-1.393,1.776-3.24,3.301-5.544,4.571-2.304,1.271-4.968,1.908-7.992,1.908-2.447,0-4.62-.372-6.516-1.116-1.896-.743-3.492-1.774-4.788-3.096-1.296-1.319-2.28-2.903-2.951-4.752-.673-1.847-1.009-3.875-1.009-6.084,0-2.592.457-5.1,1.37-7.523.914-2.423,2.213-4.572,3.897-6.444,1.684-1.871,3.681-3.358,5.989-4.464,2.309-1.104,4.883-1.655,7.722-1.655,2.262,0,4.209.349,5.845,1.044,1.636.696,2.994,1.632,4.076,2.808,1.083,1.177,1.877,2.556,2.382,4.14s.759,3.265.759,5.04c0,.48-.036,1.104-.108,1.872-.072.769-.205,1.537-.396,2.304h-29.735ZM230.644,43.27c.145-1.066.217-2.06.217-2.98,0-3.49-1.021-6.303-3.061-8.436s-4.859-3.199-8.46-3.199c-2.544,0-4.8.474-6.768,1.418-1.969.945-3.66,2.134-5.076,3.563s-2.544,3.005-3.384,4.726c-.84,1.722-1.403,3.358-1.691,4.908h28.223Z"
        />
        <path
          className="textlogo-t6 fill-black dark:fill-white"
          d="M250.839,62.134c-.648.144-1.332.216-2.052.216-2.064,0-3.625-.494-4.681-1.479s-1.584-2.345-1.584-4.077c0-.385.036-.913.108-1.587.072-.673.155-1.203.252-1.588l4.248-23.956h-7.632l.216-1.296h7.56l1.729-9.72h1.584l-1.729,9.72h9.072l-.216,1.296h-9.072l-4.248,24.23c-.097.386-.169.88-.216,1.483-.048.603-.072,1.049-.072,1.337,0,1.592.456,2.714,1.368,3.364.911.651,2.136.977,3.672.977.433,0,.996-.054,1.692-.16.695-.105,1.332-.292,1.908-.561v1.225c-.625.239-1.261.432-1.908.576Z"
        />
        <path
          className="textlogo-I7 fill-black dark:fill-white"
          d="M261.818,61.485l9-50.975h1.584l-9,50.975h-1.584Z"
        />
        <path
          className="textlogo-n8 fill-black dark:fill-white"
          d="M298.032,27.358c1.775,0,3.323.3,4.645.899,1.319.601,2.412,1.393,3.275,2.376.864.984,1.512,2.124,1.944,3.42.432,1.296.647,2.641.647,4.032,0,1.057-.144,2.304-.432,3.744l-3.456,19.655h-1.584l3.528-19.771c.096-.528.18-1.13.252-1.804.072-.672.107-1.274.107-1.804,0-1.154-.168-2.297-.504-3.427-.336-1.131-.863-2.141-1.584-3.031-.72-.89-1.655-1.61-2.808-2.164s-2.568-.83-4.248-.83c-1.824,0-3.54.373-5.147,1.118-1.609.746-3.061,1.816-4.356,3.212-1.296,1.395-2.412,3.091-3.348,5.087s-1.62,4.27-2.052,6.818l-2.952,16.596h-1.584l4.392-24.821c.096-.529.204-1.178.324-1.947.119-.77.228-1.552.324-2.346.096-.793.191-1.551.288-2.272.096-.723.144-1.323.144-1.805h1.584c-.048.484-.12,1.089-.216,1.814-.097.727-.192,1.514-.288,2.36-.097.848-.216,1.67-.36,2.469-.144.798-.264,1.512-.359,2.141h.144c1.487-3.216,3.42-5.64,5.796-7.272,2.376-1.631,5.004-2.447,7.884-2.447Z"
        />
        <path
          className="textlogo-dot9 fill-black dark:fill-white"
          d="M320.495,61.917c-.433,0-.792-.133-1.08-.396-.288-.264-.432-.685-.432-1.26,0-.528.167-.996.504-1.404.335-.407.767-.612,1.296-.612.432,0,.792.133,1.08.396.288.265.432.66.432,1.188,0,.576-.18,1.069-.54,1.477s-.78.611-1.26.611Z"
        />
        <path
          className="textlogo-s10 fill-black dark:fill-white"
          d="M334.534,56.878c.815,1.2,2.076,2.172,3.78,2.915,1.703.745,3.539,1.116,5.508,1.116,1.487,0,2.844-.228,4.067-.684,1.225-.456,2.269-1.067,3.132-1.836.864-.768,1.523-1.667,1.98-2.7.456-1.031.684-2.124.684-3.276,0-.911-.133-1.728-.396-2.447-.265-.72-.72-1.38-1.368-1.98-.647-.6-1.512-1.151-2.592-1.655s-2.412-1.02-3.996-1.549c-2.833-.911-4.836-1.943-6.012-3.096-1.177-1.151-1.764-2.664-1.764-4.535,0-1.632.348-3.061,1.044-4.284.695-1.225,1.595-2.243,2.699-3.061,1.104-.815,2.341-1.427,3.708-1.836,1.368-.407,2.747-.611,4.141-.611,2.255,0,4.163.372,5.724,1.115,1.559.745,2.7,1.669,3.42,2.772l-1.296.936c-.576-1.104-1.633-1.967-3.168-2.592-1.537-.623-3.121-.936-4.752-.936-1.008,0-2.088.145-3.24.433-1.151.289-2.221.759-3.204,1.407-.984.649-1.812,1.491-2.483,2.524-.673,1.035-1.008,2.322-1.008,3.861,0,1.877.6,3.247,1.8,4.113,1.199.866,2.976,1.683,5.328,2.452,3.455,1.106,5.819,2.356,7.092,3.752,1.271,1.395,1.907,3.103,1.907,5.123,0,1.443-.276,2.767-.828,3.969s-1.344,2.262-2.375,3.175c-1.033.913-2.269,1.623-3.708,2.128-1.44.505-3.049.758-4.824.758-2.16,0-4.176-.421-6.048-1.26-1.872-.84-3.24-1.908-4.104-3.204l1.151-1.008Z"
        />
        <path
          className="textlogo-t11 fill-black dark:fill-white"
          d="M375.537,62.134c-.648.144-1.332.216-2.052.216-2.064,0-3.625-.494-4.681-1.479s-1.584-2.345-1.584-4.077c0-.385.036-.913.108-1.587.072-.673.155-1.203.252-1.588l4.248-23.956h-7.632l.216-1.296h7.56l1.729-9.72h1.584l-1.729,9.72h9.072l-.216,1.296h-9.072l-4.248,24.23c-.097.386-.169.88-.216,1.483-.048.603-.072,1.049-.072,1.337,0,1.592.456,2.714,1.368,3.364.911.651,2.136.977,3.672.977.433,0,.996-.054,1.692-.16.695-.105,1.332-.292,1.908-.561v1.225c-.625.239-1.261.432-1.908.576Z"
        />
        <g className="textlogo-compass2">
          <polygon
            points="115.328 46.098 123.025 33.224 110.151 40.921 102.453 53.795 115.328 46.098"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeMiterlimit={10}
          />
          <circle
            cx="112.739"
            cy="43.509"
            r="18"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeMiterlimit={10}
            strokeWidth="1.25px"
          />
          <circle
            cx="112.739"
            cy="43.509"
            r="1.029"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeMiterlimit={10}
          />
          <line
            x1="102.453"
            y1="53.795"
            x2="112.012"
            y2="44.237"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeMiterlimit={10}
          />
          <line
            x1="113.467"
            y1="42.782"
            x2="123.025"
            y2="33.224"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeMiterlimit={10}
          />
        </g>
        <g className="textlogo-rocket0">
          <path
            d="M38.06,41.379c0,16.635-5.394,21.619-12.048,21.619-6.654,0-12.048-4.985-12.048-21.619S26.012,2.759,26.012,2.759c0,0,12.048,21.986,12.048,38.62Z"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeLinecap="round"
            strokeMiterlimit={10}
          />
          <polygon
            points="12.548 71.203 .5 71.203 .5 58.441 12.548 47.107 12.548 71.203"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeLinecap="round"
            strokeMiterlimit={10}
          />
          <polygon
            points="51.524 71.203 39.476 71.203 39.476 47.107 51.524 58.441 51.524 71.203"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeLinecap="round"
            strokeMiterlimit={10}
          />
          <path
            d="M35.048,73.246s-2.844-9.036-9.036-9.036c-6.192,0-9.036,9.036-9.036,9.036h18.072Z"
            fill="none"
            className="stroke-black dark:stroke-white"
            strokeLinecap="round"
            strokeMiterlimit={10}
          />
        </g>
      </g>
    </svg>
  );
}
