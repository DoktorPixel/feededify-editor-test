import React from "react";
import { BannerObject } from "../../../types";
import { computeOpacity, hexToRgba } from "../../../utils/hooks";

interface Props {
  object: BannerObject;
  isHidden: boolean;
}

export const FigureObject: React.FC<Props> = ({ object, isHidden }) => {
  const boxShadow = object.boxShadowColor
    ? `${object.boxShadowInset ? "inset " : ""}${object.boxShadowX || 0}px ${
        object.boxShadowY || 0
      }px ${object.boxShadowBlur || 0}px ${hexToRgba(
        object.boxShadowColor,
        object.boxShadowOpacity ?? 1
      )}`
    : undefined;

  return (
    <div
      id={`${object.id}`}
      data-condition={JSON.stringify(object.condition)}
      className="banner-figure"
      style={{
        backgroundColor:
          object.backgroundColor !== "none"
            ? object.backgroundColor
            : undefined,
        borderRadius: object.borderRadius,
        opacity: computeOpacity(object.opacity, isHidden),
        borderTopStyle: object.borderTopStyle,
        borderTopColor: object.borderTopColor,
        borderTopWidth: object.borderTopWidth,
        borderBottomStyle: object.borderBottomStyle,
        borderBottomColor: object.borderBottomColor,
        borderBottomWidth: object.borderBottomWidth,
        borderLeftStyle: object.borderLeftStyle,
        borderLeftColor: object.borderLeftColor,
        borderLeftWidth: object.borderLeftWidth,
        borderRightStyle: object.borderRightStyle,
        borderRightColor: object.borderRightColor,
        borderRightWidth: object.borderRightWidth,

        boxShadow,
      }}
    />
  );
};
