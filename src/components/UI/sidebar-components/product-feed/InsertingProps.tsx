import React, { useMemo, useCallback } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../../../context/ConfigContext";
import { useBanner } from "../../../../context/BannerContext";
import KeyValueTable from "./KeyValueTable";
import { KeyValuePair } from "../../../../types";
// import { mockProducts } from "../../../../constants/mockProducts";
import type { ExtendedPair } from "../../../../types";

const InsertingProps: React.FC = () => {
  const { config, setConfig } = useConfig();
  const {
    addObject,
    products,
    isProductsLoading,
    productIndex,
    setProductIndex,
  } = useBanner();
  const { t } = useTranslation();
  const keyValuePairs = config?.keyValuePairs ?? [];

  const updatePairs = useCallback(
    (newPairs: typeof keyValuePairs) => {
      setConfig((prev) => ({ ...prev, keyValuePairs: newPairs }));
    },
    [setConfig]
  );

  const addKeyValuePair = useCallback(() => {
    const newPair: KeyValuePair = { key: "", value: "", custom: true };
    updatePairs([newPair, ...keyValuePairs]);
  }, [keyValuePairs, updatePairs]);

  const removeKeyValuePair = useCallback(
    (key: string) => {
      updatePairs(keyValuePairs.filter((p) => p.key !== key));
    },
    [keyValuePairs, updatePairs]
  );

  const handleAddText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      addObject({
        type: "text",
        x: 50,
        y: 50,
        width: 200,
        height: 50,
        content: text,
        fontSize: 16,
        color: "#000000",
        name: "",
      });
    },
    [addObject]
  );

  const handleAddDynamicsImage = (url: string) => {
    addObject({
      type: "image",
      width: 250,
      height: 250,
      x: 50,
      y: 50,
      src: url,
      name: "",
      dynamics: true,
    });
  };
  // const productsSource = products && products.length ? products : mockProducts;
  const productsSource = products ?? [];
  const product =
    productsSource.length > 0 ? productsSource[productIndex] : null;

  // const productPairs = useMemo<ExtendedPair[]>(() => {
  //   if (!product) return [];
  //   return Object.entries(product).map(([k, v]) => {
  //     const displayValue = Array.isArray(v) ? v.join(", ") : String(v ?? "");
  //     return {
  //       key: k,
  //       value: displayValue,
  //       editable: false,
  //     } as ExtendedPair;
  //   });
  // }, [product]);

  // InsertingProps.tsx (фрагмент с изменением productPairs)
  const productPairs = useMemo<ExtendedPair[]>(() => {
    if (!product) return [];
    return Object.entries(product).map(([k, v]) => {
      // normalize product keys to internal format: every space => "__"
      const storedKey = String(k ?? "").replace(/ /g, "__");
      const displayValue = Array.isArray(v) ? v.join(", ") : String(v ?? "");
      return {
        key: storedKey,
        value: displayValue,
        editable: false,
      } as ExtendedPair;
    });
  }, [product]);

  const customPairsOrdered = useMemo(
    () =>
      keyValuePairs
        .filter((p) => !p.fromProduct)
        .map((p) => ({ ...p, editable: true, custom: true })),
    [keyValuePairs]
  );

  const productOrderedPairs = useMemo(() => {
    return productPairs.map((pp) => {
      const override = keyValuePairs.find(
        (kp) => kp.key === pp.key && kp.fromProduct
      );
      if (override) {
        return { ...override, editable: true } as ExtendedPair;
      }
      return { ...pp, editable: false } as ExtendedPair;
    });
  }, [productPairs, keyValuePairs]);

  const combinedPairs = useMemo(
    () => [...customPairsOrdered, ...productOrderedPairs],
    [customPairsOrdered, productOrderedPairs]
  );

  const handleEditKey = useCallback(
    (oldKey: string, newKey: string) => {
      const idx = keyValuePairs.findIndex((p) => p.key === oldKey);
      if (idx === -1) return;
      const updated = [...keyValuePairs];
      updated[idx] = { ...updated[idx], key: newKey };
      updatePairs(updated);
    },
    [keyValuePairs, updatePairs]
  );

  const handleEditValue = useCallback(
    (key: string, newValue: string) => {
      const idx = keyValuePairs.findIndex((p) => p.key === key);
      if (idx === -1) return;
      const updated = [...keyValuePairs];
      updated[idx] = { ...updated[idx], value: newValue };
      updatePairs(updated);
    },
    [keyValuePairs, updatePairs]
  );

  const commitProductValue = useCallback(
    (key: string, value: string) => {
      const exists = keyValuePairs.find((p) => p.key === key);
      if (exists) {
        updatePairs(
          keyValuePairs.map((p) =>
            p.key === key ? { ...p, value, fromProduct: true } : p
          )
        );
      } else {
        updatePairs([...keyValuePairs, { key, value, fromProduct: true }]);
      }
    },
    [keyValuePairs, updatePairs]
  );

  const goPrev = useCallback(
    () =>
      setProductIndex((i) => (i - 1 < 0 ? productsSource.length - 1 : i - 1)),
    [setProductIndex, productsSource.length]
  );
  const goNext = useCallback(
    () => setProductIndex((i) => (i + 1 >= productsSource.length ? 0 : i + 1)),
    [setProductIndex, productsSource.length]
  );

  const hasError =
    !isProductsLoading && (!productsSource || productsSource.length === 0);

  return (
    <div className="inserting-props">
      <div>
        <p className="inserting-props-title">
          {product?.title ? "Title: " : " "}
          <span> {String(product?.title ?? "")}</span>
        </p>

        {productsSource.length > 1 && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button onClick={goPrev} sx={{ height: 30, whiteSpace: "nowrap" }}>
              ← Prev
            </Button>
            <span style={{ whiteSpace: "nowrap", fontSize: 16, marginTop: 2 }}>
              {productIndex + 1} / {productsSource.length}
            </span>
            <Button onClick={goNext} sx={{ height: 30, whiteSpace: "nowrap" }}>
              Next →
            </Button>
          </div>
        )}

        {isProductsLoading && (
          <div>
            <CircularProgress size="12px" /> Loading products…
          </div>
        )}

        {hasError && (
          <div style={{ color: "red", textAlign: "center" }}>
            ⚠️ {t("insertingProps")}
          </div>
        )}
      </div>

      {!hasError && (
        <KeyValueTable
          combinedPairs={combinedPairs}
          onEditKey={handleEditKey}
          onEditValue={handleEditValue}
          onRemoveByKey={removeKeyValuePair}
          onAddCustom={addKeyValuePair}
          onAddText={handleAddText}
          onAddImage={handleAddDynamicsImage}
          onCommitProductValue={commitProductValue}
        />
      )}
    </div>
  );
};

export default InsertingProps;
