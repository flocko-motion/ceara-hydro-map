import React from 'react';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue, useSetRecoilState, RecoilState, SetterOrUpdater,
} from 'recoil';
import './App.css';
import 'leaflet/dist/leaflet.css';
import {Map} from "./Map";
import {fetchGraphQL} from "./lib/db";
import {GeoJSON} from "react-leaflet";
import { GeoJsonProperties } from 'geojson';

const { useState, useEffect } = React;




function App() {
    console.log("START APP")
    const [_, setName] = useState(null);

    // When the component mounts we'll fetch a repository name
    useEffect(() => {
        let isMounted = true;
        fetchGraphQL(`
            query {
                getMunicipalities {
                    municipalities {municipalityId, municipalityShape}
                    success
                    errors
                }
           }`, null)
            .then(response => {
                // Avoid updating state if the component unmounted before the fetch completes
                if (!isMounted) {
                    return;
                }
                const data = response.data;
                setName(data.repository.name);
            }).catch(error => {
            console.error(error);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
      <RecoilRoot>
        <div className="App">
            {/*<CharacterCounter />*/}
            {/*<CurrentUserInfo />*/}
            <h1>CEARA HYDRO MAP - Development</h1>
            <Map/>
        </div>
      </RecoilRoot>
  );
}



function CurrentUserInfo() {
    const userName = useRecoilValue(currentUserNameQuery);
    return <div>Username: {userName}</div>;
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
    const [_, setPoly] = useRecoilState(atomicPoly);
    // const [__, setFeatures] = useRecoilState(atomicFeatures);

    const onChange = (event: any) => {
        setText(event.target.value);
        setPoly(polygon2);

        // fetchMunicipalities(setFeatures);
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

export const textState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

const polygon: [number, number][] = [
    [-3.7, -38.58],
    [-3.9, -38.58],
    [-3.8, -39.58],
]

const polygon2: [number, number][] = [
    [-3.7, -38.58],
    [-3.9, -37.58],
    [-3.8, -39.08],
]

export const atomicPoly = atom({
    key: 'atomicPoly',
    default: polygon
})

let featureCollection1: GeoJSON.FeatureCollection<any> = {
    type: 'FeatureCollection',
    features: [
        {
            type: "Feature",
            properties: {"party": "Democrat"},
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-109.05, 41.00],
                    [-102.06, 40.99],
                    [-102.03, 36.99],
                    [-109.04, 36.99],
                    [-109.05, 41.00]
                ]]
            }
        }
    ]
};

interface Municipality {
    municipalityId: string;
    municipalityShape: string;
}

async function fetchMunicipalities() {
    return await fetchGraphQL(`
            query {
                getMunicipalities {
                    municipalities {municipalityId, municipalityShape}
                    success
                    errors
                }
           }`, null)
        .then(response => {
            // Avoid updating state if the component unmounted before the fetch completes
            console.log("graphql: ", response);
            const data = response.data;
            const res: any = data.getMunicipalities;
            console.log("graphql: ", res);
            if (!(res.success)) throw Error("no success");
            const ms: Municipality[] = res.municipalities;
            let i = 0;
            const theFeatures  = ms.map((m) => {
                const shape = JSON.parse(m.municipalityShape);
                const f: GeoJSON.Feature<any, GeoJsonProperties> = {
                    type: 'Feature',
                    geometry: shape,
                    "properties": {"party": "Republican"},
                }
                return f;
            });
            let featureCollection2: GeoJSON.FeatureCollection<any> = {
                type: 'FeatureCollection',
                features: theFeatures,
            }
            console.log("col: ", featureCollection2);
            return featureCollection2;
        }).catch(error => {
        console.error(error);
    });
}

const currentUserNameQuery = selector({
    key: 'CurrentUserName',
    get: async ({get}) => {
        const response = await fetchMunicipalities();
        console.log("async response: ", response);
        return "blah";
    },
});

export const asyncMunicipalities = selector({
    key: 'asyncMunicipalities',
    get: async ({get}) => {
        return await fetchMunicipalities();
    },
});


export const atomicFeatures = atom({
    key: 'atomicFeatures',
    default: featureCollection1
})

function init() {
    console.log("init");

    console.log("init done");
}
init();


export default App;
