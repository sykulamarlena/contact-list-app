import { useEffect, useState } from "react";
import apiData from "./api";
import PersonInfo from "./PersonInfo";

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
      <div className="selected">Selected contacts: {selectedIds.size}</div>
      <div className="list">
        {data.map((personInfo) => (
          <PersonInfo
            key={personInfo.id}
            data={personInfo}
            selected={selectedIds.has(personInfo.id)}
            onToggle={() => toggleSelect(personInfo.id)}
          />
        ))}
      </div>
    </>
  );
}

export default App;
