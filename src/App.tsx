import { useCallback, useEffect, useState } from "react";
import apiData from "./api";
import Header from "./components/header/Header";
import List, { PageState, PageStatus } from "./components/list/List";

function App() {
  const [pages, setPages] = useState<PageState[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  return (
    <>
      <Header selectedCount={selectedIds.size} />
      <section className="content">
        <List
          loadMore={loadMore}
          pages={pages}
          retryPage={retryPage}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
        />
      </section>
    </>
  );
}

export default App;
