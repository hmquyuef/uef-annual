import BM01 from "./forms/bm01";
import BM02 from "./forms/bm02";
import BM03 from "./forms/bm03";
import BM04 from "./forms/bm04";
import BM05 from "./forms/bm05";
import BM07 from "./forms/bm07";
import BM08 from "./forms/bm08";
import BM09 from "./forms/bm09";
import BM10 from "./forms/bm10";
import BM11 from "./forms/bm11";
import BM12 from "./forms/bm12";
import BM13 from "./forms/bm13";
import BM14 from "./forms/bm14";
import BM15 from "./forms/bm15";
import NotFound from "./NotFound";

const DynamicComponent = ({ params }: { params: { shortName: string } }) => {
  const componentsMap: Record<string, JSX.Element> = {
    bm01: <BM01 />,
    bm02: <BM02 />,
    bm03: <BM03 />,
    bm04: <BM04 />,
    bm05: <BM05 />,
    bm07: <BM07 />,
    bm08: <BM08 />,
    bm09: <BM09 />,
    bm10: <BM10 />,
    bm11: <BM11 />,
    bm12: <BM12 />,
    bm13: <BM13 />,
    bm14: <BM14 />,
    bm15: <BM15 />,
  };
  const component = componentsMap[params.shortName.toLowerCase()] || (
    <NotFound />
  );
  return <>{component}</>;
};

export default DynamicComponent;
