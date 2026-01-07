import { useState, useEffect, useRef } from "react";
// const words = [
//   {
//     word: "keyboard",
//     phonetic: "/ki:bc:d/",
//     partOfSpeech1: "noun",
//     partOfSpeech2: "verb",
//     definitions1: [
//       { definition: "set of keys" },
//       { definition: " a component of many instructions" },
//     ],
//     definitions2: [
//       {
//         definition: "To type on a computer keyboard",
//       },
//     ],
//     audio:
//       "https://api.dictionaryapi.dev/media/pronunciations/en/keyboard-us.mp3",
//     source: ["https://en.wiktionary.org/wiki/keyboard"],
//   },
// ];
//import "./tailwind.css";
function App() {
  const [query, setQuery] = useState("keyboard");
  const [words1, setWords1] = useState([]);
  const [font, setFont] = useState("sans-serif");
  const [changeMood, setIsChangeMood] = useState(false)
  const [error,setError] = useState("")
  
  function handleFont(chooseFont) {
    setFont(chooseFont);
  }
  useEffect(
    function () {
      // const controller = new AbortController();
      async function fetchWordMeaning() {
        try {
          const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`,
            // { signal: controller.signal }
          );
          if (res.status === 404) throw new Error(`${query} is not a valid word ❌`);
          if (!res.ok) throw new Error(`Error ${res.status}:server error❌`);
          const data = await res.json();
          setWords1(data);
           setError(null)
          
          
        } catch (err) {
          if(err.message === "Failed to fetch"){
            setError(`Error server error❌`)

          }
          
          setError(err.message)
           console.log(err)
        }
      }
      if(query) fetchWordMeaning();
      // return function () {
      //   controller.abort();
      // };
    },
    [query]
  );

  useEffect(function(){
    document.body.style.backgroundColor = changeMood ? "white" : "black"
  },[changeMood])
  return (
    <div className="app" style={{ fontFamily: font }}>
      <NavBar font={font} setFont={setFont} onHandleFont={handleFont} changeMood={changeMood} setIsChangeMood={setIsChangeMood}/>
      <div className="centeredDiv">
        <SearchInput query={query} setQuery={setQuery} changeMood={changeMood}/>

       {error ? <p style={{color:"white", textAlign:'center'}}>{error}</p>: <WordDefinitionBox words1={words1} changeMood={changeMood} setIsChangeMood={setIsChangeMood}/>}
      </div>
    </div>
  );
}
function NavBar({ font, setFont, onHandleFont, changeMood, setIsChangeMood}) {
  
  function handleSwitch(){
    setIsChangeMood(!changeMood)
  }
  return (
    <div className="navbar">
      <img src="/images/book-icon-gray.svg" alt="book icon" />
      <div style={{ display: "flex" }}>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          onClick={() => onHandleFont(font)}
          className="darkmood-option"
        >
          <option value="sans-serif" >Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Mono</option>
        </select>
        <p
          style={{
            borderLeft: "1px solid gray",
            height: "30px",
            marginLeft:"5px"
            //border: "1px solid blac",
          }}
        ></p>
        <button onClick={handleSwitch} className="switch_btn">

        {changeMood ? <img src="\images\light.svg" alt="light"/> : <img src="\images\moon.svg" alt="dark"/>}
        </button>
      </div>
    </div>
  );
}

function SearchInput({ query, setQuery, changeMood }) {
  function handleSubmit(e) {
    e.preventDefault();
    setQuery("");
  }
  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <input
        type="text"
        className={changeMood ? "inputLightMood" : "inputDarkMood"}
        value={query}
        placeholder="search for any word"
        onChange={(e) => setQuery(e.target.value)
        
        }
      />
      <button className="search_btn" onClick={handleSubmit}>
        <img src="/images/search-purple.svg" alt="search icon" />
      </button>
    </form>
  );
}

function WordDefinitionBox({ words1, changeMood, setIsChangeMood }) {
  return (
    <div>
      {words1.map((word1, index) => (
        <>
          
          <DisplayWord word={word1} changeMood={changeMood}  key={`${word1.word}-${index}`} />
          <DisplayMeaning word={word1} changeMood={changeMood} key={`${word1.word}-meaning-${index}`} />
        </>
      ))}
    </div>
  );
}

function DisplayWord({ word, changeMood}) {
  const audioSrc = word.phonetics?.find((phonetic) => phonetic.audio)?.audio;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const changeTextColor = changeMood ? {color:"black"} : {color:"white"}

  function toggleAudio() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
  }



  return (
    <div className="wordAndAudio">
      <div>
        <h2 style={changeTextColor}>{word.word}</h2>
        <p style={{color:"purple"}}>{word.phonetic}</p>
      </div>
      <div>
        {audioSrc && (
          <div>
            <audio src={audioSrc} ref={audioRef} />
            <button onClick={toggleAudio} className="audioBtn" >
              {isPlaying ? (
                <img src="/images/pause-icon.svg" alt="pause" />
              ) : (
                <img src="/images/play-icon.svg" alt="play" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DisplayMeaning({ word, changeMood }) {
  const changeTextColor = changeMood ? {color:"black"} : {color:"white"}
  return (
    <div>
      <PartOfSpeech word={word} >
        <div className="partOfSpeech">
        <h2 style={changeTextColor}>{word.meanings[0]?.partOfSpeech}</h2>
        <p className="line"></p>
        </div>
        <p style={{color:"gray", fontSize:"14px"}}>Meaning</p>
      </PartOfSpeech>
      <ul>
        {word.meanings[0]?.definitions.map((definition,index) => (
          <ListOfMeaning
            definition={definition}
            changeMood={changeMood}
            key={`${definition.definition}-${index}`}
          />
        ))}
      </ul>

      <PartOfSpeech word={word}>
        <div className="partOfSpeech">
        <h2 style={changeTextColor}>{word.meanings[1]?.partOfSpeech}</h2>
        <p className="line"></p>
        </div>
         <p style={{color:"gray"}}>Meaning</p>
        
      </PartOfSpeech>
      <ul>
        {word.meanings[1]?.definitions.map((definition,index) => (
          <ListOfMeaning
            definition={definition}
            changeMood={changeMood}
            key={`${definition.definition}-${index}`}
          />
        ))}
      </ul>
    </div>
  );
}
function PartOfSpeech({ children }) {
  return <>{children}</>;
}
function ListOfMeaning({ definition, changeMood }) {
  return <li className={changeMood ? "listStyleMode" : "listStyle"}>{definition.definition}</li>;
}
export default App;


