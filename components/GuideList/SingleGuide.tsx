import Image from 'next/image';
import Link from 'next/link';

interface ISingleGuideProps {
  guide: GuidePage;
}

const SingleGuide = ({ guide }: ISingleGuideProps) => {
  return (
    <Link href={`/guides/${guide.slug}`}>
      <a className="group relative">
        <Image
          src={guide.coverImage}
          layout="responsive"
          width={1}
          height={1.5}
          alt="Cover"
          className="rounded-lg group-hover:brightness-[0.2] transition duration-100"
        />
        <div className="opacity-0 group-hover:opacity-100 transition duration-100">
          <p className="absolute top-1/2 left-1/2 w-full text-center -translate-x-1/2 -translate-y-1/2 sm:text-xl">
            Read Our
            <br></br>
            <span className="text-lg font-medium text-white sm:text-2xl">
              {guide.title}
            </span>
            <br></br>
            Guide
          </p>
        </div>
      </a>
    </Link>
  );
};

export { SingleGuide };
