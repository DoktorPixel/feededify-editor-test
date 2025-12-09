import React from "react";
import {
  computeOpacity,
  shouldHideObject,
  replaceDynamicText,
  replaceDynamicVariablesForDynamicImg,
  hexToRgba,
} from "../../../utils/hooks";

import { BannerObject, KeyValuePair, DynamicImg } from "../../../types";
import { NestedGroupObject } from "./NestedGroupObject";

type SelectedChildId = {
  groupId: number;
  childId: number;
  parentId?: number;
} | null;

interface Props {
  object: BannerObject;
  isVisible: boolean;
  hiddenObjectIds: number[];
  keyValuePairs: KeyValuePair[];
  selectedChildId: SelectedChildId;
  handleChildClick: (
    groupId: number,
    childId: number,
    e: React.MouseEvent,
    parentGroupId?: number
  ) => void;
  dynamicImgs?: DynamicImg[];
  fallbackText?: string;
}

export const GroupObject: React.FC<Props> = ({
  object,
  isVisible,
  hiddenObjectIds,
  keyValuePairs,
  selectedChildId,
  handleChildClick,
  dynamicImgs,
  fallbackText,
}) => {
  return (
    <>
      {object.children
        ?.slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((child) => {
          const isHidden = shouldHideObject(child.condition, keyValuePairs);
          const isVisibleCild =
            isVisible && !hiddenObjectIds.includes(child.id);
          const boxShadow = child.boxShadowColor
            ? `${child.boxShadowInset ? "inset " : ""}${
                child.boxShadowX || 0
              }px ${child.boxShadowY || 0}px ${
                child.boxShadowBlur || 0
              }px ${hexToRgba(
                child.boxShadowColor,
                child.boxShadowOpacity ?? 1
              )}`
            : undefined;

          if (child.type === "text") {
            return (
              <div
                key={child.id}
                id={`${child.id}`}
                data-condition={JSON.stringify(child.condition)}
                className={`text-field banner-object-child ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
                    : ""
                }`}
                style={{
                  fontSize: child.fontSize,
                  color: child.color,
                  fontFamily: child.fontFamily,
                  fontWeight: child.fontWeight,
                  fontStyle: child.fontStyle,
                  textTransform: child.textTransform,
                  lineHeight: child.lineHeight,
                  letterSpacing: child.letterSpacing,
                  textDecoration: child.textDecoration,
                  textAlign: child.textAlign,
                  opacity: computeOpacity(child.opacity, isHidden),
                  visibility: isVisibleCild ? "visible" : "hidden",
                  border:
                    selectedChildId?.groupId === object.id &&
                    selectedChildId.childId === child.id
                      ? "1px solid blue"
                      : "none",
                  transform: `rotate(${child.rotate || 0}deg)`,
                }}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
              >
                {replaceDynamicText(child.content ?? "", keyValuePairs)}
              </div>
            );
          } else if (child.type === "image") {
            return (
              <img
                id={`${child.id}`}
                data-condition={JSON.stringify(child.condition)}
                key={child.id}
                src={replaceDynamicVariablesForDynamicImg(
                  child.src ?? "",
                  keyValuePairs,
                  dynamicImgs ?? [],
                  // child?.object_id,
                  // child?.logoName,
                  fallbackText
                )}
                alt={child.name || "image"}
                style={{
                  width: child.width,
                  height: child.height,
                  objectFit: child.objectFit,
                  transform: `rotate(${child.rotate || 0}deg)`,
                  opacity: computeOpacity(child.opacity, isHidden),
                  visibility: isVisibleCild ? "visible" : "hidden",
                }}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
                className={`banner-object-child image-field ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
                    : ""
                }`}
              />
            );
          } else if (child.type === "figure") {
            const {
              id,
              width,
              height,
              rotate,
              backgroundColor,
              borderRadius,
              borderTopStyle,
              borderTopColor,
              borderTopWidth,
              borderBottomStyle,
              borderBottomColor,
              borderBottomWidth,
              borderLeftStyle,
              borderLeftColor,
              borderLeftWidth,
              borderRightStyle,
              borderRightColor,
              borderRightWidth,

              ...figureStyles
            } = child;

            const cleanStyles = Object.fromEntries(
              Object.entries(figureStyles).filter(
                ([key]) => key in ({} as React.CSSProperties)
              )
            );
            return (
              <div
                key={id}
                id={`${child.id}`}
                data-condition={JSON.stringify(child.condition)}
                style={{
                  transform: `rotate(${rotate ?? 0}deg)`,
                  visibility: isVisibleCild ? "visible" : "hidden",
                  opacity: computeOpacity(child.opacity, isHidden),
                }}
                onDoubleClick={(e) =>
                  handleChildClick(object.id, child.id, e, undefined)
                }
                className={`banner-object-child ${
                  selectedChildId?.groupId === object.id &&
                  selectedChildId.childId === child.id
                    ? "selected"
                    : ""
                }`}
              >
                <div
                  style={{
                    position: "relative",
                    width: width ?? "100px",
                    height: height ?? "100px",
                    borderRadius: borderRadius,
                    borderTopStyle: borderTopStyle,
                    borderTopColor: borderTopColor,
                    borderTopWidth: borderTopWidth,
                    borderBottomStyle: borderBottomStyle,
                    borderBottomColor: borderBottomColor,
                    borderBottomWidth: borderBottomWidth,
                    borderLeftStyle: borderLeftStyle,
                    borderLeftColor: borderLeftColor,
                    borderLeftWidth: borderLeftWidth,
                    borderRightStyle: borderRightStyle,
                    borderRightColor: borderRightColor,
                    borderRightWidth: borderRightWidth,
                    backgroundColor:
                      backgroundColor !== "none" ? backgroundColor : undefined,
                    boxShadow,
                    ...cleanStyles,
                  }}
                ></div>
              </div>
            );
          } else if (child.type === "group") {
            return (
              <NestedGroupObject
                key={child.id}
                child={child}
                object={object}
                isVisible={isVisible}
                isVisibleChild={isVisibleCild}
                hiddenObjectIds={hiddenObjectIds}
                keyValuePairs={keyValuePairs}
                selectedChildId={selectedChildId}
                handleChildClick={handleChildClick}
                boxShadow={boxShadow}
              />
            );
          }
          return null;
        })}
    </>
  );
};
