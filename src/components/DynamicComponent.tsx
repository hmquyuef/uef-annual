import BM01 from "./forms/bm01";
import BM02 from "./forms/bm02";
import BM03 from "./forms/bm03";
import BM04 from "./forms/bm04";
import BM05 from "./forms/bm05";
import NotFound from "./NotFound";

const DynamicComponent = ({ params }: { params: { shortName: string } }) => {
  const renderComponent = () => {
    switch (params.shortName.toLowerCase()) {
      case "bm01":
        return <BM01 />;
      case "bm02":
        return <BM02 />;
      case "bm03":
        return <BM03 />;
      case "bm04":
        return <BM04 />;
      case "bm05":
        return <BM05 />;
      default:
        return <NotFound />;
    }
  };

  return <>{renderComponent()}</>;
};

export default DynamicComponent;
