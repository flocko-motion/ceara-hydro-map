import React from 'react';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import './App.css';
import 'leaflet/dist/leaflet.css';
import {Map} from "./Map";


function App() {
  return (
      <RecoilRoot>
        <div className="App">
            <CharacterCounter />
            Hello, Map
            <Map/>
        </div>
      </RecoilRoot>
  );
}

function CharacterCounter() {
    return (
        <div>
            <TextInput />
            <CharacterCount />
        </div>
    );
}

function TextInput() {
    const [text, setText] = useRecoilState(textState);

    const onChange = (event: any) => {
        setText(event.target.value);
    };

    return (
        <div>
            <input type="text" value={text} onChange={onChange} />
            <br />
            Echo: {text}
        </div>
    );
}

function CharacterCount() {
    const count = useRecoilValue(charCountState);

    return <>Character Count: {count}</>;
}

const charCountState = selector({
    key: 'charCountState', // unique ID (with respect to other atoms/selectors)
    get: ({get}) => {
        const text = get(textState);

        return text.length;
    },
});

const textState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export default App;
