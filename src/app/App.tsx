import { useState } from "react";

import { SplitLayout } from "@/shared/ui/Layout";
import { Tab } from "@/shared/ui/Tab";

function App() {
  const [tabValue, setTabValue] = useState<string>("2");

  const handleTabChange = (value: string) => setTabValue(value);

  return (
    <SplitLayout
      fixedSide="left"
      fixedContent={
        <div className="bg-amber-200 p-4">
          <p className="font-medium text-stone-700">Block palette</p>
          <p className="mt-2 text-sm text-stone-500">
            블록을 여기서 드래그하여 캔버스로 놓을 수 있습니다.
          </p>
        </div>
      }
      scrollContent={
        <>
          <div className="flex justify-center p-4">
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
        </>
      }
    />
  );
}

export default App;
