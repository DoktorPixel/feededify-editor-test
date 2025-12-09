// src/components/CombinedPairsSync.tsx
import { useEffect, useMemo, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { useBanner } from "../context/BannerContext";
import { useProductsFeedDynamic } from "../utils/useProductsFeedDynamic";
// import { mockProducts } from "../constants/mockProducts";
import { useProductsFeedCsv } from "../utils/useProductsFeedCsv";
import type { ExtendedPair, Product } from "../types";
import { fetchDynamicFeed } from "../utils/fetchDynamicFeed";

const MAX_PRODUCTS = 1000;

export const CombinedPairsSync: React.FC = () => {
  const { config } = useConfig();
  const {
    feedUrl,
    feedType,
    currentProjectId,
    setCombinedPairs,
    setProducts,
    setIsProductsLoading,
    productIndex,
  } = useBanner();

  const [feedContent, setFeedContent] = useState<string | null>(null);

  useEffect(() => {
    if (!feedUrl) {
      setFeedContent(null);
      setProducts([]);
      setIsProductsLoading(false);
      return;
    }

    let isMounted = true;
    setIsProductsLoading(true);

    fetchDynamicFeed(feedUrl, currentProjectId)
      .then((text) => {
        if (!isMounted) return;
        setFeedContent(text);
        setIsProductsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dynamic feed:", err);
        if (isMounted) setIsProductsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [feedUrl, setIsProductsLoading, setProducts]);

  const xmlQuery = useProductsFeedDynamic(feedContent, {
    limit: MAX_PRODUCTS,
    enabled: !!feedContent && feedType !== "csv",
  });

  const csvQuery = useProductsFeedCsv(feedContent, {
    limit: MAX_PRODUCTS,
    enabled: !!feedContent && feedType === "csv",
  });

  const fetchedProducts: Product[] | undefined =
    feedType === "csv" ? csvQuery.data : xmlQuery.data;

  useEffect(() => {
    const productsSource = fetchedProducts ?? [];
    setProducts(productsSource);
  }, [fetchedProducts, setProducts]);

  // const productsSource: Product[] =
  //   (fetchedProducts && fetchedProducts.length
  //     ? fetchedProducts
  //     : mockProducts) ?? [];
  const productsSource: Product[] = fetchedProducts ?? [];

  const currentProduct =
    productsSource.length > 0
      ? productsSource[Math.min(productIndex, productsSource.length - 1)]
      : null;

  const productPairs: ExtendedPair[] = useMemo(() => {
    if (!currentProduct) return [];
    return Object.entries(currentProduct).map(([key, value]) => {
      const displayValue = Array.isArray(value)
        ? value.join(", ")
        : String(value ?? "");
      return { key, value: displayValue, editable: false };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct]);

  const keyValuePairs = config?.keyValuePairs ?? [];

  const customPairs = useMemo(
    () =>
      keyValuePairs
        .filter((p) => !p.fromProduct)
        .map((p) => ({ ...p, editable: true, custom: true })),
    [keyValuePairs]
  );

  const productPairsWithOverrides = useMemo(() => {
    return productPairs.map((pp) => {
      const override = keyValuePairs.find(
        (kp) => kp.key === pp.key && kp.fromProduct
      );
      return override
        ? { ...override, editable: true }
        : { ...pp, editable: false };
    });
  }, [productPairs, keyValuePairs]);

  const combinedPairs = useMemo(
    () => [...customPairs, ...productPairsWithOverrides],
    [customPairs, productPairsWithOverrides]
  );

  useEffect(() => {
    setCombinedPairs(combinedPairs);
  }, [combinedPairs, setCombinedPairs]);

  return null;
};
