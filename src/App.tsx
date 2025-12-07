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
  Idle = "idle",
  Loading = "loading",
  Error = "error",
  Done = "done",
}

type PageState = {
  status: PageStatus;
  items: Person[];
  error?: string;
};

function App() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(-1);
  const [pages, setPages] = useState<PageState[]>([]);

  const fetchData = useCallback(async (pageIndex: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[pageIndex] = { status: PageStatus.Loading, items: [] };
      return copy;
    });

    try {
      const response = await apiData();
      setPages((prev) => {
        const copy = [...prev];
        copy[pageIndex] = { status: PageStatus.Done, items: response };
        return copy;
      });
      setCurrentPage(pageIndex);
    } catch (error: any) {
      setPages((prev) => {
        const copy = [...prev];
        copy[pageIndex] = { status: PageStatus.Error, items: [], error: error.message };
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
    return pages.flatMap((p) => p.status === PageStatus.Done ? p.items : []);
  }, [pages]);

  const renderErrors = useMemo(() => {
    return pages.map((p, i) =>
      p.status === PageStatus.Error ? (
        <div key={i} className="error-indicator">
          <span>Strona {i + 1} nie została pobrana.</span>
          <button onClick={() => retryPage(i)} className="retry-button">
            Spróbuj ponownie
          </button>
        </div>
      ) : null
    )
  }, [pages, retryPage]);

  const displayedList = useMemo(() => {
    const selectedItems = fetchedItems.filter((it) => selectedIds.has(it.id));
    const unselectedItems = fetchedItems.filter((it) => !selectedIds.has(it.id));
    return [...selectedItems, ...unselectedItems];
  }, [fetchedItems, selectedIds]);

  const isAnyLoading = pages.some((p) => p.status === PageStatus.Loading);
  const isAnyError = pages.some((p) => p.status === PageStatus.Error);
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
          {!isAnyLoading && !isAnyError && (
            <button className="load-more-button" onClick={loadMore}>Load More</button>
           )}
        </section>
    </>
  );
}

export default App;
