import Controls from "./main/controls";
import Analysis from "./main/analysis";

function App() {
    return (
        <div className="w-screen h-screen flex flex-row p-8 gap-8">
            <Controls/>
            <Analysis/>
        </div>
    );
}

export default App;
