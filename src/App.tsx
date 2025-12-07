import { useCallback, useEffect, useMemo, useState } from "react";
import apiData from "./api";
import InfoCard from "./components/card/InfoCard";
import Header from "./components/header/Header";

type Person = {
  id: string;
  firstNameLastName: string;
  jobTitle: string;
  emailAddress: string;
};

enum PageStatus {
  Loading = "loading",
  Error = "error",
  Done = "done",
}

function App() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(-1);
  const [pages, setPages] = useState<Map<number, { status: PageStatus; items: Person[]; error?: string }>>(new Map());

  const fetchData = useCallback(async (pageIndex: number) => {
    setPages((prev) => {
      const copy = new Map(prev);
      copy.set(pageIndex, { status: PageStatus.Loading, items: [] });
      return copy;
    });

    try {
      const response = await apiData();
      setPages((prev) => {
        const copy = new Map(prev);
        copy.set(pageIndex, { status: PageStatus.Done, items: response });
        return copy;
      });
      setCurrentPage(pageIndex);
    } catch (error: any) {
      setPages((prev) => {
        const copy = new Map(prev);
        copy.set(pageIndex, { status: PageStatus.Error, items: [], error: error.message || String(error) });
        return copy;
      });
    }
  }, [setPages, setCurrentPage]);

  useEffect(() => {
    if (currentPage === -1) {
      fetchData(0);
    };
  }, [currentPage, fetchData]);

  const loadMore = useCallback(() => {
    fetchData(currentPage + 1);
  }, [currentPage, fetchData]);

  const retryPage = useCallback((pageIndex: number) => {
    fetchData(pageIndex);
  }, [fetchData]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  }, [setSelectedIds]);

  const fetchedItems = useMemo(() => {
    //sort pages by key (page index) to maintain order
    const pagesArray = Array.from(pages.entries()).sort((a, b) => a[0] - b[0]);
    const items: Person[] = [];

    for (const [, payload] of pagesArray) {
      if (payload.status === PageStatus.Done) {
        items.push(...payload.items)
      }
    };
    return items;
  }, [pages]);

  const isAnyLoading = useMemo(() => {
     const pagesArray = Array.from(pages.values());
    return pagesArray.some((v) => v.status === PageStatus.Loading);
  }, [pages]);

  const renderErrors = useMemo(() => {
    const pagesWithError = Array.from(pages.entries()).filter(([, v]) => v.status === PageStatus.Error);    
    return pagesWithError.map(([pageIndex]) => (
      <div key={pageIndex} className="error-indicator">
        <span>Strona {pageIndex + 1} nie została pobrana.</span>
        <button
          onClick={() => retryPage(pageIndex)}
          className="retry-button"
        >
          Spróbuj ponownie
        </button>
      </div>
    ))
  }, [pages, retryPage]);

  const displayedList = useMemo(() => {
    const selectedItems = fetchedItems.filter((it) => selectedIds.has(it.id));
    const unselectedItems = fetchedItems.filter((it) => !selectedIds.has(it.id));
    return [...selectedItems, ...unselectedItems];
  }, [fetchedItems, selectedIds]);
  return (
    <>
      <Header selectedCount={selectedIds.size} />
        <section className="content">
          <div className="list">
            {displayedList.map((personInfo) => (
              <InfoCard
                key={personInfo.id}
                data={personInfo}
                selected={selectedIds.has(personInfo.id)}
                onToggle={() => toggleSelect(personInfo.id)}
              />
            ))}
          </div>
          {isAnyLoading && (
            <div className="loading-indicator">
              <span className="loader"></span>
            </div>
          )}
          {renderErrors}
          {!isAnyLoading && !renderErrors.length && (
            <button className="load-more-button" onClick={loadMore} disabled={isAnyLoading}>Load More</button>
           )}
        </section>
    </>
  );
}

export default App;
