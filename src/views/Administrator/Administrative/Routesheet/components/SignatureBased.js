import React, { useEffect, useState } from "react";

export default function SignatureBased(props) {
  const [currentItem, setCurrentItem] = useState(undefined);
  useEffect(() => {
    if (props.data) {
      // console.log('[CurrentItem]', currentItem);
      console.log("[Props Data]", props.data);
      setCurrentItem(props.data);
    }
  }, [props.data]);
  console.log("[Why]");
  return (
    <React.Fragment>
      {currentItem ? (
        <img src={currentItem.signature_based} height="40px" alt="" />
      ) : null}
    </React.Fragment>
  );
}
