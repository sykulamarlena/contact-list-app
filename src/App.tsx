import { useEffect, useState } from "react";
import apiData from "./api";
import InfoCard from "../src/components/card/InfoCard";
import Header from "../src/components/header/Header";

type Person = {
  id: string;
  firstNameLastName: string;
  jobTitle: string;
  emailAddress: string;
};

function App() {
  const [data, setData] = useState<Person[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: Person[] = await apiData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData()
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  return (
    <>
      <Header selectedCount={selectedIds.size} />
        <section className="content">
          <div className="list">
            {data.map((personInfo) => (
              <InfoCard
                key={personInfo.id}
                data={personInfo}
                selected={selectedIds.has(personInfo.id)}
                onToggle={() => toggleSelect(personInfo.id)}
              />
            ))}
          </div>
        </section>
    </>
  );
}

export default App;
