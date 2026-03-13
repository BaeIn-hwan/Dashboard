import { useState } from "react";

import { Tab } from "@/shared/ui/Tab";

function App() {
  const [tabValue, setTabValue] = useState<string>("2");

  const handleTabChange = (value: string) => setTabValue(value);

  return (
    <div>
      <div className="flex">
        <div className="sticky top-0 left-0 h-screen w-1/2 bg-amber-200">
          123123
        </div>
        <div className="h-full w-1/2">
          <div className="flex justify-center">
            <Tab
              items={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
              ]}
              defaultValue={tabValue}
              onChange={handleTabChange}
            />
          </div>
          {tabValue === "1" && (
            <div>
              <p>1</p>
            </div>
          )}
          {tabValue === "2" && (
            <div>
              <p>2</p>
            </div>
          )}
          {tabValue === "3" && (
            <div>
              <p>3</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="h-screen">p1</p>
        <p className="h-screen">p2</p>
        <p className="h-screen">p3</p>
        <p className="h-screen">p4</p>
        <p className="h-screen">p5</p>
        <p className="h-screen">p6</p>
        <p className="h-screen">p7</p>
        <p className="h-screen">p8</p>
        <p className="h-screen">p9</p>
      </div>
    </div>
  );
}

export default App;
