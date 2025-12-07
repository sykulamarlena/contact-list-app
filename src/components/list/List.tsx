import { useMemo } from "react";
import InfoCard from "../card/InfoCard";

export type Person = {
  id: string;
  firstNameLastName: string;
  jobTitle: string;
  emailAddress: string;
};

export enum PageStatus {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
  Done = "done",
}

export type PageState = {
  status: PageStatus;
  items: Person[];
  error?: string;
};

type ListProps = {
  loadMore: () => void;
  pages: PageState[];
  retryPage: (pageIndex: number) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
};

function List({ loadMore, pages, retryPage, selectedIds, toggleSelect }: ListProps) {
  const isAnyLoading = pages.some((p) => p.status === PageStatus.Loading);
  const isAnyError = pages.some((p) => p.status === PageStatus.Error);

  const fetchedItems = useMemo(() => {
    return pages.flatMap((p) => p.status === PageStatus.Done ? p.items : []);
  }, [pages]);

  const displayedList = useMemo(() => {
    const selectedItems = fetchedItems.filter((it) => selectedIds.has(it.id));
    const unselectedItems = fetchedItems.filter((it) => !selectedIds.has(it.id));
    return [...selectedItems, ...unselectedItems];
  }, [fetchedItems, selectedIds]);

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

  return (
    <>
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
    </>
  );
}

export default List;