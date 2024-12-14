import Button from "./atoms/button";

function App() {
    return (
        <Button
            label="Click me"
            icon="fa fa-plus"
            onClick={() => console.log("Button clicked!")}
        />
    );
}

export default App;
