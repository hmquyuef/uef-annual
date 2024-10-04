import React from "react";
import BM05 from "./forms/bm05";
import NotFound from "./NotFound";

const DynamicComponent = ({ params }: { params: { shortName: string } }) => {
  const renderComponent = () => {
    switch (params.shortName.toLowerCase()) {
      case "bm05":
        return <BM05 />;
      default:
        return <NotFound />;
    }
  };

  return <>{renderComponent()}</>;
};

export default DynamicComponent;
